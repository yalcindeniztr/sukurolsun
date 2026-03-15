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

export class PrayerTimeService {
    private static API_URL = 'https://api.aladhan.com/v1/timings';

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
                enableHighAccuracy: false,
                timeout: 10000
            });

            const { latitude, longitude } = position.coords;

            // Diyanet metodunu (Method 13 - Turkey) kullanarak fetch et
            const params = {
                latitude,
                longitude,
                method: 13,
            };

            const response = await axios.get(this.API_URL, { params });
            const timings = response.data.data.timings;
            const meta = response.data.data.meta;

            // Aladhan API, Diyanet saatleriyle (DIB) uyumlu çıktı üretmek için Method 13'ü destekler
            return {
                imsak: timings.Imsak,
                gunes: timings.Sunrise,
                ogle: timings.Dhuhr,
                ikindi: timings.Asr,
                aksam: timings.Maghrib,
                yatsi: timings.Isha,
                date: response.data.data.date.readable,
                city: meta.timezone, // Timezone format (örn: Europe/Istanbul)
                country: 'Konum',
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
}
