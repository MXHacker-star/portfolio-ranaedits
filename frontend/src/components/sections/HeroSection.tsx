"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Play } from "lucide-react"

import { useTranslation } from "@/lib/i18n"
import { useContactModal } from "@/lib/stores/useContactModal"

interface HeroSectionProps {
    data: {
        heading: string
        subheading: string
        videoUrl: string | null
        buttonText: string
        buttonLink: string
        overlayOpacity: number
    } | null
}

export function HeroSection({ data }: HeroSectionProps) {
    const { t, language } = useTranslation()
    const { openModal } = useContactModal()
    // DB data with i18n fallbacks — admin overrides take priority
    const heading = data?.heading || t.hero.heading
    const subheading = data?.subheading || t.hero.subtitle
    const videoUrl = data?.videoUrl || "https://www.youtube.com/watch?v=8DFdnb8DSzA"
    const buttonText = data?.buttonText || (t as any).hero.viewShowreel || "View Showreel"
    const buttonLink = data?.buttonLink || "#showreel"
    const overlayOpacity = data?.overlayOpacity ?? 40



    // Extract video ID if full URL is provided for embedding
    const getVideoId = (url: string) => {
        if (!url) return null;
        if (url.length === 11 && !url.includes('/') && !url.includes('?')) return url;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        const match = url.match(regExp)
        return (match && match[2].length === 11) ? match[2] : null
    }

    const videoId = getVideoId(videoUrl) || "ScMzIvxBSi4"
    const isYouTube = videoUrl.includes("youtube") || videoUrl.includes("youtu.be")

    // Construct embed URL specifically for background use
    const embedUrl = isYouTube
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&modestbranding=1&start=0&end=30`
        : videoUrl

    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-16">
            {/* Background with overlay */}
            <div className="absolute inset-0 z-0 bg-background">
                {/* Gradient Overlay — bottom fade effect (do not change) */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background z-10" />

                <div className="absolute inset-0 h-full w-full overflow-hidden">
                    <iframe
                        className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ opacity: (100 - overlayOpacity) / 100 }}
                        src={embedUrl}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </div>

            <div className="container relative z-20 flex flex-col items-center px-4 text-center md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 max-w-3xl"
                >
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                        {heading}
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8 max-w-2xl"
                >
                    <p className="text-lg text-muted-foreground sm:text-xl">
                        {subheading}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col gap-4 sm:flex-row"
                >
                    <Button size="lg" className="min-w-[200px] text-base" onClick={() => openModal({ source: 'Hero Section', type: 'consultancy' })}>
                        {(t as any).hero.consultancy || "Free 30m Consultancy"}
                    </Button>
                    <Button size="lg" variant="ghost" className="group min-w-[200px] text-base text-muted-foreground hover:text-foreground" asChild>
                        <a
                            href="#showreel"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('showreel')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }}
                        >
                            <Play className="mr-2 h-4 w-4 transition-transform group-hover:scale-125 text-primary" />
                            {(t as any).hero.viewShowreel || "Watch Showreel"}
                        </a>
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}
