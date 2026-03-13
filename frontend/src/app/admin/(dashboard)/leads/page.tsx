import { getSubmissions, getSubmissionCounts } from "@/actions/leads"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Inbox } from "lucide-react"
import { LeadTable } from "@/components/admin/LeadTable"

export default async function LeadsPage() {
    const [submissions, counts] = await Promise.all([
        getSubmissions(),
        getSubmissionCounts(),
    ])

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Leads & Submissions</h2>
                <p className="text-muted-foreground">Manage all CTA form submissions and lead pipeline.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                    { label: "Total", value: counts.total, color: "text-white" },
                    { label: "New", value: counts.new, color: "text-blue-400" },
                    { label: "Contacted", value: counts.contacted, color: "text-yellow-400" },
                    { label: "Proposal", value: counts.proposal_sent, color: "text-purple-400" },
                    { label: "Accepted", value: counts.accepted, color: "text-green-400" },
                    { label: "Rejected", value: counts.rejected, color: "text-red-400" },
                    { label: "Completed", value: counts.completed, color: "text-emerald-400" },
                ].map((stat) => (
                    <Card key={stat.label} className="bg-card/50 backdrop-blur-sm border-white/10">
                        <CardContent className="p-4 text-center">
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Lead Table */}
            <Card className="bg-card/50 backdrop-blur-sm border-white/10">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                            <Inbox className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-white">All Submissions</CardTitle>
                            <CardDescription>Filter, manage, and track your leads.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <LeadTable initialSubmissions={submissions} />
                </CardContent>
            </Card>
        </div>
    )
}
