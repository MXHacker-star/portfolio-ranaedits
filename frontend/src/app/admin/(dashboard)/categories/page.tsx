import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Tag, Video, Image as ImageIcon, Globe, BarChart3, AppWindow } from "lucide-react"
import { getCategories, deleteCategory } from "@/actions/categories"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function CategoriesPage() {
    const categories = await getCategories()

    const videoCategories = categories.filter((c) => c.type === 'video')
    const graphicCategories = categories.filter((c) => c.type === 'graphic')
    const webCategories = categories.filter((c) => c.type === 'web')

    const totalItems = categories.reduce((sum, cat) => sum + (cat._count?.items || 0), 0)

    const renderCategoryCard = (category: any) => (
        <div key={category.id} className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6 relative group hover:border-primary/50 hover:shadow-[0_0_30px_rgba(255,0,0,0.15)] transition-all duration-300 overflow-hidden backdrop-blur-md">
            {/* Background Glow */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>

            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <Link href={`/admin/categories/${category.id}`}>
                    <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/10 hover:bg-white/20 border-white/10 backdrop-blur-sm">
                        <Pencil className="h-3 w-3" />
                    </Button>
                </Link>
                <form action={async () => {
                    "use server"
                    await deleteCategory(category.id)
                }}>
                    <Button variant="destructive" size="icon" className="h-8 w-8 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20 backdrop-blur-sm">
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </form>
            </div>

            <div className="flex items-start gap-4 mb-6 relative z-10">
                <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-xl text-primary shadow-inner">
                    <Tag className="h-6 w-6" />
                </div>
                <div className="flex-1 pt-1">
                    <h3 className="font-bold text-white text-lg leading-tight group-hover:text-primary transition-colors">{category.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 border border-white/10 px-2 py-0.5 rounded-full bg-black/40">
                            {category.type}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between text-sm text-white/60 pt-4 border-t border-white/5 relative z-10">
                <span className="flex items-center gap-1.5 font-medium"><AppWindow className="w-4 h-4 text-white/40" /> Total Items</span>
                <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">{category._count?.items || 0}</span>
            </div>
        </div>
    )

    const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
        <div className="bg-black/40 border border-white/10 p-6 rounded-2xl flex items-center gap-5 relative overflow-hidden group">
            <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
            <div className={`p-4 rounded-xl bg-white/5 border border-white/10 ${colorClass.replace('from-', 'text-').split(' ')[0]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-white/50 text-sm font-medium uppercase tracking-wider mb-1">{title}</p>
                <h4 className="text-3xl font-black text-white">{value}</h4>
            </div>
        </div>
    )

    return (
        <div className="space-y-10 w-full max-w-7xl mx-auto pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white drop-shadow-sm mb-2">
                        Categories<span className="text-primary">.</span>
                    </h1>
                    <p className="text-white/60 text-lg">Manage and organize your portfolio sections.</p>
                </div>
                <Link href="/admin/categories/new">
                    <Button className="gap-2 h-12 px-6 rounded-full font-bold tracking-wide shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,0,0,0.5)] transition-all">
                        <Plus className="h-5 w-5" />
                        Create Category
                    </Button>
                </Link>
            </div>

            {/* Statistics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Categories" value={categories.length} icon={BarChart3} colorClass="from-blue-500 to-cyan-500" />
                <StatCard title="Video Editing" value={videoCategories.length} icon={Video} colorClass="from-red-500 to-orange-500" />
                <StatCard title="Graphic Design" value={graphicCategories.length} icon={ImageIcon} colorClass="from-purple-500 to-pink-500" />
                <StatCard title="Web Dev" value={webCategories.length} icon={Globe} colorClass="from-emerald-500 to-teal-500" />
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="all" className="w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-4">
                    <TabsList className="bg-black/50 border border-white/5 p-1 rounded-full h-auto">
                        <TabsTrigger value="all" className="rounded-full px-6 py-2.5 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-black transition-all">All</TabsTrigger>
                        <TabsTrigger value="video" className="rounded-full px-6 py-2.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-black transition-all">Video</TabsTrigger>
                        <TabsTrigger value="graphic" className="rounded-full px-6 py-2.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-black transition-all">Graphic</TabsTrigger>
                        <TabsTrigger value="web" className="rounded-full px-6 py-2.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-black transition-all">Web</TabsTrigger>
                    </TabsList>
                    <div className="text-white/50 text-sm font-medium bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        <span className="text-white font-bold">{totalItems}</span> total items categorized
                    </div>
                </div>

                {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 px-4 text-center border-2 border-dashed border-white/10 rounded-3xl bg-black/20">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Tag className="w-10 h-10 text-white/20" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No categories found</h3>
                        <p className="text-white/50 max-w-md mx-auto mb-8">You haven't created any categories yet. Create your first category to start organizing your portfolio items.</p>
                        <Link href="/admin/categories/new">
                            <Button variant="outline" className="rounded-full border-white/20 hover:bg-white/10">
                                Create your first category
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="relative">
                        <TabsContent value="all" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {categories.map(renderCategoryCard)}
                            </div>
                        </TabsContent>

                        <TabsContent value="video" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                            {videoCategories.length === 0 ? (
                                <div className="text-center py-20 text-white/40 border border-white/5 bg-white/[0.02] rounded-2xl">No video categories found.</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {videoCategories.map(renderCategoryCard)}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="graphic" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                            {graphicCategories.length === 0 ? (
                                <div className="text-center py-20 text-white/40 border border-white/5 bg-white/[0.02] rounded-2xl">No graphic design categories found.</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {graphicCategories.map(renderCategoryCard)}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="web" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                            {webCategories.length === 0 ? (
                                <div className="text-center py-20 text-white/40 border border-white/5 bg-white/[0.02] rounded-2xl">No web development categories found.</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {webCategories.map(renderCategoryCard)}
                                </div>
                            )}
                        </TabsContent>
                    </div>
                )}
            </Tabs>
        </div>
    )
}
