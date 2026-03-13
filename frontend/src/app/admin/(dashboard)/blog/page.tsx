import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Eye } from "lucide-react"
import { getBlogPosts, deleteBlogPost } from "@/actions/blog"

// Helper if utils missing
function formatDateHelper(date: Date) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

export default async function BlogManagerPage() {
    // Fetch all posts (pagination can be added later, for now fetching first 50)
    const { posts } = await getBlogPosts(1, 50)

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Blog Posts</h1>
                    <p className="text-muted-foreground">Manage your blog content.</p>
                </div>
                <Link href="/admin/blog/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create New
                    </Button>
                </Link>
            </div>

            <div className="rounded-xl border border-white/10 bg-card overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-muted-foreground font-medium border-b border-white/10">
                        <tr>
                            <th className="p-4">Title</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {posts.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                    No posts found. Create your first one!
                                </td>
                            </tr>
                        ) : (
                            posts.map((post) => (
                                <tr key={post.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-white line-clamp-1">{post.title}</div>
                                        <div className="text-xs text-muted-foreground hidden md:block">/{post.slug}</div>
                                    </td>
                                    <td className="p-4">
                                        {post.published ? (
                                            <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-500/20">
                                                Published
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-500 ring-1 ring-inset ring-yellow-500/20">
                                                Draft
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-muted-foreground">
                                        {formatDateHelper(post.createdAt)}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/blog/${post.slug}`} target="_blank">
                                                <Button variant="ghost" size="icon" title="View Live">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/blog/${post.id}`}>
                                                <Button variant="ghost" size="icon" title="Edit">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <form action={async () => {
                                                "use server"
                                                await deleteBlogPost(post.id)
                                            }}>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400 hover:bg-red-500/10" title="Delete">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
