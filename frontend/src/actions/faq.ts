"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getFAQs() {
    try {
        const faqs = await prisma.fAQ.findMany({
            orderBy: { order: 'asc' }
        })
        return faqs
    } catch (error) {
        console.error("Error fetching FAQs:", error)
        return []
    }
}

export async function getFAQ(id: string) {
    try {
        const faq = await prisma.fAQ.findUnique({
            where: { id }
        })
        return faq
    } catch (error) {
        console.error("Error fetching FAQ:", error)
        return null
    }
}

export async function createFAQ(data: {
    question: string
    answer: string
    category?: string
    order: number
}) {
    try {
        await prisma.fAQ.create({ data })
        revalidatePath('/')
        revalidatePath('/admin/faq')
        return { success: true, message: "FAQ created" }
    } catch (error) {
        console.error("Error creating FAQ:", error)
        return { success: false, message: "Failed to create FAQ" }
    }
}

export async function updateFAQ(id: string, data: {
    question: string
    answer: string
    category?: string
    order: number
}) {
    try {
        await prisma.fAQ.update({
            where: { id },
            data
        })
        revalidatePath('/')
        revalidatePath('/admin/faq')
        return { success: true, message: "FAQ updated" }
    } catch (error) {
        console.error("Error updating FAQ:", error)
        return { success: false, message: "Failed to update FAQ" }
    }
}

export async function deleteFAQ(id: string) {
    try {
        await prisma.fAQ.delete({
            where: { id }
        })
        revalidatePath('/')
        revalidatePath('/admin/faq')
        return { success: true, message: "FAQ deleted" }
    } catch (error) {
        console.error("Error deleting FAQ:", error)
        return { success: false, message: "Failed to delete FAQ" }
    }
}
