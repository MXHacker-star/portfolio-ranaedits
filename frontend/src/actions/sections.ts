"use server"

import prisma from "@/lib/prisma"

// --- Section Content (About, Showreel, CTA) ---
export async function getSectionContent(section: string) {
    try {
        const content = await prisma.sectionContent.findUnique({
            where: { section }
        })
        return content
    } catch (error) {
        console.error(`Error fetching section content for ${section}:`, error)
        return null
    }
}

// --- Menu Links (Navbar, Footer) ---
export async function getMenuLinks(type: 'header' | 'footer' | 'both' = 'both') {
    try {
        const links = await prisma.menuLink.findMany({
            where: {
                isActive: true,
                OR: [
                    { type: type },
                    { type: 'both' },
                    ...(type === 'header' ? [] : [{ type: 'footer' }]), // Logic simplified below
                ]
            },
            orderBy: { order: 'asc' }
        })

        // Precise filtering if needed, but the OR query above might be loose
        if (type === 'both') return links;
        return links.filter(l => l.type === type || l.type === 'both')
    } catch (error) {
        console.error("Error fetching menu links:", error)
        return []
    }
}

// --- Stats / Results ---
export async function getStats() {
    try {
        const stats = await prisma.statItem.findMany({
            where: { visible: true },
            orderBy: { order: 'asc' }
        })
        return stats
    } catch (error) {
        console.error("Error fetching stats:", error)
        return []
    }
}

// Fetch stats by section: "results" (Business Results) or "about" (About Me)
export async function getStatsBySection(section: string) {
    try {
        const stats = await prisma.statItem.findMany({
            where: { visible: true, section },
            orderBy: { order: 'asc' }
        })
        return stats
    } catch (error) {
        console.error(`Error fetching ${section} stats:`, error)
        return []
    }
}

// --- SEO Config ---
export async function getSEOConfig() {
    try {
        const config = await prisma.sEOConfig.findFirst()
        return config
    } catch (error) {
        console.error("Error fetching SEO config:", error)
        return null
    }
}

// --- Showreel Videos (All/Recent) ---
export async function getShowreelVideos() {
    try {
        const videos = await prisma.portfolioItem.findMany({
            where: { type: 'video', featured: true }, // Only fetch featured videos for Showreel as per user request
            take: 10, // Show last 10 added videos in showreel slider
            orderBy: { order: 'asc' } // Or createdAt: 'desc' if they want recent
        })
        return videos
    } catch (error) {
        console.error("Error fetching showreel videos:", error)
        return []
    }
}

// --- Success Stories (Featured Videos) ---
export async function getSuccessStoryVideos() {
    try {
        const videos = await prisma.portfolioItem.findMany({
            where: {
                type: 'video',
                isSuccessStory: true // Separated logic from showreel
            },
            take: 10,
            orderBy: { order: 'asc' }
        })
        return videos
    } catch (error) {
        console.error("Error fetching success story videos:", error)
        return []
    }
}

// --- Selected Graphics (Featured Graphics → homepage GraphicDesignPreview) ---
export async function getSelectedGraphics() {
    try {
        const graphics = await prisma.portfolioItem.findMany({
            where: {
                type: 'image',
                featured: true // Only featured graphics go to GraphicDesignPreview
            },
            take: 6,
            orderBy: { order: 'asc' },
            include: { portfolioCategory: true }
        })
        return graphics
    } catch (error) {
        console.error("Error fetching selected graphics:", error)
        return []
    }
}

