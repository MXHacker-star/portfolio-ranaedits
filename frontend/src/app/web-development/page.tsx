import { getWebProjects } from "@/actions/web-projects";
import { getCategories } from "@/actions/categories";

import { WebDevelopmentContent } from "./content";

export const dynamic = 'force-dynamic';

export default async function WebDevelopmentPage() {
    // Fetch web projects from DB
    const projects = await getWebProjects()

    // Get categories from DB
    const allCategories = await getCategories()
    const webCategories = allCategories
        .filter(c => c.type === 'web')
        .map(c => c.name)

    return (
        <WebDevelopmentContent
            projects={projects}
            webCategories={webCategories}
        />
    );
}
