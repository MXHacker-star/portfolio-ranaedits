"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import * as LucideIcons from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, Trash2, Edit2, Check, X, Link as LinkIcon } from "lucide-react"
import { createSocialLink, updateSocialLink, deleteSocialLink, toggleSocialLink } from "@/actions/socials"

// Define a safe list of popular/supported Lucide icons for social media, or allow a generic fallback
const SUPPORTED_ICONS = [
    "Instagram", "Twitter", "Youtube", "Facebook", "Linkedin", "Github", "Dribbble", "Figma",
    "Twitch", "Discord", "Slack", "Globe", "Mail", "Music2" // Music2 can stand in for TikTok
] as const

type SupportedIcon = typeof SUPPORTED_ICONS[number]

interface SocialLink {
    id: string
    platform: string
    url: string
    icon: string
    isActive: boolean
    order: number
}

export function SocialLinksManager({ links }: { links: SocialLink[] }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    // UI State
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Form Action handlers
    async function handleAdd(formData: FormData) {
        setError(null)
        const result = await createSocialLink(formData)
        if (result.success) {
            setIsAdding(false)
            startTransition(() => {
                router.refresh()
            })
        } else {
            setError(result.error || "Failed to add link")
        }
    }

    async function handleUpdate(id: string, formData: FormData) {
        setError(null)
        const result = await updateSocialLink(id, formData)
        if (result.success) {
            setEditingId(null)
            startTransition(() => {
                router.refresh()
            })
        } else {
            setError(result.error || "Failed to update link")
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this social link?")) return

        setError(null)
        const result = await deleteSocialLink(id)
        if (result.success) {
            startTransition(() => {
                router.refresh()
            })
        } else {
            setError(result.error || "Failed to delete link")
        }
    }

    async function handleToggle(id: string, isActive: boolean) {
        setError(null)
        const result = await toggleSocialLink(id, isActive)
        if (result.success) {
            startTransition(() => {
                router.refresh()
            })
        } else {
            setError(result.error || "Failed to toggle link")
        }
    }

    // Dynamic Icon Renderer
    const renderIcon = (iconName: string) => {
        // @ts-ignore - Lucide icon mapping
        const IconComponent = LucideIcons[iconName] || LinkIcon
        return <IconComponent className="h-5 w-5" />
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white mb-1">Social Media Profiles</h2>
                    <p className="text-sm text-muted-foreground">Manage your dynamic social links. They will appear in the footer.</p>
                </div>
                <Button onClick={() => setIsAdding(!isAdding)} variant={isAdding ? "outline" : "default"} size="sm" className="gap-2">
                    {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {isAdding ? "Cancel" : "Add New Profile"}
                </Button>
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Addition Form */}
            {isAdding && (
                <div className="p-6 border border-white/10 rounded-xl bg-card/80 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-bold text-white text-lg">Add New Social Profile</h3>
                    <form action={handleAdd} className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="platform">Platform Name</Label>
                            <Input id="platform" name="platform" placeholder="e.g. LinkedIn" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="icon">Icon Selection</Label>
                            <select
                                id="icon"
                                name="icon"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Select an icon...</option>
                                {SUPPORTED_ICONS.map(icon => (
                                    <option key={icon} value={icon}>{icon}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="url">Profile URL</Label>
                            <Input id="url" name="url" type="url" placeholder="https://..." required />
                        </div>
                        <input type="hidden" name="isActive" value="true" />
                        <div className="md:col-span-2 flex justify-end mt-2">
                            <Button type="submit" disabled={isPending} className="gap-2">
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                Save Profile
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* List of Links */}
            <div className="space-y-3">
                {links.length === 0 && !isAdding && (
                    <div className="text-center py-10 border border-dashed border-white/20 rounded-xl">
                        <p className="text-muted-foreground">No social profiles added yet.</p>
                        <Button variant="link" onClick={() => setIsAdding(true)}>Add your first profile</Button>
                    </div>
                )}

                {links.map((link) => (
                    <div key={link.id} className={`p-4 rounded-xl border transition-all duration-300 ${link.isActive ? 'border-white/10 bg-card/40' : 'border-white/5 bg-background/50 opacity-60'}`}>

                        {/* VIEW MODE */}
                        {editingId !== link.id ? (
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 min-w-0">
                                    {/* Handle Drag (Visual only here, implementation possible later) */}
                                    <div className={`p-2 rounded-lg shrink-0 ${link.isActive ? 'bg-primary/10 text-primary' : 'bg-white/5 text-muted-foreground'}`}>
                                        {renderIcon(link.icon)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-white truncate">{link.platform}</p>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary hover:underline truncate block max-w-[200px] md:max-w-md">
                                            {link.url}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="flex items-center gap-2 mr-2">
                                        <Switch
                                            checked={link.isActive}
                                            onCheckedChange={(checked) => handleToggle(link.id, checked)}
                                            disabled={isPending}
                                        />
                                        <span className="text-xs text-muted-foreground hidden sm:inline-block w-8">
                                            {link.isActive ? 'ON' : 'OFF'}
                                        </span>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => setEditingId(link.id)} disabled={isPending}>
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(link.id)} disabled={isPending} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            /* EDIT MODE */
                            <form action={(formData) => handleUpdate(link.id, formData)} className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor={`platform-${link.id}`}>Platform Name</Label>
                                    <Input id={`platform-${link.id}`} name="platform" defaultValue={link.platform} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`icon-${link.id}`}>Icon Selection</Label>
                                    <select
                                        id={`icon-${link.id}`}
                                        name="icon"
                                        defaultValue={link.icon}
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {SUPPORTED_ICONS.map(icon => (
                                            <option key={icon} value={icon}>{icon}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor={`url-${link.id}`}>Profile URL</Label>
                                    <Input id={`url-${link.id}`} name="url" type="url" defaultValue={link.url} required />
                                </div>
                                <input type="hidden" name="isActive" value={link.isActive ? "true" : "false"} />

                                <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                                    <Button type="button" variant="ghost" onClick={() => setEditingId(null)} disabled={isPending}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isPending} className="gap-2">
                                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                ))}
            </div>
            {links.length > 0 && !isAdding && (
                <p className="text-xs text-muted-foreground mt-4 text-center">
                    Active links are automatically displayed on your website frontend.
                </p>
            )}
        </div>
    )
}
