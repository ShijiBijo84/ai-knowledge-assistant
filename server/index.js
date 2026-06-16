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


let vectorStore;
(async () => { vectorStore = await createVectorStore() })()


app.post('/api/chat', async (req, res) => {
    try {
        const { history, userMessage } = req.body

        if (!userMessage) return res.status(400).json({ error: "Message required" });

        const docs = await search(vectorStore, userMessage.content)
        const context = docs.map(d => d.text).join("\n\n")
        const messages = [...(history || []), userMessage]
        const apiResponse = await client.chat.completions.create(
            {
                model: "openai/gpt-oss-120b",
                messages: [{
                    role: "system",
                    content: `Answer using this context:\n\n${context}`,
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