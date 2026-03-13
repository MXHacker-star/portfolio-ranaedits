import { CategoryForm } from "@/components/admin/CategoryForm"

export default function NewCategoryPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Add Category</h1>
                <p className="text-muted-foreground">Create a new portfolio category.</p>
            </div>
            <CategoryForm />
        </div>
    )
}
