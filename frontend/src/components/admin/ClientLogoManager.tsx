"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save, Type, Plus, Pencil, Trash2, GripVertical, Image as ImageIcon } from "lucide-react"
import { updateSectionContent } from "@/actions/admin-modules"
import { addClientLogo, updateClientLogo, deleteClientLogo, updateClientLogoOrder } from "@/actions/client-logos"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface SectionContent {
    id?: string
    title?: string | null
    subtitle?: string | null
}

interface ClientLogo {
    id: string
    name: string
    imageUrl: string
    order: number
}

export function ClientLogoManager({
    initialContent,
    initialLogos
}: {
    initialContent?: SectionContent | null,
    initialLogos: ClientLogo[]
}) {
    const router = useRouter()

    // Content state
    const [contentLoading, setContentLoading] = useState(false)
    const [contentData, setContentData] = useState({
        title: initialContent?.title || "",
        subtitle: initialContent?.subtitle || "",
    })

    // Logo Modal state
    const [logoLoading, setLogoLoading] = useState(false)
    const [isLogoModalOpen, setIsLogoModalOpen] = useState(false)
    const [editingLogo, setEditingLogo] = useState<ClientLogo | null>(null)
    const [logoForm, setLogoForm] = useState({
        name: "",
        imageUrl: ""
    })

    const handleContentSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setContentLoading(true)
        try {
            await updateSectionContent("client-logos", {
                title: contentData.title,
                subtitle: contentData.subtitle
            })
            toast.success("Section text updated successfully")
            router.refresh()
        } catch (error) {
            console.error("Failed to update content:", error)
            toast.error("Failed to update content")
        } finally {
            setContentLoading(false)
        }
    }

    const openCreateModal = () => {
        setEditingLogo(null)
        setLogoForm({ name: "", imageUrl: "" })
        setIsLogoModalOpen(true)
    }

    const openEditModal = (logo: ClientLogo) => {
        setEditingLogo(logo)
        setLogoForm({ name: logo.name, imageUrl: logo.imageUrl })
        setIsLogoModalOpen(true)
    }

    const handleLogoSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!logoForm.name || !logoForm.imageUrl) {
            toast.error("Please fill in all fields")
            return
        }

        setLogoLoading(true)
        try {
            if (editingLogo) {
                await updateClientLogo(editingLogo.id, logoForm)
                toast.success("Logo updated successfully")
            } else {
                await addClientLogo(logoForm)
                toast.success("Logo added successfully")
            }
            setIsLogoModalOpen(false)
            router.refresh()
        } catch (error) {
            console.error("Failed to save logo:", error)
            toast.error("Failed to save logo")
        } finally {
            setLogoLoading(false)
        }
    }

    const handleDeleteLogo = async (id: string) => {
        if (!confirm("Are you sure you want to delete this logo?")) return
        try {
            await deleteClientLogo(id)
            toast.success("Logo deleted successfully")
            router.refresh()
        } catch (error) {
            console.error("Failed to delete logo:", error)
            toast.error("Failed to delete logo")
        }
    }

    const handleReorder = async (id: string, direction: 'up' | 'down') => {
        try {
            await updateClientLogoOrder(id, direction)
            router.refresh()
        } catch (error) {
            console.error("Reorder failed:", error)
            toast.error("Failed to reorder logo")
        }
    }

    return (
        <div className="space-y-8">
            {/* 1. Section Text Editor */}
            <div className="bg-card/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                        <Type className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Section Text</h2>
                        <p className="text-sm text-muted-foreground">Main title and small label text for the section.</p>
                    </div>
                </div>

                <form onSubmit={handleContentSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="subtitle" className="text-white/80">Top Label (Small Red Text)</Label>
                        <Input
                            id="subtitle"
                            value={contentData.subtitle}
                            onChange={(e) => setContentData({ ...contentData, subtitle: e.target.value })}
                            placeholder='e.g. AS SEEN IN'
                            className="bg-black/50 border-white/10 text-white placeholder:text-white/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-white/80">Main Title</Label>
                        <Input
                            id="title"
                            value={contentData.title}
                            onChange={(e) => setContentData({ ...contentData, title: e.target.value })}
                            placeholder='e.g. TRUSTED BY TOP BRANDS'
                            className="bg-black/50 border-white/10 text-white placeholder:text-white/20"
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            type="submit"
                            disabled={contentLoading}
                            className="bg-primary text-black hover:bg-primary/90 font-bold gap-2 px-6"
                        >
                            {contentLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {contentLoading ? "Saving..." : "Save Text"}
                        </Button>
                    </div>
                </form>
            </div>

            {/* 2. Logos List Editor */}
            <div className="bg-card/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Brand Logos</h2>
                            <p className="text-sm text-muted-foreground">Logos display horizontally in an infinite scroll marquee.</p>
                        </div>
                    </div>
                    <Button onClick={openCreateModal} className="gap-2 shrink-0">
                        <Plus className="h-4 w-4" />
                        Add Logo
                    </Button>
                </div>

                {initialLogos.length === 0 ? (
                    <div className="text-center p-12 text-muted-foreground bg-black/20 rounded-xl border border-dashed border-white/10">
                        <ImageIcon className="h-12 w-12 mx-auto mb-4 text-white/10" />
                        <p>No logos added yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {initialLogos.map((logo, index) => (
                            <div key={logo.id} className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col gap-1 items-center justify-center text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleReorder(logo.id, 'up')}
                                            disabled={index === 0}
                                            className="hover:text-white disabled:opacity-30 disabled:hover:text-muted-foreground/50 h-4 w-4 flex items-center justify-center"
                                        >
                                            ▲
                                        </button>
                                        <button
                                            onClick={() => handleReorder(logo.id, 'down')}
                                            disabled={index === initialLogos.length - 1}
                                            className="hover:text-white disabled:opacity-30 disabled:hover:text-muted-foreground/50 h-4 w-4 flex items-center justify-center"
                                        >
                                            ▼
                                        </button>
                                    </div>

                                    <div className="h-12 w-24 bg-white/5 rounded-lg flex items-center justify-center p-2 relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={logo.imageUrl}
                                            alt={logo.name}
                                            className="max-h-full max-w-full object-contain filter invert"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                        <ImageIcon className="h-6 w-6 text-white/20 hidden" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">{logo.name}</h3>
                                        <p className="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-[400px]">
                                            {logo.imageUrl}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => openEditModal(logo)}
                                        className="h-8 w-8 text-muted-foreground hover:text-white"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteLogo(logo.id)}
                                        className="h-8 w-8 text-red-500/50 hover:text-red-500 hover:bg-red-500/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal for Add/Edit Logo */}
            <Dialog open={isLogoModalOpen} onOpenChange={setIsLogoModalOpen}>
                <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">
                            {editingLogo ? 'Edit Client Logo' : 'Add Client Logo'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleLogoSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="logoName">Brand Name</Label>
                            <Input
                                id="logoName"
                                value={logoForm.name}
                                onChange={(e) => setLogoForm({ ...logoForm, name: e.target.value })}
                                placeholder="e.g. Netflix"
                                className="bg-black/50 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="logoUrl">Image URL (SVG recommended)</Label>
                            <Input
                                id="logoUrl"
                                value={logoForm.imageUrl}
                                onChange={(e) => setLogoForm({ ...logoForm, imageUrl: e.target.value })}
                                placeholder="e.g. https://cdn.simpleicons.org/netflix/white"
                                className="bg-black/50 border-white/10"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                We recommend using simpleicons.org (e.g., https://cdn.simpleicons.org/brand/white) for clean, recognizable shapes.
                            </p>
                        </div>

                        <div className="flex justify-end border-t border-white/10 pt-4 mt-6">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsLogoModalOpen(false)}
                                className="mr-2"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={logoLoading}
                                className="bg-primary text-black hover:bg-primary/90 min-w-[100px]"
                            >
                                {logoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
