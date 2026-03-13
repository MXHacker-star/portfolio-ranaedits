import { TeamForm } from "@/components/admin/TeamForm"
import { getTeamMember } from "@/actions/team"

export default async function EditTeamMemberPage({ params }: { params: { id: string } }) {
    const member = await getTeamMember(params.id)

    if (!member) {
        return <div>Team member not found</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Edit Team Member</h1>
                <p className="text-muted-foreground">Update team member details.</p>
            </div>
            <TeamForm initialData={member} />
        </div>
    )
}
