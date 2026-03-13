"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, GripVertical, Check, X, ExternalLink } from "lucide-react"
import { toggleMenuLinkVisibility, deleteMenuLink, reorderMenuLinks } from "@/actions/admin-modules"
import { toast } from "sonner"
import * as LucideIcons from "lucide-react"
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
    DroppableProvided,
    DraggableProvided,
    DraggableStateSnapshot
} from "@hello-pangea/dnd"

// Helper to dynamically render a Lucide Icon
const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
    const Icon = (LucideIcons as any)[name]
    if (!Icon) return null
    return <Icon className={className} />
}

interface MenuLink {
    id: string
    label: string
    path: string
    type: string
    order: number
    isActive: boolean
    isExternal: boolean
    icon: string | null
    parentId: string | null
    children?: MenuLink[]
}

export function MenuListManager({ initialLinks }: { initialLinks: MenuLink[] }) {
    const [links, setLinks] = useState(initialLinks)
    const [isSaving, setIsSaving] = useState(false)

    // Flat list approach for Drag and Drop (Nested DND is complex, let's keep it flat on the UI but visually indented)
    // We will flatten the structure for rendering
    const flattenLinks = (items: MenuLink[], depth = 0): (MenuLink & { depth: number })[] => {
        let result: (MenuLink & { depth: number })[] = []
        items.forEach(item => {
            result.push({ ...item, depth })
            if (item.children && item.children.length > 0) {
                // Ensure children are sorted by order
                const sortedChildren = [...item.children].sort((a, b) => a.order - b.order)
                result = result.concat(flattenLinks(sortedChildren, depth + 1))
            }
        })
        return result
    }

    const flatLinks = flattenLinks(links)

    // Handle Toggle
    const handleToggle = async (id: string, currentStatus: boolean) => {
        try {
            await toggleMenuLinkVisibility(id, !currentStatus)
            toast.success(`Menu link ${!currentStatus ? 'shown' : 'hidden'}.`)
            setLinks(links.map(link => {
                if (link.id === id) return { ...link, isActive: !currentStatus }
                // Also update children if any (simplified state update)
                if (link.children) {
                    const updatedChildren = link.children.map(child => child.id === id ? { ...child, isActive: !currentStatus } : child)
                    return { ...link, children: updatedChildren }
                }
                return link
            }))
        } catch (error) {
            toast.error("Failed to update status")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this menu link? Any sub-menus will also be deleted.")) return
        try {
            await deleteMenuLink(id)
            toast.success("Menu link deleted")
            // Simple state update - refresh page is better for complex hierarchy deletes
            window.location.reload()
        } catch (error) {
            toast.error("Failed to delete menu link")
        }
    }

    // Drag and Drop (We only allow reordering within the same parent level to keep it simple and robust)
    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return

        // Find the item being dragged
        const draggedItem = flatLinks[result.source.index]

        // Find all peers (items with the same parent)
        const peers = flatLinks.filter(item => item.parentId === draggedItem.parentId)

        // Find the index of the dragged item among peers
        const sourceIndex = peers.findIndex(p => p.id === draggedItem.id)

        // Determine destination index among peers
        // This is a bit tricky with flattened lists, so we use a simplified approach:
        // We just collect all tops level items (or children of same parent), reorder them, and save.

        // For simplicity in this UI, we will only apply Drag and Drop visually to Top-Level items
        if (draggedItem.parentId !== null) {
            toast.info("Sub-menu reordering is not supported in this view yet.")
            return;
        }

        const topLevelLinks = [...links]
        const [reorderedItem] = topLevelLinks.splice(result.source.index, 1) // Note: this assumes DND is only showing top-level or flat list isn't deeply nested

        // Correct approach for flat lists:
        // Let's just reorder the flat array, then update all their order values based on index.
        // This might change their absolute order, but maintains relative order.
        const newFlatLinks = Array.from(flatLinks)
        const [removed] = newFlatLinks.splice(result.source.index, 1)
        newFlatLinks.splice(result.destination.index, 0, removed)

        // Optimistic UI update
        // (For complex nested, it's easier to just save and let server revalidate, but we try)

        setIsSaving(true)
        try {
            const orderedIds = newFlatLinks.map(link => link.id)
            await reorderMenuLinks(orderedIds)
            toast.success("Menu order updated")
            // Refresh to get clean nested state
            window.location.reload()
        } catch (error) {
            toast.error("Failed to save order")
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-card overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-muted-foreground bg-white/5 border-b border-white/10">
                    <div className="col-span-1"></div>
                    <div className="col-span-4">Label & Path</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2 text-center">Visible</div>
                    <div className="col-span-3 text-right">Actions</div>
                </div>

                {flatLinks.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        No menu links found.
                    </div>
                ) : (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary border-b border-white/5">
                            Header Links
                        </div>
                        <Droppable droppableId="menu-list-header">
                            {(provided: DroppableProvided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="divide-y divide-white/5"
                                >
                                    {flatLinks.filter(l => l.type === 'header' || l.type === 'both').map((link, index) => (
                                        <Draggable key={link.id} draggableId={link.id} index={index} isDragDisabled={isSaving || link.parentId !== null}>
                                            {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors ${snapshot.isDragging ? "bg-white/10 shadow-lg relative z-10" : "hover:bg-white/5"
                                                        }`}
                                                >
                                                    <div className="col-span-1 flex justify-center">
                                                        <div
                                                            {...provided.dragHandleProps}
                                                            className={`text-muted-foreground ${link.parentId ? 'opacity-20 cursor-not-allowed' : 'hover:text-white cursor-grab active:cursor-grabbing'}`}
                                                            title={link.parentId ? "Sub-menus cannot be dragged here" : "Drag to reorder"}
                                                        >
                                                            <GripVertical size={20} />
                                                        </div>
                                                    </div>

                                                    <div className="col-span-4 flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            {/* Indentation for submenus */}
                                                            {link.depth > 0 && (
                                                                <span className="text-white/20 ml-2" style={{ marginLeft: `${link.depth * 1.5}rem` }}>
                                                                    ↳
                                                                </span>
                                                            )}
                                                            <span className="font-medium text-white flex items-center gap-2 text-base">
                                                                {link.icon && <DynamicIcon name={link.icon} className="h-4 w-4 text-primary" />}
                                                                {link.label}
                                                                {link.isExternal && <ExternalLink size={12} className="text-muted-foreground ml-1" />}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-muted-foreground mt-0.5" style={{ marginLeft: link.depth > 0 ? `${(link.depth * 1.5) + 1.5}rem` : (link.icon ? '1.5rem' : '0') }}>
                                                            {link.path}
                                                        </span>
                                                    </div>

                                                    <div className="col-span-2">
                                                        <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/20 capitalize">
                                                            {link.type}
                                                        </span>
                                                    </div>

                                                    <div className="col-span-2 flex justify-center">
                                                        <Switch
                                                            checked={link.isActive}
                                                            onCheckedChange={() => handleToggle(link.id, link.isActive)}
                                                        />
                                                    </div>

                                                    <div className="col-span-3 flex justify-end gap-2">
                                                        <Link href={`/admin/menu/${link.id}`}>
                                                            <Button variant="ghost" size="icon" title="Edit">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                            title="Delete"
                                                            onClick={() => handleDelete(link.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>

                        <div className="bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary border-y border-white/5 mt-4">
                            Footer Links
                        </div>
                        <Droppable droppableId="menu-list-footer">
                            {(provided: DroppableProvided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="divide-y divide-white/5"
                                >
                                    {flatLinks.filter(l => l.type === 'footer').map((link, index) => (
                                        <Draggable key={link.id} draggableId={link.id} index={index} isDragDisabled={isSaving || link.parentId !== null}>
                                            {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors ${snapshot.isDragging ? "bg-white/10 shadow-lg relative z-10" : "hover:bg-white/5"
                                                        }`}
                                                >
                                                    <div className="col-span-1 flex justify-center">
                                                        <div
                                                            {...provided.dragHandleProps}
                                                            className={`text-muted-foreground ${link.parentId ? 'opacity-20 cursor-not-allowed' : 'hover:text-white cursor-grab active:cursor-grabbing'}`}
                                                            title={link.parentId ? "Sub-menus cannot be dragged here" : "Drag to reorder"}
                                                        >
                                                            <GripVertical size={20} />
                                                        </div>
                                                    </div>

                                                    <div className="col-span-4 flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            {/* Indentation for submenus */}
                                                            {link.depth > 0 && (
                                                                <span className="text-white/20 ml-2" style={{ marginLeft: `${link.depth * 1.5}rem` }}>
                                                                    ↳
                                                                </span>
                                                            )}
                                                            <span className="font-medium text-white flex items-center gap-2 text-base">
                                                                {link.icon && <DynamicIcon name={link.icon} className="h-4 w-4 text-primary" />}
                                                                {link.label}
                                                                {link.isExternal && <ExternalLink size={12} className="text-muted-foreground ml-1" />}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-muted-foreground mt-0.5" style={{ marginLeft: link.depth > 0 ? `${(link.depth * 1.5) + 1.5}rem` : (link.icon ? '1.5rem' : '0') }}>
                                                            {link.path}
                                                        </span>
                                                    </div>

                                                    <div className="col-span-2">
                                                        <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/20 capitalize">
                                                            {link.type}
                                                        </span>
                                                    </div>

                                                    <div className="col-span-2 flex justify-center">
                                                        <Switch
                                                            checked={link.isActive}
                                                            onCheckedChange={() => handleToggle(link.id, link.isActive)}
                                                        />
                                                    </div>

                                                    <div className="col-span-3 flex justify-end gap-2">
                                                        <Link href={`/admin/menu/${link.id}`}>
                                                            <Button variant="ghost" size="icon" title="Edit">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                            title="Delete"
                                                            onClick={() => handleDelete(link.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}
            </div>
        </div>
    )
}
