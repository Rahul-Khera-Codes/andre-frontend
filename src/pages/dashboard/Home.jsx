import {
  Mail,
  Clock,
  CheckCircle,
  TrendingUp,
  FileText,
  Bot,
  Calendar,
} from "lucide-react"

function Home() {
  return (
    <div className="space-y-6 h-full overflow-auto p-3">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-lg p-6">
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Welcome back, Dr. Smith</h2>
        <p className="text-slate-600">You have 12 pending email automations and 8 active tasks requiring attention.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Active Tasks", value: "23", icon: <CheckCircle className="h-4 w-4 text-slate-500" />, note: "+2 from yesterday" },
          { title: "AI Drafts", value: "12", icon: <Bot className="h-4 w-4 text-slate-500" />, note: "Ready for review" },
          { title: "Documents", value: "8", icon: <FileText className="h-4 w-4 text-slate-500" />, note: "Pending review" },
          { title: "Efficiency", value: "94%", icon: <TrendingUp className="h-4 w-4 text-slate-500" />, note: "+5% from last week" },
        ].map((stat, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">{stat.title}</p>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-slate-500">{stat.note}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Email Automations */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm lg:col-span-2">
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-base font-semibold">
              <Mail className="w-5 h-5" />
              Recent Email Automations
            </div>
            <p className="text-sm text-slate-500 mt-1">
              AI-generated emails and responses from the last 24 hours
            </p>
          </div>
          <div className="p-4 space-y-4">
            {[
              {
                subject: "Research Protocol Review - Phase II Clinical Trial",
                recipient: "regulatory@biotech.com",
                status: "sent",
                time: "2 hours ago",
              },
              {
                subject: "Lab Equipment Maintenance Schedule",
                recipient: "facilities@biotech.com",
                status: "draft",
                time: "4 hours ago",
              },
              {
                subject: "Quarterly Research Progress Report",
                recipient: "board@biotech.com",
                status: "pending",
                time: "6 hours ago",
              },
            ].map((email, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{email.subject}</p>
                  <p className="text-xs text-slate-600">To: {email.recipient}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      email.status === "sent"
                        ? "bg-blue-100 text-blue-700"
                        : email.status === "draft"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {email.status}
                  </span>
                  <span className="text-xs text-slate-500">{email.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-base font-semibold">
              <Clock className="w-5 h-5" />
              Upcoming Tasks
            </div>
            <p className="text-sm text-slate-500 mt-1">Priority tasks and deadlines</p>
          </div>
          <div className="p-4 space-y-3">
            {[
              {
                task: "Review IRB submission",
                due: "Today, 3:00 PM",
                priority: "high",
              },
              {
                task: "Update lab safety protocols",
                due: "Tomorrow, 9:00 AM",
                priority: "medium",
              },
              {
                task: "Prepare monthly report",
                due: "Friday, 5:00 PM",
                priority: "low",
              },
            ].map((task, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    task.priority === "high"
                      ? "bg-red-500"
                      : task.priority === "medium"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{task.task}</p>
                  <p className="text-xs text-slate-600">{task.due}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-base font-semibold">Quick Actions</h3>
          <p className="text-sm text-slate-500 mt-1">Streamline your workflows with automated email notifications</p>
        </div>
        <div className="p-4 flex flex-wrap gap-3">
          <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            <Bot className="w-4 h-4 mr-2" />
            Generate AI Draft
          </button>
          <button className="flex items-center border border-slate-300 px-4 py-2 rounded-md hover:bg-slate-100 transition">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Reminder
          </button>
          <button className="flex items-center border border-slate-300 px-4 py-2 rounded-md hover:bg-slate-100 transition">
            <FileText className="w-4 h-4 mr-2" />
            Review Documents
          </button>
          <button className="flex items-center border border-slate-300 px-4 py-2 rounded-md hover:bg-slate-100 transition">
            <Mail className="w-4 h-4 mr-2" />
            Check Email Queue
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home