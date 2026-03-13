"use client"

import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import { updateHeroData } from "@/actions/hero"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const initialState = {
    message: "",
    success: false,
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="w-full md:w-auto">
            {pending ? "Saving..." : "Save Changes"}
        </Button>
    )
}

export function HeroForm({ hero }: { hero: any }) {
    const [state, formAction] = useActionState(updateHeroData, initialState)
    const [opacity, setOpacity] = useState(hero?.overlayOpacity ?? 40)

    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="heading" className="text-white">Main Heading</Label>
                <Input
                    id="heading"
                    name="heading"
                    defaultValue={hero?.heading || "Cinematic Video Editing"}
                    className="bg-background/50 border-white/10 text-white"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="subheading" className="text-white">Subheading / Description</Label>
                <Textarea
                    id="subheading"
                    name="subheading"
                    defaultValue={hero?.subheading || "Transforming raw footage into compelling stories. Specialized in high-end commercial and social media content."}
                    className="bg-background/50 border-white/10 text-white min-h-[100px]"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="videoUrl" className="text-white">Background Video URL (YouTube Embed Link)</Label>
                    <Input
                        id="videoUrl"
                        name="videoUrl"
                        defaultValue={hero?.videoUrl || "https://www.youtube.com/embed/jNQXAC9IVRw"}
                        placeholder="https://www.youtube.com/embed/..."
                        className="bg-background/50 border-white/10 text-white"
                    />
                    <p className="text-xs text-muted-foreground">Use the "Embed" link from YouTube, not the watch link.</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="buttonText" className="text-white">Button Text</Label>
                    <Input
                        id="buttonText"
                        name="buttonText"
                        defaultValue={hero?.buttonText || "View Showreel"}
                        className="bg-background/50 border-white/10 text-white"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="buttonLink" className="text-white">Button Link (Scroll Anchor)</Label>
                <Input
                    id="buttonLink"
                    name="buttonLink"
                    defaultValue={hero?.buttonLink || "#showreel"}
                    className="bg-background/50 border-white/10 text-white"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="overlayOpacity" className="text-white">
                    Video Overlay Opacity: <span className="text-primary font-mono text-lg">{opacity}%</span>
                </Label>
                <input
                    type="range"
                    id="overlayOpacity"
                    name="overlayOpacity"
                    min={0}
                    max={100}
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0% — Full brightness</span>
                    <span>100% — Fully dark</span>
                </div>
            </div>

            {state.message && (
                <div className={`p-3 rounded-md text-sm ${state.success ? "bg-green-500/15 text-green-500" : "bg-red-500/15 text-red-500"}`}>
                    {state.message}
                </div>
            )}

            <SubmitButton />
        </form>
    )
}
