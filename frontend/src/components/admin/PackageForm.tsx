"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { createPackage, updatePackage } from "@/actions/admin-modules"
import { toast } from "sonner"
import { Loader2, Plus, X } from "lucide-react"

interface PackageFormProps {
    initialData?: {
        id: string
        name: string
        price: string
        description?: string | null
        features: any // Json
        isPopular: boolean
        ctaText: string | null
        order: number
    }
}

export function PackageForm({ initialData }: PackageFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        price: initialData?.price || "",
        description: initialData?.description || "",
        isPopular: initialData?.isPopular ?? false,
        ctaText: initialData?.ctaText || "Get Started",
        order: initialData?.order || 0,
    })

    // Manage features list separately
    const [features, setFeatures] = useState<string[]>(
        (initialData?.features as string[]) || [""]
    )

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...features]
        newFeatures[index] = value
        setFeatures(newFeatures)
    }

    const addFeature = () => {
        setFeatures([...features, ""])
    }

    const removeFeature = (index: number) => {
        const newFeatures = features.filter((_, i) => i !== index)
        setFeatures(newFeatures)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Filter out empty features
        const cleanFeatures = features.filter(f => f.trim() !== "")

        try {
            const data = {
                ...formData,
                features: cleanFeatures
            }

            if (initialData) {
                await updatePackage(initialData.id, data)
                toast.success("Package updated")
            } else {
                await createPackage(data)
                toast.success("Package created")
            }
            router.push("/admin/packages")
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
            <div className="grid gap-6 bg-card p-6 rounded-xl border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Package Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Basic, Pro"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="e.g. $99 or Custom"
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                        id="description"
                        value={formData.description || ""}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Short description of the package"
                    />
                </div>

                <div className="space-y-4">
                    <Label>Features List</Label>
                    {features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                value={feature}
                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                placeholder={`Feature ${index + 1}`}
                            />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)} disabled={features.length === 1}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addFeature} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Feature
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="ctaText">Button Text</Label>
                        <Input
                            id="ctaText"
                            value={formData.ctaText}
                            onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
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
                </div>

                <div className="flex items-center justify-between rounded-lg border border-white/10 p-4">
                    <div className="space-y-0.5">
                        <Label className="text-base">Popular Choice</Label>
                        <div className="text-sm text-muted-foreground">
                            Highlight this package as recommended
                        </div>
                    </div>
                    <Switch
                        checked={formData.isPopular}
                        onCheckedChange={(checked: boolean) => setFormData({ ...formData, isPopular: checked })}
                    />
                </div>
            </div>

            <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Package" : "Create Package"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
            </div>
        </form>
    )
}
