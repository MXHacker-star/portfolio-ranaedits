import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        console.log("Starting verification...")

        // Direct Prisma queries to see raw errors
        const services = await prisma.service.findMany()
        console.log("Services fetched:", services.length)

        const testimonials = await prisma.testimonial.findMany()
        const team = await prisma.teamMember.findMany()
        const faqs = await prisma.fAQ.findMany()
        const menuLinks = await prisma.menuLink.findMany()

        let categories = [], videoProjects = [], graphicProjects = []
        try {
            categories = await prisma.portfolioCategory.findMany()
            videoProjects = await prisma.portfolioItem.findMany({ where: { type: 'video' } })
            graphicProjects = await prisma.portfolioItem.findMany({ where: { type: 'image' } })
        } catch (e) {
            console.error("Failed to fetch new schema items:", e)
            // Return specific error for schema issues
            return NextResponse.json({
                status: "error",
                message: "Schema mismatch or DB error: " + (e instanceof Error ? e.message : String(e))
            }, { status: 500 })
        }

        return NextResponse.json({
            status: "success",
            data: {
                services: { count: services.length, items: services },
                testimonials: { count: testimonials.length, items: testimonials },
                team: { count: team.length, items: team },
                faqs: { count: faqs.length, items: faqs },
                menuLinks: { count: menuLinks.length, items: menuLinks },
                categories: { count: categories.length, items: categories },
                videoProjects: { count: videoProjects.length, items: videoProjects },
                graphicProjects: { count: graphicProjects.length, items: graphicProjects }
            }
        })
    } catch (error) {
        console.error("Verification error:", error)
        return NextResponse.json({
            status: "error",
            message: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 })
    }
}
