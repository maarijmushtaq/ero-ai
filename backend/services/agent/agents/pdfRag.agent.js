import fs from 'fs'
import {PDFParse }from 'pdf-parse' 
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { vectorStore } from '../config/vectorDb.js'
import doc from 'pdfkit'
import { getModel } from '../config/llmModels.js'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'



export const pdfRag = async (state) => {
    try {
        const buffer = fs.readFileSync(state.file.path)

        const pdf = new PDFParse({
            data: buffer
        })

        const result = await pdf.getText()
        const text = result.text

        // 1️⃣ Is PDF text actually being extracted?
        console.log("\n===== EXTRACTED PDF TEXT =====")
        console.log(text)
        console.log("TEXT LENGTH:", text.length)


        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200
        })

        const docs = await splitter.createDocuments([text])

        // 2️⃣ Did chunking work?
        console.log("\n===== CHUNKS =====")
        console.log("NUMBER OF CHUNKS:", docs.length)
        console.log("FIRST CHUNK:", docs[0]?.pageContent)


        const collectionName = `pdf-${Date.now()}`

        const store = await vectorStore(docs, collectionName)


        // 3️⃣ What question are we searching for?
        console.log("\n===== USER QUESTION =====")
        console.log(state.prompt)


        const relevantDocs = await store.similaritySearch(
            state.prompt,
            5
        )

        // 4️⃣ MOST IMPORTANT LOG
        console.log("\n===== RETRIEVED DOCUMENTS =====")

        relevantDocs.forEach((doc, index) => {
            console.log(`\n--- RESULT ${index + 1} ---`)
            console.log(doc.pageContent)
        })


        const context = relevantDocs
            .map(d => d.pageContent)
            .join('\n\n')

        // 5️⃣ What exactly are we giving the LLM?
        console.log("\n===== FINAL CONTEXT =====")
        console.log(context)


        const llm = await getModel('pdf-rag')

        const messages = [
            new SystemMessage(`
                You are NexoraAI PDF Assistant.

                Rules:

                - Answer ONLY from the uploaded PDF.
                - Never make up information.

                - If the answer is not present in the PDF, reply:
                "I couldn't find this information in the uploaded PDF."

                - Use Markdown formatting.
            `),

            new HumanMessage(`
                Context:
                ${context}

                Question:
                ${state.prompt}
            `)
        ]

        const response = await llm.invoke(messages)

        console.log("\n===== LLM RESPONSE =====")
        console.log(response.content)


        return {
            ...state,
            aiResponse: response.content
        }

    } catch (err) {

        console.log("PDF RAG ERROR:", err)

        return {
            ...state,
            aiResponse: 'Failed to analyze pdf'
        }

    } finally {
        fs.unlinkSync(state.file.path)
    }
}