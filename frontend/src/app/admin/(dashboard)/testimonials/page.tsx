import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, PlayCircle } from "lucide-react"
import { getTestimonials, deleteTestimonial } from "@/actions/testimonials"

export default async function TestimonialsPage() {
    const testimonials = await getTestimonials()

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Video Testimonials</h1>
                    <p className="text-muted-foreground">Manage "Success Stories" video clips.</p>
                </div>
                <Link href="/admin/testimonials/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Testimonial
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.length === 0 ? (
                    <div className="col-span-full text-center p-8 text-muted-foreground bg-card rounded-xl border border-white/10">
                        No testimonials found. Add your success stories.
                    </div>
                ) : (
                    testimonials.map((t) => (
                        <div key={t.id} className="bg-card border border-white/10 rounded-xl p-6 relative group">
                            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <Link href={`/admin/testimonials/${t.id}`}>
                                    <Button variant="secondary" size="icon" className="h-8 w-8">
                                        <Pencil className="h-3 w-3" />
                                    </Button>
                                </Link>
                                <form action={async () => {
                                    "use server"
                                    await deleteTestimonial(t.id)
                                }}>
                                    <Button variant="destructive" size="icon" className="h-8 w-8">
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </form>
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-primary/10 rounded-full text-primary">
                                    <PlayCircle className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{t.name}</h3>
                                    <p className="text-xs text-muted-foreground">{t.role}</p>
                                </div>
                            </div>

                            {t.videoUrl && (
                                <div className="text-xs text-muted-foreground mb-2 truncate">
                                    {t.videoUrl}
                                </div>
                            )}

                            <div className="text-xl font-bold text-primary">
                                {t.content || "No Result Text"}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
