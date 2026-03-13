import { WebProjectForm } from "@/components/admin/WebProjectForm"
import { getCategories } from "@/actions/categories"

export default async function NewWebProjectPage() {
    const allCategories = await getCategories()
    const webCategories = allCategories.filter(c => c.type === 'web')

    return <WebProjectForm categories={webCategories} />
}
