import { GraphicProjectForm } from "@/components/admin/GraphicProjectForm"
import { getGraphicProject } from "@/actions/graphic-projects"
import { getCategories } from "@/actions/categories"
import { notFound } from "next/navigation"

export default async function EditGraphicProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const project = await getGraphicProject(id)
    const allCategories = await getCategories()
    const graphicCategories = allCategories.filter(c => c.type === 'graphic')

    if (!project) {
        notFound()
    }

    return (
        <div className="space-y-8">
            <GraphicProjectForm initialData={project} categories={graphicCategories} />
        </div>
    )
}
