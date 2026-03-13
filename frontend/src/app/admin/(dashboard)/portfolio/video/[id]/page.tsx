import { VideoProjectForm } from "@/components/admin/VideoProjectForm"
import { getVideoProject } from "@/actions/video-projects"
import { getCategories } from "@/actions/categories"

export default async function EditVideoProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const project = await getVideoProject(id)
    const categories = await getCategories()
    const videoCategories = categories.filter(c => c.type === 'video')

    if (!project) {
        return <div>Project not found</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Edit Video Project</h1>
                <p className="text-muted-foreground">Update video project details.</p>
            </div>
            <VideoProjectForm initialData={project} categories={videoCategories} />
        </div>
    )
}
