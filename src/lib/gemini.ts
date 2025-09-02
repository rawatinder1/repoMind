import { GoogleGenerativeAI } from "@google/generative-ai";
import {Document} from "@langchain/core/documents"
import OpenAI from 'openai';
// Debug your API key


console.log(" GOOGLE_GEMINI_API_KEY exists:", !!process.env.GOOGLE_GEMINI_API_KEY);

console.log(" API Key first 10 chars:", process.env.GOOGLE_GEMINI_API_KEY?.substring(0, 10));

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({

  model: "gemini-2.0-flash",

});

export const aisummariseCommit = async (diff: string) => {
  console.log(" aisummariseCommit called");
  console.log(" Diff length:", diff?.length || 0);
  console.log(" Diff preview:", diff?.substring(0, 200) + "...");
  
  if (!diff || diff.trim() === '') {
    console.log(" Empty diff provided to AI");
    return "No diff content to summarize";
  }
  
  try {
    console.log(" Calling Gemini API...");
    
    const response = await model.generateContent(`
You are an expert programmer, and you are trying to summarize a git diff.

Reminders about the git diff format:
For every file, there are a few metadata lines, like (for example):

\`\`\`
diff --git a/lib/index.js b/lib/index.js
index aadf691..bfef803 100644
--- a/lib/index.js
+++ b/lib/index.js
\`\`\`

This means that 'lib/index.js' was modified in this commit. Note that this is only an example.
Then there is a specifier of the lines that were modified.
A line starting with '+' means it was added.
A line starting with '-' means that line was deleted.
A line that starts with neither '+' nor '-' is code given for context and better understanding.
It is not part of the diff.

EXAMPLE SUMMARY COMMENTS:
\`\`\`
- Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/constants.ts]
- Fixed a typo in the github action name [.github/workflows/gpt-commit-summarizer.yml]
- Moved the \`octokit\` initialization to a separate file [src/octokit.ts], [src/index.ts]
- Added an OpenAI API for completions [packages/utils/apis/openai.ts]
- Lowered numeric tolerance for test files
\`\`\`

Most commits will have fewer comments than this example list.
The last comment does not include the file names,
because there were more than two relevant files in the hypothetical commit.
Do not include parts of the example in your summary.
It is given only as an example of appropriate comments.

Please summarise the following diff file:

${diff}
    `);
    
    console.log(" Raw response received from Gemini");
    
    const text = response.response.text();
    console.log(" AI Summary result:", {
      type: typeof text,
      length: text?.length || 0,
      content: text
    });
    
    return text;
  } catch (error) {
    console.error(" Error in aisummariseCommit:", error);
    
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    return "Failed to generate AI summary";
  }
};

export async function summariseCode(doc:Document) {
  console.log("getting summary for",doc.metadata.source);
  const code=doc.pageContent.slice(0,10000); //limit to 10000 character sad face :(
  const response=await model.generateContent([
    `

You are a coding assistant that summarizes code files for developers.  
Your job is to explain the file’s purpose, structure, and key logic clearly and concisely.  

Objective
---------
- Provide a high-level summary of the file.  
- Highlight its main purpose, important functions/classes, and how it fits into a larger project.  
- Explain dependencies, imports, and external APIs if relevant.  
- Do not guess or invent functionality not visible in the file.  


Limits
------
- Do not hallucinate missing pieces of code.  
- If parts of the file depend on other files, mention the dependency but do not fabricate details about them.  
- If the file is mostly boilerplate or trivial, say so briefly.  

Output Format
-------------
1. **High-level purpose** (1–2 sentences).  
2. **Key elements** (bullet list of functions/classes/exports).  
3. **Data flow / usage notes** (short explanation).  
4. **Dependencies / external usage** (if any).  
5. **Overall role in the project** (1–2 sentences).  
here is the code:
${code}
    RESTRICT THE SUMMARY TO MAX OF 100 words.
`

  ]);

  return response.response.text();
}

/*

export async function summariseCode(doc: Document) {
  console.log("getting summary for", doc.metadata.source);
  const code = doc.pageContent.slice(0, 10000); // limit to 10000 characters
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // or "gpt-4o-mini" for faster/cheaper
      messages: [
        {
          role: "user",
          content: `You are a coding assistant that summarizes code files for developers.
Your job is to explain the file's purpose, structure, and key logic clearly and concisely.

Objective
---------
- Provide a high-level summary of the file.
- Highlight its main purpose, important functions/classes, and how it fits into a larger project.
- Explain dependencies, imports, and external APIs if relevant.
- Do not guess or invent functionality not visible in the file.

Limits
------
- Do not hallucinate missing pieces of code.
- If parts of the file depend on other files, mention the dependency but do not fabricate details about them.
- If the file is mostly boilerplate or trivial, say so briefly.

Output Format
-------------
1. **High-level purpose** (1–2 sentences).
2. **Key elements** (bullet list of functions/classes/exports).
3. **Data flow / usage notes** (short explanation).
4. **Dependencies / external usage** (if any).
5. **Overall role in the project** (1–2 sentences).

here is the code: ${code}

RESTRICT THE SUMMARY TO MAX OF 100 words.`
        }
      ],
      temperature: 0.2,
      max_tokens: 200
    });
    
    return response.choices[0]?.message?.content || "No summary generated";
  } catch (error) {
    console.error("Error in summariseCode:", error);
    return "Failed to generate code summary";
  }
} 
*/


export async function generateEmbedding(summary:string){
   try{
    const model=genAI.getGenerativeModel({
    model:"text-embedding-004"
  })
  const result=await model.embedContent(summary);
  const embedding=result.embedding;
  return embedding.values
   }catch(e){
     return [];
   }
}
//console.log(await generateEmbedding("hello world"))