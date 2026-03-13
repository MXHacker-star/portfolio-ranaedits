"use client"

import { Card } from "@/components/ui/card"
import { motion, useAnimationControls } from "framer-motion"
import { VideoPlayer } from "@/components/ui/VideoPlayer"
import { useEffect, useState } from "react"
import { useTranslation } from "@/lib/i18n"

interface VideoItem {
    id: string
    title: string
    mediaUrl: string
    category?: string | null
    subCategory?: string | null
}

interface TestimonialsSectionProps {
    videos?: VideoItem[]
}

const getVideoId = (url: string | null) => {
    if (!url) return "dQw4w9WgXcQ"; // Rick Roll default
    // If it's already an 11-character raw YouTube ID, just return it
    if (url.length === 11 && !url.includes('/') && !url.includes('?')) {
        return url;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : "dQw4w9WgXcQ"
}

export function TestimonialsSection({ videos = [] }: TestimonialsSectionProps) {
    const { t, language } = useTranslation();
    const [isPaused, setIsPaused] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    // Fallback data
    const originalTestimonials = [
        { name: "Alex Hormozi Style", result: "2M Views", youtubeId: "dQw4w9WgXcQ" },
        { name: "Iman Gadzhi Style", result: "500k Views", youtubeId: "ScMzIvxBSi4" },
        { name: "Grant Cardone Style", result: "1M Views", youtubeId: "jNQXAC9IVRw" },
        { name: "Viral Podcast Clip", result: "3.5M Views", youtubeId: "L_jWHffIx5E" },
        { name: "Educational Reel", result: "800k Views", youtubeId: "9bZkp7q19f0" },
    ]

    // ====================================================================
    // Dynamic Data Mapping
    // ====================================================================
    if (!videos || videos.length === 0) {
        return null; // Auto-hide section if there are zero success stories featured
    }

    const displayItems = videos.map(v => ({
        name: v.title,
        result: v.subCategory || v.category || "Success Story",
        youtubeId: getVideoId(v.mediaUrl)
    }))

    // Dynamic Duplication for infinite marquee effect.
    // CSS marquees break if the total width is less than the screen width.
    // We ensure there are always at least enough items to cover a 4K screen twice.
    let baseItems = [...displayItems];
    while (baseItems.length < 8) {
        baseItems = [...baseItems, ...displayItems];
    }
    // Final array should be perfectly doubled for smooth looping
    const marqueeItems = [...baseItems, ...baseItems];

    // Splitting logic: First word white, rest primary? Or just First word white, rest primary.
    // "Client Love" -> "Client" (White), "Love" (Primary)
    // "Success Stories" -> "Success" (White) "Stories" (Primary)
    const titleWords = t.testimonials.title.split(' ');
    const firstWord = titleWords[0];
    const restWords = titleWords.slice(1).join(' ');

    return (
        <section id="success-stories" className="py-20 bg-background text-foreground overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black tracking-tighter sm:text-3xl md:text-5xl uppercase">
                        {firstWord} <span className="text-primary">{restWords}</span>
                    </h2>
                    <p className="mt-4 text-muted-foreground text-lg">
                        {t.testimonials.subtitle}
                    </p>
                </div>
            </div>

            {/* Marquee Container */}
            <div
                className="relative w-full flex overflow-hidden group"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => {
                    setIsPaused(false)
                    setHoveredIndex(null)
                }}
            >
                <div className={`flex gap-6 animate-marquee ${isPaused ? 'paused' : ''}`}>
                    {marqueeItems.map((testimonial, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-[220px] md:w-[250px] cursor-pointer"
                            onMouseEnter={() => {
                                setHoveredIndex(index)
                                setIsPaused(true)
                            }}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <Card className="overflow-hidden bg-card/20 border-primary/10 transition-colors group relative hover:border-primary/50">
                                <div className="aspect-[9/16] relative bg-black">
                                    <VideoPlayer
                                        videoId={testimonial.youtubeId}
                                        title={testimonial.name}
                                        isActive={hoveredIndex === index}
                                    />

                                    {/* Info Reveal Overlay on Hover */}
                                    <div className={`absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center transition-opacity duration-300 pointer-events-none z-20 ${hoveredIndex === index ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                                        <h3 className="text-xl font-bold text-white mb-2">{testimonial.name}</h3>
                                        <p className="text-primary font-bold text-2xl">{testimonial.result}</p>
                                        <p className="text-sm text-gray-300 mt-2">Hover to watch</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
