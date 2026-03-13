"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Search, MoreVertical, Pencil, Trash2, LayoutGrid, List as ListIcon, Plus, Info } from "lucide-react"
import { deleteGraphicProject, updateGraphicProject } from "@/actions/graphic-projects"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"

interface GraphicProject {
    id: string
    title: string
    mediaUrl: string
    portfolioCategory: { id: string, name: string } | null
    type: string
    order: number
    featured: boolean
    createdAt: Date
    updatedAt: Date
}

interface GraphicProjectListProps {
    initialProjects: GraphicProject[]
    categories: { id: string, name: string }[]
}

export function GraphicProjectList({ initialProjects, categories }: GraphicProjectListProps) {
    const [projects, setProjects] = useState(initialProjects)
    const [viewMode, setViewMode] = useState<"list" | "grid">("grid")
    const [searchQuery, setSearchQuery] = useState("")
    const [categoryFilter, setCategoryFilter] = useState<string>("all")

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = categoryFilter === "all" || project.portfolioCategory?.id === categoryFilter
        return matchesSearch && matchesCategory
    })

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this project?")) {
            try {
                await deleteGraphicProject(id)
                setProjects(projects.filter(p => p.id !== id))
                toast.success("Project deleted")
            } catch (error) {
                toast.error("Failed to delete project")
            }
        }
    }

    const handleToggleFeatured = async (id: string, current: boolean) => {
        // Optimistic update
        const updatedProjects = projects.map(p =>
            p.id === id ? { ...p, featured: !current } : p
        )
        setProjects(updatedProjects)

        try {
            await updateGraphicProject(id, {
                title: projects.find(p => p.id === id)!.title,
                mediaUrl: projects.find(p => p.id === id)!.mediaUrl,
                featured: !current,
                order: projects.find(p => p.id === id)!.order
            })
            toast.success("Featured status updated")
        } catch (error) {
            // Revert
            setProjects(projects)
            toast.error("Failed to update status")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search projects..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        className="h-9 w-[150px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="all" className="bg-black text-white">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id} className="bg-black text-white">{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-white/5 px-3 py-1.5 rounded-md border border-white/10">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        {projects.filter(p => p.featured).length} Featured
                    </div>

                    <div className="flex items-center gap-2 border rounded-md p-1 bg-card/50">
                        <Button
                            variant={viewMode === "grid" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                        >
                            <ListIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {filteredProjects.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-white/5">
                    <div className="p-4 rounded-full bg-white/10 w-fit mx-auto mb-4">
                        <Info className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-white">No projects found</h3>
                    <p className="text-muted-foreground mb-4">Try adjusting your filters or add a new project.</p>
                </div>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredProjects.map((project) => (
                        <Card key={project.id} className="group relative overflow-hidden bg-card/50 border-white/10 hover:border-primary/50 transition-colors">
                            <div className="aspect-[3/4] overflow-hidden bg-black/50 relative">
                                <img
                                    src={project.mediaUrl}
                                    alt={project.title}
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Link href={`/admin/portfolio/graphic/${project.id}`}>
                                        <Button size="icon" variant="secondary" className="rounded-full h-8 w-8">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button size="icon" variant="destructive" className="rounded-full h-8 w-8" onClick={() => handleDelete(project.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                {project.featured && (
                                    <Badge className="absolute top-2 right-2 bg-yellow-500/90 text-black hover:bg-yellow-500">
                                        Featured
                                    </Badge>
                                )}
                            </div>
                            <div className="p-3">
                                <h3 className="font-medium text-white truncate text-sm" title={project.title}>{project.title}</h3>
                                <p className="text-xs text-muted-foreground">{project.portfolioCategory?.name || "Uncategorized"}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="rounded-md border border-white/10 bg-card overflow-hidden">
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow>
                                <TableHead className="w-[100px]">Preview</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProjects.map((project) => (
                                <TableRow key={project.id} className="hover:bg-white/5">
                                    <TableCell>
                                        <div className="h-12 w-9 rounded overflow-hidden bg-white/10">
                                            <img src={project.mediaUrl} alt={project.title} className="object-cover w-full h-full" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-white">{project.title}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-normal text-muted-foreground">
                                            {project.portfolioCategory?.name || "None"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={project.featured}
                                                onCheckedChange={() => handleToggleFeatured(project.id, project.featured)}
                                            />
                                            <span className="text-xs text-muted-foreground">
                                                {project.featured ? "Featured" : "Standard"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <Link href={`/admin/portfolio/graphic/${project.id}`}>
                                                    <DropdownMenuItem>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => handleDelete(project.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}
