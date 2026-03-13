import { TestimonialForm } from "@/components/admin/TestimonialForm"

export default function NewTestimonialPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Add Testimonial</h1>
                <p className="text-muted-foreground">Add a new video success story.</p>
            </div>
            <TestimonialForm />
        </div>
    )
}
