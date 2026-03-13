"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    Globe,
    Star
} from "lucide-react"
import { deleteWebProject } from "@/actions/web-projects"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Category {
    id: string
    name: string
}

interface WebProject {
    id: string
    title: string
    description: string | null
    mediaUrl: string
    stack: string | null
    liveUrl: string | null
    repoUrl: string | null
    portfolioCategory?: { id: string; name: string } | null
    featured: boolean
    order: number
}

interface WebProjectListProps {
    initialProjects: WebProject[]
    categories: Category[]
}

export function WebProjectList({ initialProjects, categories }: WebProjectListProps) {
    const [search, setSearch] = useState("")
    const [projects, setProjects] = useState(initialProjects)

    const handleDelete = async (id: string) => {
        const result = await deleteWebProject(id)
        if (result.success) {
            setProjects(projects.filter(p => p.id !== id))
            toast.success("Project deleted")
        } else {
            toast.error(result.message)
        }
    }

    const filtered = projects.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search projects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Link href="/admin/portfolio/web/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Project
                    </Button>
                </Link>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <Globe className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>No web projects found.</p>
                    <Link href="/admin/portfolio/web/new">
                        <Button variant="link" className="mt-2">Add your first project</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filtered.map((project) => {
                        const stackTags = project.stack ? project.stack.split(",").map(s => s.trim()).filter(Boolean) : []
                        return (
                            <div
                                key={project.id}
                                className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-card/50 hover:border-white/20 transition-colors"
                            >
                                {/* Thumbnail */}
                                <div className="w-24 h-16 rounded-md overflow-hidden bg-black/20 flex-shrink-0">
                                    {project.mediaUrl ? (
                                        <img
                                            src={project.mediaUrl}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => (e.currentTarget.style.display = "none")}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            <Globe className="h-6 w-6" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-white truncate">{project.title}</h3>
                                        {project.featured && (
                                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        {project.portfolioCategory && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                                                {project.portfolioCategory.name}
                                            </span>
                                        )}
                                        {stackTags.slice(0, 3).map((tag, i) => (
                                            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground">
                                                {tag}
                                            </span>
                                        ))}
                                        {stackTags.length > 3 && (
                                            <span className="text-xs text-muted-foreground">+{stackTags.length - 3}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <Link href={`/admin/portfolio/web/${project.id}`}>
                                        <Button variant="ghost" size="icon">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete &quot;{project.title}&quot;? This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(project.id)} className="bg-red-500 hover:bg-red-600">
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
