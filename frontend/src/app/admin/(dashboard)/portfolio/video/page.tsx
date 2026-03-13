import { VideoProjectList } from "@/components/admin/VideoProjectList"
import { getVideoProjects } from "@/actions/video-projects"
import { getCategories } from "@/actions/categories"

export default async function VideoPortfolioPage() {
    const projects = await getVideoProjects()
    const categories = await getCategories()

    // Filter categories to only show "video" type
    const videoCategories = categories.filter(c => c.type === 'video')

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Video Projects</h1>
                <p className="text-muted-foreground">Manage your video portfolio items.</p>
            </div>

            <VideoProjectList initialProjects={projects} categories={videoCategories} />
        </div>
    )
}
