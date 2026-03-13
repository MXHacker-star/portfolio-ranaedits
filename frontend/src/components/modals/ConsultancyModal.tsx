import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Clock, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { submitForm } from "@/actions/leads"

interface ConsultancyModalProps {
    onClose: () => void;
}

export function ConsultancyModal({ onClose }: ConsultancyModalProps) {
    const { t } = useTranslation()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const form = formRef.current!
        const formData = new FormData(form)

        const result = await submitForm({
            formType: "consultancy",
            source: "consultancy-modal",
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string || undefined,
            whatsapp: formData.get("whatsapp") as string || undefined,
            message: formData.get("topic") as string || undefined,
            scheduledDate: formData.get("date") as string || undefined,
            scheduledTime: formData.get("time") as string || undefined,
            metadata: {
                preferredDate: formData.get("date") as string,
                preferredTime: formData.get("time") as string,
                topic: formData.get("topic") as string,
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-lg relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl"
        >
            {/* Glossy Header Effect */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/20 to-transparent opacity-50 pointer-events-none" />
            <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative p-8">
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-primary/20 text-primary border border-primary/20">
                                30 Min Session
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-white tracking-tight">Strategy Call</h3>
                        <p className="text-zinc-400 text-sm mt-1">Book your exclusive consultation slot.</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                        <CalendarIcon className="w-5 h-5 text-primary" />
                    </div>
                </div>

                {isSuccess ? (
                    <div className="py-12 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 ring-1 ring-green-500/20">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">Slot Confirmed!</h4>
                        <p className="text-zinc-400 text-sm">We've sent the meeting details to your email.</p>
                    </div>
                ) : (
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label className="text-zinc-400 text-xs uppercase tracking-wider">Your Name</Label>
                                <Input name="name" required className="bg-zinc-800/50 border-zinc-700 text-white focus:border-primary/50" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-400 text-xs uppercase tracking-wider">Email</Label>
                                <Input name="email" required type="email" className="bg-zinc-800/50 border-zinc-700 text-white focus:border-primary/50" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label className="text-zinc-400 text-xs uppercase tracking-wider">Phone</Label>
                                <Input name="phone" className="bg-zinc-800/50 border-zinc-700 text-white focus:border-primary/50" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-400 text-xs uppercase tracking-wider">WhatsApp</Label>
                                <Input name="whatsapp" className="bg-zinc-800/50 border-zinc-700 text-white focus:border-primary/50" />
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-800 space-y-4">
                            <div className="space-y-2">
                                <Label className="text-zinc-400 text-xs uppercase tracking-wider flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-primary" />
                                    Preferred Time
                                </Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input name="date" required type="date" className="bg-zinc-900 border-zinc-700 text-white focus:border-primary/50" />
                                    <Input name="time" required type="time" className="bg-zinc-900 border-zinc-700 text-white focus:border-primary/50" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-400 text-xs uppercase tracking-wider">Discussion Topic</Label>
                            <Textarea
                                name="topic"
                                className="bg-zinc-800/50 border-zinc-700 text-white focus:border-primary/50 min-h-[80px] resize-none"
                            />
                        </div>

                        <Button type="submit" className="w-full bg-primary text-black font-bold h-12 uppercase tracking-wide hover:bg-primary/90 transition-all text-sm" disabled={isSubmitting}>
                            {isSubmitting ? "Confirming..." : "Secure Your Slot"}
                        </Button>
                    </form>
                )}
            </div>
        </motion.div>
    )
}

