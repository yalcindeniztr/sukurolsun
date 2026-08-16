import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { PrayerTimeService } from './PrayerTimeService';

const ALERT_CHANNEL_ID = 'shukur-olsun-alerts-v5';
const EZAN_CHANNEL_ID = 'shukur-olsun-ezan-v5';
const DAILY_NOTIFICATION_IDS = [777, 888, 999];
const GENERAL_REMINDER_REPAIR_KEY = 'bana_hatirlat_schedule_fix_v1110_at_daily';
const DAILY_SCHEDULE_DAYS = 30;
const GENERAL_REMINDER_ID_BASE = 50_000_000;
const GENERAL_REMINDER_ID_SPAN = 40;

type NotificationChannelKind = 'alert' | 'ezan';
type ReminderRepeat = 'none' | 'daily' | 'weekly' | 'monthly';
type StoredGeneralReminder = {
    id: string;
    name: string;
    date?: string;
    time: string;
    repeat?: ReminderRepeat;
    enabled?: boolean;
};

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

    private static buildOccurrence(hours: number, minutes: number, offsetDays: number, date?: string): Date | null {
        const scheduledDate = date ? new Date(date) : new Date();
        if (Number.isNaN(scheduledDate.getTime())) return null;

        scheduledDate.setDate(scheduledDate.getDate() + offsetDays);
        scheduledDate.setHours(hours, minutes, 0, 0);
        return scheduledDate;
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
            console.error('Bildirim izni alinirken hata:', error);
            return false;
        }
    }

    static async ensureExactAlarmPermission(): Promise<boolean> {
        return true;
    }

    private static async ensureSchedulingReady(): Promise<boolean> {
        const hasPermission = await this.requestPermissions();
        if (!hasPermission) return false;

        await this.init();
        return true;
    }

    static async prepareScheduling(): Promise<boolean> {
        if (!Capacitor.isNativePlatform()) return true;
        return this.ensureSchedulingReady();
    }

    private static getChannelId(kind: NotificationChannelKind): string {
        return kind === 'ezan' ? EZAN_CHANNEL_ID : ALERT_CHANNEL_ID;
    }

    private static async verifyPending(id: number): Promise<boolean> {
        if (!Capacitor.isNativePlatform()) return true;

        try {
            const pending = await LocalNotifications.getPending();
            return pending.notifications.some((notification) => notification.id === id);
        } catch (error) {
            console.error('Bildirim pending dogrulama hatasi:', error);
            return false;
        }
    }

    private static async verifyPendingAny(ids: number[]): Promise<boolean> {
        if (!Capacitor.isNativePlatform()) return true;

        try {
            const pending = await LocalNotifications.getPending();
            const pendingIds = new Set(pending.notifications.map((notification) => notification.id));
            return ids.some((id) => pendingIds.has(id));
        } catch (error) {
            console.error('Bildirim pending dogrulama hatasi:', error);
            return false;
        }
    }

    private static getRecurringDailyIds(id: number): number[] {
        const baseId = id * 1000;
        return [id, ...Array.from({ length: DAILY_SCHEDULE_DAYS }, (_, index) => baseId + index)];
    }

    private static getGeneralReminderBaseId(id: string): number {
        return GENERAL_REMINDER_ID_BASE + (this.stringToId(id) % 1_000_000) * GENERAL_REMINDER_ID_SPAN;
    }

    private static getGeneralReminderIds(id: string): number[] {
        const legacyId = this.stringToId(id);
        const baseId = this.getGeneralReminderBaseId(id);
        return [legacyId, ...Array.from({ length: GENERAL_REMINDER_ID_SPAN }, (_, index) => baseId + index)];
    }

    static async scheduleAtDate(
        id: number,
        title: string,
        body: string,
        scheduledTime: Date,
        channel: NotificationChannelKind = 'alert',
        skipPrepare = false,
        extraPayload?: Record<string, any>
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
            const defaultTargetTab = channel === 'ezan' ? 'prayer_times' : 'sukur_vakti';
            await LocalNotifications.schedule({
                notifications: [
                    {
                        id,
                        title,
                        body,
                        schedule: {
                            at: scheduledTime,
                            allowWhileIdle: true,
                        },
                        sound: 'bell',
                        channelId: this.getChannelId(channel),
                        extra: {
                            targetTab: defaultTargetTab,
                            ...extraPayload
                        }
                    },
                ],
            });
            return this.verifyPending(id);
        } catch (error) {
            console.error('Bildirim planlanirken hata:', error);
            return false;
        }
    }

    static async schedulePrayerReminder(id: number, title: string, body: string, timeStr: string, minutesBefore = 5): Promise<boolean> {
        if (!Capacitor.isNativePlatform()) return true;

        const clock = this.parseClockTime(timeStr);
        if (!clock) return false;

        const scheduledTime = new Date();
        scheduledTime.setHours(clock.hours, clock.minutes, 0, 0);
        scheduledTime.setMinutes(scheduledTime.getMinutes() - Math.max(0, minutesBefore));

        return this.scheduleAtDate(id, title, body, scheduledTime, 'ezan');
    }

    static async schedulePrayerTimeAlert(id: number, prayerLabel: string, timeStr: string): Promise<boolean> {
        if (!Capacitor.isNativePlatform()) return true;

        const clock = this.parseClockTime(timeStr);
        if (!clock) return false;

        const scheduledTime = new Date();
        scheduledTime.setHours(clock.hours, clock.minutes, 0, 0);

        return this.scheduleAtDate(
            id,
            `${prayerLabel} Vakti`,
            `${prayerLabel} vakti girdi. Allah kabul etsin.`,
            scheduledTime,
            'ezan'
        );
    }

    static async scheduleRecurringDaily(id: number, title: string, body: string, hour: number, minute: number): Promise<boolean> {
        if (!Capacitor.isNativePlatform()) return true;

        try {
            const ready = await this.ensureSchedulingReady();
            if (!ready) return false;

            const ids = this.getRecurringDailyIds(id);
            await this.purgeNotifications(ids);

            const notifications = ids.slice(1).map((notificationId, index) => {
                const scheduledDate = this.buildOccurrence(hour, minute, index);
                if (!scheduledDate || scheduledDate.getTime() <= Date.now()) return null;

                return {
                    id: notificationId,
                    title,
                    body,
                    schedule: {
                        at: scheduledDate,
                        allowWhileIdle: true,
                    },
                    sound: 'bell',
                    channelId: ALERT_CHANNEL_ID,
                };
            }).filter((notification): notification is NonNullable<typeof notification> => notification !== null);

            if (notifications.length === 0) return false;

            await LocalNotifications.schedule({
                notifications,
            });
            return this.verifyPendingAny(notifications.map((notification) => notification.id));
        } catch (error) {
            console.error('Tekrarli bildirim hatasi:', error);
            return false;
        }
    }

    static async scheduleGeneralReminder(
        id: string,
        title: string,
        body: string,
        time: string,
        date?: string,
        repeat?: ReminderRepeat
    ): Promise<boolean> {
        if (!Capacitor.isNativePlatform()) return true;

        try {
            const ready = await this.ensureSchedulingReady();
            if (!ready) return false;

            const baseId = this.getGeneralReminderBaseId(id);
            const clock = this.parseClockTime(time);
            if (!clock) return false;

            await this.purgeNotifications(this.getGeneralReminderIds(id));

            let notifications: Array<{
                id: number;
                title: string;
                body: string;
                schedule: { at: Date; allowWhileIdle: boolean };
                sound: string;
                channelId: string;
            }> = [];
            if (repeat === 'daily') {
                notifications = Array.from({ length: DAILY_SCHEDULE_DAYS }, (_, index) => {
                    const scheduledDate = this.buildOccurrence(clock.hours, clock.minutes, index, date);
                    if (!scheduledDate || scheduledDate.getTime() <= Date.now()) return null;

                    return {
                        id: baseId + index,
                        title,
                        body,
                        schedule: { at: scheduledDate, allowWhileIdle: true },
                        sound: 'bell',
                        channelId: ALERT_CHANNEL_ID,
                    };
                }).filter((notification): notification is NonNullable<typeof notification> => notification !== null);
            } else {
                const scheduledDate = date ? new Date(date) : new Date();
                scheduledDate.setHours(clock.hours, clock.minutes, 0, 0);

                if (!date && scheduledDate.getTime() <= Date.now()) {
                    scheduledDate.setDate(scheduledDate.getDate() + 1);
                }

                if (date && scheduledDate.getTime() <= Date.now() && repeat === 'none') {
                    return false;
                }

                const repeatOffsets = repeat === 'weekly'
                    ? Array.from({ length: 12 }, (_, index) => index * 7)
                    : repeat === 'monthly'
                        ? Array.from({ length: 12 }, (_, index) => index)
                        : [0];

                notifications = repeatOffsets.map((offset, index) => {
                    const nextDate = new Date(scheduledDate);
                    if (repeat === 'weekly') nextDate.setDate(nextDate.getDate() + offset);
                    if (repeat === 'monthly') nextDate.setMonth(nextDate.getMonth() + offset);
                    if (nextDate.getTime() <= Date.now()) return null;

                    return {
                        id: baseId + index,
                        title,
                        body,
                        schedule: { at: nextDate, allowWhileIdle: true },
                        sound: 'bell',
                        channelId: ALERT_CHANNEL_ID,
                    };
                }).filter((notification): notification is NonNullable<typeof notification> => notification !== null);
            }

            if (notifications.length === 0) return false;

            await LocalNotifications.schedule({
                notifications,
            });
            return this.verifyPendingAny(notifications.map((notification) => notification.id));
        } catch (error) {
            console.error('Genel hatirlatici planlanirken hata:', error);
            return false;
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

    static async cancelNotification(id: number): Promise<void> {
        if (!Capacitor.isNativePlatform()) return;
        try {
            await LocalNotifications.cancel({ notifications: [{ id }] });
            const delivered = await LocalNotifications.getDeliveredNotifications();
            const deliveredMatches = delivered.notifications.filter((notification) => notification.id === id);
            if (deliveredMatches.length > 0) {
                await LocalNotifications.removeDeliveredNotifications({ notifications: deliveredMatches });
            }
        } catch (error) {
            console.error('Bildirim iptal hatasi:', error);
        }
    }

    static async purgeNotifications(ids: number[]): Promise<void> {
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
            console.error('Bildirim temizleme hatasi:', error);
        }
    }

    static async cancelDailyNotifications(): Promise<void> {
        await this.purgeNotifications(DAILY_NOTIFICATION_IDS.flatMap((id) => this.getRecurringDailyIds(id)));
    }

    static async cancelGeneralReminder(id: string): Promise<void> {
        await this.purgeNotifications(this.getGeneralReminderIds(id));
    }

    static async repairStoredGeneralRemindersOnce(): Promise<void> {
        if (!Capacitor.isNativePlatform()) return;

        try {
            const { value: repaired } = await Preferences.get({ key: GENERAL_REMINDER_REPAIR_KEY });
            if (repaired === 'done') return;

            const { value: stored } = await Preferences.get({ key: 'bana_hatirlat_reminders' });
            if (!stored) {
                await Preferences.set({ key: GENERAL_REMINDER_REPAIR_KEY, value: 'done' });
                return;
            }

            const reminders = JSON.parse(stored) as StoredGeneralReminder[];
            const enabledReminders = reminders.filter((reminder) => reminder.enabled !== false && reminder.id && reminder.time);

            for (const reminder of enabledReminders) {
                await this.scheduleGeneralReminder(
                    reminder.id,
                    'Sukur Olsun Hatirlaticisi',
                    reminder.name,
                    reminder.time,
                    reminder.date,
                    reminder.repeat
                );
            }

            await Preferences.set({ key: GENERAL_REMINDER_REPAIR_KEY, value: 'done' });
        } catch (error) {
            console.error('Bana Hatirlat bildirim onarimi basarisiz:', error);
        }
    }

    static async init(): Promise<void> {
        if (!Capacitor.isNativePlatform()) return;

        try {
            await LocalNotifications.createChannel({
                id: ALERT_CHANNEL_ID,
                name: 'Sukur Olsun Hatirlaticilar',
                description: 'Gunluk sukur ve genel hatirlatici bildirimleri',
                importance: 5,
                visibility: 1,
                sound: 'bell',
                vibration: true,
            });

            await LocalNotifications.createChannel({
                id: EZAN_CHANNEL_ID,
                name: 'Ezan Vakti Uyarilari',
                description: 'Ezan vakti ve ezan oncesi sesli uyarilar',
                importance: 5,
                visibility: 1,
                sound: 'bell',
                vibration: true,
            });
        } catch (error) {
            console.error('Bildirim baslatilirken hata:', error);
        }
    }

    static async toggleNotifications(enabled: boolean): Promise<boolean> {
        if (!Capacitor.isNativePlatform()) return true;
        if (enabled) {
            return this.scheduleRecurringDaily(
                999,
                'Gunluk Sukur',
                'Bugun sukrettiginiz bir nimeti kaydetmeye ne dersiniz?',
                13,
                0
            );
        }

        await this.cancelDailyNotifications();
        return true;
    }

    static async registerNotificationListener(onNavigate: (targetTab: string, openWriting?: boolean) => void): Promise<void> {
        if (!Capacitor.isNativePlatform()) return;

        try {
            await LocalNotifications.addListener('localNotificationActionPerformed', (notificationAction) => {
                const extra = notificationAction.notification.extra;
                const title = (notificationAction.notification.title || '').toLowerCase();
                const body = (notificationAction.notification.body || '').toLowerCase();
                let targetTab = extra?.targetTab || 'sukur_vakti';

                if (title.includes('ezan') || title.includes('vakti') || title.includes('namaz') || body.includes('vakti')) {
                    targetTab = 'prayer_times';
                } else if (title.includes('şükür') || title.includes('sukur') || title.includes('nimet') || title.includes('günlük') || body.includes('şükür') || body.includes('sukur')) {
                    targetTab = 'sukur_vakti';
                }

                onNavigate(targetTab, true);
            });
        } catch (error) {
            console.error('Bildirim dinleyicisi kaydedilirken hata:', error);
        }
    }

    static async scheduleBatch(
        items: Array<{
            id: number;
            title: string;
            body: string;
            scheduledTime: Date;
            channel?: NotificationChannelKind;
            extraPayload?: Record<string, any>;
        }>
    ): Promise<boolean> {
        if (!Capacitor.isNativePlatform() || items.length === 0) return true;

        const validItems = items.filter(
            (item) => !Number.isNaN(item.scheduledTime.getTime()) && item.scheduledTime.getTime() > Date.now()
        );
        if (validItems.length === 0) return true;

        try {
            const ready = await this.ensureSchedulingReady();
            if (!ready) return false;

            const notifications = validItems.map((item) => ({
                id: item.id,
                title: item.title,
                body: item.body,
                schedule: {
                    at: item.scheduledTime,
                    allowWhileIdle: true,
                },
                sound: 'bell',
                channelId: this.getChannelId(item.channel || 'alert'),
                extra: {
                    targetTab: item.channel === 'ezan' ? 'prayer_times' : 'sukur_vakti',
                    ...item.extraPayload,
                },
            }));

            await LocalNotifications.schedule({ notifications });
            return true;
        } catch (error) {
            console.error('Batch bildirim planlanirken hata:', error);
            return false;
        }
    }

    static async syncPrayerTimesOnAppStart(): Promise<void> {
        if (!Capacitor.isNativePlatform()) return;

        try {
            const { value: city } = await Preferences.get({ key: 'prayer_city' });
            const { value: reminders } = await Preferences.get({ key: 'prayer_reminders' });
            const { value: minutes } = await Preferences.get({ key: 'prayer_reminder_minutes' });

            const selectedCity = city || 'İstanbul';
            const reminderSettings: Record<string, boolean> = reminders ? JSON.parse(reminders) : {};
            const parsedMinutes = Number(minutes);
            const reminderMinutes = Number.isFinite(parsedMinutes) ? Math.min(120, Math.max(0, parsedMinutes)) : 5;

            const activePrayers = Object.entries(reminderSettings).filter(([, enabled]) => enabled).map(([key]) => key);
            if (activePrayers.length === 0) return;

            const PRAYERS_DEF: Record<string, { title: string; id: number }> = {
                imsak: { title: 'İmsak', id: 100 },
                gunes: { title: 'Güneş', id: 200 },
                ogle: { title: 'Öğle', id: 300 },
                ikindi: { title: 'İkindi', id: 400 },
                aksam: { title: 'Akşam', id: 500 },
                yatsi: { title: 'Yatsı', id: 600 },
            };

            // Purge old prayer IDs
            const allPrayerIds = Object.values(PRAYERS_DEF).flatMap((p) => [
                ...Array.from({ length: 14 }, (_, i) => p.id + i),
                ...Array.from({ length: 14 }, (_, i) => p.id + 1000 + i),
            ]);
            await this.purgeNotifications(allPrayerIds);

            // Fetch correct data dynamically per targetDate month
            const today = new Date();
            const cachedMonths: Record<string, any[]> = {};
            const getTimesForDate = async (d: Date) => {
                const m = d.getMonth() + 1;
                const y = d.getFullYear();
                const cacheKey = `${y}-${m}`;
                if (!cachedMonths[cacheKey]) {
                    try {
                        cachedMonths[cacheKey] = await PrayerTimeService.getMonthlyTimes(selectedCity, m, y);
                    } catch (e) {
                        console.error(`Monthly times fetch failed for ${cacheKey}:`, e);
                        cachedMonths[cacheKey] = [];
                    }
                }
                const dayIndex = d.getDate() - 1;
                return cachedMonths[cacheKey][dayIndex] || null;
            };

            const batchItems: Array<{
                id: number;
                title: string;
                body: string;
                scheduledTime: Date;
                channel: NotificationChannelKind;
            }> = [];

            for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
                const targetDate = new Date(today);
                targetDate.setDate(today.getDate() + dayOffset);
                const dayTimes = await getTimesForDate(targetDate);
                if (!dayTimes) continue;

                for (const prayerKey of activePrayers) {
                    const prayerInfo = PRAYERS_DEF[prayerKey];
                    if (!prayerInfo) continue;

                    const timeStr = (dayTimes as any)[prayerKey];
                    if (!timeStr) continue;

                    const clock = this.parseClockTime(timeStr);
                    if (!clock) continue;

                    // Prayer Exact Time Alert
                    const alertTime = new Date(targetDate);
                    alertTime.setHours(clock.hours, clock.minutes, 0, 0);

                    if (alertTime.getTime() > Date.now()) {
                        batchItems.push({
                            id: prayerInfo.id + 1000 + dayOffset,
                            title: `${prayerInfo.title} Vakti`,
                            body: `${prayerInfo.title} vakti girdi. Allah kabul etsin.`,
                            scheduledTime: alertTime,
                            channel: 'ezan',
                        });
                    }

                    // Pre-reminder Time Alert
                    if (reminderMinutes > 0) {
                        const reminderTime = new Date(alertTime);
                        reminderTime.setMinutes(reminderTime.getMinutes() - reminderMinutes);

                        if (reminderTime.getTime() > Date.now()) {
                            batchItems.push({
                                id: prayerInfo.id + dayOffset,
                                title: `Ezan Vakti Yaklaşıyor: ${prayerInfo.title}`,
                                body: `${prayerInfo.title} vaktine ${reminderMinutes} dakika kaldı. Hazırlanmaya ne dersiniz?`,
                                scheduledTime: reminderTime,
                                channel: 'ezan',
                            });
                        }
                    }
                }
            }

            if (batchItems.length > 0) {
                await this.scheduleBatch(batchItems);
            }
        } catch (error) {
            console.error('Namaz vakitleri otomatik senkronizasyon hatasi:', error);
        }
    }

    static async cancelAll(): Promise<void> {
        if (!Capacitor.isNativePlatform()) return;
        try {
            const pending = await LocalNotifications.getPending();
            if (pending.notifications.length > 0) {
                await LocalNotifications.cancel(pending);
            }
        } catch (error) {
            console.error('Tum bildirimler iptal edilirken hata:', error);
        }
    }
}

export const notificationService = NotificationService;


