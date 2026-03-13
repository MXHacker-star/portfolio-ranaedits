"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    LayoutGrid,
    List as ListIcon,
    Plus,
    Pencil,
    Trash2,
    Search,
    PlayCircle
} from "lucide-react"
import { deleteVideoProject } from "@/actions/video-projects"
import { toast } from "sonner"

interface Category {
    id: string
    name: string
}

interface VideoProject {
    id: string
    title: string
    mediaUrl: string
    portfolioCategory?: { id: string, name: string } | null // Handle optional relation
    orientation: string
    thumbnail: string | null
    featured: boolean
    order: number
}

interface VideoProjectListProps {
    initialProjects: VideoProject[]
    categories: Category[]
}

export function VideoProjectList({ initialProjects, categories }: VideoProjectListProps) {
    const [view, setView] = useState<'grid' | 'list'>('grid')
    const [filterCategory, setFilterCategory] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')

    // Filter logic
    const filteredProjects = initialProjects.filter(project => {
        const matchesCategory = filterCategory === 'all' || project.portfolioCategory?.id === filterCategory
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this project?")) {
            await deleteVideoProject(id)
            toast.success("Project deleted")
            // In a real app we might want to update local state or router.refresh() 
            // but since we use server actions with revalidatePath, the page should update.
            // However, inside a client component with initialData, we might need to refresh router.
            window.location.reload() // Simple force reload to reflect changes
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-white/5 px-3 py-1.5 rounded-md border border-white/10">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        {initialProjects.filter(p => p.featured).length} Featured
                    </div>

                    <div className="flex items-center gap-2 bg-card border border-white/10 p-1 rounded-lg">
                        <Button
                            variant={view === 'grid' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setView('grid')}
                            className="h-8 w-8 p-0"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={view === 'list' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setView('list')}
                            className="h-8 w-8 p-0"
                        >
                            <ListIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex flex-1 gap-2 max-w-md w-full">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <Link href="/admin/portfolio/video/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Video
                    </Button>
                </Link>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                <Button
                    variant={filterCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterCategory('all')}
                    className="rounded-full"
                >
                    All
                </Button>
                {categories.map(cat => (
                    <Button
                        key={cat.id}
                        variant={filterCategory === cat.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterCategory(cat.id)}
                        className="rounded-full"
                    >
                        {cat.name}
                    </Button>
                ))}
            </div>

            {/* Content */}
            {filteredProjects.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border border-dashed border-white/10 rounded-xl">
                    No projects found matching your filters.
                </div>
            ) : (
                <div className={view === 'grid'
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }>
                    {filteredProjects.map((project) => (
                        <div
                            key={project.id}
                            className={`bg-card border border-white/10 rounded-xl overflow-hidden group relative transition-all hover:border-primary/50 ${view === 'list' ? 'flex items-center gap-4 p-4' : 'flex flex-col'
                                }`}
                        >
                            {/* Thumbnail */}
                            <div className={`relative ${view === 'list' ? 'h-24 w-40 flex-shrink-0' : 'aspect-video w-full'}`}>
                                {project.thumbnail ? (
                                    <img src={project.thumbnail} alt={project.title} className="object-cover w-full h-full" />
                                ) : (
                                    <div className="w-full h-full bg-black/50 flex items-center justify-center">
                                        <PlayCircle className="w-10 h-10 text-white/50" />
                                    </div>
                                )}
                                {project.featured && (
                                    <span className="absolute top-2 left-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                        FEATURED
                                    </span>
                                )}
                                {/* Actions Overlay (Grid only) */}
                                {view === 'grid' && (
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Link href={`/admin/portfolio/video/${project.id}`}>
                                            <Button variant="secondary" size="icon" className="h-8 w-8">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(project.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className={view === 'list' ? 'flex-1 flex justify-between items-center' : 'p-4'}>
                                <div>
                                    <h3 className="font-bold text-white line-clamp-1">{project.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                        {project.portfolioCategory ? (
                                            <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                                {project.portfolioCategory.name}
                                            </span>
                                        ) : (
                                            <span>Uncategorized</span>
                                        )}
                                        <span>•</span>
                                        <span className="capitalize">{project.orientation}</span>
                                    </div>
                                </div>

                                {/* List View Actions */}
                                {view === 'list' && (
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/admin/portfolio/video/${project.id}`}>
                                            <Button variant="ghost" size="icon">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400" onClick={() => handleDelete(project.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
