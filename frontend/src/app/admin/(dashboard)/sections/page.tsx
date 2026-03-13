import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, LayoutTemplate } from "lucide-react"

const SECTIONS = [
    { id: "about", label: "About Section", desc: "Manage content for the homepage about section." },
    { id: "showreel", label: "Showreel Section", desc: "Update the main showreel title and video settings." },
    { id: "cta_main", label: "Main CTA", desc: "Main Call to Action used on various pages." },
    { id: "home_cta", label: "Home CTA", desc: "Call to Action at the bottom of the homepage." },
    { id: "video_cta", label: "Video Editing CTA", desc: "Call to Action on the Video Editing page." },
    { id: "graphic_cta", label: "Graphic Design CTA", desc: "Call to Action on the Graphic Design page." },
]

export default function SectionsManagerPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Section Content</h1>
                <p className="text-muted-foreground">Manage content for various sections of your site.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SECTIONS.map((section) => (
                    <Link key={section.id} href={`/admin/sections/${section.id}`} className="group relative overflow-hidden rounded-xl border border-white/10 bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white/5 rounded-lg text-primary">
                                <LayoutTemplate className="h-6 w-6" />
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{section.label}</h3>
                        <p className="text-muted-foreground text-sm">{section.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}
