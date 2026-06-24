export type Message = {
    role: "user" | "assistant";
    content: string;
    reasoning_details?: unknown;
};

export type Filters = {
    intent: string;
    recipeName: string | null;
    category: string | null;
    cuisine: string | null;
    tags: string[];
}

export type ChatSession = {
    id: string;
    title: string;
    messages: Message[];
    filters: Filters;
}
