"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { useTranslation } from "@/lib/i18n";
import { useContactModal } from "@/lib/stores/useContactModal";

interface SectionContent {
    title: string | null;
    subtitle: string | null;
    buttonText: string | null;
    buttonLink: string | null;
}

interface CTASectionProps {
    title?: string;
    description?: string;
    buttonText?: string;
    href?: string;
    source?: string;
    type?: 'consultancy' | 'proposal' | 'package' | 'video-project' | 'graphic-project' | 'general';
    content?: SectionContent | null;
}

export function CTASection({
    title,
    description,
    buttonText,
    href = "/#contact",
    source = "CTA Section",
    type = 'consultancy',
    content
}: CTASectionProps) {
    const { t, language } = useTranslation();
    const { openModal } = useContactModal();

    const displayTitle = content?.title || title || t.cta.title;
    const displayDesc = content?.subtitle || description || t.cta.desc;
    const displayBtn = content?.buttonText || buttonText || t.cta.btn;

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-background">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50 blur-3xl" />
            </div>

            <div className="container relative mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider"
                    >
                        <Sparkles className="w-3 h-3" />
                        Let's Make Magic
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase text-foreground"
                    >
                        {displayTitle}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg text-muted-foreground leading-relaxed max-w-2xl"
                    >
                        {displayDesc}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Button
                            size="lg"
                            className="bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-wide h-14 px-8 text-base group"
                            onClick={() => openModal({ source: source, type: type })}
                        >
                            {displayBtn}
                            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
