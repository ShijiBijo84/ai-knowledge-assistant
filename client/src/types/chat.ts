export type Message = {
    role: "user" | "assistant";
    content: string;
    reasoning_details?: unknown;
};
