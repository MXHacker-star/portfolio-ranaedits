"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getClientLogos() {
    try {
        const logos = await prisma.clientLogo.findMany({
            orderBy: {
                order: 'asc'
            }
        })
        return logos
    } catch (error) {
        console.error("Failed to fetch client logos:", error)
        return []
    }
}

export async function addClientLogo(data: { name: string, imageUrl: string }) {
    try {
        const maxOrderLogo = await prisma.clientLogo.findFirst({
            orderBy: { order: 'desc' }
        });

        await prisma.clientLogo.create({
            data: {
                ...data,
                order: maxOrderLogo ? maxOrderLogo.order + 1 : 0
            }
        })
        revalidatePath('/')
        revalidatePath('/admin/stats/client-logos')
        return { success: true }
    } catch (error) {
        console.error("Failed to add client logo:", error)
        throw new Error("Failed to add client logo")
    }
}

export async function updateClientLogo(id: string, data: { name: string, imageUrl: string }) {
    try {
        await prisma.clientLogo.update({
            where: { id },
            data
        })
        revalidatePath('/')
        revalidatePath('/admin/stats/client-logos')
        return { success: true }
    } catch (error) {
        console.error("Failed to update client logo:", error)
        throw new Error("Failed to update client logo")
    }
}

export async function updateClientLogoOrder(id: string, direction: 'up' | 'down') {
    try {
        const item = await prisma.clientLogo.findUnique({ where: { id } })
        if (!item) return

        const allItems = await prisma.clientLogo.findMany({
            orderBy: { order: 'asc' }
        })

        const currentIndex = allItems.findIndex(i => i.id === id)
        if (direction === 'up' && currentIndex > 0) {
            const prevItem = allItems[currentIndex - 1]
            await prisma.$transaction([
                prisma.clientLogo.update({ where: { id }, data: { order: prevItem.order } }),
                prisma.clientLogo.update({ where: { id: prevItem.id }, data: { order: item.order } })
            ])
        } else if (direction === 'down' && currentIndex < allItems.length - 1) {
            const nextItem = allItems[currentIndex + 1]
            await prisma.$transaction([
                prisma.clientLogo.update({ where: { id }, data: { order: nextItem.order } }),
                prisma.clientLogo.update({ where: { id: nextItem.id }, data: { order: item.order } })
            ])
        }

        revalidatePath('/')
        revalidatePath('/admin/stats/client-logos')
        return { success: true }
    } catch (error) {
        console.error("Failed to update client logo order:", error)
        throw new Error("Failed to update client logo order")
    }
}

export async function deleteClientLogo(id: string) {
    try {
        await prisma.clientLogo.delete({
            where: { id }
        })
        revalidatePath('/')
        revalidatePath('/admin/stats/client-logos')
        return { success: true }
    } catch (error) {
        console.error("Failed to delete client logo:", error)
        throw new Error("Failed to delete client logo")
    }
}
