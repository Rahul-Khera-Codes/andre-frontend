import { useEffect, useRef, useState } from "react"
import {
    Bot,
    User,
    Send,
    Paperclip,
    Sparkles,
    Loader2,
    Trash2,
    Plus,
    Search,
    X,
} from "lucide-react"
import { v4 as uuidv4 } from 'uuid'
import CustomInputField from "./CustomInputField"
import { summarizeFiles } from "../apis/fileupload"
import chatInstance from "../apis/chatInstance"

const BRAND = {
    primary: "#455793",
    textMuted: "#5A687C",
    border: "#E1E4EA",
    accent: "#F4C430",
    white: "#FFFFFF",
}


export function ChatInterface() {
    const [messages, setMessages] = useState([
        {
            id: "1",
            content: "Hello! I’m your Coretac.AI assistant. How can I help with email automation, tasks, or research today?",
            role: "assistant",
            timestamp: new Date(),
        },
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [chats, setChats] = useState([])
    const [activeChatId, setActiveChatId] = useState("")
    const [search, setSearch] = useState("")

    const [selectedFile, setSelectedFile] = useState(null)
    const fileInputRef = useRef(null)
    const existingSocketRef = useRef(null)
    const newSocketRef = useRef(null)

    const newwebsocketurl = `${chatInstance}/chat-llm`
    const websocketurl = `${chatInstance}/chat-llm`

    const messagesEndRef = useRef(null)

    const staticChats = [
        { conversation_id: uuidv4(), content: `new Chat ${uuidv4()}` },
        { conversation_id: uuidv4(), content: `new Chat ${uuidv4()}` },
        { conversation_id: uuidv4(), content: `new Chat ${uuidv4()}` },
        { conversation_id: uuidv4(), content: `new Chat ${uuidv4()}` },
        { conversation_id: uuidv4(), content: `newa Chat ${uuidv4()}` },
    ]

    useEffect(() => {
        setChats(staticChats)
    }, [])

    useEffect(() => {
        if (!activeChatId && chats.length === 0) {
            const id = uuidv4()
            const seed = {
                id,
                name: "New chat",
                updatedAt: new Date().toISOString(),
                messages: [
                    {
                        id: "seed",
                        content: "New chat started. Share your goal or paste content to summarize.",
                        role: "assistant",
                        timestamp: new Date(),
                    },
                ],
            }
            //setChats([seed])
            setActiveChatId(id)
            setMessages(seed.messages)
        }
    }, [activeChatId, chats.length])

    useEffect(() => {
        if (!activeChatId) return
        const current = chats.find((c) => c.id === activeChatId)
        if (current && current.messages) {
            setMessages(current.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })))
        }
    }, [activeChatId])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isLoading])

    const updateActiveChatMessages = (nextMessages) => {
        setMessages(nextMessages)
        // setChats((prev) =>
        //     prev.map((c) =>
        //         c.id === activeChatId ? { ...c, messages: nextMessages, updatedAt: new Date().toISOString() } : c,
        //     ),
        // )
    }

    const ensureActiveChat = () => {
        if (activeChatId) return activeChatId
        const id = uuidv4()
        const newChat = {
            id,
            name: "New chat",
            updatedAt: new Date().toISOString(),
            messages: [
                {
                    id: "seed",
                    content: "New chat started. start typing.",
                    role: "assistant",
                    timestamp: new Date(),
                },
            ],
        }
        //setChats((prev) => [newChat, ...prev])
        setActiveChatId(id)
        setMessages(newChat.messages)
        return id
    }

    const newWebSocketChat = (messageToSend) => {
        console.log(WebSocket.OPEN, WebSocket.CONNECTING)
        try {
            console.log(newSocketRef)
            if (newSocketRef.current?.readyState == WebSocket.OPEN) {
                newSocketRef.current.send(messageToSend.message)
            }
            else if (newSocketRef.current?.readyState == WebSocket.CONNECTING) {
                console.log("second timeeeeeeeeee of new websocket")
                newSocketRef.current.onopen = () => {
                    newSocketRef.current.send(messageToSend.message)
                }
            }
            else {
                console.warn('new WebSocket not ready to send')
                newSocketRef.current = new WebSocket(`${newwebsocketurl}/?token=${localStorage.getItem("token")}`)
                newSocketRef.current.onopen = () => {
                    newSocketRef.current.send(messageToSend.message)
                }
            }

            const next = [...messages, messageToSend]
            updateActiveChatMessages(next)
            setInput("")
            setIsLoading(true)
            setSelectedFile(null)


            newSocketRef.current.onmessage = async (event) => {
                const responseText = event.data
                console.log('💬 Bot:', responseText)
                const parsedMessage = JSON.parse(responseText);
                console.log('💬 Bot:', parsedMessage)

                const attachLine =
                    messageToSend.attachments && messageToSend.attachments.length
                        ? ` Attached file: ${messageToSend.attachments[0].name}.`
                        : ""
                const aiMessage = {
                    id: (Date.now() + 1).toString(),
                    content:
                        `Got it. ` +
                        `Here's how I can help with "${messageToSend.content || "your attachment"}": I can draft emails, outline tasks, and summarize documents.${attachLine} Tell me which to do first.`,
                    role: "assistant",
                    timestamp: new Date(),
                }
                updateActiveChatMessages([...next, aiMessage])
                setIsLoading(false)
            }

        } catch (err) {
            console.error('Failed to send message to second socket:', err)
        }
    }
    const existingWebSocketChat = (messageToSend) => {
        console.log(WebSocket.OPEN, WebSocket.CONNECTING)
        try {
            console.log(existingSocketRef)
            if (existingSocketRef.current?.readyState == WebSocket.OPEN) {
                existingSocketRef.current.send(messageToSend)
            }
            else if (existingSocketRef.current?.readyState == WebSocket.CONNECTING) {
                console.log("second timeeeeeeeeee")
                existingSocketRef.current.onopen = () => {
                    existingSocketRef.current.send(messageToSend)
                }
            }
            else {
                console.warn('Second WebSocket not ready to send')
                existingSocketRef.current = new WebSocket(`${websocketurl}/${activeChatId}?token=${localStorage.getItem("token")}`)
                existingSocketRef.current.onopen = () => {
                    existingSocketRef.current.send(messageToSend)
                }
            }

            const next = [...messages, messageToSend]
            updateActiveChatMessages(next)
            setInput("")
            setIsLoading(true)
            setSelectedFile(null)


            existingSocketRef.current.onmessage = async (event) => {
                const responseText = event.data
                console.log('💬 Bot:', responseText)
                const parsedMessage = JSON.parse(responseText);
                console.log('💬 Bot:', parsedMessage)

                const attachLine =
                    messageToSend.attachments && messageToSend.attachments.length
                        ? ` Attached file: ${messageToSend.attachments[0].name}.`
                        : ""
                const aiMessage = {
                    id: (Date.now() + 1).toString(),
                    content:
                        `Got it. ` +
                        `Here's how I can help with "${messageToSend.content || "your attachment"}": I can draft emails, outline tasks, and summarize documents.${attachLine} Tell me which to do first.`,
                    role: "assistant",
                    timestamp: new Date(),
                }
                updateActiveChatMessages([...next, aiMessage])
                setIsLoading(false)
            }

        } catch (err) {
            console.error('Failed to send message to second socket:', err)
        }
    }


    const handleSend = async () => {
        const trimmed = input.trim()
        if (!trimmed && !selectedFile) return

        const userMessage = {
            id: Date.now().toString(),
            message:trimmed,
            content: trimmed || (selectedFile ? "(sent an attachment)" : ""),
            role: "user",
            timestamp: new Date(),
            attachments: selectedFile
                ? [
                    {
                        name: selectedFile.name,
                        size: selectedFile.size,
                        type: selectedFile.type,
                    },
                ]
                : [],
        }
        // if (activeChatId) {
        //     existingWebSocketChat(userMessage)
        // } else {
        // }
        newWebSocketChat(userMessage)


        const next = [...messages, userMessage]
        updateActiveChatMessages(next)
        setInput("")
        setIsLoading(true)

        // clear file chip after enqueue
        setSelectedFile(null)

        // Simulated AI response
        setTimeout(() => {
            const attachLine =
                userMessage.attachments && userMessage.attachments.length
                    ? ` Attached file: ${userMessage.attachments[0].name}.`
                    : ""
            const aiMessage = {
                id: (Date.now() + 1).toString(),
                content:
                    `Got it. ` +
                    `Here's how I can help with "${userMessage.content || "your attachment"}": I can draft emails, outline tasks, and summarize documents.${attachLine} Tell me which to do first.`,
                role: "assistant",
                timestamp: new Date(),
            }
            updateActiveChatMessages([...next, aiMessage])
            setIsLoading(false)
        }, 900)
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const clearChat = () => {
        const id = ensureActiveChat()
        const reset = [
            {
                id: "seed",
                content: "New chat started. Share your goal or paste content to summarize.",
                role: "assistant",
                timestamp: new Date(),
            },
        ]
        updateActiveChatMessages(reset)
        setMessages([])
        setChats([])
        // also rename to "New chat"
        //setChats((prev) => prev.map((c) => (c.id === id ? { ...c, name: "New chat" } : c)))
    }

    const newChat = () => {
        setMessages([{
            id: crypto.randomUUID(),
            content: "Hello! I’m your Coretac.AI assistant. How can I help with email automation, tasks, or research today?",
            role: "assistant",
            timestamp: new Date(),
        }])
    }

    const deleteChat = (id) => {
        //setChats((prev) => prev.filter((c) => c.id !== id))
        console.log(id, "jhjgf")
        const remaining = chats.filter((c) => c.conversation_id !== id)
        if (activeChatId === id) {
            setActiveChatId(null)
            setMessages([
                {
                    id: "seed",
                    content: "New chat started. Share your goal or paste content to summarize.",
                    role: "assistant",
                    timestamp: new Date(),
                },
            ])
        }
        setChats(remaining)
    }

    const renameChat = (id, name) => {
        setChats((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)))
    }

    const handleFileButton = () => fileInputRef.current?.click()
    const onFileChange = async (e) => {
        const file = e.target.files?.[0]
        if (file) {
            try {
                const payload = new FormData()
                payload.append("file_type", "pdf")
                payload.append("document", file)
                const response = await summarizeFiles(payload)
                setSelectedFile(file)
            } catch (error) {
                console.log(error)
            }
        }
    }
    const removeFile = () => setSelectedFile(null)

    const formatTime = (d) =>
        new Date(d).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })

    const filteredChats = chats?.length > 0 && chats.filter((c) => {
        if (!search.trim()) return true
        return c.content.toLowerCase().includes(search.toLowerCase())
    })

    return (
        <div className="h-full w-full overflow-auto">
            <div
                className="h-full w-full flex rounded-xl border"
                style={{
                    borderColor: BRAND.border,
                    backgroundImage: "linear-gradient(180deg, rgba(69,87,147,0.05), rgba(255,255,255,0.9))",
                }}
            >
                <aside
                    className="hidden md:flex md:w-72 h-full lg:w-80 flex-col border-r rounded-l-xl"
                    style={{ borderColor: BRAND.border, backgroundColor: BRAND.white }}
                    aria-label="Chat history and controls"
                >
                    <div className="p-5 flex flex-col h-full gap-4">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div>
                                    <h2 className="text-sm font-semibold" style={{ color: BRAND.primary }}>
                                        Coretac.AI
                                    </h2>
                                    <p className="text-xs" style={{ color: BRAND.textMuted }}>
                                        Assistant
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={newChat}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-md"
                                style={{
                                    backgroundImage: "linear-gradient(180deg, rgba(69,87,147,0.12), rgba(69,87,147,0.06))",
                                    color: BRAND.primary,
                                }}
                            >
                                <Plus className="w-4 h-4" />
                                <span className="text-xs">New</span>
                            </button>
                        </div>
                        <CustomInputField placeholder={"Search chats..."} search={search} setSearch={setSearch} />

                        <hr style={{ borderColor: BRAND.border }} />
                        <p className="w-full text-sm font-medium" style={{ color: BRAND.primary }}>Recent Chats</p>

                        {/* Chat list */}
                        <div className="flex-1 min-h-0 max-h-[80%] overflow-y-auto" role="list" aria-label="Chat history">
                            {filteredChats?.length === 0 || chats?.length === 0 ? (
                                <p className="text-sm h-full flex justify-center items-center" style={{ color: BRAND.textMuted }}>
                                    No chats found
                                </p>
                            ) : (
                                <ul className="space-y-2">
                                    {filteredChats?.length > 0 && filteredChats.map((c) => {
                                        const isActive = c.conversation_id === activeChatId
                                        return (
                                            <li key={c.conversation_id}>
                                                <button
                                                    onClick={() => {
                                                        setActiveChatId(c.conversation_id)
                                                        setMessages([{
                                                            id: crypto.randomUUID(),
                                                            content: "Hello! I’m your Coretac.AI assistant. How can I help with email automation, tasks, or research today?",
                                                            role: "assistant",
                                                            timestamp: new Date(),
                                                        },])
                                                    }}
                                                    className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-3"
                                                    style={{
                                                        backgroundColor: isActive ? "rgba(69,87,147,0.08)" : BRAND.white,
                                                        border: `1px solid ${isActive ? "rgba(69,87,147,0.25)" : BRAND.border}`,
                                                        color: BRAND.primary,
                                                    }}
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs truncate" style={{ color: BRAND.textMuted }}>
                                                            {c.content}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            deleteChat(c.conversation_id)
                                                        }}
                                                        className="p-1 rounded-md"
                                                        style={{ backgroundColor: "transparent", color: BRAND.textMuted }}
                                                        aria-label="Delete chat"
                                                        title="Delete chat"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                        </div>

                        {((filteredChats?.length !== 0) && (chats?.length !== 0)) && <div className="flex gap-2 pt-1">
                            <button
                                onClick={clearChat}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                                style={{
                                    borderColor: BRAND.border,
                                    backgroundColor: BRAND.white,
                                    color: BRAND.textMuted,
                                }}
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="text-sm">Clear</span>
                            </button>
                        </div>}
                    </div>
                </aside>

                <main className="flex-1 flex flex-col">
                    <div
                        className="px-4 py-3 border-b rounded-tr-xl rounded- flex items-center gap-3"
                        style={{ borderColor: BRAND.border, backgroundColor: BRAND.white }}
                    >
                        <div
                            className="w-8 h-8 rounded-lg flex justify-center items-center"
                            style={{ backgroundColor: "rgba(69,87,147,0.10)" }}
                            aria-hidden="true"
                        >
                            <Bot className="w-4 h-4" style={{ color: BRAND.primary }} />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-semibold" style={{ color: BRAND.primary }}>
                                AI Assistant
                            </h3>
                            <p className="text-xs" style={{ color: BRAND.textMuted }}>
                                Built for Breakthroughs
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((m) => {
                            const isUser = m.role === "user"
                            return (
                                <div key={m.id} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                                    {!isUser && (
                                        <div
                                            className="w-8 h-8 rounded-lg flex justify-center items-center"
                                            style={{ backgroundColor: "rgba(69,87,147,0.08)" }}
                                            aria-hidden="true"
                                        >
                                            <Bot className="w-4 h-4" style={{ color: BRAND.primary }} />
                                        </div>
                                    )}

                                    <div
                                        className="max-w-[80%] p-3 rounded-b-[0.75rem]"
                                        style={
                                            isUser
                                                ? {
                                                    backgroundColor: "rgba(69,87,147,0.92)",
                                                    color: BRAND.white,
                                                    borderTopLeftRadius: "0.75rem",

                                                }
                                                : {
                                                    backgroundColor: BRAND.white,
                                                    border: `1px solid ${BRAND.border}`,
                                                    color: BRAND.primary,
                                                    borderTopRightRadius: "0.75rem",
                                                }
                                        }
                                    >
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>

                                        {m.attachments && m.attachments.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {m.attachments.map((a, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs"
                                                        style={{
                                                            backgroundColor: isUser ? "rgba(255,255,255,0.15)" : "rgba(69,87,147,0.08)",
                                                            color: isUser ? "#FFFFFF" : BRAND.primary,
                                                        }}
                                                    >
                                                        <Paperclip className="w-3.5 h-3.5" />
                                                        <span className="truncate max-w-[200px]">{a.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-2 flex items-center gap-2">
                                            <span
                                                className="text-[11px]"
                                                style={{ color: isUser ? "rgba(255,255,255,0.85)" : BRAND.textMuted }}
                                            >
                                                {formatTime(m.timestamp)}
                                            </span>
                                            {!isUser && (
                                                <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: BRAND.textMuted }}>
                                                    <Sparkles className="w-3 h-3" />
                                                    smart
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {isUser && (
                                        <div
                                            className="w-8 h-8 rounded-lg flex justify-center items-center"
                                            style={{ backgroundColor: "rgba(69,87,147,0.10)" }}
                                            aria-hidden="true"
                                        >
                                            <User className="w-4 h-4" style={{ color: BRAND.primary }} />
                                        </div>
                                    )}
                                </div>
                            )
                        })}

                        {isLoading && (
                            <div className="flex gap-3 justify-start">
                                <div
                                    className="w-8 h-8 rounded-lg flex justify-center items-center"
                                    style={{ backgroundColor: "rgba(69,87,147,0.08)" }}
                                    aria-hidden="true"
                                >
                                    <Bot className="w-4 h-4" style={{ color: BRAND.primary }} />
                                </div>
                                <div
                                    className="p-3 rounded-2xl"
                                    style={{ border: `1px solid ${BRAND.border}`, background: BRAND.white }}
                                >
                                    <div className="flex items-center gap-1">
                                        <span
                                            className="w-2 h-2 rounded-full animate-bounce"
                                            style={{ backgroundColor: BRAND.textMuted }}
                                        />
                                        <span
                                            className="w-2 h-2 rounded-full animate-bounce"
                                            style={{ backgroundColor: BRAND.textMuted, animationDelay: "0.1s" }}
                                        />
                                        <span
                                            className="w-2 h-2 rounded-full animate-bounce"
                                            style={{ backgroundColor: BRAND.textMuted, animationDelay: "0.2s" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t rounded-br-xl" style={{ borderColor: BRAND.border, backgroundColor: BRAND.white }}>
                        {selectedFile && (
                            <div className="mb-2 flex items-center gap-2">
                                <div
                                    className="inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs"
                                    style={{ backgroundColor: "rgba(69,87,147,0.08)", color: BRAND.primary }}
                                >
                                    <Paperclip className="w-3.5 h-3.5" />
                                    <span className="truncate max-w-[220px]">{selectedFile.name}</span>
                                    <button
                                        onClick={removeFile}
                                        className="p-0.5 rounded"
                                        style={{ color: BRAND.textMuted }}
                                        aria-label="Remove file"
                                        title="Remove file"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex items-end gap-2">
                            <div className="flex items-center gap-1">
                                <input type="file" ref={fileInputRef} className="hidden" onChange={onFileChange} aria-hidden="true" />
                                <button
                                    type="button"
                                    className="p-2 rounded-lg"
                                    style={{ backgroundColor: "rgba(69,87,147,0.08)", color: BRAND.primary }}
                                    aria-label="Attach file"
                                    onClick={handleFileButton}
                                >
                                    <Paperclip className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex-1">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask the assistant…"
                                    className="w-full resize-none rounded-lg px-3 py-2 focus:outline-none"
                                    rows={2}
                                    style={{
                                        border: `1px solid ${BRAND.border}`,
                                        backgroundColor: BRAND.white,
                                        color: BRAND.primary,
                                    }}
                                    aria-label="Message input"
                                />
                                <p className="text-xs mt-1" style={{ color: BRAND.textMuted }}>
                                    Press Enter to send • Shift+Enter for a new line
                                </p>
                            </div>

                            <button
                                onClick={handleSend}
                                disabled={(!input.trim() && !selectedFile) || isLoading}
                                className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-white disabled:opacity-60"
                                style={{
                                    backgroundImage: "linear-gradient(180deg, rgba(69,87,147,0.95), rgba(69,87,147,0.85))",
                                }}
                                aria-label="Send message"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                <span className="text-sm">Send</span>
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
