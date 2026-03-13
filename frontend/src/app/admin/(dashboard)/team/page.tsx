import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, User } from "lucide-react"
import { getTeamMembers, deleteTeamMember } from "@/actions/team"

export default async function TeamPage() {
    const team = await getTeamMembers()

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Team Members</h1>
                    <p className="text-muted-foreground">Manage the team section on the homepage.</p>
                </div>
                <Link href="/admin/team/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Member
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {team.length === 0 ? (
                    <div className="col-span-full text-center p-8 text-muted-foreground bg-card rounded-xl border border-white/10">
                        No team members found. Add your team.
                    </div>
                ) : (
                    team.map((member) => (
                        <div key={member.id} className="bg-card border border-white/10 rounded-xl overflow-hidden relative group">
                            <div className="aspect-square relative">
                                <img src={member.imageUrl} alt={member.name} className="object-cover w-full h-full" />
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/admin/team/${member.id}`}>
                                        <Button variant="secondary" size="icon" className="h-8 w-8">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <form action={async () => {
                                        "use server"
                                        await deleteTeamMember(member.id)
                                    }}>
                                        <Button variant="destructive" size="icon" className="h-8 w-8">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </div>
                            </div>
                            <div className="p-4 text-center">
                                <h3 className="font-bold text-white text-lg">{member.name}</h3>
                                <p className="text-primary text-sm font-medium uppercase tracking-wide">{member.role}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
