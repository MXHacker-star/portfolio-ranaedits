"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Play } from "lucide-react";

interface PortfolioItem {
    id: string;
    title: string;
    category: string;
    subCategory: string | null;
    mediaUrl: string;
    thumbnail: string | null;
    type: string;
}

interface VideoGalleryProps {
    items: PortfolioItem[];
    categories?: string[];
    variant?: "horizontal" | "vertical";
}

import { useTranslation } from "@/lib/i18n";

export function VideoGallery({ items, categories: propCategories, variant = "horizontal" }: VideoGalleryProps) {
    const { language } = useTranslation();
    const [filter, setFilter] = useState("All");
    const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

    console.log(`[VideoGallery] Variant: ${variant}, Items received: ${items.length}`);

    // Use allowed categories if provided, otherwise derive from items
    const categories = propCategories && propCategories.length > 0
        ? ["All", ...propCategories]
        : ["All", ...Array.from(new Set(items.map(item => item.subCategory).filter(Boolean))) as string[]];

    const displayCategories = categories.map(cat => cat === "All" && language === 'bn' ? "সব" : cat);

    const filteredItems = filter === "All"
        ? items
        : items.filter(item => item.subCategory === filter);

    const isVertical = variant === "vertical";
    const aspectRatioClass = isVertical ? "aspect-[9/16]" : "aspect-video";
    const gridColsClass = isVertical
        ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

    return (
        <>
            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-10 overflow-x-auto pb-4">
                {categories.map((category, index) => (
                    <Button
                        key={category}
                        variant={filter === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter(category)}
                        className={`rounded-full text-xs h-8 px-4 ${filter === category ? "bg-primary text-black" : "border-primary/20 hover:border-primary"}`}
                    >
                        {displayCategories[index]}
                    </Button>
                ))}
            </div>

            {/* Grid Layout */}
            <div className={`grid ${gridColsClass} gap-6 px-2`}>
                {filteredItems.map((item) => (
                    <motion.div
                        layoutId={`card-${item.id}`}
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setSelectedItem(item)}
                        className={`group relative ${aspectRatioClass} overflow-hidden rounded-lg bg-muted border border-white/5 cursor-pointer shadow-lg hover:shadow-primary/10 transition-shadow`}
                    >
                        <div className="relative w-full h-full">
                            <img
                                src={item.thumbnail || `https://img.youtube.com/vi/${item.mediaUrl}/${isVertical ? 'hqdefault' : 'mqdefault'}.jpg`}
                                alt={item.title}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                            />
                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-12 w-12 rounded-full bg-primary/90 flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
                                    <Play className="h-5 w-5 text-black fill-current ml-0.5" />
                                </div>
                            </div>
                        </div>

                        {/* Title Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent pt-10 translate-y-2 group-hover:translate-y-0 transition-transform">
                            <span className="text-primary text-[10px] font-bold tracking-widest uppercase mb-1 block">
                                {item.subCategory || item.category}
                            </span>
                            <h3 className="text-sm font-bold text-white leading-tight line-clamp-2">{item.title}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 sm:px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedItem(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />

                        <motion.div
                            layoutId={`card-${selectedItem.id}`}
                            className={`relative w-full ${isVertical ? 'max-w-sm' : 'max-w-5xl'} bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10`}
                        >
                            <div className={`${isVertical ? 'aspect-[9/16]' : 'aspect-video'} w-full`}>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${selectedItem.mediaUrl}?autoplay=1&rel=0`}
                                    title={selectedItem.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </div>

                            <div className="p-6 flex items-start justify-between bg-neutral-900/50">
                                <div>
                                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                                        {selectedItem.subCategory || selectedItem.category}
                                    </span>
                                    <h2 className="text-xl md:text-2xl font-bold text-white">{selectedItem.title}</h2>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-white/50 hover:text-white rounded-full bg-white/5 hover:bg-white/10"
                                    onClick={() => setSelectedItem(null)}
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
