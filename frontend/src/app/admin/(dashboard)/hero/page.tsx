import { getHeroData } from "@/actions/hero"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video } from "lucide-react"
import { HeroForm } from "@/components/admin/HeroForm"

export default async function HeroSettingsPage() {
    const hero = await getHeroData()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Hero Section</h2>
                <p className="text-muted-foreground">Manage the main banner of your portfolio.</p>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-white/10">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                            <Video className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-white">Content Settings</CardTitle>
                            <CardDescription>Update the heading, description, and background video.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <HeroForm hero={hero} />
                </CardContent>
            </Card>
        </div>
    )
}
