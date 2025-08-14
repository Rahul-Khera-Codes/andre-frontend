import {
  Mail,
  CheckSquare,
  FileText,
  BarChart3,
  Calendar,
  Bot,
  Archive,
  Settings,
  Shield,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const navigationItems = [
  { icon: Mail, label: "Email Automation", count: 12, href: "#" },
  { icon: CheckSquare, label: "Task Management", count: 8, href: "task-management" },
  { icon: FileText, label: "Document Review", count: 3, href: "#" },
  { icon: Bot, label: "AI Drafts", count: 5, href: "ai-draft" },
  { icon: Calendar, label: "Calendar Integration", href: "#" },
  { icon: BarChart3, label: "Analytics", href: "#" },
  { icon: Archive, label: "Archive", href: "#" },
  { icon: Shield, label: "Security", href: "#" },
  { icon: Settings, label: "Settings", href: "#" },
]

function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside className="w-full h-full overflow-auto bg-white border-r border-slate-200">
      <div className="p-6">
        <p className="text-sm text-slate-600 mb-6">
          Harnessing AI for Seamless Research Management
        </p>

        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <div
              key={item.label}
              onClick={() => navigate(item.href)}
              className="flex items-center w-full h-11 px-3 cursor-pointer rounded-md hover:bg-slate-100 transition"
            >
              <item.icon className="w-5 h-5 mr-3 text-slate-700" />
              <span className="flex-1 text-[15px] text-left text-slate-800">{item.label}</span>
              {item.count && (
                <span className="text-xs bg-slate-100 border border-slate-300 text-slate-700 px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
