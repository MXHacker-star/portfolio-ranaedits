"use client"

import { useState } from "react"
import { PortfolioItem } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LayoutGrid, List as ListIcon, Pencil, Trash2, Video, Image as ImageIcon, Plus } from "lucide-react"
import Link from "next/link"
import { deletePortfolioItem } from "@/actions/portfolio"

interface PortfolioManagerProps {
    items: PortfolioItem[]
    category?: string
}

export function PortfolioManager({ items, category }: PortfolioManagerProps) {
    const [view, setView] = useState<'grid' | 'list'>('grid')

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        {category ? `${category}` : "All Portfolio Items"}
                    </h2>
                    <p className="text-muted-foreground">Manage your {category || "projects"}.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center border border-white/10 rounded-md bg-card/50">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`rounded-r-none ${view === 'grid' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
                            onClick={() => setView('grid')}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`rounded-l-none ${view === 'list' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
                            onClick={() => setView('list')}
                        >
                            <ListIcon className="h-4 w-4" />
                        </Button>
                    </div>
                    <Link href={`/admin/portfolio/new${category ? `?category=${category}` : ''}`}>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add New
                        </Button>
                    </Link>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-white/10 rounded-lg">
                    <p>No portfolio items found. Create your first one!</p>
                </div>
            ) : view === 'grid' ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                        <Card key={item.id} className="bg-card/50 backdrop-blur-sm border-white/10 overflow-hidden group">
                            {/* Existing Card Content */}
                            <div className="aspect-video relative bg-black/50">
                                {item.type === 'video' ? (
                                    <img
                                        src={item.thumbnail || `https://img.youtube.com/vi/${item.mediaUrl}/mqdefault.jpg`}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={item.thumbnail || item.mediaUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white uppercase font-bold flex items-center gap-1">
                                    {item.type === 'video' ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                                    {item.category}
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <h3 className="text-white font-bold mb-1 truncate">{item.title}</h3>
                                <p className="text-xs text-muted-foreground mb-4">{item.subCategory || "No Sub-category"}</p>
                                <div className="flex gap-2">
                                    <Link href={`/admin/portfolio/${item.id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full gap-2 border-white/10 hover:bg-white/5 hover:text-white">
                                            <Pencil className="h-4 w-4" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <form action={async () => {
                                        if (confirm("Are you sure you want to delete this item?")) {
                                            await deletePortfolioItem(item.id)
                                        }
                                    }} className="flex-1">
                                        <Button variant="destructive" size="sm" className="w-full gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 border-none">
                                            <Trash2 className="h-4 w-4" />
                                            Delete
                                        </Button>
                                    </form>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/5 text-muted-foreground font-medium border-b border-white/10">
                            <tr>
                                <th className="px-4 py-3 w-20">Media</th>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Sub-Category</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-2">
                                        <div className="w-12 h-12 rounded overflow-hidden bg-black/50">
                                            {item.type === 'video' ? (
                                                <img src={item.thumbnail || `https://img.youtube.com/vi/${item.mediaUrl}/mqdefault.jpg`} className="w-full h-full object-cover" />
                                            ) : (
                                                <img src={item.thumbnail || item.mediaUrl} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 text-white font-medium">{item.title}</td>
                                    <td className="px-4 py-2 text-muted-foreground">{item.category}</td>
                                    <td className="px-4 py-2 text-muted-foreground">
                                        {item.subCategory && (
                                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs border border-primary/20">
                                                {item.subCategory}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/portfolio/${item.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <form action={async () => {
                                                if (confirm("Delete this item?")) {
                                                    await deletePortfolioItem(item.id)
                                                }
                                            }}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500/70 hover:text-red-500 hover:bg-red-500/10">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
