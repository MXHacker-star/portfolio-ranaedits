"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createTeamMember, updateTeamMember, uploadTeamImage } from "@/actions/team"
import { Loader2, Save, Upload, X, ImagePlus } from "lucide-react"
import { toast } from "sonner"

interface TeamFormProps {
    initialData?: {
        id: string
        name: string
        role: string
        imageUrl: string
        bio: string | null
        order: number
    }
}

export function TeamForm({ initialData }: TeamFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [imageUploading, setImageUploading] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        role: initialData?.role || "",
        imageUrl: initialData?.imageUrl || "",
        bio: initialData?.bio || "",
        order: initialData?.order || 0
    })

    const handleImageUpload = async (file: File) => {
        setImageUploading(true)
        try {
            const formData = new FormData()
            formData.append("image", file)
            const result = await uploadTeamImage(formData)
            if (result.success && result.url) {
                setFormData(prev => ({ ...prev, imageUrl: result.url }))
                toast.success("Image uploaded")
            } else {
                toast.error("Upload failed")
            }
        } catch {
            toast.error("Upload failed")
        } finally {
            setImageUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (initialData) {
                await updateTeamMember(initialData.id, formData)
                toast.success("Team member updated successfully")
            } else {
                await createTeamMember(formData)
                toast.success("Team member created successfully")
            }
            router.push("/admin/team")
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
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Lead Editor"
                    required
                />
            </div>

            <div className="space-y-4">
                <div>
                    <Label>Team Member Image</Label>
                    <p className="text-xs text-muted-foreground mt-1 text-primary/80">
                        Recommended: Vertical image ratio (e.g. 400x1000px) for the best fit in the capsule-shaped marquee.
                    </p>
                </div>
                <div className="flex items-start gap-6 bg-card/50 p-4 rounded-xl border border-white/5">
                    {/* Preview */}
                    <div className="flex-shrink-0">
                        {formData.imageUrl ? (
                            <div className="relative group">
                                <img src={formData.imageUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-2 border-primary/20" />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-dashed border-primary/20 flex items-center justify-center">
                                <ImagePlus className="w-8 h-8 text-primary/40" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-3">
                        {/* Upload */}
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleImageUpload(file)
                            }}
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            className="gap-2"
                            disabled={imageUploading}
                            onClick={() => fileRef.current?.click()}
                        >
                            {imageUploading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                            ) : (
                                <><Upload className="w-4 h-4" /> Upload Image</>
                            )}
                        </Button>

                        {/* Or URL */}
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl" className="text-xs text-muted-foreground font-normal">Or enter image URL</Label>
                            <Input
                                id="imageUrl"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                placeholder="https://..."
                                className="text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Short bio..."
                    className="h-24"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    required
                />
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
                        Save Team Member
                    </>
                )}
            </Button>
        </form>
    )
}
