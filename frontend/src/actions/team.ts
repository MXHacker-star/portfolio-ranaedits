"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { promises as fs } from "fs"
import { join } from "path"

export async function uploadTeamImage(formData: FormData) {
    try {
        const file = formData.get("image") as File
        if (!file || file.size === 0) {
            return { success: false, error: "No file provided" }
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const filename = `${Date.now()}-${file.name.replaceAll(" ", "_")}`
        const uploadDir = join(process.cwd(), "public/uploads/team")

        await fs.mkdir(uploadDir, { recursive: true })
        await fs.writeFile(join(uploadDir, filename), buffer)

        return { success: true, url: `/uploads/team/${filename}` }
    } catch (error) {
        console.error("Error uploading team image:", error)
        return { success: false, error: "Upload failed" }
    }
}

export async function getTeamMembers() {
    try {
        const team = await prisma.teamMember.findMany({
            orderBy: { order: 'asc' }
        })
        return team
    } catch (error) {
        console.error("Error fetching team members:", error)
        return []
    }
}

export async function getTeamMember(id: string) {
    try {
        const member = await prisma.teamMember.findUnique({
            where: { id }
        })
        return member
    } catch (error) {
        console.error("Error fetching team member:", error)
        return null
    }
}

export async function createTeamMember(data: {
    name: string
    role: string
    imageUrl: string
    bio?: string
    order: number
}) {
    try {
        await prisma.teamMember.create({ data })
        revalidatePath('/')
        revalidatePath('/admin/team')
        return { success: true, message: "Team member created" }
    } catch (error) {
        console.error("Error creating team member:", error)
        return { success: false, message: "Failed to create team member" }
    }
}

export async function updateTeamMember(id: string, data: {
    name: string
    role: string
    imageUrl: string
    bio?: string
    order: number
}) {
    try {
        await prisma.teamMember.update({
            where: { id },
            data
        })
        revalidatePath('/')
        revalidatePath('/admin/team')
        return { success: true, message: "Team member updated" }
    } catch (error) {
        console.error("Error updating team member:", error)
        return { success: false, message: "Failed to update team member" }
    }
}

export async function deleteTeamMember(id: string) {
    try {
        await prisma.teamMember.delete({
            where: { id }
        })
        revalidatePath('/')
        revalidatePath('/admin/team')
        return { success: true, message: "Team member deleted" }
    } catch (error) {
        console.error("Error deleting team member:", error)
        return { success: false, message: "Failed to delete team member" }
    }
}
