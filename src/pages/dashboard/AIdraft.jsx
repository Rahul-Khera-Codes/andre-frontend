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
} from "lucide-react"
import { SelectDropdown } from "../../components/CustomDropDown"
import { getAutomateEmails } from "../../apis/emailAutomation"
import Loader from "../../components/loader"
import { IoClose } from "react-icons/io5"

function AIDraftReview() {
  const mockDrafts = [
    {
      id: "1",
      subject: "IRB Protocol Review - Phase II Clinical Trial Update",
      recipient: "regulatory@biotech.com",
      content: `Dear Regulatory Team,

I hope this email finds you well. I am writing to provide an update on the Phase II clinical trial protocol that requires IRB review.

Following our recent discussions and the feedback received from the preliminary review, I have made the necessary revisions to the protocol document. The key changes include:

1. Updated inclusion/exclusion criteria based on recent safety data
2. Revised dosing schedule to align with FDA recommendations
3. Enhanced safety monitoring procedures
4. Clarified statistical analysis plan

The revised protocol is now ready for formal IRB submission. I have attached the updated document along with a summary of changes for your review.

Please let me know if you need any additional information or if there are any concerns that need to be addressed before submission.

Best regards,
Dr. Smith`,
      status: "draft",
      priority: "high",
      category: "regulatory",
      createdAt: "2024-01-15T10:30:00Z",
      lastModified: "2024-01-15T10:30:00Z",
      aiModel: "GPT-4",
      confidence: 92,
      originalPrompt: "Write a professional email to the regulatory team about IRB protocol review updates",
      version: 1,
      template: "Regulatory Communication",
    },
    {
      id: "2",
      subject: "Lab Equipment Maintenance Schedule - Q1 2024",
      recipient: "facilities@biotech.com",
      content: `Hello Facilities Team,

I hope you're doing well. I wanted to reach out regarding the quarterly maintenance schedule for our laboratory equipment.

As we approach Q1 2024, it's important that we ensure all critical equipment is properly maintained to avoid any disruptions to our research activities. Based on our maintenance logs and manufacturer recommendations, the following equipment requires attention:

• Centrifuges (Units A-C) - Due for calibration
• PCR machines - Routine maintenance required
• Microscopy equipment - Annual service check
• Incubators - Temperature calibration needed

Could we schedule a meeting next week to discuss the maintenance timeline and coordinate with our research schedule? I'm available Tuesday through Thursday afternoon.

Thank you for your continued support in maintaining our lab operations.

Best regards,
Dr. Smith`,
      status: "reviewed",
      priority: "medium",
      category: "administrative",
      createdAt: "2024-01-14T14:20:00Z",
      lastModified: "2024-01-14T16:45:00Z",
      aiModel: "GPT-4",
      confidence: 88,
      originalPrompt: "Draft email about lab equipment maintenance scheduling",
      version: 2,
      template: "Administrative Request",
    },
    {
      id: "3",
      subject: "Research Data Analysis Results - Q4 Summary",
      recipient: "research-team@biotech.com",
      content: `Dear Research Team,

I'm pleased to share the completed analysis of our Q4 research data, which shows promising results for our ongoing studies.

Key Findings:
- Primary endpoint achieved statistical significance (p<0.001)
- Safety profile remains favorable with no new adverse events
- Biomarker analysis indicates strong correlation with clinical outcomes
- Patient compliance exceeded 95% across all study arms

The detailed statistical report and visualizations are attached for your review. I recommend we schedule a team meeting to discuss these findings and plan our next steps for the upcoming quarter.

Please review the data and come prepared with any questions or observations for our discussion.

Looking forward to our continued collaboration.

Best regards,
Dr. Smith`,
      status: "approved",
      priority: "high",
      category: "research",
      createdAt: "2024-01-13T09:15:00Z",
      lastModified: "2024-01-13T11:30:00Z",
      aiModel: "GPT-4",
      confidence: 95,
      originalPrompt: "Create research summary email with Q4 data analysis results",
      version: 1,
      template: "Research Update",
    },
  ]

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
        draft.subject?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        draft.recipient?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      const matchesStatus = draft.status === selectedStatus
      const matchesCategory = draft.category === selectedCategory
      return matchesSearch || matchesStatus || matchesCategory
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
      const mails = response?.data?.mails;
      if (mails?.length > 0) {
        const updatedFormat = mails.map((e) => ({
          ...e,
          recipient: e.toRecipients[0]?.emailAddress.address,
          content: htmlToPlainText(e.body.content),
          status: e.isDraft ? 'draft' : 'approved',
          priority: e.importance,
          category: e.categories ?? "research",
          createdAt: e.createdDateTime,
          lastModified: e.lastModifiedDateTime,
          aiModel: "GPT-4",
          confidence: 95,
          originalPrompt: "Create research summary email with Q4 data analysis results",
          version: 1,
          template: "Research Update",
        }));
        setDrafts(updatedFormat)
        filteredData(updatedFormat)
      } else {
        setDrafts([])
        filteredData()
        setMessage(response?.message??"No Mails Found")
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
      setEditedContent(selectedDraft.content)
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
        lastModified: new Date().toISOString(),
        version: selectedDraft.version + 1,
        status: "reviewed",
      }
      setDrafts((prev) => prev.map((d) => (d.id === selectedDraft.id ? updatedDraft : d)))
      setSelectedDraft(updatedDraft)
      setEditMode(false)
    }
  }

  const handleStatusChange = (draftId, newStatus) => {
    setDrafts((prev) => prev.map((d) => (d.id === draftId ? { ...d, status: newStatus } : d)))
    if (selectedDraft?.id === draftId) {
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
  const catageriousOptions = [{ label: "All", key: "all" }, { label: "Research", key: "research" }, { label: "Regulatory", key: "regulatory" },
  { label: "Administrative", key: "administrative" }, { label: "Clinical", key: "clinical" }]
  const statusOptions = [{ label: "All", key: "all" }, { label: "Sentitems", key: "sentitems" }, { label: "Draft", key: "draft" }, { label: "Inbox", key: "inbox" },]
  return (
    <div className="space-y-6 h-full w-full overflow-auto p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">AI Draft Review</h1>
          <p className="text-slate-600 mt-1">Review documents securely and collaboratively</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="border border-slate-300 px-3 py-2 rounded-md flex items-center text-sm">
            <Sparkles className="w-4 h-4 mr-2" /> New AI Draft
          </button>
          <button className="bg-green-800 text-white px-3 py-2 rounded-md flex items-center text-sm">
            <FileText className="w-4 h-4 mr-2" /> Templates
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex w-full h-full gap-6">
        {/* Left Panel */}
        <div className={`space-y-4 ${selectedDraft?.status ? 'w-[35%]' : 'w-full'}`}>
          <div className="border border-slate-300 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Drafts</h2>
              <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">{filteredDrafts.length}</span>
            </div>
            <input
              className="border focus:outline-none focus:ring-1 focus:ring-green-500 h-10 border-slate-300 w-full px-2 py-1 rounded mb-2 text-sm"
              placeholder="Search drafts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex md:flex-row flex-col gap-2">
              <SelectDropdown
                name="status"
                options={statusOptions}
                value={selectedStatus}
                onChange={(updated) => {
                  setSelectedStatus(updated)
                }}
                placeholder="Select"
                className="w-full"
                extraName="Status"
              />
              <SelectDropdown
                name="categories"
                options={catageriousOptions}
                value={selectedCategory}
                onChange={(updated) => {
                  setSelectedCategory(updated)
                }}
                placeholder="Select"
                className="w-full"
                extraName="Categories"
              />
            </div>
          </div>

          {/* Drafts List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {loading ? <div className="h-56 w-full"><Loader /></div> : !message ? filteredDrafts.map((draft) => (
              <div
                key={draft.id}
                className={`border border-slate-300 rounded-lg p-3 cursor-pointer hover:shadow-sm ${selectedDraft?.id === draft.id ? "border-b-2 bg-[#e8e1e176] border-b-green-800" : ""
                  }`}
                onClick={() => {
                  setSelectedDraft(draft)
                  setEditMode(false)
                }}
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-sm leading-tight line-clamp-2">{draft.subject}</h4>
                  <AlertTriangle className={`w-3 h-3 flex-shrink-0 ml-2 ${getPriorityColor(draft.priority)}`} />
                </div>
                <p className="text-xs text-slate-600">To: {draft.recipient}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${getStatusColor(draft.status)}`}>
                    {getStatusIcon(draft.status)}
                    {draft.status}
                  </span>
                  <span className="text-xs text-slate-500">{formatDate(draft.lastModified)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                  <span>v{draft.version}</span>
                  <span className="flex items-center gap-1">
                    <Bot className="w-3 h-3" />
                    {draft.confidence}%
                  </span>
                </div>
              </div>
            )) : <div className="border border-slate-300 rounded-lg p-6 text-center">
              <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{message}</h3>
            </div>}
          </div>
        </div>

        {/* Right Panel */}
        {(selectedDraft?.status) && <div className="w-[65%] h-full">

          <div className="border border-slate-300 rounded-lg p-4">
            {/* Status Row */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${getStatusColor(selectedDraft.status)}`}>
                    {getStatusIcon(selectedDraft.status)}
                    {selectedDraft.status}
                  </span>
                  <span className="border border-slate-300 px-2 py-0.5 rounded text-xs">v{selectedDraft.version}</span>
                  <span className="border border-slate-300 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                    <Bot className="w-3 h-3" />
                    {selectedDraft.aiModel}
                  </span>
                </div>
                {editMode ? (
                  <input
                    value={editedSubject}
                    onChange={(e) => setEditedSubject(e.target.value)}
                    className="border border-slate-300 px-2 py-1 rounded w-full mt-2"
                  />
                ) : (
                  <h3 className="text-lg font-semibold mt-2">{selectedDraft.subject}</h3>
                )}
                <p className="text-sm text-slate-600">To: {selectedDraft.recipient}</p>
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
                    <button className="border  border-slate-300 px-3 py-1 rounded text-sm flex items-center" onClick={handleEditStart}>
                      <Edit3 className="w-4 h-4 mr-1" /> Edit
                    </button>
                    <button onClick={() => setSelectedDraft({})} className="border cursor-pointer border-slate-300 px-3 py-1 rounded text-sm">
                      <IoClose className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <hr className="my-4" style={{ color: "lightgray" }} />

            {editMode ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="border border-slate-300 rounded w-full p-2 h-64 resize-none focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            ) : (
              <textarea
                value={selectedDraft.content}
                readOnly
                className="border border-slate-300 rounded w-full p-2 h-64 resize-none focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            )}


            <hr className="my-4" style={{ color: "lightgrey" }} />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-slate-700">Created:</span>
                <p className="text-slate-600">{formatDate(selectedDraft.createdAt)}</p>
              </div>
              <div>
                <span className="font-medium text-slate-700">Last Modified:</span>
                <p className="text-slate-600">{formatDate(selectedDraft.lastModified)}</p>
              </div>
              <div>
                <span className="font-medium text-slate-700">Template:</span>
                <p className="text-slate-600">{selectedDraft.template}</p>
              </div>
              <div>
                <span className="font-medium text-slate-700">AI Confidence:</span>
                <p className="text-slate-600">{selectedDraft.confidence}%</p>
              </div>
            </div>

            <div className="mt-4">
              <span className="font-medium text-slate-700">Original Prompt:</span>
              <p className="text-slate-600 text-sm mt-1 italic">{selectedDraft.originalPrompt}</p>
            </div>

            {!editMode && (
              <div className="flex items-center gap-3 pt-4">
                <button
                  className="bg-green-800 text-white px-3 py-2 rounded flex items-center"
                  onClick={() => handleStatusChange(selectedDraft.id, "sent")}
                >
                  <Send className="w-4 h-4 mr-2" /> Send Email
                </button>
                <button
                  className="border border-slate-300 px-3 py-2 rounded flex items-center"
                  onClick={() => handleStatusChange(selectedDraft.id, "approved")}
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
