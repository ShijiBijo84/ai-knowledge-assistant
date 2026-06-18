import type { RefObject } from "react";
import type { Message } from "../types/chat";
import { EmptyState } from "./EmptyState";
import { MessageBubble } from "./MessageBubble";

type MessageListProps = {
    messages: Message[];
    loading: boolean;
    bottomRef: RefObject<HTMLDivElement | null>;
};

export function MessageList({ messages, loading, bottomRef }: MessageListProps) {
    return (
        <div className="flex-1 overflow-y-auto">
            {messages.length === 0 && <EmptyState />}

            {messages.map((message, index) => (
                <MessageBubble key={`${message.role}-${index}`} message={message} />
            ))}

            {loading && (
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <div className="inline-flex rounded-2xl bg-zinc-800 border border-zinc-700 px-5 py-4 text-zinc-400 animate-pulse">
                        Thinking...
                    </div>
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    );
}
