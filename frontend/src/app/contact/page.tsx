"use client"

import { ContactForm } from "@/components/forms/ContactForm"
import { useTranslation } from "@/lib/i18n"

export default function ContactPage() {
    const { t } = useTranslation();

    return (
        <main className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 py-24">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">{t.contactPage.title}</h1>
                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                    {t.contactPage.subtitle}
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
                    {/* Contact Form */}
                    <div>
                        <ContactForm />
                    </div>

                    {/* Calendly Details / Embed */}
                    <div className="bg-card/30 border border-white/5 rounded-xl p-8 sticky top-24">
                        <h2 className="text-2xl font-bold text-white mb-4">{t.contactPage.bookCallTitle}</h2>
                        <p className="text-muted-foreground mb-6">
                            {t.contactPage.bookCallDesc}
                        </p>

                        {/* Calendly Embed Placeholder */}
                        <div className="aspect-square w-full bg-background rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center flex-col p-6 text-center">
                                <p className="text-muted-foreground mb-4">{t.contactPage.calendlyPlaceholder}</p>
                                <a
                                    href="https://calendly.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                >
                                    {t.contactPage.openCalendly}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
