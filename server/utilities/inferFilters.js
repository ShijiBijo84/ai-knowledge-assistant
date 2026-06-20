import { client } from "../client.js"
export async function inferFilters(query) {
    const response = await client.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
            {
                role: "system",
                content: `
Extract recipe search filters.

Return JSON only.

Supported fields:
- category
- cuisine
- tags

Example:
{
  "category": "Dessert",
  "cuisine": "Italian",
  "tags": ["quick"]
}
            }
        ]
    })

}
    `
            },
            {
                role: "user",
                content: query
            }
        ]
    })

    return JSON.parse(
        response.choices[0].message.content
    )
}