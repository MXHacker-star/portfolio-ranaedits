"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getWebProjects() {
    try {
        const projects = await prisma.portfolioItem.findMany({
            where: { type: 'web' },
            orderBy: { order: 'asc' },
            include: { portfolioCategory: true }
        })
        return projects
    } catch (error) {
        console.error("Error fetching web projects:", error)
        return []
    }
}

export async function getWebProject(id: string) {
    try {
        const project = await prisma.portfolioItem.findUnique({
            where: { id },
            include: { portfolioCategory: true }
        })
        return project
    } catch (error) {
        console.error("Error fetching web project:", error)
        return null
    }
}

export async function createWebProject(data: {
    title: string
    description?: string
    mediaUrl: string
    stack?: string
    liveUrl?: string
    repoUrl?: string
    categoryId?: string
    featured: boolean
    order: number
}) {
    try {
        await prisma.portfolioItem.create({
            data: {
                title: data.title,
                description: data.description || null,
                mediaUrl: data.mediaUrl,
                stack: data.stack || null,
                liveUrl: data.liveUrl || null,
                repoUrl: data.repoUrl || null,
                categoryId: data.categoryId || null,
                type: 'web',
                orientation: 'horizontal',
                featured: data.featured,
                order: data.order,
            }
        })
        revalidatePath('/')
        revalidatePath('/admin/portfolio/web')
        revalidatePath('/web-development')
        return { success: true, message: "Web project created" }
    } catch (error) {
        console.error("Error creating web project:", error)
        return { success: false, message: "Failed to create web project" }
    }
}

export async function updateWebProject(id: string, data: {
    title: string
    description?: string
    mediaUrl: string
    stack?: string
    liveUrl?: string
    repoUrl?: string
    categoryId?: string
    featured: boolean
    order: number
}) {
    try {
        await prisma.portfolioItem.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description || null,
                mediaUrl: data.mediaUrl,
                stack: data.stack || null,
                liveUrl: data.liveUrl || null,
                repoUrl: data.repoUrl || null,
                categoryId: data.categoryId || null,
                featured: data.featured,
                order: data.order,
            }
        })
        revalidatePath('/')
        revalidatePath('/admin/portfolio/web')
        revalidatePath('/web-development')
        return { success: true, message: "Web project updated" }
    } catch (error) {
        console.error("Error updating web project:", error)
        return { success: false, message: "Failed to update web project" }
    }
}

export async function deleteWebProject(id: string) {
    try {
        await prisma.portfolioItem.delete({
            where: { id }
        })
        revalidatePath('/')
        revalidatePath('/admin/portfolio/web')
        revalidatePath('/web-development')
        return { success: true, message: "Web project deleted" }
    } catch (error) {
        console.error("Error deleting web project:", error)
        return { success: false, message: "Failed to delete web project" }
    }
}
