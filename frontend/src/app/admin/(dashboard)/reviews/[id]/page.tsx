import { ReviewForm } from "@/components/admin/ReviewForm"
import prisma from "@/lib/prisma"

export default async function ReviewEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params
    let review = null

    if (resolvedParams.id !== "new") {
        review = await prisma.clientReview.findUnique({
            where: { id: resolvedParams.id }
        })
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
                        {review ? "Edit Review" : "Add Review"}
                    </h1>
                </div>
            </div>

            <ReviewForm review={review} />
        </div>
    )
}
