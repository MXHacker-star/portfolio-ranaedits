"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Send } from "lucide-react"
import { submitForm } from "@/actions/leads"

interface ProposalModalProps {
    onClose: () => void;
}

export function ProposalModal({ onClose }: ProposalModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const form = formRef.current!
        const formData = new FormData(form)

        const result = await submitForm({
            formType: "proposal",
            source: "proposal-modal",
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string || undefined,
            whatsapp: formData.get("phone") as string || undefined,
            company: formData.get("company") as string || undefined,
            message: formData.get("brief") as string || undefined,
            metadata: {
                subject: formData.get("subject") as string,
                brief: formData.get("brief") as string,
            }
        })

        setIsSubmitting(false)
        if (result.success) {
            setIsSuccess(true)
            setTimeout(onClose, 3000)
        }
    }

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-background rounded-xl p-12 text-center"
            >
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Proposal Requested!</h3>
                <p className="text-muted-foreground">We'll review your details and send a custom proposal within 24 hours.</p>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-xl bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 overflow-hidden flex flex-col md:flex-row"
        >
            {/* Left Decorative Strip */}
            <div className="hidden md:flex w-16 bg-zinc-950/50 border-r border-zinc-800 relative flex-col items-center py-8 gap-6">
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
                <Send className="w-5 h-5 text-zinc-500 rotate-[-45deg]" />
                <div className="w-px h-full bg-gradient-to-b from-transparent via-zinc-800 to-transparent flex-1" />
            </div>

            <div className="flex-1 p-6 md:p-8">
                <div className="mb-8">
                    <h2 className="text-xl font-bold uppercase tracking-wider text-white">Project Proposal</h2>
                    <div className="h-1 w-12 bg-primary mt-2 rounded-full" />
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                    {/* Compact Primary Info */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="group">
                                <Label className="text-[10px] uppercase text-zinc-500 font-bold mb-1.5 block group-focus-within:text-primary transition-colors">Full Name</Label>
                                <Input name="name" required className="h-9 text-sm bg-zinc-800/50 border-zinc-700 text-zinc-100 focus:border-primary/50 transition-colors placeholder:text-zinc-600" />
                            </div>
                            <div className="group">
                                <Label className="text-[10px] uppercase text-zinc-500 font-bold mb-1.5 block group-focus-within:text-primary transition-colors">Company</Label>
                                <Input name="company" className="h-9 text-sm bg-zinc-800/50 border-zinc-700 text-zinc-100 focus:border-primary/50 transition-colors placeholder:text-zinc-600" />
                            </div>
                        </div>
                        <div className="group">
                            <Label className="text-[10px] uppercase text-zinc-500 font-bold mb-1.5 block group-focus-within:text-primary transition-colors">Email Address</Label>
                            <Input name="email" required type="email" className="h-9 text-sm bg-zinc-800/50 border-zinc-700 text-zinc-100 focus:border-primary/50 transition-colors placeholder:text-zinc-600" />
                        </div>
                    </div>

                    {/* Contact & Subject */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="group">
                            <Label className="text-[10px] uppercase text-zinc-500 font-bold mb-1.5 block group-focus-within:text-primary transition-colors">WhatsApp / Phone</Label>
                            <Input name="phone" className="h-9 bg-zinc-800/50 border-zinc-700 text-sm text-zinc-100 focus:border-primary/50 transition-colors placeholder:text-zinc-600" />
                        </div>
                        <div className="group">
                            <Label className="text-[10px] uppercase text-zinc-500 font-bold mb-1.5 block group-focus-within:text-primary transition-colors">Subject</Label>
                            <Input name="subject" required className="h-9 bg-zinc-800/50 border-zinc-700 text-sm text-zinc-100 focus:border-primary/50 transition-colors placeholder:text-zinc-600" />
                        </div>
                    </div>

                    <div className="group">
                        <Label className="text-[10px] uppercase text-zinc-500 font-bold mb-1.5 block group-focus-within:text-primary transition-colors">Project Brief</Label>
                        <Textarea
                            name="brief"
                            required
                            className="bg-zinc-800/50 border-zinc-700 min-h-[100px] resize-none text-sm text-zinc-100 focus:border-primary/50 transition-colors placeholder:text-zinc-600"
                        />
                    </div>

                    <div className="pt-4 flex items-center justify-between gap-4 border-t border-zinc-800">
                        <p className="text-[10px] text-zinc-500 max-w-[150px] leading-tight">
                            We respect your privacy. No spam, ever.
                        </p>
                        <Button type="submit" className="bg-primary text-black hover:bg-primary/90 font-bold px-6 h-10 tracking-wide" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "Submit Proposal"}
                        </Button>
                    </div>
                </form>
            </div>
        </motion.div>
    )
}

