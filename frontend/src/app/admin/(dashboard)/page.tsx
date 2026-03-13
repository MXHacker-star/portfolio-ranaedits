import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Layers, Users, Briefcase, MessageSquare } from "lucide-react"

// const prisma = new PrismaClient()

async function getStats() {
    try {
        const [portfolioCount, teamCount, serviceCount, testimonialCount] = await Promise.all([
            prisma.portfolioItem.count(),
            prisma.teamMember.count(),
            prisma.service.count(),
            prisma.testimonial.count()
        ])

        return {
            portfolioCount,
            teamCount,
            serviceCount,
            testimonialCount
        }
    } catch (error) {
        console.error("Error fetching stats:", error)
        return {
            portfolioCount: 0,
            teamCount: 0,
            serviceCount: 0,
            testimonialCount: 0
        }
    }
}

export default async function AdminDashboard() {
    const stats = await getStats()

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
                <p className="text-muted-foreground">Welcome back! Here's an overview of your portfolio content.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Portfolio Items" value={stats.portfolioCount} icon={<Layers className="h-4 w-4 text-primary" />} />
                <StatsCard title="Services" value={stats.serviceCount} icon={<Briefcase className="h-4 w-4 text-primary" />} />
                <StatsCard title="Team Members" value={stats.teamCount} icon={<Users className="h-4 w-4 text-primary" />} />
                <StatsCard title="Testimonials" value={stats.testimonialCount} icon={<MessageSquare className="h-4 w-4 text-primary" />} />
            </div>
        </div>
    )
}

function StatsCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
    return (
        <Card className="bg-card/50 backdrop-blur-sm border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">{value}</div>
            </CardContent>
        </Card>
    )
}
