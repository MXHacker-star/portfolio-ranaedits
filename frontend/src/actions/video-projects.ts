"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getVideoProjects() {
    try {
        const projects = await prisma.portfolioItem.findMany({
            where: { type: 'video' },
            orderBy: { order: 'asc' },
            include: { portfolioCategory: true } // Include category details
        })
        return projects
    } catch (error) {
        console.error("Error fetching video projects:", error)
        return []
    }
}

export async function getVideoProject(id: string) {
    try {
        const project = await prisma.portfolioItem.findUnique({
            where: { id },
            include: { portfolioCategory: true }
        })
        return project
    } catch (error) {
        console.error("Error fetching video project:", error)
        return null
    }
}

export async function createVideoProject(data: {
    title: string
    mediaUrl: string
    categoryId?: string
    orientation: string
    thumbnail?: string
    featured: boolean
    isSuccessStory: boolean
    order: number
}) {
    try {
        await prisma.portfolioItem.create({
            data: {
                ...data,
                categoryId: data.categoryId || null, // Ensure empty string becomes null
                type: 'video',
                category: "", // Legacy field fallback
            }
        })
        revalidatePath('/')
        revalidatePath('/admin/portfolio/video')
        // Also revalidate main portfolio page if needed
        revalidatePath('/video-editing')
        return { success: true, message: "Video project created" }
    } catch (error) {
        console.error("Error creating video project:", error)
        return { success: false, message: "Failed to create video project" }
    }
}

export async function updateVideoProject(id: string, data: {
    title: string
    mediaUrl: string
    categoryId?: string
    orientation: string
    thumbnail?: string
    featured: boolean
    isSuccessStory: boolean
    order: number
}) {
    try {
        await prisma.portfolioItem.update({
            where: { id },
            data: {
                ...data,
                categoryId: data.categoryId || null
            }
        })
        revalidatePath('/')
        revalidatePath('/admin/portfolio/video')
        revalidatePath('/video-editing')
        return { success: true, message: "Video project updated" }
    } catch (error) {
        console.error("Error updating video project:", error)
        return { success: false, message: "Failed to update video project" }
    }
}

export async function deleteVideoProject(id: string) {
    try {
        await prisma.portfolioItem.delete({
            where: { id }
        })
        revalidatePath('/')
        revalidatePath('/admin/portfolio/video')
        revalidatePath('/video-editing')
        return { success: true, message: "Video project deleted" }
    } catch (error) {
        console.error("Error deleting video project:", error)
        return { success: false, message: "Failed to delete video project" }
    }
}

export async function toggleFeaturedStatus(id: string, featured: boolean) {
    try {
        await prisma.portfolioItem.update({
            where: { id },
            data: { featured }
        })
        revalidatePath('/')
        revalidatePath('/admin/portfolio/video')
        revalidatePath('/admin/showreel')
        return { success: true, message: "Featured status updated" }
    } catch (error) {
        console.error("Error updating featured status:", error)
        return { success: false, message: "Failed to update status" }
    }
}

export async function toggleSuccessStoryStatus(id: string, isSuccessStory: boolean) {
    try {
        await prisma.portfolioItem.update({
            where: { id },
            data: { isSuccessStory }
        })
        revalidatePath('/')
        revalidatePath('/admin/portfolio/video')
        revalidatePath('/admin/showreel')
        return { success: true, message: "Success Story status updated" }
    } catch (error) {
        console.error("Error updating success story status:", error)
        return { success: false, message: "Failed to update status" }
    }
}
