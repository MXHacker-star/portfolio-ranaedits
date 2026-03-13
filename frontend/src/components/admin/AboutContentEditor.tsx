"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, Type } from "lucide-react"
import { updateSectionContent } from "@/actions/admin-modules"
import { toast } from "sonner"

interface SectionContent {
    id?: string
    title?: string | null
    subtitle?: string | null
    content?: string | null
}

export function AboutContentEditor({ initialContent }: { initialContent?: SectionContent | null }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: initialContent?.title || "",
        subtitle: initialContent?.subtitle || "",
        content: initialContent?.content || "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await updateSectionContent("about", formData)
            toast.success("About Me content updated successfully")
            router.refresh()
        } catch (error) {
            console.error("Failed to update About content:", error)
            toast.error("Failed to update content")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-card/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-12">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Type className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Section Text</h2>
                    <p className="text-sm text-muted-foreground">Main title and description paragraphs for the About Me section.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-white/80">Title</Label>
                    <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder='e.g. ABOUT ME'
                        className="bg-black/50 border-white/10 text-white placeholder:text-white/20"
                    />
                    <p className="text-xs text-muted-foreground">The title will automatically split its colors based on the middle space (e.g. "ABOUT ME" turns white/red).</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="subtitle" className="text-white/80">Paragraph 1 (Subtitle)</Label>
                    <Textarea
                        id="subtitle"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        placeholder="e.g. I am a passionate creator..."
                        className="bg-black/50 border-white/10 text-white placeholder:text-white/20 min-h-[100px]"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="content" className="text-white/80">Paragraph 2 (Content)</Label>
                    <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="e.g. With over 5 years of experience..."
                        className="bg-black/50 border-white/10 text-white placeholder:text-white/20 min-h-[120px]"
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-black hover:bg-primary/90 font-bold gap-2 px-6"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {loading ? "Saving..." : "Save Content"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
