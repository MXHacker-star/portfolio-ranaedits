"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { updateSEOConfig } from "@/actions/admin-modules"
import { toast } from "sonner"
import {
    Loader2, Save, Search, Globe, Share2, Code2,
    CheckCircle2, XCircle, AlertCircle, Image as ImageIcon, X
} from "lucide-react"

interface SEOFormProps {
    initialData: {
        id: number
        metaTitle: string | null
        metaDesc: string | null
        keywords: string | null
        ogImage: string | null
        scripts: string | null
        focusKeyword: string | null
        robotsIndex: boolean
        robotsFollow: boolean
        canonicalUrl: string | null
        twitterCard: string
        twitterTitle: string | null
        twitterDesc: string | null
        twitterImage: string | null
        ogTitle: string | null
        ogDesc: string | null
        schemaType: string
    }
}

// --- Helper: Progress bar color ---
function getProgressColor(current: number, min: number, max: number) {
    if (current === 0) return "bg-muted"
    if (current < min) return "bg-yellow-500"
    if (current <= max) return "bg-green-500"
    return "bg-red-500"
}

function getProgressLabel(current: number, min: number, max: number, label: string) {
    if (current === 0) return `Enter your ${label}`
    if (current < min) return `Too short (${current}/${min} min)`
    if (current <= max) return `Perfect length! (${current}/${max} max)`
    return `Too long (${current}/${max} max)`
}

// --- Focus Keyword Analysis ---
function analyzeKeyword(keyword: string, title: string, description: string) {
    if (!keyword.trim()) return []
    const kw = keyword.toLowerCase().trim()
    const checks = [
        {
            label: "Focus Keyword in SEO Title",
            pass: title.toLowerCase().includes(kw),
        },
        {
            label: "Focus Keyword in Meta Description",
            pass: description.toLowerCase().includes(kw),
        },
        {
            label: "Focus Keyword length is good",
            pass: kw.length >= 3 && kw.length <= 60,
        },
    ]
    return checks
}

export function SEOForm({ initialData }: SEOFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploadingOg, setUploadingOg] = useState(false)
    const [uploadingTwitter, setUploadingTwitter] = useState(false)

    const [formData, setFormData] = useState({
        metaTitle: initialData.metaTitle || "",
        metaDesc: initialData.metaDesc || "",
        keywords: initialData.keywords || "",
        ogImage: initialData.ogImage || "",
        scripts: initialData.scripts || "",
        focusKeyword: initialData.focusKeyword || "",
        robotsIndex: initialData.robotsIndex ?? true,
        robotsFollow: initialData.robotsFollow ?? true,
        canonicalUrl: initialData.canonicalUrl || "",
        twitterCard: initialData.twitterCard || "summary_large_image",
        twitterTitle: initialData.twitterTitle || "",
        twitterDesc: initialData.twitterDesc || "",
        twitterImage: initialData.twitterImage || "",
        ogTitle: initialData.ogTitle || "",
        ogDesc: initialData.ogDesc || "",
        schemaType: initialData.schemaType || "Organization",
    })

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleFileUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldName: 'ogImage' | 'twitterImage',
        setUploadingState: (v: boolean) => void
    ) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploadingState(true)
        try {
            const fd = new FormData()
            fd.append('file', file)
            fd.append('uploadDir', 'uploads/seo')
            const response = await fetch('/api/upload', { method: 'POST', body: fd })
            const data = await response.json()
            if (data.success) {
                handleChange(fieldName, data.url)
                toast.success("Image uploaded successfully!")
            } else {
                toast.error(`Upload failed: ${data.error}`)
            }
        } catch {
            toast.error("An error occurred during upload.")
        } finally {
            setUploadingState(false)
            e.target.value = ''
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await updateSEOConfig(formData)
            toast.success("SEO settings saved successfully!")
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    // Analysis data
    const keywordChecks = analyzeKeyword(formData.focusKeyword, formData.metaTitle, formData.metaDesc)
    const titleLen = formData.metaTitle.length
    const descLen = formData.metaDesc.length
    const passedChecks = keywordChecks.filter(c => c.pass).length

    // Display values for previews
    const serpTitle = formData.metaTitle || "Your Page Title"
    const serpDesc = formData.metaDesc || "Your meta description will appear here. Write a compelling summary to increase click-through rates from search results."
    const serpUrl = formData.canonicalUrl || "https://ranaedits.site"

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl relative">
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8 bg-card border border-white/5 h-auto p-1">
                    <TabsTrigger value="general" className="py-3 text-xs sm:text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-black gap-1.5">
                        <Search className="w-4 h-4" /> General
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="py-3 text-xs sm:text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-black gap-1.5">
                        <Globe className="w-4 h-4" /> Advanced
                    </TabsTrigger>
                    <TabsTrigger value="social" className="py-3 text-xs sm:text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-black gap-1.5">
                        <Share2 className="w-4 h-4" /> Social
                    </TabsTrigger>
                    <TabsTrigger value="schema" className="py-3 text-xs sm:text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-black gap-1.5">
                        <Code2 className="w-4 h-4" /> Schema
                    </TabsTrigger>
                </TabsList>

                {/* ========== TAB 1: GENERAL SEO ========== */}
                <TabsContent value="general" className="space-y-6 animate-in fade-in-50 duration-300">
                    {/* Live SERP Preview */}
                    <div className="p-6 border border-white/10 rounded-xl bg-card/50 space-y-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Search className="w-5 h-5 text-primary" /> Google Search Preview
                        </h2>
                        <div className="bg-white rounded-xl p-5 space-y-1">
                            <p className="text-sm text-[#202124] truncate">{serpUrl}</p>
                            <h3 className="text-xl text-[#1a0dab] font-medium truncate leading-tight hover:underline cursor-pointer">
                                {serpTitle}
                            </h3>
                            <p className="text-sm text-[#4d5156] line-clamp-2 leading-relaxed">
                                {serpDesc}
                            </p>
                        </div>
                    </div>

                    {/* Focus Keyword */}
                    <div className="p-6 border border-white/10 rounded-xl bg-card/50 space-y-4">
                        <h2 className="text-lg font-bold text-white">Focus Keyword Analysis</h2>
                        <div className="space-y-2">
                            <Label htmlFor="focusKeyword">Focus Keyword</Label>
                            <Input
                                id="focusKeyword"
                                value={formData.focusKeyword}
                                onChange={(e) => handleChange("focusKeyword", e.target.value)}
                                placeholder="e.g. video editing agency"
                            />
                        </div>
                        {formData.focusKeyword && (
                            <div className="space-y-2 pt-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="font-bold text-white">
                                        SEO Score: {passedChecks}/{keywordChecks.length}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${passedChecks === keywordChecks.length ? 'bg-green-500/20 text-green-400' : passedChecks >= 2 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {passedChecks === keywordChecks.length ? 'Excellent' : passedChecks >= 2 ? 'Good' : 'Needs Work'}
                                    </span>
                                </div>
                                {keywordChecks.map((check, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                        {check.pass ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                                        )}
                                        <span className={check.pass ? "text-green-400" : "text-red-400"}>
                                            {check.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Meta Title */}
                    <div className="p-6 border border-white/10 rounded-xl bg-card/50 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="metaTitle">SEO Title</Label>
                            <Input
                                id="metaTitle"
                                value={formData.metaTitle}
                                onChange={(e) => handleChange("metaTitle", e.target.value)}
                                placeholder="e.g. Rana Edits | Premium Video Editing Agency"
                            />
                            <div className="flex items-center justify-between text-xs">
                                <span className={titleLen > 60 ? 'text-red-400' : titleLen >= 30 ? 'text-green-400' : 'text-yellow-400'}>
                                    {getProgressLabel(titleLen, 30, 60, "SEO Title")}
                                </span>
                                <span className="text-muted-foreground">{titleLen}/60</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5">
                                <div
                                    className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(titleLen, 30, 60)}`}
                                    style={{ width: `${Math.min((titleLen / 60) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Meta Description */}
                        <div className="space-y-2">
                            <Label htmlFor="metaDesc">Meta Description</Label>
                            <Textarea
                                id="metaDesc"
                                value={formData.metaDesc}
                                onChange={(e) => handleChange("metaDesc", e.target.value)}
                                placeholder="Brief but compelling description for search engines..."
                                className="h-24"
                            />
                            <div className="flex items-center justify-between text-xs">
                                <span className={descLen > 160 ? 'text-red-400' : descLen >= 120 ? 'text-green-400' : 'text-yellow-400'}>
                                    {getProgressLabel(descLen, 120, 160, "Meta Description")}
                                </span>
                                <span className="text-muted-foreground">{descLen}/160</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5">
                                <div
                                    className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(descLen, 120, 160)}`}
                                    style={{ width: `${Math.min((descLen / 160) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Keywords */}
                        <div className="space-y-2">
                            <Label htmlFor="keywords">Meta Keywords</Label>
                            <Textarea
                                id="keywords"
                                value={formData.keywords}
                                onChange={(e) => handleChange("keywords", e.target.value)}
                                placeholder="video editing, graphic design, portfolio, rana edits..."
                                className="h-20"
                            />
                            <p className="text-xs text-muted-foreground">Separate keywords with commas.</p>
                        </div>
                    </div>
                </TabsContent>

                {/* ========== TAB 2: ADVANCED / ROBOTS ========== */}
                <TabsContent value="advanced" className="space-y-6 animate-in fade-in-50 duration-300">
                    {/* Search Engine Visibility */}
                    <div className="p-6 border border-white/10 rounded-xl bg-card/50 space-y-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Globe className="w-5 h-5 text-primary" /> Search Engine Visibility
                        </h2>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-black/20">
                                <div>
                                    <p className="font-bold text-white">Allow Indexing</p>
                                    <p className="text-xs text-muted-foreground mt-1">Let Google index your site in search results.</p>
                                </div>
                                <Switch
                                    checked={formData.robotsIndex}
                                    onCheckedChange={(v) => handleChange("robotsIndex", v)}
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-black/20">
                                <div>
                                    <p className="font-bold text-white">Allow Link Following</p>
                                    <p className="text-xs text-muted-foreground mt-1">Let Google follow links on your pages.</p>
                                </div>
                                <Switch
                                    checked={formData.robotsFollow}
                                    onCheckedChange={(v) => handleChange("robotsFollow", v)}
                                />
                            </div>
                        </div>

                        {(!formData.robotsIndex || !formData.robotsFollow) && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-red-400">Warning: Reduced Visibility</p>
                                    <p className="text-xs text-red-400/80 mt-1">
                                        {!formData.robotsIndex && "Your site will NOT appear in Google search results. "}
                                        {!formData.robotsFollow && "Google will NOT follow links on your pages, reducing SEO juice to linked pages."}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Live robots meta preview */}
                        <div className="p-4 bg-black/30 rounded-xl border border-white/5">
                            <p className="text-xs text-muted-foreground mb-2 font-bold uppercase tracking-wider">Generated Robots Meta Tag</p>
                            <code className="text-xs text-green-400 font-mono">
                                {`<meta name="robots" content="${formData.robotsIndex ? 'index' : 'noindex'}, ${formData.robotsFollow ? 'follow' : 'nofollow'}" />`}
                            </code>
                        </div>
                    </div>

                    {/* Canonical URL */}
                    <div className="p-6 border border-white/10 rounded-xl bg-card/50 space-y-4">
                        <h2 className="text-lg font-bold text-white">Canonical URL</h2>
                        <p className="text-sm text-muted-foreground">
                            Set the preferred URL for your site to avoid duplicate content penalties. Leave blank to use the default URL.
                        </p>
                        <Input
                            value={formData.canonicalUrl}
                            onChange={(e) => handleChange("canonicalUrl", e.target.value)}
                            placeholder="https://ranaedits.site"
                        />
                        {formData.canonicalUrl && (
                            <div className="p-3 bg-black/30 rounded-xl border border-white/5">
                                <code className="text-xs text-green-400 font-mono">
                                    {`<link rel="canonical" href="${formData.canonicalUrl}" />`}
                                </code>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* ========== TAB 3: SOCIAL GRAPH ========== */}
                <TabsContent value="social" className="space-y-6 animate-in fade-in-50 duration-300">
                    {/* Facebook / Open Graph */}
                    <div className="p-6 border border-white/10 rounded-xl bg-card/50 space-y-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Share2 className="w-5 h-5 text-blue-500" /> Facebook / Open Graph
                        </h2>

                        {/* Facebook Preview Card */}
                        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white max-w-md">
                            <div className="w-full aspect-[1.91/1] bg-gray-100 flex items-center justify-center overflow-hidden">
                                {formData.ogImage ? (
                                    <img src={formData.ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-gray-400 text-sm flex flex-col items-center gap-2">
                                        <ImageIcon className="w-8 h-8" />
                                        <span>Upload an OG Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-3 border-t border-gray-200 bg-[#f2f3f5]">
                                <p className="text-[11px] text-[#606770] uppercase tracking-wide">ranaedits.site</p>
                                <p className="text-[#1d2129] font-bold text-sm mt-0.5 line-clamp-1">
                                    {formData.ogTitle || formData.metaTitle || "Your Open Graph Title"}
                                </p>
                                <p className="text-[#606770] text-xs mt-0.5 line-clamp-2">
                                    {formData.ogDesc || formData.metaDesc || "Your Open Graph description will appear here."}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label>OG Title (leave blank to use SEO Title)</Label>
                                <Input
                                    value={formData.ogTitle}
                                    onChange={(e) => handleChange("ogTitle", e.target.value)}
                                    placeholder="Custom title for Facebook/LinkedIn shares..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>OG Description (leave blank to use Meta Description)</Label>
                                <Textarea
                                    value={formData.ogDesc}
                                    onChange={(e) => handleChange("ogDesc", e.target.value)}
                                    placeholder="Custom description for Facebook/LinkedIn shares..."
                                    className="h-20"
                                />
                            </div>
                            {/* OG Image Upload */}
                            <div className="space-y-2">
                                <Label>OG Image (1200×630 recommended)</Label>
                                {formData.ogImage ? (
                                    <div className="relative group border border-white/10 rounded-lg p-3 bg-white/5 flex items-center gap-4">
                                        <img src={formData.ogImage} alt="OG" className="h-16 w-28 object-cover rounded" />
                                        <span className="text-xs text-muted-foreground truncate flex-1">{formData.ogImage}</span>
                                        <Button type="button" variant="destructive" size="sm" onClick={() => handleChange("ogImage", "")}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="border border-dashed border-white/20 rounded-lg p-6 bg-white/5 flex flex-col items-center justify-center gap-2 text-center">
                                        {uploadingOg ? (
                                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                        ) : (
                                            <>
                                                <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                                <Label htmlFor="ogImageUpload" className="cursor-pointer text-sm font-bold text-primary hover:underline">
                                                    Click to upload
                                                </Label>
                                                <Input id="ogImageUpload" type="file" accept="image/*" className="hidden"
                                                    onChange={(e) => handleFileUpload(e, 'ogImage', setUploadingOg)}
                                                />
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Twitter Card */}
                    <div className="p-6 border border-white/10 rounded-xl bg-card/50 space-y-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Share2 className="w-5 h-5 text-sky-400" /> Twitter (X) Card
                        </h2>

                        {/* Twitter Preview */}
                        <div className="border border-[#2f3336] rounded-2xl overflow-hidden bg-black max-w-md">
                            <div className="w-full aspect-[2/1] bg-[#16181c] flex items-center justify-center overflow-hidden">
                                {(formData.twitterImage || formData.ogImage) ? (
                                    <img src={formData.twitterImage || formData.ogImage} alt="Twitter" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-[#71767b] text-sm flex flex-col items-center gap-2">
                                        <ImageIcon className="w-8 h-8" />
                                        <span>Upload Twitter Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-3">
                                <p className="text-[#71767b] text-xs">ranaedits.site</p>
                                <p className="text-[#e7e9ea] font-bold text-sm mt-0.5 line-clamp-1">
                                    {formData.twitterTitle || formData.ogTitle || formData.metaTitle || "Your Twitter Card Title"}
                                </p>
                                <p className="text-[#71767b] text-xs mt-0.5 line-clamp-2">
                                    {formData.twitterDesc || formData.ogDesc || formData.metaDesc || "Your Twitter card description."}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label>Card Type</Label>
                                <div className="flex gap-3">
                                    {["summary", "summary_large_image"].map((type) => (
                                        <label key={type} className={`flex-1 flex items-center gap-2 cursor-pointer border p-3 rounded-xl text-sm font-bold transition-all ${formData.twitterCard === type ? 'border-primary bg-primary/5 text-white' : 'border-white/10 text-muted-foreground hover:bg-white/5'}`}>
                                            <input type="radio" name="twitterCard" value={type} checked={formData.twitterCard === type}
                                                onChange={() => handleChange("twitterCard", type)} className="accent-primary" />
                                            {type === "summary" ? "Summary" : "Large Image"}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Twitter Title (leave blank to use OG Title)</Label>
                                <Input value={formData.twitterTitle}
                                    onChange={(e) => handleChange("twitterTitle", e.target.value)}
                                    placeholder="Custom title for Twitter shares..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Twitter Description (leave blank to use OG Description)</Label>
                                <Textarea value={formData.twitterDesc}
                                    onChange={(e) => handleChange("twitterDesc", e.target.value)}
                                    placeholder="Custom description for Twitter shares..." className="h-20" />
                            </div>
                            <div className="space-y-2">
                                <Label>Twitter Image (leave blank to use OG Image)</Label>
                                {formData.twitterImage ? (
                                    <div className="relative group border border-white/10 rounded-lg p-3 bg-white/5 flex items-center gap-4">
                                        <img src={formData.twitterImage} alt="Twitter" className="h-16 w-28 object-cover rounded" />
                                        <span className="text-xs text-muted-foreground truncate flex-1">{formData.twitterImage}</span>
                                        <Button type="button" variant="destructive" size="sm" onClick={() => handleChange("twitterImage", "")}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="border border-dashed border-white/20 rounded-lg p-4 bg-white/5 flex flex-col items-center gap-2 text-center">
                                        {uploadingTwitter ? (
                                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                        ) : (
                                            <>
                                                <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                                <Label htmlFor="twitterImageUpload" className="cursor-pointer text-sm font-bold text-primary hover:underline">
                                                    Click to upload
                                                </Label>
                                                <Input id="twitterImageUpload" type="file" accept="image/*" className="hidden"
                                                    onChange={(e) => handleFileUpload(e, 'twitterImage', setUploadingTwitter)}
                                                />
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* ========== TAB 4: SCHEMA & SCRIPTS ========== */}
                <TabsContent value="schema" className="space-y-6 animate-in fade-in-50 duration-300">
                    {/* Schema Type */}
                    <div className="p-6 border border-white/10 rounded-xl bg-card/50 space-y-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Code2 className="w-5 h-5 text-primary" /> Knowledge Graph / Schema.org
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Choose how Google's Knowledge Graph identifies your brand. This generates automatic JSON-LD structured data.
                        </p>

                        <div className="flex gap-3">
                            {["Organization", "Person", "None"].map((type) => (
                                <label key={type} className={`flex-1 flex items-center gap-2 cursor-pointer border p-4 rounded-xl text-sm font-bold transition-all
                                    ${formData.schemaType === type ? 'border-primary bg-primary/5 text-white' : 'border-white/10 text-muted-foreground hover:bg-white/5'}`}>
                                    <input type="radio" name="schemaType" value={type} checked={formData.schemaType === type}
                                        onChange={() => handleChange("schemaType", type)} className="accent-primary" />
                                    {type}
                                </label>
                            ))}
                        </div>

                        {formData.schemaType !== "None" && (
                            <div className="p-4 bg-black/30 rounded-xl border border-white/5">
                                <p className="text-xs text-muted-foreground mb-2 font-bold uppercase tracking-wider">Generated JSON-LD Schema</p>
                                <pre className="text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
{JSON.stringify({
    "@context": "https://schema.org",
    "@type": formData.schemaType,
    "name": formData.metaTitle || "Rana Edits",
    "url": formData.canonicalUrl || "https://ranaedits.site",
    "description": formData.metaDesc || "",
    ...(formData.ogImage ? { "image": formData.ogImage } : {}),
}, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>

                    {/* Custom Scripts */}
                    <div className="p-6 border border-white/10 rounded-xl bg-card/50 space-y-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Code2 className="w-5 h-5 text-yellow-500" /> Custom Header Scripts
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Add Google Analytics, Facebook Pixel, or any custom JavaScript to the <code className="text-primary">&lt;head&gt;</code> of your site.
                        </p>
                        <Textarea
                            value={formData.scripts}
                            onChange={(e) => handleChange("scripts", e.target.value)}
                            placeholder={`<!-- Google Analytics -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>`}
                            className="h-40 font-mono text-xs"
                        />
                        <div className="flex items-start gap-2 text-xs text-yellow-500/80">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>Be careful! Incorrectly formatted scripts may break your website.</span>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Sticky Save Bar */}
            <div className="sticky bottom-4 z-10 flex justify-end p-4 mt-8 bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
                <Button type="submit" disabled={loading} size="lg" className="min-w-[180px] font-bold">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-5 w-5" />
                            Save SEO Settings
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}
