"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateGlobalSettings } from "@/actions/settings"
import { Loader2, Save, Upload, X, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"

interface GlobalSettings {
    id: number
    siteName: string
    tagline: string | null
    logoUrl: string | null
    faviconUrl: string | null
    logoType: string
    contactEmail: string | null
    contactPhone: string | null
    address: string | null
    socialFacebook: string | null
    socialInstagram: string | null
    socialYoutube: string | null
    socialTwitter: string | null
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SocialLinksManager } from "@/components/admin/SocialLinksManager"

export function SettingsForm({ initialSettings, socialLinks }: { initialSettings: GlobalSettings | null, socialLinks: any[] }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)

    const [formValues, setFormValues] = useState({
        siteName: initialSettings?.siteName || "Rana Edits",
        tagline: initialSettings?.tagline || "",
        logoType: initialSettings?.logoType || "text",
        logoUrl: initialSettings?.logoUrl || "",
        faviconUrl: initialSettings?.faviconUrl || "",
        contactEmail: initialSettings?.contactEmail || "",
        contactPhone: initialSettings?.contactPhone || "",
        address: initialSettings?.address || "",
    })

    const [uploadingLogo, setUploadingLogo] = useState(false)
    const [uploadingFavicon, setUploadingFavicon] = useState(false)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'logoUrl' | 'faviconUrl', setUploadingState: (v: boolean) => void) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingState(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            // Save favicons to a separate directory, logos to uploads
            formData.append('uploadDir', fieldName === 'faviconUrl' ? 'uploads/icons' : 'uploads/logos')

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (data.success) {
                setFormValues(prev => ({ ...prev, [fieldName]: data.url }))
                toast.success(`${fieldName === 'logoUrl' ? 'Logo' : 'Favicon'} uploaded successfully!`)
            } else {
                toast.error(`Upload failed: ${data.error}`)
            }
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("An error occurred during upload.")
        } finally {
            setUploadingState(false)
            // Clear the input so the same file can be uploaded again if needed
            e.target.value = ''
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSaveClick() {
        setLoading(true)
        setMessage(null)

        try {
            const data = new FormData()
            Object.entries(formValues).forEach(([key, val]) => {
                data.append(key, val)
            })

            const result = await updateGlobalSettings(null, data)
            if (result.success) {
                setMessage({ text: "Settings updated successfully!", type: 'success' })
                router.refresh()
            } else {
                setMessage({ text: "Failed to update settings.", type: 'error' })
            }
        } catch (error) {
            setMessage({ text: "An error occurred.", type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl relative">
            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {message.text}
                </div>
            )}

            <Tabs defaultValue="identity" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-card border border-white/5 h-auto p-1">
                    <TabsTrigger value="identity" className="py-3 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-black">
                        Site Identity
                    </TabsTrigger>
                    <TabsTrigger value="contact" className="py-3 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-black">
                        Contact Info
                    </TabsTrigger>
                    <TabsTrigger value="socials" className="py-3 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-black">
                        Social Links
                    </TabsTrigger>
                </TabsList>

                {/* --- TAB 1: SITE IDENTITY --- */}
                <TabsContent value="identity" className="space-y-6 animate-in fade-in-50 duration-300">
                    <div className="p-6 border border-white/10 rounded-xl bg-card/50 space-y-6 shadow-sm">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Brand Details</h2>
                            <p className="text-sm text-muted-foreground">This info appears in the top navigation and footer.</p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="siteName">Site Name</Label>
                                <Input
                                    id="siteName"
                                    name="siteName"
                                    value={formValues.siteName}
                                    onChange={handleChange}
                                    placeholder="e.g. Rana Edits"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tagline">Tagline</Label>
                                <Input
                                    id="tagline"
                                    name="tagline"
                                    value={formValues.tagline}
                                    onChange={handleChange}
                                    placeholder="e.g. Visual Storytelling Redefined"
                                />
                            </div>
                        </div>

                        <div className="border-t border-white/5 pt-6 space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-white">Logo Configuration</h3>
                                <p className="text-sm text-muted-foreground mt-1 text-primary/80">
                                    Choose whether to display your uploaded image logo or a sleek text-based logo.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <Label>Select Logo Type</Label>
                                <div className="flex gap-4">
                                    <label className="flex-1 flex items-center gap-3 cursor-pointer border border-white/10 p-4 rounded-xl hover:bg-white/5 hover:border-white/20 transition-all [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                                        <input
                                            type="radio"
                                            name="logoType"
                                            value="text"
                                            checked={formValues.logoType === 'text'}
                                            onChange={handleChange}
                                            className="w-4 h-4 accent-primary"
                                        />
                                        <div>
                                            <span className="block font-bold text-white">Text Logo</span>
                                            <span className="block text-xs text-muted-foreground mt-0.5">Uses your Site Name (e.g. <b>Rana</b> <span className="text-primary">Edits</span>)</span>
                                        </div>
                                    </label>
                                    <label className="flex-1 flex items-center gap-3 cursor-pointer border border-white/10 p-4 rounded-xl hover:bg-white/5 hover:border-white/20 transition-all [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                                        <input
                                            type="radio"
                                            name="logoType"
                                            value="image"
                                            checked={formValues.logoType === 'image'}
                                            onChange={handleChange}
                                            className="w-4 h-4 accent-primary"
                                        />
                                        <div>
                                            <span className="block font-bold text-white">Image Logo</span>
                                            <span className="block text-xs text-muted-foreground mt-0.5">Uses the uploaded image file (recommended)</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-3 p-4 border border-white/5 bg-black/20 rounded-xl">
                                    <Label>Primary Logo Image</Label>
                                    {formValues.logoUrl ? (
                                        <div className="relative group border border-white/10 rounded-lg p-4 bg-white/5 flex items-center justify-center min-h-[120px]">
                                            <img src={formValues.logoUrl} alt="Logo Preview" className="max-h-20 object-contain" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg gap-2">
                                                <Button 
                                                    type="button" 
                                                    variant="destructive" 
                                                    size="sm" 
                                                    onClick={() => setFormValues(prev => ({ ...prev, logoUrl: "" }))}
                                                >
                                                    <X className="w-4 h-4 mr-1" /> Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border border-dashed border-white/20 rounded-lg p-6 bg-white/5 flex flex-col items-center justify-center gap-3 text-center min-h-[120px]">
                                            {uploadingLogo ? (
                                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                            ) : (
                                                <>
                                                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                                    <div>
                                                        <Label htmlFor="logoUpload" className="cursor-pointer text-sm font-bold text-primary hover:underline">
                                                            Click to upload
                                                        </Label>
                                                        <span className="text-xs text-muted-foreground ml-1">or drag and drop</span>
                                                    </div>
                                                    <Input
                                                        id="logoUpload"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleFileUpload(e, 'logoUrl', setUploadingLogo)}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground text-center">Recommended: PNG / SVG with transparent background.</p>
                                </div>

                                <div className="space-y-3 p-4 border border-white/5 bg-black/20 rounded-xl">
                                    <Label>Browser Favicon</Label>
                                    {formValues.faviconUrl ? (
                                        <div className="relative group border border-white/10 rounded-lg p-4 bg-white/5 flex items-center justify-center min-h-[120px]">
                                            <img src={formValues.faviconUrl} alt="Favicon Preview" className="max-h-16 max-w-16 object-contain" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg gap-2">
                                                <Button 
                                                    type="button" 
                                                    variant="destructive" 
                                                    size="sm" 
                                                    onClick={() => setFormValues(prev => ({ ...prev, faviconUrl: "" }))}
                                                >
                                                    <X className="w-4 h-4 mr-1" /> Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border border-dashed border-white/20 rounded-lg p-6 bg-white/5 flex flex-col items-center justify-center gap-3 text-center min-h-[120px]">
                                            {uploadingFavicon ? (
                                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                            ) : (
                                                <>
                                                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                                    <div>
                                                        <Label htmlFor="faviconUpload" className="cursor-pointer text-sm font-bold text-primary hover:underline">
                                                            Click to upload
                                                        </Label>
                                                        <span className="text-xs text-muted-foreground ml-1">or drag and drop</span>
                                                    </div>
                                                    <Input
                                                        id="faviconUpload"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleFileUpload(e, 'faviconUrl', setUploadingFavicon)}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground text-center">Recommended: Square PNG/ICO (e.g. 32x32px or exactly square format).</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* --- TAB 2: CONTACT INFO --- */}
                <TabsContent value="contact" className="space-y-6 animate-in fade-in-50 duration-300">
                    <div className="p-6 border border-white/10 rounded-xl bg-card/50 space-y-6 shadow-sm">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Direct Contact</h2>
                            <p className="text-sm text-muted-foreground">These details are shown in the footer and contact modals.</p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="contactEmail">Main Email Address</Label>
                                <Input
                                    id="contactEmail"
                                    name="contactEmail"
                                    type="email"
                                    value={formValues.contactEmail}
                                    onChange={handleChange}
                                    placeholder="hello@ranaedits.site"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contactPhone">Phone / WhatsApp</Label>
                                <Input
                                    id="contactPhone"
                                    name="contactPhone"
                                    value={formValues.contactPhone}
                                    onChange={handleChange}
                                    placeholder="+880 1700-000000"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address">Physical Address</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    value={formValues.address}
                                    onChange={handleChange}
                                    placeholder="Dhaka, Bangladesh"
                                />
                                <p className="text-xs text-muted-foreground mt-1">Leave blank if you work remotely without a fixed office.</p>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* --- TAB 3: SOCIAL LINKS --- */}
                <TabsContent value="socials" className="space-y-6 animate-in fade-in-50 duration-300">
                    <SocialLinksManager links={socialLinks} />
                </TabsContent>
            </Tabs>

            {/* Sticky Save Bar */}
            <div className="sticky bottom-4 z-10 flex justify-end p-4 mt-8 bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
                <Button type="button" onClick={handleSaveClick} disabled={loading} size="lg" className="min-w-[180px] font-bold">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Saving Changes...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-5 w-5" />
                            Save All Settings
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
