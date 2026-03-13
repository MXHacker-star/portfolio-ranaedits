"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// --- Menu Links ---

export async function getMenuLinks(includeChildren = true) {
    return await prisma.menuLink.findMany({
        where: { parentId: null }, // Only get top-level by default
        include: includeChildren ? {
            children: {
                orderBy: { order: 'asc' }
            }
        } : undefined,
        orderBy: { order: 'asc' }
    })
}

// Additional function to get ALL links flatly (useful for parent selection dropdown)
export async function getAllFlatMenuLinks() {
    return await prisma.menuLink.findMany({
        orderBy: { order: 'asc' }
    })
}

export async function getMenuLink(id: string) {
    return await prisma.menuLink.findUnique({
        where: { id },
        include: { children: true }
    })
}

export async function createMenuLink(data: {
    label: string
    path: string
    type: string
    order: number
    isActive: boolean
    isExternal: boolean
    icon?: string | null
    parentId?: string | null
}) {
    await prisma.menuLink.create({ data })
    revalidatePath('/')
    revalidatePath('/admin/menu')
}

export async function updateMenuLink(id: string, data: {
    label: string
    path: string
    type: string
    order: number
    isActive: boolean
    isExternal: boolean
    icon?: string | null
    parentId?: string | null
}) {
    // Prevent self-referencing parent
    if (data.parentId === id) {
        throw new Error("A menu cannot be its own parent.")
    }

    await prisma.menuLink.update({
        where: { id },
        data
    })
    revalidatePath('/')
    revalidatePath('/admin/menu')
}

export async function toggleMenuLinkVisibility(id: string, isActive: boolean) {
    await prisma.menuLink.update({
        where: { id },
        data: { isActive }
    })
    revalidatePath('/')
    revalidatePath('/admin/menu')
}

export async function reorderMenuLinks(orderedIds: string[]) {
    // Basic flat reorder logic
    const transactions = orderedIds.map((id, index) =>
        prisma.menuLink.update({
            where: { id },
            data: { order: index }
        })
    )
    await prisma.$transaction(transactions)
    revalidatePath('/')
    revalidatePath('/admin/menu')
}

export async function deleteMenuLink(id: string) {
    await prisma.menuLink.delete({
        where: { id }
    })
    revalidatePath('/')
    revalidatePath('/admin/menu')
}

// --- Packages ---

export async function getPackages() {
    return await prisma.package.findMany({
        orderBy: { order: 'asc' }
    })
}

export async function getPackage(id: string) {
    return await prisma.package.findUnique({
        where: { id }
    })
}

export async function createPackage(data: {
    name: string
    price: string
    description?: string
    features: string[]
    isPopular: boolean
    ctaText: string
    order: number
}) {
    await prisma.package.create({
        data: {
            ...data,
            features: data.features // Prisma handles Json[] automatically if typed correctly, but for Json type we might need to cast or pass as is
        }
    })
    revalidatePath('/')
    revalidatePath('/admin/packages')
}

export async function updatePackage(id: string, data: {
    name: string
    price: string
    description?: string
    features: string[]
    isPopular: boolean
    ctaText: string
    order: number
}) {
    await prisma.package.update({
        where: { id },
        data: {
            ...data,
            features: data.features
        }
    })
    revalidatePath('/')
    revalidatePath('/admin/packages')
}

export async function deletePackage(id: string) {
    await prisma.package.delete({
        where: { id }
    })
    revalidatePath('/')
    revalidatePath('/admin/packages')
}

// --- Stats ---

export async function getStats() {
    return await prisma.statItem.findMany({
        orderBy: { order: 'asc' }
    })
}

export async function getStat(id: string) {
    return await prisma.statItem.findUnique({
        where: { id }
    })
}

export async function createStat(data: {
    label: string
    value: string
    icon?: string
    section?: string
    order: number
    visible: boolean
}) {
    await prisma.statItem.create({ data: { ...data, section: data.section || 'results' } })
    revalidatePath('/')
    revalidatePath('/admin/stats')
}

export async function updateStat(id: string, data: {
    label: string
    value: string
    icon?: string
    section?: string
    order: number
    visible: boolean
}) {
    await prisma.statItem.update({
        where: { id },
        data
    })
    revalidatePath('/')
    revalidatePath('/admin/stats')
}

export async function deleteStat(id: string) {
    await prisma.statItem.delete({
        where: { id }
    })
    revalidatePath('/')
    revalidatePath('/admin/stats')
}

// --- SEO Config ---

export async function getSEOConfig() {
    const config = await prisma.sEOConfig.findFirst()
    if (!config) {
        return await prisma.sEOConfig.create({
            data: {}
        })
    }
    return config
}

export async function updateSEOConfig(data: {
    metaTitle?: string
    metaDesc?: string
    keywords?: string
    ogImage?: string
    scripts?: string
    focusKeyword?: string
    robotsIndex?: boolean
    robotsFollow?: boolean
    canonicalUrl?: string
    twitterCard?: string
    twitterTitle?: string
    twitterDesc?: string
    twitterImage?: string
    ogTitle?: string
    ogDesc?: string
    schemaType?: string
}) {
    const config = await getSEOConfig()
    await prisma.sEOConfig.update({
        where: { id: config.id },
        data
    })
    revalidatePath('/')
    revalidatePath('/admin/seo')
}

// --- Section Content ---

export async function getAllSections() {
    return await prisma.sectionContent.findMany({
        orderBy: { section: 'asc' }
    })
}

export async function getSectionContent(sectionId: string) {
    const section = await prisma.sectionContent.findUnique({
        where: { section: sectionId }
    })

    // Return default empty structure if not found, or let UI handle creation
    return section
}

export async function updateSectionContent(sectionId: string, data: {
    title?: string
    subtitle?: string
    content?: string
    mediaUrl?: string
    buttonText?: string
    buttonLink?: string
    settings?: any
}) {
    // Upsert: update if exists, create if not
    await prisma.sectionContent.upsert({
        where: { section: sectionId },
        update: data,
        create: {
            section: sectionId,
            ...data
        }
    })
    revalidatePath('/')
    revalidatePath(`/admin/sections/${sectionId}`)
}
