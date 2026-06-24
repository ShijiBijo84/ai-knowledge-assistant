import { useEffect, useRef } from "react";
import { ChatHeader } from "./components/ChatHeader";
import { ChatInput } from "./components/ChatInput";
import { MessageList } from "./components/MessageList";
import { Sidebar } from "./components/Sidebar";
import { useChatStore } from "./store/chatStore";

const App = () => {
    const {
        chats,
        activeChatId,
        input,
        loading,
        setInput,
        sendMessage,
    } = useChatStore();
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const activeChat = chats.find(c => c.id === activeChatId)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeChat?.messages, loading]);

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
