"use client"

import Link from "next/link"
import { Instagram, Twitter, Linkedin, Mail, Phone, MapPin, Link as LinkIcon } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { useContactModal } from "@/lib/stores/useContactModal"

interface GlobalSettings {
    siteName: string;
    tagline: string | null;
    logoUrl: string | null;
    logoType: string;
    contactEmail: string | null;
    contactPhone: string | null;
    address: string | null;
    socialFacebook: string | null;
    socialInstagram: string | null;
    socialTwitter: string | null;
    socialYoutube: string | null;
}

interface FooterProps {
    menuLinks?: { label: string; path: string; order: number }[]
    settings?: GlobalSettings | null
    socialLinks?: any[]
}

export function Footer({ menuLinks = [], settings, socialLinks = [] }: FooterProps) {
    const { t } = useTranslation()
    const { openModal } = useContactModal();

    // ====================================================================
    // LOGO DISPLAY LOGIC (Admin controllable via Dashboard > Settings)
    //
    // CURRENT DEFAULT: Always shows /logo.png (uploaded RanaEdits logo)
    //
    // HOW ADMIN CAN CONTROL THIS:
    //   1. Go to Admin Dashboard > Settings
    //   2. Set "Logo Type" to "image" + upload a new logo → shows admin's uploaded logo
    //   3. To use text logo instead, uncomment the "TEXT LOGO MODE" block below
    //      and set logoType to "text" in admin.
    //   4. If no admin override → falls back to /logo.png (default logo file)
    // ====================================================================
    const renderLogo = () => {
        // Priority 1: Admin uploaded a DIFFERENT image logo via dashboard
        if (settings?.logoType === 'image' && settings.logoUrl) {
            return (
                <img src={settings.logoUrl} alt={settings.siteName || "Rana Edits"} className="h-12 w-auto object-contain" />
            )
        }
        // Prio 2: Admin Enabled Text Logo
        if (settings?.logoType === 'text' && settings?.siteName) {
            const parts = settings.siteName.split(" ");
            if (parts.length > 1) {
                return (
                    <span className="text-2xl font-black tracking-tighter text-white uppercase">
                        {parts[0]} <span className="text-primary">{parts.slice(1).join(" ")}</span>
                    </span>
                )
            }
            return (
                <span className="text-2xl font-black tracking-tighter text-white uppercase">
                    <span className="text-primary">{settings.siteName}</span>
                </span>
            )
        }

        // Default: Always show /logo.png
        return (
            <img src="/logo.png" alt="Rana Edits" className="h-12 w-auto object-contain" />
        )
    }

    return (
        <footer id="footer" className="relative border-t border-white/5 bg-background overflow-hidden selection:bg-primary/30">
            {/* Subtle Gradient Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />

            <div className="container relative mx-auto px-4 md:px-6 pt-20 pb-10">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">

                    {/* Brand Section (Takes up more space) */}
                    <div className="lg:col-span-5 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
                        <Link href="/" className="inline-block transition-transform hover:scale-105 duration-300">
                            {renderLogo()}
                        </Link>
                        <p className="max-w-sm text-muted-foreground leading-relaxed text-base">
                            {settings?.tagline || t.footer.tagline}
                        </p>
                        <div className="pt-2">
                            <button
                                onClick={() => openModal({ source: 'Footer CTA' })}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary hover:text-black hover:border-primary"
                            >
                                Let's Work Together
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-2 flex flex-col items-center md:items-start space-y-5">
                        <h3 className="text-lg font-black uppercase tracking-wider text-white relative inline-block">
                            {t.footer.quickLinks}
                            <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-primary rounded-full"></span>
                        </h3>
                        <ul className="space-y-3 mt-4 text-center md:text-left w-full">
                            {menuLinks.length > 0 ? (
                                menuLinks.map((link, idx) => (
                                    <li key={idx}>
                                        <Link href={link.path} className="group inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
                                            <span className="w-0 overflow-hidden transition-all group-hover:w-3 opacity-0 group-hover:opacity-100 mr-0 group-hover:mr-1">›</span>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <>
                                    <li><Link href="#portfolio" className="hover:text-primary text-muted-foreground transition-colors">Portfolio</Link></li>
                                    <li><Link href="#services" className="hover:text-primary text-muted-foreground transition-colors">{t.nav.services}</Link></li>
                                    <li><Link href="#results" className="hover:text-primary text-muted-foreground transition-colors">{t.nav.results}</Link></li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-3 flex flex-col items-center md:items-start space-y-5">
                        <h3 className="text-lg font-black uppercase tracking-wider text-white relative inline-block">
                            {t.footer.contact}
                            <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-primary rounded-full"></span>
                        </h3>
                        <ul className="space-y-4 mt-4 text-center md:text-left">
                            <li className="flex items-start justify-center md:justify-start gap-3 text-muted-foreground">
                                <div className="mt-1 p-1.5 rounded-md bg-white/5 text-primary border border-white/10 shrink-0">
                                    <MapPin className="h-4 w-4" />
                                </div>
                                <span>{settings?.address || t.footer.address}</span>
                            </li>
                            <li className="flex items-center justify-center md:justify-start gap-3 text-muted-foreground">
                                <div className="p-1.5 rounded-md bg-white/5 text-primary border border-white/10 shrink-0">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <a href={`tel:${settings?.contactPhone || t.footer.phone}`} className="hover:text-primary transition-colors">
                                    {settings?.contactPhone || t.footer.phone}
                                </a>
                            </li>
                            <li className="flex items-center justify-center md:justify-start gap-3 text-muted-foreground">
                                <div className="p-1.5 rounded-md bg-white/5 text-primary border border-white/10 shrink-0">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <a href={`mailto:${settings?.contactEmail || "hello@ranaedits.site"}`} className="hover:text-primary transition-colors">
                                    {settings?.contactEmail || "hello@ranaedits.site"}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Connect / Socials */}
                    <div className="lg:col-span-2 flex flex-col items-center md:items-start space-y-5">
                        <h3 className="text-lg font-black uppercase tracking-wider text-white relative inline-block">
                            {t.footer.connect}
                            <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-primary rounded-full"></span>
                        </h3>
                        <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                            {socialLinks && socialLinks.length > 0 ? (
                                socialLinks.filter(link => link.isActive).map((link) => {
                                    // @ts-ignore
                                    const IconComponent = LucideIcons[link.icon] || LinkIcon
                                    return (
                                        <Link key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3 text-muted-foreground hover:bg-primary hover:text-black hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-primary/20">
                                            <IconComponent className="h-5 w-5" />
                                            <span className="sr-only">{link.platform}</span>
                                        </Link>
                                    )
                                })
                            ) : (
                                /* Fallback if no dynamic links are added yet but settings exist */
                                <>
                                    {settings?.socialInstagram && (
                                        <Link href={settings.socialInstagram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3 text-muted-foreground hover:bg-primary hover:text-black hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-primary/20">
                                            <Instagram className="h-5 w-5" />
                                            <span className="sr-only">Instagram</span>
                                        </Link>
                                    )}
                                    {settings?.socialTwitter && (
                                        <Link href={settings.socialTwitter} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3 text-muted-foreground hover:bg-primary hover:text-black hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-primary/20">
                                            <Twitter className="h-5 w-5" />
                                            <span className="sr-only">Twitter</span>
                                        </Link>
                                    )}
                                    {settings?.socialYoutube && (
                                        <Link href={settings.socialYoutube} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3 text-muted-foreground hover:bg-primary hover:text-black hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-primary/20">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></svg>
                                            <span className="sr-only">YouTube</span>
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 bg-black/40 backdrop-blur-md relative z-10">
                <div className="container mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm font-medium text-muted-foreground order-2 md:order-1 text-center md:text-left">
                        &copy; {new Date().getFullYear()} <span className="text-white">{settings?.siteName || t.footer.rights}</span>. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 order-1 md:order-2 text-sm text-muted-foreground font-medium">
                        <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
