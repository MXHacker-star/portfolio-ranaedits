"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateSectionContent } from "@/actions/admin-modules"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface SectionFormProps {
    sectionId: string
    initialData?: {
        title?: string | null
        subtitle?: string | null
        content?: string | null
        mediaUrl?: string | null
        buttonText?: string | null
        buttonLink?: string | null
        settings?: any
    } | null
    hiddenFields?: string[]
}

export function SectionForm({ sectionId, initialData, hiddenFields = [] }: SectionFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        subtitle: initialData?.subtitle || "",
        content: initialData?.content || "",
        mediaUrl: initialData?.mediaUrl || "",
        buttonText: initialData?.buttonText || "",
        buttonLink: initialData?.buttonLink || "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await updateSectionContent(sectionId, formData)
            toast.success("Section updated successfully")
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-card p-6 rounded-xl border border-white/10">
            <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Section Title"
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Brief subtitle or tagline..."
                    className="h-20"
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Main content body..."
                    className="h-32"
                />
            </div>

            {!hiddenFields.includes("mediaUrl") && (
                <div className="grid gap-2">
                    <Label htmlFor="mediaUrl">Media URL (Image/Video)</Label>
                    <Input
                        id="mediaUrl"
                        value={formData.mediaUrl}
                        onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                        placeholder="https://..."
                    />
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="buttonText">Button Text</Label>
                    <Input
                        id="buttonText"
                        value={formData.buttonText}
                        onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                        placeholder="e.g. Contact Us"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="buttonLink">Button Link</Label>
                    <Input
                        id="buttonLink"
                        value={formData.buttonLink}
                        onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                        placeholder="e.g. /contact"
                    />
                </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-white/10">
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
            </div>
        </form>
    )
}
