import { AdMob, AdMobInitializationOptions, BannerAdOptions, BannerAdSize, BannerAdPosition, AdOptions, RewardAdOptions, AdMobRewardItem } from '@capacitor-community/admob';

export class AdMobService {
    private static initialised = false;

    // Ad IDs
    private static readonly BANNER_ID = import.meta.env.VITE_ADMOB_BANNER_ID || 'ca-app-pub-3940256099942544/6300978111';
    private static readonly INTERSTITIAL_ID = import.meta.env.VITE_ADMOB_INTERSTITIAL_ID || 'ca-app-pub-3940256099942544/1033173712';
    private static readonly REWARDED_ID = import.meta.env.VITE_ADMOB_REWARDED_ID || 'ca-app-pub-3940256099942544/5224354917';

    // Production settings
    private static readonly IS_PRODUCTION = true;

    // Expiration timer (1 Hour for Banner/Int/Rew)
    private static readonly EXPIRATION_MS = 3600000; 

    // Ad State tracking
    private static lastInterstitialLoadTime = 0;
    private static lastRewardedLoadTime = 0;
    private static lastInterstitialTime = 0;
    private static appStartTime = Date.now();
    private static saveActionCounter = 0;
    private static readonly AD_COOLDOWN_MS = 90000; // 1.5 Dakika (Gelir için ideal)
    private static readonly APP_START_DELAY_MS = 30000; // İlk 30 saniye geçiş reklamı yok (Play Store kuralı)
    private static readonly SAVE_ACTION_CAP = 2;

    static async initialize(): Promise<void> {
        if (this.initialised) return;

        try {
            await AdMob.trackingAuthorizationStatus();
            const options: AdMobInitializationOptions = { initializeForTesting: false };
            await AdMob.initialize(options);
            this.initialised = true;
            this.prefetchAds();
        } catch (error) {
            console.warn('AdMob Initialization failed:', error);
        }
    }

    private static async prefetchAds() {
        await Promise.allSettled([
            this.prepareInterstitial(),
            this.prepareRewardVideo()
        ]);
    }

    private static isAdValid(lastLoadTime: number): boolean {
        if (lastLoadTime === 0) return false;
        return (Date.now() - lastLoadTime) < this.EXPIRATION_MS;
    }

    static async showBanner(): Promise<void> {
        if (!this.initialised) await this.initialize();

        const options: BannerAdOptions = {
            adId: this.BANNER_ID,
            adSize: BannerAdSize.ADAPTIVE_BANNER,
            position: BannerAdPosition.BOTTOM_CENTER,
            margin: 0,
            isTesting: !this.IS_PRODUCTION
        };

        try {
            await AdMob.showBanner(options);
        } catch (error) {
            console.error('Show Banner failed:', error);
        }
    }

    static async hideBanner(): Promise<void> {
        try {
            await AdMob.hideBanner();
        } catch {}
    }

    static async removeBanner(): Promise<void> {
        try {
            await AdMob.removeBanner();
        } catch {}
    }

    static async prepareInterstitial(): Promise<void> {
        if (this.isAdValid(this.lastInterstitialLoadTime)) return;

        const options: AdOptions = {
            adId: this.INTERSTITIAL_ID,
            isTesting: !this.IS_PRODUCTION
        };

        try {
            await AdMob.prepareInterstitial(options);
            this.lastInterstitialLoadTime = Date.now();
        } catch (error) {
            console.warn('Prepare Interstitial failed:', error);
            this.lastInterstitialLoadTime = 0;
        }
    }

    static async showInterstitial(): Promise<void> {
        if (!this.initialised) await this.initialize();

        if (!this.isAdValid(this.lastInterstitialLoadTime)) {
            await this.prepareInterstitial();
        }

        try {
            await AdMob.showInterstitial();
            this.lastInterstitialLoadTime = 0; 
            this.prepareInterstitial();
        } catch (error) {
            console.error('Show Interstitial failed:', error);
            this.prepareInterstitial();
        }
    }

    static async trackPageViewAndShowInterstitial(): Promise<void> {
        const now = Date.now();
        // Hem Cooldown hem de Uygulama Başı Gecikmesi kontrolü
        if (now - this.lastInterstitialTime > this.AD_COOLDOWN_MS && 
            now - this.appStartTime > this.APP_START_DELAY_MS) {
            await this.showInterstitial();
            this.lastInterstitialTime = Date.now();
        }
    }

    static async trackSaveAndShowInterstitial(): Promise<void> {
        this.saveActionCounter++;
        if (this.saveActionCounter % this.SAVE_ACTION_CAP === 0) {
            await this.showInterstitial();
            this.lastInterstitialTime = Date.now();
        }
    }

    static async prepareRewardVideo(): Promise<void> {
        if (this.isAdValid(this.lastRewardedLoadTime)) return;

        const options: RewardAdOptions = {
            adId: this.REWARDED_ID,
            isTesting: !this.IS_PRODUCTION
        };

        try {
            await AdMob.prepareRewardVideoAd(options);
            this.lastRewardedLoadTime = Date.now();
        } catch (error) {
            console.warn('Prepare Reward failed:', error);
            this.lastRewardedLoadTime = 0;
        }
    }

    static async showRewardVideo(): Promise<AdMobRewardItem | undefined> {
        if (!this.initialised) await this.initialize();

        if (!this.isAdValid(this.lastRewardedLoadTime)) {
            await this.prepareRewardVideo();
        }

        try {
            const reward = await AdMob.showRewardVideoAd();
            this.lastRewardedLoadTime = 0; 
            this.prepareRewardVideo(); 
            return reward;
        } catch (error) {
            console.error('Show Reward failed:', error);
            this.prepareRewardVideo();
            return undefined;
        }
    }
}
