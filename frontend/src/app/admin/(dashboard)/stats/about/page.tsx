import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, User } from "lucide-react"
import { getStats, deleteStat, getSectionContent } from "@/actions/admin-modules"
import { AboutContentEditor } from "@/components/admin/AboutContentEditor"

export default async function AboutMeStatsPage() {
    const allStats = await getStats()
    const stats = allStats.filter((s: any) => s.section === 'about')
    const content = await getSectionContent('about')

    return (
        <div className="space-y-8">
            <AboutContentEditor initialContent={content} />

            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-400" />
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-white">About Me Stats</h1>
                    </div>
                    <p className="text-muted-foreground ml-[52px]">Stat cards displayed in the About Me section (max 4).</p>
                </div>
                <Link href="/admin/stats/new?section=about">
                    <Button className="gap-2" disabled={stats.length >= 4}>
                        <Plus className="h-4 w-4" />
                        Add Stat
                    </Button>
                </Link>
            </div>

            {stats.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-blue-500/5 border border-blue-500/10 rounded-lg px-4 py-2">
                    <span className="font-bold text-blue-400">{stats.length}/4</span> stat cards used — The About Me section displays up to 4 cards with unique styles.
                </div>
            )}

            {stats.length === 0 ? (
                <div className="text-center p-12 text-muted-foreground bg-card/50 rounded-2xl border border-dashed border-white/10">
                    <User className="h-12 w-12 mx-auto mb-4 text-white/10" />
                    <p className="text-lg font-medium text-white/40">No stats yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Using default values (3+, 100+, 50M+, 24/7). Add custom stats to override.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stats.map((stat: any, index: number) => {
                        const cardColors = [
                            'border-white/10',
                            'border-primary/20 bg-primary/5',
                            'border-white/20 bg-white/5',
                            'border-blue-500/20 bg-blue-500/5',
                        ]
                        return (
                            <div key={stat.id} className={`group relative bg-card/40 backdrop-blur-sm border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 ${cardColors[index] || cardColors[0]}`}>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                    <span className="bg-white/5 border border-white/10 rounded-full px-2 py-0.5 font-mono">Card {index + 1}</span>
                                </div>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
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
                        )
                    })}
                </div>
            )}
        </div>
    )
}
