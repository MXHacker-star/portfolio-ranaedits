import { WebProjectList } from "@/components/admin/WebProjectList"
import { getWebProjects } from "@/actions/web-projects"
import { getCategories } from "@/actions/categories"

export default async function WebProjectsPage() {
    const projects = await getWebProjects()
    const allCategories = await getCategories()
    const webCategories = allCategories.filter(c => c.type === 'web')

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Web Development</h1>
                <p className="text-muted-foreground">Manage your web development portfolio items.</p>
            </div>

            <WebProjectList initialProjects={projects} categories={webCategories} />
        </div>
    )
}
