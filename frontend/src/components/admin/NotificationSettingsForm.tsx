"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateNotificationSettings, sendTestEmail } from "@/actions/notifications"
import { toast } from "sonner"
import { Save, Send, Loader2, Eye, EyeOff } from "lucide-react"

// All form types
const ALL_FORM_TYPES = [
    { key: "consultancy", label: "🗓️ Consultancy Booking" },
    { key: "proposal", label: "📋 Project Proposal" },
    { key: "package", label: "📦 Package Inquiry" },
    { key: "video-project", label: "🎬 Video Project" },
    { key: "graphic-project", label: "🎨 Graphic Design" },
    { key: "contact", label: "📧 Contact Form" },
    { key: "terminal", label: "💻 Terminal Form" },
]

interface NotificationSettingsFormProps {
    settings: {
        id: number
        emailEnabled: boolean
        smtpHost: string | null
        smtpPort: number
        smtpUser: string | null
        smtpPass: string | null
        adminEmail: string | null
        enabledForms: any
        updatedAt: Date
    } | null
}

export function NotificationSettingsForm({ settings }: NotificationSettingsFormProps) {
    const [saving, setSaving] = useState(false)
    const [testing, setTesting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    // Form state
    const [emailEnabled, setEmailEnabled] = useState(settings?.emailEnabled ?? false)
    const [smtpHost, setSmtpHost] = useState(settings?.smtpHost ?? "")
    const [smtpPort, setSmtpPort] = useState(settings?.smtpPort ?? 587)
    const [smtpUser, setSmtpUser] = useState(settings?.smtpUser ?? "")
    const [smtpPass, setSmtpPass] = useState(settings?.smtpPass ?? "")
    const [adminEmail, setAdminEmail] = useState(settings?.adminEmail ?? "")
    const [enabledForms, setEnabledForms] = useState<string[]>(
        Array.isArray(settings?.enabledForms) ? settings.enabledForms : ALL_FORM_TYPES.map(f => f.key)
    )

    const toggleForm = (key: string) => {
        setEnabledForms(prev =>
            prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]
        )
    }

    const handleSave = async () => {
        setSaving(true)
        const result = await updateNotificationSettings({
            emailEnabled,
            smtpHost,
            smtpPort,
            smtpUser,
            smtpPass,
            adminEmail,
            enabledForms,
        })
        setSaving(false)

        if (result.success) {
            toast.success("Settings saved successfully!")
        } else {
            toast.error("Failed to save settings")
        }
    }

    const handleTestEmail = async () => {
        setTesting(true)
        const result = await sendTestEmail()
        setTesting(false)

        if (result.success) {
            toast.success("Test email sent! Check your inbox.")
        } else {
            toast.error(result.error || "Failed to send test email")
        }
    }

    return (
        <div className="space-y-8">
            {/* Master Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/50 border border-white/10">
                <div>
                    <p className="font-semibold text-white">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                        {emailEnabled ? "Active — emails sent on new submissions" : "Disabled — no emails will be sent"}
                    </p>
                </div>
                <button
                    onClick={() => setEmailEnabled(!emailEnabled)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${emailEnabled ? "bg-green-500" : "bg-zinc-700"}`}
                >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${emailEnabled ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
            </div>

            {/* SMTP Configuration */}
            <div className={`space-y-4 transition-opacity ${emailEnabled ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">SMTP Configuration</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs uppercase">SMTP Host</Label>
                        <Input
                            value={smtpHost}
                            onChange={(e) => setSmtpHost(e.target.value)}
                            placeholder="smtp.gmail.com"
                            className="bg-zinc-800/50 border-white/10 text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs uppercase">SMTP Port</Label>
                        <Input
                            type="number"
                            value={smtpPort}
                            onChange={(e) => setSmtpPort(parseInt(e.target.value) || 587)}
                            placeholder="587"
                            className="bg-zinc-800/50 border-white/10 text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs uppercase">SMTP Username / Email</Label>
                        <Input
                            value={smtpUser}
                            onChange={(e) => setSmtpUser(e.target.value)}
                            placeholder="your-email@gmail.com"
                            className="bg-zinc-800/50 border-white/10 text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs uppercase">SMTP Password / App Password</Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={smtpPass}
                                onChange={(e) => setSmtpPass(e.target.value)}
                                placeholder="••••••••••••"
                                className="bg-zinc-800/50 border-white/10 text-white pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase">Admin Email (receives notifications)</Label>
                    <Input
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@yoursite.com"
                        className="bg-zinc-800/50 border-white/10 text-white max-w-md"
                    />
                </div>

                {/* Per-Form Toggles */}
                <div className="space-y-3 mt-6">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Form Notifications</h3>
                    <p className="text-xs text-muted-foreground">Choose which form types trigger email notifications.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {ALL_FORM_TYPES.map((form) => {
                            const isEnabled = enabledForms.includes(form.key)
                            return (
                                <button
                                    key={form.key}
                                    onClick={() => toggleForm(form.key)}
                                    className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all text-sm ${isEnabled
                                            ? "border-green-500/50 bg-green-500/10 text-white"
                                            : "border-white/10 bg-zinc-900/50 text-zinc-500"
                                        }`}
                                >
                                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${isEnabled ? "border-green-500 bg-green-500" : "border-zinc-600"
                                        }`}>
                                        {isEnabled && (
                                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <span>{form.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                    <Button onClick={handleSave} disabled={saving} className="gap-2">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? "Saving..." : "Save Settings"}
                    </Button>
                    <Button onClick={handleTestEmail} variant="outline" disabled={testing || !emailEnabled} className="gap-2 border-white/10 text-white hover:bg-white/10">
                        {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {testing ? "Sending..." : "Send Test Email"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
