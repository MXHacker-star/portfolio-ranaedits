"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { sendEmailNotification } from "@/lib/notifications"

// ============================================
// Submit a CTA form (called from frontend)
// ============================================
export async function submitForm(formData: {
    formType: string
    source?: string
    name: string
    email: string
    phone?: string
    whatsapp?: string
    company?: string
    message?: string
    metadata?: any // satisfy Prisma InputJsonValue
    scheduledDate?: string
    scheduledTime?: string
}) {
    try {
        const submission = await prisma.formSubmission.create({
            data: {
                formType: formData.formType,
                source: formData.source || null,
                name: formData.name,
                email: formData.email,
                phone: formData.phone || null,
                whatsapp: formData.whatsapp || null,
                company: formData.company || null,
                message: formData.message || null,
                metadata: formData.metadata || null,
                scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : null,
                scheduledTime: formData.scheduledTime || null,
            }
        })

        revalidatePath("/admin/leads")

        // Send email notification (non-blocking)
        sendEmailNotification({
            id: submission.id,
            formType: formData.formType,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            whatsapp: formData.whatsapp,
            company: formData.company,
            message: formData.message,
            metadata: formData.metadata,
            scheduledDate: submission.scheduledDate,
            scheduledTime: submission.scheduledTime,
            source: formData.source,
        }).catch(() => { }) // Silently catch — don't break form submission

        return { success: true, id: submission.id }
    } catch (error) {
        console.error("Failed to submit form:", error)
        return { success: false, error: "Failed to submit form" }
    }
}

// ============================================
// Get all submissions (for admin dashboard)
// ============================================
export async function getSubmissions(filters?: {
    formType?: string
    status?: string
    dateFrom?: string
    dateTo?: string
    search?: string
}) {
    try {
        const where: any = {}

        if (filters?.formType && filters.formType !== "all") {
            where.formType = filters.formType
        }
        if (filters?.status && filters.status !== "all") {
            where.status = filters.status
        }
        if (filters?.dateFrom || filters?.dateTo) {
            where.createdAt = {}
            if (filters.dateFrom) where.createdAt.gte = new Date(filters.dateFrom)
            if (filters.dateTo) where.createdAt.lte = new Date(filters.dateTo + "T23:59:59")
        }
        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search } },
                { email: { contains: filters.search } },
                { company: { contains: filters.search } },
            ]
        }

        const submissions = await prisma.formSubmission.findMany({
            where,
            orderBy: { createdAt: "desc" },
        })

        return submissions
    } catch (error) {
        console.error("Failed to fetch submissions:", error)
        return []
    }
}

// ============================================
// Get a single submission
// ============================================
export async function getSubmission(id: string) {
    try {
        const submission = await prisma.formSubmission.findUnique({
            where: { id }
        })
        return submission
    } catch (error) {
        console.error("Failed to fetch submission:", error)
        return null
    }
}

// ============================================
// Update submission status
// ============================================
export async function updateSubmissionStatus(id: string, status: string, adminNotes?: string) {
    try {
        const data: any = {
            status,
            ...(adminNotes !== undefined && { adminNotes }),
        }

        // Track when admin first responds
        if (status === "contacted" || status === "proposal_sent") {
            const existing = await prisma.formSubmission.findUnique({ where: { id } })
            if (existing && !existing.respondedAt) {
                data.respondedAt = new Date()
            }
        }

        await prisma.formSubmission.update({
            where: { id },
            data,
        })

        revalidatePath("/admin/leads")
        revalidatePath(`/admin/leads/${id}`)
        return { success: true }
    } catch (error) {
        console.error("Failed to update submission:", error)
        return { success: false, error: "Failed to update" }
    }
}

// ============================================
// Delete submission
// ============================================
export async function deleteSubmission(id: string) {
    try {
        await prisma.formSubmission.delete({
            where: { id }
        })

        revalidatePath("/admin/leads")
        return { success: true }
    } catch (error) {
        console.error("Failed to delete submission:", error)
        return { success: false, error: "Failed to delete" }
    }
}

// ============================================
// Get submission counts by status (for tabs)
// ============================================
export async function getSubmissionCounts() {
    try {
        const [total, newCount, contacted, proposalSent, accepted, rejected, completed] = await Promise.all([
            prisma.formSubmission.count(),
            prisma.formSubmission.count({ where: { status: "new" } }),
            prisma.formSubmission.count({ where: { status: "contacted" } }),
            prisma.formSubmission.count({ where: { status: "proposal_sent" } }),
            prisma.formSubmission.count({ where: { status: "accepted" } }),
            prisma.formSubmission.count({ where: { status: "rejected" } }),
            prisma.formSubmission.count({ where: { status: "completed" } }),
        ])

        return { total, new: newCount, contacted, proposal_sent: proposalSent, accepted, rejected, completed }
    } catch (error) {
        console.error("Failed to get counts:", error)
        return { total: 0, new: 0, contacted: 0, proposal_sent: 0, accepted: 0, rejected: 0, completed: 0 }
    }
}
