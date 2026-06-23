import fs from "fs"
import { client } from "./client.js"
import path from "path"
import { fileURLToPath } from "url";
import { SECTIONS } from "./constants/sections.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const KNOWLEDGE_FILE = path.join(__dirname, "data/knowledge.txt")
const rawData = fs.readFileSync(KNOWLEDGE_FILE, "utf-8")

const SECTION_HEADERS = "(?:Ingredients|Instructions|Cooking Time)"

// Match a section header (used for test/match + capture group)
const SECTION_PATTERN = new RegExp(
    `^(?:#{1,3}\\s*)?(${SECTION_HEADERS})\\s*:`,
    "im"
)

// Split before each section header without removing it (lookahead only)
const SECTION_SPLIT = new RegExp(
    `(?=^(?:#{1,3}\\s*)?${SECTION_HEADERS}\\s*:)`,
    "gim"
)

// Level 1: split one file into individual recipes
export function splitIntoRecipes(text) {
    return text.split(/(?=Recipe:)/).filter(Boolean)
}

function parseField(text, key) {
    return text.match(new RegExp(`^${key}:\\s*(.+)$`, "m"))?.[1]?.trim() ?? null
}

export function parseRecipeMetadata(recipeText) {
    const cookingTime = parseField(recipeText, "Cooking Time")
    const tags = parseField(recipeText, "Tags")

    return {
        recipeName: parseField(recipeText, "Recipe"),
        category: parseField(recipeText, "Category"),
        cuisine: parseField(recipeText, "Cuisine"),
        cookingTimeMinutes: cookingTime ? Number(cookingTime.match(/\d+/)?.[0]) : null,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
    }
}

// Level 2: split each recipe into logical sections
export function splitIntoSections(recipeText, metadata) {
    const parts = recipeText.split(SECTION_SPLIT)

    return parts
        .map((part) => part.trim())
        .filter((part) => SECTION_PATTERN.test(part))
        .map((part) => ({
            text: part,
            metadata: {
                ...metadata,
                section: part.match(SECTION_PATTERN)[1].toLowerCase(),
            },
        }))
}

export function loadChunks(text = rawData) {
    const chunks = []
    const recipes = splitIntoRecipes(text)

    for (const recipe of recipes) {
        const metadata = parseRecipeMetadata(recipe)
        chunks.push(...splitIntoSections(recipe, metadata))
    }

    return chunks
}

export const chunks = loadChunks()

export async function embeds(text) {
    const res = await client.embeddings.create({
        model: "text-embedding-3-small",
        input: text
    })
    return res.data[0].embedding
}

export async function createVectorStore() {
    return Promise.all(
        chunks.map(async (chunk) => ({
            text: chunk.text,
            embedding: await embeds(chunk.text),
            metadata: chunk.metadata,
        }))
    )
}

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

function getRecipeChunks(vectorStore, recipeName) {
    return vectorStore.filter(
        item =>
            item.metadata.recipeName?.toLowerCase() ===
            recipeName.toLowerCase()
    );
}

export async function search(vectorStore, query, topK = 5, filters = {}) {

    const { intent, recipeName } = filters
    if (recipeName) {
        const recipeChunks = getRecipeChunks(vectorStore, recipeName)
        switch (intent) {
            case 'INGREDIENTS':
                return recipeChunks.filter((x) => x.metadata.section === SECTIONS.INGREDIENTS)
            case 'INSTRUCTIONS':
                return recipeChunks.filter((x) => x.metadata.section === SECTIONS.INSTRUCTIONS)
            case 'COOKING_TIME':
                return recipeChunks.filter((x) => x.metadata.section === SECTIONS.COOKING_TIME)
            case 'FULL_RECIPE':
            default:
                return recipeChunks
        }
    }
    const queryEmbedding = await embeds(query)

    return vectorStore
        .map((item) => {
            let score = cosineSimilarity(
                queryEmbedding,
                item.embedding
            )


            if (
                filters.category &&
                item.metadata.category?.toLowerCase() ===
                filters.category.toLowerCase()
            ) {
                score += 0.15
            }

            if (
                filters.cuisine &&
                item.metadata.cuisine?.toLowerCase() ===
                filters.cuisine.toLowerCase()
            ) {
                score += 0.15
            }

            if (
                filters.tags?.length &&
                item.metadata.tags?.some(tag =>
                    filters.tags.includes(tag.toLowerCase())
                )
            ) {
                score += 0.1
            }

            return {
                text: item.text,
                metadata: item.metadata,
                score,
            }
        })
        .filter((item) => item.score >= 0.25)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
}
