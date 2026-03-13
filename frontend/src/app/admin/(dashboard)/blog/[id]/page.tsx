import { getBlogPost } from "@/actions/blog"
import { BlogPostForm } from "@/components/admin/BlogPostForm"
import prisma from "@/lib/prisma"

export default async function BlogPostEditorPage({ params }: { params: Promise<{ id: string }> }) {
    let post = null
    const resolvedParams = await params

    // Check if editing existing post
    if (resolvedParams.id !== "new") {
        post = await prisma.blogPost.findUnique({
            where: { id: resolvedParams.id }
        })
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
                        {post ? "Edit Post" : "Create New Post"}
                    </h1>
                </div>
            </div>

            <BlogPostForm post={post} />
        </div>
    )
}
