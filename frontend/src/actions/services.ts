"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getServices() {
    try {
        const services = await prisma.service.findMany({
            orderBy: { order: 'asc' }
        })
        return services
    } catch (error) {
        console.error("Error fetching services:", error)
        return []
    }
}

export async function getService(id: string) {
    try {
        const service = await prisma.service.findUnique({
            where: { id }
        })
        return service
    } catch (error) {
        console.error("Error fetching service:", error)
        return null
    }
}

export async function createService(data: {
    title: string
    description: string
    icon: string
    link?: string
    order: number
}) {
    try {
        await prisma.service.create({ data })
        revalidatePath('/')
        revalidatePath('/admin/services')
        return { success: true, message: "Service created" }
    } catch (error) {
        console.error("Error creating service:", error)
        return { success: false, message: "Failed to create service" }
    }
}

export async function updateService(id: string, data: {
    title: string
    description: string
    icon: string
    link?: string
    order: number
}) {
    try {
        await prisma.service.update({
            where: { id },
            data
        })
        revalidatePath('/')
        revalidatePath('/admin/services')
        return { success: true, message: "Service updated" }
    } catch (error) {
        console.error("Error updating service:", error)
        return { success: false, message: "Failed to update service" }
    }
}

export async function deleteService(id: string) {
    try {
        await prisma.service.delete({
            where: { id }
        })
        revalidatePath('/')
        revalidatePath('/admin/services')
        return { success: true, message: "Service deleted" }
    } catch (error) {
        console.error("Error deleting service:", error)
        return { success: false, message: "Failed to delete service" }
    }
}
