import { useState, useRef, useEffect } from "react"
import { Send, Bot, User } from "lucide-react"


export function ChatInterface() {
    const [messages, setMessages] = useState([
        {
            id: "1",
            content: "Hello! I'm your AI assistant for biotech operations. How can I help you today?",
            role: "assistant",
            timestamp: new Date(),
        },
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage = {
            id: Date.now().toString(),
            content: input,
            role: "user",
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        // Simulate AI response
        setTimeout(() => {
            const aiMessage = {
                id: (Date.now() + 1).toString(),
                content: `I understand you're asking about "${input}". As your biotech operations assistant, I can help you with email automation, task management, document review, and research coordination. What specific aspect would you like to explore?`,
                role: "assistant",
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, aiMessage])
            setIsLoading(false)
        }, 1000)
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            {/* <div className="border-b border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex justify-center items-center">
            <div className="text-emerald-700">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">AI Assistant</h2>
            <p className="text-sm text-slate-600">Biotech Operations Support</p>
          </div>
        </div>
      </div> */}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        {message.role === "assistant" && (
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex justify-center items-center">
                                <div className="text-emerald-700">
                                    <Bot className="w-4 h-4" />
                                </div>
                            </div>
                        )}

                        <div
                            className={`max-w-[80%] p-3 ${message.role === "user" ? "bg-emerald-600 text-white rounded-b-2xl rounded-l-2xl" : "bg-slate-100 rounded-b-2xl rounded-r-2xl border-slate-200"
                                }`}
                        >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p className={`text-xs mt-2 ${message.role === "user" ? "text-emerald-100" : "text-slate-500"}`}>
                                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                        </div>

                        {message.role === "user" && (
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex justify-center items-center">
                                <div className="text-slate-700">
                                    <User className="w-4 h-4" />
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex justify-center items-center">
                            <div className="text-emerald-700">
                                <Bot className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="bg-white border-slate-200 p-3">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                <div
                                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.2s" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-200 p-4">
                <div className="flex gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask me anything about biotech operations..."
                        className="flex-1 resize-none focus:outline-none focus:ring-1 focus:ring-green-500 rounded-lg border border-slate-200 p-3"
                        rows={3}
                        disabled={isLoading}
                    />
                    <div className="flex items-center">
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="bg-emerald-600 p-2 rounded-2xl text-white hover:bg-emerald-700"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
            </div>
        </div>
    )
}
