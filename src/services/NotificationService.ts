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
     */
    static async schedulePrayerReminder(id: number, title: string, body: string, timeStr: string, dateOffset: number = 0) {
        if (!Capacitor.isNativePlatform()) {
            console.log(`Web simülasyonu: Bildirim planlandı [${id}] - ${title}: ${body} at ${timeStr} (Offset: ${dateOffset})`);
            return;
        }

        try {
            const [hours, minutes] = timeStr.split(':').map(Number);
            const scheduledTime = new Date();
            scheduledTime.setHours(hours, minutes, 0, 0);
            
            // Gün ofsetini ekle
            scheduledTime.setDate(scheduledTime.getDate() + dateOffset);

            // 5 dakika öncesine çek
            scheduledTime.setMinutes(scheduledTime.getMinutes() - 5);

            // Eğer vakit geçmişse planlama
            if (scheduledTime.getTime() <= new Date().getTime()) {
                return;
            }

            await LocalNotifications.schedule({
                notifications: [
                    {
                        id: id + dateOffset, // Örn: 100, 101, 102...
                        title,
                        body,
                        schedule: { 
                            at: scheduledTime,
                            allowWhileIdle: true 
                        },
                        sound: 'bell.wav',
                        channelId: 'shukur-olsun-alerts',
                    }
                ]
            });
        } catch (error) {
            console.error('Bildirim planlanırken hata:', error);
        }
    }

    /**
     * Günlük Ayet ve Dua bildirimlerini planlar (Her gün aynı saatte tekrar eder)
     */
    static async scheduleRecurringDaily(id: number, title: string, body: string, hour: number, minute: number) {
        if (!Capacitor.isNativePlatform()) return;

        try {
            // Önce varsa eskiyi sil ki çakışmasın
            await this.cancelNotification(id);

            await LocalNotifications.schedule({
                notifications: [
                    {
                        id,
                        title,
                        body,
                        schedule: {
                            on: {
                                hour,
                                minute
                            },
                            repeats: true,
                            allowWhileIdle: true
                        },
                        sound: 'bell.wav',
                        channelId: 'shukur-olsun-alerts',
                    }
                ]
            });
            console.log(`Günlük tekrarlı bildirim kuruldu: ${title} saat ${hour}:${minute}`);
        } catch (error) {
            console.error('Tekrarlı bildirim hatası:', error);
        }
    }

    /**
     * Belirli bir tarih ve saat için genel hatırlatıcı planlar
     */
    static async scheduleGeneralReminder(id: string, title: string, body: string, time: string, date?: string, repeat?: 'none' | 'daily' | 'weekly' | 'monthly') {
        if (!Capacitor.isNativePlatform()) {
            console.log(`Web simülasyonu: Genel bildirim planlandı [${id}] - ${title}: ${body} at ${time} ${date || ''}`);
            return;
        }

        try {
            const numericId = this.stringToId(id);
            const [hours, minutes] = time.split(':').map(Number);
            
            // Önce temizle
            await this.cancelNotification(numericId);

            let schedule: any = {};
            
            if (repeat === 'daily') {
                schedule = { on: { hour: hours, minute: minutes }, repeats: true, allowWhileIdle: true };
            } else {
                const scheduledDate = date ? new Date(date) : new Date();
                scheduledDate.setHours(hours, minutes, 0, 0);

                if (scheduledDate.getTime() <= new Date().getTime() && repeat === 'none') {
                    return;
                }
                
                schedule = { at: scheduledDate, allowWhileIdle: true };
                
                if (repeat === 'weekly') {
                    schedule.repeats = true;
                    schedule.every = 'week';
                } else if (repeat === 'monthly') {
                    schedule.repeats = true;
                    schedule.every = 'month';
                }
            }

            await LocalNotifications.schedule({
                notifications: [
                    {
                        id: numericId,
                        title,
                        body,
                        schedule,
                        sound: 'bell.wav',
                        channelId: 'shukur-olsun-alerts',
                    }
                ]
            });
        } catch (error) {
            console.error('Genel hatırlatıcı planlanırken hata:', error);
        }
    }

    private static stringToId(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    static async cancelNotification(id: number) {
        if (!Capacitor.isNativePlatform()) return;
        try {
            await LocalNotifications.cancel({ notifications: [{ id }] });
        } catch (e) {
            console.error('Bildirim iptal hatası:', e);
        }
    }

    static async cancelGeneralReminder(id: string) {
        const numericId = this.stringToId(id);
        await this.cancelNotification(numericId);
    }

    static async init() {
        if (!Capacitor.isNativePlatform()) return;

        try {
            await this.requestPermissions();
            
            // Kanallar oluşturulurken en yüksek önem seviyesi kullanılıyor
            await LocalNotifications.createChannel({
                id: 'shukur-olsun-alerts',
                name: 'Şükür Olsun Hatırlatıcılar',
                description: 'Namaz ve Oruç vakti hatırlatıcı sesli bildirimleri',
                importance: 5, // Android 'Extreme' importance
                visibility: 1,
                sound: 'bell.wav',
                vibration: true,
            });
            
            console.log('Bildirim kanalı en yüksek öncelikle oluşturuldu.');
        } catch (error) {
            console.error('Bildirim başlatılırken hata:', error);
        }
    }

    static async toggleNotifications(enabled: boolean) {
        if (!Capacitor.isNativePlatform()) return;
        if (enabled) {
            await this.requestPermissions();
        } else {
            await this.cancelAll();
        }
    }

    static async cancelAll() {
        if (!Capacitor.isNativePlatform()) return;
        try {
            const pending = await LocalNotifications.getPending();
            if (pending.notifications.length > 0) {
                await LocalNotifications.cancel(pending);
            }
        } catch (e) {
            console.error('Tüm bildirimler iptal edilirken hata:', e);
        }
    }
}

export const notificationService = NotificationService;
