import { FAQForm } from "@/components/admin/FAQForm"

export default function NewFAQPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Add FAQ</h1>
                <p className="text-muted-foreground">Add a new question and answer.</p>
            </div>
            <FAQForm />
        </div>
    )
}
