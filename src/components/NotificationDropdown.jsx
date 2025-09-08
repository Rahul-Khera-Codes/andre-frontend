import { useState, useRef, useEffect } from "react"
import { Bell, CalendarClock, MapPin, Clock4 } from "lucide-react"
import { getCalandarEventsNotifications } from "../apis/calendarIntegration"

function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const [calendarNotificationsEvents, setCalendarNotificationsEvents] = useState([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchCalendarEvents = async () => {
    try {
      const response = await getCalandarEventsNotifications()
      const mails = response?.data
      if (mails?.length > 0 && mails?.[0]?.id) {
        setCalendarNotificationsEvents(mails)
        setMessage("")
      } else {
        setCalendarNotificationsEvents([])
        setMessage(response?.response?.data?.error ?? response?.message ?? "No events found.")
      }
    } catch (error) {
      console.log(error)
      setMessage("Error fetching calendar events.")
    }
  }

  useEffect(() => {
    fetchCalendarEvents()

    const intervalId = setInterval(() => {
      fetchCalendarEvents()
    }, 60000)

    return () => clearInterval(intervalId)
  }, [])

  const formatDate = (dateTimeStr) => {
    const date = new Date(dateTimeStr)
    return date.toLocaleString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
    })
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex bg-[#ffffff83] items-center justify-center p-3 rounded-xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <Bell className="w-5 h-5 text-gray-800" />
        {calendarNotificationsEvents.length > 0 && (
          <span className="absolute -top-1 -right-1  bg-[#6D75A2] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
            {calendarNotificationsEvents.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="sm:absolute fixed right-0 mt-2 sm:w-96 w-full bg-gradient-to-br from-white to-blue-50 shadow-2xl border border-blue-200 rounded-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-blue-100 bg-gradient-to-r from-blue-500 to-cyan-500">
            <p className="font-semibold text-sm text-white flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Upcoming Calendar Events
            </p>
          </div>

          <ul className="max-h-72 min-h-45 overflow-y-auto text-sm text-slate-700 divide-y divide-blue-100">
            {calendarNotificationsEvents.length > 0 ? (
              calendarNotificationsEvents.map((event) => (
                <li
                  key={event.id}
                  className="px-4 py-3 flex flex-col gap-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 border-l-4 border-transparent hover:border-blue-400"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                      <CalendarClock className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{event.subject}</p>
                      <p className="text-slate-600 text-sm">{event.bodyPreview}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-purple-100 to-pink-100 px-2 py-1 rounded-full">
                      <div className="p-1 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                        <Clock4 className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-purple-700 font-medium">{formatDate(event.start.dateTime)}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-gradient-to-r  from-green-100 to-emerald-100 px-2 py-1 rounded-full">
                      <div className="p-1 bg-gradient-to-br from-green-500 to-emerald-500  rounded-full">
                        <MapPin className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-green-700 font-medium">{event.location.displayName || "Online"}</span>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-8 h-45 flex flex-col justify-center items-center text-slate-500">
                <div className="p-4 bg-gradient-to-br from-gray-100 to-slate-100 rounded-full mb-3">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-center">{message || "No new calendar events"}</p>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
