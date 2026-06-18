import fs from "fs"
import { client } from "./client.js"
import path from "path"
import { fileURLToPath } from "url";

//Step 2: Load knowledge file
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rawData = fs.readFileSync(
    path.join(__dirname, "data/knowledge.txt"), "utf-8")

//Step 3: Chunking function
export function splitText(text) {
    // This splits the doc at a position followed by "Recipe:", without deleting "Recipe:"
    return text.split(/(?=Recipe:)/).filter(Boolean);

}
export const chunks = splitText(rawData);

//Step 4: Embeddings 
export async function embeds(text) {
    const res = await client.embeddings.create({
        model: "text-embedding-3-small",
        input: text
    })
    return res.data[0].embedding
}

//Step 5: Vector store creation [{text, embedding}]
export async function createVectorStore() {
    const vectorStore = []

    for (let chunk of chunks) {
        const embedding = await embeds(chunk)
        vectorStore.push({
            text: chunk,
            embedding
        })
    }
    return vectorStore
}

/*
Step 6: Cosine similarity
a = embedding of user question
b = embedding of a document chunk
*/

function cosineSimilarity(a, b) {
    let dot = 0
    let magA = 0
    let magB = 0
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i]
        magA += a[i] * a[i]
        magB += b[i] * b[i]
    }
    return dot / (Math.sqrt(magA) * Math.sqrt(magB))
}

// Step 7: Search function

export async function search(vectorStore, query, topK = 3) {
    const queryEmbeddings = await embeds(query)
    const results = vectorStore.map((item) => ({
        text: item.text,
        score: cosineSimilarity(queryEmbeddings, item.embedding)
    })).sort((a, b) => b.score - a.score)
        .slice(0, topK)

    return results
}