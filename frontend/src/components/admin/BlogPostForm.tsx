"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createBlogPost, updateBlogPost } from "@/actions/blog"
import { Loader2, Save } from "lucide-react"
import { RichTextEditor } from "./RichTextEditor"

interface BlogPost {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string | null
    coverImage: string | null
    tags: any
    published: boolean
    metaTitle?: string | null
    metaDesc?: string | null
    keywords?: string | null
}

export function BlogPostForm({ post }: { post?: BlogPost | null }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)
    const [content, setContent] = useState(post?.content || "")

    // Helper to format tags array back to comma string
    const defaultTags = post?.tags && Array.isArray(post.tags) ? post.tags.join(", ") : ""

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setMessage(null)

        // Process tags (handle null gracefully)
        const tagsString = (formData.get("tags") as string) || ""
        const tagsArray = tagsString ? tagsString.split(",").map(t => t.trim()).filter(Boolean) : []

        // Reconstruct data object manually to pass array
        const rawData = Object.fromEntries(formData.entries())
        const data = {
            ...rawData,
            tags: tagsArray,
            content: content,
            published: rawData.published === 'on'
        }

        console.log("[BlogForm] Submitting data:", { ...data, content: data.content?.substring(0, 50) + "..." })

        try {
            let result
            if (post) {
                result = await updateBlogPost(post.id, data)
            } else {
                result = await createBlogPost(data)
            }

            console.log("[BlogForm] Result:", result)

            if (result.success) {
                setMessage({ text: "Post saved successfully!", type: 'success' })
                if (!post) {
                    router.push("/admin/blog")
                } else {
                    router.refresh()
                }
            } else {
                setMessage({ text: "Failed to save post. Check console for details.", type: 'error' })
                console.error("[BlogForm] Save failed:", result)
            }
        } catch (error) {
            console.error("[BlogForm] Exception:", error)
            setMessage({ text: "An error occurred.", type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="relative w-full">
            {message && (
                <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {message.text}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Main Content Area (WordPress Style) */}
                <div className="flex-1 w-full space-y-8">
                    {/* Massive Borderless Title */}
                    <div className="space-y-2">
                        <input
                            id="title"
                            name="title"
                            defaultValue={post?.title || ""}
                            placeholder="Enter post title..."
                            className="w-full bg-transparent border-none text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter placeholder:text-muted-foreground/30 focus:outline-none focus:ring-0 p-0"
                            required
                        />
                    </div>

                    {/* Rich Text Editor Canvas */}
                    <div className="space-y-2 mt-4">
                        <RichTextEditor value={content} onChange={setContent} />
                        <input type="hidden" name="content" value={content} />
                    </div>

                    {/* SEO Settings at the bottom of the document */}
                    <div className="pt-12">
                        <div className="p-6 border border-white/10 rounded-xl bg-card/50 space-y-6">
                            <div className="border-b border-white/5 pb-4 mb-4">
                                <h3 className="text-xl font-bold text-white tracking-tight">SEO Configuration</h3>
                                <p className="text-sm text-muted-foreground">Optimize this post for search engines.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="metaTitle">Meta Title</Label>
                                    <Input id="metaTitle" name="metaTitle" defaultValue={post?.metaTitle || ""} placeholder="Custom SEO title (leave blank for default)..." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="metaDesc">Meta Description</Label>
                                    <Textarea id="metaDesc" name="metaDesc" defaultValue={post?.metaDesc || ""} placeholder="Short description for search engines..." className="h-20" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="keywords">Keywords</Label>
                                    <Input id="keywords" name="keywords" defaultValue={post?.keywords || ""} placeholder="blog, news, design (comma separated)" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-full lg:w-[340px] flex-shrink-0 space-y-6 lg:sticky lg:top-8">
                    <div className="p-6 border border-white/10 rounded-xl bg-card/50 space-y-4">
                        <h3 className="font-bold text-white">Publishing</h3>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="published"
                                defaultChecked={post?.published}
                                className="w-5 h-5 rounded border-white/20 bg-transparent text-primary focus:ring-primary"
                            />
                            <span className="text-sm font-medium">Published</span>
                        </label>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Post
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Excerpt */}
                    <div className="p-6 border border-white/10 rounded-xl bg-card/50 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="excerpt" className="text-white font-bold">Excerpt</Label>
                            <p className="text-xs text-muted-foreground mb-2">Short summary for post cards.</p>
                            <Textarea
                                id="excerpt"
                                name="excerpt"
                                defaultValue={post?.excerpt || ""}
                                placeholder="Summary..."
                                className="h-24 text-sm"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="p-6 border border-white/10 rounded-xl bg-card/50 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="tags" className="text-white font-bold">Tags</Label>
                            <Input
                                id="tags"
                                name="tags"
                                defaultValue={defaultTags}
                                placeholder="Design, Tutorial, News..."
                            />
                            <p className="text-xs text-muted-foreground">Comma separated</p>
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className="p-6 border border-white/10 rounded-xl bg-card/50 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="coverImage" className="text-white font-bold">Cover Image</Label>
                            <Input
                                id="coverImage"
                                name="coverImage"
                                defaultValue={post?.coverImage || ""}
                                placeholder="https://..."
                            />
                            {post?.coverImage && (
                                <div className="mt-4 aspect-video rounded-lg overflow-hidden border border-white/10">
                                    <img src={post.coverImage} alt="Cover" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
