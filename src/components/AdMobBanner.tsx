import { useEffect } from 'react';
import { AdMobService } from '../services/AdMobService';

export const AdMobBanner: React.FC = () => {
    useEffect(() => {
        // Component mount olduğunda reklamı göster
        const showAd = async () => {
            await AdMobService.showBanner();
        };

        showAd();

        // Component unmount olduğunda (veya sayfa değiştiğinde) reklamı temizle
        // NOT: Eğer reklamın sürekli kalmasını istiyorsanız return içindeki removeBanner'ı kaldırabilirsiniz.
        // Ancak SPA (Single Page App) mantığında route değişimlerinde temizlenip tekrar yüklenmesi 
        // bazen daha sağlıklıdır veya sayfa özelinde kontrol sağlar.
        return () => {
            AdMobService.removeBanner();
        };
    }, []);

    // Bu bileşen görsel bir şey render etmez, sadece native banner'ı tetikler.
    return null;
};
