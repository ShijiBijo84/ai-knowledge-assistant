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
                <div className="flex items-center rounded-2xl border border-zinc-700 bg-zinc-800 px-4 py-3 focus-within:border-zinc-500">
                    <input
                        value={input}
                        disabled={loading}
                        onChange={(e) => onInputChange(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-zinc-100 placeholder:text-zinc-500 focus:ring-0
"
                        placeholder="Ask for a recipe, ingredients, or instructions..."
                        onKeyDown={(e) => e.key === "Enter" && onSend()}
                    />

                    <button
                        type="button"
                        onClick={onSend}
                        disabled={loading || !input.trim()}
                        className="ml-3 rounded-lg bg-emerald-600 px-4 py-2 hover:bg-emerald-500 active:scale-[0.98]
                        disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
                    >
                        {loading ? "..." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
}
