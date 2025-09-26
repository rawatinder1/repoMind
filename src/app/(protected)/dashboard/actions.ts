'use server';

import { streamText } from 'ai';
import { createStreamableValue } from '@ai-sdk/rsc';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateEmbedding } from '@/lib/gemini';
import { db } from '@/server/db';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY!,
});

type Row = {
  fileName: string;
  sourceCode: string;
  summary: string;
  similarity: number;
};

export async function askQuestion(projectId: string, question: string) {
  const stream = createStreamableValue<string>();
  
  // Get file references first (this is fast)
  let fileReferences: Row[] = [];
  
  try {
    const queryVector = await generateEmbedding(question);
    const vectorQuery = JSON.stringify(queryVector);

    fileReferences = await db.$queryRaw<Row[]>`
      SELECT
        "fileName",
        "sourceCode", 
        "summary",
        1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS "similarity"
      FROM "SourceCodeEmbedding"
      WHERE "projectId" = ${projectId}
        AND 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5
      ORDER BY "similarity" DESC
      LIMIT 10;
    `;
  } catch (err) {
    console.error('Error fetching file references:', err);
  }

  // Start streaming in the background
  (async () => {
    try {
      let context = '';
      for (const doc of fileReferences) {
        context += `Filename: ${doc.fileName}\nSummary: ${doc.summary}\nSource Code: ${doc.sourceCode}\n\n---\n\n`;
      }

      if (!context.trim()) {
        stream.update('No relevant code found in this project for your question. Please try a different question or make sure the project has been indexed.');
        stream.done();
        return;
      }

      const { textStream } = await streamText({
        model: google('gemini-2.0-flash'),
        prompt: `You are a senior software engineer and expert code reviewer.

Your task is to answer the user's programming question strictly based on the provided context.

Follow these rules carefully:

1. **Grounding**: Use ONLY the information in the "Context Block".
   - Do not invent details or speculate beyond what is given.
   - If the context is missing relevant information, explicitly say: "I don't know based on the available context."

2. **Clarity**: Provide a clear, concise, and technically accurate explanation.
   - Use step-by-step reasoning where helpful.
   - Highlight relevant filenames and code snippets directly from the context.

3. **Style**:
   - Write in a professional, instructive tone.
   - Format code in fenced blocks (\`\`\`language … \`\`\`).
   - Use bullet points or numbered steps for clarity if appropriate.

---

### Context Block
${context}

---

### User Question
${question}

---

### Final Instructions
Provide the **best possible answer** using the context.
If additional information is needed that is not in the context, state clearly that you cannot answer beyond the provided context.`
      });

      for await (const chunk of textStream) {
        stream.update(chunk);
      }

      stream.done();
    } catch (err: any) {
      console.error('Error in askQuestion:', err);
      stream.update(`Sorry, something went wrong: ${err?.message ?? String(err)}`);
      stream.done();
    }
  })();

  // Return immediately with file references and streaming output
  return {
    output: stream.value,
    fileReferences: fileReferences
  };
}