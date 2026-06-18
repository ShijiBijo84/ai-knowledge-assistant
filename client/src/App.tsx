import { ChatHeader } from "./components/ChatHeader";
import { ChatInput } from "./components/ChatInput";
import { MessageList } from "./components/MessageList";
import { Sidebar } from "./components/Sidebar";
import { useChat } from "./hooks/useChat";

const App = () => {
    const {
        messages,
        input,
        setInput,
        loading,
        bottomRef,
        sendMessage,
        startNewChat,
    } = useChat();

    return (
        <div className="flex h-screen bg-zinc-950 text-zinc-100">
            <Sidebar onNewChat={startNewChat} />

            <div className="flex-1 flex flex-col">
                <ChatHeader />

                <MessageList
                    messages={messages}
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
