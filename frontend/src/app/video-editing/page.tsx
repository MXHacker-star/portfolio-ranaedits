import { getPortfolioItems } from "@/actions/portfolio";
import { getCategories } from "@/actions/categories";

import { VideoProjectsContent } from "./content";

export const dynamic = 'force-dynamic';

export default async function VideoProjectsPage() {
    // Fetch items (Video Editing)
    const videoItems = await getPortfolioItems("Video Editing");

    // Split into Horizontal and Vertical
    const horizontalItems = videoItems.filter((item: any) => !item.orientation || item.orientation === "horizontal");
    const verticalItems = videoItems.filter((item: any) => item.orientation === "vertical");

    // Get categories from DB instead of hardcoded list
    const allCategories = await getCategories()
    const videoCategories = allCategories
        .filter(c => c.type === 'video')
        .map(c => c.name)

    return (
        <VideoProjectsContent
            horizontalItems={horizontalItems}
            verticalItems={verticalItems}
            videoCategories={videoCategories}
        />
    );
}
