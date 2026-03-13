"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getSocialLinks() {
    try {
        const links = await prisma.socialLink.findMany({
            orderBy: { order: 'asc' }
        })
        return { success: true, data: links }
    } catch (error) {
        console.error("Failed to fetch social links:", error)
        return { success: false, error: "Failed to fetch social links" }
    }
}

export async function createSocialLink(formData: FormData) {
    try {
        const platform = formData.get("platform") as string
        const url = formData.get("url") as string
        const icon = formData.get("icon") as string
        const isActiveStr = formData.get("isActive") as string

        // Count existing to set order
        const count = await prisma.socialLink.count()

        await prisma.socialLink.create({
            data: {
                platform,
                url,
                icon,
                isActive: isActiveStr === "true",
                order: count
            }
        })

        revalidatePath("/", "layout")
        revalidatePath("/admin/settings")
        return { success: true }
    } catch (error) {
        console.error("Failed to create social link:", error)
        return { success: false, error: "Failed to create social link" }
    }
}

export async function updateSocialLink(id: string, formData: FormData) {
    try {
        const platform = formData.get("platform") as string
        const url = formData.get("url") as string
        const icon = formData.get("icon") as string
        const isActiveStr = formData.get("isActive") as string

        await prisma.socialLink.update({
            where: { id },
            data: {
                platform,
                url,
                icon,
                isActive: isActiveStr === "true",
            }
        })

        revalidatePath("/", "layout")
        revalidatePath("/admin/settings")
        return { success: true }
    } catch (error) {
        console.error("Failed to update social link:", error)
        return { success: false, error: "Failed to update social link" }
    }
}

export async function deleteSocialLink(id: string) {
    try {
        await prisma.socialLink.delete({
            where: { id }
        })

        revalidatePath("/", "layout")
        revalidatePath("/admin/settings")
        return { success: true }
    } catch (error) {
        console.error("Failed to delete social link:", error)
        return { success: false, error: "Failed to delete social link" }
    }
}

export async function toggleSocialLink(id: string, isActive: boolean) {
    try {
        await prisma.socialLink.update({
            where: { id },
            data: { isActive }
        })

        revalidatePath("/", "layout")
        revalidatePath("/admin/settings")
        return { success: true }
    } catch (error) {
        console.error("Failed to toggle social link:", error)
        return { success: false, error: "Failed to toggle social link" }
    }
}

export async function reorderSocialLinks(updates: { id: string, order: number }[]) {
    try {
        await prisma.$transaction(
            updates.map(update =>
                prisma.socialLink.update({
                    where: { id: update.id },
                    data: { order: update.order }
                })
            )
        )

        revalidatePath("/", "layout")
        revalidatePath("/admin/settings")
        return { success: true }
    } catch (error) {
        console.error("Failed to reorder social links:", error)
        return { success: false, error: "Failed to reorder social links" }
    }
}
