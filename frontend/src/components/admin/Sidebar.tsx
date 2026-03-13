"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    Settings,
    Users,
    Briefcase,
    Layers,
    MessageSquare,
    LogOut,
    Video,
    FileText,
    Menu,
    BarChart,
    Package,
    Globe,
    LayoutTemplate,
    ChevronDown,
    ChevronRight,
    Image as ImageIcon,
    Inbox,
    Bell,
    Trophy,
    Building2,
    HelpCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { signOut } from "next-auth/react"

interface SidebarProps {
    user: {
        name?: string | null
        email?: string | null
    }
    reviewCount?: number
}

export function Sidebar({ user, reviewCount }: SidebarProps) {
    const pathname = usePathname()
    const [isPortfolioOpen, setIsPortfolioOpen] = useState(pathname?.startsWith("/admin/portfolio"))
    const [isStatsOpen, setIsStatsOpen] = useState(pathname?.startsWith("/admin/stats"))
    const [isLandingOpen, setIsLandingOpen] = useState(["/admin/hero", "/admin/services", "/admin/showreel", "/admin/packages", "/admin/faq", "/admin/sections"].some(p => pathname?.startsWith(p)))
    const [isContentOpen, setIsContentOpen] = useState(["/admin/blog", "/admin/categories", "/admin/team", "/admin/reviews"].some(p => pathname?.startsWith(p)))
    const [isConfigOpen, setIsConfigOpen] = useState(["/admin/settings", "/admin/menu", "/admin/seo", "/admin/notifications"].some(p => pathname?.startsWith(p)))

    return (
        <aside className="w-64 border-r border-white/10 bg-card/20 backdrop-blur-md hidden md:flex flex-col overflow-y-auto">
            <div className="p-6">
                <h1 className="text-2xl font-black uppercase tracking-tighter text-white">
                    RANA <span className="text-primary">ADMIN</span>
                </h1>
            </div>

            <div className="px-3 space-y-1">
                <NavItem href="/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" active={pathname === "/admin"} />
                <NavItem href="/admin/leads" icon={<Inbox size={18} />} label="Leads" active={pathname?.startsWith("/admin/leads")} />
            </div>

            <div className="mt-6 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Page Layout
            </div>
            <div className="px-3 space-y-1 mt-2">
                {/* Collapsible Landing Page Menu */}
                <div>
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-between text-muted-foreground hover:text-white hover:bg-white/5",
                            isLandingOpen && "text-white bg-white/5"
                        )}
                        onClick={() => setIsLandingOpen(!isLandingOpen)}
                    >
                        <div className="flex items-center gap-3">
                            <LayoutTemplate size={18} />
                            Landing Page
                        </div>
                        {isLandingOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </Button>

                    {isLandingOpen && (
                        <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-2">
                            <NavItem href="/admin/hero" icon={<Video size={16} />} label="Hero Section" active={pathname?.startsWith("/admin/hero")} className="text-sm py-1.5" />
                            <NavItem href="/admin/services" icon={<Briefcase size={16} />} label="Services" active={pathname?.startsWith("/admin/services")} className="text-sm py-1.5" />
                            <NavItem href="/admin/showreel" icon={<Video size={16} />} label="Showreel" active={pathname?.startsWith("/admin/showreel")} className="text-sm py-1.5" />
                            <NavItem href="/admin/packages" icon={<Package size={16} />} label="Packages" active={pathname?.startsWith("/admin/packages")} className="text-sm py-1.5" />
                            <NavItem href="/admin/faq" icon={<HelpCircle size={16} />} label="FAQ" active={pathname?.startsWith("/admin/faq")} className="text-sm py-1.5" />
                            <NavItem href="/admin/sections" icon={<LayoutTemplate size={16} />} label="Sections" active={pathname?.startsWith("/admin/sections")} className="text-sm py-1.5" />
                        </div>
                    )}
                </div>

                {/* Collapsible Portfolio Menu */}
                <div>
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-between text-muted-foreground hover:text-white hover:bg-white/5",
                            isPortfolioOpen && "text-white bg-white/5"
                        )}
                        onClick={() => setIsPortfolioOpen(!isPortfolioOpen)}
                    >
                        <div className="flex items-center gap-3">
                            <Layers size={18} />
                            Portfolio
                        </div>
                        {isPortfolioOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </Button>

                    {isPortfolioOpen && (
                        <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-2">
                            <NavItem
                                href="/admin/portfolio/video"
                                icon={<Video size={16} />}
                                label="Video Projects"
                                active={pathname === "/admin/portfolio/video"}
                                className="text-sm py-1.5"
                            />
                            <NavItem
                                href="/admin/portfolio/graphic"
                                icon={<ImageIcon size={16} />}
                                label="Graphic Design"
                                active={pathname === "/admin/portfolio/graphic"}
                                className="text-sm py-1.5"
                            />
                            <NavItem
                                href="/admin/portfolio/web"
                                icon={<Globe size={16} />}
                                label="Web Development"
                                active={pathname === "/admin/portfolio/web"}
                                className="text-sm py-1.5"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Management
            </div>
            <div className="px-3 space-y-1 mt-2">
                {/* Collapsible Content & Team Menu */}
                <div>
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-between text-muted-foreground hover:text-white hover:bg-white/5",
                            isContentOpen && "text-white bg-white/5"
                        )}
                        onClick={() => setIsContentOpen(!isContentOpen)}
                    >
                        <div className="flex items-center gap-3">
                            <FileText size={18} />
                            Content & Team
                        </div>
                        {isContentOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </Button>

                    {isContentOpen && (
                        <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-2">
                            <NavItem href="/admin/categories" icon={<Briefcase size={16} />} label="Categories" active={pathname?.startsWith("/admin/categories")} className="text-sm py-1.5" />
                            <NavItem href="/admin/blog" icon={<FileText size={16} />} label="Blog Posts" active={pathname?.startsWith("/admin/blog")} className="text-sm py-1.5" />
                            <NavItem href="/admin/team" icon={<Users size={16} />} label="Team" active={pathname?.startsWith("/admin/team")} className="text-sm py-1.5" />
                            <NavItem href="/admin/reviews" icon={<MessageSquare size={16} />} label="Reviews" active={pathname?.startsWith("/admin/reviews")} badge={reviewCount} className="text-sm py-1.5" />
                        </div>
                    )}
                </div>

                {/* Collapsible Business Stats Menu */}
                <div>
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-between text-muted-foreground hover:text-white hover:bg-white/5",
                            isStatsOpen && "text-white bg-white/5"
                        )}
                        onClick={() => setIsStatsOpen(!isStatsOpen)}
                    >
                        <div className="flex items-center gap-3">
                            <BarChart size={18} />
                            Business Stats
                        </div>
                        {isStatsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </Button>

                    {isStatsOpen && (
                        <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-2">
                            <NavItem
                                href="/admin/stats/results"
                                icon={<BarChart size={16} />}
                                label="Business Results"
                                active={pathname === "/admin/stats/results" || pathname === "/admin/stats"}
                                className="text-sm py-1.5"
                            />
                            <NavItem
                                href="/admin/stats/about"
                                icon={<Users size={16} />}
                                label="About Me"
                                active={pathname === "/admin/stats/about"}
                                className="text-sm py-1.5"
                            />
                            <NavItem
                                href="/admin/stats/results-page"
                                icon={<Trophy size={16} />}
                                label="Results Page"
                                active={pathname === "/admin/stats/results-page"}
                                className="text-sm py-1.5"
                            />
                            <NavItem
                                href="/admin/stats/client-logos"
                                icon={<Building2 size={16} />}
                                label="Client Logos"
                                active={pathname === "/admin/stats/client-logos"}
                                className="text-sm py-1.5"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                System
            </div>
            <div className="px-3 space-y-1 mt-2">
                {/* Collapsible Configuration Menu */}
                <div>
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-between text-muted-foreground hover:text-white hover:bg-white/5",
                            isConfigOpen && "text-white bg-white/5"
                        )}
                        onClick={() => setIsConfigOpen(!isConfigOpen)}
                    >
                        <div className="flex items-center gap-3">
                            <Settings size={18} />
                            Configuration
                        </div>
                        {isConfigOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </Button>

                    {isConfigOpen && (
                        <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-2">
                            <NavItem href="/admin/settings" icon={<Settings size={16} />} label="Global Settings" active={pathname?.startsWith("/admin/settings")} className="text-sm py-1.5" />
                            <NavItem href="/admin/menu" icon={<Menu size={16} />} label="Menus" active={pathname?.startsWith("/admin/menu")} className="text-sm py-1.5" />
                            <NavItem href="/admin/seo" icon={<Globe size={16} />} label="SEO" active={pathname?.startsWith("/admin/seo")} className="text-sm py-1.5" />
                            <NavItem href="/admin/notifications" icon={<Bell size={16} />} label="Notifications" active={pathname?.startsWith("/admin/notifications")} className="text-sm py-1.5" />
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-auto p-4 border-t border-white/10">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {user.name?.[0] || "A"}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">{user.name || "Admin"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    size="sm"
                    onClick={() => signOut()}
                >
                    <LogOut size={16} />
                    Sign Out
                </Button>
            </div>
        </aside>
    )
}

function NavItem({ href, icon, label, className = "", active = false, badge }: { href: string; icon: React.ReactNode; label: string, className?: string, active?: boolean, badge?: number }) {
    return (
        <Link href={href} className="block">
            <Button
                variant="ghost"
                className={cn(
                    "w-full justify-start gap-3 text-muted-foreground hover:text-white hover:bg-white/5",
                    active && "text-white bg-white/5",
                    className
                )}
            >
                {icon}
                {label}
                {badge !== undefined && badge > 0 && (
                    <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold">
                        {badge}
                    </span>
                )}
            </Button>
        </Link>
    )
}
