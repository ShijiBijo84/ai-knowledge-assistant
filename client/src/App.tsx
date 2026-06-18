
import { useEffect, useRef, useState } from "react"
import Markdown from "react-markdown";


type Message = {
    role: "user" | "assistant";
    content: string;
    reasoning_details?: unknown;
};

const App = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        bottomRef.current?.focus();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return
        const userMessage: Message = { role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput("")
        setLoading(true)
        try {
            const res = await fetch("/api/chat", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ history: messages, userMessage })
            })
            const data = await res.json()
            const { response, reasoning_details } = data
            setMessages((prev) => [...prev, { role: "assistant", content: response, reasoning_details }])
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="flex h-screen bg-zinc-950 text-zinc-100">

            {/* Sidebar */}
            <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
                <div className="p-4 border-b border-zinc-800 font-semibold">
                    Recipe AI
                </div>

                <div className="p-3">
                    <button className="w-full rounded-lg bg-zinc-800 hover:bg-zinc-700 p-3 text-left transition">
                        + New Chat
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">

                {/* Header */}
                <div className="h-14 border-b border-zinc-800 flex items-center px-6 bg-zinc-950">
                    <h1 className="font-semibold">Recipe Assistant</h1>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto">

                    {messages.length === 0 && (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold mb-3">
                                    Recipe Assistant
                                </h1>
                                <p className="text-zinc-400">
                                    Ask for pancakes, pasta, salads, cakes and more.
                                </p>
                            </div>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`max-w-4xl mx-auto px-6 py-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`w-fit max-w-3xl rounded-2xl px-5 py-4 prose prose-invert max-w-none ${msg.role === "user"
                                    ? "bg-emerald-600 text-white"
                                    : "bg-zinc-800 border border-zinc-700 text-zinc-100"
                                    }`}
                            >
                                <Markdown>
                                    {msg.content}
                                </Markdown>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="max-w-4xl mx-auto px-6 py-6">
                            <div className="inline-flex rounded-2xl bg-zinc-800 border border-zinc-700 px-5 py-4 text-zinc-400 animate-pulse">
                                Thinking...
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="border-t border-zinc-800 bg-zinc-950 p-4">
                    <div className="max-w-4xl mx-auto">

                        <div className="flex items-center rounded-2xl border border-zinc-700 bg-zinc-800 px-4 py-3">

                            <input
                                value={input}
                                disabled={loading}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 bg-transparent outline-none text-zinc-100 placeholder:text-zinc-500"
                                placeholder="Ask for a recipe..."
                                onKeyDown={(e) =>
                                    e.key === "Enter" && sendMessage()
                                }
                            />

                            <button
                                onClick={sendMessage}
                                disabled={loading}
                                className="ml-3 rounded-lg bg-emerald-600 px-4 py-2 hover:bg-emerald-500 disabled:opacity-50 transition"
                            >
                                Send
                            </button>

                        </div>

                    </div>
                </div>

            </div>
        </div>
    )


}
export default App