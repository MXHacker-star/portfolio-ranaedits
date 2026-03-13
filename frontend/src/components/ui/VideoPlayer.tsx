"use client"

import { useState, useEffect } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function VideoPlayer({ videoId, title, isActive }: { videoId: string, title: string, isActive: boolean }) {
    const [muted, setMuted] = useState(true)
    const [origin, setOrigin] = useState("")

    useEffect(() => {
        setOrigin(window.location.origin)
    }, [])

    // Reset mute state when not active


    // Reset mute only when user explicitly interacts or component remounts differently
    // Actually, preserving local mute state is usually better UX, but if we want to reset:
    useEffect(() => {
        if (!isActive) {
            // Instead of setting state processing, we rely on the iframe recreation
            // when isActive becomes true, it re-renders.
            setMuted(true)
        }
    }, [isActive])

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation()
        setMuted(!muted)
    }

    return (
        <div className="relative h-full w-full bg-black overflow-hidden rounded-2xl group">
            {isActive ? (
                <div className="absolute inset-0 scale-[1.35]">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&loop=1&playlist=${videoId}&playsinline=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&origin=${origin}`}
                        title={title}
                        className="h-full w-full pointer-events-none"
                        loading="eager"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            ) : (
                <div className="relative h-full w-full">
                    <img
                        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                        alt={title}
                        className="h-full w-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[16px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay for interaction */}
            <div className={`absolute inset-0 z-10 flex flex-col justify-between p-4 bg-gradient-to-b from-black/20 via-transparent to-black/60 transition-opacity duration-300 ${isActive ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                <div className="self-end">
                    {muted && isActive && (
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10 hover:bg-primary pointer-events-auto"
                            onClick={toggleMute}
                        >
                            <VolumeX className="h-4 w-4" />
                        </Button>
                    )}
                    {!muted && isActive && (
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10 hover:bg-primary pointer-events-auto"
                            onClick={toggleMute}
                        >
                            <Volume2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                <div>
                    <h3 className="text-sm font-bold text-white drop-shadow-md line-clamp-2">{title}</h3>
                </div>
            </div>
        </div>
    )
}
