"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { promises as fs } from "fs"
import { join } from "path"

export interface ClientReview {
    id: string
    clientName: string
    companyName: string | null
    reviewText: string
    rating: number
    avatarUrl: string | null
    category: string | null
    visible: boolean
    order: number
}

// Upload avatar image to public/uploads/avatars/
export async function uploadReviewAvatar(formData: FormData) {
    try {
        const file = formData.get("avatar") as File
        if (!file || file.size === 0) {
            return { success: false, error: "No file provided" }
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const filename = `${Date.now()}-${file.name.replaceAll(" ", "_")}`
        const uploadDir = join(process.cwd(), "public/uploads/avatars")

        await fs.mkdir(uploadDir, { recursive: true })
        await fs.writeFile(join(uploadDir, filename), buffer)

        return { success: true, url: `/uploads/avatars/${filename}` }
    } catch (error) {
        console.error("Error uploading avatar:", error)
        return { success: false, error: "Upload failed" }
    }
}

// Frontend: only visible reviews
export async function getClientReviews() {
    try {
        const reviews = await prisma.clientReview.findMany({
            where: { visible: true },
            orderBy: { order: 'asc' }
        })
        return reviews
    } catch (error) {
        console.error("Error fetching client reviews:", error)
        return []
    }
}

// Admin: all reviews (visible + hidden)
export async function getAllClientReviews() {
    try {
        const reviews = await prisma.clientReview.findMany({
            orderBy: { order: 'asc' }
        })
        return reviews
    } catch (error) {
        console.error("Error fetching all client reviews:", error)
        return []
    }
}

// Get total count for sidebar badge
export async function getClientReviewCount() {
    try {
        const total = await prisma.clientReview.count()
        const visible = await prisma.clientReview.count({ where: { visible: true } })
        return { total, visible }
    } catch (error) {
        console.error("Error counting reviews:", error)
        return { total: 0, visible: 0 }
    }
}

export async function createClientReview(data: any) {
    try {
        const { clientName, companyName, reviewText, rating, avatarUrl, category, visible, order } = data
        console.log("Creating review with data:", { clientName, companyName, reviewText, rating, avatarUrl, category, visible, order })
        const review = await prisma.clientReview.create({
            data: {
                clientName,
                companyName: companyName || null,
                reviewText,
                rating: Number(rating) || 5,
                avatarUrl: avatarUrl || null,
                category: category || null,
                visible: visible === 'on' || visible === true || visible === 'true',
                order: Number(order) || 0
            } as any
        })
        revalidatePath('/')
        revalidatePath('/admin/reviews')
        return { success: true }
    } catch (error: any) {
        console.error("Error creating review:", error)
        return { success: false, error: error?.message || "Failed to create review" }
    }
}

export async function updateClientReview(id: string, data: any) {
    try {
        const { clientName, companyName, reviewText, rating, avatarUrl, category, visible, order } = data
        console.log("Updating review", id, "with data:", { clientName, companyName, reviewText, rating, avatarUrl, category, visible, order })
        const review = await prisma.clientReview.update({
            where: { id },
            data: {
                clientName,
                companyName: companyName || null,
                reviewText,
                rating: Number(rating) || 5,
                avatarUrl: avatarUrl || null,
                category: category || null,
                visible: visible === 'on' || visible === true || visible === 'true',
                order: Number(order) || 0
            } as any
        })
        revalidatePath('/')
        revalidatePath('/admin/reviews')
        return { success: true }
    } catch (error: any) {
        console.error("Error updating review:", error)
        return { success: false, error: error?.message || "Failed to update review" }
    }
}

// Bulk reorder reviews (drag & drop)
export async function reorderClientReviews(orderedIds: string[]) {
    try {
        const updates = orderedIds.map((id, index) =>
            prisma.clientReview.update({
                where: { id },
                data: { order: index }
            })
        )
        await prisma.$transaction(updates)
        revalidatePath('/')
        revalidatePath('/admin/reviews')
        return { success: true }
    } catch (error) {
        console.error("Error reordering reviews:", error)
        return { success: false, error }
    }
}

export async function deleteClientReview(id: string) {
    try {
        await prisma.clientReview.delete({ where: { id } })
        revalidatePath('/')
        revalidatePath('/admin/reviews')
        return { success: true }
    } catch (error) {
        console.error("Error deleting review:", error)
        return { success: false, error }
    }
}
