import ResultsClient from "./ResultsClient"
import { getStatsBySection } from "@/actions/sections"
import { getCaseStudies, getResultsPageContent } from "@/actions/results-page"

export default async function ResultsPage() {
    const [stats, caseStudies, pageContent] = await Promise.all([
        getStatsBySection('results_page'),
        getCaseStudies(),
        getResultsPageContent(),
    ])

    return (
        <ResultsClient
            stats={stats}
            caseStudies={caseStudies}
            pageContent={pageContent}
        />
    )
}
