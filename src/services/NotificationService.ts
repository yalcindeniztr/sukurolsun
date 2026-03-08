import { LocalNotifications } from '@capacitor/local-notifications';
import { storageService } from './storage.service';

const DAILY_VERSES = [
    "Allah sabredenlerle beraberdir. (Bakara, 153)",
    "Bilin ki kalpler ancak Allah'ı anmakla huzur bulur. (Rad, 28)",
    "Rabbiniz: 'Bana dua edin, size cevap vereyim' buyurdu. (Mümin, 60)",
    "Şüphesiz her zorlukla beraber bir kolaylık vardır. (İnşirah, 5-6)",
    "Allah bize yeter, O ne güzel vekildir. (Ali İmran, 173)",
    "Eğer şükrederseniz, elbette size nimetimi artırırım. (İbrahim, 7)",
    "Allah'ın rahmetinden ümit kesmeyin. (Zümer, 53)",
    "Bizi doğru yola ilet. (Fatiha, 6)",
    "Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver. (Bakara, 201)",
    "Kim Allah'a dayanırsa O, ona yeter. (Talak, 3)"
];

class NotificationService {
    async requestPermissions() {
        const { display } = await LocalNotifications.requestPermissions();
        return display === 'granted';
    }

    async scheduleDailyNotification() {
        // İzin kontrolü
        const permissions = await LocalNotifications.checkPermissions();
        if (permissions.display !== 'granted') return;

        // Ayarlardan bildirim açık mı kontrol et
        const profile = await storageService.getProfile();
        if (!profile || profile.notificationsEnabled === false) return; // Varsayılanı true varsaymış olabiliriz. 

        // Mevcut bildirimleri temizle (Çiftleşmeyi önlemek için)
        await LocalNotifications.cancel({ notifications: [{ id: 1 }] });

        // Rastgele bir ayet seç
        const randomVerse = DAILY_VERSES[Math.floor(Math.random() * DAILY_VERSES.length)];

        // Her gün belirlenen bir saatte (Örn: Sabah 09:00) kur.
        // Tarih objesini yarına saat 09:00'a ayarlayalım:
        const scheduleDate = new Date();
        scheduleDate.setHours(9, 0, 0, 0);

        // Eğer şu an saat 09:00'ı geçtiyse bir sonraki güne ayarla
        if (scheduleDate.getTime() < new Date().getTime()) {
            scheduleDate.setDate(scheduleDate.getDate() + 1);
        }

        await LocalNotifications.schedule({
            notifications: [
                {
                    title: 'Günün Ayeti',
                    body: randomVerse,
                    id: 1, // Sabit ID, her gün bir tane olması için
                    schedule: {
                        repeats: true, // Her gün tekrar etmesini istersen
                        every: 'day', // Kapasitör 4+'de bu "day", "week" vb.
                        on: {
                            hour: 9,
                            minute: 0
                        }
                    },
                    sound: undefined,
                    smallIcon: 'ic_stat_name', // Android res dizinindeki küçük ikon ismidir. Varsa kullanılır.
                }
            ]
        });
    }

    async toggleNotifications(enabled: boolean) {
        if (enabled) {
            const hasPermission = await this.requestPermissions();
            if (hasPermission) {
                await this.scheduleDailyNotification();
            }
        } else {
            // İzin kapalıysa tüm bildirimleri iptal et.
            await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
        }
    }
}

export const notificationService = new NotificationService();
