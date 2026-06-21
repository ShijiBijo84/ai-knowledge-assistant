import { client } from "../client.js";

export async function inferFilters(query, history = []) {
    const historyText =
        history.length > 0
            ? history
                .map((m) => `${m.role}: ${m.content}`)
                .join("\n")
            : "No conversation history";

    const response = await client.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
            {
                role: "system",
                content: `
        Extract recipe filters.

        Conversation:
        ${historyText}

        Current query:
        ${query}

        Return JSON only:

        {
            "recipeName": null,
            "category": null,
            "cuisine": null,
            "tags": []
        }

        Rules:
            - Use conversation history to resolve references.
            - Do not guess.
            - Unknown => null.
`
            }
        ]
    });

    try {
        const content = response.choices[0].message.content.trim();

        return JSON.parse(content);
    } catch (error) {
        console.error("Failed to parse filter JSON:", error);

        return {
            recipeName: null,
            category: null,
            cuisine: null,
            tags: []
        };
    }
}