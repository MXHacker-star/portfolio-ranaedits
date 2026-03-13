"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function getHeroData() {
    try {
        const hero = await prisma.heroSection.findUnique({
            where: { id: 1 }
        })
        return hero
    } catch (error) {
        console.error("Failed to fetch hero data:", error)
        return null
    }
}

export async function updateHeroData(prevState: any, formData: FormData) {
    try {
        const heading = formData.get("heading") as string
        const subheading = formData.get("subheading") as string
        const videoUrl = formData.get("videoUrl") as string
        const buttonText = formData.get("buttonText") as string
        const buttonLink = formData.get("buttonLink") as string
        const overlayOpacity = parseInt(formData.get("overlayOpacity") as string) || 40

        await prisma.heroSection.upsert({
            where: { id: 1 },
            update: {
                heading,
                subheading,
                videoUrl,
                buttonText,
                buttonLink,
                overlayOpacity,
            },
            create: {
                id: 1,
                heading,
                subheading,
                videoUrl,
                buttonText,
                buttonLink,
                overlayOpacity,
            }
        })

        revalidatePath("/")
        revalidatePath("/admin/hero")
        return { message: "Hero section updated successfully", success: true }
    } catch (error) {
        console.error("Failed to update hero data:", error)
        return { message: "Failed to update hero section", success: false }
    }
}
