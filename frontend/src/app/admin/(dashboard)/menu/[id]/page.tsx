import { MenuLinkForm } from "@/components/admin/MenuLinkForm"
import { getMenuLink, getAllFlatMenuLinks } from "@/actions/admin-modules"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function EditMenuLinkPage({ params }: { params: { id: string } }) {
    const rawLink = await getMenuLink(params.id)
    const allLinks = await getAllFlatMenuLinks()

    if (!rawLink) {
        notFound()
    }

    const parentOptions = allLinks.map(l => ({
        id: l.id,
        label: `${l.label} (${l.type.charAt(0).toUpperCase() + l.type.slice(1)})`
    }))

    const rawObj: any = rawLink;

    const link = {
        id: rawObj.id,
        label: rawObj.label,
        path: rawObj.path,
        type: rawObj.type,
        order: rawObj.order,
        isActive: rawObj.isActive !== undefined ? rawObj.isActive : rawObj.visible !== undefined ? rawObj.visible : true,
        isExternal: rawObj.isExternal || false,
        icon: rawObj.icon || null,
        parentId: rawObj.parentId || null,
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Edit Menu Link</h1>
                <p className="text-muted-foreground">Update navigation link details.</p>
            </div>
            <MenuLinkForm initialData={link} parentOptions={parentOptions} />
        </div>
    )
}
