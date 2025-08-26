import { useState, useRef, useEffect } from "react"
import {
  User,
  Settings,
  Shield,
  LogOut,
  Bell,
  HelpCircle,
  ChevronDown,
  UserCircle,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { discardData } from "../store/profileSlice"

function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState({})
  const dropdownRef = useRef(null)
  const userDetails = useSelector((state) => state.profile)
  const dispatch = useDispatch()

  const navigate = useNavigate()

  useEffect(() => {
    if (userDetails?.user) {
      const details = userDetails?.user;
      setUser({
        name: details?.given_name?.[0].toUpperCase() + details?.given_name?.slice(1) + " " + details?.surname?.[0].toUpperCase() + details?.surname?.slice(1),
        email: details?.mail_id,
        avatar: "https://picsum.photos/seed/picsum/200/300",
      })
    }

  }, [userDetails])

  const handleLogout = () => {
    navigate("/")
    dispatch(discardData())
    localStorage.clear()
  }

  const getRoleBadgeColor = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "senior researcher":
        return "bg-blue-100 text-blue-800"
      case "researcher":
        return "bg-green-100 text-green-800"
      case "regulatory":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-auto p-2 rounded-md cursor-pointer transition"
      >
        {/* <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
          <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
        </div> */}
        <UserCircle className="text-slate-600"/>
        {/* <div className="hidden md:block text-left">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-slate-500">{user.role}</p>
        </div> */}
        <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"
          }`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg border border-slate-200 rounded-md z-50">
          <div className="px-4 py-2 border-b border-slate-100">
            <div className="flex items-center gap-3">
              {/* <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              </div> */}
              <UserCircle className="text-slate-600"/>
              <div className="flex-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
                {/* <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${getRoleBadgeColor(
                    user.role
                  )}`}
                >
                  {user.role}
                </span> */}
              </div>
            </div>
          </div>

          <ul className="py-1 text-sm text-slate-700">
            {/* <li className="px-4 py-2 hover:bg-slate-100 flex items-center cursor-pointer">
              <User className="w-4 h-4 mr-2" /> Profile Settings
            </li> */}
            {/* <li className="px-4 py-2 hover:bg-slate-100 flex items-center cursor-pointer">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              <span className="ml-auto text-xs bg-slate-200 px-2 py-0.5 rounded-full">3</span>
            </li>
            <li className="px-4 py-2 hover:bg-slate-100 flex items-center cursor-pointer">
              <Settings className="w-4 h-4 mr-2" /> Preferences
            </li>
            <li className="px-4 py-2 hover:bg-slate-100 flex items-center cursor-pointer">
              <Shield className="w-4 h-4 mr-2" /> Security & Privacy
            </li> */}
            {/* <li className="border-t border-slate-100 px-4 py-2 hover:bg-slate-100 flex items-center cursor-pointer">
              <HelpCircle className="w-4 h-4 mr-2" /> Help & Support
            </li> */}
            <li
              onClick={handleLogout}
              className="border-t border-slate-100 px-4 py-2 hover:bg-red-100 text-red-600 flex items-center cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown