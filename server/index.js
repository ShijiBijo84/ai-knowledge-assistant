import express from "express";
import cors from "cors";
import path from "path";

import { createVectorStore, search } from "./rag.js";
import { client } from "./client.js";
import { inferFilters } from "./utilities/inferFilters.js";
import { RECIPE_ASSISTANT_PROMPT } from "./prompts/recipeAssistantPrompt.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Static frontend

const __dirName = path.resolve();
app.use(express.static(path.join(__dirName, "../client/dist")));

app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirName, "../client/dist/index.html"));
});


// Vector store init

let vectorStore = null;

console.log("Vector Store Loading...");
vectorStore = await createVectorStore();
console.log("Vector Store Loaded");


// CHAT API

app.post("/api/chat", async (req, res) => {
    try {
        const { history = [], userMessage, filters } = req.body;

        if (!userMessage?.content?.trim()) {
            return res.status(400).json({ error: "Message required" });
        }

        const query = userMessage.content;


        // 1. FILTER INFERENCE (separate reasoning step)

        const recipeFilters = await inferFilters(query, history, filters);

        // 2. VECTOR SEARCH WITH FILTERS

        const docs = await search(
            vectorStore,
            query,
            5,
            recipeFilters
        );


        // 3. BUILD CONTEXT

        const context = docs
            .map((d) => {
                const {
                    recipeName,
                    section,
                    category,
                    cuisine,
                    cookingTimeMinutes,
                    tags
                } = d.metadata ?? {};

                const header = [
                    recipeName,
                    section,
                    category,
                    cuisine,
                    cookingTimeMinutes && `${cookingTimeMinutes} min`,
                    tags?.length && `tags: ${tags.join(", ")}`
                ]
                    .filter(Boolean)
                    .join(" | ");

                return header ? `[${header}]\n${d.text}` : d.text;
            })
            .join("\n\n");


        // 4. SYSTEM PROMPT (NO FILTER LOGIC HERE ANYMORE)

        const systemPrompt = `
            ${RECIPE_ASSISTANT_PROMPT}

            Knowledge Base:
            ${context}

        `;


        // 5. LLM CALL

        const stream = await client.chat.completions.create({
            model: "openai/gpt-oss-120b",
            temperature: 0,
            stream: true,
            messages: [
                { role: "system", content: systemPrompt },
                ...history,
                userMessage
            ]
        });

        res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache, no-transform");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("X-Accel-Buffering", "no");

        res.flushHeaders()

        for await (const chunk of stream) {
            const token = chunk.choices[0]?.delta?.content ?? "";
            if (token) {
                res.write(token);
            }
        }
        res.end();

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
});


app.listen(PORT, () =>
    console.log(`Server listening on port ${PORT}`)
);