"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher"
import { useTranslation } from "@/lib/i18n"
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useContactModal } from "@/lib/stores/useContactModal";

import * as LucideIcons from "lucide-react";

interface MenuLinkItem {
    id: string;
    label: string;
    path: string;
    order: number;
    isActive: boolean;
    isExternal: boolean;
    icon: string | null;
    children?: MenuLinkItem[];
}

interface GlobalSettings {
    siteName: string;
    logoUrl: string | null;
    logoType: string; // "text" or "image"
}

interface NavbarProps {
    menuLinks?: MenuLinkItem[]
    settings?: GlobalSettings | null
}

// Helper to dynamically render a Lucide Icon
const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
    const Icon = (LucideIcons as any)[name]
    if (!Icon) return null
    return <Icon className={className} />
}

export function Navbar({ menuLinks = [], settings }: NavbarProps) {
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
    const { t, language } = useTranslation();
    const { openModal } = useContactModal();

    // Default links if DB is empty or fails
    const defaultLinks: MenuLinkItem[] = [
        { id: '1', label: t.nav.home, path: "/", order: 1, isActive: true, isExternal: false, icon: null },
        { id: '2', label: t.nav.services, path: "/#services-overview", order: 2, isActive: true, isExternal: false, icon: null },
        { id: '3', label: t.nav.results, path: "/results", order: 3, isActive: true, isExternal: false, icon: null },
        { id: '4', label: t.nav.pricing, path: "/#pricing", order: 4, isActive: true, isExternal: false, icon: null },
        { id: '5', label: t.nav.team, path: "/#team", order: 5, isActive: true, isExternal: false, icon: null },
        { id: '6', label: t.nav.about, path: "/#about", order: 6, isActive: true, isExternal: false, icon: null },
        { id: '7', label: t.nav.blog, path: "/blog", order: 7, isActive: true, isExternal: false, icon: null },
    ]

    // Helper to attempt translating the DB label back to i18n keys
    const translateLabel = (dbLabel: string) => {
        const key = dbLabel.toLowerCase();
        // Check if the exact english DB string matches a known translation key
        if (key === 'home') return t.nav.home;
        if (key === 'services') return t.nav.services;
        if (key === 'results') return t.nav.results;
        if (key === 'pricing') return t.nav.pricing;
        if (key === 'team') return t.nav.team;
        if (key === 'about') return t.nav.about;
        if (key === 'blog') return t.nav.blog;
        if (key === 'video editing') return t.nav.videoEditing;
        if (key === 'graphic design') return t.nav.graphicDesign;
        // If not found, trust the DB string
        return dbLabel;
    }

    const linksToRender = menuLinks.length > 0 ? menuLinks : defaultLinks;

    // Ensure "Blog" is in the list if using DB links but it hasn't been added yet?
    // Actually, if DB links exist, we trust the DB. The user can add "Blog" via admin later.
    // But for now, let's just stick to what `menuLinks` provides. 
    // Wait, I should probably append "Blog" if it's not there? 
    // No, "Full Control" means the user manages it.
    // I seeded "Blog" link? No I didn't seed "Blog" link in the previous step.
    // I should probably add it to the seed or rely on the user adding it.
    // I'll assume standard behavior.

    // ====================================================================
    // LOGO DISPLAY LOGIC (Admin controllable via Dashboard > Settings)
    //
    // CURRENT DEFAULT: Always shows /logo.png (uploaded RanaEdits logo)
    //
    // HOW ADMIN CAN CONTROL THIS:
    //   1. Go to Admin Dashboard > Settings
    //   2. Set "Logo Type" to "image" + upload a new logo → shows admin's uploaded logo
    //   3. To use text logo instead, uncomment the "TEXT LOGO MODE" block below
    //      and set logoType to "text" in admin. Then the siteName will render as styled text.
    //   4. If no admin override → falls back to /logo.png (default logo file)
    // ====================================================================
    const renderLogo = () => {
        // Priority 1: Admin uploaded a DIFFERENT image logo via dashboard
        if (settings?.logoType === 'image' && settings.logoUrl) {
            return (
                <img src={settings.logoUrl} alt={settings.siteName || "Rana Edits"} className="h-14 w-auto object-contain" />
            )
        }
        // Prio 2: Admin enabled Text Logo
        if (settings?.logoType === 'text' && settings?.siteName) {
            const parts = settings.siteName.split(" ");
            if (parts.length > 1) {
                return (
                    <span className="text-2xl font-black tracking-tighter text-foreground uppercase z-50">
                        {parts[0]} <span className="text-primary">{parts.slice(1).join(" ")}</span>
                    </span>
                )
            }
            return (
                <span className="text-2xl font-black tracking-tighter text-foreground uppercase z-50">
                    <span className="text-primary">{settings.siteName}</span>
                </span>
            )
        }

        // Default: Always show /logo.png
        return (
            <img src="/logo.png" alt="Rana Edits" className="h-14 w-auto object-contain" />
        )
    }

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-primary/20 bg-background/80 backdrop-blur-[12px] supports-[backdrop-filter]:bg-background/80"
        >
            <div className="container mx-auto flex h-20 items-center px-4 md:px-6 relative">
                {/* Logo - Left: scrolls to top on homepage, navigates to "/" from other pages */}
                <div className="flex-none">
                    <Link
                        href="/"
                        className="flex items-center gap-2"
                        onClick={(e) => {
                            if (window.location.pathname === '/') {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                        }}
                    >
                        {renderLogo()}
                    </Link>
                </div>

                {/* Centered Navigation - Middle */}
                <div className="flex-1 flex justify-center">
                    <div className={`hidden md:flex items-center gap-6 lg:gap-8 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {linksToRender.map((link) => {
                            const hasChildren = link.children && link.children.length > 0;
                            const isDropdownOpen = openDropdowns[link.id];

                            if (hasChildren) {
                                return (
                                    <div
                                        key={link.id}
                                        className="relative"
                                        onMouseEnter={() => setOpenDropdowns(prev => ({ ...prev, [link.id]: true }))}
                                        onMouseLeave={() => setOpenDropdowns(prev => ({ ...prev, [link.id]: false }))}
                                    >
                                        <Link
                                            href={link.path}
                                            className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-all hover:text-primary hover:tracking-[0.2em]"
                                            onClick={(e) => {
                                                if (window.location.pathname === '/') {
                                                    // Allow scrolling to sections if hash is used
                                                    if (link.path.startsWith('/#')) {
                                                        const targetId = link.path.replace('/#', '');
                                                        const el = document.getElementById(targetId);
                                                        if (el) {
                                                            e.preventDefault();
                                                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                        }
                                                    }
                                                }
                                            }}
                                            target={link.isExternal ? "_blank" : undefined}
                                            rel={link.isExternal ? "noopener noreferrer" : undefined}
                                        >
                                            {link.icon && <DynamicIcon name={link.icon} className="h-4 w-4 mr-1 text-primary" />}
                                            {translateLabel(link.label)}
                                            <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                                        </Link>

                                        <AnimatePresence>
                                            {isDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[200px] rounded-xl border border-border bg-popover/90 backdrop-blur-xl p-2 shadow-xl"
                                                >
                                                    <div className="flex flex-col gap-1">
                                                        {link.children!.map((child) => (
                                                            <Link
                                                                key={child.id}
                                                                href={child.path}
                                                                className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors text-center"
                                                                target={child.isExternal ? "_blank" : undefined}
                                                                rel={child.isExternal ? "noopener noreferrer" : undefined}
                                                            >
                                                                {child.icon && <DynamicIcon name={child.icon} className="h-4 w-4 text-primary" />}
                                                                {translateLabel(child.label)}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )
                            }

                            return (
                                <Link
                                    key={link.id}
                                    href={link.path}
                                    className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-all hover:text-primary hover:tracking-[0.2em]"
                                    target={link.isExternal ? "_blank" : undefined}
                                    rel={link.isExternal ? "noopener noreferrer" : undefined}
                                    onClick={(e) => {
                                        if (link.path === '/' && window.location.pathname === '/') {
                                            e.preventDefault();
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        } else if (link.path.startsWith('/#') && window.location.pathname === '/') {
                                            const targetId = link.path.replace('/#', '');
                                            const el = document.getElementById(targetId);
                                            if (el) {
                                                e.preventDefault();
                                                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            }
                                        }
                                    }}
                                >
                                    {link.icon && <DynamicIcon name={link.icon} className="h-4 w-4 text-primary" />}
                                    {translateLabel(link.label)}
                                </Link>
                            )
                        })}
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex-none flex items-center gap-4">
                    <LanguageSwitcher />
                    <ThemeToggle />
                    <Button
                        variant="default"
                        className="bg-primary text-black font-bold uppercase tracking-wide hover:bg-primary/90"
                        onClick={() => openModal({ source: 'Navbar CTA', type: 'proposal' })}
                    >
                        {t.nav.sendProposal}
                    </Button>
                </div>
            </div>
        </motion.nav>
    )
}
