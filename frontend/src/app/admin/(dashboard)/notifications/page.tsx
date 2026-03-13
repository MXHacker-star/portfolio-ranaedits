import { getNotificationSettings } from "@/actions/notifications"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from "lucide-react"
import { NotificationSettingsForm } from "@/components/admin/NotificationSettingsForm"

export default async function NotificationsPage() {
    const settings = await getNotificationSettings()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Notification Settings</h2>
                <p className="text-muted-foreground">Control how and when you receive email notifications for new leads.</p>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-white/10">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                            <Bell className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-white">Email Notifications</CardTitle>
                            <CardDescription>Configure SMTP settings and choose which forms trigger email alerts.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <NotificationSettingsForm settings={settings} />
                </CardContent>
            </Card>
        </div>
    )
}
