type SidebarProps = {
    onNewChat: () => void;
};

export function Sidebar({ onNewChat }: SidebarProps) {
    return (
        <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
            <div className="p-4 border-b border-zinc-800 font-semibold">
                Recipe AI
            </div>

            <div className="p-3">
                <button
                    type="button"
                    onClick={onNewChat}
                    className="w-full rounded-lg bg-zinc-800 hover:bg-zinc-700 p-3 text-left transition"
                >
                    + New Chat
                </button>
            </div>
        </div>
    );
}
