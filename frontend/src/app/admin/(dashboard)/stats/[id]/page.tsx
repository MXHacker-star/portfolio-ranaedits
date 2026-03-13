import { StatForm } from "@/components/admin/StatForm"
import { getStat } from "@/actions/admin-modules"
import { notFound } from "next/navigation"

export default async function EditStatPage({ params }: { params: { id: string } }) {
    const stat = await getStat(params.id)

    if (!stat) {
        notFound()
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Edit Stat</h1>
                <p className="text-muted-foreground">Update business metric.</p>
            </div>
            <StatForm initialData={stat} />
        </div>
    )
}
