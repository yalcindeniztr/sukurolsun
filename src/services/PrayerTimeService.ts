import axios from 'axios';
import { Geolocation } from '@capacitor/geolocation';

export interface PrayerTimesData {
    imsak: string;
    gunes: string;
    ogle: string;
    ikindi: string;
    aksam: string;
    yatsi: string;
    date: string;
    city: string;
    country: string;
}

const TURKEY_CITY_COORDINATES: Record<string, { lat: number, lon: number }> = {
    "Adana": { lat: 37.0, lon: 35.3213 }, "Adıyaman": { lat: 37.7648, lon: 38.2786 }, "Afyonkarahisar": { lat: 38.7507, lon: 30.5567 }, "Ağrı": { lat: 39.7191, lon: 43.0503 }, "Amasya": { lat: 40.6499, lon: 35.8353 }, "Ankara": { lat: 39.9334, lon: 32.8597 }, "Antalya": { lat: 36.8841, lon: 30.7056 }, "Artvin": { lat: 41.1828, lon: 41.8183 }, "Aydın": { lat: 37.856, lon: 27.8416 }, "Balıkesir": { lat: 39.6484, lon: 27.8826 },
    "Bilecik": { lat: 40.1451, lon: 29.9799 }, "Bingöl": { lat: 38.8847, lon: 40.4939 }, "Bitlis": { lat: 38.3938, lon: 42.1232 }, "Bolu": { lat: 40.735, lon: 31.6061 }, "Burdur": { lat: 37.7203, lon: 30.2908 }, "Bursa": { lat: 40.1885, lon: 29.061 }, "Çanakkale": { lat: 40.1553, lon: 26.4142 }, "Çankırı": { lat: 40.6013, lon: 33.6134 }, "Çorum": { lat: 40.5506, lon: 34.9556 }, "Denizli": { lat: 37.7765, lon: 29.0864 },
    "Diyarbakır": { lat: 37.9144, lon: 40.211 }, "Edirne": { lat: 41.6818, lon: 26.5623 }, "Elazığ": { lat: 38.681, lon: 39.2264 }, "Erzincan": { lat: 39.75, lon: 39.5 }, "Erzurum": { lat: 39.9055, lon: 41.2658 }, "Eskişehir": { lat: 39.7767, lon: 30.5206 }, "Gaziantep": { lat: 37.0662, lon: 37.3833 }, "Giresun": { lat: 40.9128, lon: 38.3895 }, "Gümüşhane": { lat: 40.4608, lon: 39.4814 }, "Hakkari": { lat: 37.5833, lon: 43.7333 },
    "Hatay": { lat: 36.4018, lon: 36.3498 }, "Isparta": { lat: 37.7648, lon: 30.5566 }, "Mersin": { lat: 36.8, lon: 34.6333 }, "İstanbul": { lat: 41.0082, lon: 28.9784 }, "İzmir": { lat: 38.4189, lon: 27.1287 }, "Kars": { lat: 40.6167, lon: 43.1 }, "Kastamonu": { lat: 41.3887, lon: 33.7827 }, "Kayseri": { lat: 38.7312, lon: 35.4787 }, "Kırklareli": { lat: 41.7333, lon: 27.2167 }, "Kırşehir": { lat: 39.1425, lon: 34.1709 },
    "Kocaeli": { lat: 40.8533, lon: 29.8815 }, "Konya": { lat: 37.8714, lon: 32.4846 }, "Kütahya": { lat: 39.4167, lon: 29.9833 }, "Malatya": { lat: 38.3552, lon: 38.3093 }, "Manisa": { lat: 38.6191, lon: 27.4289 }, "Kahramanmaraş": { lat: 37.5858, lon: 36.9371 }, "Mardin": { lat: 37.3212, lon: 40.7245 }, "Muğla": { lat: 37.2153, lon: 28.3636 }, "Muş": { lat: 38.7438, lon: 41.5064 }, "Nevşehir": { lat: 38.6244, lon: 34.7144 },
    "Niğde": { lat: 37.9667, lon: 34.6833 }, "Ordu": { lat: 40.9839, lon: 37.8764 }, "Rize": { lat: 41.0201, lon: 40.5234 }, "Sakarya": { lat: 40.7569, lon: 30.3789 }, "Samsun": { lat: 41.2867, lon: 36.33 }, "Siirt": { lat: 37.9333, lon: 41.95 }, "Sinop": { lat: 42.0231, lon: 35.1531 }, "Sivas": { lat: 39.7477, lon: 37.0179 }, "Tekirdağ": { lat: 40.9833, lon: 27.5167 }, "Tokat": { lat: 40.3167, lon: 36.55 },
    "Trabzon": { lat: 41.0027, lon: 39.7168 }, "Tunceli": { lat: 39.1079, lon: 39.5401 }, "Şanlıurfa": { lat: 37.1591, lon: 38.7969 }, "Uşak": { lat: 38.6823, lon: 29.4082 }, "Van": { lat: 38.4891, lon: 43.3833 }, "Yozgat": { lat: 39.8181, lon: 34.8147 }, "Zonguldak": { lat: 41.4506, lon: 31.7908 }, "Aksaray": { lat: 38.3687, lon: 34.0297 }, "Bayburt": { lat: 40.2552, lon: 40.2249 }, "Karaman": { lat: 37.1759, lon: 33.2214 },
    "Kırıkkale": { lat: 39.8468, lon: 33.5153 }, "Batman": { lat: 37.8812, lon: 41.1351 }, "Şırnak": { lat: 37.5164, lon: 42.4611 }, "Bartın": { lat: 41.6376, lon: 32.3338 }, "Ardahan": { lat: 41.1087, lon: 42.7022 }, "Iğdır": { lat: 39.9167, lon: 44.0333 }, "Yalova": { lat: 40.6551, lon: 29.2769 }, "Karabük": { lat: 41.1992, lon: 32.6264 }, "Kilis": { lat: 36.7184, lon: 37.1212 }, "Osmaniye": { lat: 37.0741, lon: 36.2471 }, "Düzce": { lat: 40.8438, lon: 31.1565 }
};

export class PrayerTimeService {
    private static API_URL = 'https://api.aladhan.com/v1/timings';

    private static findClosestCity(lat: number, lon: number): string {
        let closestCity = "İstanbul";
        let minDistance = Infinity;

        for (const [city, coords] of Object.entries(TURKEY_CITY_COORDINATES)) {
            const d = Math.sqrt(Math.pow(lat - coords.lat, 2) + Math.pow(lon - coords.lon, 2));
            if (d < minDistance) {
                minDistance = d;
                closestCity = city;
            }
        }
        return closestCity;
    }

    /**
     * Konum bazlı namaz vakitlerini getirir
     * @returns PrayerTimesData veya hata fırlatır
     */
    static async getTimesByLocation(): Promise<PrayerTimesData> {
        try {
            // Önce izni kontrol et
            let permStart = await Geolocation.checkPermissions();
            if (permStart.location !== 'granted') {
                permStart = await Geolocation.requestPermissions();
                if (permStart.location !== 'granted') {
                    throw new Error('Konum izni verilmedi. Lütfen şehir seçiniz.');
                }
            }

            const position = await Geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 20000
            });

            const { latitude, longitude } = position.coords;
            const cityName = this.findClosestCity(latitude, longitude);

            // Diyanet metodunu (Method 13 - Turkey) kullanarak fetch et
            const params = {
                latitude,
                longitude,
                method: 13,
            };

            const response = await axios.get(this.API_URL, { params });
            const timings = response.data.data.timings;

            // Aladhan API, Diyanet saatleriyle (DIB) uyumlu çıktı üretmek için Method 13'ü destekler
            return {
                imsak: timings.Imsak,
                gunes: timings.Sunrise,
                ogle: timings.Dhuhr,
                ikindi: timings.Asr,
                aksam: timings.Maghrib,
                yatsi: timings.Isha,
                date: response.data.data.date.readable,
                city: cityName,
                country: 'Türkiye',
            };
        } catch (error) {
            console.error('Konum alınırken hata:', error);
            throw error;
        }
    }

    /**
     * Manuel şehir bazlı namaz vakitlerini getirir (Aladhan API byCity)
     */
    static async getTimesByCity(city: string, country: string = 'Turkey'): Promise<PrayerTimesData> {
        try {
            const response = await axios.get(`${this.API_URL}ByCity`, {
                params: {
                    city,
                    country,
                    method: 13
                }
            });

            const timings = response.data.data.timings;
            return {
                imsak: timings.Imsak,
                gunes: timings.Sunrise,
                ogle: timings.Dhuhr,
                ikindi: timings.Asr,
                aksam: timings.Maghrib,
                yatsi: timings.Isha,
                date: response.data.data.date.readable,
                city: city,
                country: country,
            };
        } catch (error) {
            console.error('Şehir verisi alınırken hata:', error);
            throw error;
        }
    }

    /**
     * Aylık namaz vakitleri getirir (Aladhan API calendarByCity)
     */
    static async getMonthlyTimes(city: string, month: number, year: number, country: string = 'Turkey'): Promise<PrayerTimesData[]> {
        try {
            // calendarByCity endpoint'i kullanılır
            const response = await axios.get(`https://api.aladhan.com/v1/calendarByCity/${year}/${month}`, {
                params: {
                    city,
                    country,
                    method: 13
                }
            });

            const data = response.data.data;
            return data.map((day: any) => ({
                imsak: day.timings.Imsak,
                gunes: day.timings.Sunrise,
                ogle: day.timings.Dhuhr,
                ikindi: day.timings.Asr,
                aksam: day.timings.Maghrib,
                yatsi: day.timings.Isha,
                date: day.date.readable,
                city: city,
                country: country,
            }));
        } catch (error) {
            console.error('Aylık verisi alınırken hata:', error);
            throw error;
        }
    }
}
