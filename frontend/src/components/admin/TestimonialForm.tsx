"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createTestimonial, updateTestimonial } from "@/actions/testimonials"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"

interface TestimonialFormProps {
    initialData?: {
        id: string
        name: string
        role: string
        content: string | null
        videoUrl: string | null
        rating: number
        avatarUrl: string | null
    }
}

export function TestimonialForm({ initialData }: TestimonialFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        role: initialData?.role || "", // Often "CEO at X" or "Content Creator"
        content: initialData?.content || "", // Treated as "Result" e.g. "2M Views" for video testimonials
        videoUrl: initialData?.videoUrl || "",
        avatarUrl: initialData?.avatarUrl || "",
        rating: initialData?.rating || 5
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (initialData) {
                await updateTestimonial(initialData.id, formData)
                toast.success("Testimonial updated successfully")
            } else {
                await createTestimonial(formData)
                toast.success("Testimonial created successfully")
            }
            router.push("/admin/testimonials")
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl bg-card p-6 rounded-xl border border-white/10">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Client Name</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Hormozi"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="role">Role / Style</Label>
                    <Input
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="e.g. CEO or Hormozi Style"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="content">Result / Content (e.g. "2M Views")</Label>
                <Input
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder='e.g. "2M Views" or full review text'
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="videoUrl">YouTube URL (for Video Testimonial)</Label>
                <Input
                    id="videoUrl"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://youtube.com/..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <Input
                        id="rating"
                        type="number"
                        min="1"
                        max="5"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="avatarUrl">Avatar URL</Label>
                    <Input
                        id="avatarUrl"
                        value={formData.avatarUrl}
                        onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                        placeholder="https://..."
                    />
                </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Testimonial
                    </>
                )}
            </Button>
        </form>
    )
}
