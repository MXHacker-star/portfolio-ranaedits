import { CategoryForm } from "@/components/admin/CategoryForm"
import { getCategory } from "@/actions/categories"

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
    const category = await getCategory(params.id)

    if (!category) {
        return <div>Category not found</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Edit Category</h1>
                <p className="text-muted-foreground">Update category details.</p>
            </div>
            <CategoryForm initialData={category} />
        </div>
    )
}
