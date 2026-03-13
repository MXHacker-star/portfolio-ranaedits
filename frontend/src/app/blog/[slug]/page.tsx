import { getBlogPost, getBlogPosts } from "@/actions/blog"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, User, Share2, ChevronRight } from "lucide-react"

function formatDate(date: Date) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })
}

function estimateReadTime(content: string): number {
    const text = content.replace(/<[^>]*>/g, '')
    const words = text.split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(words / 200))
}

// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params
    const post = await getBlogPost(resolvedParams.slug)
    if (!post) return { title: "Post Not Found" }

    return {
        title: (post as any).metaTitle ? `${(post as any).metaTitle} | Rana Edits` : `${post.title} | Rana Edits`,
        description: (post as any).metaDesc || post.excerpt || post.title,
        keywords: (post as any).keywords ? (post as any).keywords.split(',').map((k: string) => k.trim()) : [],
        openGraph: {
            title: (post as any).metaTitle || post.title,
            description: (post as any).metaDesc || post.excerpt || post.title,
            images: post.coverImage ? [post.coverImage] : [],
        },
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params
    const post = await getBlogPost(resolvedParams.slug)

    if (!post) {
        notFound()
    }

    const readTime = estimateReadTime(post.content)

    // Fetch related posts (latest 3, excluding current)
    let relatedPosts: any[] = []
    try {
        const result = await getBlogPosts(1, 4)
        relatedPosts = result.posts.filter((p: any) => p.slug !== post.slug).slice(0, 3)
    } catch { }

    return (
        <main className="min-h-screen bg-background">

            {/* ─── Full-Width Cover Image Hero ─── */}
            {post.coverImage && (
                <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden">
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                    {/* Back Button on Hero */}
                    <div className="absolute top-28 left-0 right-0">
                        <div className="container mx-auto px-4 md:px-6">
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/80 hover:text-white hover:bg-black/60 transition-all text-sm font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Blog
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Article Header ─── */}
            <div className={`container mx-auto px-4 md:px-6 ${post.coverImage ? '-mt-32 relative z-10' : 'pt-32'}`}>
                <div className="max-w-4xl mx-auto">

                    {/* Back button (if no cover image) */}
                    {!post.coverImage && (
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-10 text-sm font-bold uppercase tracking-wider"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Blog
                        </Link>
                    )}

                    {/* Tags */}
                    {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {(post.tags as any[]).map((tag: string, index: number) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] mb-8">
                        {post.title}
                    </h1>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8 font-light">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Meta Bar */}
                    <div className="flex flex-wrap items-center gap-6 py-6 border-y border-white/10 mb-16">
                        {post.author && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-sm">
                                    {post.author.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">{post.author}</p>
                                    <p className="text-xs text-muted-foreground">Author</p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {formatDate(post.createdAt)}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {readTime} min read
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Article Content ─── */}
            <article className="container mx-auto px-4 md:px-6 pb-24">
                <div
                    className="max-w-3xl mx-auto prose prose-lg prose-invert
                        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white
                        prose-h1:text-4xl prose-h1:mt-16 prose-h1:mb-6
                        prose-h2:text-3xl prose-h2:mt-14 prose-h2:mb-5
                        prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
                        prose-p:text-[1.125rem] prose-p:leading-[1.85] prose-p:text-white/80
                        prose-a:text-primary hover:prose-a:text-primary/80 prose-a:no-underline prose-a:border-b prose-a:border-primary/30 hover:prose-a:border-primary
                        prose-strong:text-white prose-strong:font-bold
                        prose-blockquote:border-l-primary prose-blockquote:border-l-4 prose-blockquote:bg-white/[0.03] prose-blockquote:rounded-r-xl prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-white/70
                        prose-img:rounded-2xl prose-img:border prose-img:border-white/10 prose-img:shadow-2xl prose-img:my-10
                        prose-li:text-white/80 prose-li:marker:text-primary
                        prose-hr:border-white/10
                        prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-primary prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
                    "
                >
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>

                {/* ─── Share & Tags Bottom Section ─── */}
                <div className="max-w-3xl mx-auto mt-16 pt-10 border-t border-white/10">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Tags */}
                        {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {(post.tags as any[]).map((tag: string, index: number) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 rounded-lg bg-white/5 text-muted-foreground text-xs font-medium border border-white/5 hover:border-white/20 transition-colors"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </article>

            {/* ─── Related Posts ─── */}
            {relatedPosts.length > 0 && (
                <section className="border-t border-white/10 bg-black/20">
                    <div className="container mx-auto px-4 md:px-6 py-20">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl font-black tracking-tighter mb-12">
                                More Posts
                            </h2>

                            <div className="grid md:grid-cols-3 gap-8">
                                {relatedPosts.map((related: any) => (
                                    <Link
                                        key={related.id}
                                        href={`/blog/${related.slug}`}
                                        className="group block"
                                    >
                                        {/* Card Image */}
                                        {related.coverImage && (
                                            <div className="aspect-video rounded-xl overflow-hidden border border-white/10 mb-4 group-hover:border-primary/30 transition-colors">
                                                <img
                                                    src={related.coverImage}
                                                    alt={related.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        )}

                                        {/* Card Tags */}
                                        {related.tags && Array.isArray(related.tags) && related.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                {(related.tags as any[]).slice(0, 2).map((tag: string, i: number) => (
                                                    <span key={i} className="text-xs text-primary font-semibold uppercase tracking-wider">
                                                        {tag}{i < Math.min((related.tags as any[]).length, 2) - 1 ? ' · ' : ''}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Card Title */}
                                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors leading-tight mb-2">
                                            {related.title}
                                        </h3>

                                        {/* Card Excerpt */}
                                        {related.excerpt && (
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                {related.excerpt}
                                            </p>
                                        )}

                                        {/* Read more */}
                                        <span className="inline-flex items-center gap-1 text-sm text-primary font-semibold group-hover:gap-2 transition-all">
                                            Read more <ChevronRight className="w-4 h-4" />
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </main>
    )
}
