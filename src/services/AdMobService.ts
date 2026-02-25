import { AdMob, AdMobInitializationOptions, BannerAdOptions, BannerAdSize, BannerAdPosition, AdOptions, RewardAdOptions, AdMobRewardItem } from '@capacitor-community/admob';

export class AdMobService {
    private static initialised = false;

    // Orijinal AdMob ID'leri .env.local dosyasından okunur
    // Test ID'leri sadece fallback olarak kullanılır
    private static readonly BANNER_ID = import.meta.env.VITE_ADMOB_BANNER_ID || 'ca-app-pub-3940256099942544/6300978111';
    private static readonly INTERSTITIAL_ID = import.meta.env.VITE_ADMOB_INTERSTITIAL_ID || 'ca-app-pub-3940256099942544/1033173712';
    private static readonly REWARDED_ID = import.meta.env.VITE_ADMOB_REWARDED_ID || 'ca-app-pub-3940256099942544/5224354917';

    // Production modunu kontrol et
    private static readonly IS_PRODUCTION = import.meta.env.VITE_APP_MODE === 'production';

    static async initialize(): Promise<void> {
        if (this.initialised) return;

        try {
            await AdMob.trackingAuthorizationStatus();

            const options: AdMobInitializationOptions = {
                initializeForTesting: !this.IS_PRODUCTION,
            };

            await AdMob.initialize(options);
            this.initialised = true;
        } catch {
            // Sessiz hata - web ortamında AdMob çalışmaz
        }
    }

    static async showBanner(): Promise<void> {
        if (!this.initialised) {
            await this.initialize();
        }

        const options: BannerAdOptions = {
            adId: this.BANNER_ID,
            adSize: BannerAdSize.ADAPTIVE_BANNER,
            position: BannerAdPosition.BOTTOM_CENTER,
            margin: 0,
            isTesting: !this.IS_PRODUCTION
        };

        try {
            await AdMob.showBanner(options);
        } catch {
            // Sessiz hata
        }
    }

    static async hideBanner(): Promise<void> {
        try {
            await AdMob.hideBanner();
        } catch {
            // Sessiz hata
        }
    }

    static async removeBanner(): Promise<void> {
        try {
            await AdMob.removeBanner();
        } catch {
            // Sessiz hata
        }
    }

    static async prepareInterstitial(): Promise<void> {
        const options: AdOptions = {
            adId: this.INTERSTITIAL_ID,
            isTesting: !this.IS_PRODUCTION
        };

        try {
            await AdMob.prepareInterstitial(options);
        } catch {
            // Sessiz hata
        }
    }

    private static interstitialCounter = 0;
    private static readonly FREQUENCY_CAP = 3;

    static async showInterstitial(): Promise<void> {
        this.interstitialCounter++;

        if (this.interstitialCounter % this.FREQUENCY_CAP !== 0) {
            return;
        }

        try {
            await AdMob.showInterstitial();
        } catch {
            // Sessiz hata
        }
    }

    static async prepareRewardVideo(): Promise<void> {
        const options: RewardAdOptions = {
            adId: this.REWARDED_ID,
            isTesting: !this.IS_PRODUCTION
        };

        try {
            await AdMob.prepareRewardVideoAd(options);
        } catch {
            // Sessiz hata
        }
    }

    static async showRewardVideo(): Promise<AdMobRewardItem | undefined> {
        try {
            const reward = await AdMob.showRewardVideoAd();
            return reward;
        } catch {
            return undefined;
        }
    }
}
