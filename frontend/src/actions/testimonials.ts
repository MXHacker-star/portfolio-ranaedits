"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getTestimonials() {
    try {
        const testimonials = await prisma.testimonial.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return testimonials
    } catch (error) {
        console.error("Error fetching testimonials:", error)
        return []
    }
}

export async function getTestimonial(id: string) {
    try {
        const testimonial = await prisma.testimonial.findUnique({
            where: { id }
        })
        return testimonial
    } catch (error) {
        console.error("Error fetching testimonial:", error)
        return null
    }
}

export async function createTestimonial(data: {
    name: string
    role: string
    content?: string
    videoUrl?: string
    avatarUrl?: string
    rating?: number
}) {
    try {
        await prisma.testimonial.create({ data })
        revalidatePath('/')
        revalidatePath('/admin/testimonials')
        return { success: true, message: "Testimonial created" }
    } catch (error) {
        console.error("Error creating testimonial:", error)
        return { success: false, message: "Failed to create testimonial" }
    }
}

export async function updateTestimonial(id: string, data: {
    name: string
    role: string
    content?: string
    videoUrl?: string
    avatarUrl?: string
    rating?: number
}) {
    try {
        await prisma.testimonial.update({
            where: { id },
            data
        })
        revalidatePath('/')
        revalidatePath('/admin/testimonials')
        return { success: true, message: "Testimonial updated" }
    } catch (error) {
        console.error("Error updating testimonial:", error)
        return { success: false, message: "Failed to update testimonial" }
    }
}

export async function deleteTestimonial(id: string) {
    try {
        await prisma.testimonial.delete({
            where: { id }
        })
        revalidatePath('/')
        revalidatePath('/admin/testimonials')
        return { success: true, message: "Testimonial deleted" }
    } catch (error) {
        console.error("Error deleting testimonial:", error)
        return { success: false, message: "Failed to delete testimonial" }
    }
}
