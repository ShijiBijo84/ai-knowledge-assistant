
# 🍳 AI Recipe Assistant

A Retrieval-Augmented Generation (RAG) powered recipe chatbot that answers recipe-related questions using a custom recipe knowledge base.

🌐 **Live Demo:** https://ai-knowledge-assistant-cydk.onrender.com

---

## 🚀 Overview

AI Recipe Assistant combines semantic search and AI to find relevant recipes from a curated recipe collection and generate accurate, context-aware responses.

Instead of sending the entire recipe database to the language model, the application retrieves only the most relevant recipe information and uses that context to generate answers grounded in the knowledge base.

---

## ✨ Features

* 🍳 Recipe Search & Discovery
* 🔎 Semantic Search with Embeddings
* 📚 Custom Recipe Knowledge Base
* 🤖 AI-Powered Recipe Responses
* ⚡ Fast Retrieval with Vector Search
* 💬 Clean Chat Interface
* 🧠 Conversation-Aware Retrieval
* 🌐 Full-Stack Application (React + Express)

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS

### Backend

* Node.js
* Express

### AI & RAG

* OpenAI Embeddings (`text-embedding-3-small`)
* OpenRouter LLM
* Cosine Similarity Search
* Custom Vector Store
* Retrieval-Augmented Generation (RAG)

---

## 🧠 How RAG Works

The application follows a Retrieval-Augmented Generation pipeline:

### 1. Recipe Chunking

Recipes are split into smaller searchable chunks such as:

* Ingredients
* Instructions
* Cooking Time

Example:

```text
Recipe: Beef Tacos

Ingredients:
- 1 lb ground beef
- Taco seasoning
- Taco shells

Instructions:
1. Brown the beef
2. Add seasoning

Cooking Time:
20 minutes
```

Each chunk is stored with metadata:

```json
{
  "recipeName": "Beef Tacos",
  "section": "ingredients",
  "category": "Tacos",
  "cuisine": "Mexican",
  "tags": ["beef"]
}
```

---

### 2. Filter Extraction

Before searching, the system extracts recipe-related filters from the user's query.

**User Query**

```text
Quick Mexican recipe
```

**Extracted Filters**

```json
{
  "recipeName": null,
  "category": null,
  "cuisine": "Mexican",
  "tags": ["quick"]
}
```

The assistant also uses conversation history to resolve follow-up questions.

**Conversation**

```text
User: Mexican recipe
Assistant: Beef Tacos

User: Full recipe
```

**Resolved Filters**

```json
{
  "recipeName": "Beef Tacos",
  "category": "Tacos",
  "cuisine": "Mexican",
  "tags": ["beef"]
}
```

---

### 3. Semantic Search

The user query is converted into an embedding using:

```text
text-embedding-3-small
```

Recipe chunks are also embedded and stored in a custom vector store.

The system compares embeddings using cosine similarity to find the most relevant chunks.

Additional metadata can boost search relevance:

* Recipe Name
* Cuisine
* Category
* Tags

---

### 4. Context Construction

Top matching chunks are assembled into a temporary context:

```text
[Beef Tacos | ingredients | Mexican]
- 1 lb ground beef
- Taco seasoning
- Taco shells

[Beef Tacos | instructions | Mexican]
1. Brown the beef
2. Add seasoning
```

Only the retrieved context is provided to the language model.

---

### 5. Response Generation

The language model generates an answer using only the retrieved recipe information.

Example:

**User**

```text
What ingredients do I need for Beef Tacos?
```

**Assistant**

```text
- 1 lb ground beef
- Taco seasoning
- Taco shells
- Lettuce
- Cheese
```

This helps reduce hallucinations and keeps responses grounded in the recipe knowledge base.

---

## 🔄 Retrieval Flow

```text
User Question
      │
      ▼
Filter Extraction
      │
      ▼
Embedding Generation
      │
      ▼
Vector Search
      │
      ▼
Retrieve Recipe Chunks
      │
      ▼
Build Context
      │
      ▼
LLM Response
```

---

## 📖 Example Questions

* "Give me a pancake recipe"
* "How do I make spaghetti?"
* "Show me a quick dessert recipe"
* "What ingredients are needed for fried rice?"
* "How long does Beef Tacos take to make?"
* "Give me the full recipe"

---

## 🏗️ Project Structure

```text
server/
├── data/
│   └── knowledge.txt
├── utilities/
│   └── inferFilters.js
├── rag.js
├── client.js
└── index.js

client/
├── src/
├── public/
└── dist/
```

---

## 👨‍💻 Author

**Shiji Bijo**

GitHub: https://github.com/ShijiBijo84

---

## ⭐ Support

If you found this project useful:

* ⭐ Star the repository
* 🍴 Fork and customize it
* 🚀 Build your own AI-powered recipe assistant
