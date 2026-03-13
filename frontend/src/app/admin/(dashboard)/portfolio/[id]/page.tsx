import { getPortfolioItem } from "@/actions/portfolio"
import { PortfolioForm } from "@/components/admin/PortfolioForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"



export default async function EditPortfolioItemPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const item = await getPortfolioItem(id)
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

    if (!item) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/portfolio">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Edit Item</h2>
                    <p className="text-muted-foreground">Update project details.</p>
                </div>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-white/10 max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-white">Project Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <PortfolioForm item={item} categories={categories} />
                </CardContent>
            </Card>
        </div>
    )
}
