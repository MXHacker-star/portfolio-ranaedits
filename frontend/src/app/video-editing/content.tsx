"use client"

import { Navbar } from "@/components/layout/Navbar";

import { VideoGallery } from "@/components/sections/VideoGallery";
import { CTASection } from "@/components/sections/CTASection";
import { useTranslation } from "@/lib/i18n";

interface VideoProjectsContentProps {
    horizontalItems: any[];
    verticalItems: any[];
    videoCategories: string[];
}

export function VideoProjectsContent({ horizontalItems, verticalItems, videoCategories }: VideoProjectsContentProps) {
    const { t } = useTranslation();

    return (
        <main className="min-h-screen bg-background text-foreground">

            <section className="pt-32 pb-20 container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl uppercase mb-4">
                        {t.videoPage.title.split(' ')[0]} <span className="text-primary">{t.videoPage.title.split(' ').slice(1).join(' ')}</span>
                    </h1>
                    <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                        {t.videoPage.subtitle}
                    </p>
                </div>

                {/* Horizontal Section */}
                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-white/10 flex-grow"></div>
                        <h2 className="text-2xl font-bold uppercase tracking-wider text-white">{t.videoPage.horizontalTitle}</h2>
                        <div className="h-px bg-white/10 flex-grow"></div>
                    </div>
                    <VideoGallery items={horizontalItems} categories={videoCategories} />
                </div>

                {/* Vertical Section */}
                {verticalItems.length > 0 && (
                    <div className="mb-20">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px bg-white/10 flex-grow"></div>
                            <h2 className="text-2xl font-bold uppercase tracking-wider text-white">{t.videoPage.verticalTitle}</h2>
                            <div className="h-px bg-white/10 flex-grow"></div>
                        </div>
                        <VideoGallery items={verticalItems} categories={videoCategories} variant="vertical" />
                    </div>
                )}
            </section>

            <CTASection
                title={t.videoPage.ctaTitle}
                description={t.videoPage.ctaDesc}
                buttonText={t.videoPage.ctaBtn}
                source="Video Projects CTA"
                type="video-project"
            />


        </main>
    );
}
