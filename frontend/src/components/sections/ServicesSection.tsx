"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

interface ServiceItem {
    id: string
    title: string
    description: string
    icon: string
    link: string | null
    order: number
}

interface ServicesSectionProps {
    services?: ServiceItem[]
}

const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
    const Icon = (LucideIcons as any)[name] || LucideIcons.Box;
    return <Icon className={className} />;
};

export function ServicesSection({ services: dbServices = [] }: ServicesSectionProps) {
    const { t, language } = useTranslation();

    // Fallback if DB is empty — 3 default services
    const defaultServices = [
        {
            icon: "Video",
            title: t.services.videoTitle,
            description: t.services.videoDesc,
            link: "/video-editing"
        },
        {
            icon: "Brush",
            title: t.services.graphicTitle,
            description: t.services.graphicDesc,
            link: "/graphic-design"
        },
        {
            icon: "Code",
            title: t.services.webTitle,
            description: t.services.webDesc,
            link: "/web-development"
        }
    ];

    // i18n translation map: maps DB English titles to translated versions
    // This allows DB services to display correctly in Bengali
    const translationMap: Record<string, { title: string; desc: string }> = {
        "Viral Video Editing": { title: t.services.videoTitle, desc: t.services.videoDesc },
        "Graphic Design": { title: t.services.graphicTitle, desc: t.services.graphicDesc },
        "Web Development": { title: t.services.webTitle, desc: t.services.webDesc },
    };

    // Use DB services when available, otherwise show defaults
    const servicesSource = dbServices.length > 0
        ? dbServices.map(s => {
            const translated = translationMap[s.title];
            return translated
                ? { ...s, title: translated.title, description: translated.desc }
                : s;
        })
        : defaultServices;

    const displayServices = servicesSource.map((s, i) => ({
        id: `service-${i}`,
        ...s,
        order: (s as any).order ?? i
    }));

    return (
        <section id="services-overview" className="py-20 bg-background text-foreground">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl uppercase">
                        {t.services.title.split(' ')[0]} <span className="text-primary">{t.services.title.split(' ').slice(1).join(' ')}</span>
                    </h2>
                    <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t.services.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {displayServices.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <Link href={service.link || "#"} className={`block h-full ${!service.link ? 'cursor-default' : ''}`}>
                                <Card className="h-full bg-card/50 border-primary/10 hover:border-primary/50 transition-all hover:bg-card group">
                                    <CardHeader>
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-black transition-colors">
                                            <DynamicIcon name={service.icon} className="w-6 h-6 text-primary group-hover:text-black transition-colors" />
                                        </div>
                                        <CardTitle className="text-2xl font-bold">{service.title}</CardTitle>
                                        <CardDescription className="text-base mt-2">
                                            {service.description}
                                        </CardDescription>
                                    </CardHeader>

                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
