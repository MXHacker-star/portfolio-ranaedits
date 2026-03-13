import { TestimonialForm } from "@/components/admin/TestimonialForm"
import { getTestimonial } from "@/actions/testimonials"

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
    const testimonial = await getTestimonial(params.id)

    if (!testimonial) {
        return <div>Testimonial not found</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Edit Testimonial</h1>
                <p className="text-muted-foreground">Update this success story.</p>
            </div>
            <TestimonialForm initialData={testimonial} />
        </div>
    )
}
