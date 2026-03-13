"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { updateSubmissionStatus, deleteSubmission, getSubmissions } from "@/actions/leads"
import { Search, Trash2, Eye, ChevronDown, ChevronUp, Filter, Download } from "lucide-react"
import { useRouter } from "next/navigation"

// Types
interface Submission {
    id: string
    formType: string
    source: string | null
    name: string
    email: string
    phone: string | null
    whatsapp: string | null
    company: string | null
    message: string | null
    metadata: any
    status: string
    priority: string
    adminNotes: string | null
    scheduledDate: Date | null
    scheduledTime: string | null
    createdAt: Date
    updatedAt: Date
    respondedAt: Date | null
}

// Status config
const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    new: { label: "New", variant: "default" },
    contacted: { label: "Contacted", variant: "secondary" },
    proposal_sent: { label: "Proposal Sent", variant: "outline" },
    accepted: { label: "Accepted", variant: "default" },
    rejected: { label: "Rejected", variant: "destructive" },
    completed: { label: "Completed", variant: "secondary" },
}

// Form type labels
const FORM_TYPE_LABELS: Record<string, string> = {
    consultancy: "🗓️ Consultancy",
    proposal: "📋 Proposal",
    package: "📦 Package",
    "video-project": "🎬 Video",
    "graphic-project": "🎨 Graphic",
    contact: "📧 Contact",
}

// Status order for dropdown
const STATUS_OPTIONS = ["new", "contacted", "proposal_sent", "accepted", "rejected", "completed"]
const FORM_TYPE_OPTIONS = ["all", "consultancy", "proposal", "package", "video-project", "graphic-project", "contact"]

interface LeadTableProps {
    initialSubmissions: Submission[]
}

export function LeadTable({ initialSubmissions }: LeadTableProps) {
    const router = useRouter()
    const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all")
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [updating, setUpdating] = useState<string | null>(null)

    // Client-side filter
    const filtered = submissions.filter((s) => {
        const matchSearch = search === "" ||
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.email.toLowerCase().includes(search.toLowerCase()) ||
            (s.company && s.company.toLowerCase().includes(search.toLowerCase()))
        const matchStatus = statusFilter === "all" || s.status === statusFilter
        const matchType = typeFilter === "all" || s.formType === typeFilter
        return matchSearch && matchStatus && matchType
    })

    // Handle status change
    const handleStatusChange = async (id: string, newStatus: string) => {
        setUpdating(id)
        await updateSubmissionStatus(id, newStatus)
        setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, status: newStatus } : s))
        setUpdating(null)
        router.refresh()
    }

    // Handle delete
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this submission?")) return
        await deleteSubmission(id)
        setSubmissions((prev) => prev.filter((s) => s.id !== id))
        router.refresh()
    }

    // CSV Export
    const handleExport = () => {
        const headers = ["Name", "Email", "Phone", "WhatsApp", "Company", "Form Type", "Status", "Message", "Date"]
        const rows = filtered.map((s) => [
            s.name, s.email, s.phone || "", s.whatsapp || "", s.company || "",
            s.formType, s.status, s.message || "",
            new Date(s.createdAt).toLocaleDateString()
        ])
        const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `leads_${typeFilter}_${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    // Format date
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        })
    }

    return (
        <div className="space-y-4">
            {/* Filters Row */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, email, company..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-zinc-800/50 border-white/10 text-white"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 px-3 rounded-md border border-white/10 bg-zinc-800/50 text-sm text-white"
                >
                    <option value="all">All Status</option>
                    {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                    ))}
                </select>
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="h-10 px-3 rounded-md border border-white/10 bg-zinc-800/50 text-sm text-white"
                >
                    {FORM_TYPE_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t === "all" ? "All Types" : FORM_TYPE_LABELS[t] || t}</option>
                    ))}
                </select>
                <Button variant="outline" size="sm" onClick={handleExport} className="border-white/10 text-white hover:bg-white/10">
                    <Download className="w-4 h-4 mr-2" /> CSV
                </Button>
            </div>

            {/* Results count */}
            <p className="text-xs text-muted-foreground">
                Showing {filtered.length} of {submissions.length} submissions
            </p>

            {/* Table */}
            {filtered.length === 0 ? (
                <div className="py-16 text-center">
                    <p className="text-muted-foreground text-sm">No submissions found.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {filtered.map((sub) => (
                        <div key={sub.id} className="border border-white/10 rounded-lg bg-zinc-900/50 overflow-hidden transition-all">
                            {/* Row Header */}
                            <div
                                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/5 transition-colors"
                                onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-white truncate">{sub.name}</span>
                                        <Badge variant={STATUS_CONFIG[sub.status]?.variant || "default"} className="text-[10px]">
                                            {STATUS_CONFIG[sub.status]?.label || sub.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <span>{FORM_TYPE_LABELS[sub.formType] || sub.formType}</span>
                                        <span>•</span>
                                        <span>{sub.email}</span>
                                        <span>•</span>
                                        <span>{formatDate(sub.createdAt)}</span>
                                    </div>
                                </div>
                                {expandedId === sub.id ? (
                                    <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                                )}
                            </div>

                            {/* Expanded Details */}
                            {expandedId === sub.id && (
                                <div className="border-t border-white/10 p-4 bg-zinc-950/50 space-y-4">
                                    {/* Contact Info */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Email</p>
                                            <p className="text-white">{sub.email}</p>
                                        </div>
                                        {sub.phone && (
                                            <div>
                                                <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Phone</p>
                                                <p className="text-white">{sub.phone}</p>
                                            </div>
                                        )}
                                        {sub.whatsapp && (
                                            <div>
                                                <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">WhatsApp</p>
                                                <p className="text-white">{sub.whatsapp}</p>
                                            </div>
                                        )}
                                        {sub.company && (
                                            <div>
                                                <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Company</p>
                                                <p className="text-white">{sub.company}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Message */}
                                    {sub.message && (
                                        <div>
                                            <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Message</p>
                                            <p className="text-sm text-zinc-300 bg-zinc-900 p-3 rounded-md">{sub.message}</p>
                                        </div>
                                    )}

                                    {/* Metadata */}
                                    {sub.metadata && typeof sub.metadata === "object" && Object.keys(sub.metadata).length > 0 && (
                                        <div>
                                            <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Details</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {Object.entries(sub.metadata as Record<string, any>).map(([key, value]) =>
                                                    value ? (
                                                        <div key={key} className="text-sm bg-zinc-900 p-2 rounded-md">
                                                            <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}: </span>
                                                            <span className="text-white">{String(value)}</span>
                                                        </div>
                                                    ) : null
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Scheduled Date */}
                                    {sub.scheduledDate && (
                                        <div>
                                            <p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Scheduled Meeting</p>
                                            <p className="text-sm text-white">
                                                {new Date(sub.scheduledDate).toLocaleDateString()} {sub.scheduledTime && `at ${sub.scheduledTime}`}
                                            </p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                                        <select
                                            value={sub.status}
                                            onChange={(e) => handleStatusChange(sub.id, e.target.value)}
                                            disabled={updating === sub.id}
                                            className="h-8 px-2 rounded border border-white/10 bg-zinc-800 text-xs text-white"
                                        >
                                            {STATUS_OPTIONS.map((s) => (
                                                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                                            ))}
                                        </select>
                                        {updating === sub.id && (
                                            <span className="text-xs text-muted-foreground animate-pulse">Updating...</span>
                                        )}
                                        <div className="flex-1" />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(sub.id)}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
