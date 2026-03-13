import Link from "next/link"
import { getBlogPosts } from "@/actions/blog"

import { ArrowRight, Calendar, User } from "lucide-react"

// Minimal date formatter if utils missing
function formatDateHelper(date: Date) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })
}

export default async function BlogPage() {
    const { posts, pagination } = await getBlogPosts(1, 12)

    return (
        <main className="min-h-screen bg-background pt-32 pb-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-16">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
                        Our <span className="text-primary">Blog</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Insights, tips, and behind-the-scenes stories from the world of video editing and design.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post: any) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-secondary/10 hover:border-primary/50 transition-colors"
                        >
                            <div className="aspect-video w-full overflow-hidden">
                                <img
                                    src={post.coverImage || "/placeholder-blog.jpg"}
                                    alt={post.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="flex flex-col flex-1 p-6">
                                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDateHelper(post.createdAt)}
                                    </div>
                                    {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                                        <span className="text-primary">{post.tags[0]}</span>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center text-primary text-sm font-bold uppercase tracking-wide mt-auto">
                                    Read Article <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-24 text-muted-foreground">
                        <p>No posts found. Check back soon!</p>
                    </div>
                )}
            </div>
        </main>
    )
}
