import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

const ALERT_CHANNEL_ID = 'shukur-olsun-alerts-v2';
const EZAN_CHANNEL_ID = 'shukur-olsun-ezan-v2';
const DAILY_NOTIFICATION_IDS = [777, 888, 999];

type NotificationChannelKind = 'alert' | 'ezan';

export class NotificationService {
    static parseClockTime(time: string): { hours: number; minutes: number } | null {
        const match = time.trim().match(/^(\d{1,2}):(\d{2})/);
        if (!match) return null;

        const hours = Number(match[1]);
        const minutes = Number(match[2]);
        if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

        return { hours, minutes };
    }

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

    static async ensureExactAlarmPermission(): Promise<boolean> {
        if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') return true;

        try {
            const status = await LocalNotifications.checkExactNotificationSetting();
            if (status.exact_alarm === 'granted') return true;

            const request = await LocalNotifications.changeExactNotificationSetting();
            return request.exact_alarm === 'granted';
        } catch (error) {
            console.warn('Exact alarm izni kontrol edilemedi:', error);
            return true;
        }
    }

    private static async ensureSchedulingReady(): Promise<boolean> {
        const hasPermission = await this.requestPermissions();
        if (!hasPermission) return false;

        await this.init();
        return this.ensureExactAlarmPermission();
    }

    static async prepareScheduling(): Promise<boolean> {
        if (!Capacitor.isNativePlatform()) return true;
        return this.ensureSchedulingReady();
    }

    private static getChannelId(kind: NotificationChannelKind): string {
        return kind === 'ezan' ? EZAN_CHANNEL_ID : ALERT_CHANNEL_ID;
    }

    static async scheduleAtDate(
        id: number,
        title: string,
        body: string,
        scheduledTime: Date,
        channel: NotificationChannelKind = 'alert',
        skipPrepare = false
    ): Promise<boolean> {
        if (!Capacitor.isNativePlatform()) return true;
        if (Number.isNaN(scheduledTime.getTime())) return false;
        if (scheduledTime.getTime() <= Date.now()) return false;

        try {
            if (!skipPrepare) {
                const ready = await this.ensureSchedulingReady();
                if (!ready) return false;
            }

            await this.cancelNotification(id);
            await LocalNotifications.schedule({
                notifications: [
                    {
                        id,
                        title,
                        body,
                        schedule: {
                            at: scheduledTime,
                            allowWhileIdle: true
                        },
                        sound: 'bell.wav',
                        channelId: this.getChannelId(channel),
                    }
                ]
            });
            return true;
        } catch (error) {
            console.error('Bildirim planlanırken hata:', error);
            return false;
        }
    }

    static async schedulePrayerReminder(id: number, title: string, body: string, timeStr: string, minutesBefore = 5) {
        if (!Capacitor.isNativePlatform()) return;

        const clock = this.parseClockTime(timeStr);
        if (!clock) return;

        const scheduledTime = new Date();
        scheduledTime.setHours(clock.hours, clock.minutes, 0, 0);
        scheduledTime.setMinutes(scheduledTime.getMinutes() - Math.max(0, minutesBefore));

        await this.scheduleAtDate(id, title, body, scheduledTime, 'ezan');
    }

    static async schedulePrayerTimeAlert(id: number, prayerLabel: string, timeStr: string) {
        if (!Capacitor.isNativePlatform()) return;

        const clock = this.parseClockTime(timeStr);
        if (!clock) return;

        const scheduledTime = new Date();
        scheduledTime.setHours(clock.hours, clock.minutes, 0, 0);

        await this.scheduleAtDate(
            id,
            `${prayerLabel} Vakti`,
            `${prayerLabel} vakti girdi. Allah kabul etsin.`,
            scheduledTime,
            'alert'
        );
    }

    static async scheduleRecurringDaily(id: number, title: string, body: string, hour: number, minute: number) {
        if (!Capacitor.isNativePlatform()) return;

        try {
            const ready = await this.ensureSchedulingReady();
            if (!ready) return;

            await Promise.all(DAILY_NOTIFICATION_IDS.map(notificationId => this.cancelNotification(notificationId)));

            await LocalNotifications.schedule({
                notifications: [
                    {
                        id,
                        title,
                        body,
                        schedule: {
                            on: { hour, minute, second: 0 },
                            repeats: true,
                            allowWhileIdle: true
                        },
                        sound: 'bell.wav',
                        channelId: ALERT_CHANNEL_ID,
                    }
                ]
            });
        } catch (error) {
            console.error('Tekrarlı bildirim hatası:', error);
        }
    }

    static async scheduleGeneralReminder(id: string, title: string, body: string, time: string, date?: string, repeat?: 'none' | 'daily' | 'weekly' | 'monthly') {
        if (!Capacitor.isNativePlatform()) return;

        try {
            const ready = await this.ensureSchedulingReady();
            if (!ready) return;

            const numericId = this.stringToId(id);
            const clock = this.parseClockTime(time);
            if (!clock) return;

            await this.cancelNotification(numericId);

            let schedule: any;
            if (repeat === 'daily') {
                schedule = { on: { hour: clock.hours, minute: clock.minutes, second: 0 }, repeats: true, allowWhileIdle: true };
            } else {
                const scheduledDate = date ? new Date(date) : new Date();
                scheduledDate.setHours(clock.hours, clock.minutes, 0, 0);

                if (!date && scheduledDate.getTime() <= Date.now()) {
                    scheduledDate.setDate(scheduledDate.getDate() + 1);
                }

                if (date && scheduledDate.getTime() <= Date.now() && repeat === 'none') {
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
                        channelId: ALERT_CHANNEL_ID,
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
        } catch (error) {
            console.error('Bildirim iptal hatası:', error);
        }
    }

    static async purgeNotifications(ids: number[]) {
        if (!Capacitor.isNativePlatform()) return;
        const notifications = ids.map((id) => ({ id }));
        try {
            await LocalNotifications.cancel({ notifications });
            const delivered = await LocalNotifications.getDeliveredNotifications();
            const deliveredMatches = delivered.notifications.filter((notification) => ids.includes(notification.id));
            if (deliveredMatches.length > 0) {
                await LocalNotifications.removeDeliveredNotifications({ notifications: deliveredMatches });
            }
        } catch (error) {
            console.error('Bildirim temizleme hatası:', error);
        }
    }

    static async cancelGeneralReminder(id: string) {
        const numericId = this.stringToId(id);
        await this.cancelNotification(numericId);
    }

    static async init() {
        if (!Capacitor.isNativePlatform()) return;

        try {
            await LocalNotifications.createChannel({
                id: ALERT_CHANNEL_ID,
                name: 'Şükür Olsun Hatırlatıcılar',
                description: 'Günlük şükür, ezan vakti ve genel hatırlatıcı bildirimleri',
                importance: 5,
                visibility: 1,
                sound: 'bell.wav',
                vibration: true,
            });

            await LocalNotifications.createChannel({
                id: EZAN_CHANNEL_ID,
                name: 'Ezan Vakti Uyarıları',
                description: 'Ezan vaktinden önce sesli ve titreşimli uyarılar',
                importance: 5,
                visibility: 1,
                sound: 'bell.wav',
                vibration: true,
            });
        } catch (error) {
            console.error('Bildirim başlatılırken hata:', error);
        }
    }

    static async toggleNotifications(enabled: boolean) {
        if (!Capacitor.isNativePlatform()) return;
        if (enabled) {
            await this.scheduleRecurringDaily(
                999,
                'Günlük Şükür',
                'Bugün şükrettiğiniz bir nimeti kaydetmeye ne dersiniz?',
                13,
                0
            );
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
        } catch (error) {
            console.error('Tüm bildirimler iptal edilirken hata:', error);
        }
    }
}

export const notificationService = NotificationService;
