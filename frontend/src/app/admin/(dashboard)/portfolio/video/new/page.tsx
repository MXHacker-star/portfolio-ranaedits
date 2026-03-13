import { VideoProjectForm } from "@/components/admin/VideoProjectForm"
import { getCategories } from "@/actions/categories"

export default async function NewVideoProjectPage() {
    const categories = await getCategories()
    const videoCategories = categories.filter(c => c.type === 'video')

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Add Video Project</h1>
                <p className="text-muted-foreground">Add a new video to your portfolio.</p>
            </div>
            <VideoProjectForm categories={videoCategories} />
        </div>
    )
}
