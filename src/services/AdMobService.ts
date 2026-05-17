import { AdMob, AdMobInitializationOptions, BannerAdOptions, BannerAdSize, BannerAdPosition, AdOptions, RewardAdOptions, AdMobRewardItem } from '@capacitor-community/admob';

export class AdMobService {
    private static initialised = false;

    // Ad IDs
    private static readonly BANNER_ID = import.meta.env.VITE_ADMOB_BANNER_ID || 'ca-app-pub-2742233269558530/5920257382';
    private static readonly INTERSTITIAL_ID = import.meta.env.VITE_ADMOB_INTERSTITIAL_ID || 'ca-app-pub-2742233269558530/2520068427';
    private static readonly REWARDED_ID = import.meta.env.VITE_ADMOB_REWARDED_ID || '';

    // Production settings
    private static readonly IS_PRODUCTION = true;

    // Expiration timer (1 Hour for Banner/Int/Rew)
    private static readonly EXPIRATION_MS = 3600000; 

    // Ad State tracking
    private static lastInterstitialLoadTime = 0;
    private static lastRewardedLoadTime = 0;
    private static saveActionCounter = 0;
    private static navigationCounter = 0;
    private static readonly SAVE_ACTION_CAP = 1;
    private static readonly NAVIGATION_ACTION_CAP = 10;

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

    static async showInterstitial(): Promise<boolean> {
        if (!this.initialised) await this.initialize();

        if (!this.isAdValid(this.lastInterstitialLoadTime)) {
            await this.prepareInterstitial();
        }

        try {
            await AdMob.showInterstitial();
            this.lastInterstitialLoadTime = 0; 
            this.prepareInterstitial();
            return true;
        } catch (error) {
            console.error('Show Interstitial failed:', error);
            this.prepareInterstitial();
            return false;
        }
    }

    static async trackPageViewAndShowInterstitial(): Promise<void> {
        // Sekme ve form geçişlerinde geçiş reklamı göstermiyoruz.
        await this.prepareInterstitial();
    }

    static async trackSaveAndShowInterstitial(): Promise<boolean> {
        this.saveActionCounter++;
        return this.showInterstitialForAction('journal_save', this.saveActionCounter % this.SAVE_ACTION_CAP === 0);
    }

    static async showInterstitialForAction(actionName: string, shouldShow = true): Promise<boolean> {
        if (!shouldShow) {
            await this.prepareInterstitial();
            return false;
        }

        try {
            const shown = await this.showInterstitial();
            if (!shown) return false;
            console.info(`Interstitial shown for ${actionName}`);
            return true;
        } catch (error) {
            console.warn(`Interstitial action failed for ${actionName}:`, error);
            await this.prepareInterstitial();
            return false;
        }
    }

    static async trackNavigationAndShowInterstitial(): Promise<boolean> {
        this.navigationCounter++;
        if (this.navigationCounter < this.NAVIGATION_ACTION_CAP) {
            await this.prepareInterstitial();
            return false;
        }

        this.navigationCounter = 0;
        return this.showInterstitialForAction('navigation_10th');
    }

    static async prepareRewardVideo(): Promise<void> {
        if (!this.REWARDED_ID) return;
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
        if (!this.REWARDED_ID) return undefined;
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
