````md
# 🍳 AI Recipe Assistant

A Retrieval-Augmented Generation (RAG) powered recipe chatbot that answers recipe-related questions using a custom recipe knowledge base.

🌐 **Live Demo:** https://ai-knowledge-assistant-cydk.onrender.com

---

## 🚀 Overview

AI Recipe Assistant combines semantic search with LLM reasoning to deliver grounded, context-aware recipe answers.

Instead of sending the entire dataset to the model, the system extracts intent and filters, maintains conversation state, retrieves relevant recipe chunks via vector search, and generates responses strictly from that context.

This ensures accurate, non-hallucinated recipe responses grounded in the knowledge base.

---

## ✨ Features

- 🍳 Recipe search and discovery
- 🧠 Intent-aware conversation handling
- 🔄 Stateful follow-up question support
- 🔎 Semantic search using embeddings
- 📚 Custom recipe knowledge base
- ⚡ Fast vector similarity retrieval
- 🤖 Grounded LLM responses (RAG)
- 💬 ChatGPT-like conversational flow

---

## 🛠️ Tech Stack

Frontend: React, TypeScript, Tailwind CSS  
Backend: Node.js, Express  
AI & RAG: OpenAI embeddings (`text-embedding-3-small`), OpenRouter LLM, cosine similarity search, custom in-memory vector store

---

## 🧠 How RAG Works

### 1. Recipe Chunking

Each recipe is split into sections: ingredients, instructions, and cooking time. Each section becomes a searchable chunk with metadata like recipe name, cuisine, category, and tags.

Example metadata:
```json
{
  "recipeName": "Beef Tacos",
  "section": "ingredients",
  "category": "Tacos",
  "cuisine": "Mexican",
  "tags": ["beef"]
}
````

---

### 2. Intent + Filter Extraction

Before retrieval, the system extracts structured intent and filters from the user query and conversation history. This enables follow-up understanding such as “ingredients”, “full recipe”, or “how long does it take”.

```json
{
  "intent": "SEARCH_RECIPE | INGREDIENTS | INSTRUCTIONS | FULL_RECIPE | COOKING_TIME",
  "recipeName": "Beef Tacos",
  "category": "Tacos",
  "cuisine": "Mexican",
  "tags": ["beef"]
}
```

---

### 3. Stateful Conversation Memory

The system remembers the active recipe context so follow-up queries do not require re-searching.

Example:

User: Mexican recipe
Assistant: Beef Tacos
User: ingredients

Resolved internally:

```json
{
  "intent": "INGREDIENTS",
  "recipeName": "Beef Tacos"
}
```

---

### 4. Semantic Search (RAG)

User queries are converted into embeddings using `text-embedding-3-small`. These are compared against precomputed recipe embeddings using cosine similarity. Filters like cuisine, category, and tags boost relevance.

---

### 5. Context Construction

Top matching chunks are combined into a single context block:

[Beef Tacos | ingredients | Mexican]

* Ground beef
* Taco seasoning

[Beef Tacos | instructions | Mexican]

1. Cook beef
2. Add seasoning

Only this context is sent to the LLM.

---

### 6. Response Generation

The LLM generates responses strictly from retrieved context. It does not rely on prior knowledge and cannot invent recipes or ingredients.

---

## 🔄 System Flow

User Query → Intent + Filters → Conversation Memory → Vector Search → Context Builder → LLM Response

---

## 📖 Example

User: Mexican recipe
Assistant: Beef Tacos

User: ingredients
→ Ground beef, taco seasoning, taco shells

User: how long does it take?
→ 5 minutes

---

## 🧱 Project Structure

server/
├── data/knowledge.txt
├── prompts/
├── utilities/
├── rag.js
├── client.js
└── index.js

client/
├── src/
├── components/
├── hooks/
├── pages/
└── types/

---

## 🧠 Key Improvement

The system evolved from stateless RAG to conversational RAG:

* Before: independent queries, no memory
* Now: intent classification, stateful filters, and reference resolution

---

## 👨‍💻 Author

Shiji Bijo
GitHub: [https://github.com/ShijiBijo84](https://github.com/ShijiBijo84)

---

## ⭐ Support

Star the repo, fork it, and build your own RAG assistant.

```
```
