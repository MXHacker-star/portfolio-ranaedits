import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getGraphicProjects } from "@/actions/graphic-projects"
import { getCategories } from "@/actions/categories"
import { GraphicProjectList } from "@/components/admin/GraphicProjectList"

export default async function GraphicProjectsPage() {
    // Determine graphic type categories needed? 
    // Usually we filter categories by type="graphic"
    // Let's modify getCategories to accept type or filter here?
    // getCategories fetches all. We can filter in JS for now or update action.
    const allCategories = await getCategories()
    // Assuming backend action returns all. We want only graphic categories for the filter
    const graphicCategories = allCategories.filter(c => c.type === 'graphic')

    const projects = await getGraphicProjects()

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Graphic Design</h1>
                    <p className="text-muted-foreground">Manage your graphic design porfolio items.</p>
                </div>
                <Link href="/admin/portfolio/graphic/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Project
                    </Button>
                </Link>
            </div>

            <GraphicProjectList initialProjects={projects} categories={graphicCategories} />
        </div>
    )
}
