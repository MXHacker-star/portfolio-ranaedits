"use client"

import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import { createPortfolioItem, updatePortfolioItem } from "@/actions/portfolio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Video, Image as ImageIcon } from "lucide-react"

const initialState = {
    message: "",
    success: false,
}

function SubmitButton({ isEditing, label }: { isEditing: boolean, label: string }) {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="w-full md:w-auto">
            {pending ? "Saving..." : isEditing ? "Update Item" : label}
        </Button>
    )
}

export function PortfolioForm({ item, defaultCategory, categories = [] }: { item?: any, defaultCategory?: string, categories?: { id: string, name: string, type: string }[] }) {
    const router = useRouter()
    // If item exists, we are editing, so bind the ID to the update action
    const updateAction = item ? updatePortfolioItem.bind(null, item.id) : createPortfolioItem
    const [state, formAction] = useActionState(updateAction, initialState)

    // State for active category to allow switching
    const [activeCategory, setActiveCategory] = useState<string>(item?.category || defaultCategory || "Video Editing")
    const isVideo = activeCategory === "Video Editing"

    // Filter sub-categories based on active main category (case-insensitive check)
    const availableSubCategories = categories.filter(c =>
        (isVideo && c.type.toLowerCase() === "video") || (!isVideo && c.type.toLowerCase() === "graphic")
    )

    return (
        <form action={formAction} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">Project Title</Label>
                    <Input
                        id="title"
                        name="title"
                        defaultValue={item?.title}
                        required
                        className="bg-background/50 border-white/10 text-white"
                    />
                </div>

                {/* Main Category Selection */}
                <div className="space-y-2">
                    <Label htmlFor="category" className="text-white">Project Type</Label>
                    <select
                        id="category"
                        name="category"
                        value={activeCategory}
                        onChange={(e) => setActiveCategory(e.target.value)}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-white/10 bg-background/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="Video Editing" className="bg-black">Video Editing</option>
                        <option value="Graphic Design" className="bg-black">Graphic Design</option>
                        <option value="Product Design" className="bg-black">Product Design</option>
                    </select>
                </div>

                {/* Hidden Type Field (Auto-set based on category) */}
                <input type="hidden" name="type" value={isVideo ? "video" : "image"} />

                {/* Sub-Category - Dynamic Dropdown */}
                <div className="space-y-2">
                    <Label htmlFor="subCategory" className="text-white">
                        Sub-Category ({isVideo ? "Video" : "Graphic"})
                        {availableSubCategories.length === 0 && <span className="text-xs text-yellow-500 ml-2">(No categories created yet)</span>}
                    </Label>

                    {availableSubCategories.length > 0 ? (
                        <div className="space-y-1">
                            <select
                                id="subCategory"
                                name="subCategory"
                                defaultValue={item?.subCategory || ""}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-white/10 bg-background/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="" className="bg-black">Select a {isVideo ? "video" : "graphic"} category...</option>
                                {availableSubCategories.map(cat => (
                                    <option key={cat.id} value={cat.name} className="bg-black">{cat.name}</option>
                                ))}
                            </select>
                            <p className="text-xs text-muted-foreground">
                                Select from your managed categories.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <Input
                                id="subCategory"
                                name="subCategory"
                                defaultValue={item?.subCategory || ""}
                                placeholder={isVideo ? "e.g. Vlog" : "e.g. Logo"}
                                className="bg-background/50 border-white/10 text-white"
                            />
                            <p className="text-xs text-yellow-500/80">
                                ⚠️ No <strong>{isVideo ? "Video" : "Graphic"}</strong> categories found. <a href="/admin/categories" className="underline hover:text-yellow-400">Create one here</a> first.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Media Section - Conditional Rendering */}
            <div className="space-y-4 border border-white/10 p-4 rounded-md bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                    {isVideo ? <Video className="text-primary h-5 w-5" /> : <ImageIcon className="text-primary h-5 w-5" />}
                    <h3 className="text-white font-semibold text-lg">
                        {isVideo ? "Video Details" : "Image Details"}
                    </h3>
                </div>

                {isVideo ? (
                    // VIDEO INPUTS
                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="mediaUrl" className="text-white">YouTube Video ID</Label>
                                <Input
                                    id="mediaUrl"
                                    name="mediaUrl"
                                    defaultValue={item?.mediaUrl}
                                    required
                                    placeholder="e.g. ScMzIvxBSi4"
                                    className="bg-background/50 border-white/10 text-white font-mono"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Only the ID part of the URL (after v=).
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="orientation" className="text-white">Video Orientation</Label>
                                <select
                                    id="orientation"
                                    name="orientation"
                                    defaultValue={item?.orientation || "horizontal"}
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-white/10 bg-background/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="horizontal" className="bg-black">Horizontal (16:9)</option>
                                    <option value="vertical" className="bg-black">Vertical (9:16)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2 bg-black/20 p-3 rounded border border-white/5">
                            <Label htmlFor="thumbnail" className="text-white">Custom Thumbnail (Optional)</Label>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label className="text-xs text-muted-foreground mb-1 block">Upload File</Label>
                                    <Input
                                        id="file"
                                        name="file"
                                        type="file"
                                        accept="image/*"
                                        className="bg-transparent border-white/10 text-white text-xs file:bg-primary file:text-black file:border-0 file:mr-2 file:py-1 file:px-2 file:rounded-sm hover:file:bg-primary/90"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground mb-1 block">Or Paste URL</Label>
                                    <Input
                                        id="thumbnail"
                                        name="thumbnail"
                                        defaultValue={item?.thumbnail || ""}
                                        placeholder="https://..."
                                        className="bg-background/50 border-white/10 text-white h-9"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">If empty, YouTube thumbnail will be used.</p>
                        </div>
                    </div>
                ) : (
                    // GRAPHIC DESIGN INPUTS
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="file" className="text-white">Upload Design</Label>
                            <Input
                                id="file"
                                name="file"
                                type="file"
                                accept="image/*"
                                className="bg-transparent border-white/10 text-white file:bg-primary file:text-black file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded hover:file:bg-primary/90"
                            />
                            <p className="text-xs text-muted-foreground">Recommended. Upload your design file (JPG/PNG).</p>
                        </div>

                        <div className="relative flex items-center py-2">
                            <span className="border-t border-white/10 flex-grow"></span>
                            <span className="px-2 text-xs text-muted-foreground uppercase">OR</span>
                            <span className="border-t border-white/10 flex-grow"></span>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mediaUrl" className="text-white">Image URL</Label>
                            <Input
                                id="mediaUrl"
                                name="mediaUrl"
                                defaultValue={item?.mediaUrl}
                                placeholder="https://..."
                                className="bg-background/50 border-white/10 text-white"
                            />
                            <p className="text-xs text-muted-foreground">Direct link to image if not uploading.</p>
                        </div>

                        {/* Graphics usually don't need a separate thumbnail field if the main image IS the thumbnail */}
                        {/* We hide the explicit thumbnail input to reduce clutter, backend will use mediaUrl/file */}
                        <input type="hidden" name="thumbnail" value={item?.thumbnail || ""} />
                    </div>
                )}
            </div>

            <div className="flex items-center space-x-2 pt-2">
                <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    defaultChecked={item?.featured}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="featured" className="text-white cursor-pointer select-none">Featured (Show on Homepage)</Label>
            </div>

            {
                state.message && (
                    <div className={`p-3 rounded-md text-sm ${state.success ? "bg-green-500/15 text-green-500" : "bg-red-500/15 text-red-500"}`}>
                        {state.message}
                    </div>
                )
            }

            <SubmitButton isEditing={!!item} label={isVideo ? "Save Video Project" : "Save Graphic Design"} />
        </form >
    )
}
