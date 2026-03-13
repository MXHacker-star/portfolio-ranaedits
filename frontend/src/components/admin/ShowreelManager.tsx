"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SectionForm } from "@/components/admin/SectionForm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { deleteVideoProject, toggleFeaturedStatus, toggleSuccessStoryStatus, createVideoProject } from "@/actions/video-projects"
import { toast } from "sonner"
import { Check, Star, Plus, PlayCircle, Pencil, Trash2, Loader2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { updateSectionContent } from "@/actions/admin-modules"
import { Switch } from "@/components/ui/switch"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface VideoProject {
    id: string
    title: string
    mediaUrl: string
    thumbnail: string | null
    featured: boolean
    isSuccessStory: boolean
    orientation: string
}

interface ShowreelManagerProps {
    sectionData: any
    videos: VideoProject[]
}

export function ShowreelManager({ sectionData, videos }: ShowreelManagerProps) {
    const router = useRouter()
    const [localVideos, setLocalVideos] = useState(videos)
    const [videoToDelete, setVideoToDelete] = useState<string | null>(null)

    // Quick-add showreel form state
    const [showQuickAdd, setShowQuickAdd] = useState(false)
    const [quickAdding, setQuickAdding] = useState(false)
    const [quickForm, setQuickForm] = useState({ title: "", mediaUrl: "", thumbnail: "" })

    const featuredCount = localVideos.filter(v => v.featured).length
    const successStoryCount = localVideos.filter(v => v.isSuccessStory).length

    // Visibility Toggle state
    const [isVisible, setIsVisible] = useState(sectionData?.settings?.isVisible !== false)
    const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false)

    // Handle visibility toggle
    const handleToggleVisibility = async (checked: boolean) => {
        // Enforce off if 0 items
        if (checked && featuredCount === 0) {
            toast.error("Add at least 1 video to the showreel first.")
            return
        }

        setIsUpdatingVisibility(true)
        setIsVisible(checked)

        try {
            await updateSectionContent("showreel", {
                settings: { ...(sectionData?.settings || {}), isVisible: checked }
            })
            if (checked) {
                toast.success("Showreel enabled on frontend")
            } else {
                toast.success("Showreel disabled on frontend")
            }
            router.refresh()
        } catch (error) {
            toast.error("Failed to update visibility")
            setIsVisible(!checked) // Revert on failure
        } finally {
            setIsUpdatingVisibility(false)
        }
    }

    const handleQuickAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!quickForm.title.trim() || !quickForm.mediaUrl.trim()) {
            toast.error("Title and YouTube Video ID are required")
            return
        }
        setQuickAdding(true)
        try {
            const result = await createVideoProject({
                title: quickForm.title,
                mediaUrl: quickForm.mediaUrl,
                orientation: "vertical",
                featured: false,
                isSuccessStory: false,
                order: localVideos.length,
                thumbnail: quickForm.thumbnail || undefined,
            })
            if (result.success) {
                toast.success("Video added to showreel!")
                setQuickForm({ title: "", mediaUrl: "", thumbnail: "" })
                setShowQuickAdd(false)
                router.refresh()
            } else {
                toast.error(result.message)
            }
        } catch {
            toast.error("Something went wrong")
        } finally {
            setQuickAdding(false)
        }
    }

    const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
        // Optimistic update
        setLocalVideos(prev => prev.map(v =>
            v.id === id ? { ...v, featured: !currentStatus } : v
        ))

        const result = await toggleFeaturedStatus(id, !currentStatus)

        if (result.success) {
            toast.success(result.message)
            router.refresh()
        } else {
            toast.error(result.message)
            // Revert
            setLocalVideos(prev => prev.map(v =>
                v.id === id ? { ...v, featured: currentStatus } : v
            ))
        }
    }

    const handleToggleSuccessStory = async (id: string, currentStatus: boolean) => {
        // Optimistic update
        setLocalVideos(prev => prev.map(v =>
            v.id === id ? { ...v, isSuccessStory: !currentStatus } : v
        ))

        const result = await toggleSuccessStoryStatus(id, !currentStatus)

        if (result.success) {
            toast.success(result.message)
            router.refresh()
        } else {
            toast.error(result.message)
            // Revert
            setLocalVideos(prev => prev.map(v =>
                v.id === id ? { ...v, isSuccessStory: currentStatus } : v
            ))
        }
    }

    const handleDelete = async () => {
        if (!videoToDelete) return

        const result = await deleteVideoProject(videoToDelete)

        if (result.success) {
            toast.success("Video deleted successfully")
            setLocalVideos(prev => prev.filter(v => v.id !== videoToDelete))
            router.refresh()
        } else {
            toast.error(result.message)
        }
        setVideoToDelete(null)
    }

    // Auto-disable if 0 videos left
    if (featuredCount === 0 && isVisible && !isUpdatingVisibility) {
        handleToggleVisibility(false);
    }

    return (
        <div className="space-y-8">
            {/* Header / Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                    <div className="text-sm font-medium text-muted-foreground">Total Videos</div>
                    <div className="mt-2 text-3xl font-bold text-white">{localVideos.length}</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                    <div className="text-sm font-medium text-muted-foreground">Featured in Showreel</div>
                    <div className="mt-2 text-3xl font-bold text-primary">{featuredCount}</div>
                </div>
                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6 backdrop-blur-sm">
                    <div className="text-sm font-medium text-yellow-500/80">Success Stories</div>
                    <div className="mt-2 text-3xl font-bold text-yellow-500">{successStoryCount}</div>
                </div>

                {/* Visibility Toggle Card */}
                <div className={`rounded-xl border ${isVisible ? 'border-green-500/30 bg-green-500/5' : 'border-white/10 bg-white/5'} p-6 backdrop-blur-sm transition-colors`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                {isVisible ? <Eye className="w-4 h-4 text-green-400" /> : <EyeOff className="w-4 h-4" />}
                                Frontend Status
                            </div>
                            <div className={`mt-2 text-xl font-bold ${isVisible ? 'text-green-400' : 'text-white/50'}`}>
                                {isVisible ? 'Visible' : 'Hidden'}
                            </div>
                        </div>
                        <Switch
                            checked={isVisible}
                            onCheckedChange={handleToggleVisibility}
                            disabled={isUpdatingVisibility || featuredCount === 0}
                            className="data-[state=checked]:bg-green-500"
                        />
                    </div>
                </div>

                <button
                    onClick={() => setShowQuickAdd(!showQuickAdd)}
                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-primary/10 p-6 transition-all hover:border-primary/50 hover:bg-primary/20 w-full text-left"
                >
                    <div className="flex h-full flex-col justify-center items-center gap-2 text-center">
                        <div className="rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                            <Plus className="h-6 w-6 text-primary" />
                        </div>
                        <span className="font-medium text-white">Quick Add Video</span>
                    </div>
                </button>
            </div>

            {/* Quick Add Form (showreel-specific: minimal fields) */}
            {showQuickAdd && (
                <form onSubmit={handleQuickAdd} className="rounded-xl border border-primary/30 bg-primary/5 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-white">Quick Add to Showreel</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs">Title *</Label>
                            <Input
                                placeholder="Video Title"
                                value={quickForm.title}
                                onChange={(e) => setQuickForm({ ...quickForm, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">YouTube Video ID *</Label>
                            <Input
                                placeholder="e.g. dQw4w9WgXcQ"
                                value={quickForm.mediaUrl}
                                onChange={(e) => setQuickForm({ ...quickForm, mediaUrl: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Thumbnail URL (optional)</Label>
                            <Input
                                placeholder="https://..."
                                value={quickForm.thumbnail}
                                onChange={(e) => setQuickForm({ ...quickForm, thumbnail: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" size="sm" disabled={quickAdding}>
                            {quickAdding && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                            Add Video
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={() => setShowQuickAdd(false)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            )}

            <div className="grid gap-8 lg:grid-cols-12">
                {/* Left Column: Section Content (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="rounded-xl border border-white/10 bg-card/50 p-6 backdrop-blur-sm">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-white">1. Section Content</h2>
                            <p className="text-sm text-muted-foreground">Customize the heading and subtitle text.</p>
                        </div>
                        <SectionForm
                            sectionId="showreel"
                            initialData={sectionData}
                            hiddenFields={["mediaUrl"]}
                        />
                    </div>
                </div>

                {/* Right Column: Video Selection (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="rounded-xl border border-white/10 bg-card/50 p-6 backdrop-blur-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-white">2. Video Assignments</h2>
                                <p className="text-sm text-muted-foreground">Manage which videos appear in the Showreel (Check) and Success Stories (Star).</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-black/20 px-3 py-1 rounded-full border border-white/5">
                                    <span className={`h-2 w-2 rounded-full ${featuredCount > 0 ? 'bg-primary animate-pulse' : 'bg-white/20'}`} />
                                    Showreel
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-black/20 px-3 py-1 rounded-full border border-white/5">
                                    <span className={`h-2 w-2 rounded-full ${successStoryCount > 0 ? 'bg-yellow-500 animate-pulse' : 'bg-white/20'}`} />
                                    Success Stories
                                </div>
                                {featuredCount === 0 && (
                                    <span className="text-[10px] text-red-500/80 mt-1 max-w-[150px] text-right leading-tight">
                                        Showreel is disabled.
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {localVideos.map((video) => (
                                <div
                                    key={video.id}
                                    className={`group relative aspect-[9/16] rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer ${video.featured
                                        ? "border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-black"
                                        : "border-white/5 hover:border-white/20"
                                        }`}
                                    onClick={() => handleToggleFeatured(video.id, video.featured)}
                                >
                                    {/* Thumbnail */}
                                    {video.thumbnail ? (
                                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full bg-black flex items-center justify-center">
                                            <img
                                                src={`https://img.youtube.com/vi/${video.mediaUrl}/maxresdefault.jpg`}
                                                alt={video.title}
                                                className="w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    )}

                                    {/* Gradient Overlays */}
                                    <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 ${video.featured ? 'opacity-80' : 'opacity-60 group-hover:opacity-80'}`} />

                                    {/* Active State Overlay */}
                                    {(!video.featured && !video.isSuccessStory) && (
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                            <span className="text-xs font-medium text-white bg-black/50 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">Unassigned</span>
                                        </div>
                                    )}

                                    {/* Status Badges */}
                                    <div className="absolute top-2 right-2 z-10 flex gap-2">
                                        {/* Showreel Checkmark */}
                                        <div
                                            onClick={(e) => { e.stopPropagation(); handleToggleFeatured(video.id, video.featured); }}
                                            title="Toggle Showreel Status"
                                            className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer border ${video.featured
                                                ? "bg-primary text-white border-primary border-transparent scale-100"
                                                : "bg-black/80 text-white/50 border-white/20 hover:scale-105 hover:bg-white/20 hover:text-white"
                                                }`}>
                                            <Check className="h-4 w-4" />
                                        </div>
                                        {/* Success Story Star */}
                                        <div
                                            onClick={(e) => { e.stopPropagation(); handleToggleSuccessStory(video.id, video.isSuccessStory); }} // Fixed typo here!
                                            title="Toggle Success Story Status"
                                            className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer border ${video.isSuccessStory
                                                ? "bg-yellow-500 text-black border-yellow-500 scale-100"
                                                : "bg-black/80 text-white/50 border-white/20 hover:scale-105 hover:bg-white/20 hover:text-white"
                                                }`}>
                                            <Star className={`h-4 w-4 ${video.isSuccessStory ? 'fill-black' : ''}`} />
                                        </div>
                                    </div>

                                    {/* Manage Actions */}
                                    <div className="absolute top-2 left-2 z-20 flex flex-col gap-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        <Link
                                            href={`/admin/portfolio/video/${video.id}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-black">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 rounded-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setVideoToDelete(video.id)
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Info Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-3 z-10 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                                        <p className="text-xs font-bold text-white line-clamp-2 leading-tight drop-shadow-sm">{video.title}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="text-[9px] uppercase tracking-wider text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                                {video.orientation}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!videoToDelete} onOpenChange={(open) => !open && setVideoToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the video project from your portfolio.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
