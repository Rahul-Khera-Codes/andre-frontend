"use client"

import { useState, useEffect, useRef } from "react"
import {
    Upload,
    FolderPlus,
    Grid3X3,
    List,
    Trash2,
    File,
    Folder,
    ImageIcon,
    FileText,
    Music,
    Video,
    Archive,
    Code,
    MoreVertical,
    BrushCleaning,
    DownloadCloudIcon,
    MoreVerticalIcon,
} from "lucide-react"
import Header from "../../components/Header"
import CustomInputField from "../../components/CustomInputField"
import { getDriveLists } from "../../apis/drive"
import Loader from "../../components/loader"
import { MdOutlineFileDownload } from "react-icons/md"
import { IoChatbubbleOutline } from "react-icons/io5"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { getDraftUrl } from '../../store/draftShareUrlSlice'

function Drive() {
    const [files, setFiles] = useState([])
    const [currentPath, setCurrentPath] = useState({})
    const [fullPath, setFullPath] = useState([])
    const [viewMode, setViewMode] = useState("grid")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedFiles, setSelectedFiles] = useState([])
    const [isUploading, setIsUploading] = useState(false)
    const [showNewFolder, setShowNewFolder] = useState(false)
    const [newFolderName, setNewFolderName] = useState("")
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState("");
    const menuRef = useRef(null);
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        fetchFiles()
        setCurrentPath({ key: "", label: "Home" })
        setFullPath([{ key: "", label: "Home " }])
    }, [])

    const fetchFiles = async (path = "") => {
        try {
            setLoading(true)
            const response = await getDriveLists(path);
            if (response?.status === 200) {
                const customResponse = response?.data?.value.map((e) => {
                    let type = "file";

                    if (e.folder) {
                        type = "folder";
                    } else if (e.file) {
                        const mime = e.file.mimeType || "";

                        if (mime.includes("pdf")) {
                            type = "pdf";
                        } else if (
                            mime.includes("spreadsheet") ||
                            mime.includes("excel") ||
                            mime.includes("sheet")
                        ) {
                            type = "spreadsheet";
                        } else if (
                            mime.includes("presentation") ||
                            mime.includes("powerpoint") ||
                            mime.includes("ppt")
                        ) {
                            type = "presentation";
                        } else if (mime.includes("word") || mime.includes("document")) {
                            type = "document";
                        } else if (mime.startsWith("image/")) {
                            type = "image";
                        } else if (mime.startsWith("video/")) {
                            type = "video";
                        } else if (mime.startsWith("audio/")) {
                            type = "audio";
                        } else {
                            type = "file";
                        }
                    }
                    return {
                        ...e,
                        id: e.id,
                        name: e.name,
                        type,
                        path: "/",
                        size: e.size,
                        modified: e.lastModifiedDateTime,
                        created: e.createdDateTime,
                        url: e?.[`@microsoft.graph.downloadUrl`]
                    };
                });
                setFiles(customResponse)

            }
        } catch (error) {
            console.error("Failed to fetch files:", error)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append("file", file)
        formData.append("path", currentPath)

        try {
            const response = await fetch("/api/drive/upload", {
                method: "POST",
                body: formData,
            })

            if (response.ok) {
                fetchFiles()
            }
        } catch (error) {
            console.error("Upload failed:", error)
        } finally {
            setIsUploading(false)
        }
    }

    const createFolder = async () => {
        if (!newFolderName.trim()) return

        try {
            const response = await fetch("/api/drive/folder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newFolderName.trim(),
                    path: currentPath,
                }),
            })

            if (response.ok) {
                setNewFolderName("")
                setShowNewFolder(false)
                fetchFiles()
            }
        } catch (error) {
            console.error("Failed to create folder:", error)
        }
    }

    const deleteSelected = async () => {
        if (selectedFiles.length === 0) return

        try {
            await Promise.all(
                selectedFiles.map((fileId) =>
                    fetch("/api/drive/delete", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: fileId, path: currentPath }),
                    }),
                ),
            )

            setSelectedFiles([])
            fetchFiles()
        } catch (error) {
            console.error("Failed to delete files:", error)
        }
    }

    const handleDirectory = async (id, name) => {
        await fetchFiles(id ? `?folder_id=${id}` : ``)
        const index = fullPath.findIndex((e) => e.key === id)
        const filterPath = fullPath.splice(0, index + 1)
        setFullPath(filterPath)
        setCurrentPath({ key: id, label: name })
    }

    const handleDownload = (url, name) => {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getFileIcon = (type) => {
        const iconProps = { size: 20, className: "text-white" }

        switch (type) {
            case "folder":
                return <Folder {...iconProps} />
            case "image":
                return <ImageIcon {...iconProps} />
            case "document":
                return <FileText {...iconProps} />
            case "audio":
                return <Music {...iconProps} />
            case "video":
                return <Video {...iconProps} />
            case "archive":
                return <Archive {...iconProps} />
            case "code":
                return <Code {...iconProps} />
            default:
                return <File {...iconProps} />
        }
    }

    const getFileTypeColor = (type) => {
        switch (type) {
            case "folder":
                return "bg-gradient-to-br from-blue-500 to-blue-600"
            case "image":
                return "bg-gradient-to-br from-green-500 to-green-600"
            case "document":
                return "bg-gradient-to-br from-red-500 to-red-600"
            case "audio":
                return "bg-gradient-to-br from-purple-500 to-purple-600"
            case "video":
                return "bg-gradient-to-br from-pink-500 to-pink-600"
            case "archive":
                return "bg-gradient-to-br from-yellow-500 to-yellow-600"
            case "code":
                return "bg-gradient-to-br from-indigo-500 to-indigo-600"
            default:
                return "bg-gradient-to-br from-slate-500 to-slate-600"
        }
    }

    const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))


    return (
        <div className="space-y-6 h-full w-full p-3 overflow-auto bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
            <Header header={"Drive"} description={"Store, organize, and access your files and folders in one place"} />
            <div className="p-6 md:flex-row flex-col bg-white justify-between rounded-2xl shadow-lg border border-gray-100 flex gap-3">
                <CustomInputField placeholder={"Search files..."} search={searchQuery} setSearch={setSearchQuery} extraStyles={`md:w-1/2 w-full`} />
                <div className="flex gap-3">
                    {/* <div className="flex items-center space-x-3">
                        <label className="flex items-center space-x-2 px-4 py-2  bg-[#374A8C] hover:bg-[#37498cf6] text-white rounded-lg transition-all cursor-pointer">
                            <Upload size={18} />
                            <span>{isUploading ? "Uploading..." : "Upload"}</span>
                            <input type="file" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
                        </label>

                        <button
                            onClick={() => setShowNewFolder(true)}
                            className="flex items-center space-x-2 px-4 py-2 cursor-pointer bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all"
                        >
                            <FolderPlus size={18} />
                            <span>New Folder</span>
                        </button>
                    </div> */}
                    <div className="flex bg-slate-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white text-slate-800 shadow-sm" : "text-slate-600 hover:text-slate-800"
                                }`}
                        >
                            <Grid3X3 size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white text-slate-800 shadow-sm" : "text-slate-600 hover:text-slate-800"
                                }`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    {selectedFiles.length > 0 && <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setSelectedFiles([])}
                                className="flex cursor-pointer items-center space-x-2 px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all"
                            >
                                <BrushCleaning />
                                <span>Clear All</span>
                            </button>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="text-sm text-slate-600">{selectedFiles.length} selected</span>
                            <button
                                onClick={deleteSelected}
                                className="flex cursor-pointer items-center space-x-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
                            >
                                <Trash2 size={18} />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>}
                    <div className="overflow-x-auto max-w-full">
                        <ul className="flex gap-[4px] whitespace-nowrap">
                            {fullPath.map((e) => (
                                <li
                                    key={e.key}
                                    className={`cursor-pointer text-black ${e.key !== currentPath.key && 'text-gray-400'}`}
                                    onClick={() => handleDirectory(e.key, e.label)}
                                >
                                    / {e.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            {showNewFolder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Create New Folder</h3>
                        <input
                            type="text"
                            placeholder="Folder name"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && createFolder()}
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                            autoFocus
                        />
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowNewFolder(false)
                                    setNewFolderName("")
                                }}
                                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createFolder}
                                disabled={!newFolderName.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                {loading ? (
                    <Loader />
                ) : filteredFiles.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Folder className="text-slate-400" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-slate-800 mb-2">
                            {searchQuery ? "No files found" : "This folder is empty"}
                        </h3>
                        <p className="text-slate-600">
                            {searchQuery ? "Try adjusting your search terms" : "Upload files or create folders to get started"}
                        </p>
                    </div>
                ) : (
                    <div
                        className={
                            viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" : "space-y-2"
                        }
                    >
                        {filteredFiles.map((file) => (
                            <div
                                key={file.id}
                                className={`group relative ${viewMode === "grid"
                                    ? "bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer"
                                    : "bg-white rounded-lg p-3 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer flex items-center space-x-3"
                                    }`}
                                onMouseLeave={() => setIsOpen("")}
                                onClick={async () => {
                                    await fetchFiles(`?folder_id=${file.id}`)
                                    setFullPath((prev) => ([
                                        ...prev, { key: file.id, label: `${file.name} ` }
                                    ]))
                                    setCurrentPath({ key: file.id, label: file.name })
                                }}
                            >
                                <>
                                    {/* {file.url && <div className={`absolute ${viewMode === "grid" ? 'top-2' : 'top-8 right-1'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDownload(file.url, file.name)

                                        }}>
                                        <DownloadCloudIcon color="#717a9f" size={20} />
                                    </div>} */}
                                    {/* <input
                                        type="checkbox"
                                        checked={selectedFiles.includes(file.id)}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            // if (e.target.checked) {
                                            //     setSelectedFiles([...selectedFiles, file.id])
                                            // } else {
                                            //     setSelectedFiles(selectedFiles.filter((id) => id !== file.id))
                                            // }
                                        }}
                                        className="absolute top-2 accent-[#374A8C] w-4 h-4 right-2 z-10"
                                    /> */}
                                    {file.url && <div className="absolute top-2 right-2">
                                        <MoreVerticalIcon
                                            size={15}
                                            className="accent-[#374A8C] cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsOpen(file.id);
                                            }}
                                        />

                                        {isOpen === file.id && (
                                            <div className="absolute right-0 mt-1 w-38 bg-white shadow-md border border-gray-200 rounded-md py-1 z-30">
                                                <button
                                                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDownload(file.url, file.name)
                                                        setIsOpen("");
                                                    }}
                                                >
                                                    <div> <MdOutlineFileDownload /></div>
                                                    Download
                                                </button>
                                                <button
                                                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate("/dashboard/chat")
                                                        dispatch(getDraftUrl(file))
                                                        setIsOpen("");
                                                        console.log("Share clicked");
                                                    }}
                                                >
                                                    <div> <IoChatbubbleOutline />
                                                    </div>
                                                    Ask to Chat
                                                </button>
                                            </div>
                                        )}
                                    </div>}
                                </>

                                {viewMode === "grid" ? (
                                    <>
                                        <div
                                            className={`w-12 h-12 rounded-lg mx-auto flex items-center justify-center mb-3 ${getFileTypeColor(file.type)}`}
                                        >
                                            {getFileIcon(file.type)}
                                        </div>
                                        <div className="text-center">
                                            <p className="font-medium text-slate-800 text-sm truncate" title={file.name}>
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">{file.type === "folder" ? "Folder" : file.size}</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getFileTypeColor(file.type)}`}
                                        >
                                            {getFileIcon(file.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-800 truncate" title={file.name}>
                                                {file.name}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {file.type === "folder" ? "Folder" : file.size} • {file.modified}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Drive
