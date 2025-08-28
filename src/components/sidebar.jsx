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
  MessageCircle,
} from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

const navigationItems = [
  { icon: Mail, label: "Email Automation", count: 12, href: "ai-draft" },
  // { icon: CheckSquare, label: "Task Management", count: 8, href: "task-management" },
  // { icon: FileText, label: "Document Review", count: 3, href: "#" },
  // { icon: Bot, label: "AI Drafts", count: 5, href: "ai-draft" },
  { icon: Calendar, label: "Calendar Integration", href: "calendar-management" },
  // { icon: BarChart3, label: "Analytics", href: "#" },
  // { icon: Archive, label: "Archive", href: "#" },
  // { icon: Shield, label: "Security", href: "#" },
  // { icon: MessageCircle, label: "Chat App", href: "chat" },
  // { icon: Settings, label: "Settings", href: "settings" },
]

function Sidebar({ openSidebar }) {
  const navigate = useNavigate();
  const path = useLocation();
  function currentPath() {
    const currentPaths = path.pathname.split("/");
    const data = currentPaths[currentPaths?.length - 1]
    return data
  }

  return (
    <aside className="w-full h-full overflow-auto bg-white border-r border-slate-200">
      <div className={openSidebar ? 'p-4' : 'p-2'}>
        {/* <p className="text-sm text-slate-600 mb-6">
          Harnessing AI for Seamless Research Management
        </p> */}

        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <div
              key={item.label}
              onClick={() => navigate(item.href)}
              className={`relative flex items-center w-full h-11 ${openSidebar ? 'px-3' : 'justify-center'} cursor-pointer rounded-t-md transition
  ${currentPath() === item.href
                  ? 'bg-slate-200 after:content-[""] after:absolute after:bottom-0 after:left-0 after:rounded-b-md after:w-full after:h-[2px] after:bg-gradient-to-r after:from-[#374A8C] after:to-[#73B1DE]'
                  : 'hover:bg-slate-100'}`}
            >
              <item.icon className={`w-5 h-5 ${openSidebar && 'mr-3'} text-slate-700`} />
              {openSidebar && <span className="flex-1 text-[15px] text-left text-slate-800">{item.label}</span>}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
