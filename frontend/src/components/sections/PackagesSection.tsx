"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "@/lib/i18n"
import { useContactModal } from "@/lib/stores/useContactModal"
import { useState, useCallback } from "react"

interface Package {
    name: string;
    price: string;
    description: string | null;
    features: any; // Json in Prisma
    isPopular: boolean;
    ctaText: string | null;
    order?: number;
}

interface PackagesSectionProps {
    packages?: Package[]
}

export function PackagesSection({ packages: dbPackages = [] }: PackagesSectionProps) {
    const { t, language } = useTranslation();
    const { openModal } = useContactModal();

    // --- Currency toggle state ---
    const [currency, setCurrency] = useState<"USD" | "BDT">("USD")
    const [exchangeRate, setExchangeRate] = useState<number | null>(null)
    const [rateLoading, setRateLoading] = useState(false)

    // Fetch exchange rate on first BDT toggle
    const fetchRate = useCallback(async () => {
        if (exchangeRate !== null) return; // already cached
        setRateLoading(true)
        try {
            const res = await fetch("https://open.er-api.com/v6/latest/USD")
            const data = await res.json()
            if (data?.rates?.BDT) {
                setExchangeRate(data.rates.BDT)
            } else {
                setExchangeRate(120) // fallback rate
            }
        } catch {
            setExchangeRate(120) // fallback on error
        } finally {
            setRateLoading(false)
        }
    }, [exchangeRate])

    const handleCurrencyToggle = async (cur: "USD" | "BDT") => {
        if (cur === "BDT" && exchangeRate === null) {
            await fetchRate()
        }
        setCurrency(cur)
    }

    // --- Fallback default packages (from i18n) ---
    const defaultPackages = [
        { ...t.packages.pkg1, popular: false, ctaText: t.packages.btnStandard },
        { ...t.packages.pkg2, popular: false, ctaText: t.packages.btnStandard },
        { ...t.packages.pkg3, popular: true, ctaText: t.packages.btnPopular },
        { ...t.packages.pkg4, popular: false, ctaText: t.packages.btnStandard }
    ];

    // --- Translation mapping: map DB names → i18n translations ---
    const translationMap: Record<string, {
        name: string; desc: string; features: string[]; cta: string;
    }> = {
        "Standard": { name: t.packages.pkg1.name, desc: t.packages.pkg1.desc, features: t.packages.pkg1.features, cta: t.packages.pkg1.cta },
        "Premium": { name: t.packages.pkg2.name, desc: t.packages.pkg2.desc, features: t.packages.pkg2.features, cta: t.packages.pkg2.cta },
        "Enterprise": { name: t.packages.pkg3.name, desc: t.packages.pkg3.desc, features: t.packages.pkg3.features, cta: t.packages.pkg3.cta },
        "Custom": { name: t.packages.pkg4.name, desc: t.packages.pkg4.desc, features: t.packages.pkg4.features, cta: t.packages.pkg4.cta },
    };

    // --- Build display data ---
    const packagesSource = dbPackages.length > 0
        ? dbPackages.map(pkg => {
            const translated = translationMap[pkg.name];
            return translated
                ? {
                    ...pkg,
                    name: translated.name,
                    description: translated.desc,
                    features: translated.features,
                    ctaText: translated.cta,
                }
                : pkg;
        })
        : defaultPackages.map(pkg => ({
            name: pkg.name,
            price: pkg.price,
            description: pkg.desc,
            features: pkg.features,
            isPopular: pkg.popular,
            ctaText: pkg.ctaText,
        }));

    const displayPackages = packagesSource.map((pkg, i) => ({
        ...pkg,
        features: Array.isArray(pkg.features) ? pkg.features : [],
        isPopular: (pkg as any).isPopular ?? (pkg as any).popular ?? false,
        order: (pkg as any).order ?? i,
    }));

    // --- Price conversion helper ---
    const convertPrice = (priceStr: string): string => {
        if (!priceStr) return priceStr;

        // If USD, check if it's purely numeric without a symbol. If so, add $.
        if (currency === "USD") {
            const isNumericOnly = /^\d+(,\d+)*$/.test(priceStr.trim());
            return isNumericOnly ? `$${priceStr}` : priceStr;
        }

        // Extract numeric value from price string
        const numericMatch = priceStr.match(/[\d,]+/);
        if (!numericMatch) {
            // Non-numeric price like "Custom", "Variable"
            const nonNumericMap: Record<string, string> = {
                "Custom": "কাস্টম",
                "Variable": "পরিবর্তনশীল",
                "কাস্টম": "কাস্টম",
                "ভেরিয়েবল": "পরিবর্তনশীল",
            };
            return nonNumericMap[priceStr] || priceStr;
        }

        const numericValue = parseFloat(numericMatch[0].replace(/,/g, ""));
        if (isNaN(numericValue) || !exchangeRate) return priceStr;

        const converted = Math.round(numericValue * exchangeRate);
        // Format with commas (Bangladeshi style: xx,xx,xxx)
        const formatted = converted.toLocaleString("en-IN");
        return `৳${formatted}`;
    };

    return (
        <section id="pricing" className="py-20 bg-muted/30">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
                        {t.packages.title}
                    </h2>
                    <p className="mt-4 text-muted-foreground text-lg max-w-2xl">
                        {t.packages.subtitle}
                    </p>

                    {/* Currency Toggle */}
                    <div className="mt-6 inline-flex items-center rounded-full border border-border/50 bg-card/50 backdrop-blur-sm p-1">
                        <button
                            onClick={() => handleCurrencyToggle("USD")}
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${currency === "USD"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            🇺🇸 USD
                        </button>
                        <button
                            onClick={() => handleCurrencyToggle("BDT")}
                            disabled={rateLoading}
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${currency === "BDT"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                                } ${rateLoading ? "opacity-50 cursor-wait" : ""}`}
                        >
                            {rateLoading ? "⏳" : "🇧🇩"} BDT
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto justify-center">
                    {displayPackages.map((pkg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex"
                        >
                            <Card className={`relative flex flex-col h-full w-full border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 ${pkg.isPopular ? 'border-primary shadow-lg shadow-primary/10 scale-105 md:-mt-4 bg-card z-10' : ''}`}>
                                {pkg.isPopular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                                        {t.packages.mostPopular}
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle>{pkg.name}</CardTitle>
                                    <CardDescription>{pkg.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="text-3xl font-bold mb-6 text-foreground">
                                        <motion.span
                                            key={`${currency}-${pkg.price}`}
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {convertPrice(pkg.price)}
                                        </motion.span>
                                    </div>
                                    <ul className="space-y-3">
                                        {pkg.features.map((feature: string, i: number) => (
                                            <li key={i} className="flex items-center text-sm text-muted-foreground">
                                                <Check className="mr-2 h-4 w-4 text-primary" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        variant={pkg.isPopular ? "default" : "outline"}
                                        onClick={() => openModal({
                                            source: 'Packages Section',
                                            type: 'package',
                                            packageDetails: {
                                                name: pkg.name,
                                                price: convertPrice(pkg.price)
                                            }
                                        })}
                                    >
                                        {pkg.ctaText}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
