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
  File,
} from "lucide-react"
import { TbBrandGoogleDrive } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom"
import logo from '../assets/logo.png'
import { ImCancelCircle } from "react-icons/im";

const navigationItems = [
  { icon: Mail, label: "Email Automation", count: 12, href: "ai-draft" },
  // { icon: CheckSquare, label: "Task Management", count: 8, href: "task-management" },
  // { icon: FileText, label: "Document Review", count: 3, href: "#" },
  // { icon: Bot, label: "AI Drafts", count: 5, href: "ai-draft" },
  { icon: Calendar, label: "Calendar Integration", href: "calendar-management" },
  // { icon: File, label: "Upload File", href: "upload-file" },
  // { icon: BarChart3, label: "Analytics", href: "#" },
  // { icon: Archive, label: "Archive", href: "#" },
  // { icon: Shield, label: "Security", href: "#" },
  { icon: MessageCircle, label: "Chat App", href: "chat" },
  { icon: TbBrandGoogleDrive, label: "Drive", href: "drive" },
  // { icon: Settings, label: "Settings", href: "settings" },
]

function Sidebar({ openSidebar, showSidebar, setShowSidebar }) {
  const navigate = useNavigate();
  const path = useLocation();
  function currentPath() {
    const currentPaths = path.pathname.split("/");
    const data = currentPaths[currentPaths?.length - 1]
    return data
  }

  return (
    <aside className={`h-full ${showSidebar ? 'fixed w-[250px] top-0' : 'w-full'} overflow-auto bg-white border-r border-slate-200`}>
      <div className={openSidebar ? 'p-4' : 'p-2'}>
        {showSidebar && <>

          <div className="right-2 absolute mb-3">
            <ImCancelCircle className="cursor-pointer" onClick={() => setShowSidebar(false)} />
          </div>

          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <div className="w-45">
              <img src={logo} alt="logo" className="object-cover" />
            </div>
          </div>
          <hr className="mt-2 pb-2 text-slate-400" />
        </>}


        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <div
              key={item.label}
              onClick={() => {
                navigate(item.href)
                showSidebar && setShowSidebar(false)

              }}
              className={`relative flex items-center w-full h-11 ${(openSidebar || showSidebar) ? 'px-3' : 'justify-center'} cursor-pointer rounded-t-md transition
  ${currentPath() === item.href
                  ? 'bg-slate-200 after:content-[""] after:absolute after:bottom-0 after:left-0 after:rounded-b-md after:w-full after:h-[2px] after:bg-gradient-to-r after:from-[#374A8C] after:to-[#73B1DE]'
                  : 'hover:bg-slate-100'}`}
            >
              <item.icon className={`w-5 h-5 ${(openSidebar || showSidebar) && 'mr-3'} text-slate-700`} />
              {(openSidebar || showSidebar) && <span className="flex-1 text-[15px] text-left text-slate-800">{item.label}</span>}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
