import { MenuLinkForm } from "@/components/admin/MenuLinkForm"
import { getAllFlatMenuLinks } from "@/actions/admin-modules"

export const dynamic = 'force-dynamic'

export default async function NewMenuLinkPage() {
    const allLinks = await getAllFlatMenuLinks()

    const parentOptions = allLinks.map(link => ({
        id: link.id,
        label: `${link.label} (${link.type.charAt(0).toUpperCase() + link.type.slice(1)})`
    }))

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">New Menu Link</h1>
                <p className="text-muted-foreground">Add a new link to your site navigation.</p>
            </div>
            <MenuLinkForm parentOptions={parentOptions} />
        </div>
    )
}
