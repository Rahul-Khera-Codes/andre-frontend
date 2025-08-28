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
        className="relative flex items-center justify-center p-2 rounded-md cursor-pointer transition"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {calendarNotificationsEvents.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#374A8C] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {calendarNotificationsEvents.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white shadow-xl border border-slate-200 rounded-md z-50">
          <div className="px-4 py-2 border-b border-slate-100 bg-slate-50">
            <p className="font-semibold text-sm text-slate-700">Upcoming Calendar Events</p>
          </div>

          <ul className="max-h-72 min-h-45 overflow-y-auto text-sm text-slate-700 divide-y divide-slate-100">
            {calendarNotificationsEvents.length > 0 ? (
              calendarNotificationsEvents.map((event) => (
                <li key={event.id} className="px-4 py-3 flex flex-col gap-1 hover:bg-slate-50 transition">
                  <div className="flex items-start gap-2">
                    <CalendarClock className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{event.subject}</p>
                      <p className="text-slate-500 text-sm">{event.bodyPreview}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock4 className="w-4 h-4" />
                      <span>{formatDate(event.start.dateTime)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location.displayName || "Online"}</span>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 h-45 flex justify-center items-center text-slate-500">
                {message || "No new calendar events"}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
