"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { promises as fs } from "fs"
import { join } from "path"

export async function uploadBlogImage(formData: FormData) {
    try {
        const file = formData.get("image") as File
        if (!file || file.size === 0) {
            return { success: false, error: "No file provided" }
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const filename = `${Date.now()}-${file.name.replaceAll(" ", "_")}`
        const uploadDir = join(process.cwd(), "public/uploads/blog")

        await fs.mkdir(uploadDir, { recursive: true })
        await fs.writeFile(join(uploadDir, filename), buffer)

        return { success: true, url: `/uploads/blog/${filename}` }
    } catch (error) {
        console.error("Error uploading blog image:", error)
        return { success: false, error: "Upload failed" }
    }
}

export interface BlogPost {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string | null
    coverImage: string | null
    author: string | null
    tags: any // Json
    published: boolean
    featured: boolean
    createdAt: Date
    updatedAt: Date
}

export async function getBlogPosts(page: number = 1, limit: number = 6) {
    try {
        const skip = (page - 1) * limit
        const posts = await prisma.blogPost.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: skip
        })

        const total = await prisma.blogPost.count({ where: { published: true } })

        return {
            posts,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                current: page
            }
        }
    } catch (error) {
        console.error("Error fetching blog posts:", error)
        return { posts: [], pagination: { total: 0, pages: 0, current: 1 } }
    }
}

export async function getBlogPost(slug: string) {
    try {
        const post = await prisma.blogPost.findUnique({
            where: { slug }
        })
        return post
    } catch (error) {
        console.error(`Error fetching blog post ${slug}:`, error)
        return null
    }
}

// ... existing imports ...

export async function createBlogPost(data: any) {
    try {
        const { title, content, excerpt, coverImage, tags, published, metaTitle, metaDesc, keywords } = data

        // Simple slug generation
        let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        const existing = await prisma.blogPost.findUnique({ where: { slug } })
        if (existing) {
            slug = `${slug}-${Date.now()}`
        }

        const post = await prisma.blogPost.create({
            data: {
                title,
                slug,
                content,
                excerpt: excerpt || null,
                coverImage: coverImage || null,
                tags,
                published: published === 'on' || published === true,
                metaTitle: metaTitle || null,
                metaDesc: metaDesc || null,
                keywords: keywords || null
            } as any
        })
        revalidatePath('/blog')
        revalidatePath('/admin/blog')
        return { success: true, post }
    } catch (error) {
        console.error("Error creating blog post:", error)
        return { success: false, error }
    }
}

export async function updateBlogPost(id: string, data: any) {
    try {
        const { title, content, excerpt, coverImage, tags, published, metaTitle, metaDesc, keywords } = data
        // We typically don't update slug to preserve SEO, or make it optional

        const post = await prisma.blogPost.update({
            where: { id },
            data: {
                title,
                content,
                excerpt: excerpt || null,
                coverImage: coverImage || null,
                tags,
                published: published === 'on' || published === true,
                metaTitle: metaTitle || null,
                metaDesc: metaDesc || null,
                keywords: keywords || null
            } as any
        })
        revalidatePath('/blog')
        revalidatePath(`/blog/${post.slug}`)
        revalidatePath('/admin/blog')
        return { success: true, post }
    } catch (error) {
        console.error("Error updating blog post:", error)
        return { success: false, error }
    }
}

export async function deleteBlogPost(id: string) {
    try {
        await prisma.blogPost.delete({ where: { id } })
        revalidatePath('/blog')
        revalidatePath('/admin/blog')
        return { success: true }
    } catch (error) {
        console.error("Error deleting blog post:", error)
        return { success: false, error }
    }
}

export async function getRecentPosts(limit: number = 3) {
    try {
        const posts = await prisma.blogPost.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
            take: limit
        })
        return posts
    } catch (error) {
        console.error("Error fetching recent posts:", error)
        return []
    }
}
