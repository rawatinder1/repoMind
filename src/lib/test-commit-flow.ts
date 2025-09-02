// Create test-commit-flow.ts
import { getCommitHashes } from "@/lib/github";
import { aisummariseCommit } from "@/lib/gemini";
import axios from 'axios';

async function testCommitFlow() {
  console.log("🧪 Testing complete commit flow...");
  
  const testGithubUrl = "https://github.com/moeru-ai/airi";
  
  try {
    // Step 1: Test getting commits
    console.log("1️⃣ Testing getCommitHashes...");
    const commits = await getCommitHashes(testGithubUrl);
    console.log(`✅ Got ${commits.length} commits`);
    
    if (commits.length === 0) {
      console.log("❌ No commits found!");
      return;
    }
    
    // Step 2: Test getting diff for first commit
    const firstCommit = commits[0];
    console.log(`2️⃣ Testing diff fetch for commit: ${firstCommit!.commitHash.substring(0, 8)}`);
    
    const diffUrl = `${testGithubUrl}/commit/${firstCommit!.commitHash}.diff`;
    console.log(`📡 Fetching: ${diffUrl}`);
    
    const { data: diff } = await axios.get(diffUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3.diff',
        'User-Agent': 'neuron-repo-app'
      }
    });
    
    console.log(`✅ Diff fetched, length: ${diff?.length}`);
    console.log(`📄 Diff preview:\n${diff?.substring(0, 500)}...`);
    
    // Step 3: Test AI summarization
    console.log("3️⃣ Testing AI summarization...");
    const summary = await aisummariseCommit(diff);
    
    console.log(`✅ Final summary:`, {
      type: typeof summary,
      length: summary?.length,
      content: summary
    });
    
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
testCommitFlow();