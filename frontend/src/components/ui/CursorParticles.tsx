"use client"

import { useEffect, useRef } from "react"

export function CursorParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        let particles: Particle[] = []

        const mouse = { x: 0, y: 0 }

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        window.addEventListener("resize", resizeCanvas)
        resizeCanvas()

        // Track mouse
        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX
            mouse.y = e.clientY

            // Create particles on move
            for (let i = 0; i < 2; i++) {
                particles.push(new Particle(mouse.x, mouse.y))
            }
        }

        window.addEventListener("mousemove", handleMouseMove)

        class Particle {
            x: number
            y: number
            size: number
            speedX: number
            speedY: number
            color: string
            life: number

            constructor(x: number, y: number) {
                this.x = x
                this.y = y
                this.size = Math.random() * 3 + 1
                this.speedX = Math.random() * 2 - 1
                this.speedY = Math.random() * 2 - 1
                this.color = `rgba(212, 175, 55, ${Math.random() * 0.5 + 0.2})` // Primary Gold #D4AF37
                this.life = 100
            }

            update() {
                this.x += this.speedX
                this.y += this.speedY
                if (this.size > 0.1) this.size -= 0.05
                this.life--
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.fillStyle = this.color
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fill()
            }
        }

        const animate = () => {
            if (!ctx) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            for (let i = 0; i < particles.length; i++) {
                particles[i].update()
                particles[i].draw(ctx)

                if (particles[i].life <= 0 || particles[i].size <= 0.1) {
                    particles.splice(i, 1)
                    i--
                }
            }

            animationFrameId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener("resize", resizeCanvas)
            window.removeEventListener("mousemove", handleMouseMove)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-40"
            style={{ mixBlendMode: 'screen' }}
        />
    )
}
