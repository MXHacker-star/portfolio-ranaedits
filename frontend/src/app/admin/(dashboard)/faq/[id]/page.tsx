import { FAQForm } from "@/components/admin/FAQForm"
import { getFAQ } from "@/actions/faq"

export default async function EditFAQPage({ params }: { params: { id: string } }) {
    const faq = await getFAQ(params.id)

    if (!faq) {
        return <div>FAQ not found</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Edit FAQ</h1>
                <p className="text-muted-foreground">Update question details.</p>
            </div>
            <FAQForm initialData={faq} />
        </div>
    )
}
