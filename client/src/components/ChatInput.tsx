type ChatInputProps = {
    input: string;
    loading: boolean;
    onInputChange: (value: string) => void;
    onSend: () => void;
};

export function ChatInput({ input, loading, onInputChange, onSend }: ChatInputProps) {
    return (
        <div className="border-t border-zinc-800 bg-zinc-950 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center rounded-2xl border border-zinc-700 bg-zinc-800 px-4 py-3">
                    <input
                        value={input}
                        disabled={loading}
                        onChange={(e) => onInputChange(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-zinc-100 placeholder:text-zinc-500"
                        placeholder="Ask for a recipe..."
                        onKeyDown={(e) => e.key === "Enter" && onSend()}
                    />

                    <button
                        type="button"
                        onClick={onSend}
                        disabled={loading}
                        className="ml-3 rounded-lg bg-emerald-600 px-4 py-2 hover:bg-emerald-500 disabled:opacity-50 transition"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
