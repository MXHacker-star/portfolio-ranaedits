"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function HeroParticles() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollY } = useScroll()
    const y = useTransform(scrollY, [0, 500], [0, 200])

    // Generate static random positions for particles to avoid hydration mismatches
    // We use a fixed seed-like approach or just effect-based generation if interactions are needed
    // For a simple floating effect, standard mapping is fine as long as we use Client Component properly

    const [particles, setParticles] = useState<{ id: number; top: string; left: string; size: number; duration: number; delay: number }[]>([])

    useEffect(() => {
        setParticles(
            Array.from({ length: 25 }).map((_, i) => ({
                id: i,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                size: Math.random() * 3 + 1,
                duration: Math.random() * 20 + 10,
                delay: Math.random() * 5
            }))
        )
    }, [])

    return (
        <div ref={containerRef} className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
            <motion.div style={{ y }} className="relative w-full h-full">
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="absolute rounded-full bg-primary/30 blur-[1px]"
                        style={{
                            top: particle.top,
                            left: particle.left,
                            width: particle.size,
                            height: particle.size,
                        }}
                        animate={{
                            y: [0, -100, 0],
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0],
                        }}
                        transition={{
                            duration: particle.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: particle.delay,
                        }}
                    />
                ))}
            </motion.div>
        </div>
    )
}
