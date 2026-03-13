"use strict";
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Terminal, Code, Cpu } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const codeSnippet = `const output = {
  agency: "Rana Edits",
  service: "Web Development",
  stack: ["Next.js", "React"],
  status: "Ready to Launch"
};

return (
  <DigitalExperience 
    quality="Premium" 
    speed="Fast" 
  />
);`;

export function CodeTransformation() {
    const { t } = useTranslation();
    const [displayText, setDisplayText] = useState("");

    // Typing effect
    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            setDisplayText(codeSnippet.substring(0, i));
            i++;
            if (i > codeSnippet.length) clearInterval(timer);
        }, 30); // Speed of typing
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Code Editor */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-purple-600/50 rounded-xl blur opacity-30" />
                        <div className="relative rounded-xl border border-white/10 bg-[#0a0a0a] p-6 font-mono text-sm h-[400px] overflow-hidden shadow-2xl">
                            <div className="flex gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <pre className="text-gray-300 overflow-x-auto">
                                <code>
                                    <span className="text-purple-400">export default</span> <span className="text-blue-400">function</span> <span className="text-yellow-400">App</span>() {"{"}
                                    {"\n"}  {displayText}
                                    <span className="animate-pulse">|</span>
                                    {"\n"}{"}"}
                                </code>
                            </pre>
                        </div>
                    </motion.div>

                    {/* Right: The Result */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col justify-center"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit mb-6 border border-primary/20">
                            <Terminal className="w-4 h-4" />
                            <span>{(t as any).codeTransform?.badge || "Full Stack Engineering"}</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                            {(t as any).codeTransform?.title
                                ? (t as any).codeTransform.title.split(".").map((part: string, i: number) => (
                                    <span key={i}>
                                        {part}{i < (t as any).codeTransform.title.split(".").length - 1 ? "." : ""}
                                        {i === 0 && <br />}
                                    </span>
                                ))
                                : (
                                    <>
                                        We Don&apos;t Just Edit Video.<br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                                            We Build Digital Empires.
                                        </span>
                                    </>
                                )}
                        </h2>

                        <p className="text-muted-foreground text-lg mb-8">
                            {(t as any).codeTransform?.desc || "From high-performance landing pages to complex web applications..."}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {[
                                { label: (t as any).codeTransform?.feature1 || "React / Next.js", icon: Code },
                                { label: (t as any).codeTransform?.feature2 || "High Performance", icon: Cpu }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border border-white/5">
                                    <div className="p-2 rounded-md bg-primary/20 text-primary">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        <Button size="lg" className="w-fit" asChild>
                            <a href="/web-development">{(t as any).codeTransform?.cta || "Explore Web Services"}</a>
                        </Button>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
