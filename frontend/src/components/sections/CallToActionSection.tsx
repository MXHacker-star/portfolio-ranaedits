"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function CallToActionSection() {
    return (
        <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="container px-4 md:px-6 mx-auto relative z-10 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white mb-6"
                >
                    Ready To Go Viral?
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
                >
                    Stop wasting time on edits that don't convert. Let's build your authority today.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <Button size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto font-bold bg-white text-primary hover:bg-gray-100">
                        Book Your Free Strategy Call
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}
