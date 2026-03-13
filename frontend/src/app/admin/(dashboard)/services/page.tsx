import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Box } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { getServices, deleteService } from "@/actions/services"

const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
    const Icon = (LucideIcons as any)[name] || Box;
    return <Icon className={className} />;
};

export default async function ServicesPage() {
    const services = await getServices()

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Services</h1>
                    <p className="text-muted-foreground">Manage the services offered on the home page.</p>
                </div>
                <Link href="/admin/services/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Service
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.length === 0 ? (
                    <div className="col-span-full text-center p-8 text-muted-foreground bg-card rounded-xl border border-white/10">
                        No services found. Add your services.
                    </div>
                ) : (
                    services.map((service) => (
                        <div key={service.id} className="bg-card border border-white/10 rounded-xl p-6 relative group flex flex-col h-full">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <DynamicIcon name={service.icon} className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex gap-1">
                                    <Link href={`/admin/services/${service.id}`}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Pencil className="h-3 w-3" />
                                        </Button>
                                    </Link>
                                    <form action={async () => {
                                        "use server"
                                        await deleteService(service.id)
                                    }}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10">
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </form>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                            <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                                {service.description}
                            </p>

                            <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground">
                                <span>Order: {service.order}</span>
                                <span className={service.icon ? "text-primary/70" : ""}>{service.icon}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
