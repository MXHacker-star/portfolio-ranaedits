import { GraphicProjectForm } from "@/components/admin/GraphicProjectForm"
import { getCategories } from "@/actions/categories"

export default async function NewGraphicProjectPage() {
    const allCategories = await getCategories()
    const graphicCategories = allCategories.filter(c => c.type === 'graphic')

    return (
        <div className="space-y-8">
            <GraphicProjectForm categories={graphicCategories} />
        </div>
    )
}
