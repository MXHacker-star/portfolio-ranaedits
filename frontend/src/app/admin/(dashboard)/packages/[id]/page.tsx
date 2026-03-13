import { PackageForm } from "@/components/admin/PackageForm"
import { getPackage } from "@/actions/admin-modules"
import { notFound } from "next/navigation"

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const pkg = await getPackage(id)

    if (!pkg) {
        notFound()
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Edit Package</h1>
                <p className="text-muted-foreground">Update package details.</p>
            </div>
            <PackageForm initialData={pkg} />
        </div>
    )
}
