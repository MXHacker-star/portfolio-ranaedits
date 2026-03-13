"use client"

import { motion } from "framer-motion"
import { useTranslation } from "@/lib/i18n"

interface SectionContent {
    title: string | null;
    subtitle: string | null;
}

interface ClientLogo {
    id: string;
    name: string;
    imageUrl: string;
    order: number;
}

interface ClientLogosSectionProps {
    content?: SectionContent | null;
    logos?: ClientLogo[];
}

export function ClientLogosSection({ content, logos: dbLogos = [] }: ClientLogosSectionProps) {
    const { t } = useTranslation()

    // DB data first, then i18n fallback for text
    const displayLabel = content?.subtitle || t.clients.label;
    const displayTitle = content?.title || t.clients.title;

    if (!dbLogos || dbLogos.length === 0) {
        return null; // Don't render if no logos are provided
    }

    return (
        <section className="relative bg-black py-20 border-y border-white/5 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none" />

            <div className="container mx-auto px-4 mb-10 text-center relative z-10">
                <p className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-2">{displayLabel}</p>
                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter opacity-80">
                    {displayTitle}
                </h2>
            </div>

            <div className="relative flex overflow-hidden group py-4">
                <div className="flex gap-24 animate-marquee whitespace-nowrap items-center">
                    {[...dbLogos, ...dbLogos, ...dbLogos].map((logo, index) => (
                        <div key={`${logo.id}-${index}`} className="flex items-center justify-center min-w-[120px] opacity-40 hover:opacity-100 transition-all duration-500 hover:scale-110 grayscale hover:grayscale-0 cursor-pointer">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={logo.imageUrl}
                                alt={`${logo.name} logo`}
                                className="h-12 w-auto object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

