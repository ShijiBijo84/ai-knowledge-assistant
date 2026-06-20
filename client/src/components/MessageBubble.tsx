import Markdown from "react-markdown";
import type { Message } from "../types/chat";

type MessageBubbleProps = {
    message: Message;
};


export function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === "user";

    return (
        <div
            className={`max-w-4xl mx-auto px-6 py-3 flex ${isUser ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`w-fit  rounded-2xl px-5 py-4 prose prose-invert max-w-none ${isUser
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-800 border border-zinc-700 text-zinc-100"
                    }`}
            >
                <Markdown>{message.content}</Markdown>
            </div>
        </div>
    );
}
