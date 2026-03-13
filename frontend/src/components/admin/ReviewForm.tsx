"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClientReview, updateClientReview, uploadReviewAvatar } from "@/actions/client-reviews"
import { Loader2, Save, Star, Upload, Link2, X, Quote, ImagePlus } from "lucide-react"

interface ClientReview {
    id: string
    clientName: string
    companyName: string | null
    reviewText: string
    rating: number
    avatarUrl: string | null
    category: string | null
    visible: boolean
    order: number
}

const CATEGORIES = [
    { value: "", label: "Select Category" },
    { value: "Video Editing", label: "Video Editing" },
    { value: "Thumbnail Design", label: "Thumbnail Design" },
    { value: "Motion Graphics", label: "Motion Graphics" },
    { value: "Color Grading", label: "Color Grading" },
    { value: "Web Development", label: "Web Development" },
    { value: "Graphic Design", label: "Graphic Design" },
    { value: "Other", label: "Other" },
]

export function ReviewForm({ review }: { review?: ClientReview | null }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)
    const [rating, setRating] = useState(review?.rating || 5)
    const [avatarUrl, setAvatarUrl] = useState(review?.avatarUrl || "")
    const [avatarUploading, setAvatarUploading] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    // Live preview state
    const [previewName, setPreviewName] = useState(review?.clientName || "")
    const [previewCompany, setPreviewCompany] = useState(review?.companyName || "")
    const [previewText, setPreviewText] = useState(review?.reviewText || "")
    const [previewCategory, setPreviewCategory] = useState((review as any)?.category || "")

    const handleAvatarUpload = async (file: File) => {
        setAvatarUploading(true)
        try {
            const formData = new FormData()
            formData.append("avatar", file)
            const result = await uploadReviewAvatar(formData)
            if (result.success && result.url) {
                setAvatarUrl(result.url)
            } else {
                alert("Upload failed. Please try again.")
            }
        } catch {
            alert("Upload failed. Please try again.")
        } finally {
            setAvatarUploading(false)
        }
    }

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setMessage(null)

        const rawData = Object.fromEntries(formData.entries())
        const data = {
            ...rawData,
            rating,
            avatarUrl: avatarUrl || null,
            visible: rawData.visible === 'on'
        }

        try {
            let result
            if (review) {
                result = await updateClientReview(review.id, data)
            } else {
                result = await createClientReview(data)
            }

            if (result.success) {
                setMessage({ text: "Review saved successfully!", type: 'success' })
                if (!review) {
                    router.push("/admin/reviews")
                } else {
                    router.refresh()
                }
            } else {
                setMessage({ text: result.error || "Failed to save review.", type: 'error' })
            }
        } catch (err: any) {
            console.error("Client error:", err)
            setMessage({ text: err?.message || "An error occurred.", type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex gap-8 items-start">
            {/* ─── Form ─── */}
            <form action={handleSubmit} className="flex-1 space-y-6">
                {message && (
                    <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                        {message.text}
                    </div>
                )}

                <div className="p-6 border border-white/10 rounded-xl bg-card/50 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Client Information</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="clientName">Client Name *</Label>
                            <Input
                                id="clientName"
                                name="clientName"
                                defaultValue={review?.clientName || ""}
                                onChange={(e) => setPreviewName(e.target.value)}
                                placeholder="e.g. John Doe"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="companyName">Company</Label>
                            <Input
                                id="companyName"
                                name="companyName"
                                defaultValue={review?.companyName || ""}
                                onChange={(e) => setPreviewCompany(e.target.value)}
                                placeholder="e.g. Acme Corp"
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="category">Service Category</Label>
                            <select
                                id="category"
                                name="category"
                                defaultValue={(review as any)?.category || ""}
                                onChange={(e) => setPreviewCategory(e.target.value)}
                                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground focus:ring-2 focus:ring-ring"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="order">Sort Order</Label>
                            <Input
                                id="order"
                                name="order"
                                type="number"
                                defaultValue={review?.order || 0}
                            />
                        </div>
                    </div>
                </div>

                {/* Rating */}
                <div className="p-6 border border-white/10 rounded-xl bg-card/50 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Rating & Review</h3>
                    <div className="space-y-2">
                        <Label>Rating</Label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`p-1 transition-all hover:scale-125 ${rating >= star ? 'text-primary' : 'text-muted-foreground/30'}`}
                                >
                                    <Star className="w-7 h-7 fill-current" />
                                </button>
                            ))}
                            <span className="ml-3 text-sm text-muted-foreground self-center">{rating}/5</span>
                        </div>
                        <input type="hidden" name="rating" value={rating} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reviewText">Review Text *</Label>
                        <Textarea
                            id="reviewText"
                            name="reviewText"
                            defaultValue={review?.reviewText || ""}
                            onChange={(e) => setPreviewText(e.target.value)}
                            placeholder="Paste the client's testimonial here..."
                            className="min-h-[150px]"
                            required
                        />
                    </div>
                </div>

                {/* Avatar */}
                <div className="p-6 border border-white/10 rounded-xl bg-card/50 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Client Avatar</h3>
                    <p className="text-xs text-muted-foreground">Recommended: Square (1:1 ratio), at least 200×200px. JPG or PNG.</p>

                    <div className="flex items-start gap-6">
                        {/* Preview */}
                        <div className="flex-shrink-0">
                            {avatarUrl ? (
                                <div className="relative group">
                                    <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-primary/20" />
                                    <button
                                        type="button"
                                        onClick={() => setAvatarUrl("")}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3 text-white" />
                                    </button>
                                </div>
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-dashed border-primary/20 flex items-center justify-center">
                                    <ImagePlus className="w-6 h-6 text-primary/40" />
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
                                    if (file) handleAvatarUpload(file)
                                }}
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                className="gap-2"
                                disabled={avatarUploading}
                                onClick={() => fileRef.current?.click()}
                            >
                                {avatarUploading ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                                ) : (
                                    <><Upload className="w-4 h-4" /> Upload Image</>
                                )}
                            </Button>

                            {/* Or URL */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">or</span>
                                <div className="flex-1 flex gap-2">
                                    <Input
                                        placeholder="https://avatar-url.com/image.jpg"
                                        value={avatarUrl}
                                        onChange={(e) => setAvatarUrl(e.target.value)}
                                        className="text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hidden input for form submission */}
                    <input type="hidden" name="avatarUrl" value={avatarUrl} />
                </div>

                {/* Visibility */}
                <div className="p-6 border border-white/10 rounded-xl bg-card/50">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="visible"
                            name="visible"
                            defaultChecked={review?.visible ?? true}
                            className="w-5 h-5 rounded border-white/20 bg-transparent text-primary focus:ring-primary"
                        />
                        <Label htmlFor="visible" className="cursor-pointer">
                            Visible on Website
                            <span className="block text-xs text-muted-foreground mt-0.5">Show this review in the Client Love marquee on the homepage</span>
                        </Label>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={loading} size="lg" className="gap-2 px-8">
                        {loading ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                        ) : (
                            <><Save className="h-4 w-4" /> Save Review</>
                        )}
                    </Button>
                </div>
            </form>

            {/* ─── Live Preview Card ─── */}
            <div className="w-[380px] flex-shrink-0 sticky top-24">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Live Preview</h3>
                <div className="bg-secondary/20 border border-white/5 p-8 rounded-2xl relative group hover:border-primary/50 transition-colors">
                    <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />

                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < rating ? "text-primary fill-primary" : "text-muted-foreground/30"}`}
                            />
                        ))}
                    </div>

                    {/* Review text */}
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed line-clamp-4">
                        &ldquo;{previewText || "Client testimonial will appear here..."}&rdquo;
                    </p>

                    {/* Client info */}
                    <div className="flex items-center gap-4">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={previewName || "Avatar"}
                                className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                            />
                        ) : (
                            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl border-2 border-primary/20">
                                {previewName ? previewName.charAt(0).toUpperCase() : "?"}
                            </div>
                        )}
                        <div>
                            <h4 className="font-bold text-foreground">{previewName || "Client Name"}</h4>
                            {previewCompany && (
                                <p className="text-sm text-primary">{previewCompany}</p>
                            )}
                        </div>
                    </div>

                    {/* Category badge */}
                    {previewCategory && (
                        <div className="mt-4">
                            <span className="inline-flex px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                                {previewCategory}
                            </span>
                        </div>
                    )}
                </div>
                <p className="text-center text-xs text-muted-foreground/50 mt-3">This is how the card will look on the homepage</p>
            </div>
        </div>
    )
}
