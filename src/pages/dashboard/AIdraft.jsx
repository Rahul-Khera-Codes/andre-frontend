// import { useEffect, useState } from "react"
// import {
//   Bot,
//   Send,
//   Edit3,
//   Save,
//   RefreshCw,
//   Clock,
//   CheckCircle2,
//   AlertTriangle,
//   Eye,
//   Copy,
//   Download,
//   MoreHorizontal,
//   Sparkles,
//   FileText,
//   Mail,
//   Search,
// } from "lucide-react"
// import { SelectDropdown } from "../../components/CustomDropDown"
// import { getAutomateEmails } from "../../apis/emailAutomation"
// import Loader from "../../components/loader"
// import { IoClose } from "react-icons/io5"
// import { BiLeftArrowAlt } from "react-icons/bi"

// function AIDraftReview() {

//   const [drafts, setDrafts] = useState([])
//   const [selectedDraft, setSelectedDraft] = useState({})
//   const [editMode, setEditMode] = useState(false)
//   const [editedContent, setEditedContent] = useState("")
//   const [editedSubject, setEditedSubject] = useState("")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedStatus, setSelectedStatus] = useState("all")
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("")

//   const [filteredDrafts, setFilteredDrafts] = useState([])

//   function filteredData() {
//     const data = drafts.filter((draft) => {
//       const matchesSearch =
//         draft.body_preview?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
//         draft.to_recipient_emails?.[0]?.toLowerCase()?.includes(searchQuery?.toLowerCase())
//       return matchesSearch
//     })
//     setFilteredDrafts(data)
//   }


//   useEffect(() => {
//     filteredData()
//   }, [drafts, searchQuery])

//   useEffect(() => {
//     fetchEmails()
//   }, [selectedStatus])

//   const fetchEmails = async () => {
//     setLoading(true)
//     setMessage("")
//     try {
//       const response = await getAutomateEmails(selectedStatus)
//       const mails = response?.data;
//       console.log(mails)
//       if (mails?.length > 0 && mails?.[0]?.message_id) {
//         setDrafts(mails)
//       } else {
//         setDrafts([])
//         setMessage(response?.response?.data?.error ?? response?.message ?? "No Mails Found")
//       }
//     } catch (error) {
//       console.log(error)
//       setMessage("Network Connection Error")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleEditStart = () => {
//     if (selectedDraft) {
//       setEditedContent(selectedDraft.body_preview)
//       setEditedSubject(selectedDraft.subject)
//       setEditMode(true)
//     }
//   }

//   const handleSaveEdit = () => {
//     if (selectedDraft) {
//       const updatedDraft = {
//         ...selectedDraft,
//         content: editedContent,
//         subject: editedSubject,
//         mail_time: new Date().toISOString(),
//         version: selectedDraft.version + 1,
//         //status: "reviewed",
//       }
//       setDrafts((prev) => prev.map((d) => (d.message_id === selectedDraft.message_id ? updatedDraft : d)))
//       setSelectedDraft(updatedDraft)
//       setEditMode(false)
//     }
//   }

//   const handleStatusChange = (draftId, newStatus) => {
//     setDrafts((prev) => prev.map((d) => (d.message_id === draftId ? { ...d, status: newStatus } : d)))
//     if (selectedDraft?.message_id === draftId) {
//       setSelectedDraft((prev) => (prev ? { ...prev, status: newStatus } : null))
//     }
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "draft":
//         return "bg-gray-100 text-gray-800"
//       case "reviewed":
//         return "bg-yellow-100 text-yellow-800"
//       case "approved":
//         return "bg-green-100 text-green-800"
//       case "sent":
//         return "bg-blue-100 text-blue-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "draft":
//         return <Edit3 className="w-4 h-4" />
//       case "reviewed":
//         return <Eye className="w-4 h-4" />
//       case "approved":
//         return <CheckCircle2 className="w-4 h-4" />
//       case "sent":
//         return <Send className="w-4 h-4" />
//       default:
//         return <Clock className="w-4 h-4" />
//     }
//   }

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case "high":
//         return "text-red-600"
//       case "medium":
//         return "text-yellow-600"
//       case "low":
//         return "text-green-600"
//       default:
//         return "text-gray-600"
//     }
//   }

//   const htmlToPlainText = (html) => {
//     const tempDiv = document.createElement("div");
//     tempDiv.innerHTML = html;

//     const elementsToRemove = tempDiv.querySelectorAll("style, script");
//     elementsToRemove.forEach(el => el.remove());

//     tempDiv.querySelectorAll("br, li").forEach(el => {
//       el.replaceWith("\n" + el.textContent);
//     });

//     tempDiv.querySelectorAll("p").forEach(el => {
//       el.replaceWith(el.textContent + "\n");
//     });

//     return tempDiv.textContent
//       .replace(/\n\s*\n/g, "\n")
//       .trim();
//   };



//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   const statusOptions = [{ label: "All", key: "all" }, { label: "Junk Email", key: "junk_email" }, { label: "Drafts", key: "drafts" }, { label: "Inbox", key: "inbox" }, { label: "Deleted Items", key: "deleted_items" }, { label: "Sent Items", key: "sent_items" }]
//   return (
//     <div className="space-y-6 h-full w-full overflow-auto p-3">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-serif font-bold text-slate-900">Email Automation</h1>
//           <p className="text-slate-600 mt-1">Review documents securely and collaboratively</p>
//         </div>
//         {/* <div className="flex items-center gap-3">
//           <button className="border border-slate-300 px-3 py-2 rounded-md flex items-center text-sm">
//             <Sparkles className="w-4 h-4 mr-2" /> New AI Draft
//           </button>
//           <button className="bg-green-800 text-white px-3 py-2 rounded-md flex items-center text-sm">
//             <FileText className="w-4 h-4 mr-2" /> Templates
//           </button>
//         </div> */}
//       </div>

//       {/* Main Grid */}
//       <div className="flex w-full h-full gap-6">

//         {!selectedDraft?.message_id ? <div className={`space-y-4 w-full`}>
//           <div className="border flex md:flex-row flex-col gap-3 w-full border-slate-300 rounded-lg p-4">
//             <div className="relative md:w-1/2 w-full">
//               <input
//                 placeholder="Search Emails..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-8 border focus:border-[#374A8C] bg-white focus:outline-none border-slate-200 rounded-lg w-full py-[9.5px] text-sm"
//               />
//               <Search className="absolute top-5 left-3 -translate-y-1/2 text-slate-400 w-4 h-4" />
//             </div>
//             <div className="md:w-1/2 w-full">
//               <SelectDropdown
//                 name="status"
//                 options={statusOptions}
//                 value={selectedStatus}
//                 onChange={(updated) => {
//                   setSelectedStatus(updated)
//                 }}
//                 placeholder="Select"
//                 className="md:w-[204px] w-full"
//                 extraName="Status"
//               />
//             </div>
//           </div>

//           {/* Drafts List */}
//           <div className="space-y-2 overflow-y-auto">
//             {loading ? <div className="h-56 w-full"><Loader /></div> : !message ? filteredDrafts?.length > 0 ? <div className="space-y-2 gap-2 grid md:grid-cols-2 overflow-y-auto">{filteredDrafts.map((draft) => (
//               <div
//                 key={draft.message_id}
//                 className={`border border-gray-300 rounded-lg p-4 bg-white hover:shadow-md transition-shadow duration-200 cursor-pointer
//     ${selectedDraft?.message_id === draft.message_id ? "border-b-2 bg-[#f0f0f0] border-b-[#374A8C]" : ""}
//   `}
//                 onClick={() => {
//                   setSelectedDraft(draft);
//                   setEditMode(false);
//                 }}
//               >
//                 {/* Header Row: Subject + Priority Icon */}
//                 <div className="flex items-start justify-between mb-2">
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm font-semibold text-slate-800 line-clamp-2">
//                       📄 {draft.subject || "No Subject"}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Sender */}
//                 {/* <p className="text-xs text-slate-600 mb-1">
//                   <span className="font-bold">Summary: </span> {draft.summarization?.[0]?.summary}
//                 </p> */}
//                 <p className="text-xs text-slate-600 mb-1">
//                   <span className="font-bold">Sender:</span> {draft.sender_email}
//                 </p>

//                 {/* Recipients */}
//                 {draft?.to_recipient_emails?.length > 0 && (
//                   <div className="mb-2 space-y-0.5">
//                     {draft.to_recipient_emails.map((email) => (
//                       <p key={email} className="text-xs text-slate-600">
//                         <span className="font-medium">To:</span> {email}
//                       </p>
//                     ))}
//                   </div>
//                 )}

//                 {/* Status + Time */}
//                 <div className="flex gap-2 items-center mt-2">
//                   <span
//                     className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${getStatusColor(draft.status)}`}
//                   >
//                     {getStatusIcon(draft.status)}
//                     {draft.status}
//                   </span>
//                   <span className="text-xs text-slate-500">{formatDate(draft.received_date_time)}</span>
//                 </div>
//               </div>

//             ))} </div> : <div className="border border-slate-300 rounded-lg p-6 text-center">
//               <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold text-slate-900 mb-2">No Mails Found</h3>
//             </div> : <div className="border border-slate-300 rounded-lg p-6 text-center">
//               <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold text-slate-900 mb-2">{message}</h3>
//             </div>}
//           </div>
//         </div>
//           :
//           <div className="w-full h-full">
//             <p className="flex items-center gap-1 py-3 text-md hover:underline cursor-pointer w-fit" onClick={() => setSelectedDraft({})}><BiLeftArrowAlt />Back</p>

//             <div className="border border-slate-300 rounded-lg p-4">
//               {/* Status Row */}
//               <div className="flex items-start justify-between">
//                 <div>
//                   {/* <div className="flex items-center gap-2">
//                     <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${getStatusColor(selectedDraft.status)}`}>
//                       {getStatusIcon(selectedDraft.status)}
//                       {selectedDraft.status}
//                     </span>
//                     <span className="border border-slate-300 px-2 py-0.5 rounded text-xs">v{selectedDraft.version}</span>
//                     <span className="border border-slate-300 px-2 py-0.5 rounded text-xs flex items-center gap-1">
//                       <Bot className="w-3 h-3" />
//                       {selectedDraft.aiModel}
//                     </span>
//                   </div> */}
//                   {editMode ? (
//                     <input
//                       value={editedSubject}
//                       onChange={(e) => setEditedSubject(e.target.value)}
//                       className="border border-slate-300 px-2 py-1 rounded w-full mt-2"
//                     />
//                   ) : (
//                     <h3 className="text-lg font-semibold mt-2">{selectedDraft.subject}</h3>
//                   )}
//                   <p className="text-xs text-slate-600">From: {selectedDraft?.sender_email}</p>
//                   {selectedDraft?.to_recipient_emails?.length > 0 && selectedDraft?.to_recipient_emails?.map((e) => (
//                     <p key={e} className="text-xs text-slate-600">To: {e}</p>
//                   ))}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   {editMode ? (
//                     <>
//                       <button className="border border-slate-300 px-3 py-1 rounded text-sm" onClick={() => setEditMode(false)}>Cancel</button>
//                       <button className="bg-green-800 text-white px-3 py-1 rounded text-sm flex items-center" onClick={handleSaveEdit}>
//                         <Save className="w-4 h-4 mr-1" /> Save
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       {/* <button className="border  border-slate-300 px-3 py-1 rounded text-sm flex items-center" onClick={handleEditStart}>
//                         <Edit3 className="w-4 h-4 mr-1" /> Edit
//                       </button>
//                       <button onClick={() => setSelectedDraft({})} className="border cursor-pointer border-slate-300 px-3 py-1 rounded text-sm">
//                         <IoClose className="w-4 h-4" />
//                       </button> */}
//                     </>
//                   )}
//                 </div>
//               </div>

//               <hr className="my-4" style={{ color: "lightgray" }} />

//               {editMode ? (
//                 <textarea
//                   value={editedContent}
//                   onChange={(e) => setEditedContent(e.target.value)}
//                   className="border border-slate-300 rounded w-full p-2 h-64 resize-none focus:outline-none focus:ring-1 focus:ring-[#374A8C]"
//                 />
//               ) : (
//                 <textarea
//                   value={selectedDraft.body_preview}
//                   readOnly
//                   className="border border-slate-300 rounded w-full p-2 h-64 resize-none focus:outline-none focus:ring-1 focus:ring-[#374A8C]"
//                 />
//               )}


//               <hr className="my-4" style={{ color: "lightgrey" }} />

//               {selectedDraft?.summarization?.length > 0 && selectedDraft?.summarization?.map((e, index) => (
//                 <div key={index} className="mb-6 p-4 border border-slate-200 rounded-lg shadow-sm bg-white">
//                   <h3 className="text-sm font-semibold text-slate-700 mb-2">📝 Summary:</h3>
//                   <p className="text-sm text-slate-600 mb-4">{e.summary}</p>

//                   {e?.calendar?.length > 0 && (
//                     <div className="space-y-4">
//                       {e.calendar.map((each, i) => (
//                         <div key={i} className="p-3 border border-slate-100 rounded-md bg-slate-50">
//                           <p className="text-xs text-slate-700"><span className="font-semibold">🕒 Start Time:</span> {formatDate(each.start.dateTime)}</p>
//                           <p className="text-xs text-slate-700"><span className="font-semibold">⏰ End Time:</span> {formatDate(each.end.dateTime)}</p>
//                           <p className="text-xs text-slate-700"><span className="font-semibold">📌 Subject:</span> {each.subject}</p>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}

//               {selectedDraft?.reply && (
//                 <div className="mb-6 p-6 border border-slate-200 rounded-xl shadow-md bg-white">
//                   <h3 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
//                     🗨️ <span>Reply</span>
//                   </h3>

//                   <textarea
//                     value={htmlToPlainText(selectedDraft.reply)}
//                     onChange={(e) =>
//                       setSelectedDraft(prev => ({
//                         ...prev,
//                         reply: e.target.value,
//                       }))
//                     }
//                     placeholder="Write your reply..."
//                     className="w-full h-64 p-4 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#374A8C] focus:border-transparent transition-shadow"
//                   />
//                 </div>
//               )}



//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 {/* <div>
//                 <span className="font-medium text-slate-700">Created:</span>
//                 <p className="text-slate-600">{formatDate(selectedDraft.createdAt)}</p>
//               </div> */}
//                 <div>
//                   <span className="font-medium text-slate-700">Last Modified:</span>
//                   <p className="text-slate-600">{formatDate(selectedDraft.mail_time)}</p>
//                 </div>
//                 {/* <div>
//                 <span className="font-medium text-slate-700">Template:</span>
//                 <p className="text-slate-600">{selectedDraft.template}</p>
//               </div>
//               <div>
//                 <span className="font-medium text-slate-700">AI Confidence:</span>
//                 <p className="text-slate-600">{selectedDraft.confidence}%</p>
//               </div> */}
//               </div>
//               {/*
//             <div className="mt-4">
//               <span className="font-medium text-slate-700">Original Prompt:</span>
//               <p className="text-slate-600 text-sm mt-1 italic">{selectedDraft.originalPrompt}</p>
//             </div> */}

//               {!editMode && (
//                 <div className="flex items-center gap-3 pt-4">
//                   <button
//                     className="bg-[#374A8C] text-white px-3 py-2 rounded flex items-center"
//                     onClick={() => handleStatusChange(selectedDraft.message_id, "sent")}
//                   >
//                     <Send className="w-4 h-4 mr-2" /> Send Email
//                   </button>
//                   <button
//                     className="border border-slate-300 px-3 py-2 rounded flex items-center"
//                     onClick={() => handleStatusChange(selectedDraft.message_id, "approved")}
//                   >
//                     <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
//                   </button>
//                   <button className="border border-slate-300 px-3 py-2 rounded flex items-center">
//                     <Mail className="w-4 h-4 mr-2" /> Save to Drafts
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* <div className="border rounded-lg p-6 text-center">
//                <Bot className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//                <h3 className="text-lg font-semibold text-slate-900 mb-2">Select a draft to review</h3>
//                <p className="text-slate-600">Choose a draft from the list to start reviewing and editing.</p>
//              </div> */}
//           </div>
//         }
//       </div>
//     </div>
//   )
// }

// export default AIDraftReview
"use client"

import { useEffect, useState } from "react"
import { Send, Edit3, Save, Clock, CheckCircle2, Eye, Mail, Search } from "lucide-react"
import { SelectDropdown } from "../../components/CustomDropDown"
import { draftAutomateEmails, getAutomateEmails } from "../../apis/emailAutomation"
import Loader from "../../components/loader"
import { BiLeftArrowAlt } from "react-icons/bi"
import { FormatTimeAgo } from "../../utils/timeformat"
import { FaRegClock, FaReply } from "react-icons/fa"
import { MdOutlineContentPasteGo, MdOutlineSummarize } from "react-icons/md"

function AIDraftReview() {
  const [drafts, setDrafts] = useState([])
  const [selectedDraft, setSelectedDraft] = useState({})
  const [editMode, setEditMode] = useState(false)
  const [editedContent, setEditedContent] = useState("")
  const [editedSubject, setEditedSubject] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  const [filteredDrafts, setFilteredDrafts] = useState([])

  function filteredData() {
    const data = drafts.filter((draft) => {
      const matchesSearch =
        draft.body_preview?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        draft.to_recipient_emails?.[0]?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      return matchesSearch
    })
    setFilteredDrafts(data)
  }

  useEffect(() => {
    filteredData()
  }, [drafts, searchQuery])

  useEffect(() => {
    fetchEmails()
  }, [selectedStatus])

  const fetchEmails = async () => {
    setLoading(true)
    setMessage("")
    try {
      const response = await getAutomateEmails(selectedStatus)
      const mails = response?.data
      console.log(mails)
      if (mails?.length > 0 && mails?.[0]?.message_id) {
        setDrafts(mails)
      } else {
        setDrafts([])
        setMessage(response?.response?.data?.error ?? response?.message ?? "No Mails Found")
      }
    } catch (error) {
      console.log(error)
      setMessage("Network Connection Error")
    } finally {
      setLoading(false)
    }
  }

  const handleEditStart = () => {
    if (selectedDraft) {
      setEditedContent(selectedDraft.body_preview)
      setEditedSubject(selectedDraft.subject)
      setEditMode(true)
    }
  }

  const handleSaveEdit = () => {
    if (selectedDraft) {
      const updatedDraft = {
        ...selectedDraft,
        content: editedContent,
        subject: editedSubject,
        mail_time: new Date().toISOString(),
        version: selectedDraft.version + 1,
        //status: "reviewed",
      }
      setDrafts((prev) => prev.map((d) => (d.message_id === selectedDraft.message_id ? updatedDraft : d)))
      setSelectedDraft(updatedDraft)
      setEditMode(false)
    }
  }

  const handleStatusChange = (draftId, newStatus) => {
    setDrafts((prev) => prev.map((d) => (d.message_id === draftId ? { ...d, status: newStatus } : d)))
    if (selectedDraft?.message_id === draftId) {
      setSelectedDraft((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "reviewed":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "sent":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // const getStatusIcon = (status) => {
  //   switch (status) {
  //     case "draft":
  //       return <Edit3 className="w-4 h-4" />
  //     case "reviewed":
  //       return <Eye className="w-4 h-4" />
  //     case "approved":
  //       return <CheckCircle2 className="w-4 h-4" />
  //     case "sent":
  //       return <Send className="w-4 h-4" />
  //     default:
  //       return <Clock className="w-4 h-4" />
  //   }
  // }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const htmlToPlainText = (html) => {
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = html

    const elementsToRemove = tempDiv.querySelectorAll("style, script")
    elementsToRemove.forEach((el) => el.remove())

    tempDiv.querySelectorAll("br, li").forEach((el) => {
      el.replaceWith("\n" + el.textContent)
    })

    tempDiv.querySelectorAll("p").forEach((el) => {
      el.replaceWith(el.textContent + "\n")
    })

    return tempDiv.textContent.replace(/\n\s*\n/g, "\n").trim()
  }

  const statusColors = [
    "from-emerald-300 to-teal-400",
    "from-blue-300 to-indigo-400",
    "from-amber-300 to-orange-400",
    "from-purple-300 to-pink-400",
    "from-cyan-300 to-blue-400",
  ]

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleDraft = async () => {
    try {
      const payload = {
        filter: "draft",
        body: selectedDraft?.body_preview,
        subject:"no",
        to_recipients:["test@gmail.com"]
      }
      const response = await draftAutomateEmails(payload);
      console.log(response)
    } catch (error) {

    }
  }

  const statusOptions = [
    { label: "All", key: "all" },
    { label: "Junk Email", key: "junk_email" },
    { label: "Drafts", key: "drafts" },
    { label: "Inbox", key: "inbox" },
    { label: "Deleted Items", key: "deleted_items" },
    { label: "Sent Items", key: "sent_items" },
  ]
  return (
    <div className="space-y-6 h-full w-full overflow-auto p-3 bg-gradient-to-br from-violet-50 via-white to-pink-50">
      <div className="flex items-center justify-between bg-gradient-to-r from-[#6b84d8] to-[#889ee6] p-6 rounded-2xl text-white shadow-lg">
        <div>
          <h1 className="text-3xl font-serif font-bold">Email Automation</h1>
          <p className="text-indigo-100 mt-1">Review documents securely and collaboratively</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex w-full h-full gap-6">
        {!selectedDraft?.message_id ? (
          <div className={`space-y-4 w-full`}>
            <div className="bg-white border-2 border-gray-100 flex md:flex-row flex-col gap-4 w-full rounded-2xl p-6 shadow-lg">
              <div className="relative md:w-1/2 w-full">
                <input
                  placeholder="Search Emails..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 border-2 border-gray-200 bg-gray-50 focus:border-purple-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 rounded-xl w-full py-3 text-sm transition-all duration-200"
                />
                <div className="absolute top-1/2 left-4 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 p-1.5 rounded-lg">
                  <Search className="text-white w-4 h-4" />
                </div>
              </div>
              <div className="md:w-1/2 w-full">
                <SelectDropdown
                  name="status"
                  options={statusOptions}
                  value={selectedStatus}
                  onChange={(updated) => {
                    setSelectedStatus(updated)
                  }}
                  placeholder="Select"
                  className="md:w-[204px] w-full"
                  extraName="Status"
                />
              </div>
            </div>

            {/* Drafts List */}
            <div className="space-y-2 y-6">
              {loading ? (
                <div className="h-56 w-full">
                  <Loader />
                </div>
              ) : !message ? (
                filteredDrafts?.length > 0 ? (
                  <div className="space-y-4 gap-2 grid md:grid-cols-2">
                    {filteredDrafts.map((email, index) => (
                      <div
                        key={email.message_id}
                        className={`bg-gradient-to-br flex flex-col gap-2 from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-purple-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1
    ${selectedDraft?.message_id === email.message_id ? "border-purple-400 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-lg" : ""}
  `}
                        onClick={() => {
                          setSelectedDraft(email)
                          setEditMode(false)
                        }}
                      // className="flex flex-col p-4 gap-2 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
                      >
                        <div className="">
                          <p className="font-semibold text-gray-800">{email?.subject}</p>
                          <p className="text-sm text-gray-600">From: {email?.sender_email}</p>
                          <p className="text-sm text-gray-600">To: {email?.to_recipient_emails?.[0]}</p>
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
                    ))}{" "}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                    <div className="bg-gradient-to-r from-gray-400 to-gray-500 p-4 rounded-2xl w-fit mx-auto mb-4">
                      <Mail className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Mails Found</h3>
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
          </div>
        ) : (
          <div className="w-full h-full">
            <div
              className="flex items-center gap-2 py-3 text-md hover:text-purple-600 cursor-pointer w-fit transition-colors duration-200"
              onClick={() => setSelectedDraft({})}
            >
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-1.5 rounded-lg">
                <BiLeftArrowAlt className="text-white" />
              </div>
              <span className="font-medium">Back</span>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
              {/* Status Row */}
              <div className="flex items-start justify-between">
                <div>
                  {editMode ? (
                    <input
                      value={editedSubject}
                      onChange={(e) => setEditedSubject(e.target.value)}
                      className="border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 px-4 py-2 rounded-xl w-full mt-2 transition-all duration-200"
                    />
                  ) : (
                    <h3 className="text-xl font-bold mt-2 text-gray-800">{selectedDraft.subject}</h3>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {/* <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1.5 rounded-lg">
                      <span className="text-white text-xs">👤</span>
                    </div> */}
                    <p className="text-sm text-gray-600 font-medium"><span className="font-bold">From:</span> {selectedDraft?.sender_email}</p>
                  </div>
                  {selectedDraft?.to_recipient_emails?.length > 0 &&
                    selectedDraft?.to_recipient_emails?.map((e) => (
                      <div key={e} className="flex items-center gap-2 mt-1">
                        {/* <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-1.5 rounded-lg">
                          <span className="text-white text-xs">📧</span>
                        </div> */}
                        <p className="text-sm text-gray-600 font-medium"><span className="font-bold">To:</span> {e}</p>
                      </div>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                  {editMode ? (
                    <>
                      <button
                        className="border-2 border-gray-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center hover:from-emerald-600 hover:to-teal-600 shadow-lg transform hover:scale-105 transition-all duration-200"
                        onClick={handleSaveEdit}
                      >
                        <Save className="w-4 h-4 mr-2" /> Save
                      </button>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              <hr className="my-6 border-gray-200" />
              <div className="flex items-center gap-2  pb-4">
                <MdOutlineContentPasteGo color="black" size={20} />
                <h3 className="text-lg font-bold text-gray-800">Content</h3>
              </div>

              {editMode ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 rounded-xl w-full p-4 h-64 resize-none transition-all duration-200"
                />
              ) : (
                <textarea
                  value={selectedDraft.body_preview}
                  readOnly
                  className="border-2 border-gray-200 bg-gray-50 rounded-xl w-full p-4 h-64 resize-none focus:outline-none"
                />
              )}

              <hr className="my-6 border-gray-200" />

              {selectedDraft?.summarization?.length > 0 &&
                selectedDraft?.summarization?.map((e, index) => (
                  <div
                    key={index}
                    className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <MdOutlineSummarize color="darkblue" size={20} />
                      <h3 className="text-lg font-bold text-blue-800">Summary</h3>
                    </div>
                    <p className="text-sm text-blue-700 mb-4 leading-relaxed">{e.summary}</p>

                    {e?.calendar?.length > 0 && (
                      <div className="space-y-3">
                        {e.calendar.map((each, i) => (
                          <div key={i} className="p-4 bg-white border border-blue-200 rounded-xl shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="flex items-center gap-2">
                                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-1.5 rounded-lg">
                                  <span className="text-white text-xs">🕒</span>
                                </div>
                                <p className="text-xs text-gray-700">
                                  <span className="font-semibold">Start:</span> {formatDate(each.start.dateTime)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-1.5 rounded-lg">
                                  <span className="text-white text-xs">⏰</span>
                                </div>
                                <p className="text-xs text-gray-700">
                                  <span className="font-semibold">End:</span> {formatDate(each.end.dateTime)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1.5 rounded-lg">
                                  <span className="text-white text-xs">📌</span>
                                </div>
                                <p className="text-xs text-gray-700">
                                  <span className="font-semibold">Subject:</span> {each.subject}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

              {selectedDraft?.reply && (
                <div className="mb-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl shadow-md">
                  <div className="flex items-center gap-2 mb-4">
                    <FaReply size={20} color="purple" />
                    <h3 className="text-lg font-bold text-purple-800">Reply</h3>
                  </div>

                  <textarea
                    value={htmlToPlainText(selectedDraft.reply)}
                    onChange={(e) =>
                      setSelectedDraft((prev) => ({
                        ...prev,
                        reply: e.target.value,
                      }))
                    }
                    placeholder="Write your reply..."
                    className="w-full h-64 p-4 text-sm text-gray-800 bg-white border-2 border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl resize-none transition-all duration-200"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <FaRegClock size={20} />

                  <div>
                    <span className="font-semibold text-gray-700">Last Modified:</span>
                    <p className="text-gray-600">{formatDate(selectedDraft.mail_time)}</p>
                  </div>
                </div>
              </div>

              {!editMode && (
                <div className="flex items-center gap-4 pt-6">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-xl flex items-center font-medium hover:from-blue-600 hover:to-indigo-600 shadow-lg transform hover:scale-105 transition-all duration-200"
                    onClick={() => handleStatusChange(selectedDraft.message_id, "sent")}
                  >
                    <Send className="w-5 h-5 mr-2" /> Send Email
                  </button>
                  <button
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl flex items-center font-medium hover:from-emerald-600 hover:to-teal-600 shadow-lg transform hover:scale-105 transition-all duration-200"
                    onClick={() => handleStatusChange(selectedDraft.message_id, "approved")}
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" /> Approve
                  </button>
                  <button onClick={handleDraft} className="border-2 border-gray-300 px-4 py-2 rounded-xl flex items-center font-medium hover:bg-gray-50 transition-colors duration-200">
                    <Mail className="w-5 h-5 mr-2" /> Save to Drafts
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIDraftReview
