import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { signOut } from "@/lib/auth"
import { Sidebar } from "@/components/admin/Sidebar"
import { getClientReviewCount } from "@/actions/client-reviews"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session) {
        redirect("/admin/login")
    }

    const reviewStats = await getClientReviewCount()

    return (
        <div className="flex h-screen bg-black">
            {/* Sidebar */}
            <Sidebar user={{ name: session.user?.name, email: session.user?.email }} reviewCount={reviewStats.total} />

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-background">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}


