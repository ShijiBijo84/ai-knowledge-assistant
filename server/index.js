import express, { response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";


dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())


/* default baseURL is ://api.openai.com/v1
and we are overriding here */

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY
})

app.post('/api/chat', async (req, res) => {
    try {
        const { history, userMessage } = req.body

        if (!userMessage) return res.status(400).json({ error: "Message required" });
        const messages = [...(history || []), userMessage]
        const apiResponse = await client.chat.completions.create(
            {
                model: "openai/gpt-oss-120b",
                messages,
            }
        )
        const assistantReply = apiResponse.choices[0].message
        res.status(200).json({ response: assistantReply.content, reasoning_details: assistantReply.reasoning_details })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: "Something went wrong" })
    }
})


app.listen(3000, () => console.log("Server listening to port 3000"))