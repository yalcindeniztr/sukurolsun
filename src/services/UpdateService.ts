import { Preferences } from '@capacitor/preferences';

const CURRENT_VERSION = '1.39.0';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.yalcin.sukurolsun';
const UPDATE_CHECK_KEY = 'sukur_olsun_update_check_v1';

export interface UpdateInfo {
    hasUpdate: boolean;
    latestVersion: string;
    isForceUpdate: boolean;
    releaseNotes: string;
}

export class UpdateService {
    static getCurrentVersion(): string {
        return CURRENT_VERSION;
    }

    static getPlayStoreUrl(): string {
        return PLAY_STORE_URL;
    }

    static openPlayStore(): void {
        window.open(PLAY_STORE_URL, '_system') || window.open(PLAY_STORE_URL, '_blank');
    }

    /**
     * Versiyon karşılaştırması (Örn: '1.33.0' > '1.32.0')
     */
    static compareVersions(v1: string, v2: string): number {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);
        const maxLength = Math.max(parts1.length, parts2.length);

        for (let i = 0; i < maxLength; i++) {
            const val1 = parts1[i] || 0;
            const val2 = parts2[i] || 0;
            if (val1 > val2) return 1;
            if (val1 < val2) return -1;
        }
        return 0;
    }

    /**
     * Play Store ve uzak sunucudan yeni sürüm kontrolü yapar.
     */
    static async checkForUpdate(): Promise<UpdateInfo | null> {
        try {
            // Son erteleme durumunu kontrol et
            const { value: dismissedUntil } = await Preferences.get({ key: UPDATE_CHECK_KEY });
            if (dismissedUntil) {
                const dismissTime = Number(dismissedUntil);
                if (Date.now() < dismissTime) {
                    return null;
                }
            }

            // 1. Uzak Sürüm Kontrolü (GitHub Raw veya Versiyon API)
            const endpoints = [
                'https://raw.githubusercontent.com/yalcindeniztr/sukurolsun/main/version.json',
                'https://api.github.com/repos/yalcindeniztr/sukurolsun/releases/latest'
            ];

            for (const url of endpoints) {
                try {
                    const response = await fetch(url, { cache: 'no-cache' });
                    if (response.ok) {
                        const data = await response.json();
                        const remoteVersion = data.version || data.tag_name?.replace('v', '');
                        if (remoteVersion && this.compareVersions(remoteVersion, CURRENT_VERSION) > 0) {
                            return {
                                hasUpdate: true,
                                latestVersion: remoteVersion,
                                isForceUpdate: Boolean(data.forceUpdate),
                                releaseNotes: data.releaseNotes || data.body || 'Yeni Kuran-ı Kerim Meali, 3D görsel yenilikler ve performans iyileştirmeleri eklendi.'
                            };
                        }
                    }
                } catch (e) {
                    // Endpoint denemesi başarsızsa sonraki adıma geç
                }
            }

            // 2. Play Store HTML Scraper Kontrolü (Fallback)
            try {
                const playStoreRes = await fetch(`https://corsproxy.io/?${encodeURIComponent(PLAY_STORE_URL)}`);
                if (playStoreRes.ok) {
                    const text = await playStoreRes.text();
                    const versionMatch = text.match(/\[\[\["([0-9]+\.[0-9]+\.[0-9]+)"\]\]/);
                    if (versionMatch && versionMatch[1]) {
                        const playStoreVersion = versionMatch[1];
                        if (this.compareVersions(playStoreVersion, CURRENT_VERSION) > 0) {
                            return {
                                hasUpdate: true,
                                latestVersion: playStoreVersion,
                                isForceUpdate: false,
                                releaseNotes: 'Play Store\'da yeni bir güncelleme mevcut! Daha iyi bir deneyim için hemen güncelleyin.'
                            };
                        }
                    }
                }
            } catch (e) {
                // Scraper sessizce geçilir
            }

            return null;
        } catch (error) {
            console.warn('Sürüm kontrolü yapılamadı:', error);
            return null;
        }
    }

    /**
     * Güncelleme uyarısını 24 saatliğine erteler.
     */
    static async dismissUpdateForDay(): Promise<void> {
        const nextCheck = Date.now() + 24 * 60 * 60 * 1000;
        await Preferences.set({ key: UPDATE_CHECK_KEY, value: String(nextCheck) });
    }
}
