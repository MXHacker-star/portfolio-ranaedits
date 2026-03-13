"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { submitForm } from "@/actions/leads"

export function ContactForm() {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const form = formRef.current!
        const formData = new FormData(form)

        const result = await submitForm({
            formType: "contact",
            source: "contact-page",
            name: formData.get("name") as string,
            email: formData.get("business") as string, // business field used as identifier
            company: formData.get("business") as string || undefined,
            message: formData.get("goal") as string || undefined,
            metadata: {
                budget: formData.get("budget") as string,
                instagram: formData.get("instagram") as string,
                goal: formData.get("goal") as string,
                business: formData.get("business") as string,
            }
        })

        setLoading(false)
        if (result.success) {
            setSuccess(true)
        }
    }

    if (success) {
        return (
            <Card className="max-w-md mx-auto border-primary/20 bg-card/50">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-primary">{t.contactPage.form.successTitle}</CardTitle>
                    <CardDescription>{t.contactPage.form.successDesc}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-8">
                    <Button onClick={() => setSuccess(false)} variant="outline">{t.contactPage.form.sendAnother}</Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="max-w-xl mx-auto border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>{t.contactPage.form.title}</CardTitle>
                <CardDescription>{t.contactPage.form.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">{t.contactPage.form.name}</label>
                            <Input id="name" name="name" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="business" className="text-sm font-medium">{t.contactPage.form.business}</label>
                            <Input id="business" name="business" placeholder="e.g. E-commerce, Agency" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="budget" className="text-sm font-medium">{t.contactPage.form.budget}</label>
                        <select name="budget" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="">{t.contactPage.form.budgetPlaceholder}</option>
                            <option value="1k-3k">$1,000 - $3,000</option>
                            <option value="3k-5k">$3,000 - $5,000</option>
                            <option value="5k+">$5,000+</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="instagram" className="text-sm font-medium">{t.contactPage.form.instagram}</label>
                        <Input id="instagram" name="instagram" placeholder="https://instagram.com/yourhandle" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="goal" className="text-sm font-medium">{t.contactPage.form.goal}</label>
                        <Textarea id="goal" name="goal" placeholder="e.g. Increase brand awareness, drive sales..." required />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? t.contactPage.form.sending : t.contactPage.form.send}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

