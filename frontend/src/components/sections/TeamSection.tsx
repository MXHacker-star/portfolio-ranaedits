"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "@/lib/i18n"

interface TeamMember {
    id: string
    name: string
    role: string
    imageUrl: string
}

interface TeamSectionProps {
    team?: TeamMember[]
}

export function TeamSection({ team: dbTeam = [] }: TeamSectionProps) {
    const { t } = useTranslation();
    const [isPaused, setIsPaused] = useState(false)

    if (!dbTeam || dbTeam.length === 0) {
        return null;
    }

    const displayTeam = dbTeam;

    // Repeat enough to fill any viewport, then double for seamless -50% translateX loop
    const filledSet = [...displayTeam, ...displayTeam, ...displayTeam, ...displayTeam]
    const marqueeTeam = [...filledSet, ...filledSet]

    return (
        <section id="team" className="py-16 bg-background text-foreground overflow-hidden border-t border-white/5">
            <div className="container px-4 md:px-6 mx-auto mb-12 text-center">
                <h2 className="text-2xl font-black tracking-tighter sm:text-3xl md:text-4xl uppercase">
                    {t.team.title.split(' ')[0]} <span className="text-primary">{t.team.title.split(' ').slice(1).join(' ')}</span>
                </h2>
                <p className="mt-2 text-muted-foreground text-sm max-w-2xl mx-auto">
                    {t.team.subtitle}
                </p>
            </div>

            {/* Marquee Container */}
            <div
                className="relative w-full flex overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div className={`flex gap-4 animate-marquee will-change-transform ${isPaused ? 'paused' : ''}`}>
                    {marqueeTeam.map((member, index) => (
                        <div
                            key={`${member.id}-${index}`}
                            className="relative group flex-shrink-0 w-[140px] h-[340px] rounded-full overflow-hidden border border-white/10 cursor-pointer"
                        >
                            <img
                                src={member.imageUrl}
                                alt={member.name}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                            />

                            {/* Side Overlay Shadow - From Right */}
                            <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Content Reveal - Vertical Text on Right */}
                            <div className="absolute inset-y-0 right-0 p-4 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[20px] group-hover:translate-x-0">
                                <div className="writing-vertical-rl rotate-180 flex items-center gap-2 max-h-full">
                                    <h3 className="text-lg font-black text-white uppercase tracking-wider whitespace-nowrap">{member.name}</h3>
                                    <p className="text-[10px] font-bold text-primary tracking-widest uppercase whitespace-nowrap">{member.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
