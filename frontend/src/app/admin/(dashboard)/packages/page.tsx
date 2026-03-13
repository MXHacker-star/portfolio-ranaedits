import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { getPackages, deletePackage } from "@/actions/admin-modules"

export default async function PackageManagerPage() {
    const packages = await getPackages()

    const formatPrice = (priceStr: string) => {
        if (!priceStr) return priceStr;
        const isNumericOnly = /^\d+(,\d+)*$/.test(priceStr.trim());
        return isNumericOnly ? `$${priceStr}` : priceStr;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Packages</h1>
                    <p className="text-muted-foreground">Manage service packages and pricing.</p>
                </div>
                <Link href="/admin/packages/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Package
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.length === 0 ? (
                    <div className="col-span-full text-center p-8 text-muted-foreground bg-card rounded-xl border border-white/10">
                        No packages found. Create your first one.
                    </div>
                ) : (
                    packages.map((pkg: any) => (
                        <div key={pkg.id} className="relative group bg-card border border-white/10 rounded-xl p-6 transition-all hover:border-primary/50">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                                    <div className="text-2xl font-black text-primary mt-1">{formatPrice(pkg.price)}</div>
                                </div>
                                {pkg.isPopular && (
                                    <span className="px-2 py-1 text-xs font-bold bg-primary/20 text-primary rounded-full">POPULAR</span>
                                )}
                            </div>

                            <ul className="space-y-2 mb-6">
                                {(pkg.features as string[])?.slice(0, 3).map((feat, i) => (
                                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                        {feat}
                                    </li>
                                ))}
                                {(pkg.features as string[])?.length > 3 && (
                                    <li className="text-xs text-muted-foreground italic">
                                        + {(pkg.features as string[]).length - 3} more features
                                    </li>
                                )}
                            </ul>

                            <div className="flex justify-end gap-2 border-t border-white/10 pt-4 mt-auto">
                                <Link href={`/admin/packages/${pkg.id}`}>
                                    <Button variant="ghost" size="sm">
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                </Link>
                                <form action={async () => {
                                    "use server"
                                    await deletePackage(pkg.id)
                                }}>
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
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
