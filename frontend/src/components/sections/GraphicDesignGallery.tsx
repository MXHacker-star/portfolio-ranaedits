"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PortfolioItem {
    id: string;
    title: string;
    category: string;
    subCategory: string | null;
    mediaUrl: string;
    thumbnail: string | null;
    type: string;
}

interface GraphicDesignGalleryProps {
    items: PortfolioItem[];
    categories?: string[];
}

import { useTranslation } from "@/lib/i18n";
import { useContactModal } from "@/lib/stores/useContactModal";

export function GraphicDesignGallery({ items, categories: propCategories }: GraphicDesignGalleryProps) {
    const { t, language } = useTranslation();
    const { openModal } = useContactModal();
    const [filter, setFilter] = useState("All");
    const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

    // Use allowed categories if provided, otherwise derive from items
    const categories = propCategories && propCategories.length > 0
        ? ["All", ...propCategories]
        : ["All", ...Array.from(new Set(items.map(item => item.subCategory).filter(Boolean))) as string[]];

    const displayCategories = categories.map(cat => cat === "All" && language === 'bn' ? "সব" : cat);

    const filteredItems = filter === "All"
        ? items
        : items.filter(item => item.subCategory === filter);

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

            {/* Masonry Layout */}
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4 px-2">
                {filteredItems.map((item) => (
                    <motion.div
                        layoutId={`card-${item.id}`}
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setSelectedItem(item)}
                        className="break-inside-avoid group relative overflow-hidden rounded-lg bg-muted border border-white/5 cursor-pointer"
                    >
                        <div className="relative w-full h-auto">
                            {/* Use native img for masonry but with optimized loading */}
                            <img
                                src={item.type === 'image' ? item.mediaUrl : (item.thumbnail || `https://img.youtube.com/vi/${item.mediaUrl}/mqdefault.jpg`)}
                                alt={item.title}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                            <span className="text-primary text-[9px] font-bold tracking-widest uppercase mb-1">{item.subCategory || item.category}</span>
                            <h3 className="text-xs font-bold text-white leading-tight">{item.title}</h3>
                        </div>
                    </motion.div>
                ))}
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
                            layoutId={`card-${selectedItem.id}`}
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
                                    src={selectedItem.type === 'image' ? selectedItem.mediaUrl : (selectedItem.thumbnail || `https://img.youtube.com/vi/${selectedItem.mediaUrl}/mqdefault.jpg`)}
                                    alt={selectedItem.title}
                                    className="max-h-[80vh] w-auto max-w-full object-contain"
                                />
                            </div>

                            <div className="w-full md:w-1/3 p-8 flex flex-col justify-center bg-neutral-900 border-l border-white/5">
                                <div className="mb-6">
                                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                                        {selectedItem.subCategory || selectedItem.category}
                                    </span>
                                    <h2 className="text-3xl font-black text-white uppercase leading-none mb-4">{selectedItem.title}</h2>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {t.graphicPage.galleryModalDesc}
                                    </p>
                                </div>
                                <Button
                                    className="w-full font-bold uppercase tracking-wide"
                                    onClick={() => {
                                        setSelectedItem(null);
                                        openModal({ source: 'Graphic Gallery Modal', service: 'graphic-design' });
                                    }}
                                >
                                    {t.graphicPage.galleryModalBtn}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
