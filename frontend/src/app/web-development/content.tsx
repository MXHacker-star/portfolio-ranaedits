"use client";

import { TerminalForm } from "@/components/forms/TerminalForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Code, Globe } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useState } from "react";

interface WebProject {
    id: string;
    title: string;
    description: string | null;
    mediaUrl: string;
    stack: string | null;
    liveUrl: string | null;
    repoUrl: string | null;
    portfolioCategory?: { name: string } | null;
    featured: boolean;
}

interface WebDevelopmentContentProps {
    projects: WebProject[];
    webCategories: string[];
}

export function WebDevelopmentContent({ projects, webCategories }: WebDevelopmentContentProps) {
    const { t } = useTranslation();
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const filteredProjects = activeCategory
        ? projects.filter(p => p.portfolioCategory?.name === activeCategory)
        : projects;

    return (
        <main className="min-h-screen bg-background relative overflow-hidden">

            {/* Matrix / Code Rain Background Effect (Simplified CSS) */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 container px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <Badge variant="outline" className="border-primary/50 text-primary animate-pulse">
                        {(t as any).webDev?.systemOnline || "System Online: V.2.0.4"}
                    </Badge>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
                        {(t as any).webDev?.heroTitle
                            ? (t as any).webDev.heroTitle.split(".").map((part: string, i: number) => (
                                <span key={i}>
                                    {part}{i < (t as any).webDev.heroTitle.split(".").length - 1 ? "." : ""}
                                    {i === 0 && <br />}
                                </span>
                            ))
                            : <span>We Speak <span className="text-primary text-glow">Code</span>.<br />You See <span className="text-white">Magic</span>.</span>}
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {(t as any).webDev?.heroSubtitle || "Full-stack engineering meets cinematic design..."}
                    </p>

                    <div className="flex justify-center gap-4">
                        <Button size="lg" className="rounded-full px-8 text-lg" asChild>
                            <a href="#inquiry">{(t as any).webDev?.startProject || "Start Project"}</a>
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                            <a href="#projects">{(t as any).webDev?.viewWork || "View Work"}</a>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Tech Stack Marquee */}
            <section className="py-12 border-y border-white/5 bg-white/5 backdrop-blur-sm">
                <div className="container px-4">
                    <div className="flex justify-center gap-8 md:gap-16 flex-wrap opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Icons would go here, text for now */}
                        {["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Prisma", "PostgreSQL"].map((tech) => (
                            <span key={tech} className="text-xl font-mono font-bold text-muted-foreground hover:text-primary cursor-default">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Projects */}
            <section id="projects" className="py-24 container px-4 md:px-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{(t as any).webDev?.selectedDeployments || "Selected Deployments"}</h2>
                        <p className="text-muted-foreground">{(t as any).webDev?.shippingRecords || "Recent shipping records."}</p>
                    </div>
                    <Button variant="ghost" className="hidden md:flex">{(t as any).webDev?.viewGithub || "View GitHub"}</Button>
                </div>

                {/* Category Filters */}
                {webCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        <Button
                            variant={activeCategory === null ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveCategory(null)}
                            className={`rounded-full text-xs h-8 px-4 font-bold tracking-wider uppercase transition-colors ${activeCategory === null ? "bg-primary text-black hover:bg-primary/90" : "border-primary/20 hover:border-primary text-muted-foreground hover:text-white"}`}
                        >
                            All
                        </Button>
                        {webCategories.map(cat => (
                            <Button
                                key={cat}
                                variant={activeCategory === cat ? "default" : "outline"}
                                size="sm"
                                onClick={() => setActiveCategory(cat)}
                                className={`rounded-full text-xs h-8 px-4 font-bold tracking-wider uppercase transition-colors ${activeCategory === cat ? "bg-primary text-black hover:bg-primary/90" : "border-primary/20 hover:border-primary text-muted-foreground hover:text-white"}`}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project, i) => {
                        const stackTags = project.stack ? project.stack.split(",").map(s => s.trim()).filter(Boolean) : [];
                        return (
                            <Card key={project.id} className="group overflow-hidden bg-card/50 border-white/10 hover:border-primary/50 transition-all duration-300">
                                <div className="aspect-video relative bg-slate-900 overflow-hidden">
                                    {project.mediaUrl ? (
                                        <img
                                            src={project.mediaUrl}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-mono text-xs">
                                            [ IMAGE_DATA_MISSING ]
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        {project.liveUrl && (
                                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                                <Button size="icon" variant="secondary" className="rounded-full">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Button>
                                            </a>
                                        )}
                                        {project.repoUrl && (
                                            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                                                <Button size="icon" variant="secondary" className="rounded-full">
                                                    <Github className="w-4 h-4" />
                                                </Button>
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                                            {project.portfolioCategory && (
                                                <p className="text-sm text-muted-foreground">{project.portfolioCategory.name}</p>
                                            )}
                                        </div>
                                    </div>
                                    {project.description && (
                                        <p className="text-sm text-gray-400 line-clamp-2">
                                            {project.description}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {stackTags.map(tech => (
                                            <Badge key={tech} variant="secondary" className="text-xs font-normal">
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                        <Globe className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <p>No projects found.</p>
                    </div>
                )}
            </section>


            {/* Terminal Inquiry Form */}
            <section id="inquiry" className="py-24 container px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{(t as any).webDev?.initializeSequence || "Initialize Sequence"}</h2>
                    <p className="text-muted-foreground">
                        {(t as any).webDev?.terminalProtocol || "Complete the terminal protocol below to request a briefing."}
                    </p>
                </div>

                <TerminalForm />
            </section>

        </main>
    );
}
