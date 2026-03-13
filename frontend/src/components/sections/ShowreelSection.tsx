"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VideoPlayer } from "@/components/ui/VideoPlayer"
import { useTranslation } from "@/lib/i18n"

interface SectionContent {
    title: string | null;
    subtitle: string | null;
    content: string | null;
    mediaUrl: string | null;
    buttonText: string | null;
    buttonLink: string | null;
}

import Link from "next/link"

interface VideoItem {
    id: string;
    mediaUrl: string; // YouTube ID
    title: string;
}

interface ShowreelSectionProps {
    content?: SectionContent | null;
    videos?: VideoItem[];
}

export function ShowreelSection({ content, videos: dbVideos = [] }: ShowreelSectionProps) {
    const { t, language } = useTranslation()
    const [activeIndex, setActiveIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    const defaultVideosFixed = [
        { id: "1", mediaUrl: "ni5hRgV5dHg", title: "Cinematic Travel" },
        { id: "2", mediaUrl: "S5TQd7k9q-w", title: "Nature Aesthetics" },
        { id: "3", mediaUrl: "3j0J6q9g0g0", title: "Urban Night" },
        { id: "4", mediaUrl: "tG7tuqZJqAk", title: "Dynamic Motion" },
        { id: "5", mediaUrl: "pUPM2Qp-rYw", title: "Lifestyle" },
    ]

    // We need at least 5 elements to build the -2 to +2 perspective cards safely
    // If the user features 1-4 videos, we duplicate them so the slider doesn't look broken.
    let baseVideos = dbVideos.length > 0 ? dbVideos.map(v => ({
        ...v,
        youtubeId: v.mediaUrl
    })) : defaultVideosFixed.map(v => ({
        ...v,
        youtubeId: v.mediaUrl
    }));

    if (dbVideos.length > 0 && dbVideos.length < 5) {
        // Repeat the array until we have at least 5 videos
        const requiredMinimum = 5;
        let expandedVideos: typeof baseVideos = [];
        while (expandedVideos.length < requiredMinimum) {
            expandedVideos = [...expandedVideos, ...baseVideos];
        }
        baseVideos = expandedVideos;
    }

    const videos = baseVideos;

    // Auto-play effect
    useEffect(() => {
        if (isPaused) return
        const interval = setInterval(() => {
            setActiveIndex((prev) => prev + 1)
        }, 10000)
        return () => clearInterval(interval)
    }, [isPaused])

    const nextVideo = () => {
        setActiveIndex((prev) => prev + 1)
    }

    const prevVideo = () => {
        setActiveIndex((prev) => prev - 1)
    }

    // Render window: -2 to +2 (5 items)
    const renderWindow = [-2, -1, 0, 1, 2];

    // ====================================================================
    // DATA SOURCE: i18n translations only (DB data bypassed)
    // REASON: DB SectionContent may contain test data from api/seed route.
    // TO RE-ENABLE DB DATA: First clean up test data in DB, then change to:
    //   const displayTitle = content?.title || t.showreel.title;
    //   const displaySubtitle = content?.subtitle || t.showreel.subtitle;
    // ====================================================================
    const displayTitle = t.showreel.title;
    const displaySubtitle = t.showreel.subtitle;

    return (
        <section id="showreel" className="overflow-hidden py-10 bg-background text-foreground">
            <div className="container mx-auto px-4 text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    {displayTitle}
                </h2>
                <p className="mb-8 text-lg text-muted-foreground">
                    {displaySubtitle}
                </p>

                <div
                    className="relative mx-auto flex h-[450px] w-full max-w-[95vw] items-center justify-center perspective-1000"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* ... existing slider code ... */}
                    {/* Navigation Controls */}
                    <div className="absolute inset-0 z-50 flex items-center justify-between pointer-events-none px-4 md:px-12">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="pointer-events-auto h-12 w-12 rounded-full border border-border bg-background/50 hover:bg-primary hover:text-primary-foreground backdrop-blur-sm transition-all shadow-lg hover:scale-110"
                            onClick={prevVideo}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="pointer-events-auto h-12 w-12 rounded-full border border-border bg-background/50 hover:bg-primary hover:text-primary-foreground backdrop-blur-sm transition-all shadow-lg hover:scale-110"
                            onClick={nextVideo}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* Carousel Track */}
                    <div className="relative flex h-full w-full items-center justify-center">
                        <AnimatePresence mode="popLayout">
                            {renderWindow.map((offset) => {
                                const virtualIndex = activeIndex + offset;
                                const dataIndex = ((virtualIndex % videos.length) + videos.length) % videos.length;
                                const video = videos[dataIndex];

                                if (!video) return null; // Safe check

                                const isActive = offset === 0;
                                const isPrev = offset === -1;
                                const isNext = offset === 1;

                                // Increased sizes and spacing
                                let x = offset * 260; // Slightly reduced spacing
                                let scale = 0.85;
                                let opacity = 0.5;
                                let zIndex = 10;
                                let rotateY = offset * 12;

                                if (isActive) {
                                    x = 0;
                                    scale = 1.15;
                                    opacity = 1;
                                    zIndex = 30;
                                    rotateY = 0;
                                } else if (isPrev || isNext) {
                                    scale = 0.95;
                                    opacity = 0.7;
                                    zIndex = 20;
                                } else {
                                    scale = 0.8;
                                    opacity = 0.3;
                                    zIndex = 10;
                                }

                                return (
                                    <motion.div
                                        key={virtualIndex}
                                        className={`absolute flex aspect-[9/16] h-[340px] w-[200px] md:h-[400px] md:w-[240px] items-center justify-center overflow-hidden rounded-2xl border-2 shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all bg-black ${isActive ? "border-primary shadow-[0_0_40px_rgba(255,59,59,0.3)]" : "border-white/5 cursor-pointer"
                                            }`}
                                        initial={{
                                            x: offset > 0 ? 800 : -800, // Fly in from further away
                                            opacity: 0,
                                            scale: 0.5
                                        }}
                                        animate={{
                                            x,
                                            scale,
                                            opacity,
                                            zIndex,
                                            rotateY
                                        }}
                                        exit={{
                                            x: offset < 0 ? -800 : 800, // Fly out further away
                                            opacity: 0,
                                            scale: 0.5,
                                            zIndex: 0
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            ease: "easeOut"
                                        }}
                                        onClick={() => {
                                            if (offset < 0) prevVideo()
                                            if (offset > 0) nextVideo()
                                        }}
                                        style={{
                                            transformStyle: "preserve-3d"
                                        }}
                                    >
                                        <div className="relative h-full w-full bg-black">
                                            {isActive ? (
                                                <VideoPlayer
                                                    videoId={video.youtubeId}
                                                    title={video.title}
                                                    isActive={true}
                                                />
                                            ) : (
                                                <div className="relative h-full w-full" onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (offset > 0) nextVideo(); else prevVideo();
                                                }}>
                                                    <img
                                                        src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                                                        alt={video.title}
                                                        className="h-full w-full object-cover opacity-60 grayscale-[50%] transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                {content?.buttonText && content?.buttonLink && (
                    <div className="mt-8 flex justify-center">
                        <Link href={content.buttonLink}>
                            <Button size="lg" className="px-8 text-base">
                                {content.buttonText}
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
}
