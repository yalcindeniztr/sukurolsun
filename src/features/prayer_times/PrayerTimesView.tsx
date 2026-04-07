import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Sunrise, Sun, Sunset, Moon, Activity, Bell } from 'lucide-react';
import { useTheme } from '../../core/ThemeContext';
import { useLanguage } from '../../core/LanguageContext';
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
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [times, setTimes] = useState<PrayerTimesData | null>(null);
    const [selectedCity, setSelectedCity] = useState('İstanbul');
    const [nextPrayer, setNextPrayer] = useState<string | null>(null);
    const [reminderSettings, setReminderSettings] = useState<Record<string, boolean>>({
        imsak: false,
        gunes: false,
        ogle: false,
        ikindi: false,
        aksam: false,
        yatsi: false,
    });

    // Sıradaki vakti hesapla
    useEffect(() => {
        if (!times) return;

        const checkNextPrayer = () => {
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();

            const parseTime = (t: string) => {
                const [h, m] = t.split(':').map(Number);
                return h * 60 + m;
            };

            const prayerOrder = ['imsak', 'gunes', 'ogle', 'ikindi', 'aksam', 'yatsi'];
            let found = false;

            for (const p of prayerOrder) {
                const pTime = parseTime((times as any)[p]);
                if (pTime > currentTime) {
                    setNextPrayer(p);
                    found = true;
                    break;
                }
            }

            if (!found) setNextPrayer('imsak'); // Ertesi günün imsakı
        };

        checkNextPrayer();
        const interval = setInterval(checkNextPrayer, 60000);
        return () => clearInterval(interval);
    }, [times]);

    // Kaydedilmiş ayarları yükle (Preferences)
    useEffect(() => {
        const loadSettings = async () => {
            setLoading(true);
            try {
                const { value: city } = await Preferences.get({ key: 'prayer_city' });
                const { value: reminders } = await Preferences.get({ key: 'prayer_reminders' });
                
                if (city) {
                    setSelectedCity(city);
                    await fetchByCity(city, false);
                } else {
                    await fetchByCity('İstanbul', true);
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
        try {
            const data = await PrayerTimeService.getTimesByLocation();
            setTimes(data);
            
            if (data.city) {
                await Preferences.set({ key: 'prayer_city', value: data.city });
                setSelectedCity(data.city);
            }
        } catch (err: any) {
            console.error('Konum hatası:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchByCity = async (city: string, updateState = true) => {
        setLoading(true);
        if (updateState) setSelectedCity(city);
        try {
            await Preferences.set({ key: 'prayer_city', value: city });
            const data = await PrayerTimeService.getTimesByCity(city);
            setTimes(data);
        } catch (err: any) {
            console.error('Vakitler alınamadı.', err);
        } finally {
            setLoading(false);
        }
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
            
            const hasPermission = await NotificationService.requestPermissions();
            if (!hasPermission) {
                alert("Bildirim izni verilmediği için hatırlatıcı kurulamadı. Lütfen ayarlardan izin verin.");
                return;
            }

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
            for (let i = 0; i < 7; i++) {
                await NotificationService.cancelNotification(prayerId + i);
            }
        }
    };

    const TimeCard = ({ title, time, icon: Icon, prayerKey, isNext, colorScheme }: any) => {
        const reminderEnabled = reminderSettings[prayerKey];

        return (
            <div 
                className={`relative group transition-all duration-500 transform perspective-1000
                    ${isNext ? 'scale-105 z-20' : 'scale-100'}`}
            >
                {/* 3D Depth Layer */}
                <div className={`absolute inset-0 rounded-[2rem] transition-all duration-300 translate-y-1.5 opacity-20
                    ${colorScheme.shadowColor}`} 
                />

                <div className={`relative p-5 rounded-[2rem] border overflow-hidden transition-all duration-500
                    active:translate-y-1 active:shadow-inner h-full flex flex-col justify-between
                    ${isNext ? 'shadow-2xl' : 'shadow-lg'}
                    ${theme === 'light' 
                        ? (isNext ? `${colorScheme.lightBg} border-${colorScheme.color}-200` : 'bg-white border-slate-100') 
                        : (isNext ? `${colorScheme.darkBg} border-${colorScheme.color}-500/30` : 'bg-slate-900/40 border-white/5')}
                `}>
                    {/* Background Shine Effect */}
                    <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-3xl opacity-20 ${colorScheme.accentColor}`} />
                    
                    {/* Header Row */}
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-2.5 rounded-2xl transition-all duration-300
                            ${isNext ? 'bg-white shadow-sm' : (theme === 'light' ? 'bg-slate-50' : 'bg-white/5')}
                        `}>
                            <Icon className={`w-5 h-5 ${isNext ? colorScheme.textColor : 'text-slate-400'}`} />
                        </div>
                        
                        <button
                            onClick={() => toggleReminder(prayerKey)}
                            title="Hatırlatıcı"
                            className={`w-10 h-6 rounded-full transition-all duration-300 flex items-center px-0.5 border
                                ${reminderEnabled
                                    ? 'bg-emerald-500 border-emerald-400'
                                    : 'bg-slate-200 border-slate-300 dark:bg-white/10 dark:border-white/20'}`}
                        >
                            <div className={`w-4 h-4 rounded-full transition-all duration-300 shadow-sm
                                ${reminderEnabled ? 'bg-white translate-x-4' : 'bg-white/60 translate-x-0'}`} />
                        </button>
                    </div>

                    {/* Vakit Bilgisi */}
                    <div className="space-y-1">
                        <p className={`text-[9px] font-black uppercase tracking-[0.2em] 
                            ${isNext ? colorScheme.textColor : 'text-slate-400'}`}>
                            {title}
                        </p>
                        <div className="flex items-baseline gap-1">
                            <p className={`text-2xl font-black tracking-tight
                                ${isNext 
                                    ? (theme === 'light' ? 'text-slate-900' : 'text-white')
                                    : (theme === 'light' ? 'text-slate-800' : 'text-slate-200')}
                            `}>
                                {time || '--:--'}
                            </p>
                        </div>
                    </div>

                    {/* Next Indicator */}
                    {isNext && (
                        <div className="mt-4 flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${colorScheme.accentColor}`} />
                            <span className={`text-[8px] font-black uppercase tracking-widest ${colorScheme.textColor}`}> SIRADAKİ </span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const colorSchemes: Record<string, any> = {
        imsak: { color: 'indigo', lightBg: 'bg-indigo-50', darkBg: 'bg-indigo-900/20', textColor: 'text-indigo-600', shadowColor: 'bg-indigo-900', accentColor: 'bg-indigo-400' },
        gunes: { color: 'amber', lightBg: 'bg-amber-50', darkBg: 'bg-amber-900/20', textColor: 'text-amber-600', shadowColor: 'bg-amber-900', accentColor: 'bg-amber-400' },
        ogle: { color: 'sky', lightBg: 'bg-sky-50', darkBg: 'bg-sky-900/20', textColor: 'text-sky-600', shadowColor: 'bg-sky-900', accentColor: 'bg-sky-400' },
        ikindi: { color: 'orange', lightBg: 'bg-orange-50', darkBg: 'bg-orange-900/20', textColor: 'text-orange-600', shadowColor: 'bg-orange-900', accentColor: 'bg-orange-400' },
        aksam: { color: 'rose', lightBg: 'bg-rose-50', darkBg: 'bg-rose-900/20', textColor: 'text-rose-600', shadowColor: 'bg-rose-900', accentColor: 'bg-rose-400' },
        yatsi: { color: 'violet', lightBg: 'bg-violet-50', darkBg: 'bg-violet-900/20', textColor: 'text-violet-600', shadowColor: 'bg-violet-900', accentColor: 'bg-violet-400' },
    };

    return (
        <div className="space-y-8 pb-32 animate-fadeIn max-w-2xl mx-auto px-1">
            {/* Elegant Header with Location Selection */}
            <div className={`p-6 rounded-[2.5rem] border backdrop-blur-3xl transition-all duration-500 relative overflow-hidden
                ${theme === 'light' ? 'bg-white/80 border-slate-100 shadow-xl shadow-slate-200/40' : 'bg-slate-900/60 border-white/5 shadow-2xl'}
            `}>
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <MapPin className="w-32 h-32" />
                </div>

                <div className="flex flex-col gap-6 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className={`text-xl font-black ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                                {selectedCity}
                            </h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Vakitleri Keşfet</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-[1fr_auto] gap-3">
                        <div className="relative">
                            <select
                                title="Şehir Seçin"
                                value={selectedCity}
                                onChange={(e) => fetchByCity(e.target.value)}
                                className={`w-full h-14 px-5 rounded-2xl border bg-transparent text-sm font-bold appearance-none transition-all outline-none pr-10
                                    ${theme === 'light' ? 'border-slate-200 text-slate-800' : 'border-white/10 text-white'}
                                `}
                            >
                                {TURKEY_CITIES.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                <Activity className="w-4 h-4" />
                            </div>
                        </div>

                        <button
                            onClick={fetchByLocation}
                            disabled={loading}
                            title={t('prayer.autoLocation') || 'Konumumu Bul'}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90
                                ${theme === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-white/5 hover:bg-white/10 text-white'}
                            `}
                        >
                            <Navigation className={`w-5 h-5 ${loading ? 'animate-spin text-emerald-500' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Vakit Izgarası - 3D Görünüm */}
            <div className="grid grid-cols-2 gap-4">
                <TimeCard
                    title="İmsak"
                    time={times?.imsak}
                    icon={Clock}
                    prayerKey="imsak"
                    isNext={nextPrayer === 'imsak'}
                    colorScheme={colorSchemes.imsak}
                />
                <TimeCard
                    title="Güneş"
                    time={times?.gunes}
                    icon={Sunrise}
                    prayerKey="gunes"
                    isNext={nextPrayer === 'gunes'}
                    colorScheme={colorSchemes.gunes}
                />
                <TimeCard
                    title="Öğle"
                    time={times?.ogle}
                    icon={Sun}
                    prayerKey="ogle"
                    isNext={nextPrayer === 'ogle'}
                    colorScheme={colorSchemes.ogle}
                />
                <TimeCard
                    title="İkindi"
                    time={times?.ikindi}
                    icon={Activity}
                    prayerKey="ikindi"
                    isNext={nextPrayer === 'ikindi'}
                    colorScheme={colorSchemes.ikindi}
                />
                <TimeCard
                    title="Akşam"
                    time={times?.aksam}
                    icon={Sunset}
                    prayerKey="aksam"
                    isNext={nextPrayer === 'aksam'}
                    colorScheme={colorSchemes.aksam}
                />
                <TimeCard
                    title="Yatsı"
                    time={times?.yatsi}
                    icon={Moon}
                    prayerKey="yatsi"
                    isNext={nextPrayer === 'yatsi'}
                    colorScheme={colorSchemes.yatsi}
                />
            </div>

            {/* Premium Info Banner */}
            <div className={`p-6 rounded-[2.5rem] border transition-all duration-300 relative overflow-hidden group
                ${theme === 'light' 
                    ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 shadow-lg' 
                    : 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20'}
            `}>
                <div className="flex gap-5 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 animate-bounce-slow">
                        <Bell className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="space-y-1">
                        <p className={`text-sm font-black ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                            Hatırlatıcılar Aktif
                        </p>
                        <p className={`text-[11px] font-bold leading-relaxed opacity-60 ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                            Namaz vakitlerine <span className="text-emerald-500 font-black">5 dakika kala</span> size özel derinlikli bildirimler gönderiyoruz.
                        </p>
                    </div>
                </div>
            </div>
            
            {times && (
                <div className="flex flex-col items-center gap-2 opacity-30">
                    <div className="w-8 h-1 rounded-full bg-slate-400" />
                    <p className="text-[9px] font-black uppercase tracking-[0.3em]"> {times.city} • {times.date} </p>
                </div>
            )}
        </div>
    );
};

export default PrayerTimesView;
