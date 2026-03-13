"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

const categories = ["All", "Reels", "Business", "Personal Brand", "Ecommerce"]

const portfolioItems = [
    { id: 1, title: "Viral Reel 1", category: "Reels", videoUrl: "#", thumbnail: "/placeholder.jpg" },
    { id: 2, title: "Business Promo", category: "Business", videoUrl: "#", thumbnail: "/placeholder.jpg" },
    { id: 3, title: "Personal Brand Story", category: "Personal Brand", videoUrl: "#", thumbnail: "/placeholder.jpg" },
    { id: 4, title: "Product Showcase", category: "Ecommerce", videoUrl: "#", thumbnail: "/placeholder.jpg" },
    { id: 5, title: "Fitness Motivation", category: "Reels", videoUrl: "#", thumbnail: "/placeholder.jpg" },
    { id: 6, title: "Tech Review", category: "Business", videoUrl: "#", thumbnail: "/placeholder.jpg" },
]

export default function PortfolioPage() {
    const { t, language } = useTranslation();
    const [activeCategory, setActiveCategory] = useState("All")

    const filteredItems = activeCategory === "All"
        ? portfolioItems
        : portfolioItems.filter(item => item.category === activeCategory)

    // Helper to translate 'All'
    const displayCategory = (cat: string) => cat === "All" && language === 'bn' ? t.portfolioPage.all : cat;

    return (
        <main className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 py-24">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">{t.portfolioPage.title}</h1>
                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                    {t.portfolioPage.subtitle}
                </p>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map(category => (
                        <Button
                            key={category}
                            variant={activeCategory === category ? "default" : "outline"}
                            onClick={() => setActiveCategory(category)}
                            className="rounded-full"
                        >
                            {(t as any).portfolioPage?.categories?.[{
                                "Reels": "reels",
                                "Business": "business",
                                "Personal Brand": "personalBrand",
                                "Ecommerce": "ecommerce"
                            }[category] as string] || displayCategory(category)}
                        </Button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map(item => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="group relative aspect-[9/16] overflow-hidden rounded-xl bg-muted cursor-pointer border border-white/5 hover:border-primary/50"
                            >
                                {/* Thumbnail / Video Placeholder */}
                                <div className="absolute inset-0 bg-gray-900 transition-transform duration-500 group-hover:scale-105">
                                    <div className="flex h-full items-center justify-center">
                                        <Play className="h-12 w-12 text-white/50 group-hover:text-primary transition-colors" />
                                    </div>
                                </div>

                                {/* Overlay Info */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                                    <p className="text-sm text-primary">{item.category}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    )
}
