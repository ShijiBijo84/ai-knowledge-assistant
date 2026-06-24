import { useChatStore } from "../store/chatStore";


export function Sidebar() {
    const { chats, createChat, setActiveChatId } = useChatStore()

    return (
        <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
            <div className="p-4 border-b border-zinc-800 font-semibold">
                Recipe AI
            </div>

            <div className="p-3">
                <button
                    type="button"
                    onClick={createChat}
                    className="w-full rounded-lg bg-zinc-800 hover:bg-zinc-700 p-3 text-left transition"
                >
                    + New Chat
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {chats.map(chat => (

                    <button
                        key={chat.id}
                        onClick={() => setActiveChatId(chat.id)}
                        className="w-full rounded-lg px-3 py-2 text-left transition bg-zinc-800 hover:bg-zinc-700"
                    >
                        {chat.title}
                    </button>
                ))}
            </div>
        </div>
    );
}
