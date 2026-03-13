"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Clapperboard, Film, Play, Upload } from "lucide-react"
import { submitForm } from "@/actions/leads"


interface VideoProjectModalProps {
    onClose: () => void;
}

export function VideoProjectModal({ onClose }: VideoProjectModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [selectedType, setSelectedType] = useState("")
    const formRef = useRef<HTMLFormElement>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const form = formRef.current!
        const formData = new FormData(form)

        const result = await submitForm({
            formType: "video-project",
            source: "video-project-modal",
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            company: formData.get("company") as string || undefined,
            message: formData.get("brief") as string || undefined,
            metadata: {
                referenceUrl: formData.get("referenceUrl") as string,
                projectType: selectedType,
                brief: formData.get("brief") as string,
            }
        })

        setIsSubmitting(false)
        if (result.success) {
            setIsSuccess(true)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateX: -10 }}
            className="w-full max-w-lg bg-black text-white rounded-xl shadow-2xl border-4 border-zinc-900 overflow-hidden relative"
        >
            {/* Clapperboard Header Strip */}
            <div className="h-16 bg-zinc-800 flex items-center justify-between px-4 border-b-4 border-black relative">
                {/* Film Perforations */}
                <div className="absolute top-2 left-0 w-full flex justify-between px-2">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="w-4 h-3 bg-black rounded-sm" />
                    ))}
                </div>
                {/* Clapper Details */}
                <div className="absolute bottom-2 left-4 text-[10px] font-mono text-zinc-400 uppercase">
                    Scene: Intro • Take: 1
                </div>
                <div className="absolute bottom-2 right-4 text-[10px] font-mono text-zinc-400 uppercase flex items-center gap-4">
                    <span>Date: {new Date().toLocaleDateString()}</span>
                    <button onClick={onClose} className="hover:text-red-500 transition-colors bg-black/50 px-2 py-0.5 rounded border border-zinc-700">
                        ✖ CLOSE
                    </button>
                </div>
            </div>

            <div className="p-6 relative">
                {/* Background Grain/Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />

                <div className="text-center mb-4 relative z-10">
                    <div className="inline-flex items-center justify-center p-2 bg-red-600 rounded-full mb-2 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                        <Clapperboard className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tighter">Start Your Production</h2>
                </div>

                {isSuccess ? (
                    <div className="py-8 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-5">
                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-700">
                            <Play className="w-8 h-8 text-red-600 fill-red-600 ml-1" />
                        </div>
                        <h3 className="text-lg font-bold uppercase tracking-wide">It's a Wrap!</h3>
                        <p className="text-zinc-500 text-xs mt-2 max-w-xs">We've received your script. Our editors will be in touch.</p>
                        <Button onClick={onClose} variant="outline" size="sm" className="mt-6 border-zinc-700 text-zinc-300 hover:bg-zinc-900 hover:text-white">Close Scene</Button>
                    </div>
                ) : (
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3 relative z-10">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Director</Label>
                                <Input name="name" required className="bg-zinc-900/50 border-zinc-800 text-white focus:border-red-600/50 h-8 font-mono text-xs" placeholder="NAME" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Studio</Label>
                                <Input name="company" className="bg-zinc-900/50 border-zinc-800 text-white focus:border-red-600/50 h-8 font-mono text-xs" placeholder="COMPANY" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Contact</Label>
                                <Input name="email" required type="email" className="bg-zinc-900/50 border-zinc-800 text-white focus:border-red-600/50 h-8 font-mono text-xs" placeholder="EMAIL" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Reference Link</Label>
                                <div className="relative">
                                    <Input name="referenceUrl" className="bg-zinc-900/50 border-zinc-800 text-white focus:border-red-600/50 h-8 font-mono text-xs pl-7" placeholder="URL" />
                                    <Upload className="w-3 h-3 text-zinc-600 absolute left-2 top-2.5" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Project Type</Label>
                            <div className="flex gap-2">
                                {['YouTube', 'Reels', 'Documentary'].map((type) => (
                                    <div key={type} className="flex-1 flex items-center justify-center py-1.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400 hover:border-red-600/30 hover:text-white cursor-pointer transition-colors">
                                        {type}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Script / Brief</Label>
                            <Textarea
                                name="brief"
                                className="bg-zinc-900/50 border-zinc-800 text-white focus:border-red-600/50 min-h-[60px] font-mono text-xs resize-none"
                                placeholder="Describe the scene..."
                            />
                        </div>

                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest h-12" disabled={isSubmitting}>
                            {isSubmitting ? "Rolling..." : "Action!"}
                        </Button>
                    </form>
                )}
            </div>

            {/* Bottom Film Strip Decoration */}
            <div className="h-4 w-full bg-zinc-800 border-t-2 border-black flex justify-between px-2 overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="w-3 h-2 bg-black rounded-sm mt-1" />
                ))}
            </div>
        </motion.div>
    )
}
