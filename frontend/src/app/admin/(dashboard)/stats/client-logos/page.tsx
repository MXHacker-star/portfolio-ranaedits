import { getClientLogos } from "@/actions/client-logos"
import { getSectionContent } from "@/actions/admin-modules"
import { ClientLogoManager } from "@/components/admin/ClientLogoManager"
import { Building2 } from "lucide-react"

export default async function ClientLogosAdminPage() {
    const [logos, content] = await Promise.all([
        getClientLogos(),
        getSectionContent("client-logos")
    ])

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 mb-1">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-orange-400" />
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Client Logos</h1>
            </div>
            <p className="text-muted-foreground ml-[52px] -mt-6 mb-8">
                Manage the "Trusted By Top Brands" logo scrolling section on the homepage.
            </p>

            <ClientLogoManager
                initialContent={content}
                initialLogos={logos}
            />
        </div>
    )
}
