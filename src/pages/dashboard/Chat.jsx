import { Bot } from "lucide-react"
import { ChatInterface } from "../../components/ChatInterface"

function Chat() {
    return (
        <div className="flex flex-col h-full w-full p-3 overflow-auto">
            <div className="border-b border-slate-200 flex gap-4 items-center">
                <div className="text-emerald-700">
                    <Bot className="w-12 h-12" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 font-space-grotesk">AI Chat Assistant</h1>
                    <p className="text-slate-600 mt-1">Get instant help with your biotech operations and research tasks</p>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <ChatInterface />
            </div>
        </div>
    )
}

export default Chat
