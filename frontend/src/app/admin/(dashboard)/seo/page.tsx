import { SEOForm } from "@/components/admin/SEOForm"
import { getSEOConfig } from "@/actions/admin-modules"

export default async function SEOManagerPage() {
    const seoConfig = await getSEOConfig()

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">SEO Settings</h1>
                <p className="text-muted-foreground">Manage global search engine optimization settings.</p>
            </div>
            <SEOForm initialData={seoConfig} />
        </div>
    )
}
