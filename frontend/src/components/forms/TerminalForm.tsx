"use strict";
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Terminal, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";
import { submitForm } from "@/actions/leads";



export interface FormStep {
    key: string;
    label: string;
    type: string;
    placeholder?: string;
    options?: string[];
}

export function TerminalForm() {
    const { t } = useTranslation();

    // Dynamic steps based on current language
    const steps: FormStep[] = [
        {
            key: "name",
            label: (t as any).terminal?.steps?.name || "Initialize User Identity (Name):",
            type: "text",
            placeholder: (t as any).terminal?.steps?.namePlaceholder || "Ex: John Doe"
        },
        {
            key: "email",
            label: (t as any).terminal?.steps?.email || "Enter Communication Protocol (Email):",
            type: "text",
            placeholder: (t as any).terminal?.steps?.emailPlaceholder || "john@example.com"
        },
        {
            key: "projectType",
            label: (t as any).terminal?.steps?.projectType || "Select Project Architecture:",
            type: "select",
            options: [
                (t as any).terminal?.options?.ecommerce || "E-Commerce",
                (t as any).terminal?.options?.portfolio || "Portfolio",
                (t as any).terminal?.options?.saas || "SaaS",
                (t as any).terminal?.options?.corporate || "Corporate",
                (t as any).terminal?.options?.custom || "Custom App"
            ]
        },
        {
            key: "budget",
            label: (t as any).terminal?.steps?.budget || "Allocate Resources (Budget):",
            type: "select",
            options: [
                (t as any).terminal?.options?.budget1 || "< $1k",
                (t as any).terminal?.options?.budget2 || "$1k - $3k",
                (t as any).terminal?.options?.budget3 || "$3k - $5k",
                (t as any).terminal?.options?.budget4 || "$5k+"
            ]
        },
        {
            key: "details",
            label: (t as any).terminal?.steps?.details || "Define Project Specifies:",
            type: "text",
            placeholder: (t as any).terminal?.steps?.detailsPlaceholder || "Describe your vision..."
        }
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [inputValue, setInputValue] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [currentStep, inputValue]);

    const handleNext = () => {
        if (!inputValue.trim()) return;

        setFormData(prev => ({ ...prev, [steps[currentStep].key]: inputValue }));
        setInputValue("");

        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleOptionSelect = (option: string) => {
        setFormData(prev => ({ ...prev, [steps[currentStep].key]: option }));
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Last step logic
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // Include the last step's value
        const finalData = { ...formData, [steps[currentStep].key]: inputValue };

        const result = await submitForm({
            formType: "terminal",
            source: "terminal-form",
            name: finalData.name || "",
            email: finalData.email || "",
            message: finalData.details || undefined,
            metadata: {
                projectType: finalData.projectType,
                budget: finalData.budget,
                details: finalData.details,
            }
        });

        setIsSubmitting(false);
        if (result.success) {
            setIsCompleted(true);
            toast.success((t as any).terminal?.complete || "Project Initialization Sequence Complete!");
        }
    };

    if (isCompleted) {
        return (
            <div className="w-full max-w-2xl mx-auto p-1 rounded-lg bg-gradient-to-r from-primary to-purple-600">
                <div className="bg-[#0a0a0a] rounded-lg p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
                    >
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </motion.div>
                    <h3 className="text-2xl font-mono text-green-400 mb-2">{(t as any).terminal?.complete || "Sequence Complete"}</h3>
                    <p className="text-gray-400 font-mono">{(t as any).terminal?.received || "We have received your signal. Standby for contact."}</p>
                    <Button
                        className="mt-8 font-mono"
                        variant="outline"
                        onClick={() => {
                            setIsCompleted(false);
                            setCurrentStep(0);
                            setFormData({});
                        }}
                    >
                        {(t as any).terminal?.restart || "./restart_sequence.sh"}
                    </Button>
                </div>
            </div>
        );
    }

    const currentField = steps[currentStep];

    return (
        <div className="w-full max-w-2xl mx-auto shadow-2xl overflow-hidden rounded-lg font-mono text-sm md:text-base">
            <div className="bg-[#1a1a1a] p-3 flex items-center gap-2 border-b border-white/10">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="ml-4 text-gray-500 text-xs">{(t as any).terminal?.user || "user@rana-edits:~"}</div>
            </div>

            <div
                ref={scrollRef}
                className="bg-[#0a0a0a] p-6 min-h-[400px] max-h-[600px] overflow-y-auto flex flex-col"
            >
                <div className="space-y-4">
                    <div className="text-gray-400">
                        {(t as any).terminal?.lastLogin || "Last login:"} {new Date().toDateString()} on ttys001
                    </div>
                    <div className="text-purple-400">
                        {(t as any).terminal?.welcome || "Welcome to Rana Edits Terminal. Let's build something great."}
                    </div>

                    {/* History */}
                    {steps.slice(0, currentStep).map((step, i) => (
                        <div key={i} className="space-y-1">
                            <div className="flex gap-2 text-primary">
                                <span>?</span>
                                <span className="font-bold">{step.label}</span>
                            </div>
                            <div className="text-green-400 pl-6">
                                &gt; {formData[step.key]}
                            </div>
                        </div>
                    ))}

                    {/* Current Step */}
                    <div className="space-y-3 mt-6">
                        <div className="flex gap-2 text-primary animate-pulse">
                            <span>?</span>
                            <span className="font-bold">{currentField.label}</span>
                        </div>

                        {currentField.type === "select" || currentField.type === "budget" ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pl-4">
                                {currentField.options?.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleOptionSelect(option)}
                                        className="text-left px-3 py-2 border border-white/10 rounded hover:bg-white/10 hover:border-primary/50 text-gray-300 transition-colors"
                                    >
                                        [ {option} ]
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 pl-4">
                                <span className="text-green-400">&gt;</span>
                                <form
                                    onSubmit={(e) => { e.preventDefault(); handleNext(); }}
                                    className="flex-1"
                                >
                                    <input
                                        autoFocus
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={currentField.placeholder || "Type here..."}
                                        className="bg-transparent border-none outline-none text-gray-100 w-full placeholder:text-gray-700"
                                    />
                                </form>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleNext}
                                    disabled={!inputValue.trim()}
                                    className="text-gray-500 hover:text-green-400"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {isSubmitting && (
                        <div className="text-yellow-400 mt-4 animate-pulse">
                            &gt; {(t as any).terminal?.uploading || "Uploading data..."} [====================] 100%
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
