"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Palette, PenTool, Layout, Layers, Wand2 } from "lucide-react"
import { submitForm } from "@/actions/leads"

interface GraphicProjectModalProps {
    onClose: () => void;
}

export function GraphicProjectModal({ onClose }: GraphicProjectModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const form = formRef.current!
        const formData = new FormData(form)

        const result = await submitForm({
            formType: "graphic-project",
            source: "graphic-project-modal",
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            company: formData.get("company") as string || undefined,
            message: formData.get("requirements") as string || undefined,
            metadata: {
                requirements: formData.get("requirements") as string,
            }
        })

        setIsSubmitting(false)
        if (result.success) {
            setIsSuccess(true)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-xl bg-white dark:bg-zinc-950 rounded-none shadow-2xl border-2 border-black dark:border-white overflow-hidden flex"
        >
            {/* Left Tools Panel (Design Software Vibe) */}
            <div className="w-16 bg-zinc-100 dark:bg-zinc-900 border-r-2 border-black dark:border-white flex flex-col items-center py-6 gap-6">
                <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black text-xs">
                    Gd
                </div>
                <div className="flex flex-col gap-4 text-zinc-400">
                    <Layout className="w-5 h-5 hover:text-black dark:hover:text-white transition-colors cursor-pointer" />
                    <PenTool className="w-5 h-5 hover:text-black dark:hover:text-white transition-colors cursor-pointer text-black dark:text-white" />
                    <Palette className="w-5 h-5 hover:text-black dark:hover:text-white transition-colors cursor-pointer" />
                    <Layers className="w-5 h-5 hover:text-black dark:hover:text-white transition-colors cursor-pointer" />
                </div>
                <div className="mt-auto">
                    <div className="w-3 h-3 rounded-full bg-red-500 mb-2" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mb-2" />
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                </div>
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 p-8 relative">
                {/* Dot Grid Background */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] opacity-50 pointer-events-none" />

                <div className="relative z-10">
                    <div className="mb-6 flex items-baseline justify-between">
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-black dark:text-white transform -skew-x-12">
                            Create Art
                        </h2>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono border border-black dark:border-white px-2 py-0.5 rounded-full">
                                NEW CANVAS
                            </span>
                            <button onClick={onClose} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
                                <span className="sr-only">Close</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {isSuccess ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 relative mb-6">
                                <Wand2 className="w-12 h-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-600 animate-pulse" />
                                <div className="absolute inset-0 border-4 border-dashed border-zinc-300 dark:border-zinc-700 rounded-full animate-spin-slow" />
                            </div>
                            <h3 className="text-xl font-bold font-mono">Masterpiece Initiated!</h3>
                            <p className="text-zinc-500 text-sm mt-2">Our designers are setting up the canvas.</p>
                            <Button onClick={onClose} variant="ghost" className="mt-6 font-mono text-xs underline">Back to Gallery</Button>
                        </div>
                    ) : (
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold uppercase font-mono">Client</Label>
                                    <Input name="name" required className="border-2 border-zinc-200 dark:border-zinc-800 rounded-none focus:ring-0 focus:border-black dark:focus:border-white transition-colors bg-transparent font-bold" placeholder="NAME" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold uppercase font-mono">Brand</Label>
                                    <Input name="company" className="border-2 border-zinc-200 dark:border-zinc-800 rounded-none focus:ring-0 focus:border-black dark:focus:border-white transition-colors bg-transparent font-bold" placeholder="COMPANY" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase font-mono">Contact</Label>
                                <Input name="email" required type="email" className="border-2 border-zinc-200 dark:border-zinc-800 rounded-none focus:ring-0 focus:border-black dark:focus:border-white transition-colors bg-transparent font-bold" placeholder="EMAIL" />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase font-mono">Requirements</Label>
                                <Textarea
                                    name="requirements"
                                    className="border-2 border-zinc-200 dark:border-zinc-800 rounded-none focus:ring-0 focus:border-black dark:focus:border-white transition-colors bg-transparent min-h-[100px] font-medium resize-none"
                                    placeholder="Describe your vision..."
                                />
                            </div>

                            <div className="flex items-center gap-4 pt-2">
                                <div className="flex-1 h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-full opacity-20" />
                            </div>

                            <Button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black font-black uppercase rounded-none border-2 border-transparent hover:bg-transparent hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all h-12" disabled={isSubmitting}>
                                {isSubmitting ? "Rendering..." : "Start Designing"}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
