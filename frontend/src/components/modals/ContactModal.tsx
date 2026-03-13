
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useContactModal } from "@/lib/stores/useContactModal"
import { ConsultancyModal } from "./ConsultancyModal"
import { ProposalModal } from "./ProposalModal"
import { PackageModal } from "./PackageModal"
import { VideoProjectModal } from "./VideoProjectModal"
import { GraphicProjectModal } from "./GraphicProjectModal"

export function ContactModal() {
    const { isOpen, closeModal, context } = useContactModal()

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content Wrapper - Auto Sizing */}
                    <div className="relative z-10 w-full flex items-center justify-center p-4">
                        {/* Close Button - Adjusted position for different modal sizes */}
                        <div className="relative w-full max-w-fit">
                            <button
                                onClick={closeModal}
                                className="absolute -top-12 right-0 md:-right-12 z-50 rounded-full p-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="h-8 w-8" />
                            </button>

                            {context.type === 'consultancy' && <ConsultancyModal onClose={closeModal} />}
                            {context.type === 'proposal' && <ProposalModal onClose={closeModal} />}
                            {context.type === 'package' && <PackageModal onClose={closeModal} />}
                            {context.type === 'video-project' && <VideoProjectModal onClose={closeModal} />}
                            {context.type === 'graphic-project' && <GraphicProjectModal onClose={closeModal} />}
                            {(!context.type || context.type === 'general') && <ProposalModal onClose={closeModal} />}
                        </div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    )
}
