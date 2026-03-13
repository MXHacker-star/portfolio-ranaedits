"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// ============================================
// Get notification settings (singleton)
// ============================================
export async function getNotificationSettings() {
    try {
        let settings = await prisma.notificationSetting.findUnique({
            where: { id: 1 }
        })

        // Create default if doesn't exist
        if (!settings) {
            settings = await prisma.notificationSetting.create({
                data: { id: 1 }
            })
        }

        return settings
    } catch (error) {
        console.error("Failed to get notification settings:", error)
        return null
    }
}

// ============================================
// Update notification settings
// ============================================
export async function updateNotificationSettings(data: {
    emailEnabled: boolean
    smtpHost: string
    smtpPort: number
    smtpUser: string
    smtpPass: string
    adminEmail: string
    enabledForms: string[]
}) {
    try {
        const settings = await prisma.notificationSetting.upsert({
            where: { id: 1 },
            update: {
                emailEnabled: data.emailEnabled,
                smtpHost: data.smtpHost || null,
                smtpPort: data.smtpPort || 587,
                smtpUser: data.smtpUser || null,
                smtpPass: data.smtpPass || null,
                adminEmail: data.adminEmail || null,
                enabledForms: data.enabledForms,
            },
            create: {
                id: 1,
                emailEnabled: data.emailEnabled,
                smtpHost: data.smtpHost || null,
                smtpPort: data.smtpPort || 587,
                smtpUser: data.smtpUser || null,
                smtpPass: data.smtpPass || null,
                adminEmail: data.adminEmail || null,
                enabledForms: data.enabledForms,
            },
        })

        revalidatePath("/admin/notifications")
        return { success: true, settings }
    } catch (error) {
        console.error("Failed to update notification settings:", error)
        return { success: false, error: "Failed to save settings" }
    }
}

// ============================================
// Test email notification
// ============================================
export async function sendTestEmail() {
    try {
        const settings = await prisma.notificationSetting.findUnique({
            where: { id: 1 }
        })

        if (!settings || !settings.emailEnabled) {
            return { success: false, error: "Email notifications are disabled" }
        }

        if (!settings.smtpHost || !settings.smtpUser || !settings.smtpPass) {
            return { success: false, error: "SMTP configuration is incomplete" }
        }

        if (!settings.adminEmail) {
            return { success: false, error: "Admin email is not configured" }
        }

        // Dynamic import to avoid loading nodemailer on client
        const nodemailer = (await import("nodemailer")).default

        const transporter = nodemailer.createTransport({
            host: settings.smtpHost,
            port: settings.smtpPort,
            secure: settings.smtpPort === 465,
            auth: {
                user: settings.smtpUser,
                pass: settings.smtpPass,
            },
        })

        await transporter.sendMail({
            from: `"Website Leads" <${settings.smtpUser}>`,
            to: settings.adminEmail,
            subject: "🧪 Test Email — Notification System",
            html: `
                <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; background: #111; color: #eee; padding: 32px; border-radius: 12px; text-align: center;">
                    <h1 style="font-size: 24px; color: #22c55e; margin-bottom: 8px;">✅ Email Works!</h1>
                    <p style="color: #888; font-size: 14px;">Your notification system is configured correctly.</p>
                    <p style="color: #555; font-size: 12px; margin-top: 24px;">Sent at ${new Date().toLocaleString()}</p>
                </div>
            `,
        })

        return { success: true }
    } catch (error: any) {
        console.error("Test email failed:", error)
        return { success: false, error: error.message || "Failed to send test email" }
    }
}
