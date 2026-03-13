import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getMenuLinks } from "@/actions/admin-modules"
import { MenuListManager } from "@/components/admin/MenuListManager"

export const dynamic = 'force-dynamic'

export default async function MenuManagerPage() {
    const RawMenuLinks = await getMenuLinks(true) // Fetch with children

    // Map Prisma objects to the simpler format required by MenuListManager to avoid strict type mismatched
    const menuLinks = RawMenuLinks.map(link => ({
        ...link,
    }))

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Menu Links</h1>
                    <p className="text-muted-foreground">Manage your header and footer navigation.</p>
                </div>
                <Link href="/admin/menu/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Link
                    </Button>
                </Link>
            </div>

            <MenuListManager initialLinks={menuLinks} />
        </div>
    )
}
