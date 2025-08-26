import { useState, useRef, useEffect } from "react"
import { Bell, AlertCircle, Info, CheckCircle } from "lucide-react"

function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const notifications = [
    { id: 1, type: "info", message: "Your profile was updated successfully.", time: "2 mins ago" },
    { id: 2, type: "warning", message: "Password will expire in 5 days.", time: "1 hour ago" },
    { id: 3, type: "success", message: "New research paper approved.", time: "Yesterday" },
  ]

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

  const getIcon = (type) => {
    switch (type) {
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Info className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center p-2 rounded-md cursor-pointer transition"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg border border-slate-200 rounded-md z-50">
          <div className="px-4 py-2 border-b border-slate-100">
            <p className="font-semibold text-sm">Notifications</p>
          </div>
          <ul className="max-h-60 overflow-y-auto text-sm text-slate-700 divide-y divide-slate-100">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li key={notification.id} className="px-4 py-3 flex gap-3 items-start hover:bg-slate-50">
                  {getIcon(notification.type)}
                  <div className="flex-1">
                    <p>{notification.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-center text-slate-500">No new notifications</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
