"use client"

import { useState, useRef, useCallback } from 'react'
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { uploadBlogImage } from '@/actions/blog'
import {
    Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
    List, ListOrdered, ImagePlus, Undo2, Redo2,
    AlignLeft, AlignCenter, AlignRight, Quote, Minus,
    X, Upload, Link2, Loader2
} from "lucide-react"

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
}

/* ─── Toolbar Button ─── */
function ToolBtn({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children
}: {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    title: string
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            title={title}
            disabled={disabled}
            onMouseDown={(e) => {
                e.preventDefault()
                onClick()
            }}
            className={`
                inline-flex items-center justify-center w-8 h-8 rounded-md text-sm transition-colors
                ${isActive
                    ? 'bg-primary/20 text-primary ring-1 ring-primary/30'
                    : 'text-muted-foreground hover:bg-white/10 hover:text-white'
                }
                ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            {children}
        </button>
    )
}

function Divider() {
    return <div className="w-px h-6 bg-white/10 mx-1" />
}

/* ─── Image Insert Modal ─── */
function ImageModal({
    open,
    onClose,
    onInsert,
}: {
    open: boolean
    onClose: () => void
    onInsert: (url: string) => void
}) {
    const [tab, setTab] = useState<'url' | 'upload'>('upload')
    const [url, setUrl] = useState('')
    const [uploading, setUploading] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    if (!open) return null

    const handleUrlInsert = () => {
        if (url.trim()) {
            onInsert(url.trim())
            setUrl('')
            onClose()
        }
    }

    const handleFileUpload = async (file: File) => {
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('image', file)
            const result = await uploadBlogImage(formData)
            if (result.success && result.url) {
                onInsert(result.url)
                onClose()
            } else {
                alert('Upload failed. Please try again.')
            }
        } catch {
            alert('Upload failed. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-card border border-white/10 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-5"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Insert Image</h3>
                    <button type="button" onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-black/30 rounded-lg">
                    <button
                        type="button"
                        onClick={() => setTab('upload')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${tab === 'upload' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-white'
                            }`}
                    >
                        <Upload className="w-4 h-4" /> Upload File
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('url')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${tab === 'url' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-white'
                            }`}
                    >
                        <Link2 className="w-4 h-4" /> Image URL
                    </button>
                </div>

                {/* Tab Content */}
                {tab === 'upload' ? (
                    <div className="space-y-3">
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleFileUpload(file)
                            }}
                        />
                        <button
                            type="button"
                            disabled={uploading}
                            onClick={() => fileRef.current?.click()}
                            className="w-full py-12 border-2 border-dashed border-white/20 rounded-xl text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {uploading ? (
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                    <span className="text-sm text-muted-foreground">Uploading...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <Upload className="w-8 h-8 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Click to select an image</span>
                                    <span className="text-xs text-muted-foreground/60">PNG, JPG, GIF, WebP</span>
                                </div>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            onKeyDown={(e) => { if (e.key === 'Enter') handleUrlInsert() }}
                        />
                        <button
                            type="button"
                            onClick={handleUrlInsert}
                            disabled={!url.trim()}
                            className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                            Insert Image
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

/* ─── Menu Bar ─── */
function MenuBar({ editor, onImageClick }: { editor: Editor | null; onImageClick: () => void }) {
    if (!editor) return null

    return (
        <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-white/10 bg-black/40">
            <ToolBtn title="Bold (Ctrl+B)" onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
                <Bold className="w-4 h-4" />
            </ToolBtn>
            <ToolBtn title="Italic (Ctrl+I)" onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
                <Italic className="w-4 h-4" />
            </ToolBtn>
            <ToolBtn title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')}>
                <Strikethrough className="w-4 h-4" />
            </ToolBtn>

            <Divider />

            <ToolBtn title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })}>
                <Heading1 className="w-4 h-4" />
            </ToolBtn>
            <ToolBtn title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}>
                <Heading2 className="w-4 h-4" />
            </ToolBtn>
            <ToolBtn title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })}>
                <Heading3 className="w-4 h-4" />
            </ToolBtn>

            <Divider />

            <ToolBtn title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
                <List className="w-4 h-4" />
            </ToolBtn>
            <ToolBtn title="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>
                <ListOrdered className="w-4 h-4" />
            </ToolBtn>

            <Divider />

            <ToolBtn title="Align Left" onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })}>
                <AlignLeft className="w-4 h-4" />
            </ToolBtn>
            <ToolBtn title="Align Center" onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })}>
                <AlignCenter className="w-4 h-4" />
            </ToolBtn>
            <ToolBtn title="Align Right" onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })}>
                <AlignRight className="w-4 h-4" />
            </ToolBtn>

            <Divider />

            <ToolBtn title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')}>
                <Quote className="w-4 h-4" />
            </ToolBtn>
            <ToolBtn title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                <Minus className="w-4 h-4" />
            </ToolBtn>

            <Divider />

            <ToolBtn title="Insert Image" onClick={onImageClick}>
                <ImagePlus className="w-4 h-4" />
            </ToolBtn>

            <Divider />

            <ToolBtn title="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                <Undo2 className="w-4 h-4" />
            </ToolBtn>
            <ToolBtn title="Redo (Ctrl+Shift+Z)" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                <Redo2 className="w-4 h-4" />
            </ToolBtn>
        </div>
    )
}

/* ─── Main Editor ─── */
export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const [imageModalOpen, setImageModalOpen] = useState(false)

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Image.configure({
                inline: false,
                allowBase64: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder: 'Start writing your blog post here...',
            }),
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] px-6 py-8',
            },
        },
    })

    const handleImageInsert = useCallback((url: string) => {
        if (editor) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])

    return (
        <>
            <div className="w-full border border-white/10 rounded-xl overflow-hidden bg-black/20">
                <MenuBar editor={editor} onImageClick={() => setImageModalOpen(true)} />
                <EditorContent editor={editor} />
            </div>
            <ImageModal
                open={imageModalOpen}
                onClose={() => setImageModalOpen(false)}
                onInsert={handleImageInsert}
            />
        </>
    )
}
