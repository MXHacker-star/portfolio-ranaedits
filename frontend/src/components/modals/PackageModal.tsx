"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Package, ArrowRight } from "lucide-react"
import { useContactModal } from "@/lib/stores/useContactModal"
import { submitForm } from "@/actions/leads"

interface PackageModalProps {
    onClose: () => void;
}

export function PackageModal({ onClose }: PackageModalProps) {
    const { context } = useContactModal()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const form = formRef.current!
        const formData = new FormData(form)

        const result = await submitForm({
            formType: "package",
            source: "package-modal",
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string || undefined,
            whatsapp: formData.get("whatsapp") as string || undefined,
            message: formData.get("goals") as string || undefined,
            metadata: {
                packageName: context.packageDetails?.name || "Custom Package",
                packagePrice: context.packageDetails?.price || "Custom Quote",
                goals: formData.get("goals") as string,
            }
        })

        setIsSubmitting(false)
        if (result.success) {
            setIsSuccess(true)
            setTimeout(onClose, 3000)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-zinc-200 dark:border-zinc-800"
        >
            {/* Left Side: Package Summary */}
            <div className="w-full md:w-2/5 p-8 bg-zinc-50 dark:bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 -mr-8 -mt-8 bg-primary/10 rounded-full blur-3xl" />

                <div>
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center mb-6 text-primary">
                        <Package className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-2">Selected Package</h3>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{context.packageDetails?.name || "Custom Package"}</h2>
                    <p className="text-3xl font-bold text-primary">{context.packageDetails?.price || "Custom Quote"}</p>
                </div>

                <div className="mt-8">
                    <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                        You're one step away from transforming your content. Fill out the details to get started.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-900 dark:text-zinc-300">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Available for new projects
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 p-8 bg-white dark:bg-zinc-950">
                {isSuccess ? (
                    <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in">
                        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h4 className="text-xl font-bold mb-2">Inquiry Received!</h4>
                        <p className="text-muted-foreground text-sm">We'll discuss the {context.packageDetails?.name} details with you shortly.</p>
                    </div>
                ) : (
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold">Your Details</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase text-zinc-500">Full Name</Label>
                                <Input name="name" required className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:border-primary/50 transition-colors" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase text-zinc-500">Email Address</Label>
                                <Input name="email" required type="email" className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:border-primary/50 transition-colors" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold uppercase text-zinc-500">Phone</Label>
                                    <Input name="phone" className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:border-primary/50 transition-colors" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold uppercase text-zinc-500">WhatsApp</Label>
                                    <Input name="whatsapp" className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:border-primary/50 transition-colors" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase text-zinc-500">Project Goals (Optional)</Label>
                                <Textarea
                                    name="goals"
                                    className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 min-h-[80px] resize-none focus:border-primary/50 transition-colors"
                                    placeholder="Briefly describe what you want to achieve..."
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full group mt-2" size="lg" disabled={isSubmitting}>
                            {isSubmitting ? "Processing..." : "Get Started Now"}
                            {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                        </Button>
                    </form>
                )}
            </div>
        </motion.div>
    )
}
