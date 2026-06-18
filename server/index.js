import express from "express";
import cors from "cors";
import path from "path"
import { createVectorStore, search } from "./rag.js";
import { client } from "./client.js";

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000

const __dirName = path.resolve()
app.use(express.static(path.join(__dirName, "../client/dist")))

app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirName, "../client/dist/index.html"))
})

//---------------------------------
// Vector Store initialization
//---------------------------------

let vectorStore = null;
console.log("Vector Store Loading...")
vectorStore = await createVectorStore()
console.log("Vector Store Loaded")


app.post('/api/chat', async (req, res) => {
    try {
        const { history = [], userMessage } = req.body

        if (!userMessage?.content?.trim()) return res.status(400).json({ error: "Message required" });

        const docs = await search(vectorStore, userMessage.content)

        const context = docs.map(d => d.text).join("\n\n")

        const messages = [...(history || []), userMessage]

        const systemPrompt = `
You are a recipe assistant.

Always respond in VALID MARKDOWN.

FORMAT:

**Recipe:** <name>

**Cooking Time:** <time>

**Ingredients**
Use a Markdown list.

**Instructions**
Use a numbered list.

Do NOT use any special symbols like "-" manually.
Let Markdown format lists naturally.

Knowledge Base:
${context}
`;
        const apiResponse = await client.chat.completions.create(
            {
                model: "openai/gpt-oss-120b",
                temperature: 0,
                messages: [{
                    role: "system",
                    content: systemPrompt,
                }, ...messages]
            }
        )
        const assistantReply = apiResponse.choices[0].message
        res.status(200).json({ response: assistantReply.content, reasoning_details: assistantReply.reasoning_details })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: "Something went wrong" })
    }
})


app.listen(PORT, () => console.log("Server listening to port 3000"))