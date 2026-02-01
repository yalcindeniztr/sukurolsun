import { AdMob, AdMobInitializationOptions, BannerAdOptions, BannerAdSize, BannerAdPosition, AdOptions, RewardAdOptions, AdMobRewardItem } from '@capacitor-community/admob';

export class AdMobService {
    private static initialised = false;

    // Environment variables for AdMob IDs
    private static readonly BANNER_ID = import.meta.env.VITE_ADMOB_BANNER_ID || 'ca-app-pub-3940256099942544/6300978111';
    private static readonly INTERSTITIAL_ID = import.meta.env.VITE_ADMOB_INTERSTITIAL_ID || 'ca-app-pub-3940256099942544/1033173712';
    private static readonly REWARDED_ID = import.meta.env.VITE_ADMOB_REWARDED_ID || 'ca-app-pub-3940256099942544/5224354917';

    static async initialize(): Promise<void> {
        if (this.initialised) return;

        try {
            await AdMob.trackingAuthorizationStatus();

            const options: AdMobInitializationOptions = {
                testingDevices: ['2077ef9a63d2b398840261c8221a0c9b'], // Optional: Add your device ID for testing
                initializeForTesting: true,
            };

            await AdMob.initialize(options);
            this.initialised = true;
            console.log('AdMob initialized successfully');
        } catch (error) {
            console.error('AdMob initialization failed:', error);
        }
    }

    static async showBanner(): Promise<void> {
        // Ensure initialization
        if (!this.initialised) {
            await this.initialize();
        }

        const options: BannerAdOptions = {
            adId: this.BANNER_ID,
            adSize: BannerAdSize.ADAPTIVE_BANNER,
            position: BannerAdPosition.BOTTOM_CENTER,
            margin: 0,
            isTesting: import.meta.env.VITE_APP_MODE !== 'production'
        };

        try {
            await AdMob.showBanner(options);
        } catch (error) {
            console.error('Failed to show banner:', error);
        }
    }

    static async hideBanner(): Promise<void> {
        try {
            await AdMob.hideBanner();
        } catch (error) {
            console.error('Failed to hide banner:', error);
        }
    }

    static async removeBanner(): Promise<void> {
        try {
            await AdMob.removeBanner();
        } catch (error) {
            console.error('Failed to remove banner:', error);
        }
    }

    static async prepareInterstitial(): Promise<void> {
        const options: AdOptions = {
            adId: this.INTERSTITIAL_ID,
            isTesting: import.meta.env.VITE_APP_MODE !== 'production'
        };

        try {
            await AdMob.prepareInterstitial(options);
        } catch (error) {
            console.error('Failed to prepare interstitial:', error);
        }
    }

    private static interstitialCounter = 0;
    private static readonly FREQUENCY_CAP = 3; // Show ad every 3rd action

    static async showInterstitial(): Promise<void> {
        // Increment counter
        this.interstitialCounter++;
        console.log(`AdMob Action Counter: ${this.interstitialCounter}`);

        // Only show if counter meets frequency cap
        if (this.interstitialCounter % this.FREQUENCY_CAP !== 0) {
            console.log('AdMob skipped due to frequency cap.');
            return;
        }

        try {
            await AdMob.showInterstitial();
        } catch (error) {
            console.error('Failed to show interstitial:', error);
        }
    }

    static async prepareRewardVideo(): Promise<void> {
        const options: RewardAdOptions = {
            adId: this.REWARDED_ID,
            isTesting: import.meta.env.VITE_APP_MODE !== 'production'
        };

        try {
            await AdMob.prepareRewardVideoAd(options);
        } catch (error) {
            console.error('Failed to prepare reward video:', error);
        }
    }

    static async showRewardVideo(): Promise<AdMobRewardItem | undefined> {
        try {
            const reward = await AdMob.showRewardVideoAd();
            return reward;
        } catch (error) {
            console.error('Failed to show reward video:', error);
            return undefined;
        }
    }
}
