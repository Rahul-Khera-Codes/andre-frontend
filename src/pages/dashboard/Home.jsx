import { Mail, Clock, CheckCircle, TrendingUp, FileText, Bot, Calendar } from "lucide-react"
import { useSelector } from "react-redux"
import Loader from "../../components/loader"
import { getAllEvents } from "../../apis/dashboard"
import { useEffect, useState } from "react"
import { FormatTimeAgo } from "../../utils/timeformat"
import Header from "../../components/Header"

function Home() {
  const [allEventsData, setAllEventsData] = useState({})
  const [loading, setLoading] = useState(true)
  const userDetails = useSelector((state) => state.profile)
  const [message, setMessage] = useState("")

  const statusColors = [
    "from-emerald-300 to-teal-400",
    "from-blue-300 to-indigo-400",
    "from-amber-300 to-orange-400",
    "from-purple-300 to-pink-400",
    "from-cyan-300 to-blue-400",
  ]

  const priorityColors = [
    "bg-gradient-to-r from-rose-300 to-pink-200",
    "bg-gradient-to-r from-amber-300 to-orange-200",
    "bg-gradient-to-r from-emerald-300 to-teal-200",
    "bg-gradient-to-r from-blue-300 to-indigo-200",
    "bg-gradient-to-r from-purple-300 to-violet-200",
  ]

  useEffect(() => {
    fecthAllEvents()
  }, [])

  useEffect(() => {
    if (allEventsData?.emails?.length > 0 || allEventsData?.events?.length > 0) {
      setLoading(false)
    }
  }, [allEventsData])

  const fecthAllEvents = async () => {
    setMessage("")
    try {
      const response = await getAllEvents()
      console.log(response)
      if (response?.status === 200) {
        setAllEventsData(response?.data)
        if (allEventsData?.emails?.length === 0 || allEventsData?.events?.length === 0) {
          setLoading(false)
        }
      } else {
        setLoading(false)
        setMessage(response?.response?.data?.error ?? response?.message ?? "No Data Found")
      }
    } catch (error) {
      console.log(error)
      setMessage("Network Connection Error")
      setLoading(false)
    }
  }

  return (
    <>
      {userDetails?.loading || loading ? (
        <Loader />
      ) : (
        <div className="space-y-6 h-full overflow-auto p-3 bg-gradient-to-br from-slate-50 via-white to-blue-50">

          <Header header={` Welcome back, ${userDetails?.user?.given_name?.[0].toUpperCase() + userDetails?.user?.given_name?.slice(1) || "Test"}`} description={"You have 12 pending email automations and 8 active tasks requiring attention."} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Active Tasks",
                value: "23",
                icon: <CheckCircle className="h-5 w-5 text-white" />,
                note: "+2 from yesterday",
                iconBg: "bg-emerald-400",
              },
              {
                title: "AI Drafts",
                value: "12",
                icon: <Bot className="h-5 w-5 text-white" />,
                note: "Ready for review",
                iconBg: "bg-blue-400",
              },
              {
                title: "Documents",
                value: "8",
                icon: <FileText className="h-5 w-5 text-white" />,
                note: "Pending review",
                iconBg: "bg-orange-400",
              },
              {
                title: "Efficiency",
                value: "94%",
                icon: <TrendingUp className="h-5 w-5 text-white" />,
                note: "+5% from last week",
                iconBg: "bg-purple-400",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br rounded-xl p-4 shadow-xl text-gray transform hover:scale-105 transition-all duration-200`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray">{stat.title}</p>
                  <div className={`${stat.iconBg} p-2 rounded-lg shadow-md`}>{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-gray">{stat.note}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg lg:col-span-2 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-400 p-4 text-white">
                <div className="flex items-center gap-3 text-lg font-semibold">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Mail className="w-5 h-5" />
                  </div>
                  Recent Email Automations
                </div>
                <p className="text-cyan-100 mt-1">Top 5 emails and responses from the last 24 hours</p>
              </div>
              <div className="p-6 space-y-4">
                {allEventsData?.emails?.length > 0 ? (
                  allEventsData?.emails.map((email, index) => (
                    <div
                      key={index}
                      className="flex flex-col p-4 gap-2 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className="">
                        <p className="font-semibold text-gray-800">{email.subject}</p>
                        <p className="text-sm text-gray-600">To: {email.to_recipient_emails?.[0]}</p>
                      </div>
                      <div className="flex justify-between items-center gap-3">
                        <span
                          className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${statusColors[index % statusColors.length]} text-white font-medium shadow-sm`}
                        >
                          {email.folder_name}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {FormatTimeAgo(email.received_date_time)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="flex justify-center items-center h-45 text-xl font-semibold text-gray-800 mb-2">{message || `No Emails Found`}</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-400 to-purple-400 p-4 text-white">
                <div className="flex items-center gap-3 text-lg font-semibold">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Clock className="w-5 h-5" />
                  </div>
                  Upcoming Tasks
                </div>
                <p className="text-indigo-100 mt-1">Priority tasks and deadlines for today</p>
              </div>
              <div className="p-6 space-y-4">
                {allEventsData?.events?.length > 0 ? (
                  allEventsData?.events.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
                    >
                      <div
                        className={`w-3 h-3 rounded-full mt-2 ${priorityColors[index % priorityColors.length]} shadow-sm`}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{task.subject}</p>
                        <p className="text-sm text-gray-600">{FormatTimeAgo(task.start.dateTime)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="flex justify-center items-center h-45 text-xl font-semibold text-gray-800 mb-2">{message || `No Events Found`}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-teal-200 to-cyan-200 p-4 text-gray-800">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <p className="text-teal-700 mt-1">Streamline your workflows with automated email notifications</p>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex items-center bg-gradient-to-r from-violet-200 to-purple-300 text-gray-900 px-6 py-3 rounded-xl hover:from-violet-300 hover:to-purple-400 transform hover:scale-105 transition-all duration-200 shadow-md">
                <div className="bg-white/40 p-1 rounded-md mr-3">
                  <Bot />
                </div>
                Generate AI Draft
              </button>
              <button className="flex items-center bg-gradient-to-r from-blue-200 to-indigo-300 text-gray-900 px-6 py-3 rounded-xl hover:from-blue-300 hover:to-indigo-400 transform hover:scale-105 transition-all duration-200 shadow-md">
                <div className="bg-white/40 p-1 rounded-md mr-3">
                  <Calendar />
                </div>
                Schedule Reminder
              </button>
              <button className="flex items-center bg-gradient-to-r from-emerald-200 to-teal-300 text-gray-900 px-6 py-3 rounded-xl hover:from-emerald-300 hover:to-teal-400 transform hover:scale-105 transition-all duration-200 shadow-md">
                <div className="bg-white/40 p-1 rounded-md mr-3">
                  <FileText />
                </div>
                Review Documents
              </button>
              <button className="flex items-center bg-gradient-to-r from-orange-200 to-red-300 text-gray-900 px-6 py-3 rounded-xl hover:from-orange-300 hover:to-red-400 transform hover:scale-105 transition-all duration-200 shadow-md">
                <div className="bg-white/40 p-1 rounded-md mr-3">
                  <Mail />
                </div>
                Check Email Queue
              </button>
            </div>
          </div>

        </div>
      )}
    </>
  )
}

export default Home
