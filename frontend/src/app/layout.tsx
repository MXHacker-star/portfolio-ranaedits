import type { Metadata } from "next";
import { Inter, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const hindSiliguri = Hind_Siliguri({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['bengali'],
  variable: '--font-hind',
  display: 'swap',
});

import { ThemeProvider } from "@/components/theme-provider";

import { getMenuLinks, getSEOConfig } from "@/actions/sections";
import { getGlobalSettings } from "@/actions/settings";
import Script from "next/script";
import { Toaster } from "sonner";
import { CursorParticles } from "@/components/ui/CursorParticles";
import { ContactModal } from "@/components/modals/ContactModal";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOConfig();
  const settings = await getGlobalSettings();

  const siteName = settings?.siteName || "Rana Edits";
  const defaultTitle = seo?.metaTitle || siteName;
  const defaultDesc = seo?.metaDesc || settings?.tagline || "We Turn Your Content Into Viral Machines.";
  const defaultImage = seo?.ogImage || (settings?.logoType === 'image' && settings.logoUrl ? settings.logoUrl : undefined);

  return {
    title: {
      default: defaultTitle,
      template: `%s | ${siteName}`
    },
    description: defaultDesc,
    keywords: seo?.keywords ? seo.keywords.split(",").map(k => k.trim()) : ["Video Editing", "Reels", "TikTok", "Agency"],
    robots: {
      index: seo?.robotsIndex ?? true,
      follow: seo?.robotsFollow ?? true,
    },
    alternates: seo?.canonicalUrl ? {
      canonical: seo.canonicalUrl,
    } : undefined,
    openGraph: {
      title: seo?.ogTitle || defaultTitle,
      description: seo?.ogDesc || defaultDesc,
      images: defaultImage ? [{ url: defaultImage }] : [],
      type: "website",
      siteName: siteName,
    },
    twitter: {
      card: (seo?.twitterCard as "summary" | "summary_large_image") || "summary_large_image",
      title: seo?.twitterTitle || seo?.ogTitle || defaultTitle,
      description: seo?.twitterDesc || seo?.ogDesc || defaultDesc,
      images: seo?.twitterImage || defaultImage ? [seo?.twitterImage || defaultImage!] : undefined,
    },
    icons: settings?.faviconUrl ? {
      icon: settings.faviconUrl,
      shortcut: settings.faviconUrl,
    } : undefined
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch global data
  const [allMenuLinks, settings, seo, socialLinksRes] = await Promise.all([
    import("@/actions/admin-modules").then(m => m.getMenuLinks(true)),
    getGlobalSettings(),
    getSEOConfig(),
    import("@/actions/socials").then(m => m.getSocialLinks())
  ]);

  const socialLinks = socialLinksRes.success ? socialLinksRes.data || [] : [];

  // Map type correctly if there are any lingering Prisma cache mismatches locally
  const activeLinks = allMenuLinks.map((l: any) => ({
    ...l,
    isActive: typeof l.isActive === 'boolean' ? l.isActive : typeof l.visible === 'boolean' ? l.visible : true,
  })).filter(l => l.isActive);

  const headerLinks = activeLinks.filter(l => l.type === 'header' || l.type === 'both');
  const footerLinks = activeLinks.filter(l => l.type === 'footer' || l.type === 'both');

  // Generate JSON-LD Schema Markup
  const schemaType = seo?.schemaType || "Organization";
  const jsonLd = schemaType !== "None" ? {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": settings?.siteName || "Rana Edits",
    "url": seo?.canonicalUrl || "https://ranaedits.site",
    "description": seo?.metaDesc || settings?.tagline || "",
    ...(seo?.ogImage ? { "image": seo.ogImage } : {}),
    ...(settings?.contactEmail ? { "email": settings.contactEmail } : {}),
    ...(settings?.contactPhone ? { "telephone": settings.contactPhone } : {}),
  } : null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${hindSiliguri.variable} font-sans antialiased`} suppressHydrationWarning>
        <CursorParticles />
        <ContactModal />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          themes={["dark", "blue"]}
          disableTransitionOnChange
        >
          <ConditionalLayout menuLinks={headerLinks} footerLinks={footerLinks} settings={settings} socialLinks={socialLinks}>
            {children}
          </ConditionalLayout>
          <Toaster />
        </ThemeProvider>

        {/* JSON-LD Schema Structured Data */}
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}

        {/* Custom Global Scripts (e.g. Analytics) */}
        {seo?.scripts && (
          <Script id="custom-scripts" strategy="afterInteractive">
            {seo.scripts}
          </Script>
        )}
      </body>
    </html>
  );
}
