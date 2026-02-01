import { JournalEntry, Badge } from '../core/types';

export const BADGES: Badge[] = [
    { id: 'start_journey', labelTr: 'İlk Adım', icon: 'footprints', requiredStreak: 1, color: 'text-teal-400' },
    { id: 'week_streak', labelTr: 'Bir Hafta', icon: 'calendar-check', requiredStreak: 7, color: 'text-blue-400' },
    { id: 'month_streak', labelTr: 'İstikrar', icon: 'medal', requiredStreak: 30, color: 'text-gold-400' },
    { id: 'master_streak', labelTr: 'Şükür Ustası', icon: 'crown', requiredStreak: 100, color: 'text-purple-400' },
];

export const gamificationService = {
    calculateStreak: (entries: JournalEntry[]): number => {
        if (entries.length === 0) return 0;

        // Get unique dates sorted descending
        const dates = Array.from(new Set(
            entries.map(e => new Date(e.timestamp).toDateString())
        )).map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());

        let streak = 0;
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        // Check if the most recent entry is today or yesterday
        const lastEntryDate = dates[0]?.toDateString();

        if (lastEntryDate !== today && lastEntryDate !== yesterday) {
            return 0; // Streak broken
        }

        // Count consecutive days
        let currentDate = new Date(lastEntryDate);

        for (let i = 0; i < dates.length; i++) {
            if (dates[i]?.toDateString() === currentDate.toDateString()) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }

        return streak;
    },

    checkNewBadges: (streak: number, currentBadges: string[]): string[] => {
        const newBadges: string[] = [];

        BADGES.forEach(badge => {
            if (streak >= badge.requiredStreak && !currentBadges.includes(badge.id)) {
                newBadges.push(badge.id);
            }
        });

        return newBadges;
    }
};
