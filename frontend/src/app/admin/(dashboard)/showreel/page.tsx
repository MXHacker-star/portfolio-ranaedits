import { ShowreelManager } from "@/components/admin/ShowreelManager"
import { getSectionContent } from "@/actions/admin-modules"
import { getVideoProjects } from "@/actions/video-projects"

export default async function AdminShowreelPage() {
    // 1. Fetch Showreel Section Content (for title/subtitle)
    const sectionData = await getSectionContent("showreel")

    // 2. Fetch All Video Projects (to select from)
    const allVideos = await getVideoProjects()

    // 3. Filter only videos (just in case)
    const videos = allVideos.filter(v => v.type === 'video')

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Showreel Management</h1>
                <p className="text-muted-foreground">Manage the homepage showreel section and featured videos.</p>
            </div>

            <ShowreelManager sectionData={sectionData} videos={videos} />
        </div>
    )
}
