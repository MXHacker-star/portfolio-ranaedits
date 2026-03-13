"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { useState, useMemo } from "react"
import { useTranslation } from "@/lib/i18n"

interface ClientReview {
    id: string
    clientName: string
    companyName: string | null
    reviewText: string
    rating: number
    avatarUrl: string | null
    category?: string | null
}

interface ClientReviewMarqueeProps {
    reviews: ClientReview[]
}

function ReviewCard({ review }: { review: ClientReview }) {
    return (
        <div className="w-[350px] md:w-[450px] flex-shrink-0 bg-secondary/20 border border-white/5 p-8 rounded-2xl backdrop-blur-sm relative group hover:border-primary/50 transition-colors">
            <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20 group-hover:text-primary/40 transition-colors" />

            <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "text-primary fill-primary" : "text-muted-foreground/20"}`}
                    />
                ))}
            </div>

            <p className="text-lg text-muted-foreground mb-6 line-clamp-4 leading-relaxed">
                &ldquo;{review.reviewText}&rdquo;
            </p>

            <div className="flex items-center gap-4">
                {review.avatarUrl ? (
                    <img
                        src={review.avatarUrl}
                        alt={review.clientName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                    />
                ) : (
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl border-2 border-primary/20">
                        {review.clientName.charAt(0)}
                    </div>
                )}
                <div>
                    <h4 className="font-bold text-foreground">{review.clientName}</h4>
                    {review.companyName && (
                        <p className="text-sm text-primary">{review.companyName}</p>
                    )}
                </div>
            </div>

            {review.category && (
                <div className="mt-4">
                    <span className="inline-flex px-2.5 py-1 rounded-full bg-white/5 text-muted-foreground text-xs font-medium border border-white/10">
                        {review.category}
                    </span>
                </div>
            )}
        </div>
    )
}

export function ClientReviewMarquee({ reviews = [] }: ClientReviewMarqueeProps) {
    const { t } = useTranslation()
    const [filter, setFilter] = useState<'all' | '5' | '4+'>('all')

    if (reviews.length === 0) return null

    // Apply star filter
    const activeReviews = useMemo(() => {
        if (filter === '5') return reviews.filter(r => r.rating === 5)
        if (filter === '4+') return reviews.filter(r => r.rating >= 4)
        return reviews
    }, [filter, reviews])

    // If filter results in 0, fallback to all
    const finalReviews = activeReviews.length > 0 ? activeReviews : reviews

    // Ensure enough cards for smooth marquee — need at least 8 items
    let baseItems = [...finalReviews]
    while (baseItems.length < 8) {
        baseItems = [...baseItems, ...finalReviews]
    }
    const marqueeReviews = [...baseItems, ...baseItems]

    // Adjust speed based on number of unique items (more items = slower)
    const duration = Math.max(30, finalReviews.length * 10)

    // Split title for styling
    const titleWords = t.clientReviews.title.split(' ')
    const firstWord = titleWords[0]
    const restWords = titleWords.slice(1).join(' ')

    return (
        <section className="py-24 bg-background overflow-hidden relative">
            <div className="container mx-auto px-4 mb-12">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
                        {firstWord} <span className="text-primary">{restWords}</span>
                    </h2>
                </div>

                {/* Star Rating Filter */}
                <div className="flex justify-center gap-2">
                    {[
                        { key: 'all' as const, label: 'All Reviews', count: reviews.length },
                        { key: '5' as const, label: '5 Stars', count: reviews.filter(r => r.rating === 5).length },
                        { key: '4+' as const, label: '4+ Stars', count: reviews.filter(r => r.rating >= 4).length },
                    ].map(({ key, label, count }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`
                                px-4 py-2 rounded-full text-sm font-medium transition-all border
                                ${filter === key
                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                    : 'bg-white/5 text-muted-foreground border-white/10 hover:border-white/20 hover:text-white'
                                }
                            `}
                        >
                            {key !== 'all' && <Star className="w-3.5 h-3.5 inline-block mr-1 fill-current" />}
                            {label}
                            <span className="ml-1.5 opacity-60">({count})</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Scrolling Marquee — always a slider */}
            <div className="relative w-full overflow-hidden mask-linear-gradient">
                <motion.div
                    key={filter}
                    className="flex gap-6 w-max"
                    initial={{ x: "0%" }}
                    animate={{ x: "-50%" }}
                    transition={{
                        ease: "linear",
                        duration: duration,
                        repeat: Infinity,
                        repeatType: "loop",
                    }}
                >
                    {marqueeReviews.map((review, index) => (
                        <ReviewCard key={`${review.id}-${filter}-${index}`} review={review} />
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
