"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

interface ConditionalLayoutProps {
    children: React.ReactNode
    menuLinks: any[]
    footerLinks: any[]
    settings: any
    socialLinks?: any[]
}

export function ConditionalLayout({ children, menuLinks, footerLinks, settings, socialLinks = [] }: ConditionalLayoutProps) {
    const pathname = usePathname()
    const isAdminRoute = pathname?.startsWith("/admin")

    if (isAdminRoute) {
        return <>{children}</>
    }

    return (
        <>
            <Navbar menuLinks={menuLinks} settings={settings} />
            {children}
            <Footer menuLinks={footerLinks} settings={settings} socialLinks={socialLinks} />
        </>
    )
}
