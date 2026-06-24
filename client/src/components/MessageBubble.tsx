import Markdown from "react-markdown";
import type { Message } from "../types/chat";

type MessageBubbleProps = {
    message: Message;
};


export function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === "user";

    return (
        <div
            className={`max-w-4xl mx-auto px-6 py-2 flex ${isUser ? "justify-end" : "justify-start"
                }`}
        >
            <div
                className={`max-w-[80%] w-fit rounded-2xl px-5 py-4 transition ${isUser
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-800 border border-zinc-700 text-zinc-100 prose prose-invert prose-sm"
                    }`}
            >
                <Markdown>{message.content}</Markdown>
            </div>
        </div>
    );
}