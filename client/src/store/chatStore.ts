import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatSession, Message } from "../types/chat";
import { defaultFilters } from "../constants/defaultFilters";

type ChatStore = {
    chats: ChatSession[];
    activeChatId: string | null;

    input: string;
    loading: boolean;

    setInput: (v: string) => void;

    createChat: () => string;
    setActiveChatId: (id: string) => void;

    addMessage: (chatId: string, message: Message) => void;
    setChatTitle: (chatId: string, title: string) => void;

    sendMessage: () => Promise<void>;
    updateMessage: (chatId: string, messageId: string, patch: Partial<Message>) => void;
};

export const useChatStore = create<ChatStore>()(
    persist(
        (set, get) => ({
            chats: [],
            activeChatId: null,

            input: "",
            loading: false,

            setInput: (v) => set({ input: v }),

            createChat: () => {
                const id = crypto.randomUUID();

                const newChat: ChatSession = {
                    id,
                    title: "New Chat",
                    messages: [],
                    filters: defaultFilters,
                };

                set((state) => ({
                    chats: [newChat, ...state.chats],
                    activeChatId: id,
                    input: "",
                }));

                return id;
            },

            setActiveChatId: (id) => set({ activeChatId: id }),

            addMessage: (chatId, message) =>
                set((state) => ({
                    chats: state.chats.map((chat) =>
                        chat.id === chatId
                            ? { ...chat, messages: [...chat.messages, message] }
                            : chat
                    ),
                })),

            setChatTitle: (chatId, title) =>
                set((state) => ({
                    chats: state.chats.map((chat) =>
                        chat.id === chatId ? { ...chat, title } : chat
                    ),
                })),

            updateMessage: (chatId, messageId, patch) => {
                set((state) => ({
                    chats: state.chats.map((chat) =>
                        chat.id === chatId ? {
                            ...chat,
                            messages: chat.messages.map((m) =>
                                m.id === messageId ? { ...m, ...patch } : m)
                        } : chat)
                }))
            },

            sendMessage: async () => {
                const {
                    input,
                    activeChatId,
                    chats,
                    addMessage,
                    setChatTitle,
                    createChat,
                    updateMessage
                } = get();

                const trimmed = input.trim();
                if (!trimmed) return;

                // 1. Ensure chat exists
                let chatId = activeChatId;

                if (!chatId) {
                    chatId = createChat();
                }

                const chat = chats.find((c) => c.id === chatId);

                if (!chat) return;

                // 2. Create user message
                const userMessage: Message = {
                    role: "user",
                    content: trimmed,
                    id: crypto.randomUUID()
                };

                // 3. Auto-generate title on first message
                if (chat.messages.length === 0) {
                    const rawTitle =
                        trimmed.length > 40
                            ? trimmed.slice(0, 40) + "..."
                            : trimmed;

                    const formattedTitle =
                        rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);

                    setChatTitle(chatId, formattedTitle);
                }

                // 4. Optimistic update
                addMessage(chatId, userMessage);

                const assistantMessageId = crypto.randomUUID()
                addMessage(chatId, { role: "assistant", id: assistantMessageId, content: "" })

                set({ input: "", loading: true });

                try {
                    const res = await fetch("/api/chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            history: chat.messages,
                            userMessage,
                            filters: chat.filters,
                        }),
                    });

                    if (!res.body) throw new Error("No response")

                    const reader = res.body.getReader()
                    const decoder = new TextDecoder("utf-8")
                    let fullText = ""

                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value, { stream: true })
                        fullText += chunk;
                        updateMessage(chatId, assistantMessageId, { content: fullText })

                    }
                } catch (err) {
                    console.error("sendMessage error:", err);
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: "chat-storage",
        }
    )
);