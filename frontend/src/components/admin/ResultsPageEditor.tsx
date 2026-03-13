"use client"

import Link from "next/link"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Pencil, Trash2, Plus, Save, Loader2, Trophy, Video, Type, X, GripVertical } from "lucide-react"
import { toast } from "sonner"
import {
    createCaseStudy,
    updateCaseStudy,
    deleteCaseStudy,
    updateResultsPageContent
} from "@/actions/results-page"
import { createStat, updateStat, deleteStat } from "@/actions/admin-modules"

// ==========================================
// Results Page Content Editor (Hero + CTA)
// ==========================================
interface ContentEditorProps {
    content: any
}

export function ResultsPageContentEditor({ content }: ContentEditorProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: content?.title || "",
        subtitle: content?.subtitle || "",
        // CTA fields stored in settings JSON
        ctaTitle: (content?.settings as any)?.ctaTitle || "",
        ctaSubtitle: (content?.settings as any)?.ctaSubtitle || "",
        ctaButtonText: content?.buttonText || "",
    })

    const handleSave = async () => {
        setLoading(true)
        try {
            await updateResultsPageContent({
                title: formData.title,
                subtitle: formData.subtitle,
                buttonText: formData.ctaButtonText,
                settings: {
                    ctaTitle: formData.ctaTitle,
                    ctaSubtitle: formData.ctaSubtitle,
                }
            })
            toast.success("Page content saved")
            router.refresh()
        } catch (error) {
            toast.error("Failed to save")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-card/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Type className="h-4 w-4 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Hero Section</h3>
                </div>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label>Hero Title</Label>
                        <Input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Verified Results"
                        />
                        <p className="text-xs text-muted-foreground">Default: &quot;Verified Results&quot;</p>
                    </div>
                    <div className="grid gap-2">
                        <Label>Hero Subtitle</Label>
                        <textarea
                            value={formData.subtitle}
                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                            placeholder="e.g. We don't just edit videos..."
                            className="flex min-h-[80px] w-full rounded-md border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-card/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-white">CTA Section</h3>
                </div>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label>CTA Title</Label>
                        <Input
                            value={formData.ctaTitle}
                            onChange={(e) => setFormData({ ...formData, ctaTitle: e.target.value })}
                            placeholder="e.g. Ready To Go Viral?"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>CTA Subtitle</Label>
                        <Input
                            value={formData.ctaSubtitle}
                            onChange={(e) => setFormData({ ...formData, ctaSubtitle: e.target.value })}
                            placeholder="e.g. Stop guessing. Start growing."
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>CTA Button Text</Label>
                        <Input
                            value={formData.ctaButtonText}
                            onChange={(e) => setFormData({ ...formData, ctaButtonText: e.target.value })}
                            placeholder="e.g. Get Started Now"
                        />
                    </div>
                </div>
            </div>

            <Button onClick={handleSave} disabled={loading} className="w-full gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Page Content
            </Button>
        </div>
    )
}

// ==========================================
// Hero Stats Manager (StatItem section=results_page)
// ==========================================
interface StatsManagerProps {
    stats: any[]
}

export function ResultsPageStatsManager({ stats }: StatsManagerProps) {
    const router = useRouter()
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [newStat, setNewStat] = useState({ value: "", label: "", order: 0, visible: true })

    const handleCreate = async () => {
        if (!newStat.value || !newStat.label) return
        setLoading(true)
        try {
            await createStat({ ...newStat, section: "results_page" })
            toast.success("Stat added")
            setIsAdding(false)
            setNewStat({ value: "", label: "", order: 0, visible: true })
            router.refresh()
        } catch (error) {
            toast.error("Failed to add stat")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteStat(id)
            toast.success("Stat deleted")
            router.refresh()
        } catch (error) {
            toast.error("Failed to delete")
        }
    }

    return (
        <div className="bg-card/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Hero Stats</h3>
                        <p className="text-xs text-muted-foreground">Stats displayed at the top of the Results page</p>
                    </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setIsAdding(!isAdding)} className="gap-1.5">
                    {isAdding ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    {isAdding ? "Cancel" : "Add"}
                </Button>
            </div>

            {/* Add form */}
            {isAdding && (
                <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label className="text-xs">Value</Label>
                            <Input
                                value={newStat.value}
                                onChange={(e) => setNewStat({ ...newStat, value: e.target.value })}
                                placeholder="e.g. 50M+"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label className="text-xs">Label</Label>
                            <Input
                                value={newStat.label}
                                onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
                                placeholder="e.g. Total Views"
                                className="mt-1"
                            />
                        </div>
                    </div>
                    <Button size="sm" onClick={handleCreate} disabled={loading} className="w-full gap-2">
                        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        Add Stat
                    </Button>
                </div>
            )}

            {/* Stats list */}
            {stats.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Using i18n defaults. Add stats to override.</p>
            ) : (
                <div className="space-y-2">
                    {stats.map((stat: any) => (
                        <div key={stat.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-white/10 transition-colors">
                            <GripVertical className="h-4 w-4 text-white/10" />
                            <div className="flex-1 min-w-0">
                                <span className="text-lg font-black text-white">{stat.value}</span>
                                <span className="text-sm text-muted-foreground ml-2">{stat.label}</span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={`/admin/stats/${stat.id}`}>
                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                        <Pencil className="h-3 w-3" />
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleDelete(stat.id)}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// ==========================================
// Case Studies Manager
// ==========================================
interface CaseStudiesManagerProps {
    caseStudies: any[]
}

export function CaseStudiesManager({ caseStudies: initialStudies }: CaseStudiesManagerProps) {
    const router = useRouter()
    const [isAdding, setIsAdding] = useState(false)
    const [loading, setLoading] = useState(false)
    const [newStudy, setNewStudy] = useState({
        title: "", views: "", description: "", youtubeId: "", order: 0, visible: true
    })

    const handleCreate = async () => {
        if (!newStudy.title || !newStudy.youtubeId) return
        setLoading(true)
        try {
            await createCaseStudy(newStudy)
            toast.success("Case study added")
            setIsAdding(false)
            setNewStudy({ title: "", views: "", description: "", youtubeId: "", order: 0, visible: true })
            router.refresh()
        } catch (error) {
            toast.error("Failed to add case study")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteCaseStudy(id)
            toast.success("Case study deleted")
            router.refresh()
        } catch (error) {
            toast.error("Failed to delete")
        }
    }

    const handleToggleVisibility = async (study: any) => {
        try {
            await updateCaseStudy(study.id, { ...study, visible: !study.visible })
            toast.success(study.visible ? "Hidden" : "Made visible")
            router.refresh()
        } catch (error) {
            toast.error("Failed to update")
        }
    }

    return (
        <div className="bg-card/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                        <Video className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Case Studies</h3>
                        <p className="text-xs text-muted-foreground">Video cards showcasing results</p>
                    </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setIsAdding(!isAdding)} className="gap-1.5">
                    {isAdding ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    {isAdding ? "Cancel" : "Add"}
                </Button>
            </div>

            {/* Add form */}
            {isAdding && (
                <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label className="text-xs">Title</Label>
                            <Input
                                value={newStudy.title}
                                onChange={(e) => setNewStudy({ ...newStudy, title: e.target.value })}
                                placeholder="e.g. Alex Hormozi Style"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label className="text-xs">Views</Label>
                            <Input
                                value={newStudy.views}
                                onChange={(e) => setNewStudy({ ...newStudy, views: e.target.value })}
                                placeholder="e.g. 2.4M Views"
                                className="mt-1"
                            />
                        </div>
                    </div>
                    <div>
                        <Label className="text-xs">YouTube Video ID</Label>
                        <Input
                            value={newStudy.youtubeId}
                            onChange={(e) => setNewStudy({ ...newStudy, youtubeId: e.target.value })}
                            placeholder="e.g. dQw4w9WgXcQ"
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label className="text-xs">Description</Label>
                        <textarea
                            value={newStudy.description}
                            onChange={(e) => setNewStudy({ ...newStudy, description: e.target.value })}
                            placeholder="Brief description of the editing style..."
                            className="flex min-h-[60px] w-full rounded-md border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none mt-1"
                        />
                    </div>
                    <Button size="sm" onClick={handleCreate} disabled={loading} className="w-full gap-2">
                        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        Add Case Study
                    </Button>
                </div>
            )}

            {/* Case studies list */}
            {initialStudies.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Using hardcoded defaults. Add case studies to override.</p>
            ) : (
                <div className="space-y-3">
                    {initialStudies.map((study: any) => (
                        <div key={study.id} className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/5 group hover:border-white/10 transition-colors">
                            {/* YouTube Thumbnail */}
                            <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-black/50">
                                <img
                                    src={`https://img.youtube.com/vi/${study.youtubeId}/mqdefault.jpg`}
                                    alt={study.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-white text-sm">{study.title}</span>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{study.views}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{study.description}</p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <Switch
                                    checked={study.visible}
                                    onCheckedChange={() => handleToggleVisibility(study)}
                                    className="scale-75"
                                />
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleDelete(study.id)}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
