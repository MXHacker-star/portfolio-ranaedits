import nodemailer from "nodemailer"
import prisma from "@/lib/prisma"

// Form type display names
const FORM_TYPE_LABELS: Record<string, string> = {
    consultancy: "🗓️ Consultancy Booking",
    proposal: "📋 Project Proposal",
    package: "📦 Package Inquiry",
    "video-project": "🎬 Video Project",
    "graphic-project": "🎨 Graphic Design Project",
    contact: "📧 Contact Form",
    terminal: "💻 Terminal Form",
}

interface NotificationData {
    id: string
    formType: string
    name: string
    email: string
    phone?: string | null
    whatsapp?: string | null
    company?: string | null
    message?: string | null
    metadata?: any
    scheduledDate?: Date | null
    scheduledTime?: string | null
    source?: string | null
}

// ============================================
// Build email HTML
// ============================================
function buildEmailHtml(data: NotificationData): string {
    const label = FORM_TYPE_LABELS[data.formType] || "📩 New Submission"
    const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/leads`

    let metadataRows = ""
    if (data.metadata && typeof data.metadata === "object") {
        for (const [key, value] of Object.entries(data.metadata)) {
            if (value) {
                const displayKey = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (s) => s.toUpperCase())
                metadataRows += `
                    <tr>
                        <td style="padding: 8px 12px; color: #888; font-size: 13px; border-bottom: 1px solid #333;">${displayKey}</td>
                        <td style="padding: 8px 12px; color: #eee; font-size: 13px; border-bottom: 1px solid #333;">${value}</td>
                    </tr>`
            }
        }
    }

    return `
    <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; background-color: #111; color: #eee; padding: 32px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="font-size: 22px; margin: 0; color: #fff;">${label}</h1>
            <p style="font-size: 13px; color: #888; margin-top: 4px;">New lead from your website</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; background: #1a1a1a; border-radius: 8px; overflow: hidden;">
            <tr>
                <td style="padding: 10px 12px; color: #888; font-size: 13px; border-bottom: 1px solid #333;">Name</td>
                <td style="padding: 10px 12px; color: #fff; font-size: 14px; font-weight: bold; border-bottom: 1px solid #333;">${data.name}</td>
            </tr>
            <tr>
                <td style="padding: 8px 12px; color: #888; font-size: 13px; border-bottom: 1px solid #333;">Email</td>
                <td style="padding: 8px 12px; color: #eee; font-size: 13px; border-bottom: 1px solid #333;"><a href="mailto:${data.email}" style="color: #60a5fa;">${data.email}</a></td>
            </tr>
            ${data.phone ? `
            <tr>
                <td style="padding: 8px 12px; color: #888; font-size: 13px; border-bottom: 1px solid #333;">Phone</td>
                <td style="padding: 8px 12px; color: #eee; font-size: 13px; border-bottom: 1px solid #333;">${data.phone}</td>
            </tr>` : ""}
            ${data.whatsapp ? `
            <tr>
                <td style="padding: 8px 12px; color: #888; font-size: 13px; border-bottom: 1px solid #333;">WhatsApp</td>
                <td style="padding: 8px 12px; color: #eee; font-size: 13px; border-bottom: 1px solid #333;">${data.whatsapp}</td>
            </tr>` : ""}
            ${data.company ? `
            <tr>
                <td style="padding: 8px 12px; color: #888; font-size: 13px; border-bottom: 1px solid #333;">Company</td>
                <td style="padding: 8px 12px; color: #eee; font-size: 13px; border-bottom: 1px solid #333;">${data.company}</td>
            </tr>` : ""}
            ${data.scheduledDate ? `
            <tr>
                <td style="padding: 8px 12px; color: #888; font-size: 13px; border-bottom: 1px solid #333;">Scheduled</td>
                <td style="padding: 8px 12px; color: #eee; font-size: 13px; border-bottom: 1px solid #333;">${new Date(data.scheduledDate).toLocaleDateString()} ${data.scheduledTime || ""}</td>
            </tr>` : ""}
            ${data.message ? `
            <tr>
                <td style="padding: 8px 12px; color: #888; font-size: 13px; border-bottom: 1px solid #333;">Message</td>
                <td style="padding: 8px 12px; color: #eee; font-size: 13px; border-bottom: 1px solid #333;">${data.message}</td>
            </tr>` : ""}
            ${metadataRows}
        </table>

        <div style="text-align: center; margin-top: 24px;">
            <a href="${adminUrl}" style="display: inline-block; padding: 10px 24px; background: #3b82f6; color: #fff; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: bold;">
                View in Admin Dashboard →
            </a>
        </div>

        <p style="text-align: center; font-size: 11px; color: #555; margin-top: 20px;">
            Source: ${data.source || "website"} • ${new Date().toLocaleString()}
        </p>
    </div>`
}

// ============================================
// Send email notification
// Reads config from DB (admin-controlled)
// Falls back to .env if DB has no settings
// ============================================
export async function sendEmailNotification(data: NotificationData) {
    try {
        // 1. Read settings from DB
        let settings = null
        try {
            settings = await prisma.notificationSetting.findUnique({
                where: { id: 1 }
            })
        } catch {
            // DB not ready or table doesn't exist yet — fall through to .env
        }

        // 2. If DB settings exist, use them
        if (settings) {
            // Check if email is enabled in admin
            if (!settings.emailEnabled) {
                console.log("📧 Email notifications disabled in admin settings")
                return
            }

            // Check if this form type is enabled
            const enabledForms = (settings.enabledForms as string[]) || []
            if (!enabledForms.includes(data.formType)) {
                console.log(`📧 Email skipped — ${data.formType} not in enabled forms`)
                return
            }

            // Check SMTP config
            if (!settings.smtpHost || !settings.smtpUser || !settings.smtpPass) {
                console.warn("⚠️ SMTP not fully configured in admin settings")
                return
            }

            if (!settings.adminEmail) {
                console.warn("⚠️ No admin email configured")
                return
            }

            const transporter = nodemailer.createTransport({
                host: settings.smtpHost,
                port: settings.smtpPort || 587,
                secure: (settings.smtpPort || 587) === 465,
                auth: { user: settings.smtpUser, pass: settings.smtpPass },
            })

            const label = FORM_TYPE_LABELS[data.formType] || "New Submission"

            await transporter.sendMail({
                from: `"Website Leads" <${settings.smtpUser}>`,
                to: settings.adminEmail,
                subject: `${label} — ${data.name}`,
                html: buildEmailHtml(data),
            })

            console.log(`✅ Email sent for ${data.formType} from ${data.name}`)
            return
        }

        // 3. Fallback to .env variables
        const host = process.env.SMTP_HOST
        const port = parseInt(process.env.SMTP_PORT || "587")
        const user = process.env.SMTP_USER
        const pass = process.env.SMTP_PASS

        if (!host || !user || !pass) {
            console.warn("⚠️ Email skipped — no DB settings or .env SMTP config")
            return
        }

        const adminEmail = process.env.ADMIN_EMAIL || user
        const transporter = nodemailer.createTransport({
            host, port, secure: port === 465,
            auth: { user, pass },
        })

        const label = FORM_TYPE_LABELS[data.formType] || "New Submission"

        await transporter.sendMail({
            from: `"Website Leads" <${user}>`,
            to: adminEmail,
            subject: `${label} — ${data.name}`,
            html: buildEmailHtml(data),
        })

        console.log(`✅ Email sent (env fallback) for ${data.formType} from ${data.name}`)
    } catch (error) {
        console.error("❌ Failed to send email notification:", error)
        // Don't throw — notification failure shouldn't break form submission
    }
}
