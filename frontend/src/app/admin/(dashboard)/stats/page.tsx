import { redirect } from "next/navigation"

// Redirect /admin/stats → /admin/stats/results (landing sub-page)
export default function StatsPage() {
    redirect("/admin/stats/results")
}
