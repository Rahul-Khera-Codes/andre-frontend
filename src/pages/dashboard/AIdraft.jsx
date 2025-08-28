import { useEffect, useState } from "react"
import {
  Bot,
  Send,
  Edit3,
  Save,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Copy,
  Download,
  MoreHorizontal,
  Sparkles,
  FileText,
  Mail,
  Search,
} from "lucide-react"
import { SelectDropdown } from "../../components/CustomDropDown"
import { getAutomateEmails } from "../../apis/emailAutomation"
import Loader from "../../components/loader"
import { IoClose } from "react-icons/io5"
import { BiLeftArrowAlt } from "react-icons/bi"

function AIDraftReview() {

  const [drafts, setDrafts] = useState([])
  const [selectedDraft, setSelectedDraft] = useState({})
  const [editMode, setEditMode] = useState(false)
  const [editedContent, setEditedContent] = useState("")
  const [editedSubject, setEditedSubject] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
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
      const mails = response?.data;
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "draft":
        return <Edit3 className="w-4 h-4" />
      case "reviewed":
        return <Eye className="w-4 h-4" />
      case "approved":
        return <CheckCircle2 className="w-4 h-4" />
      case "sent":
        return <Send className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

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
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const elementsToRemove = tempDiv.querySelectorAll("style, script");
    elementsToRemove.forEach(el => el.remove());

    tempDiv.querySelectorAll("br, li").forEach(el => {
      el.replaceWith("\n" + el.textContent);
    });

    tempDiv.querySelectorAll("p").forEach(el => {
      el.replaceWith(el.textContent + "\n");
    });

    return tempDiv.textContent
      .replace(/\n\s*\n/g, "\n")
      .trim();
  };



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const statusOptions = [{ label: "All", key: "all" }, { label: "Junk Email", key: "junk_email" }, { label: "Drafts", key: "drafts" }, { label: "Inbox", key: "inbox" }, { label: "Deleted Items", key: "deleted_items" }, { label: "Sent Items", key: "sent_items" }]
  return (
    <div className="space-y-6 h-full w-full overflow-auto p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Email Automation</h1>
          <p className="text-slate-600 mt-1">Review documents securely and collaboratively</p>
        </div>
        {/* <div className="flex items-center gap-3">
          <button className="border border-slate-300 px-3 py-2 rounded-md flex items-center text-sm">
            <Sparkles className="w-4 h-4 mr-2" /> New AI Draft
          </button>
          <button className="bg-green-800 text-white px-3 py-2 rounded-md flex items-center text-sm">
            <FileText className="w-4 h-4 mr-2" /> Templates
          </button>
        </div> */}
      </div>

      {/* Main Grid */}
      <div className="flex w-full h-full gap-6">

        {!selectedDraft?.message_id ? <div className={`space-y-4 w-full`}>
          <div className="border flex md:flex-row flex-col gap-3 w-full border-slate-300 rounded-lg p-4">
            <div className="relative md:w-1/2 w-full">
              <input
                placeholder="Search Emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 border focus:border-[#374A8C] focus:outline-none border-slate-200 rounded-lg w-full py-[9.5px] text-sm"
              />
              <Search className="absolute top-5 left-3 -translate-y-1/2 text-slate-400 w-4 h-4" />
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
          <div className="space-y-2 overflow-y-auto">
            {loading ? <div className="h-56 w-full"><Loader /></div> : !message ? filteredDrafts?.length > 0 ? <div className="space-y-2 gap-2 grid md:grid-cols-2 overflow-y-auto">{filteredDrafts.map((draft) => (
              <div
                key={draft.message_id}
                className={`border border-gray-300 rounded-lg p-4 bg-white hover:shadow-md transition-shadow duration-200 cursor-pointer
    ${selectedDraft?.message_id === draft.message_id ? "border-b-2 bg-[#f0f0f0] border-b-[#374A8C]" : ""}
  `}
                onClick={() => {
                  setSelectedDraft(draft);
                  setEditMode(false);
                }}
              >
                {/* Header Row: Subject + Priority Icon */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800 line-clamp-2">
                      📄 {draft.subject || "No Subject"}
                    </span>
                  </div>
                </div>

                {/* Sender */}
                {/* <p className="text-xs text-slate-600 mb-1">
                  <span className="font-bold">Summary: </span> {draft.summarization?.[0]?.summary}
                </p> */}
                <p className="text-xs text-slate-600 mb-1">
                  <span className="font-bold">Sender:</span> {draft.sender_email}
                </p>

                {/* Recipients */}
                {draft?.to_recipient_emails?.length > 0 && (
                  <div className="mb-2 space-y-0.5">
                    {draft.to_recipient_emails.map((email) => (
                      <p key={email} className="text-xs text-slate-600">
                        <span className="font-medium">To:</span> {email}
                      </p>
                    ))}
                  </div>
                )}

                {/* Status + Time */}
                <div className="flex gap-2 items-center mt-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${getStatusColor(draft.status)}`}
                  >
                    {getStatusIcon(draft.status)}
                    {draft.status}
                  </span>
                  <span className="text-xs text-slate-500">{formatDate(draft.received_date_time)}</span>
                </div>
              </div>

            ))} </div> : <div className="border border-slate-300 rounded-lg p-6 text-center">
              <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Mails Found</h3>
            </div> : <div className="border border-slate-300 rounded-lg p-6 text-center">
              <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{message}</h3>
            </div>}
          </div>
        </div>
          :
          <div className="w-full h-full">
            <p className="flex items-center gap-1 py-3 text-md hover:underline cursor-pointer w-fit" onClick={() => setSelectedDraft({})}><BiLeftArrowAlt />Back</p>

            <div className="border border-slate-300 rounded-lg p-4">
              {/* Status Row */}
              <div className="flex items-start justify-between">
                <div>
                  {/* <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${getStatusColor(selectedDraft.status)}`}>
                      {getStatusIcon(selectedDraft.status)}
                      {selectedDraft.status}
                    </span>
                    <span className="border border-slate-300 px-2 py-0.5 rounded text-xs">v{selectedDraft.version}</span>
                    <span className="border border-slate-300 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                      <Bot className="w-3 h-3" />
                      {selectedDraft.aiModel}
                    </span>
                  </div> */}
                  {editMode ? (
                    <input
                      value={editedSubject}
                      onChange={(e) => setEditedSubject(e.target.value)}
                      className="border border-slate-300 px-2 py-1 rounded w-full mt-2"
                    />
                  ) : (
                    <h3 className="text-lg font-semibold mt-2">{selectedDraft.subject}</h3>
                  )}
                  <p className="text-xs text-slate-600">From: {selectedDraft?.sender_email}</p>
                  {selectedDraft?.to_recipient_emails?.length > 0 && selectedDraft?.to_recipient_emails?.map((e) => (
                    <p key={e} className="text-xs text-slate-600">To: {e}</p>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {editMode ? (
                    <>
                      <button className="border border-slate-300 px-3 py-1 rounded text-sm" onClick={() => setEditMode(false)}>Cancel</button>
                      <button className="bg-green-800 text-white px-3 py-1 rounded text-sm flex items-center" onClick={handleSaveEdit}>
                        <Save className="w-4 h-4 mr-1" /> Save
                      </button>
                    </>
                  ) : (
                    <>
                      {/* <button className="border  border-slate-300 px-3 py-1 rounded text-sm flex items-center" onClick={handleEditStart}>
                        <Edit3 className="w-4 h-4 mr-1" /> Edit
                      </button>
                      <button onClick={() => setSelectedDraft({})} className="border cursor-pointer border-slate-300 px-3 py-1 rounded text-sm">
                        <IoClose className="w-4 h-4" />
                      </button> */}
                    </>
                  )}
                </div>
              </div>

              <hr className="my-4" style={{ color: "lightgray" }} />

              {editMode ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="border border-slate-300 rounded w-full p-2 h-64 resize-none focus:outline-none focus:ring-1 focus:ring-[#374A8C]"
                />
              ) : (
                <textarea
                  value={selectedDraft.body_preview}
                  readOnly
                  className="border border-slate-300 rounded w-full p-2 h-64 resize-none focus:outline-none focus:ring-1 focus:ring-[#374A8C]"
                />
              )}


              <hr className="my-4" style={{ color: "lightgrey" }} />

              {selectedDraft?.summarization?.length > 0 && selectedDraft?.summarization?.map((e, index) => (
                <div key={index} className="mb-6 p-4 border border-slate-200 rounded-lg shadow-sm bg-white">
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">📝 Summary:</h3>
                  <p className="text-sm text-slate-600 mb-4">{e.summary}</p>

                  {e?.calendar?.length > 0 && (
                    <div className="space-y-4">
                      {e.calendar.map((each, i) => (
                        <div key={i} className="p-3 border border-slate-100 rounded-md bg-slate-50">
                          <p className="text-xs text-slate-700"><span className="font-semibold">🕒 Start Time:</span> {formatDate(each.start.dateTime)}</p>
                          <p className="text-xs text-slate-700"><span className="font-semibold">⏰ End Time:</span> {formatDate(each.end.dateTime)}</p>
                          <p className="text-xs text-slate-700"><span className="font-semibold">📌 Subject:</span> {each.subject}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {selectedDraft?.reply && (
                <div className="mb-6 p-6 border border-slate-200 rounded-xl shadow-md bg-white">
                  <h3 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
                    🗨️ <span>Reply</span>
                  </h3>

                  <textarea
                    value={htmlToPlainText(selectedDraft.reply)}
                    onChange={(e) =>
                      setSelectedDraft(prev => ({
                        ...prev,
                        reply: e.target.value,
                      }))
                    }
                    placeholder="Write your reply..."
                    className="w-full h-64 p-4 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#374A8C] focus:border-transparent transition-shadow"
                  />
                </div>
              )}



              <div className="grid grid-cols-2 gap-4 text-sm">
                {/* <div>
                <span className="font-medium text-slate-700">Created:</span>
                <p className="text-slate-600">{formatDate(selectedDraft.createdAt)}</p>
              </div> */}
                <div>
                  <span className="font-medium text-slate-700">Last Modified:</span>
                  <p className="text-slate-600">{formatDate(selectedDraft.mail_time)}</p>
                </div>
                {/* <div>
                <span className="font-medium text-slate-700">Template:</span>
                <p className="text-slate-600">{selectedDraft.template}</p>
              </div>
              <div>
                <span className="font-medium text-slate-700">AI Confidence:</span>
                <p className="text-slate-600">{selectedDraft.confidence}%</p>
              </div> */}
              </div>
              {/*
            <div className="mt-4">
              <span className="font-medium text-slate-700">Original Prompt:</span>
              <p className="text-slate-600 text-sm mt-1 italic">{selectedDraft.originalPrompt}</p>
            </div> */}

              {!editMode && (
                <div className="flex items-center gap-3 pt-4">
                  <button
                    className="bg-[#374A8C] text-white px-3 py-2 rounded flex items-center"
                    onClick={() => handleStatusChange(selectedDraft.message_id, "sent")}
                  >
                    <Send className="w-4 h-4 mr-2" /> Send Email
                  </button>
                  <button
                    className="border border-slate-300 px-3 py-2 rounded flex items-center"
                    onClick={() => handleStatusChange(selectedDraft.message_id, "approved")}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                  </button>
                  <button className="border border-slate-300 px-3 py-2 rounded flex items-center">
                    <Mail className="w-4 h-4 mr-2" /> Save to Drafts
                  </button>
                </div>
              )}
            </div>

            {/* <div className="border rounded-lg p-6 text-center">
               <Bot className="w-16 h-16 text-slate-300 mx-auto mb-4" />
               <h3 className="text-lg font-semibold text-slate-900 mb-2">Select a draft to review</h3>
               <p className="text-slate-600">Choose a draft from the list to start reviewing and editing.</p>
             </div> */}
          </div>
        }
      </div>
    </div>
  )
}

export default AIDraftReview
