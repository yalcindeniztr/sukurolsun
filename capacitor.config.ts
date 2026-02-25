import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.yalcin.sukurolsun',
    appName: 'Şükür Olsun',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    },
    plugins: {
        // Splash screen ayarları
        SplashScreen: {
            launchAutoHide: true,
            androidSplashResourceName: 'splash',
            showSpinner: false,
        },
    }
};

export default config;
