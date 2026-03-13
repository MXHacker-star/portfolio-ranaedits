import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, HelpCircle } from "lucide-react"
import { getFAQs, deleteFAQ } from "@/actions/faq"

export default async function FAQPage() {
    const faqs = await getFAQs()

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white">FAQ</h1>
                    <p className="text-muted-foreground">Manage frequently asked questions.</p>
                </div>
                <Link href="/admin/faq/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add FAQ
                    </Button>
                </Link>
            </div>

            <div className="space-y-4">
                {faqs.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground bg-card rounded-xl border border-white/10">
                        No FAQs found. Add your first question.
                    </div>
                ) : (
                    faqs.map((faq) => (
                        <div key={faq.id} className="bg-card border border-white/10 rounded-xl p-6 flex items-start justify-between group">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-primary/10 rounded-full text-primary mt-1">
                                    <HelpCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg mb-2">{faq.question}</h3>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{faq.answer}</p>
                                    {faq.category && (
                                        <span className="inline-block mt-2 px-2 py-1 bg-white/5 rounded text-xs text-muted-foreground">
                                            {faq.category}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={`/admin/faq/${faq.id}`}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <form action={async () => {
                                    "use server"
                                    await deleteFAQ(faq.id)
                                }}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
