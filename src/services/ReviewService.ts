// Play Store Review Service
// 1 hafta kullanım sonrası, rahatsız etmeden review isteği

import { Preferences } from '@capacitor/preferences';

const STORAGE_KEY = 'sukur_review_state';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.yalcin.sukurolsun';

interface ReviewState {
    firstOpenDate: string | null;
    entryCount: number;
    lastPromptDate: string | null;
    hasRated: boolean;
    promptCount: number;
}

const getReviewState = async (): Promise<ReviewState> => {
    try {
        const { value } = await Preferences.get({ key: STORAGE_KEY });
        if (value) return JSON.parse(value);
    } catch {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) return JSON.parse(data);
        } catch { /* sessiz */ }
    }
    return {
        firstOpenDate: null,
        entryCount: 0,
        lastPromptDate: null,
        hasRated: false,
        promptCount: 0
    };
};

const saveReviewState = async (state: ReviewState): Promise<void> => {
    try {
        await Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(state) });
    } catch {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch { /* sessiz */ }
    }
};

export const ReviewService = {
    /** Uygulama açılışında çağrılır — ilk kullanım tarihini kaydeder */
    async trackFirstOpen(): Promise<void> {
        const state = await getReviewState();
        if (!state.firstOpenDate) {
            state.firstOpenDate = new Date().toISOString();
            await saveReviewState(state);
        }
    },

    /**
     * Kayıt sayısını artır ve review gösterilmeli mi kontrol et.
     * Play Store Kuralları:
     * - Zaten değerlendirme yaptıysa: gösterme
     * - İlk kullanımdan 7 gün geçmeden: gösterme
     * - Minimum 5 kayıt yapmadan: gösterme
     * - Son gösterimden 14 gün geçmeden: gösterme (rahatsız etme)
     * - Maksimum 3 kez sor
     */
    async incrementAndCheck(): Promise<boolean> {
        const state = await getReviewState();

        // Zaten değerlendirme yaptıysa asla gösterme
        if (state.hasRated) return false;

        // Maksimum 3 kez sor
        if (state.promptCount >= 3) return false;

        state.entryCount++;
        await saveReviewState(state);

        // İlk kullanım tarihi yoksa kaydet ve çık
        if (!state.firstOpenDate) {
            state.firstOpenDate = new Date().toISOString();
            await saveReviewState(state);
            return false;
        }

        // İlk kullanımdan en az 7 gün geçmeli
        const firstOpen = new Date(state.firstOpenDate);
        const now = new Date();
        const daysSinceFirstOpen = Math.floor((now.getTime() - firstOpen.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSinceFirstOpen < 7) return false;

        // En az 5 kayıt yapılmış olmalı
        if (state.entryCount < 5) return false;

        // Son gösterimden 14 gün geçmeli
        if (state.lastPromptDate) {
            const lastDate = new Date(state.lastPromptDate);
            const daysSinceLastPrompt = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            if (daysSinceLastPrompt < 14) return false;
        }

        return true;
    },

    /** Review prompt gösterildi */
    async markPromptShown(): Promise<void> {
        const state = await getReviewState();
        state.lastPromptDate = new Date().toISOString();
        state.promptCount++;
        await saveReviewState(state);
    },

    /** Kullanıcı değerlendirme yaptı */
    async markAsRated(): Promise<void> {
        const state = await getReviewState();
        state.hasRated = true;
        await saveReviewState(state);
    },

    /** Play Store sayfasını aç */
    openPlayStore(): void {
        window.open(PLAY_STORE_URL, '_blank');
        this.markAsRated();
    },

    getPlayStoreUrl(): string {
        return PLAY_STORE_URL;
    }
};
