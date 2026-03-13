"use client"

import { StatForm } from "@/components/admin/StatForm"
import { useSearchParams } from "next/navigation"

export default function NewStatPage() {
    const searchParams = useSearchParams()
    const section = searchParams.get("section") || "results"

    const sectionLabels: Record<string, string> = {
        results: "Business Results",
        about: "About Me",
        results_page: "Results Page",
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">New Stat</h1>
                <p className="text-muted-foreground">
                    Add a new metric to the <span className="text-white font-medium">{sectionLabels[section] || section}</span> section.
                </p>
            </div>
            <StatForm defaultSection={section} />
        </div>
    )
}
