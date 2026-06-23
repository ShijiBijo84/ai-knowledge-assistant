import { client } from "../client.js";
import { INFER_FILTERS_PROMPT } from "../prompts/inferFiltersPrompt.js";

export async function inferFilters(
    query,
    history = [],
    previousFilters = {}
) {
    const historyText =
        history.length > 0
            ? history
                .slice(-6)
                .map((m) => `${m.role}: ${m.content}`)
                .join("\n")
            : "No conversation history";

    const response = await client.chat.completions.create({
        model: "openai/gpt-oss-20b",
        temperature: 0,
        response_format: {
            type: "json_object"
        },
        messages: [
            {
                role: "system",
                content: INFER_FILTERS_PROMPT
            },
            {
                role: "user",
                content: `
                Conversation history:
                ${historyText}

                Current user query:
                ${query}

                Previous filters:
                ${JSON.stringify(previousFilters)}
      `            }
        ]
    });

    try {
        return JSON.parse(
            response.choices[0].message.content
        );
    } catch (error) {
        console.error(error);

        return {
            intent: "SEARCH_RECIPE",
            recipeName: null,
            category: null,
            cuisine: null,
            tags: []
        };
    }
}