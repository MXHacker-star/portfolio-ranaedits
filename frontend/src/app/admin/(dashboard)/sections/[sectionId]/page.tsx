import { SectionForm } from "@/components/admin/SectionForm"
import { getSectionContent } from "@/actions/admin-modules"

export default async function EditSectionPage({ params }: { params: Promise<{ sectionId: string }> }) {
    const { sectionId } = await params
    const sectionData = await getSectionContent(sectionId)
    // Convert sectionId to title case for display
    const sectionName = sectionId.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Edit: {sectionName}</h1>
                <p className="text-muted-foreground">Update content for this section.</p>
            </div>
            <SectionForm sectionId={sectionId} initialData={sectionData} />
        </div>
    )
}
