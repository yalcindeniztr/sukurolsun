import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Sunrise, Sun, Sunset, Moon, Activity, Bell, Save } from 'lucide-react';
import { useTheme } from '../../core/ThemeContext';
import { PrayerTimeService, PrayerTimesData } from '../../services/PrayerTimeService';
import { Preferences } from '@capacitor/preferences';
import { NotificationService } from '../../services/NotificationService';
import { UserProfile } from '../../core/types';

const TURKEY_CITIES = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
    "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
    "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
    "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
    "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
    "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
    "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
    "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
];

interface PrayerTimesViewProps {
    profile: UserProfile | null;
}

const PrayerTimesView: React.FC<PrayerTimesViewProps> = ({ profile }) => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [times, setTimes] = useState<PrayerTimesData | null>(null);
    const [selectedCity, setSelectedCity] = useState('İstanbul');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [reminderSettings, setReminderSettings] = useState<Record<string, boolean>>({
        imsak: false,
        gunes: false,
        ogle: false,
        ikindi: false,
        aksam: false,
        yatsi: false,
    });

    // Kaydedilmiş ayarları yükle (Preferences)
    useEffect(() => {
        const loadSettings = async () => {
            setLoading(true);
            try {
                const { value: city } = await Preferences.get({ key: 'prayer_city' });
                const { value: district } = await Preferences.get({ key: 'prayer_district' });
                const { value: reminders } = await Preferences.get({ key: 'prayer_reminders' });
                
                if (city) {
                    setSelectedCity(city);
                    await fetchByCity(city, false); // false: already set selectedCity
                } else {
                    await fetchByCity('İstanbul', true);
                }
                
                if (district) {
                    setSelectedDistrict(district);
                }
                
                if (reminders) {
                    try {
                        setReminderSettings(JSON.parse(reminders));
                    } catch (e) {
                        console.error("Hatırlatıcı ayarları okunamadı:", e);
                    }
                }
            } catch (err) {
                console.error("Ayarlar yüklenirken hata:", err);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
        NotificationService.requestPermissions();
    }, []);

    const fetchByLocation = async () => {
        if (profile && profile.locationEnabled === false) {
            alert("Konum izniniz Profil / Ayarlar sekmesinden kapatılmıştır.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await PrayerTimeService.getTimesByLocation();
            setTimes(data);
            
            if (data.city) {
                await Preferences.set({ key: 'prayer_city', value: data.city });
                setSelectedCity(data.city);
            }
        } catch (err: any) {
            setError(err.message || 'Konum hatası.');
        } finally {
            setLoading(false);
        }
    };

    const fetchByCity = async (city: string, updateState = true) => {
        setLoading(true);
        setError(null);
        if (updateState) setSelectedCity(city);
        try {
            await Preferences.set({ key: 'prayer_city', value: city });
            const data = await PrayerTimeService.getTimesByCity(city);
            setTimes(data);
        } catch (err: any) {
            setError(err.message || 'Vakitler alınamadı.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveLocation = async () => {
        await Preferences.set({ key: 'prayer_city', value: selectedCity });
        if (selectedDistrict) {
            await Preferences.set({ key: 'prayer_district', value: selectedDistrict });
        }
        alert('Konum ve Şehir başarıyla kaydedildi!');
        fetchByCity(selectedCity);
    };

    const getPrayerId = (prayer: string) => {
        const ids: Record<string, number> = { imsak: 100, gunes: 200, ogle: 300, ikindi: 400, aksam: 500, yatsi: 600 };
        return ids[prayer] || 700;
    };

    const toggleReminder = async (prayer: string) => {
        const newState = !reminderSettings[prayer as keyof typeof reminderSettings];
        const newSettings = { ...reminderSettings, [prayer]: newState };
        setReminderSettings(newSettings);
        await Preferences.set({ key: 'prayer_reminders', value: JSON.stringify(newSettings) });
        
        const prayerId = getPrayerId(prayer);

        if (newState && times) {
            const prayerTime = (times as any)[prayer];
            const prayerLabel = prayer.charAt(0).toUpperCase() + prayer.slice(1);
            
            // Bildirim izni kontrolü
            const hasPermission = await NotificationService.requestPermissions();
            if (!hasPermission) {
                alert("Bildirim izni verilmediği için hatırlatıcı kurulamadı. Lütfen ayarlardan izin verin.");
                return;
            }

            // Önümüzdeki 7 gün için planla ki bildirimler kesilmesin
            for (let i = 0; i < 7; i++) {
                await NotificationService.schedulePrayerReminder(
                    prayerId,
                    `Ezan Vakti Yaklaşıyor: ${prayerLabel}`,
                    `${prayerLabel} vaktine 5 dakika kaldı. Hazırlanmaya ne dersiniz?`,
                    prayerTime,
                    i
                );
            }
        } else {
            // 7 günlük tüm bildirimleri iptal et
            for (let i = 0; i < 7; i++) {
                await NotificationService.cancelNotification(prayerId + i);
            }
        }
    };

    const TimeCard = ({ title, time, icon: Icon, reminderEnabled, onToggleReminder }: any) => (
        <div className={`p-4 rounded-3xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 relative
            ${reminderEnabled
                ? (theme === 'light' ? 'bg-rose-50 border-rose-100 shadow-depth-light' : 'bg-rose-500/10 border-rose-500/20')
                : (theme === 'light' ? 'bg-white border-slate-100 shadow-sm' : 'bg-white/[0.03] border-white/5')}
        `}>
            {/* Reminder Toggle (Kırmızı Switch - Çok Belirgin) */}
            <button
                onClick={onToggleReminder}
                className={`absolute -top-1 -right-1 w-12 h-7 rounded-full transition-all duration-300 flex items-center px-1 border-2 z-10
                    ${reminderEnabled
                        ? 'bg-red-500 border-red-400 shadow-lg shadow-red-500/40'
                        : 'bg-slate-300 border-slate-400 dark:bg-white/20 dark:border-white/30'}`}
                title="5 Dakika Önce Hatırlat"
            >
                <div className={`w-4 h-4 rounded-full transition-all duration-300 shadow-md
                    ${reminderEnabled ? 'bg-white translate-x-5' : 'bg-slate-100 translate-x-0'}`} />
            </button>

            <Icon className={`w-7 h-7 mb-1 ${reminderEnabled ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`} />
            
            <div className="text-center">
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1
                    ${reminderEnabled ? 'text-red-700 dark:text-red-300' : 'text-slate-500'}
                `}>{title}</p>
                <p className={`text-2xl font-black transition-colors
                    ${reminderEnabled 
                        ? (theme === 'light' ? 'text-red-900' : 'text-white')
                        : (theme === 'light' ? 'text-slate-800' : 'text-slate-200')}
                `}>{time || '--:--'}</p>
            </div>
            
            {reminderEnabled && (
                <div className="flex items-center gap-1 text-[9px] font-black text-red-600 dark:text-red-400 animate-pulse bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full border border-red-100 dark:border-red-500/20">
                    <Bell className="w-2.5 h-2.5" />
                    <span>HATIRLATMA AKTİF</span>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6 pb-20 animate-fadeIn">
            {/* Şehir Seçimi & Konum */}
            <div className={`p-6 rounded-[2.5rem] border backdrop-blur-xl transition-all duration-500
                ${theme === 'light' ? 'bg-white/70 border-white shadow-xl shadow-slate-200/50' : 'bg-white/[0.02] border-white/10 shadow-2xl shadow-black/20'}
            `}>
                <div className="flex flex-col md:flex-row md:items-end gap-6">
                    <div className="flex-1 space-y-3">
                        <label className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-1
                            ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}
                        `}>
                            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                            Şehir
                        </label>
                        <select
                            title="Şehir Seçin"
                            aria-label="Şehir Seçin"
                            value={selectedCity}
                            onChange={(e) => fetchByCity(e.target.value)}
                            className={`w-full px-4 py-4 rounded-2xl border bg-transparent text-sm font-bold appearance-none transition-all outline-none
                                ${theme === 'light' ? 'border-slate-200 focus:border-emerald-500 focus:bg-white text-slate-800' : 'border-white/10 focus:border-emerald-500 focus:bg-white/5 text-white'}
                            `}
                        >
                            {TURKEY_CITIES.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={fetchByLocation}
                            disabled={loading}
                            title="Konumumu Bul"
                            className={`p-4 rounded-2xl border flex items-center justify-center transition-all active:scale-95
                                ${theme === 'light' ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'}
                            `}
                        >
                            <Navigation className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={handleSaveLocation}
                            disabled={loading}
                            className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-emerald-500/20
                                bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600
                            `}
                        >
                            <Save className="w-5 h-5" />
                            Kaydet
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold text-center">
                        {error}
                    </div>
                )}
            </div>

            {/* Vakit Tablosu */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <TimeCard
                    title="İmsak"
                    time={times?.imsak}
                    icon={Clock}
                    reminderEnabled={reminderSettings.imsak}
                    onToggleReminder={() => toggleReminder('imsak')}
                />
                <TimeCard
                    title="Güneş"
                    time={times?.gunes}
                    icon={Sunrise}
                    reminderEnabled={reminderSettings.gunes}
                    onToggleReminder={() => toggleReminder('gunes')}
                />
                <TimeCard
                    title="Öğle"
                    time={times?.ogle}
                    icon={Sun}
                    reminderEnabled={reminderSettings.ogle}
                    onToggleReminder={() => toggleReminder('ogle')}
                />
                <TimeCard
                    title="İkindi"
                    time={times?.ikindi}
                    icon={Activity}
                    reminderEnabled={reminderSettings.ikindi}
                    onToggleReminder={() => toggleReminder('ikindi')}
                />
                <TimeCard
                    title="Akşam"
                    time={times?.aksam}
                    icon={Sunset}
                    reminderEnabled={reminderSettings.aksam}
                    onToggleReminder={() => toggleReminder('aksam')}
                />
                <TimeCard
                    title="Yatsı"
                    time={times?.yatsi}
                    icon={Moon}
                    reminderEnabled={reminderSettings.yatsi}
                    onToggleReminder={() => toggleReminder('yatsi')}
                />
            </div>

            {/* Bilgi Notu */}
            <div className={`p-6 rounded-[2rem] border transition-all
                ${theme === 'light' ? 'bg-amber-50/50 border-amber-100' : 'bg-amber-500/5 border-amber-500/10'}
            `}>
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <Bell className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                        <p className={`text-sm font-black mb-1 ${theme === 'light' ? 'text-amber-900' : 'text-amber-200'}`}>
                            Hatırlatıcılar Hakkında
                        </p>
                        <p className={`text-xs font-bold leading-relaxed opacity-70 ${theme === 'light' ? 'text-amber-800' : 'text-amber-100'}`}>
                            Vakit kartlarının sağ üstündeki kutucuğa tıklayarak hatırlatıcıyı açabilirsiniz. Açık olan vakitler için ezandan tam 5 dakika önce bildirim alırsınız.
                        </p>
                    </div>
                </div>
            </div>
            
            {times && (
                <p className="text-[10px] text-center opacity-50 font-bold uppercase tracking-widest">
                    {times.city} - {times.date}
                </p>
            )}
        </div>
    );
};

export default PrayerTimesView;
