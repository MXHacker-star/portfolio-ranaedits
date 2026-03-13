import { PackageForm } from "@/components/admin/PackageForm"

export default function NewPackagePage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">New Package</h1>
                <p className="text-muted-foreground">Add a new pricing package.</p>
            </div>
            <PackageForm />
        </div>
    )
}
