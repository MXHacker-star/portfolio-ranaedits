import { PortfolioForm } from "@/components/admin/PortfolioForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"



export const dynamic = 'force-dynamic'

export default async function NewPortfolioItemPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
    const { category } = await searchParams
    // Static categories for now
    const categories = [
        { id: "v1", name: "Vlog", type: "video" },
        { id: "v2", name: "Commercial", type: "video" },
        { id: "v3", name: "Social Media", type: "video" },
        { id: "v4", name: "Documentary", type: "video" },
        { id: "v5", name: "Music Video", type: "video" },
        { id: "v6", name: "YouTube", type: "video" },
        { id: "g1", name: "Logo", type: "graphic" },
        { id: "g2", name: "Brand Identity", type: "graphic" },
        { id: "g3", name: "Social Media", type: "graphic" },
        { id: "g4", name: "Poster", type: "graphic" },
        { id: "g5", name: "Product Design", type: "graphic" },
        { id: "g6", name: "Thumbnail", type: "graphic" },
        { id: "g7", name: "Ads", type: "graphic" }
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/admin/portfolio${category ? `?category=${category}` : ''}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Add New Item</h2>
                    <p className="text-muted-foreground">Create a new project entry.</p>
                </div>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-white/10 max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-white">Project Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <PortfolioForm defaultCategory={category} categories={categories} />
                </CardContent>
            </Card>
        </div>
    )
}
