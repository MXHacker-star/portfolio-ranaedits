"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"

import { useTranslation } from "@/lib/i18n"

interface FAQItem {
    id: string
    question: string
    answer: string
    category: string | null
    order: number
}

interface FAQSectionProps {
    faqs?: FAQItem[]
}

export function FAQSection({ faqs = [] }: FAQSectionProps) {
    const { t } = useTranslation()
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    if (!faqs || faqs.length === 0) {
        return null;
    }

    const displayFAQs = faqs

    return (
        <section id="faq" className="py-20 bg-background text-foreground border-t border-white/5">
            <div className="container px-4 md:px-6 mx-auto max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl uppercase">
                        {((t as any).faq?.title || "Frequently Asked Questions").split(" ").slice(0, -1).join(" ")} <span className="text-primary">{((t as any).faq?.title || "Frequently Asked Questions").split(" ").slice(-1)}</span>
                    </h2>
                    <p className="mt-4 text-muted-foreground text-lg">
                        {(t as any).faq?.subtitle || "Everything you need to know about working with me."}
                    </p>
                </div>

                <div className="space-y-4">
                    {displayFAQs.map((faq, index) => (
                        <div
                            key={faq.id}
                            className={`border rounded-xl transition-all duration-300 ${openIndex === index ? 'border-primary/50 bg-primary/5' : 'border-white/10 bg-card hover:border-primary/30'}`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="flex items-center justify-between w-full p-6 text-left"
                            >
                                <span className={`text-lg font-bold ${openIndex === index ? 'text-primary' : 'text-white'}`}>
                                    {faq.question}
                                </span>
                                <div className={`p-1 rounded-full border transition-colors ${openIndex === index ? 'border-primary text-primary' : 'border-white/20 text-muted-foreground'}`}>
                                    {openIndex === index ? (
                                        <Minus className="w-4 h-4" />
                                    ) : (
                                        <Plus className="w-4 h-4" />
                                    )}
                                </div>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                                            {faq.answer.split('\n').map((line: string, i: number) => (
                                                <p key={i} className="mb-2 last:mb-0">{line}</p>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
