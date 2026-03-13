"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, TrendingUp, Users, Award, Zap } from "lucide-react"
import Link from "next/link"
import { VideoPlayer } from "@/components/ui/VideoPlayer"
import { useState } from "react"
import { useTranslation } from "@/lib/i18n"
import { useContactModal } from "@/lib/stores/useContactModal"

interface StatItem {
    id: string
    label: string
    value: string
    icon?: string | null
    order: number
}

interface CaseStudyItem {
    id: string
    title: string
    views: string
    description: string
    youtubeId: string
    order: number
}

interface PageContent {
    title?: string | null
    subtitle?: string | null
    buttonText?: string | null
    settings?: any
}

interface ResultsClientProps {
    stats: StatItem[]
    caseStudies: CaseStudyItem[]
    pageContent: PageContent | null
}

export default function ResultsClient({ stats, caseStudies, pageContent }: ResultsClientProps) {
    const { t } = useTranslation();
    const { openModal } = useContactModal();
    const [playingIndex, setPlayingIndex] = useState<number | null>(null)

    // Icon mapping for stats by position
    const iconMap: Record<number, any> = {
        0: TrendingUp,
        1: Zap,
        2: Users,
        3: Award,
    }

    // DB data only — no hardcoded defaults
    const displayStats = stats.map((s, i) => ({
        label: s.label,
        value: s.value,
        icon: iconMap[i] || TrendingUp,
    }))

    // DB data only — no hardcoded defaults
    const displayStrategies = caseStudies.map(cs => ({
        title: cs.title,
        views: cs.views,
        description: cs.description,
        youtubeId: cs.youtubeId,
    }))

    // Page content from DB
    const heroTitle = pageContent?.title || ''
    const heroSubtitle = pageContent?.subtitle || ''
    const ctaTitle = (pageContent?.settings as any)?.ctaTitle || ''
    const ctaSubtitle = (pageContent?.settings as any)?.ctaSubtitle || ''
    const ctaBtn = pageContent?.buttonText || ''

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 md:px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
                <div className="container mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase mb-6">
                            {heroTitle.split(' ')[0]} <span className="text-primary">{heroTitle.split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                            {heroSubtitle}
                        </p>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto mb-20">
                        {displayStats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                            >
                                <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                                <h3 className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</h3>
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Case Studies Gallery */}
            <section className="py-20 bg-black/50 border-y border-white/5">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {displayStrategies.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group relative bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden hover:border-primary/50 transition-colors"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
                                    {/* Video Container */}
                                    <div
                                        className="relative aspect-[9/16] sm:aspect-auto sm:h-full bg-black cursor-pointer"
                                        onClick={() => setPlayingIndex(index)}
                                    >
                                        <VideoPlayer
                                            videoId={item.youtubeId}
                                            title={item.title}
                                            isActive={playingIndex === index}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 flex flex-col justify-center">
                                        <div className="mb-6">
                                            <h3 className="text-2xl font-black text-white uppercase leading-none mb-2">{item.title}</h3>
                                            <div className="inline-block px-3 py-1 rounded-full bg-primary/20 border border-primary/50 text-primary text-xs font-bold uppercase tracking-wider">
                                                {item.views}
                                            </div>
                                        </div>

                                        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                                            {item.description}
                                        </p>

                                        <div className="mt-auto pt-6 border-t border-white/10">
                                            <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider">
                                                <TrendingUp className="w-4 h-4 text-green-500" />
                                                {t.resultsPage.viralStrategy}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-primary text-black rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden"
                    >
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
                                {ctaTitle}
                            </h2>
                            <p className="text-xl md:text-2xl font-medium opacity-90 mb-10">
                                {ctaSubtitle}
                            </p>
                            <Button
                                size="lg"
                                className="bg-black text-white hover:bg-black/80 h-16 px-10 rounded-full text-lg font-bold uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform"
                                onClick={() => openModal({ source: 'Results Page CTA' })}
                            >
                                {ctaBtn} <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>


                        {/* Background Effect */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
                    </motion.div>
                </div>
            </section>


        </main>
    )
}
