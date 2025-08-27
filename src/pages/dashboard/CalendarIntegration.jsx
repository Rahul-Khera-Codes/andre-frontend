import React, { useEffect, useState } from "react"
import {
    Bell,
    Calendar as CalendarIcon,
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
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("")
    const [calendarEvents, setCalendarEvents] = useState([])

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
            const matchesSearch =
                draft.subject?.toLowerCase()?.includes(searchQuery?.toLowerCase())
            return matchesSearch
        })
        setFilteredDrafts(data)
    }


    const fetchCalendarEvents = async () => {
        setLoading(true)
        setMessage("")
        try {
            const response = await getCalandarEvents()
            const mails = response?.data;
            console.log(mails)
            if (mails?.length > 0 && mails?.[0]?.event_id) {
                setCalendarEvents(mails)
            } else {
                setCalendarEvents([])
                setMessage(response?.response?.data?.error ?? response?.message ?? "No Calendar Events Found")
            }

        } catch (error) {
            console.log(error)
            setMessage("Network Connection Error")
        } finally {
            setLoading(false)
        }
    }

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

    const buttonsList = [{ label: "Complete", icon: CheckCircle2, key: "completed" }, { label: "Snooze", icon: Clock, key: "snoozed" }, { label: "Edit", icon: Edit3, key: "edit" }, { label: "Trigger", icon: Zap, key: "trigger" }, { label: "Delete", icon: Trash2, key: "delete" }]

    const priorityOptions = [{ label: "All", key: "all" }, { label: "High", key: "high" }, { label: "Medium", key: "medium" }, { label: "Low", key: "low" }]
    const CategoriesOptions = [{ label: "All", key: "all" }, { label: "Research", key: "research" }, { label: "Regulatory", key: "regulatory" }, { label: "Administrative", key: "administrative" }, { label: "Clinical", key: "clinical" }]

    const dropDownList = [{ options: priorityOptions, name: "priority", value: selectedPriority, updateValue: setSelectedPriority, extraName: "Priority" },
    { options: CategoriesOptions, name: "Categories", value: selectedCategory, updateValue: setSelectedCategory, extraName: "Categories" },
    ]

    return (
        <div className="space-y-6 h-full w-full p-3 overflow-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Calendar Events</h1>
                    <p className="text-slate-600 mt-1">Trigger task reminders via email, in-app alerts, or chat integrations</p>
                </div>
                <button onClick={() => setIsOpen(true)} className="flex items-center px-4 py-2 bg-green-800 cursor-pointer text-white rounded-lg hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" /> New Reminder
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 border border-gray-300 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="text-sm text-slate-600">Active Reminders</p>
                        <p className="text-2xl font-bold">{reminders.filter((r) => r.status === "active").length}</p>
                    </div>
                    <Bell className="w-8 h-8 text-blue-600" />
                </div>
                <div className="p-4 border border-gray-300 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="text-sm text-slate-600">Overdue</p>
                        <p className="text-2xl font-bold text-red-600">{reminders.filter((r) => r.status === "overdue").length}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <div className="p-4 border border-gray-300 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="text-sm text-slate-600">AI Generated</p>
                        <p className="text-2xl font-bold">{reminders.filter((r) => r.aiGenerated).length}</p>
                    </div>
                    <Bot className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="p-4 border border-gray-300 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="text-sm text-slate-600">Recurring</p>
                        <p className="text-2xl font-bold">{reminders.filter((r) => r.recurring).length}</p>
                    </div>
                    <Repeat className="w-8 h-8 text-purple-600" />
                </div>
            </div>
            <div className="p-4 border border-gray-300 rounded-lg flex gap-3">
                <div className="relative w-1/2">
                    <input
                        placeholder="Search Events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 border focus:border-green-500 focus:outline-none border-slate-200 rounded-lg w-full py-[9.5px] text-sm"
                    />
                    <Search className="absolute top-5 left-3 -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
                {/* {dropDownList.map((e) => (
                    <React.Fragment key={e.name}>
                        <SelectDropdown
                            name={e.name}
                            options={e.options}
                            value={e.value}
                            onChange={(updated) => {
                                e.updateValue(updated)
                            }}
                            placeholder="Select"
                            className="w-[167px]"
                            extraName={e.extraName}
                        />
                    </React.Fragment>
                ))} */}
            </div>
            <div className="space-y-4">
                <div className="space-y-4  scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 px-1">
                    {loading ? (
                        <div className="h-56 w-full flex justify-center items-center">
                            <Loader />
                        </div>
                    ) : !message ? (
                        filteredDrafts?.length > 0 ? filteredDrafts.map((draft) => (
                            <div
                                key={draft.event_id}
                                className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow duration-200 cursor-pointer"
                            >
                                <div className="flex justify-between">
                                    <div className="space-y-2 w-full">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">📄</span>
                                            <h3 className="font-semibold text-slate-800 line-clamp-2">
                                                {draft.subject || 'No Subject'}
                                            </h3>
                                        </div>

                                        <p className="text-sm text-slate-600 line-clamp-2">
                                            ✏️ {draft.body.content || 'No content provided'}
                                        </p>

                                        <div className="flex gap-4 text-sm text-slate-500">
                                            <div className="flex items-center gap-1">
                                                🕒 Start: {" "}
                                                {formatDate(draft.start?.dateTime)}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                ⏰ End: {" "}
                                                {formatDate(draft.end?.dateTime)}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 flex-wrap">
                                            <span className="px-2 py-1 text-xs rounded border bg-slate-50 text-slate-600">
                                                ⏰ Reminder: {draft.reminderMinutesBeforeStart} mins before
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        )) : <div className="border border-slate-300 rounded-lg p-6 text-center bg-slate-50">
                            <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">No Calendar Events Found</h3>
                        </div>
                    ) : (
                        <div className="border border-slate-300 rounded-lg p-6 text-center bg-slate-50">
                            <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">{message}</h3>
                        </div>
                    )}
                </div>
                {/* {filteredReminders.map((reminder) => (
                    <div key={reminder.id} className="p-4 border border-gray-300 rounded-lg hover:shadow-md">
                        <div className="flex justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    {getSourceIcon(reminder.sourceType)}
                                    {reminder.aiGenerated && <Bot className="w-4 h-4 text-emerald-600" />}
                                    <h3 className="font-semibold">{reminder.title}</h3>
                                </div>
                                <p className="text-sm text-slate-600">{reminder.description}</p>
                                <div className="flex gap-4 text-sm text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatDueDate(reminder.dueDate)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        {reminder.assignedTo.join(", ")}
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    <span className={`px-2 py-1 text-xs rounded ${getStatusColor(reminder.status)}`}>
                                        {reminder.status}
                                    </span>
                                    <span className={`px-2 py-1 text-xs rounded border ${getPriorityColor(reminder.priority)}`}>
                                        {reminder.priority}
                                    </span>
                                    <span className="px-2 py-1 text-xs rounded border">{reminder.category}</span>
                                </div>
                                <p className="text-xs text-slate-500">
                                    Reminders: {formatReminderTimes(reminder.reminderTimes)} before due date
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                {buttonsList.map((e) => {
                                    const Icon = e.icon;
                                    return (
                                        <button key={e.key} onClick={() => handleStatusChange(reminder.id, `${e.key}`)} className={`px-3 text-left flex items-center py-1 text-sm border rounded ${e.key === "delete" ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-gray-300 hover:bg-slate-100'}`}>
                                            <Icon className="w-4 h-4 inline mr-1" /> {e.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredReminders.length === 0 && (
                    <div className="p-8 text-center border border-gray-300 rounded-lg">
                        <Bell className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold">No reminders found</p>
                        <p className="text-slate-500 text-sm">Try adjusting filters or create a new reminder.</p>
                    </div>
                )} */}
                {isOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-h-[90vh] overflow-auto max-w-2xl p-6 space-y-6">
                            <div className="text-xl font-semibold">Create New Reminder</div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">Title</label>
                                    <input
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        value={newReminder.title}
                                        onChange={(e) =>
                                            setNewReminder((prev) => ({ ...prev, title: e.target.value }))
                                        }
                                        placeholder="Reminder title..."
                                    />
                                </div>
                                <div className="space-y-2 pt-1">
                                    <CustomDatePicker value={newReminder.dueDate} onChange={(updated) => {
                                        setNewReminder((prev) => ({ ...prev, dueDate: updated }))
                                    }} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Description</label>
                                <textarea
                                    rows={3}
                                    className="w-full rounded-md border focus:outline-none resize-none focus:ring-1 focus:ring-green-500 border-gray-300 px-3 py-2"
                                    value={newReminder.description}
                                    onChange={(e) =>
                                        setNewReminder((prev) => ({ ...prev, description: e.target.value }))
                                    }
                                    placeholder="Detailed description of the reminder..."
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">Priority</label>
                                    <SelectDropdown
                                        name="priority"
                                        options={[{ label: "High", key: "high" }, { label: "Medium", key: "medium" }, { label: "Low", key: "low" }]}
                                        value={newReminder.priority}
                                        onChange={(updated) => {
                                            setNewReminder((prev) => ({ ...prev, priority: updated }))
                                        }}
                                        placeholder="Select"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">Category</label>
                                    <SelectDropdown
                                        name="category"
                                        options={[{ label: "Research", key: "research" }, { label: "Regulatory", key: "regulatory" }, { label: "Administrative", key: "administrative" }, { label: "Clinical", key: "clinical" }]}
                                        value={newReminder.category}
                                        onChange={(updated) => {
                                            setNewReminder((prev) => ({ ...prev, category: updated }))
                                        }}
                                        placeholder="Select"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-sm font-medium">Delivery Methods</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { key: "email", label: "Email", icon: Mail },
                                        { key: "in-app", label: "In-App", icon: Bell },
                                        { key: "teams", label: "Teams", icon: Users },
                                        { key: "slack", label: "Slack", icon: MessageSquare },
                                    ].map(({ key, label, icon: Icon }) => (
                                        <label key={key} className="flex w-fit items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newReminder.deliveryMethods.includes(key)}
                                                onChange={() => toggleDeliveryMethod(key)}
                                                className="w-4 h-4 accent-green-700"
                                                style={{ borderRadius: "20px" }}
                                            />
                                            <Icon className="w-4 h-4" />
                                            <span>{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    className="accent-green-700 w-4 h-4 "
                                    type="checkbox"
                                    checked={newReminder.recurring}
                                    onChange={(e) =>
                                        setNewReminder((prev) => ({ ...prev, recurring: e.target.checked }))
                                    }
                                />
                                <span>Recurring reminder</span>
                                {newReminder.recurring && (
                                    <SelectDropdown
                                        name="recurring"
                                        options={[{ label: "Daily", key: "daily" }, { label: "Weekly", key: "weekly" }, { label: "Monthly", key: "monthly" }, { label: "Yearly", key: "yearly" }]}
                                        value={newReminder.recurringPattern}
                                        onChange={(updated) => {
                                            setNewReminder((prev) => ({ ...prev, recurringPattern: updated }))
                                        }}
                                        placeholder="Select"
                                        className="w-[110px]"
                                    />
                                )}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    className="px-4 py-2 border border-gray-300 cursor-pointer rounded-md"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-green-800 cursor-pointer text-white rounded-md"
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
