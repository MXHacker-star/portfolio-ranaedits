import { getGlobalSettings } from "@/actions/settings"
import { getSocialLinks } from "@/actions/socials"
import { SettingsForm } from "@/components/admin/SettingsForm"

export default async function SettingsPage() {
    const settings = await getGlobalSettings()

    // Fetch dynamic social links
    const socialLinksRes = await getSocialLinks()
    const socialLinks = socialLinksRes.success ? socialLinksRes.data || [] : []

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Global Settings</h1>
                    <p className="text-muted-foreground">Manage your site identity, contact info, and key links.</p>
                </div>
            </div>

            <SettingsForm initialSettings={settings} socialLinks={socialLinks} />
        </div>
    )
}
