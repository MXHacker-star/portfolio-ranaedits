import { TeamForm } from "@/components/admin/TeamForm"

export default function NewTeamMemberPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Add Team Member</h1>
                <p className="text-muted-foreground">Add a new member to your team.</p>
            </div>
            <TeamForm />
        </div>
    )
}
