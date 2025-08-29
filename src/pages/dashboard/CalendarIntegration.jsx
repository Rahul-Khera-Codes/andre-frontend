import { useEffect, useState } from "react"
import {
  Bell,
  CalendarIcon,
  Clock,
  Mail,
  MessageSquare,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Repeat,
  Bot,
  Users,
  Zap,
  Search,
} from "lucide-react"
import { format } from "date-fns"
import { SelectDropdown } from "../../components/CustomDropDown"
import CustomDatePicker from "../../components/CustomCalendar"
import { getCalandarEvents } from "../../apis/calendarIntegration"
import Loader from "../../components/loader"

const mockReminders = [
  {
    id: "1",
    title: "IRB Protocol Submission Deadline",
    description: "Submit Phase II clinical trial protocol to IRB for review. All documentation must be complete.",
    dueDate: "2024-01-18T17:00:00Z",
    priority: "high",
    category: "regulatory",
    status: "active",
    deliveryMethods: ["email", "in-app", "teams"],
    recurring: false,
    aiGenerated: true,
    sourceType: "email",
    sourceId: "email-123",
    reminderTimes: [1440, 720, 60],
    assignedTo: ["Dr. Smith", "Regulatory Team"],
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Weekly Lab Safety Meeting",
    description: "Mandatory weekly safety meeting to discuss protocols and any incidents.",
    dueDate: "2024-01-19T09:00:00Z",
    priority: "medium",
    category: "administrative",
    status: "active",
    deliveryMethods: ["in-app", "slack"],
    recurring: true,
    recurringPattern: "weekly",
    aiGenerated: false,
    sourceType: "calendar",
    sourceId: "cal-456",
    reminderTimes: [60, 15],
    assignedTo: ["All Staff"],
    createdAt: "2024-01-10T14:30:00Z",
    lastTriggered: "2024-01-12T08:45:00Z",
  },
]

function CalendarManagement() {
  const [reminders, setReminders] = useState(mockReminders)
  const [selectedTab, setSelectedTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [calendarEvents, setCalendarEvents] = useState([])
  const [pageLoading, setPageLoading] = useState(true)

  const [filteredDrafts, setFilteredDrafts] = useState([])
  const [newReminder, setNewReminder] = useState({
    title: "",
    dueDate: new Date(),
    description: "",
    priority: "medium",
    category: "research",
    deliveryMethods: [],
    recurring: false,
    recurringPattern: "daily",
  })

  const toggleDeliveryMethod = (key) => {
    setNewReminder((prev) => ({
      ...prev,
      deliveryMethods: prev.deliveryMethods.includes(key)
        ? prev.deliveryMethods.filter((m) => m !== key)
        : [...prev.deliveryMethods, key],
    }))
  }

  const handleCreateReminder = () => {
    console.log("Reminder created:", newReminder)
    setIsOpen(false)
  }

  useEffect(() => {
    (function () {
      const id = setTimeout(() => {
        setPageLoading(false)
      }, 1000)
      return () => clearTimeout(id)
    }())

  }, [])

  const filteredReminders = reminders.filter((reminder) => {
    const matchesTab = selectedTab === "all" || reminder.status === selectedTab
    const matchesSearch =
      reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reminder.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || reminder.category === selectedCategory
    const matchesPriority = selectedPriority === "all" || reminder.priority === selectedPriority
    return matchesTab && matchesSearch && matchesCategory && matchesPriority
  })

  function filteredData() {
    const data = calendarEvents.filter((draft) => {
      const matchesSearch = draft.subject?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      return matchesSearch
    })
    setFilteredDrafts(data)
  }

  const fetchCalendarEvents = async () => {
    setLoading(true)
    setMessage("")
    try {
      const response = await getCalandarEvents()
      const mails = response?.data
      console.log(mails)
      if (mails?.length > 0 && mails?.[0]?.event_id) {
        setCalendarEvents(mails)
      } else {
        setCalendarEvents([])
        setLoading(false)
        setMessage(response?.response?.data?.error ?? response?.message ?? "No Calendar Events Found")
      }
    } catch (error) {
      console.log(error)
      setMessage("Network Connection Error")
      setLoading(false)
    }
  }

  useEffect(() => {
    if (filteredDrafts?.length > 0) {
      setLoading(false)
    }
  }, [filteredDrafts])

  useEffect(() => {
    filteredData()
  }, [searchQuery, calendarEvents])

  useEffect(() => {
    fetchCalendarEvents()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "snoozed":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSourceIcon = (sourceType) => {
    switch (sourceType) {
      case "calendar":
        return <CalendarIcon className="w-4 h-4" />
      case "email":
        return <Mail className="w-4 h-4" />
      case "manual":
        return <Edit3 className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const formatDueDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60))
    if (diffHours < 0) return "Overdue"
    if (diffHours < 24) return `${diffHours}h remaining`
    if (diffHours < 48) return "Tomorrow"
    return format(date, "MMM d, yyyy 'at' h:mm a")
  }

  const formatReminderTimes = (times) =>
    times
      .map((minutes) => {
        if (minutes < 60) return `${minutes}m`
        if (minutes < 1440) return `${Math.floor(minutes / 60)}h`
        return `${Math.floor(minutes / 1440)}d`
      })
      .join(", ")

  const handleStatusChange = (reminderId, newStatus) => {
    setReminders((prev) =>
      prev.map((reminder) => (reminder.id === reminderId ? { ...reminder, status: newStatus } : reminder)),
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const buttonsList = [
    { label: "Complete", icon: CheckCircle2, key: "completed" },
    { label: "Snooze", icon: Clock, key: "snoozed" },
    { label: "Edit", icon: Edit3, key: "edit" },
    { label: "Trigger", icon: Zap, key: "trigger" },
    { label: "Delete", icon: Trash2, key: "delete" },
  ]

  const priorityOptions = [
    { label: "All", key: "all" },
    { label: "High", key: "high" },
    { label: "Medium", key: "medium" },
    { label: "Low", key: "low" },
  ]
  const CategoriesOptions = [
    { label: "All", key: "all" },
    { label: "Research", key: "research" },
    { label: "Regulatory", key: "regulatory" },
    { label: "Administrative", key: "administrative" },
    { label: "Clinical", key: "clinical" },
  ]

  const dropDownList = [
    {
      options: priorityOptions,
      name: "priority",
      value: selectedPriority,
      updateValue: setSelectedPriority,
      extraName: "Priority",
    },
    {
      options: CategoriesOptions,
      name: "Categories",
      value: selectedCategory,
      updateValue: setSelectedCategory,
      extraName: "Categories",
    },
  ]

  if (pageLoading) return <Loader />

  return (
    <div className="space-y-6 h-full w-full p-3 overflow-auto bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="flex items-center justify-between bg-gradient-to-r from-[#6e80b6] to-[#9fb4f2] p-6 rounded-2xl text-white shadow-lg">
        <div>
          <h1 className="text-3xl font-serif font-bold">Calendar Events</h1>
          <p className="text-purple-100 mt-1">Trigger task reminders via email, in-app alerts, or chat integrations</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-[#374A8C] to-[#374A8C] cursor-pointer text-white rounded-xl hover:from-[#5876df] hover:to-[#708ae8] shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" /> New Reminder
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {
          [{ label: "Active Reminders", key: "active", icon: Bell, gradientColor: `from-blue-500 to-blue-600` },
          { label: "Overdue", key: "overdue", icon: AlertTriangle, gradientColor: `from-red-500 to-pink-500` },
          { label: "AI Generated", key: "ai_generated", icon: Bot, gradientColor: `from-emerald-500 to-green-500` },
          { label: "Recurring", key: "recurring", icon: Repeat, gradientColor: `from-purple-500 to-indigo-500` }].map((each) => {
            const Icon = each.icon
            return (
              <div key={each.key} className="p-6 transform hover:scale-105 transition-all duration-200 rounded-2xl flex justify-between items-center text-black shadow-xl hover:shadow-xl">
                <div>
                  <p className="text-sm text-gray-800">{each.label}</p>
                  <p className="text-3xl font-bold">0</p>
                </div>
                <div className={`bg-black/20 bg-gradient-to-br ${each.gradientColor} p-2 rounded-xl`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
            )
          })
        }
      </div>

      <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 flex gap-3">
        <div className="relative w-1/2">
          <input
            placeholder="Search Events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 border-2 border-gray-200 focus:border-gradient-to-r focus:from-purple-400 focus:to-blue-400 focus:outline-none rounded-xl w-full py-3 text-sm bg-gray-50 focus:bg-white transition-all duration-200"
          />
          <div className="absolute top-1/2 left-4 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-blue-500 p-1.5 rounded-lg">
            <Search className="text-white w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="space-y-4 gap-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 px-1">
          {loading ? (
            <div className="h-56 w-full">
              <Loader />
            </div>
          ) : !message ? (
            filteredDrafts?.length > 0 ? (
              <div className="space-y-4 gap-2 grid md:grid-cols-2">
                {filteredDrafts.map((email) => (
                  <div
                    key={email.event_id}
                    className={`bg-gradient-to-br flex flex-col gap-2 from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-purple-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1
                  `}
                  >
                    <div className="">
                      <p className="font-semibold text-gray-800">{email?.subject}</p>
                      <p className="text-sm text-gray-600">To: {email?.to_recipient_emails?.[0]}</p>
                    </div>
                    <div className="flex justify-between items-center gap-3">
                      <div className="flex gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-3 py-2 rounded-lg">
                          <span className="font-medium">Start: {formatDate(email.start?.dateTime)}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-2 rounded-lg">
                          <span className="font-medium">End: {formatDate(email.end?.dateTime)}</span>
                        </div>
                      </div>

                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 border border-indigo-200 font-medium">
                        ⏰ Reminder: {email.reminderMinutesBeforeStart} mins before
                      </span>
                    </div>
                  </div>
                ))}</div>
            ) : (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                <div className="bg-gradient-to-r from-gray-400 to-gray-500 p-4 rounded-2xl w-fit mx-auto mb-4">
                  <Mail className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Calendar Events Found</h3>
              </div>
            )
          ) : (
            <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-dashed border-red-200 rounded-2xl p-8 text-center">
              <div className="bg-gradient-to-r from-red-400 to-pink-500 p-4 rounded-2xl w-fit mx-auto mb-4">
                <Mail className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">{message}</h3>
            </div>
          )}
        </div>

        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl w-full max-h-[90vh] overflow-auto max-w-2xl p-8 space-y-6 border border-gray-200">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Create New Reminder
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Title</label>
                  <input
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Reminder title..."
                  />
                </div>
                <div className="space-y-2 pt-1">
                  <CustomDatePicker
                    value={newReminder.dueDate}
                    onChange={(updated) => {
                      setNewReminder((prev) => ({ ...prev, dueDate: updated }))
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  rows={3}
                  className="w-full rounded-xl border-2 border-gray-200 focus:outline-none resize-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 px-4 py-3 transition-all duration-200"
                  value={newReminder.description}
                  onChange={(e) => setNewReminder((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the reminder..."
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Priority</label>
                  <SelectDropdown
                    name="priority"
                    options={[
                      { label: "High", key: "high" },
                      { label: "Medium", key: "medium" },
                      { label: "Low", key: "low" },
                    ]}
                    value={newReminder.priority}
                    onChange={(updated) => {
                      setNewReminder((prev) => ({ ...prev, priority: updated }))
                    }}
                    placeholder="Select"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Category</label>
                  <SelectDropdown
                    name="category"
                    options={[
                      { label: "Research", key: "research" },
                      { label: "Regulatory", key: "regulatory" },
                      { label: "Administrative", key: "administrative" },
                      { label: "Clinical", key: "clinical" },
                    ]}
                    value={newReminder.category}
                    onChange={(updated) => {
                      setNewReminder((prev) => ({ ...prev, category: updated }))
                    }}
                    placeholder="Select"
                    className="w-full"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">Delivery Methods</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "email", label: "Email", icon: Mail, color: "from-blue-500 to-blue-600" },
                    { key: "in-app", label: "In-App", icon: Bell, color: "from-purple-500 to-purple-600" },
                    { key: "teams", label: "Teams", icon: Users, color: "from-green-500 to-green-600" },
                    { key: "slack", label: "Slack", icon: MessageSquare, color: "from-pink-500 to-pink-600" },
                  ].map(({ key, label, icon: Icon, color }) => (
                    <label
                      key={key}
                      className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                    >
                      <input
                        type="checkbox"
                        checked={newReminder.deliveryMethods.includes(key)}
                        onChange={() => toggleDeliveryMethod(key)}
                        className="w-5 h-5 accent-purple-600 rounded"
                      />
                      <div className={`bg-gradient-to-r ${color} p-2 rounded-lg`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <input
                  className="accent-purple-600 w-5 h-5"
                  type="checkbox"
                  checked={newReminder.recurring}
                  onChange={(e) => setNewReminder((prev) => ({ ...prev, recurring: e.target.checked }))}
                />
                <span className="font-medium text-gray-700">Recurring reminder</span>
                {newReminder.recurring && (
                  <SelectDropdown
                    name="recurring"
                    options={[
                      { label: "Daily", key: "daily" },
                      { label: "Weekly", key: "weekly" },
                      { label: "Monthly", key: "monthly" },
                      { label: "Yearly", key: "yearly" },
                    ]}
                    value={newReminder.recurringPattern}
                    onChange={(updated) => {
                      setNewReminder((prev) => ({ ...prev, recurringPattern: updated }))
                    }}
                    placeholder="Select"
                    className="w-[110px]"
                  />
                )}
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  className="px-6 py-3 border-2 border-gray-300 cursor-pointer rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 cursor-pointer text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 shadow-lg transform hover:scale-105 transition-all duration-200"
                  onClick={handleCreateReminder}
                >
                  Create Reminder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CalendarManagement
