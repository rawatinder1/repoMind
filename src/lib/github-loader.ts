import {GithubRepoLoader} from '@langchain/community/document_loaders/web/github'
import { summariseCode } from './gemini';
import {Document} from '@langchain/core/documents'
import { promise } from 'zod';
import { generateEmbedding } from './gemini';
import { db } from '@/server/db';

const getBranch = async (url: string, token: string) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return 'main';
    try {
        const res = await fetch(`https://api.github.com/repos/${match[1]}/${match[2]}`, {headers: {Authorization: `Bearer ${token}`}});
        const data = await res.json();
        if(res.ok){
    console.log('branch detected', data.default_branch);
    return data.default_branch ?? 'main';
} else {
    return 'main'; // Add this
}
    } catch { return 'main'; }
};
export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
    const token = githubToken ?? process.env.GITHUB_TOKEN;
    
    if (!token) {
        console.warn('No GitHub token provided. This may result in rate limiting issues.');
    }
    const currentBranch = await getBranch(githubUrl,token ?? '');
    const cleanUrl = githubUrl.replace('.git', '');
    const loader = new GithubRepoLoader(cleanUrl, {
        accessToken: token ?? '',
        branch: currentBranch,
        recursive: true, // Start with non-recursive to avoid getting stuck
        maxConcurrency: 5, // Reduce concurrency to avoid overwhelming
        ignoreFiles: [
            'node_modules/**/*',     // Skip node_modules entirely
            '*.lock',
            '*.lockb', 
            'package-lock.json',
            'yarn.lock',
            'pnpm-lock.yaml',
            'bun.lockb',
            '.git/**/*',            
            'dist/**/*',             
            'build/**/*',
            '*.log',
            '*.tmp'
        ],
        unknown:'warn'
    });
    console.log(`Loading documents from ${githubUrl} on branch ${currentBranch}...`);
    const docs = await loader.load();
    console.log(`Loaded ${docs.length} documents from ${githubUrl}`);
    return docs;           
}



function generateCuid(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `c${timestamp}${randomPart}`.substring(0, 25);
}
// Updated Solution with Batching
export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
    const token = githubToken ?? process.env.GITHUB_TOKEN;
    
    const docs = await loadGithubRepo(githubUrl, token);
    const allEmbeddings = await generateEmbeddings(docs);
    
    // Batch database insertions
    const BATCH_SIZE = 2
    const batches = [];
    
    for (let i = 0; i < allEmbeddings.length; i += BATCH_SIZE) {
        batches.push(allEmbeddings.slice(i, i + BATCH_SIZE));
    }
    
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        console.log(`Processing batch ${batchIndex + 1} of ${batches.length} (${batch!.length} items)`);
        
        await Promise.allSettled(batch!.map(async (embedding, index) => {
            const globalIndex = batchIndex * BATCH_SIZE + index;
            console.log(`Processing ${globalIndex + 1} of ${allEmbeddings.length}`);
            
            if (!embedding) return;
            
            try {
                const id = generateCuid();
                const vectorString = `[${embedding.embedding.join(',')}]`;
                
                await db.$executeRaw`
                    INSERT INTO "SourceCodeEmbedding" (
                        "id", 
                        "summary", 
                        "sourceCode", 
                        "fileName", 
                        "projectId", 
                        "summaryEmbedding"
                    ) VALUES (
                        ${id},
                        ${embedding.summary},
                        ${embedding.sourceCode},
                        ${embedding.fileName},
                        ${projectId},
                        ${vectorString}::vector
                    )
                `;
                
                console.log(`Successfully processed embedding ${globalIndex + 1}`);
            } catch (error) {
                console.error(`Error processing embedding ${globalIndex + 1}:`, error);
            }
        }));
        
        // Add delay between batches to be nice to the database
        if (batchIndex < batches.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
};

async function generateEmbeddings(docs: Document[]) {
    const BATCH_SIZE = 50; // Smaller batch size for API calls
    const DELAY_MS = 1000; // 1 second delay between batches
    const results = [];
    
    console.log(`Processing ${docs.length} documents in batches of ${BATCH_SIZE}`);
    
    for (let i = 0; i < docs.length; i += BATCH_SIZE) {
        const batch = docs.slice(i, i + BATCH_SIZE);
        const batchIndex = Math.floor(i / BATCH_SIZE);
        const totalBatches = Math.ceil(docs.length / BATCH_SIZE);
        
        console.log(`Processing batch ${batchIndex + 1} of ${totalBatches} (${batch.length} documents)`);
        
        const batchResults = await Promise.all(batch.map(async (doc, index) => {
            const globalIndex = i + index;
            console.log(`  Processing document ${globalIndex + 1}/${docs.length}: ${doc.metadata.source}`);
            
            try {
                const summary = await summariseCode(doc);
                console.log(`  Summary length: ${summary?.length || 0}`);
                console.log(`  Summary preview: ${summary?.substring(0, 100)}...`);
                
                const embedding = await generateEmbedding(summary);
                
                return {
                    summary,
                    embedding,
                    sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
                    fileName: doc.metadata.source
                };
            } catch (error) {
                console.error(`  Error processing document ${globalIndex + 1}:`, error);
                return null;
            }
        }));
        
        results.push(...batchResults);
        
        // Add delay between batches to respect API rate limits
        if (i + BATCH_SIZE < docs.length) {
            console.log(`  Waiting ${DELAY_MS}ms before next batch...`);
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        }
    }
    
    return results;
}