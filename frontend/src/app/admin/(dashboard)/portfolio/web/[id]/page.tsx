import { WebProjectForm } from "@/components/admin/WebProjectForm"
import { getWebProject } from "@/actions/web-projects"
import { getCategories } from "@/actions/categories"
import { notFound } from "next/navigation"

export default async function EditWebProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const project = await getWebProject(id)

    if (!project) {
        notFound()
    }

    const allCategories = await getCategories()
    const webCategories = allCategories.filter(c => c.type === 'web')

    return <WebProjectForm initialData={project} categories={webCategories} />
}
