"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Save, ArrowLeft, Globe, X } from "lucide-react"
import Link from "next/link"
import { createWebProject, updateWebProject } from "@/actions/web-projects"
import { toast } from "sonner"

interface Category {
    id: string
    name: string
}

interface WebProjectFormProps {
    initialData?: {
        id: string
        title: string
        description: string | null
        mediaUrl: string
        stack: string | null
        liveUrl: string | null
        repoUrl: string | null
        categoryId: string | null
        featured: boolean
        order: number
    }
    categories: Category[]
}

export function WebProjectForm({ initialData, categories }: WebProjectFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        mediaUrl: initialData?.mediaUrl || "",
        stack: initialData?.stack || "",
        liveUrl: initialData?.liveUrl || "",
        repoUrl: initialData?.repoUrl || "",
        categoryId: initialData?.categoryId || "",
        featured: initialData?.featured || false,
        order: initialData?.order || 1,
    })

    // Parse stack string into tags for display
    const stackTags = formData.stack ? formData.stack.split(",").map(s => s.trim()).filter(Boolean) : []

    const [stackInput, setStackInput] = useState("")

    const addStackTag = () => {
        if (!stackInput.trim()) return
        const newStack = [...stackTags, stackInput.trim()].join(", ")
        setFormData({ ...formData, stack: newStack })
        setStackInput("")
    }

    const removeStackTag = (index: number) => {
        const newTags = stackTags.filter((_, i) => i !== index)
        setFormData({ ...formData, stack: newTags.join(", ") })
    }

    const handleStackKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            addStackTag()
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            if (initialData) {
                await updateWebProject(initialData.id, formData)
                toast.success("Web project updated")
            } else {
                await createWebProject(formData)
                toast.success("Web project created")
            }
            router.push("/admin/portfolio/web")
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/portfolio/web">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {initialData ? "Edit Web Project" : "New Web Project"}
                    </h1>
                    <p className="text-muted-foreground">
                        {initialData ? "Update project details" : "Add a new web development project"}
                    </p>
                </div>
            </div>

            <Card className="bg-card/50 border-white/10">
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                            placeholder="Project Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            placeholder="Brief description of the project"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                            value={formData.categoryId}
                            onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Screenshot URL</Label>
                        <Input
                            placeholder="https://example.com/screenshot.jpg"
                            value={formData.mediaUrl}
                            onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                            required
                        />
                        <p className="text-xs text-muted-foreground">Direct URL to a screenshot or preview image.</p>

                        {formData.mediaUrl && (
                            <div className="mt-4 relative aspect-video w-64 rounded-lg overflow-hidden border border-white/10 bg-black/20">
                                <img
                                    src={formData.mediaUrl}
                                    alt="Preview"
                                    className="object-cover w-full h-full"
                                    onError={(e) => (e.currentTarget.style.display = "none")}
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Tech Stack</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Type a technology and press Enter"
                                value={stackInput}
                                onChange={(e) => setStackInput(e.target.value)}
                                onKeyDown={handleStackKeyDown}
                            />
                            <Button type="button" variant="outline" onClick={addStackTag} size="sm">
                                Add
                            </Button>
                        </div>
                        {stackTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {stackTags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30"
                                    >
                                        {tag}
                                        <button type="button" onClick={() => removeStackTag(i)} className="hover:text-red-400">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Live URL</Label>
                            <Input
                                placeholder="https://example.com"
                                value={formData.liveUrl}
                                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>GitHub URL</Label>
                            <Input
                                placeholder="https://github.com/user/repo"
                                value={formData.repoUrl}
                                onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Order</Label>
                            <Input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-white/10 p-4">
                            <div className="space-y-0.5">
                                <Label>Featured</Label>
                                <p className="text-xs text-muted-foreground">Show on web-development page</p>
                            </div>
                            <Switch
                                checked={formData.featured}
                                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Link href="/admin/portfolio/web">
                            <Button variant="ghost" type="button">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" />
                            Save Project
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
