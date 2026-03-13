"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Save, ArrowLeft, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { createGraphicProject, updateGraphicProject } from "@/actions/graphic-projects"
import { toast } from "sonner"

interface Category {
    id: string
    name: string
}

interface GraphicProjectFormProps {
    initialData?: {
        id: string
        title: string
        mediaUrl: string
        categoryId: string | null
        featured: boolean
        order: number
    }
    categories: Category[]
}

export function GraphicProjectForm({ initialData, categories }: GraphicProjectFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        mediaUrl: initialData?.mediaUrl || "",
        categoryId: initialData?.categoryId || "",
        featured: initialData?.featured || false,
        order: initialData?.order || 1
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            if (initialData) {
                await updateGraphicProject(initialData.id, formData)
                toast.success("Graphic project updated")
            } else {
                await createGraphicProject(formData)
                toast.success("Graphic project created")
            }
            router.push("/admin/portfolio/graphic")
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
                <Link href="/admin/portfolio/graphic">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {initialData ? "Edit Graphic Project" : "New Graphic Project"}
                    </h1>
                    <p className="text-muted-foreground">
                        {initialData ? "Update project details" : "Add a new graphic design project"}
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
                        <Label>Parameters (Category)</Label>
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
                        <Label>Image URL</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="https://example.com/image.jpg"
                                value={formData.mediaUrl}
                                onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                                required
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">The direct URL to the image file.</p>

                        {formData.mediaUrl && (
                            <div className="mt-4 relative aspect-[4/5] w-48 rounded-lg overflow-hidden border border-white/10 bg-black/20">
                                <img
                                    src={formData.mediaUrl}
                                    alt="Preview"
                                    className="object-cover w-full h-full"
                                    onError={(e) => (e.currentTarget.style.display = "none")}
                                />
                            </div>
                        )}
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
                                <p className="text-xs text-muted-foreground">Show on home page</p>
                            </div>
                            <Switch
                                checked={formData.featured}
                                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Link href="/admin/portfolio/graphic">
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
