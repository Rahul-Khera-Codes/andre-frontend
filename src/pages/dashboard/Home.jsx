// import {
//   Mail,
//   Clock,
//   CheckCircle,
//   TrendingUp,
//   FileText,
//   Bot,
//   Calendar,
// } from "lucide-react"
// import { useSelector } from "react-redux"
// import Loader from "../../components/loader"

// function Home() {

//   const userDetails = useSelector((state) => state.profile)

//   if (userDetails?.loading) return <Loader />

//   return (
//     <div className="space-y-6 h-full overflow-auto p-3">
//       <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-lg p-6">
//         <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Welcome back, {userDetails?.user?.given_name?.[0].toUpperCase() + userDetails?.user?.given_name?.slice(1) || "Test"}</h2>
//         <p className="text-slate-600">You have 12 pending email automations and 8 active tasks requiring attention.</p>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {[
//           { title: "Active Tasks", value: "23", icon: <CheckCircle className="h-4 w-4 text-slate-500" />, note: "+2 from yesterday" },
//           { title: "AI Drafts", value: "12", icon: <Bot className="h-4 w-4 text-slate-500" />, note: "Ready for review" },
//           { title: "Documents", value: "8", icon: <FileText className="h-4 w-4 text-slate-500" />, note: "Pending review" },
//           { title: "Efficiency", value: "94%", icon: <TrendingUp className="h-4 w-4 text-slate-500" />, note: "+5% from last week" },
//         ].map((stat, index) => (
//           <div key={index} className="bg-gradient-to-r from-[#e3e8f8] to-[#e5eafd] border border-slate-200 rounded-lg p-4 shadow-sm">
//             <div className="flex items-center justify-between mb-2">
//               <p className="text-sm font-medium">{stat.title}</p>
//               {stat.icon}
//             </div>
//             <div className="text-2xl font-bold">{stat.value}</div>
//             <p className="text-xs text-slate-500">{stat.note}</p>
//           </div>
//         ))}
//       </div>
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="bg-white border border-slate-200 rounded-lg shadow-sm lg:col-span-2">
//           <div className="p-4 border-b border-slate-100">
//             <div className="flex items-center gap-2 text-base font-semibold">
//               <Mail className="w-5 h-5" />
//               Recent Email Automations
//             </div>
//             <p className="text-sm text-slate-500 mt-1">
//               AI-generated emails and responses from the last 24 hours
//             </p>
//           </div>
//           <div className="p-4 space-y-4">
//             {[
//               {
//                 subject: "Research Protocol Review - Phase II Clinical Trial",
//                 recipient: "regulatory@biotech.com",
//                 status: "sent",
//                 time: "2 hours ago",
//               },
//               {
//                 subject: "Lab Equipment Maintenance Schedule",
//                 recipient: "facilities@biotech.com",
//                 status: "draft",
//                 time: "4 hours ago",
//               },
//               {
//                 subject: "Quarterly Research Progress Report",
//                 recipient: "board@biotech.com",
//                 status: "pending",
//                 time: "6 hours ago",
//               },
//             ].map((email, index) => (
//               <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
//                 <div className="flex-1">
//                   <p className="font-medium text-sm">{email.subject}</p>
//                   <p className="text-xs text-slate-600">To: {email.recipient}</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span
//                     className={`text-xs px-2 py-0.5 rounded-full ${email.status === "sent"
//                       ? "bg-blue-100 text-blue-700"
//                       : email.status === "draft"
//                         ? "bg-yellow-100 text-yellow-700"
//                         : "bg-slate-100 text-slate-700"
//                       }`}
//                   >
//                     {email.status}
//                   </span>
//                   <span className="text-xs text-slate-500">{email.time}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
//           <div className="p-4 border-b border-slate-100">
//             <div className="flex items-center gap-2 text-base font-semibold">
//               <Clock className="w-5 h-5" />
//               Upcoming Tasks
//             </div>
//             <p className="text-sm text-slate-500 mt-1">Priority tasks and deadlines</p>
//           </div>
//           <div className="p-4 space-y-3">
//             {[
//               {
//                 task: "Review IRB submission",
//                 due: "Today, 3:00 PM",
//                 priority: "high",
//               },
//               {
//                 task: "Update lab safety protocols",
//                 due: "Tomorrow, 9:00 AM",
//                 priority: "medium",
//               },
//               {
//                 task: "Prepare monthly report",
//                 due: "Friday, 5:00 PM",
//                 priority: "low",
//               },
//             ].map((task, index) => (
//               <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
//                 <div
//                   className={`w-2 h-2 rounded-full mt-2 ${task.priority === "high"
//                     ? "bg-red-500"
//                     : task.priority === "medium"
//                       ? "bg-yellow-500"
//                       : "bg-green-500"
//                     }`}
//                 />
//                 <div className="flex-1">
//                   <p className="font-medium text-sm">{task.task}</p>
//                   <p className="text-xs text-slate-600">{task.due}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
//         <div className="p-4 border-b border-slate-100">
//           <h3 className="text-base font-semibold">Quick Actions</h3>
//           <p className="text-sm text-slate-500 mt-1">Streamline your workflows with automated email notifications</p>
//         </div>
//         <div className="p-4 flex flex-wrap gap-3">
//           <button className="flex items-center bg-[#374A8C] text-white px-4 py-2 rounded-md hover:bg-[#37498c95] cursor-pointer transition">
//             <Bot className="w-4 h-4 mr-2" />
//             Generate AI Draft
//           </button>
//           <button className="flex items-center border border-slate-300 px-4 py-2 rounded-md hover:bg-slate-100 transition">
//             <Calendar className="w-4 h-4 mr-2" />
//             Schedule Reminder
//           </button>
//           <button className="flex items-center border border-slate-300 px-4 py-2 rounded-md hover:bg-slate-100 transition">
//             <FileText className="w-4 h-4 mr-2" />
//             Review Documents
//           </button>
//           <button className="flex items-center border border-slate-300 px-4 py-2 rounded-md hover:bg-slate-100 transition">
//             <Mail className="w-4 h-4 mr-2" />
//             Check Email Queue
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Home

"use client"

import { Mail, Clock, CheckCircle, TrendingUp, FileText, Bot, Calendar } from "lucide-react"
import { useSelector } from "react-redux"
import Loader from "../../components/loader"
import { getAllEvents } from "../../apis/dashboard"
import { useEffect, useState } from "react"
import { FormatTimeAgo } from "../../utils/timeformat"

function Home() {
  const [allEventsData, setAllEventsData] = useState({})
  const [loading, setLoading] = useState(true)
  const userDetails = useSelector((state) => state.profile)

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
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <>
      {userDetails?.loading || loading ? (
        <Loader />
      ) : (
        <div className="space-y-6 h-full overflow-auto p-3 bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <div className="bg-gradient-to-r from-[#6c7ebc] to-[#afb6ce] rounded-xl p-6 text-white shadow-lg">
            <h2 className="text-2xl font-serif font-bold mb-2">
              Welcome back,{" "}
              {userDetails?.user?.given_name?.[0].toUpperCase() + userDetails?.user?.given_name?.slice(1) || "Test"}
            </h2>
            <p className="text-blue-100">
              You have 12 pending email automations and 8 active tasks requiring attention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <p className="text-cyan-100 mt-1">AI-generated emails and responses from the last 24 hours</p>
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
                  <p className="flex justify-center items-center h-45 text-xl font-semibold text-gray-800 mb-2">No Emails Found</p>
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
                <p className="text-indigo-100 mt-1">Priority tasks and deadlines</p>
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
                  <p className="flex justify-center items-center h-45 text-xl font-semibold text-gray-800 mb-2">No Events Found</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-teal-200 to-cyan-200 p-4 text-gray-800">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <p className="text-teal-700 mt-1">Streamline your workflows with automated email notifications</p>
            </div>
            <div className="p-6 flex flex-wrap gap-4">
              <button className="flex items-center bg-gradient-to-r from-violet-200 to-purple-300 text-gray-900 px-6 py-3 rounded-xl hover:from-violet-300 hover:to-purple-400 transform hover:scale-105 transition-all duration-200 shadow-md">
                <div className="bg-white/40 p-1 rounded-md mr-3">
                  <Bot className="w-4 h-4" />
                </div>
                Generate AI Draft
              </button>
              <button className="flex items-center bg-gradient-to-r from-blue-200 to-indigo-300 text-gray-900 px-6 py-3 rounded-xl hover:from-blue-300 hover:to-indigo-400 transform hover:scale-105 transition-all duration-200 shadow-md">
                <div className="bg-white/40 p-1 rounded-md mr-3">
                  <Calendar className="w-4 h-4" />
                </div>
                Schedule Reminder
              </button>
              <button className="flex items-center bg-gradient-to-r from-emerald-200 to-teal-300 text-gray-900 px-6 py-3 rounded-xl hover:from-emerald-300 hover:to-teal-400 transform hover:scale-105 transition-all duration-200 shadow-md">
                <div className="bg-white/40 p-1 rounded-md mr-3">
                  <FileText className="w-4 h-4" />
                </div>
                Review Documents
              </button>
              <button className="flex items-center bg-gradient-to-r from-orange-200 to-red-300 text-gray-900 px-6 py-3 rounded-xl hover:from-orange-300 hover:to-red-400 transform hover:scale-105 transition-all duration-200 shadow-md">
                <div className="bg-white/40 p-1 rounded-md mr-3">
                  <Mail className="w-4 h-4" />
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
