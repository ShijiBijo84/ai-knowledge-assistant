import { useEffect, useMemo, useRef } from "react";
import { ChatHeader } from "./ui/ChatHeader";
import { ChatInput } from "./ui/components/ChatInput";
import { MessageList } from "./ui/components/MessageList";
import { Sidebar } from "./ui/components/Sidebar";
import { useChatStore } from "./store/chatStore";

const App = () => {
    const chats = useChatStore((s) => s.chats);
    const activeChatId = useChatStore((s) => s.activeChatId);
    const input = useChatStore((s) => s.input);
    const loading = useChatStore((s) => s.loading);
    const setInput = useChatStore((s) => s.setInput);
    const sendMessage = useChatStore((s) => s.sendMessage);

    const bottomRef = useRef<HTMLDivElement | null>(null);

    const activeChat = useMemo(
        () => chats.find(c => c.id === activeChatId),
        [chats, activeChatId]
    );

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeChat?.messages?.length, loading]);

    return (
        <div className="flex h-screen bg-zinc-950 text-zinc-100">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <ChatHeader />

                <MessageList
                    messages={activeChat?.messages ?? []}
                    loading={loading}
                    bottomRef={bottomRef}
                />

                <ChatInput
                    input={input}
                    loading={loading}
                    onInputChange={setInput}
                    onSend={sendMessage}
                />
            </div>
        </div>
    );
};
export default App;