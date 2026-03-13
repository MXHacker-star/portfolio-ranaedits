import { ServiceForm } from "@/components/admin/ServiceForm"
import { getService } from "@/actions/services"

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const service = await getService(id)

    if (!service) {
        return <div>Service not found</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Edit Service</h1>
                <p className="text-muted-foreground">Update the details of this service.</p>
            </div>
            <ServiceForm initialData={service} />
        </div>
    )
}
