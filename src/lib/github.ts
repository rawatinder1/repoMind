import { db } from "@/server/db";
import { Octokit } from "octokit";
import axios from 'axios'
import { aisummariseCommit } from "./gemini";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type Response = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

export const getCommitHashes = async (githubUrl: string, githubToken?: string): Promise<Response[]> => {
  const token = githubToken || process.env.GITHUB_TOKEN;
  const oktokitInstance = githubToken ? new Octokit({ auth: token }) : octokit;

  const cleanUrl = githubUrl.replace('.git', '');
  let [owner, repo] = cleanUrl.split("/").slice(-2);
  
  if (repo?.endsWith('.git')) {
    repo = repo.slice(0, -4);
  }

  const { data } = await oktokitInstance.rest.repos.listCommits({
    owner: owner!,
    repo: repo!,
  });

  const sortedCommits = data.sort((a: any, b: any) => 
    new Date(b.commit.author?.date || '').getTime() - new Date(a.commit.author?.date || '').getTime()
  );

  return sortedCommits.slice(0, 15).map((commit: any) => ({
    commitHash: commit.sha as string,
    commitMessage: commit.commit?.message ?? "",
    commitAuthorName: commit.commit?.author?.name ?? "",
    commitAuthorAvatar: commit?.author?.avatar_url ?? "",
    commitDate: commit.commit?.author?.date ?? ""
  }));
};

export const pollCommits = async (projectId: string, githubToken?: string) => {
    const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
    const commitHashes = await getCommitHashes(githubUrl, githubToken);
    const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes);
    
    if (unprocessedCommits.length === 0) {
        return { count: 0 };
    }
    
    const processedCommits = [];
    
    for (let i = 0; i < unprocessedCommits.length; i++) {
        const commit = unprocessedCommits[i];
        
        try {
            const summary = await summariseCommit(githubUrl, commit!.commitHash, githubToken);
            
            processedCommits.push({
                projectId: projectId,
                commitHash: commit!.commitHash,
                commitMessage: commit!.commitMessage,
                commitAuthorName: commit!.commitAuthorName,
                commitAuthorAvatar: commit!.commitAuthorAvatar,
                commitDate: commit!.commitDate,
                summary: summary || "Failed to generate summary"
            });
            
        } catch (error) {
            processedCommits.push({
                projectId: projectId,
                commitHash: commit!.commitHash,
                commitMessage: commit!.commitMessage,
                commitAuthorName: commit!.commitAuthorName,
                commitAuthorAvatar: commit!.commitAuthorAvatar,
                commitDate: commit!.commitDate,
                summary: "Error generating summary"
            });
        }
    }
    
    const result = await db.commit.createMany({
        data: processedCommits
    });
    
    return result;
}

async function summariseCommit(githubUrl: string, commitHash: string, githubToken?: string) {
    const token = githubToken || process.env.GITHUB_TOKEN;
    const cleanUrl = githubUrl.replace('.git', '');
    const [owner, repo] = cleanUrl.split("/").slice(-2);
    
    if (githubToken) {
        const oktokitInstance = new Octokit({ auth: token });
        
        try {
            const { data } = await oktokitInstance.rest.repos.getCommit({
                owner: owner!.replace('.git', ''),
                repo: repo!.replace('.git', ''),
                ref: commitHash,
                mediaType: {
                    format: 'diff'
                }
            });
            
            if (!data || data.toString().trim() === '') {
                return "No changes detected in this commit";
            }
            
            const summary = await aisummariseCommit(data.toString());
            return summary || "Unable to generate summary";
        } catch (apiError) {
            // Fall through to axios method
        }
    }
    
    const diffUrl = `${cleanUrl}/commit/${commitHash}.diff`;
    
    const { data } = await axios.get(diffUrl, {
        headers: {
            'Accept': 'application/vnd.github.v3.diff',
            'User-Agent': 'neuron-repo-app',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    });
    
    if (!data || data.trim() === '') {
        return "No changes detected in this commit";
    }
    
    const summary = await aisummariseCommit(data);
    return summary || "Unable to generate summary";
}

async function fetchProjectGithubUrl(projectId: string) {
    const project = await db.project.findUnique({
        where: { id: projectId },
        select: {
            githubUrl: true
        }
    })
    if (!project?.githubUrl) {
        throw new Error("Project has no github url")
    }
    return { project, githubUrl: project.githubUrl }
}

async function filterUnprocessedCommits(projectId: string, commitHashes: Response[]) {
    const processedCommits = await db.commit.findMany({
        where: { projectId }
    });
    const unprocessedCommits = commitHashes.filter((commit) => 
        !processedCommits.some((processedCommit) => 
            processedCommit.commitHash === commit.commitHash
        )
    );
    return unprocessedCommits;
}