"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getGraphicProjects() {
    try {
        const projects = await prisma.portfolioItem.findMany({
            where: { type: 'image' },
            orderBy: { order: 'asc' },
            include: { portfolioCategory: true }
        })
        return projects
    } catch (error) {
        console.error("Error fetching graphic projects:", error)
        return []
    }
}

export async function getGraphicProject(id: string) {
    try {
        const project = await prisma.portfolioItem.findUnique({
            where: { id },
            include: { portfolioCategory: true }
        })
        return project
    } catch (error) {
        console.error("Error fetching graphic project:", error)
        return null
    }
}

export async function createGraphicProject(data: {
    title: string
    mediaUrl: string // Image URL
    categoryId?: string | null // Make it optional in type definition to match form usage but handle it logic
    featured: boolean
    order: number
}) {
    // If categoryId is empty string, convert to null or undefined for Prisma
    const categoryIdToUse = data.categoryId === "" ? null : data.categoryId;

    await prisma.portfolioItem.create({
        data: {
            title: data.title,
            mediaUrl: data.mediaUrl,
            categoryId: categoryIdToUse, // Pass the processed ID
            type: 'image',
            orientation: 'vertical', // Default for graphic/poster usually, or let user pick? Assuming vertical/portrait logic or standard
            featured: data.featured,
            order: data.order
        }
    })
    revalidatePath('/')
    revalidatePath('/admin/portfolio/graphic')
}

export async function updateGraphicProject(id: string, data: {
    title: string
    mediaUrl: string
    categoryId?: string | null
    featured: boolean
    order: number
}) {
    const categoryIdToUse = data.categoryId === "" ? null : data.categoryId;

    await prisma.portfolioItem.update({
        where: { id },
        data: {
            title: data.title,
            mediaUrl: data.mediaUrl,
            categoryId: categoryIdToUse,
            featured: data.featured,
            order: data.order
        }
    })
    revalidatePath('/')
    revalidatePath('/admin/portfolio/graphic')
}

export async function deleteGraphicProject(id: string) {
    await prisma.portfolioItem.delete({
        where: { id }
    })
    revalidatePath('/')
    revalidatePath('/admin/portfolio/graphic')
}
