"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { promises as fs } from "fs"
import { join } from "path"


async function saveFile(file: File): Promise<string | null> {
    if (!file || file.size === 0) return null

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}-${file.name.replaceAll(" ", "_")}`
    const uploadDir = join(process.cwd(), "public/uploads")

    try {
        await fs.mkdir(uploadDir, { recursive: true })
        await fs.writeFile(join(uploadDir, filename), buffer)
        return `/uploads/${filename}`
    } catch (error) {
        console.error("Error saving file:", error)
        return null
    }
}

export async function getPortfolioItems(category?: string) {
    try {
        const where = category ? { category } : {}
        const items = await prisma.portfolioItem.findMany({
            where,
            orderBy: { order: 'asc' }
        })
        return items
    } catch (error) {
        console.error("Failed to fetch portfolio items:", error)
        return []
    }
}

export async function getPortfolioItem(id: string) {
    try {
        const item = await prisma.portfolioItem.findUnique({
            where: { id }
        })
        return item
    } catch (error) {
        console.error("Failed to fetch portfolio item:", error)
        return null
    }
}

export async function createPortfolioItem(prevState: any, formData: FormData) {
    try {
        const title = formData.get("title") as string
        const category = formData.get("category") as string
        const subCategory = formData.get("subCategory") as string // New field
        const type = formData.get("type") as string
        const orientation = formData.get("orientation") as string || "horizontal"
        const mediaUrl = formData.get("mediaUrl") as string
        let thumbnail = formData.get("thumbnail") as string
        const featured = formData.get("featured") === "on"

        console.log("Creating item with data:", { title, category, subCategory, type, orientation, mediaUrl }) // Debug log

        // Handle file upload
        const file = formData.get("file") as File
        const uploadedPath = await saveFile(file)
        if (uploadedPath) {
            thumbnail = uploadedPath
        }

        await prisma.portfolioItem.create({
            data: {
                title,
                category,
                subCategory,
                type,
                mediaUrl,
                thumbnail,
                featured,
                orientation,
                order: 0
            }
        })

        revalidatePath("/admin/portfolio")
        revalidatePath("/")
        return { message: "Item created successfully", success: true }
    } catch (error) {
        console.error("Failed to create item:", error)
        return { message: "Failed to create item", success: false }
    }
}

export async function updatePortfolioItem(id: string, prevState: any, formData: FormData) {
    try {
        const title = formData.get("title") as string
        const category = formData.get("category") as string
        const subCategory = formData.get("subCategory") as string // New field
        const type = formData.get("type") as string
        const orientation = formData.get("orientation") as string || "horizontal"
        let mediaUrl = formData.get("mediaUrl") as string
        let thumbnail = formData.get("thumbnail") as string
        const featured = formData.get("featured") === "on"

        // Handle file upload
        const file = formData.get("file") as File
        const uploadedPath = await saveFile(file)
        if (uploadedPath) {
            if (type === 'image') {
                mediaUrl = uploadedPath
                thumbnail = uploadedPath
            } else {
                thumbnail = uploadedPath
            }
        }

        await prisma.portfolioItem.update({
            where: { id },
            data: {
                title,
                category,
                subCategory,
                type,
                mediaUrl,
                thumbnail,
                featured,
                orientation,
            }
        })

        revalidatePath("/admin/portfolio")
        revalidatePath("/")
        return { message: "Item updated successfully", success: true }
    } catch (error) {
        console.error("Failed to update item:", error)
        return { message: "Failed to update item", success: false }
    }
}

export async function deletePortfolioItem(id: string) {
    try {
        await prisma.portfolioItem.delete({
            where: { id }
        })
        revalidatePath("/admin/portfolio")
        revalidatePath("/")
        return { message: "Item deleted successfully", success: true }
    } catch (error) {
        console.error("Failed to delete item:", error)
        return { message: "Failed to delete item", success: false }
    }
}
