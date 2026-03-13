"use client"

import { motion } from "framer-motion"
import { useTranslation } from "@/lib/i18n"

interface StatItem {
    id: string;
    label: string;
    value: string;
    order: number;
}

interface ResultsSectionProps {
    stats?: StatItem[]
}

export function ResultsSection({ stats: dbStats = [] }: ResultsSectionProps) {
    const { t } = useTranslation();

    // DB data only — no hardcoded defaults
    const displayStats = dbStats.map(stat => ({
        label: stat.label, value: stat.value
    }));

    return (
        <section id="results" className="py-20 bg-background text-foreground border-t border-white/5">
            <div className="container px-4 md:px-6 mx-auto">
                {/* Stats Header */}
                <div className="flex flex-col items-center text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
                        {t.results.title}
                    </h2>
                    <p className="mt-4 text-muted-foreground text-lg max-w-2xl">
                        {t.results.subtitle}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className={`grid grid-cols-1 md:grid-cols-${Math.min(displayStats.length, 3)} gap-8 text-center justify-center max-w-5xl mx-auto mb-20`}>
                    {displayStats.map((metric, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex flex-col items-center justify-center min-h-[160px] hover:bg-white/10 transition-colors"
                        >
                            <div className="text-5xl md:text-6xl font-bold text-primary mb-3 drop-shadow-lg">{metric.value}</div>
                            <div className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-widest">{metric.label}</div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    )
}
