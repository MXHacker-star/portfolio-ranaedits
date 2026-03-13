"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getCategories() {
    try {
        const categories = await prisma.portfolioCategory.findMany({
            orderBy: { name: 'asc' },
            include: { _count: { select: { items: true } } }
        })
        return categories
    } catch (error) {
        console.error("Error fetching categories:", error)
        return []
    }
}

export async function getCategory(id: string) {
    try {
        const category = await prisma.portfolioCategory.findUnique({
            where: { id }
        })
        return category
    } catch (error) {
        console.error("Error fetching category:", error)
        return null
    }
}

export async function createCategory(data: {
    name: string
    type: string // "video" or "graphic"
}) {
    try {
        await prisma.portfolioCategory.create({ data })
        revalidatePath('/')
        revalidatePath('/admin/categories')
        return { success: true, message: "Category created" }
    } catch (error) {
        console.error("Error creating category:", error)
        return { success: false, message: "Failed to create category" }
    }
}

export async function updateCategory(id: string, data: {
    name: string
    type: string
}) {
    try {
        await prisma.portfolioCategory.update({
            where: { id },
            data
        })
        revalidatePath('/')
        revalidatePath('/admin/categories')
        return { success: true, message: "Category updated" }
    } catch (error) {
        console.error("Error updating category:", error)
        return { success: false, message: "Failed to update category" }
    }
}

export async function deleteCategory(id: string) {
    try {
        await prisma.portfolioCategory.delete({
            where: { id }
        })
        revalidatePath('/')
        revalidatePath('/admin/categories')
        return { success: true, message: "Category deleted" }
    } catch (error) {
        console.error("Error deleting category:", error)
        if (error instanceof Error && error.message.includes("Foreign key constraint")) {
            return { success: false, message: "Cannot delete category with items. Reassign items first." }
        }
        return { success: false, message: "Failed to delete category" }
    }
}
