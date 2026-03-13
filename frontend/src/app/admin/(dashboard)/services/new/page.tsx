import { ServiceForm } from "@/components/admin/ServiceForm"

export default function NewServicePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Add New Service</h1>
                <p className="text-muted-foreground">Detail a service you provide to clients.</p>
            </div>
            <ServiceForm />
        </div>
    )
}
