"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createMenuLink, updateMenuLink } from "@/actions/admin-modules"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface MenuLinkFormProps {
    initialData?: {
        id: string
        label: string
        path: string
        type: string
        order: number
        isActive: boolean
        isExternal: boolean
        icon: string | null
        parentId: string | null
    }
    parentOptions?: {
        id: string
        label: string
    }[]
}

export function MenuLinkForm({ initialData, parentOptions }: MenuLinkFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        label: initialData?.label || "",
        path: initialData?.path || "",
        type: initialData?.type || "header",
        order: initialData?.order || 0,
        isActive: initialData?.isActive ?? true,
        isExternal: initialData?.isExternal ?? false,
        icon: initialData?.icon || "",
        parentId: initialData?.parentId || "none",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Clean up formData before sending
            const submitData = {
                ...formData,
                icon: formData.icon || null,
                parentId: formData.parentId === "none" ? null : formData.parentId,
            }

            if (initialData) {
                await updateMenuLink(initialData.id, submitData)
                toast.success("Menu link updated")
            } else {
                await createMenuLink(submitData)
                toast.success("Menu link created")
            }
            router.push("/admin/menu")
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            <div className="grid gap-4 bg-card p-6 rounded-xl border border-white/10">
                <div className="grid gap-2">
                    <Label htmlFor="label">Label</Label>
                    <Input
                        id="label"
                        value={formData.label}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                        placeholder="e.g. Home"
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="path">Path</Label>
                    <Input
                        id="path"
                        value={formData.path}
                        onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                        placeholder="e.g. / or /about"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="type">Type</Label>
                        <Select
                            value={formData.type}
                            onValueChange={(value) => setFormData({ ...formData, type: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="header">Header</SelectItem>
                                <SelectItem value="footer">Footer</SelectItem>
                                <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="order">Order (Sort)</Label>
                        <Input
                            id="order"
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="parentId">Parent Menu (Sub-menu)</Label>
                        <Select
                            value={formData.parentId}
                            onValueChange={(value) => setFormData({ ...formData, parentId: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="None (Top Level)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None (Top Level)</SelectItem>
                                {parentOptions?.filter(p => p.id !== initialData?.id).map((parent) => (
                                    <SelectItem key={parent.id} value={parent.id}>
                                        {parent.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="icon">Icon (Optional)</Label>
                        <Input
                            id="icon"
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            placeholder="e.g. Layout, Star, ArrowRight"
                        />
                        <p className="text-xs text-muted-foreground">Find icon names at <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" className="underline hover:text-white">lucide.dev</a> (Capitalized, e.g., 'Mail')</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border border-white/10 p-4 bg-white/5">
                        <div className="space-y-0.5">
                            <Label className="text-base text-white">Active (Visible)</Label>
                            <div className="text-sm text-muted-foreground">
                                Show this link in navigation menus
                            </div>
                        </div>
                        <Switch
                            checked={formData.isActive}
                            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-white/10 p-4 bg-white/5">
                        <div className="space-y-0.5">
                            <Label className="text-base text-white">Open in New Tab</Label>
                            <div className="text-sm text-muted-foreground">
                                Ideal for external links or PDF files (target="_blank")
                            </div>
                        </div>
                        <Switch
                            checked={formData.isExternal}
                            onCheckedChange={(checked) => setFormData({ ...formData, isExternal: checked })}
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Link" : "Create Link"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
            </div>
        </form>
    )
}
