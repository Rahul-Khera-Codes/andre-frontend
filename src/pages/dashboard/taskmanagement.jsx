import React, { useState } from "react"
import {
  Mail,
  Search,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  User,
  MoreHorizontal,
  Archive,
  Star,
  Reply,
} from "lucide-react"
import { SelectDropdown } from "../../components/CustomDropDown"

const mockTasks = [
  {
    id: "1",
    subject: "IRB Protocol Review Required - Phase II Clinical Trial",
    sender: "regulatory@biotech.com",
    priority: "high",
    status: "pending",
    category: "regulatory",
    dueDate: "2024-01-15T15:00:00Z",
    description:
      "Review and approve the updated protocol for the Phase II clinical trial before submission to the IRB.",
    aiGenerated: true,
    starred: true,
  },
  {
    id: "2",
    subject: "Lab Equipment Calibration Schedule",
    sender: "facilities@biotech.com",
    priority: "medium",
    status: "in-progress",
    category: "administrative",
    dueDate: "2024-01-16T09:00:00Z",
    description: "Coordinate with facilities team to schedule quarterly calibration of all lab equipment.",
    aiGenerated: false,
    starred: false,
  },
  {
    id: "3",
    subject: "Research Data Analysis - Q4 Results",
    sender: "data@biotech.com",
    priority: "high",
    status: "pending",
    category: "research",
    dueDate: "2024-01-17T17:00:00Z",
    description: "Complete statistical analysis of Q4 research data and prepare summary report.",
    aiGenerated: true,
    starred: false,
  },
  {
    id: "4",
    subject: "Patient Recruitment Update Meeting",
    sender: "clinical@biotech.com",
    priority: "medium",
    status: "completed",
    category: "clinical",
    dueDate: "2024-01-14T14:00:00Z",
    description: "Weekly meeting to discuss patient recruitment progress and address any challenges.",
    aiGenerated: false,
    starred: false,
  },
  {
    id: "5",
    subject: "FDA Correspondence Review",
    sender: "regulatory@biotech.com",
    priority: "high",
    status: "pending",
    category: "regulatory",
    dueDate: "2024-01-18T12:00:00Z",
    description: "Review and respond to recent FDA correspondence regarding drug approval process.",
    aiGenerated: true,
    starred: true,
  },
]

function TaskManagement() {
  const [tasks, setTasks] = useState(mockTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedTasks, setSelectedTasks] = useState([])
  const [activeTab, setActiveTab] = useState("list")

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.sender.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority
    const matchesCategory = selectedCategory === "all" || task.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || task.status === selectedStatus
    return matchesSearch && matchesPriority && matchesCategory && matchesStatus
  })

  const toggleTaskSelection = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    )
  }

  const toggleTaskStatus = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === "completed" ? "pending" : "completed" }
          : task
      )
    )
  }

  const toggleStarred = (taskId) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, starred: !task.starred } : task))
    )
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200"
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case "research":
        return "bg-blue-100 text-blue-800"
      case "regulatory":
        return "bg-purple-100 text-purple-800"
      case "administrative":
        return "bg-gray-100 text-gray-800"
      case "clinical":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "pending":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const formatDueDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60))
    if (diffHours < 0) return "Overdue"
    if (diffHours < 24) return `${diffHours}h remaining`
    if (diffHours < 48) return "Tomorrow"
    return date.toLocaleDateString()
  }

  const priorityOptions = [{ label: "All", key: "all" }, { label: "High", key: "high" }, { label: "Medium", key: "medium" }, { label: "Low", key: "low" }]
  const CategoriesOptions = [{ label: "All", key: "all" }, { label: "Research", key: "research" }, { label: "Regulatory", key: "regulatory" }, { label: "Administrative", key: "administrative" }, { label: "Clinical", key: "clinical" }]
  const StatusOptions = [{ label: "All", key: "all" }, { label: "Pending", key: "pending" }, { label: "In Progress", key: "in_progress" }, { label: "Completed", key: "completed" }]

  const dropDownList = [{ options: priorityOptions, name: "priority", value: selectedPriority, updateValue: setSelectedPriority, extraName: "Priority" },
  { options: CategoriesOptions, name: "Categories", value: selectedCategory, updateValue: setSelectedCategory, extraName: "Categories" },
  { options: StatusOptions, name: "Status", value: selectedStatus, updateValue: setSelectedStatus, extraName: "Status" }
  ]

  return (
    <div className="space-y-6 p-3 h-full w-full overflow-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Tasks Management</h1>
          <p className="text-slate-600 mt-1">Manage tasks efficiently to keep your research on track</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="border border-slate-300 cursor-pointer px-3 py-2 rounded flex items-center text-sm">
            <Archive className="w-4 h-4 mr-2" /> Archive Selected
          </button>
          <button className="bg-green-700 text-white px-3 py-2 rounded flex items-center text-sm cursor-pointer hover:bg-green-800">
            <Mail className="w-4 h-4 mr-2" /> New Task
          </button>
        </div>
      </div>
      <div className="bg-white border border-slate-300 rounded p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              placeholder="Search tasks, senders, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border focus:ring-green-700 focus:outline-none focus:ring-1 border-slate-300 rounded w-full py-2 text-sm"
            />
          </div>
          <div className="flex gap-3">
            {dropDownList.map((e) => (
              <React.Fragment key={e.name}>
                <SelectDropdown
                  name={e.name}
                  options={e.options}
                  value={e.value}
                  onChange={(updated) => {
                    e.updateValue(updated)
                  }}
                  placeholder="Select"
                  className="w-full"
                  extraName={e.extraName}
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-300">
        <button
          onClick={() => setActiveTab("list")}
          className={`px-3 py-2 text-sm ${activeTab === "list" ? "border-b-2 border-green-700" : ""}`}
        >
          List View
        </button>
        <button
          onClick={() => setActiveTab("kanban")}
          className={`px-3 py-2 text-sm ${activeTab === "kanban" ? "border-b-2 border-green-700" : ""}`}
        >
          Kanban Board
        </button>
      </div>

      {/* List View */}
      {activeTab === "list" && (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className={`bg-white border border-slate-300 rounded p-4 ${task.status === "completed" ? "opacity-75" : ""}`}>
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedTasks.includes(task.id)}
                  onChange={() => toggleTaskSelection(task.id)}
                  className="mt-1 accent-green-700"
                />
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(task.status)}
                        <h3 className={`font-semibold ${task.status === "completed" ? "line-through text-slate-500" : "text-slate-900"}`}>
                          {task.subject}
                        </h3>
                        {task.aiGenerated && (
                          <span className="text-xs border rounded px-2 py-0.5">AI Generated</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{task.description}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {task.sender}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {formatDueDate(task.dueDate)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleStarred(task.id)} className="h-8 w-8 flex items-center justify-center">
                        <Star className={`w-4 h-4 ${task.starred ? "fill-yellow-400 text-yellow-400" : "text-slate-400"}`} />
                      </button>
                      <div className="relative">
                        <button className="h-8 w-8 flex items-center justify-center">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </span>
                    <span className={`px-2 py-0.5 rounded ${getCategoryColor(task.category)}`}>
                      {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                    </span>
                    <span className="border rounded px-2 py-0.5">
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredTasks.length === 0 && (
            <div className="bg-white border border-slate-300 rounded p-6 text-center">
              <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No tasks found</h3>
              <p className="text-slate-600">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      )}

      {/* Kanban View */}
      {activeTab === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["pending", "in-progress", "completed"].map((status) => (
            <div key={status} className="bg-white border border-slate-300 rounded p-4">
              <div className="flex items-center gap-2 text-sm font-medium mb-4">
                {getStatusIcon(status)}
                {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                <span className="bg-gray-200 text-gray-800 text-xs rounded px-2">
                  {filteredTasks.filter((t) => t.status === status).length}
                </span>
              </div>
              <div className="space-y-3">
                {filteredTasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <div key={task.id} className="border border-slate-300 rounded p-3 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{task.subject}</h4>
                        <button onClick={() => toggleStarred(task.id)}>
                          <Star className={`w-3 h-3 ${task.starred ? "fill-yellow-400 text-yellow-400" : "text-slate-400"}`} />
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">{task.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-slate-500">{formatDueDate(task.dueDate)}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default TaskManagement
