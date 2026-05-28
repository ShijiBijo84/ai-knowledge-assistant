import { useEffect, useRef, useState } from "react"

const App = () => {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return
        const userMessage = { role: 'user', content: input }
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
            setLoading(false)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="flex h-screen text-white">
            <div className="w-64 bg-gray-800 ">Sidebar</div>
            <div className="flex-1 bg-gray-900 flex flex-col">
                <div className="p-4 border-b border-gray-700">Your AI Assistant</div>
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index}
                            className={`flex ${msg.role === 'user' ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`px-4 py-2 rounded-xl max-w-xs
                                ${msg.role === "user" ? "bg-blue-600" : "bg-gray-700"}`
                            }>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && <div className="justify-start w-20 flex bg-gray-700 px-4 py-2 rounded-xl space-x-2">
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce delay-150">.</span>
                        <span className="animate-bounce delay-300">.</span>
                    </div>}
                    <div ref={bottomRef} />
                </div>
                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center bg-gray-800 rounded-xl px-4 py-2 ">
                        <input
                            value={input}
                            disabled={loading}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-white"
                            placeholder="Type a message..."
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
                        <button
                            onClick={sendMessage}
                            className=" bg-blue-600 px-4 py-1 rounded-lg">Send</button>
                    </div>
                </div>
            </div>
        </div >
    )
}
export default App