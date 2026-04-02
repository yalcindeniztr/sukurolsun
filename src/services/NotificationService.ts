import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export class NotificationService {
    /**
     * Bildirim izinlerini kontrol eder ve ister
     */
    static async requestPermissions(): Promise<boolean> {
        if (!Capacitor.isNativePlatform()) return true;
        
        try {
            const status = await LocalNotifications.checkPermissions();
            if (status.display !== 'granted') {
                const request = await LocalNotifications.requestPermissions();
                return request.display === 'granted';
            }
            return true;
        } catch (error) {
            console.error('Bildirim izni alınırken hata:', error);
            return false;
        }
    }

    /**
     * Namaz vaktinden 5 dakika önce hatırlatıcı planlar
     * @param id Benzersiz bildirim ID (örn: 1, 2, 3...)
     * @param title Bildirim başlığı
     * @param body Bildirim içeriği
     * @param timeStr "HH:mm" formatında vakit
     */
    static async schedulePrayerReminder(id: number, title: string, body: string, timeStr: string) {
        if (!Capacitor.isNativePlatform()) {
            console.log(`Web simülasyonu: Bildirim planlandı [${id}] - ${title}: ${body} at ${timeStr}`);
            return;
        }

        try {
            const [hours, minutes] = timeStr.split(':').map(Number);
            const now = new Date();
            const scheduledTime = new Date();
            scheduledTime.setHours(hours, minutes, 0, 0);

            // 5 dakika öncesine çek
            scheduledTime.setMinutes(scheduledTime.getMinutes() - 5);

            // Eğer vakit (veya 5 dk öncesi) geçmişse, yarına planla
            if (scheduledTime.getTime() <= now.getTime()) {
                scheduledTime.setDate(scheduledTime.getDate() + 1);
            }

            await LocalNotifications.schedule({
                notifications: [
                    {
                        id,
                        title,
                        body,
                        schedule: { at: scheduledTime },
                        sound: 'bell.wav',
                        channelId: 'shukur-olsun-alerts',
                        attachments: [],
                        actionTypeId: '',
                        extra: null,
                    }
                ]
            });

            console.log(`Bildirim kuruldu: ${title} için ${scheduledTime.toLocaleTimeString()}`);
        } catch (error) {
            console.error('Bildirim planlanırken hata:', error);
        }
    }

    /**
     * Belirli bir ID'li bildirimi iptal eder
     */
    static async cancelNotification(id: number) {
        if (!Capacitor.isNativePlatform()) return;
        await LocalNotifications.cancel({ notifications: [{ id }] });
    }

    /**
     * Bildirim sistemini başlatır ve kanalları oluşturur
     */
    static async init() {
        if (!Capacitor.isNativePlatform()) return;

        try {
            await this.requestPermissions();
            
            // Android için kanal oluştur (Sesli bildirimler için kritik)
            await LocalNotifications.createChannel({
                id: 'shukur-olsun-alerts',
                name: 'Şükür Olsun Hatırlatıcılar',
                description: 'Namaz ve Oruç vakti hatırlatıcı sesli bildirimleri',
                importance: 5, // high
                visibility: 1, // public
                sound: 'bell.wav', // Custom sound support (requires file in res/raw)
                vibration: true,
            });
            
            console.log('Bildirim kanalı oluşturuldu.');
        } catch (error) {
            console.error('Bildirim başlatılırken hata:', error);
        }
    }

    /**
     * Tüm hatırlatıcıları iptal eder
     */
    static async cancelAll() {
        if (!Capacitor.isNativePlatform()) return;
        const pending = await LocalNotifications.getPending();
        if (pending.notifications.length > 0) {
            await LocalNotifications.cancel(pending);
        }
    }
}

export const notificationService = NotificationService;
