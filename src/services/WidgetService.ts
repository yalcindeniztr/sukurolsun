import { Capacitor, registerPlugin } from '@capacitor/core';
import { ANNUAL_VERSES } from '../core/verses_data';

interface WidgetDataPlugin {
    update(data: {
        dateText: string;
        nextPrayer: string;
        nextPrayerTime: string;
        verseText: string;
        verseSource: string;
    }): Promise<void>;
}

const WidgetData = registerPlugin<WidgetDataPlugin>('WidgetData');

const getDayOfYear = (date: Date) => {
    const start = new Date(date.getFullYear(), 0, 0);
    return Math.floor((date.getTime() - start.getTime()) / 86400000);
};

export class WidgetService {
    static getDailyVerse(date = new Date()) {
        const verse = ANNUAL_VERSES[getDayOfYear(date) % ANNUAL_VERSES.length];
        return {
            text: verse?.textTr || 'Şükrederseniz, andolsun ki size nimetimi artırırım.',
            source: verse?.sourceTr || 'İbrahim Suresi, 7',
        };
    }

    static async update(data: { nextPrayer?: string; nextPrayerTime?: string } = {}): Promise<void> {
        if (!Capacitor.isNativePlatform()) return;

        const now = new Date();
        const verse = this.getDailyVerse(now);

        try {
            await WidgetData.update({
                dateText: now.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' }),
                nextPrayer: data.nextPrayer || 'Ezan vakti',
                nextPrayerTime: data.nextPrayerTime || '--:--',
                verseText: verse.text,
                verseSource: verse.source,
            });
        } catch (error) {
            console.warn('Widget güncellenemedi:', error);
        }
    }
}
