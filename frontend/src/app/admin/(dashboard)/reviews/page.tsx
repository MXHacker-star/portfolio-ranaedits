import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from "lucide-react"
import { getAllClientReviews, deleteClientReview } from "@/actions/client-reviews"

export default async function ReviewsManagerPage() {
    const reviews = await getAllClientReviews()
    const visibleCount = reviews.filter(r => r.visible).length

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Client Reviews</h1>
                    <p className="text-muted-foreground">
                        Manage testimonials for the homepage marquee.
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {visibleCount} visible / {reviews.length} total
                        </span>
                    </p>
                </div>
                <Link href="/admin/reviews/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Review
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review) => (
                    <div key={review.id} className={`p-6 rounded-xl border bg-card relative group transition-colors ${review.visible ? 'border-white/10 hover:border-primary/30' : 'border-yellow-500/20 bg-yellow-500/5'}`}>
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/admin/reviews/${review.id}`}>
                                <Button variant="secondary" size="icon" className="h-8 w-8">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </Link>
                            <form action={async () => {
                                "use server"
                                await deleteClientReview(review.id)
                            }}>
                                <Button variant="destructive" size="icon" className="h-8 w-8">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            {review.avatarUrl ? (
                                <img src={review.avatarUrl} alt={review.clientName} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {review.clientName[0]}
                                </div>
                            )}
                            <div>
                                <h3 className="font-bold text-white">{review.clientName}</h3>
                                <p className="text-xs text-muted-foreground">{review.companyName}</p>
                            </div>
                        </div>

                        <div className="flex text-primary mb-3">
                            {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                            {[...Array(5 - review.rating)].map((_, i) => (
                                <Star key={`e-${i}`} className="w-4 h-4 text-muted-foreground/20" />
                            ))}
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                            &ldquo;{review.reviewText}&rdquo;
                        </p>

                        <div className="flex items-center gap-2 flex-wrap">
                            {(review as any).category && (
                                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                                    {(review as any).category}
                                </span>
                            )}
                            {!review.visible && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold uppercase tracking-wider">
                                    <EyeOff className="w-3 h-3" /> Hidden
                                </span>
                            )}
                            <span className="text-xs text-muted-foreground/50 ml-auto">
                                Order: {review.order}
                            </span>
                        </div>
                    </div>
                ))}

                {reviews.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground bg-white/5 rounded-xl border border-white/10 border-dashed">
                        No reviews yet. Add one to get started!
                    </div>
                )}
            </div>
        </div>
    )
}
