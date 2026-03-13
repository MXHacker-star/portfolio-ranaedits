"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createService, updateService } from "@/actions/services"
import { Loader2, Save, Search } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ServiceFormProps {
    initialData?: {
        id: string
        title: string
        description: string
        icon: string
        link: string | null
        order: number
    }
}

export function ServiceForm({ initialData }: ServiceFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        icon: initialData?.icon || "",
        link: initialData?.link || "",
        order: initialData?.order || 0
    })

    const [iconSearch, setIconSearch] = useState("")
    const [iconPopoverOpen, setIconPopoverOpen] = useState(false)

    // A curated list of good icons for services to prevent loading all 1000+ icons
    const commonIcons = [
        "Video", "Camera", "Film", "MonitorPlay", "Scissors", "Clapperboard",
        "Brush", "PenTool", "Palette", "Image", "Layers", "Layout",
        "Code", "Terminal", "Laptop", "Smartphone", "Globe", "Database",
        "Zap", "Rocket", "Star", "Heart", "TrendingUp", "Award", "Briefcase",
        "Lightbulb", "Target", "Users", "MessageSquare", "Megaphone"
    ];

    const filteredIcons = commonIcons.filter(icon =>
        icon.toLowerCase().includes(iconSearch.toLowerCase())
    );

    const DynamicSelectedIcon = ({ name }: { name: string }) => {
        const Icon = (LucideIcons as any)[name] || LucideIcons.Box;
        return <Icon className="h-5 w-5" />;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (initialData) {
                await updateService(initialData.id, formData)
                toast.success("Service updated successfully")
            } else {
                await createService(formData)
                toast.success("Service created successfully")
            }
            router.push("/admin/services")
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
                <Label htmlFor="title">Service Title</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Video Editing"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the service..."
                    required
                    className="h-32"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="icon">Service Icon</Label>
                    <Popover open={iconPopoverOpen} onOpenChange={setIconPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between bg-background border-input hover:bg-accent hover:text-accent-foreground"
                            >
                                <div className="flex items-center gap-2">
                                    {formData.icon ? (
                                        <>
                                            <DynamicSelectedIcon name={formData.icon} />
                                            <span>{formData.icon}</span>
                                        </>
                                    ) : (
                                        <span className="text-muted-foreground">Select an icon...</span>
                                    )}
                                </div>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0" align="start">
                            <div className="p-2 flex items-center border-b border-white/10">
                                <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                                <Input
                                    className="h-8 border-0 focus-visible:ring-0 shadow-none px-0"
                                    placeholder="Search icons..."
                                    value={iconSearch}
                                    onChange={(e) => setIconSearch(e.target.value)}
                                />
                            </div>
                            <div className="p-2 grid grid-cols-5 gap-2 max-h-[200px] overflow-y-auto">
                                {filteredIcons.map((iconName) => {
                                    const IconComponent = (LucideIcons as any)[iconName];
                                    if (!IconComponent) return null;

                                    return (
                                        <Button
                                            key={iconName}
                                            type="button"
                                            variant={formData.icon === iconName ? "default" : "ghost"}
                                            className="h-10 w-10 p-0"
                                            onClick={() => {
                                                setFormData({ ...formData, icon: iconName });
                                                setIconPopoverOpen(false);
                                            }}
                                            title={iconName}
                                        >
                                            <IconComponent className="h-5 w-5" />
                                        </Button>
                                    )
                                })}
                            </div>
                            {filteredIcons.length === 0 && (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                    No icons found.
                                </div>
                            )}
                        </PopoverContent>
                    </Popover>
                    <p className="text-xs text-muted-foreground">
                        Select a graphical icon to represent this service.
                    </p>
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
            </div>

            <div className="space-y-2">
                <Label htmlFor="link">Link (Optional)</Label>
                <Input
                    id="link"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="e.g. /video-editing"
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
                        Save Service
                    </>
                )}
            </Button>
        </form>
    )
}
