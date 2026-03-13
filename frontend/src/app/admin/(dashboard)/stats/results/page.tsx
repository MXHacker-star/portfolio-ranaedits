import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, TrendingUp } from "lucide-react"
import { getStats, deleteStat } from "@/actions/admin-modules"

export default async function BusinessResultsPage() {
    const allStats = await getStats()
    const stats = allStats.filter((s: any) => (s.section || 'results') === 'results')

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Business Results</h1>
                    </div>
                    <p className="text-muted-foreground ml-[52px]">Stats displayed in the homepage Results section.</p>
                </div>
                <Link href="/admin/stats/new?section=results">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Stat
                    </Button>
                </Link>
            </div>

            {stats.length === 0 ? (
                <div className="text-center p-12 text-muted-foreground bg-card/50 rounded-2xl border border-dashed border-white/10">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-white/10" />
                    <p className="text-lg font-medium text-white/40">No stats yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Add key metrics to show on the Business Results section.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stats.map((stat: any) => (
                        <div key={stat.id} className="group relative bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="text-4xl font-black text-primary mb-1">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${stat.visible ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                    {stat.visible ? 'Visible' : 'Hidden'}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                <Link href={`/admin/stats/${stat.id}`} className="flex-1">
                                    <Button variant="ghost" size="sm" className="w-full gap-2 text-muted-foreground hover:text-white">
                                        <Pencil className="h-3.5 w-3.5" />
                                        Edit
                                    </Button>
                                </Link>
                                <form action={async () => {
                                    "use server"
                                    await deleteStat(stat.id)
                                }}>
                                    <Button variant="ghost" size="sm" className="gap-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10">
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
