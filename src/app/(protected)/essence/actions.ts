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
  summary: string;
  fileName: string; 
};

export async function autoDoc(projectId: string, prompt?: string) {
    const stream = createStreamableValue<string>();
    let summaries: Row[] = [];
    try{
        summaries = await db.sourceCodeEmbedding.findMany({
        where:{
            projectId
        },
        select:{
            summary:true,
            fileName:true
        }
    })
   
    
    }catch(err){
        console.error('Error fetching file summaries:', err);
    }
     

    (async () => {
        try {

          
          const context = summaries.map(s => `File: ${s.fileName}\nContent: ${s.summary}`).join('\n\n');
          console.log("Context length:", context.length);
          console.log("Context :", context);
    
          if (!context.trim()) {
            stream.update('No relevant code found in this project for your question. Please try a different question or make sure the project has been indexed.');
            stream.done();
            return;
          }
    

        const { textStream } = await streamText({
        model: google("gemini-2.0-flash"),
        prompt: `You are a senior software architect and expert technical writer.  
        Your task is to generate **comprehensive professional documentation** for the given codebase using only the provided summaries.  

        ---  

        ### Rules  
        1. **Grounding**  
        - Use ONLY the information in the "Context Block" (summaries of files).  
        - Do not invent or assume details that are not explicitly present.  

        2. **Documentation Style**  
        - Structure the output like professional software documentation.  
        - Sections should include:  
            - **Overview**: High-level description of the system.  
            - **Modules/Components**: List each key file/module with its purpose.  
            - **Interactions**: Explain how components interact, based strictly on summaries.  
            - **Usage/Flow**: Describe important workflows or data flows if present.  
        - Be concise, clear, and professional.  

        3. **Context Structure**  
        - The context is provided as a list of file summaries in the format:  
            \`File: <fileName>\nContent: <summary>\`  

        4. **Clarity**  
        - Use bullet points, headings, and fenced code blocks for readability.  
        - Highlight filenames or modules when describing them.  

        ---  

        ### Context Block  
        ${context}  

        ---  
        ### user Prompt
        ${prompt ? `In addition, consider this specific prompt from the user and this is more importannt weigh in this prompt heavily even more so than what was said previously: "${prompt}"` : 'No additional user prompt provided.'}

        ### Task  
        Generate professional documentation for the codebase based on the summaries above.`  
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
        
      };
}



export async function generateMermaidDiagram(projectId: string, prompt?: string) {
    let summaries: Row[] = [];
    
    try {
        summaries = await db.sourceCodeEmbedding.findMany({
            where: {
                projectId
            },
            select: {
                summary: true,
                fileName: true
            }
        });
    } catch (err) {
        console.error('Error fetching file summaries:', err);
        return { mermaidCode: null, error: 'Error fetching file summaries' };
    }

    try {
        const context = summaries.map(s => `File: ${s.fileName}\nContent: ${s.summary}`).join('\n\n');
        console.log("Context length:", context.length);

        if (!context.trim()) {
            return { mermaidCode: null, error: 'No relevant code found in this project. Please make sure the project has been indexed.' };
        }

        const { text } = await streamText({
            model: google("gemini-2.0-flash"),
            prompt: `You are a senior software architect and expert in system design diagrams.
Your task is to generate a **Mermaid.js sequence diagram** that visualizes the interactions and flow between components in the given codebase.

---

### Rules
1. **Grounding**
   - Use ONLY the information provided in the "Context Block" (summaries of files).
   - Do not invent interactions that are not explicitly mentioned or implied by the summaries.

2. **Mermaid Sequence Diagram Format**
   - Generate ONLY valid Mermaid.js sequence diagram syntax.
   - DO NOT include \`\`\`mermaid code fences
   - Begin directly with: sequenceDiagram
   - Use proper participant declarations: participant A as ActorName
   - Show interactions with arrows: A->>B: Message
   - Include notes when helpful: Note over A,B: Description
   - Return ONLY the raw mermaid syntax, no markdown formatting

3. **Diagram Focus**
   - Focus on the most important interactions and data flows.
   - Show key components as participants (files, modules, services, etc.).
   - Illustrate the sequence of operations, API calls, data processing, etc.
   - Keep it clean and readable - don't overcrowd with every single file.

4. **Component Identification**
   - Identify key actors from file summaries (controllers, services, components, etc.).
   - Show how data flows between these components.
   - Include external systems if mentioned (databases, APIs, etc.).

---

### Context Block
${context}

---

### User Prompt
${prompt ? `Focus on this specific aspect: "${prompt}"` : 'Generate a comprehensive sequence diagram showing the main application flow.'}

### Task
Generate a Mermaid.js sequence diagram that visualizes the key interactions and flow in this codebase. Return ONLY the raw mermaid syntax without any code fences or markdown formatting.`
        });

        const fullText = await text;
        return { mermaidCode: fullText, error: null };

    } catch (err: any) {
        console.error('Error generating mermaid diagram:', err);
        return { mermaidCode: null, error: `Error generating diagram: ${err?.message ?? String(err)}` };
    }
}

