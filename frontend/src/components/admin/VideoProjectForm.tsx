"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createVideoProject, updateVideoProject } from "@/actions/video-projects"
import { Loader2, Save, PlayCircle } from "lucide-react"
import { toast } from "sonner"

interface VideoProjectFormProps {
    initialData?: {
        id: string
        title: string
        mediaUrl: string
        categoryId: string | null
        orientation: string
        thumbnail: string | null
        featured: boolean
        isSuccessStory: boolean
        order: number
    }
    categories: { id: string, name: string }[]
}

export function VideoProjectForm({ initialData, categories }: VideoProjectFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        mediaUrl: initialData?.mediaUrl || "",
        categoryId: initialData?.categoryId || "",
        orientation: initialData?.orientation || "horizontal",
        thumbnail: initialData?.thumbnail || "",
        featured: initialData?.featured || false,
        isSuccessStory: initialData?.isSuccessStory || false,
        order: initialData?.order || 0
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Basic validation
            // if (!formData.categoryId) {
            //     toast.error("Please select a category")
            //     setLoading(false)
            //     return
            // }

            if (initialData) {
                await updateVideoProject(initialData.id, formData)
                toast.success("Project updated successfully")
            } else {
                await createVideoProject(formData)
                toast.success("Project created successfully")
            }
            router.push("/admin/portfolio/video")
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
            <div className="grid gap-8 md:grid-cols-12">
                {/* Left Column: Main Info */}
                <div className="md:col-span-8 space-y-6">
                    <div className="rounded-xl border border-white/10 bg-card/50 p-6 backdrop-blur-sm space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-base">Project Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Cinematic Travel Vlog"
                                required
                                className="h-12 text-lg bg-black/20 border-white/10 focus:border-primary/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mediaUrl">YouTube URL</Label>
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-muted-foreground">
                                    <PlayCircle className="h-4 w-4" />
                                </div>
                                <Input
                                    id="mediaUrl"
                                    value={formData.mediaUrl}
                                    onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                                    placeholder="https://youtu.be/..."
                                    required
                                    className="pl-10 bg-black/20 border-white/10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="thumbnail">Custom Thumbnail URL (Optional)</Label>
                            <Input
                                id="thumbnail"
                                value={formData.thumbnail}
                                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                placeholder="https://... (Leave empty for YouTube default)"
                                className="bg-black/20 border-white/10"
                            />
                            <p className="text-xs text-muted-foreground">
                                If provided, this image will override the default YouTube thumbnail.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Settings & Meta */}
                <div className="md:col-span-4 space-y-6">
                    <div className="rounded-xl border border-white/10 bg-card/50 p-6 backdrop-blur-sm space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="categoryId">Category</Label>
                            <Select
                                value={formData.categoryId || "none"}
                                onValueChange={(value) => setFormData({ ...formData, categoryId: value === "none" ? "" : value })}
                            >
                                <SelectTrigger className="bg-black/20 border-white/10">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No Category</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">Select a category managed from your Admin Categories dashboard.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="orientation">Orientation</Label>
                            <Select
                                value={formData.orientation}
                                onValueChange={(value) => setFormData({ ...formData, orientation: value })}
                            >
                                <SelectTrigger className="bg-black/20 border-white/10">
                                    <SelectValue placeholder="Select orientation" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="horizontal">Horizontal (16:9)</SelectItem>
                                    <SelectItem value="vertical">Vertical (9:16)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="order">Display Order</Label>
                            <Input
                                id="order"
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                required
                                className="bg-black/20 border-white/10"
                            />
                        </div>

                        <div className="pt-4 border-t border-white/10 space-y-4">
                            <div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="featured" className="cursor-pointer">Featured in Showreel</Label>
                                    <Switch
                                        id="featured"
                                        checked={formData.featured}
                                        onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Adds this video to the massive 3D slider at the top of the homepage.
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="isSuccessStory" className="cursor-pointer">Featured in Success Stories</Label>
                                    <Switch
                                        id="isSuccessStory"
                                        checked={formData.isSuccessStory}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isSuccessStory: checked })}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Adds this video to the "Success Stories / Results" grid section.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-5 w-5" />
                                Save Project
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    )
}
