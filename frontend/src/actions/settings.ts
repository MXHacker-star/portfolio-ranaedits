"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getGlobalSettings() {
    try {
        const settings = await prisma.globalSettings.findUnique({
            where: { id: 1 }
        })
        return settings
    } catch (error) {
        console.error("Error fetching global settings:", error)
        return null
    }
}

export async function updateGlobalSettings(prevState: any, formData: FormData) {
    try {
        const siteName = formData.get("siteName") as string
        const tagline = formData.get("tagline") as string
        const logoType = formData.get("logoType") as string
        const logoUrl = formData.get("logoUrl") as string
        const faviconUrl = formData.get("faviconUrl") as string
        const contactEmail = formData.get("contactEmail") as string
        const contactPhone = formData.get("contactPhone") as string
        const address = formData.get("address") as string
        const socialInstagram = formData.get("socialInstagram") as string
        const socialTwitter = formData.get("socialTwitter") as string
        const socialYoutube = formData.get("socialYoutube") as string

        await prisma.globalSettings.upsert({
            where: { id: 1 },
            update: {
                siteName,
                tagline,
                logoType,
                logoUrl,
                faviconUrl,
                contactEmail,
                contactPhone,
                address,
                socialInstagram,
                socialTwitter,
                socialYoutube
            },
            create: {
                id: 1,
                siteName,
                tagline,
                logoType,
                logoUrl,
                faviconUrl,
                contactEmail,
                socialInstagram
            }
        })
        revalidatePath("/", "layout") // Revalidate everything
        return { message: "Settings updated", success: true }
    } catch (error) {
        console.error("Error updating settings:", error)
        return { message: "Failed to update", success: false }
    }
}
