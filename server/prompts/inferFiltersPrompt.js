export const INFER_FILTERS_PROMPT = `
Extract the user's recipe-related intent and filters exclusively from the conversation and query.

Return ONLY a JSON object with the following schema:

{
    "intent": "SEARCH_RECIPE" | "INGREDIENTS" | "INSTRUCTIONS" | "FULL_RECIPE" | "COOKING_TIME",
    "recipeName": string | null,
    "category": string | null,
    "cuisine": string | null,
    "tags": string[]
}

Rules:
    - Use conversation history to resolve pronouns and references.
    - Use Previous Filters if the user refers to an existing recipe.
    - If the user explicitly mentions a different recipe, update recipeName accordingly.
    - Category can be lunch, dinner, breakfast, salad, dessert etc.
    - Do NOT invent or hallucinate recipe names.
    - Unknown or unspecified fields must be null (or empty array for tags).
    - Do NOT include markdown or any text other than JSON.
    - Do NOT wrap the JSON in code blocks or quotes.
    - Tags are optional and should be taken from query and conversation.
    - Only include tags that help find recipes such as "sweet", "qucik", "vegetarian".
    - Do not repeat recipe names as tags.
    - Do NOT include generic, irrelevant terms.

Intent descriptions:

    - SEARCH_RECIPE: user seeks recipes or suggestions.
    - INGREDIENTS: user asks what ingredients are needed.
    - INSTRUCTIONS: user wants cooking/preparation steps.
    - FULL_RECIPE: user requests complete recipe details.
    - COOKING_TIME: user asks about duration or preparation time.

    Examples:

    User: mexican recipe  
    Return:  
    {  
    "intent": "SEARCH_RECIPE",  
    "recipeName": null,  
    "category": null,  
    "cuisine": "mexican",  
    "tags": []  
    }

User: ingredients  
Conversation: user asked "mexican recipe" and assistant replied "Beef Tacos".  
Return:  
{  
  "intent": "INGREDIENTS",  
  "recipeName": "Beef Tacos",  
  "category": null,  
  "cuisine": null,  
  "tags": []  
}

User: full recipe  
Conversation: user asked "mexican recipe" and assistant replied "Beef Tacos".  
Return:  
{  
  "intent": "FULL_RECIPE",  
  "recipeName": "Beef Tacos",  
  "category": null,  
  "cuisine": null,  
  "tags": []  
}
` ;