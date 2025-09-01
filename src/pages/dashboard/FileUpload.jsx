
import { useEffect, useRef, useState } from "react"
import {
    UploadCloud,
    FileText,
    ImageIcon,
    FileCode,
    FileSpreadsheet,
    FileIcon,
    CalendarClock,
} from "lucide-react"
import Loader from "../../components/loader"
import Header from "../../components/Header"
import { getSummarizeFiles, summarizeFiles } from "../../apis/fileupload"


function KindIcon({ kind }) {
    switch (kind) {
        case "image":
            return (
                <div className="h-9 w-9 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center ring-1 ring-blue-100">
                    <ImageIcon className="h-5 w-5" />
                </div>
            )
        case "spreadsheet":
            return (
                <div className="h-9 w-9 rounded-md bg-indigo-50 text-indigo-700 flex items-center justify-center ring-1 ring-indigo-100">
                    <FileSpreadsheet className="h-5 w-5" />
                </div>
            )
        case "code":
            return (
                <div className="h-9 w-9 rounded-md bg-indigo-50 text-indigo-700 flex items-center justify-center ring-1 ring-indigo-100">
                    <FileCode className="h-5 w-5" />
                </div>
            )
        case "text":
            return (
                <div className="h-9 w-9 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center ring-1 ring-blue-100">
                    <FileText className="h-5 w-5" />
                </div>
            )
        default:
            return (
                <div className="h-9 w-9 rounded-md bg-slate-50 text-slate-700 flex items-center justify-center ring-1 ring-slate-200">
                    <FileIcon className="h-5 w-5" />
                </div>
            )
    }
}

export default function FilesPage() {
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const inputFile = useRef()
    const [data, setData] = useState({
        items: [
            {
                id: "1",
                name: "project-notes.txt",
                sizeKB: 14,
                type: "text/plain",
                uploadedAt: new Date().toISOString(),
                summary: {
                    kind: "text",
                    preview: "These are the initial project notes covering the core idea, scope, and timeline...",
                    wordCount: 52,
                    lineCount: 6,
                },
            },
            {
                id: "2",
                name: "report.xlsx",
                sizeKB: 92,
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                uploadedAt: new Date().toISOString(),
                summary: {
                    kind: "spreadsheet",
                },
            },
            {
                id: "3",
                name: "landing-page.html",
                sizeKB: 35,
                type: "text/html",
                uploadedAt: new Date().toISOString(),
                summary: {
                    kind: "code",
                    preview: "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\" />\n...",
                    wordCount: 160,
                    lineCount: 22,
                },
            },
            {
                id: "4",
                name: "team-photo.jpg",
                sizeKB: 2048,
                type: "image/jpeg",
                uploadedAt: new Date().toISOString(),
                summary: {
                    kind: "image",
                },
            },
            {
                id: "5",
                name: "manual.pdf",
                sizeKB: 783,
                type: "application/pdf",
                uploadedAt: new Date().toISOString(),
                summary: {
                    kind: "pdf",
                },
            },
            {
                id: "6",
                name: "unknown.xyz",
                sizeKB: 12,
                type: "application/octet-stream",
                uploadedAt: new Date().toISOString(),
                summary: {
                    kind: "other",
                },
            },
        ],
    })

    const [isLoading, setIsLoading] = useState(true)
    const [pageLoading, setPageLoading] = useState(true)

    useEffect(() => {
        (function () {
            const id = setTimeout(() => {
                setPageLoading(false)
            }, 1000)
            return () => clearTimeout(id)
        }())

    }, [])

    useEffect(() => {
        if (data?.length > 0) {
            setIsLoading(false)
        }
    }, [data])

    useEffect(() => {
        // fetchSummarizeData()
    }, [])

    const fetchSummarizeData = async () => {
        setIsLoading(true)
        try {
            const response = await getSummarizeFiles();
            console.log(response)
            if (response?.status === 200) {
                setData(response?.data)
            } else {
                setIsLoading(false)
            }

        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    async function uploadFile(file) {
        setError(null)
        setIsUploading(true)
        try {
            const payload = new FormData()
            payload.append("file_type", "pdf")
            payload.append("document", file)
            const response = await summarizeFiles(payload)
            console.log(response)
        } catch (err) {
            setError(err?.message ?? "Upload failed")
        } finally {
            setIsUploading(false)
            inputFile.current.value = ""
        }
    }

    async function onUpload(e) {
        const file = e.target.files?.[0]
        if (!file) return
        await uploadFile(file)
        e.currentTarget.value = ""
    }

    const items = data?.items ?? []

    if (pageLoading) return <Loader />

    return (
        <div className="h-full w-full overflow-auto p-3">
            <div className="mx-auto flex flex-col gap-6">

                <Header header={"File Upload & Summaries"} description={"Upload files and view concise summaries fetched from the API."} />


                <section className="mb-8 rounded-xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
                    <div
                        className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 px-4 py-8 text-center transition
              ${isDragging ? "ring-2 ring-indigo-300 bg-blue-50" : "ring-0"}`}
                        onDragOver={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                        onDragEnter={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setIsDragging(true)
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setIsDragging(false)
                        }}
                        onDrop={async (e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setIsDragging(false)
                            const file = e.dataTransfer?.files?.[0]
                            if (file) await uploadFile(file)
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center ring-1 ring-blue-100">
                                <UploadCloud className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-slate-800">Drag & drop your file here</p>
                                <p className="text-xs text-slate-500">or click to browse from your computer</p>
                            </div>
                        </div>
                        <label className="mt-2 inline-flex cursor-pointer items-center justify-center rounded-md bg-indigo-600/90 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                            {isUploading ? "Uploading..." : "Choose File"}
                            <input type="file" ref={inputFile} onChange={onUpload} className="sr-only" aria-label="Upload file" />
                        </label>
                        {error && (
                            <p className="mt-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                                {error}
                            </p>
                        )}
                    </div>
                    <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                        <CalendarClock className="h-4 w-4 text-slate-400" />
                        Summaries are generated server-side for text-like files. Other files show type and size.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-slate-700">Recent uploads</h2>

                    {isLoading ? (
                        <div className="grid gap-3 md:grid-cols-2">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                                    <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
                                    <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-100" />
                                    <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                                </div>
                            ))}
                        </div>
                    ) : items.length === 0 ? (
                        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600">
                            No files yet. Upload a file to see its summary here.
                        </div>
                    ) : (
                        <ul className="grid gap-3 md:grid-cols-2">
                            {items.map((item) => (
                                <li
                                    key={item.id}
                                    // className="p-6 transform hover:scale-105 transition-all duration-200 rounded-2xl flex justify-between items-center text-black shadow-xl hover:shadow-xl"
                                    className="group rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm transition-all duration-200  hover:shadow-md hover:border-indigo-300"
                                >
                                    <div className="flex items-start gap-3">
                                        <KindIcon kind={item.summary.kind} />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="truncate text-sm font-medium text-slate-800">{item.name}</p>
                                                <span className="whitespace-nowrap text-xs text-slate-500">{item.sizeKB} KB</span>
                                            </div>
                                            <div className="mt-1 flex flex-wrap items-center gap-2">
                                                <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-xs text-slate-600 ring-1 ring-slate-200">
                                                    {item.type || "Unknown"}
                                                </span>
                                                <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700 ring-1 ring-amber-200">
                                                    {new Date(item.uploadedAt).toLocaleString()}
                                                </span>
                                            </div>

                                            <div className="mt-3 rounded-md bg-gradient-to-r from-slate-50 to-blue-50 p-3 ring-1 ring-inset ring-slate-100">
                                                {item.summary.kind === "text" || item.summary.kind === "code" ? (
                                                    <div>
                                                        {item.summary.preview ? (
                                                            <p className="text-sm text-slate-700 text-pretty">
                                                                {item.summary.preview}
                                                                {item.summary.preview.length >= 220 ? "…" : ""}
                                                            </p>
                                                        ) : (
                                                            <p className="text-sm text-slate-600">No preview available.</p>
                                                        )}
                                                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                                            {typeof item.summary.wordCount === "number" && (
                                                                <span>Words: {item.summary.wordCount}</span>
                                                            )}
                                                            {typeof item.summary.lineCount === "number" && (
                                                                <span>Lines: {item.summary.lineCount}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-slate-700">
                                                        {item.summary.kind === "image" && "Image file"}
                                                        {item.summary.kind === "pdf" && "PDF document"}
                                                        {item.summary.kind === "spreadsheet" && "Spreadsheet"}
                                                        {item.summary.kind === "other" && "File"} summary available: type and size only.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    )
}
