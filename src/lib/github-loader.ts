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
    return data.default_branch || 'main';
} else {
    return 'main'; // Add this
}
    } catch { return 'main'; }
};
export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
    const token = githubToken || process.env.GITHUB_TOKEN;
    
    if (!token) {
        console.warn('No GitHub token provided. This may result in rate limiting issues.');
    }
    const currentBranch = await getBranch(githubUrl,token || '');
    const cleanUrl = githubUrl.replace('.git', '');
    const loader = new GithubRepoLoader(cleanUrl, {
        accessToken: token || '',
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
            '.git/**/*',             // Skip git files
            'dist/**/*',             // Skip build directories
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

// Updated Solution 1 with better ID generation:
export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
    const token = githubToken || process.env.GITHUB_TOKEN;
    
    const docs = await loadGithubRepo(githubUrl, token);
    const allEmbeddings = await generateEmbeddings(docs);
    
    await Promise.allSettled(allEmbeddings.map(async (embedding, index) => {
        console.log(`processing ${index} of ${allEmbeddings.length}`)
        if (!embedding) return
   
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
            
            console.log(`Successfully processed embedding ${index}`);
        } catch (error) {
            console.error(`Error processing embedding ${index}:`, error);
        }
    }));
}
        


async function generateEmbeddings(docs: Document[]) {
    return await Promise.all(docs.map(async doc => {
        const summary = await summariseCode(doc);
        console.log(" Summary length:", summary?.length || 0);
        console.log(" Summary preview:", summary?.substring(0, 200) + "...");
        const embedding = await generateEmbedding(summary);
        return {
            summary,
            embedding,
            
            sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
            fileName: doc.metadata.source
        }
    }))
}

