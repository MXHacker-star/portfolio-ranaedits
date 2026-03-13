"use client"

import { Navbar } from "@/components/layout/Navbar";

import { GraphicDesignGallery } from "@/components/sections/GraphicDesignGallery";
import { CTASection } from "@/components/sections/CTASection";
import { useTranslation } from "@/lib/i18n";

interface GraphicDesignContentProps {
    allItems: any[];
    graphicCategories: string[];
}

export function GraphicDesignContent({ allItems, graphicCategories }: GraphicDesignContentProps) {
    const { t } = useTranslation();

    return (
        <main className="min-h-screen bg-background text-foreground">

            <section className="pt-32 pb-20 container px-4 md:px-6 mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl uppercase mb-4">
                        {t.graphicPage.title.split(' ')[0]} <span className="text-primary">{t.graphicPage.title.split(' ').slice(1).join(' ')}</span>
                    </h1>
                    <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                        {t.graphicPage.subtitle}
                    </p>
                </div>

                <GraphicDesignGallery items={allItems} categories={graphicCategories} />
            </section>

            <CTASection
                title={t.graphicPage.ctaTitle}
                description={t.graphicPage.ctaDesc}
                buttonText={t.graphicPage.ctaBtn}
                source="Graphic Design CTA"
                type="graphic-project"
            />


        </main>
    );
}
