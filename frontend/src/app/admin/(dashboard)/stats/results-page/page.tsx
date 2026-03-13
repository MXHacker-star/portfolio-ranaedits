import { FileText, Trophy } from "lucide-react"
import { getStatsBySection } from "@/actions/sections"
import { getAllCaseStudies, getResultsPageContent } from "@/actions/results-page"
import {
    ResultsPageContentEditor,
    ResultsPageStatsManager,
    CaseStudiesManager
} from "@/components/admin/ResultsPageEditor"

export default async function ResultsPageAdmin() {
    const [content, stats, caseStudies] = await Promise.all([
        getResultsPageContent(),
        getStatsBySection('results_page'),
        getAllCaseStudies(),
    ])

    return (
        <div className="space-y-8">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Results Page</h1>
                </div>
                <p className="text-muted-foreground ml-[52px]">
                    Full control over <span className="text-white font-medium">/results</span> — hero, stats, case studies & CTA.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Left column — Content */}
                <div className="space-y-6">
                    <ResultsPageContentEditor content={content} />
                </div>

                {/* Right column — Stats & Case Studies */}
                <div className="space-y-6">
                    <ResultsPageStatsManager stats={stats} />
                    <CaseStudiesManager caseStudies={caseStudies} />
                </div>
            </div>
        </div>
    )
}
