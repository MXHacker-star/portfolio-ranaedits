"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { createStat, updateStat } from "@/actions/admin-modules"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface StatFormProps {
    initialData?: {
        id: string
        label: string
        value: string
        icon: string | null
        section: string
        order: number
        visible: boolean
    }
    defaultSection?: string
}

export function StatForm({ initialData, defaultSection = "results" }: StatFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        label: initialData?.label || "",
        value: initialData?.value || "",
        icon: initialData?.icon || "",
        section: initialData?.section || defaultSection,
        order: initialData?.order || 0,
        visible: initialData?.visible ?? true,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (initialData) {
                await updateStat(initialData.id, formData)
                toast.success("Stat updated")
            } else {
                await createStat(formData)
                toast.success("Stat created")
            }
            router.push("/admin/stats")
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
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="value">Value</Label>
                        <Input
                            id="value"
                            value={formData.value}
                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                            placeholder="e.g. 10M+"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="label">Label</Label>
                        <Input
                            id="label"
                            value={formData.label}
                            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                            placeholder="e.g. Views"
                            required
                        />
                    </div>
                </div>

                {/* Section Dropdown — which frontend section this stat belongs to */}
                <div className="grid gap-2">
                    <Label htmlFor="section">Section</Label>
                    <select
                        id="section"
                        value={formData.section}
                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="results">Business Results</option>
                        <option value="about">About Me</option>
                        <option value="results_page">Results Page</option>
                    </select>
                    <p className="text-xs text-muted-foreground">
                        &quot;Business Results&quot; = main results section &bull; &quot;About Me&quot; = about section stat cards
                    </p>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="icon">Icon Name (Lucide)</Label>
                    <Input
                        id="icon"
                        value={formData.icon || ""}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        placeholder="e.g. Play, Users, Trophy"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="order">Order Priority</Label>
                    <Input
                        id="order"
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-white/10 p-4">
                    <div className="space-y-0.5">
                        <Label className="text-base">Visible</Label>
                        <div className="text-sm text-muted-foreground">
                            Show this stat on the website
                        </div>
                    </div>
                    <Switch
                        checked={formData.visible}
                        onCheckedChange={(checked: boolean) => setFormData({ ...formData, visible: checked })}
                    />
                </div>
            </div>

            <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Stat" : "Create Stat"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
            </div>
        </form>
    )
}

