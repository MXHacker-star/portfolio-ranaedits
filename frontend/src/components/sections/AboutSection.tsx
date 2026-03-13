"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n"

interface SectionContent {
    title: string | null;
    subtitle: string | null;
    content: string | null;
    mediaUrl: string | null;
    buttonText: string | null;
    buttonLink: string | null;
}

interface StatItem {
    id: string;
    label: string;
    value: string;
    order: number;
}

interface AboutSectionProps {
    content?: SectionContent | null
    stats?: StatItem[]
}

export function AboutSection({ content, stats: dbStats = [] }: AboutSectionProps) {
    const { t, language } = useTranslation()

    // Use DB title if provided, otherwise fallback to i18n title
    const dbTitle = content?.title || (t.about.titleLine1 + " " + t.about.titleLine2);

    const words = dbTitle.split(" ");
    const titleLine1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
    const titleLine2 = words.slice(Math.ceil(words.length / 2)).join(" ");

    // Use DB text if provided, otherwise fallback to i18n descriptions
    const displaySubtitle = content?.subtitle || t.about.desc1;
    const displayContent = content?.content || t.about.desc2;

    // DB data only — no hardcoded defaults
    const displayStats = dbStats.map(s => ({ value: s.value, label: s.label }))

    // Card styles based on position (up to 4 cards)
    const cardStyles = [
        // Card 1: dark glass
        "bg-card/30 backdrop-blur-md border border-white/10 text-white",
        // Card 2: primary (red) bg, offset down
        "bg-primary translate-y-8 text-black",
        // Card 3: white bg
        "bg-white text-black",
        // Card 4: dark glass, offset down
        "bg-card/30 backdrop-blur-md border border-white/10 text-primary translate-y-8",
    ]

    const valueStyles = [
        "text-white",
        "text-black",
        "text-black",
        "text-primary",
    ]

    const labelStyles = [
        "text-muted-foreground",
        "text-black/70",
        "text-black/70",
        "text-muted-foreground",
    ]

    return (
        <section id="about" className="py-24 bg-background text-foreground overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Creative Text Area */}
                    <div className="relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9] mb-8">
                                {titleLine1} <br />
                                <span className="text-primary">{titleLine2}</span>
                            </h2>
                            <p className="text-lg text-muted-foreground mb-6 max-w-lg">
                                {displaySubtitle}
                            </p>
                            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                                {displayContent}
                            </p>

                        </motion.div>
                    </div>

                    {/* Creative Visual/Stats Area */}
                    <div className="relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            {displayStats.slice(0, 4).map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                    viewport={{ once: true }}
                                    className={`p-8 rounded-2xl flex flex-col justify-between h-[200px] ${cardStyles[index] || cardStyles[0]}`}
                                >
                                    <span className={`text-5xl font-black ${valueStyles[index] || valueStyles[0]}`}>{stat.value}</span>
                                    <span className={`text-sm uppercase tracking-widest ${labelStyles[index] || labelStyles[0]}`}>{stat.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

