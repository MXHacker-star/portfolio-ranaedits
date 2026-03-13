"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// =============================================
// CASE STUDIES (Results Page video cards)
// =============================================

export async function getCaseStudies() {
    try {
        return await prisma.caseStudy.findMany({
            where: { visible: true },
            orderBy: { order: 'asc' }
        })
    } catch (error) {
        console.error("Error fetching case studies:", error)
        return []
    }
}

export async function getAllCaseStudies() {
    try {
        return await prisma.caseStudy.findMany({
            orderBy: { order: 'asc' }
        })
    } catch (error) {
        console.error("Error fetching all case studies:", error)
        return []
    }
}

export async function getCaseStudy(id: string) {
    return await prisma.caseStudy.findUnique({ where: { id } })
}

export async function createCaseStudy(data: {
    title: string
    views: string
    description: string
    youtubeId: string
    order?: number
    visible?: boolean
}) {
    await prisma.caseStudy.create({
        data: {
            ...data,
            order: data.order || 0,
            visible: data.visible ?? true
        }
    })
    revalidatePath('/results')
    revalidatePath('/admin/stats/results-page')
}

export async function updateCaseStudy(id: string, data: {
    title: string
    views: string
    description: string
    youtubeId: string
    order?: number
    visible?: boolean
}) {
    await prisma.caseStudy.update({
        where: { id },
        data
    })
    revalidatePath('/results')
    revalidatePath('/admin/stats/results-page')
}

export async function deleteCaseStudy(id: string) {
    await prisma.caseStudy.delete({ where: { id } })
    revalidatePath('/results')
    revalidatePath('/admin/stats/results-page')
}

// =============================================
// RESULTS PAGE CONTENT (SectionContent wrapper)
// =============================================

export async function getResultsPageContent() {
    try {
        const content = await prisma.sectionContent.findUnique({
            where: { section: 'results_page' }
        })
        return content
    } catch (error) {
        console.error("Error fetching results page content:", error)
        return null
    }
}

export async function updateResultsPageContent(data: {
    title?: string
    subtitle?: string
    content?: string
    buttonText?: string
    buttonLink?: string
    settings?: any
}) {
    await prisma.sectionContent.upsert({
        where: { section: 'results_page' },
        update: data,
        create: {
            section: 'results_page',
            ...data
        }
    })
    revalidatePath('/results')
    revalidatePath('/admin/stats/results-page')
}
