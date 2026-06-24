import { create } from "zustand";
import type { ChatSession, Message } from "../types/chat"
import { defaultFilters } from "../constants/defaultFilters";

type ChatStore = {
    chats: ChatSession[];
    activeChatId: string | null;

    input: string;
    loading: boolean;

    setInput: (v: string) => void;

    createChat: () => string;
    setActiveChatId: (id: string) => void;
    addMessage: (id: string, v: Message) => void;
    sendMessage: () => Promise<void>;

    setChatTitle: (id: string, v: string) => void;

}

export const useChatStore = create<ChatStore>((set, get) => ({
    chats: [],
    activeChatId: null,

    input: "",
    loading: false,
    setInput: (v) => set({ input: v }),

    createChat: (): string => {
        const id = crypto.randomUUID();

        const newChat: ChatSession = {
            title: "New Chat",
            id,
            messages: [],
            filters: defaultFilters
        };


        set((state) => ({
            chats: [newChat, ...state.chats],
            activeChatId: id,
            input: ""
        }));

        return id;
    },

    setActiveChatId: (id) =>
        set(() => ({
            activeChatId: id
        })),

    addMessage: (chatId, message) =>
        set((state) => ({
            chats: state.chats.map((chat) =>
                chat.id === chatId ? { ...chat, messages: [...chat.messages, message] } : chat)
        })),

    setChatTitle: (chatId, title) =>
        set((state) => ({
            chats: state.chats.map((chat) =>
                chat.id === chatId ? { ...chat, title } : chat)
        })),

    sendMessage: async () => {
        const state = get();
        const { input, activeChatId } = state;

        if (!input.trim()) return;

        let chatId = activeChatId;

        // 1. Ensure chat exists
        if (!chatId) {
            chatId = state.createChat();
        }

        const userMessage: Message = {
            role: "user",
            content: input
        };

        // 2. Get freshest chat AFTER ensuring it exists
        const chat = get().chats.find(c => c.id === chatId);

        if (chat && chat.messages.length === 0) {
            const title = userMessage.content.length > 40 ?
                userMessage.content.slice(0, 40) + "..." : userMessage.content;
            const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1)
            get().setChatTitle(chatId, formattedTitle)
        }


        // 3. Optimistic update
        state.addMessage(chatId, userMessage);
        set({ input: "", loading: true });


        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    history: chat?.messages ?? [],
                    userMessage,
                    filters: chat?.filters ?? [],
                }),
            });

            const data = await res.json();

            state.addMessage(chatId, {
                role: "assistant",
                content: data.response,
                reasoning_details: data.reasoning_details,
            });

        } catch (err) {
            console.error(err);
        } finally {
            set({ loading: false });
        }

    },

}));