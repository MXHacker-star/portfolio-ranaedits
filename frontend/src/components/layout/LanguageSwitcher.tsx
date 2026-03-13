"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage()
    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => setIsOpen(!isOpen)

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                onClick={toggle}
                className="w-9 px-0 border-white/10 hover:bg-white/5"
            >
                <Globe className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-foreground" />
                <span className="sr-only">Toggle language</span>
                <span className="absolute -bottom-1 -right-1 text-[8px] font-bold uppercase text-primary">
                    {language}
                </span>
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 5 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 top-full min-w-[120px] rounded-md border border-white/10 bg-black/90 p-1 shadow-lg backdrop-blur-md"
                    >
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={() => {
                                    setLanguage('en')
                                    setIsOpen(false)
                                }}
                                className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-xs font-medium transition-colors hover:bg-white/10 ${language === 'en' ? 'text-primary' : 'text-muted-foreground'}`}
                            >
                                <span>English</span>
                                {language === 'en' && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                            </button>
                            <button
                                onClick={() => {
                                    setLanguage('bn')
                                    setIsOpen(false)
                                }}
                                className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-xs font-medium font-bengali transition-colors hover:bg-white/10 ${language === 'bn' ? 'text-primary' : 'text-muted-foreground'}`}
                            >
                                <span>বাংলা</span>
                                {language === 'bn' && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
