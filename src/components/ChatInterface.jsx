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
import { deleteChatHistory, getChatHistory, summarizeFiles } from "../apis/fileupload"
import chatInstance from "../apis/chatInstance"
import { GiHamburgerMenu } from "react-icons/gi"
import Loader from "./loader"

const BRAND = {
    primary: "#455793",
    textMuted: "#5A687C",
    border: "#E1E4EA",
    accent: "#F4C430",
    white: "#FFFFFF",
}


export function ChatInterface() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [historyStatus, setHistoryStatus] = useState(true)
    const [chats, setChats] = useState([])
    const [activeChatId, setActiveChatId] = useState("")
    const [search, setSearch] = useState("")
    const [payload, setPayload] = useState({})
    const [uploadingStatus, setUploadingStatus] = useState(false)
    const [messagesStatus, setMessagesStatus] = useState(false)
    const [historyChatsStatus, setHistoryChatsStatus] = useState(false)

    const [selectedFile, setSelectedFile] = useState(null)
    const [fileError, setFileError] = useState("")
    const fileInputRef = useRef(null)
    const newSocketRef = useRef(null)

    const newwebsocketurl = `${chatInstance}/chat-llm`

    const messagesEndRef = useRef(null)

    useEffect(() => {
        fecthHistoryChats()
    }, [])

    const fecthHistoryChats = async (query = "") => {
        try {
            const response = await getChatHistory(query)
            console.log(response?.data)
            if (response?.status === 200) {
                if (response?.data?.session?.length > 0) {
                    const customResponse = response?.data?.session.map((e) => ({
                        ...e,
                        conversation_id: e.session_id,
                        content: e.session_name
                    }))
                    const existingIds = chats.map(chat => chat.conversation_id);
                    const filtered = customResponse.filter(e => !existingIds.includes(e.conversation_id));
                    if (messages?.length === 0) {
                        setActiveChatId(null)
                    }
                    else if (filtered.length > 0) {
                        setActiveChatId(filtered?.[0]?.conversation_id);
                    } else if (existingIds?.length === 0) {
                        setActiveChatId(customResponse?.[0]?.conversation_id);
                    }
                    console.log(existingIds, filtered, "hugyftdrtyuij")
                    setChats(customResponse)
                }
                if (response?.data?.messages?.length > 0) {
                    const customResponse = response?.data?.messages.map((e) => ({
                        ...e,
                        id: uuidv4(),
                        content: e.content,
                        role: e.role,
                        timestamp: e.timestamp,
                    }))
                    setMessages(customResponse)
                }
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteChats = async (query = "") => {
        try {
            const response = await deleteChatHistory(query)
            console.log(response?.data)

        } catch (error) {
            console.log(error)
        }
    }



    // useEffect(() => {
    //     if (!activeChatId) return
    //     const current = chats.find((c) => c.id === activeChatId)
    //     if (current && current.messages) {
    //         setMessages(current.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })))
    //     }
    // }, [activeChatId])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isLoading])

    const updateActiveChatMessages = (nextMessages) => {
        setMessages(nextMessages)
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
        setActiveChatId(id)
        setMessages(newChat.messages)
        return id
    }


    const newWebSocketChat = (messageToSend) => {
        const payload2 = {
            ...payload,
            question: messageToSend.message
        };

        const next = [...messages, messageToSend];
        updateActiveChatMessages(next);
        setInput("");
        setIsLoading(true);
        setSelectedFile(null);

        const aiMessageId = (Date.now() + 1).toString();

        console.log(payload2, "knjhgcfgc")

        const sendPayload = () => {
            if (newSocketRef.current?.readyState === WebSocket.OPEN) {
                newSocketRef.current.send(JSON.stringify(payload2));
            } else {
                console.warn("WebSocket not ready");
            }
        };

        if (!newSocketRef.current || newSocketRef.current.readyState >= WebSocket.CLOSING) {
            newSocketRef.current = new WebSocket(`${newwebsocketurl}/?token=${localStorage.getItem("token")}`);
            newSocketRef.current.onopen = sendPayload;
        } else if (newSocketRef.current.readyState === WebSocket.CONNECTING) {
            newSocketRef.current.onopen = sendPayload;
        } else {
            sendPayload();
        }

        let fullResponse = "";

        newSocketRef.current.onmessage = async (event) => {
            const parsedMessage = JSON.parse(event.data);
            const chunk = parsedMessage.data_chunks || "";
            const isDone = parsedMessage.is_done;

            fullResponse += chunk;

            const updatedMessages = [...next];
            const existingIndex = updatedMessages.findIndex((m) => m.id === aiMessageId);

            const newAssistantMessage = {
                id: aiMessageId,
                content: fullResponse,
                role: "assistant",
                timestamp: new Date(),
            };

            if (existingIndex !== -1) {
                updatedMessages[existingIndex] = newAssistantMessage;
            } else {
                updatedMessages.push(newAssistantMessage);
            }

            updateActiveChatMessages(updatedMessages);


            setIsLoading(false);
        };

        if (payload.conversation_type === "new") {
            removeData()
        }
        setPayload({})

        newSocketRef.current.onerror = (err) => {
            console.error("WebSocket error:", err);
            setIsLoading(false);
            setPayload({})
        };
    };

    const removeData = async () => {
        if (payload.conversation_type === "new") {
            setPayload({})
            setHistoryChatsStatus(true)
            setTimeout(() => {
                fecthHistoryChats()
            }, 900)
            setHistoryChatsStatus(false)
        }
    }

    const handleSend = async () => {
        const trimmed = input.trim()
        if (!trimmed && !selectedFile) return

        const userMessage = {
            id: uuidv4(),
            message: trimmed,
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
        setPayload((prev) => ({ ...prev, question: userMessage.message }))
        if (activeChatId) {
            newWebSocketChat(userMessage)
        } else {
            newWebSocketChat(userMessage)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const clearChat = async () => {
        const id = ensureActiveChat()
        await handleDeleteChats()
        setActiveChatId(null)
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
    }

    const newChat = () => {
        setMessages([{
            id: uuidv4(),
            content: "Hello! I’m your Coretac.AI assistant. How can I help with email automation, tasks, or research today?",
            role: "assistant",
            timestamp: new Date(),
        }])
        setPayload({
            conversation_id: uuidv4(),
            conversation_type: "new"
        })
        setActiveChatId(null)
    }

    const deleteChat = async (id) => {
        console.log(id, "jhjgf")
        await handleDeleteChats(`?conversation_id=${id}`)
        const remaining = chats.filter((c) => c.conversation_id !== id)
        if (activeChatId === id || remaining?.length === 0) {
            setActiveChatId(null)
            setMessages([])
        }
        setChats(remaining)
    }



    const handleSelectChat = async (id) => {
        setActiveChatId(id)
        setPayload({
            conversation_id: id,
            conversation_type: "existing"
        })
        setMessagesStatus(true)
        await fecthHistoryChats(`?conversation_id=${id}`)
        setMessagesStatus(false)
    }

    const handleFileButton = () => fileInputRef.current?.click()
    const onFileChange = async (e) => {
        setFileError("")
        setUploadingStatus(true)
        const file = e.target.files?.[0]
        if (file) {
            try {
                const payload = new FormData()
                payload.append("file_type", "pdf")
                payload.append("document", file)
                const response = await summarizeFiles(payload)
                if (response?.status === 202) {
                    setSelectedFile(file)
                } else {
                    setFileError(response?.response?.message || "Internal Server Error! Please upload again")
                }
                fileInputRef.current.value = ""
            } catch (error) {
                console.log(error)
            } finally {
                setUploadingStatus(false)
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
                {historyStatus && <aside
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
                                historyChatsStatus ? <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                                    <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
                                    <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-100" />
                                    <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                                </div> : <ul className="space-y-2">
                                    {filteredChats?.length > 0 && filteredChats.map((c) => {
                                        const isActive = c.conversation_id === activeChatId
                                        return (
                                            <li key={c.conversation_id}>
                                                <div
                                                    onClick={() =>
                                                        handleSelectChat(c.conversation_id)
                                                    }
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
                                                </div>
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
                </aside>}

                <main className="flex-1 flex flex-col">

                    <div
                        className="px-4 py-3 border-b rounded-tr-xl rounded- flex items-center gap-3"
                        style={{ borderColor: BRAND.border, backgroundColor: BRAND.white }}
                    >
                        <div onClick={() => setHistoryStatus(!historyStatus)} className="cursor-pointer">
                            <GiHamburgerMenu color="#313c61" />
                        </div>
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

                    {messagesStatus ? <Loader /> : messages?.length > 0 ? <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                    </div> : <div className="flex flex-col items-center justify-center h-full text-center text-sm text-gray-500">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="p-4 bg-gray-100 rounded-full">
                                <Bot className="w-12 h-12 text-[#475A90]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Start a conversation</h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Ask me anything or upload a document to get started.
                                </p>
                            </div>
                            <button
                                onClick={newChat}
                                className="px-4 py-2 text-sm font-medium text-white bg-[#475A90] cursor-pointer rounded-md hover:bg-[#4a61a1] transition"
                            >
                                Start typing...
                            </button>
                        </div>
                    </div>
                    }

                    {messages?.length > 0 && <div className="p-4 border-t rounded-br-xl" style={{ borderColor: BRAND.border, backgroundColor: BRAND.white }}>
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
                        {fileError && <div className="mb-2 flex items-center gap-2">
                            <p
                                className="inline-flex bg-red-200 text-red-500 items-center gap-2 px-2 py-1 rounded-md text-xs"
                            >
                                {fileError}
                            </p>
                        </div>}

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
                                    {uploadingStatus ? <span className="spinner" /> : <Paperclip className="w-4 h-4" />}
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
                    </div>}
                </main>
            </div>
        </div >
    )
}
