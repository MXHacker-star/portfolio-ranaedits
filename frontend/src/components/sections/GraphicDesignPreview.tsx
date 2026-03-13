"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Fallback data when no DB items are available yet
const fallbackDesigns = [
    {
        id: "fallback-1",
        title: "Instagram Carousel",
        category: "Social Media",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "fallback-2",
        title: "Brand Identity",
        category: "Branding",
        image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "fallback-3",
        title: "YouTube Thumbnail",
        category: "Thumbnail",
        image: "https://images.unsplash.com/photo-1626785774573-4b799314346d?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "fallback-4",
        title: "Fitness Ad",
        category: "Advertising",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop"
    }
];

import { useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence } from "framer-motion";

// ... (previous imports)

import { useTranslation } from "@/lib/i18n";
import { useContactModal } from "@/lib/stores/useContactModal";

interface GraphicDesignPreviewProps {
    items?: {
        id: string
        title: string
        mediaUrl: string
        portfolioCategory?: { name: string } | null
    }[]
}

export function GraphicDesignPreview({ items }: GraphicDesignPreviewProps) {
    const { t } = useTranslation();
    const { openModal } = useContactModal();

    // If no featured items exist in the database, do not render the section.
    if (!items || items.length === 0) {
        return null;
    }

    const previewDesigns = items.map(item => ({
        id: item.id,
        title: item.title,
        category: item.portfolioCategory?.name || "Design",
        image: item.mediaUrl
    }));

    const [selectedItem, setSelectedItem] = useState<(typeof previewDesigns)[0] | null>(null);

    return (
        <section id="graphic-design-preview" className="py-20 bg-background overflow-hidden border-t border-white/5">
            {/* ... (Header Section) */}
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-1 bg-primary rounded-full" />
                        <div>
                            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl uppercase">
                                {t.graphicPreview.title}
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                {t.graphicPreview.subtitle}
                            </p>
                        </div>
                    </div>

                    <Link href="/graphic-design">
                        <Button variant="ghost" className="group text-muted-foreground hover:text-primary">
                            {t.graphicPreview.viewGallery}
                            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>

                {/* Horizontal Scroll Layout - Minimal & Sleek */}
                <div className="relative">
                    <div className="flex gap-4 overflow-x-auto pb-8 snap-x scrollbar-hide">
                        {previewDesigns.map((design, index) => (
                            <motion.div
                                layoutId={`preview-${design.id}`}
                                key={design.id}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                onClick={() => setSelectedItem(design)}
                                className="snap-center shrink-0 w-[200px] md:w-[240px] group relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-900 border border-white/10 cursor-pointer"
                            >
                                <img
                                    src={design.image}
                                    alt={design.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <span className="text-primary text-xs font-bold tracking-widest uppercase mb-1">{design.category}</span>
                                    <h3 className="text-lg font-bold text-white leading-tight">{design.title}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Fade Edges */}
                    <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none" />
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 sm:px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedItem(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <motion.div
                            layoutId={`preview-${selectedItem.id}`}
                            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl flex flex-col md:flex-row"
                        >
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute top-2 right-2 z-10 text-white/50 hover:text-white hover:bg-black/50 rounded-full"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedItem(null);
                                }}
                            >
                                <X className="w-6 h-6" />
                            </Button>

                            <div className="w-full md:w-2/3 bg-black flex items-center justify-center p-4">
                                <img
                                    src={selectedItem.image}
                                    alt={selectedItem.title}
                                    className="max-h-[80vh] w-auto max-w-full object-contain"
                                />
                            </div>

                            <div className="w-full md:w-1/3 p-8 flex flex-col justify-center bg-neutral-900 border-l border-white/5">
                                <div className="mb-6">
                                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                                        {selectedItem.category}
                                    </span>
                                    <h2 className="text-3xl font-black text-white uppercase leading-none mb-4">{selectedItem.title}</h2>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        High-impact graphic design tailored for social media engagement and brand authority.
                                    </p>
                                </div>
                                <Button
                                    className="w-full font-bold uppercase tracking-wide"
                                    onClick={() => {
                                        setSelectedItem(null);
                                        openModal({ source: 'Graphic Preview Modal', service: 'graphic-design' });
                                    }}
                                >
                                    {t.graphicPreview.requestDesign}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
