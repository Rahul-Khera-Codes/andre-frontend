import { Bot } from "lucide-react"
import { ChatInterface } from "../../components/ChatInterface"
import Header from "../../components/Header"

function Chat() {
    return (
        <div className="space-y-6 h-full overflow-auto p-3 bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <Header header={`AI Chat Assistant`} description={"Get instant help with your biotech operations and research tasks"} />
            <div className="flex-1 h-full overflow-hidden">
                <ChatInterface />
            </div>
        </div>
    )
}

export default Chat
