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
        <div className="flex-1 overflow-y-auto scroll-smooth overscroll-contain">
            {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                    <EmptyState />
                </div>
            ) : (
                messages.map((message, index) => (
                    <MessageBubble
                        key={`${message.role}-${index}`}
                        message={message}
                    />
                ))
            )}

            {loading && (
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="inline-flex items-center gap-2 rounded-2xl bg-zinc-800 border border-zinc-700 px-5 py-4 text-zinc-400">
                        <span className="h-2 w-2 rounded-full bg-zinc-400 animate-pulse" />
                        Thinking...
                    </div>
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    );
}