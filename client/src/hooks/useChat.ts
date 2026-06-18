import { useEffect, useRef, useState } from "react";
import type { Message } from "../types/chat";

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const userMessage: Message = { role: "user", content: trimmed };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ history: messages, userMessage }),
            });

            if (!res.ok) throw new Error("Chat request failed");

            const data = await res.json();
            const { response, reasoning_details } = data;

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: response, reasoning_details },
            ]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const startNewChat = () => {
        setMessages([]);
        setInput("");
    };

    return {
        messages,
        input,
        setInput,
        loading,
        bottomRef,
        sendMessage,
        startNewChat,
    };
}
