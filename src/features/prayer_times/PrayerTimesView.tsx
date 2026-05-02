import React, { useEffect, useState } from 'react';
import { Activity, Bell, Clock, MapPin, Moon, Navigation, Sun, Sunrise, Sunset } from 'lucide-react';
import { Preferences } from '@capacitor/preferences';
import { useTheme } from '../../core/ThemeContext';
import { useLanguage } from '../../core/LanguageContext';
import { PrayerTimeService, PrayerTimesData } from '../../services/PrayerTimeService';
import { NotificationService } from '../../services/NotificationService';
import { UserProfile } from '../../core/types';

const TURKEY_CITIES = [
    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin', 'Aydın', 'Balıkesir',
    'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli',
    'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari',
    'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir',
    'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir',
    'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat',
    'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman',
    'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
];

const PRAYERS = [
    { key: 'imsak', title: 'İmsak', icon: Clock, color: 'indigo' },
    { key: 'gunes', title: 'Güneş', icon: Sunrise, color: 'amber' },
    { key: 'ogle', title: 'Öğle', icon: Sun, color: 'sky' },
    { key: 'ikindi', title: 'İkindi', icon: Activity, color: 'orange' },
    { key: 'aksam', title: 'Akşam', icon: Sunset, color: 'rose' },
    { key: 'yatsi', title: 'Yatsı', icon: Moon, color: 'violet' },
] as const;

const COLOR_CLASSES: Record<string, { bg: string; text: string; darkBg: string; shadow: string; dot: string }> = {
    indigo: { bg: 'bg-indigo-50 border-indigo-100', text: 'text-indigo-600', darkBg: 'bg-indigo-900/20 border-indigo-500/30', shadow: 'bg-indigo-900', dot: 'bg-indigo-400' },
    amber: { bg: 'bg-amber-50 border-amber-100', text: 'text-amber-600', darkBg: 'bg-amber-900/20 border-amber-500/30', shadow: 'bg-amber-900', dot: 'bg-amber-400' },
    sky: { bg: 'bg-sky-50 border-sky-100', text: 'text-sky-600', darkBg: 'bg-sky-900/20 border-sky-500/30', shadow: 'bg-sky-900', dot: 'bg-sky-400' },
    orange: { bg: 'bg-orange-50 border-orange-100', text: 'text-orange-600', darkBg: 'bg-orange-900/20 border-orange-500/30', shadow: 'bg-orange-900', dot: 'bg-orange-400' },
    rose: { bg: 'bg-rose-50 border-rose-100', text: 'text-rose-600', darkBg: 'bg-rose-900/20 border-rose-500/30', shadow: 'bg-rose-900', dot: 'bg-rose-400' },
    violet: { bg: 'bg-violet-50 border-violet-100', text: 'text-violet-600', darkBg: 'bg-violet-900/20 border-violet-500/30', shadow: 'bg-violet-900', dot: 'bg-violet-400' },
};

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
    const [adhanAlert, setAdhanAlert] = useState<{ label: string; time: string } | null>(null);
    const [shownAdhanAlerts, setShownAdhanAlerts] = useState<Record<string, boolean>>({});
    const [reminderMinutes, setReminderMinutes] = useState(5);
    const [isReminderSaving, setIsReminderSaving] = useState(false);
    const [reminderSettings, setReminderSettings] = useState<Record<string, boolean>>({
        imsak: false,
        gunes: false,
        ogle: false,
        ikindi: false,
        aksam: false,
        yatsi: false,
    });

    useEffect(() => {
        if (!times) return;

        const checkNextPrayer = () => {
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();
            const parseTime = (value: string) => {
                const [hours, minutes] = value.split(':').map(Number);
                return hours * 60 + minutes;
            };

            const next = PRAYERS.find((prayer) => parseTime((times as any)[prayer.key]) > currentTime);
            setNextPrayer(next?.key || 'imsak');
        };

        checkNextPrayer();
        const interval = setInterval(checkNextPrayer, 60000);
        return () => clearInterval(interval);
    }, [times]);

    useEffect(() => {
        if (!times) return;

        const checkCurrentPrayer = () => {
            const now = new Date();
            const currentTime = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false });
            const todayKey = now.toISOString().slice(0, 10);
            const currentPrayer = PRAYERS.find((prayer) => (times as any)[prayer.key] === currentTime);
            if (!currentPrayer) return;

            const alertKey = `${todayKey}-${currentPrayer.key}`;
            if (shownAdhanAlerts[alertKey]) return;

            setShownAdhanAlerts((prev) => ({ ...prev, [alertKey]: true }));
            setAdhanAlert({ label: currentPrayer.title, time: currentTime });
            navigator.vibrate?.([450, 150, 450]);
        };

        checkCurrentPrayer();
        const interval = setInterval(checkCurrentPrayer, 15000);
        return () => clearInterval(interval);
    }, [times, shownAdhanAlerts]);

    useEffect(() => {
        const loadSettings = async () => {
            setLoading(true);
            try {
                const { value: city } = await Preferences.get({ key: 'prayer_city' });
                const { value: reminders } = await Preferences.get({ key: 'prayer_reminders' });
                const { value: minutes } = await Preferences.get({ key: 'prayer_reminder_minutes' });

                const cityToLoad = city || 'İstanbul';
                setSelectedCity(cityToLoad);
                await fetchByCity(cityToLoad, false);

                if (reminders) setReminderSettings(JSON.parse(reminders));
                if (minutes) {
                    const parsed = Number(minutes);
                    if (Number.isFinite(parsed)) setReminderMinutes(Math.min(120, Math.max(0, parsed)));
                }
            } catch (error) {
                console.error('Ezan ayarları yüklenirken hata:', error);
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
        NotificationService.requestPermissions();
    }, []);

    const fetchByLocation = async () => {
        if (profile && profile.locationEnabled === false) {
            alert('Konum izniniz Profil / Ayarlar sekmesinden kapatılmıştır.');
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
        } catch (error) {
            console.error('Konum hatası:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchByCity = async (city: string, updateState = true) => {
        setLoading(true);
        if (updateState) setSelectedCity(city);
        try {
            await Preferences.set({ key: 'prayer_city', value: city });
            setTimes(await PrayerTimeService.getTimesByCity(city));
        } catch (error) {
            console.error('Vakitler alınamadı:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPrayerId = (prayer: string) => {
        const ids: Record<string, number> = { imsak: 100, gunes: 200, ogle: 300, ikindi: 400, aksam: 500, yatsi: 600 };
        return ids[prayer] || 700;
    };

    const cancelPrayerReminder = async (prayer: string) => {
        const prayerId = getPrayerId(prayer);
        await Promise.all([
            ...Array.from({ length: 7 }, (_, index) => NotificationService.cancelNotification(prayerId + index)),
            NotificationService.cancelNotification(prayerId + 50)
        ]);
    };

    const scheduleReminder = async (prayer: string, minutesBefore: number) => {
        if (!times) return;

        const prayerId = getPrayerId(prayer);
        const prayerTime = (times as any)[prayer];
        const prayerLabel = PRAYERS.find((item) => item.key === prayer)?.title || prayer;

        await cancelPrayerReminder(prayer);
        if (minutesBefore > 0) {
            await NotificationService.schedulePrayerReminder(
                prayerId,
                `Ezan Vakti Yaklaşıyor: ${prayerLabel}`,
                `${prayerLabel} vaktine ${minutesBefore} dakika kaldı. Hazırlanmaya ne dersiniz?`,
                prayerTime,
                minutesBefore
            );
        }

        await NotificationService.schedulePrayerTimeAlert(
            prayerId + 50,
            prayerLabel,
            prayerTime
        );
    };

    const toggleReminder = async (prayer: string) => {
        const newState = !reminderSettings[prayer];
        const newSettings = { ...reminderSettings, [prayer]: newState };
        setReminderSettings(newSettings);
        await Preferences.set({ key: 'prayer_reminders', value: JSON.stringify(newSettings) });
        await cancelPrayerReminder(prayer);

        if (newState) {
            const hasPermission = await NotificationService.requestPermissions();
            if (!hasPermission) {
                alert('Bildirim izni verilmediği için hatırlatıcı kurulamadı. Lütfen ayarlardan izin verin.');
                return;
            }
            await scheduleReminder(prayer, reminderMinutes);
        }
    };

    const saveReminderMinutes = async () => {
        setIsReminderSaving(true);
        const safeValue = Math.min(120, Math.max(0, reminderMinutes));
        const hasPermission = await NotificationService.requestPermissions();

        if (!hasPermission) {
            setIsReminderSaving(false);
            alert('Bildirim izni verilmediği için hatırlatıcılar güncellenemedi.');
            return;
        }

        setReminderMinutes(safeValue);
        await Preferences.set({ key: 'prayer_reminder_minutes', value: String(safeValue) });
        await Promise.all(
            Object.entries(reminderSettings)
                .filter(([, enabled]) => enabled)
                .map(([prayer]) => scheduleReminder(prayer, safeValue))
        );
        setIsReminderSaving(false);
    };

    const TimeCard = ({ title, time, icon: Icon, prayerKey, isNext, color }: any) => {
        const colorClasses = COLOR_CLASSES[color];
        const reminderEnabled = reminderSettings[prayerKey];

        return (
            <div className="relative">
                <div className={`absolute inset-0 rounded-2xl translate-y-1 opacity-15 ${colorClasses.shadow}`} />
                <div className={`relative min-h-[76px] rounded-2xl border px-3 py-2 flex flex-col justify-between overflow-hidden
                    ${theme === 'light'
                        ? isNext ? colorClasses.bg : 'bg-white border-slate-100'
                        : isNext ? colorClasses.darkBg : 'bg-slate-900/40 border-white/5'}
                    ${isNext ? 'shadow-lg' : 'shadow-sm'}`}
                >
                    <div className="flex items-center justify-between gap-2">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${theme === 'light' ? 'bg-slate-50' : 'bg-white/5'}`}>
                            <Icon className={`w-3.5 h-3.5 ${isNext ? colorClasses.text : 'text-slate-400'}`} />
                        </div>
                        <button
                            onClick={() => toggleReminder(prayerKey)}
                            title="Hatırlatıcı"
                            className={`w-8 h-4 rounded-full transition-all flex items-center px-0.5 border
                                ${reminderEnabled ? 'bg-emerald-500 border-emerald-400' : 'bg-slate-200 border-slate-300 dark:bg-white/10 dark:border-white/20'}`}
                        >
                            <div className={`w-3 h-3 rounded-full transition-all shadow-sm ${reminderEnabled ? 'bg-white translate-x-3.5' : 'bg-white/70 translate-x-0'}`} />
                        </button>
                    </div>

                    <div>
                        <p className={`text-[8px] font-black uppercase tracking-[0.14em] ${isNext ? colorClasses.text : 'text-slate-400'}`}>
                            {title}
                        </p>
                        <p className={`text-lg font-black leading-none ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                            {time || '--:--'}
                        </p>
                    </div>

                    {isNext && (
                        <div className="absolute right-2 bottom-2 flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${colorClasses.dot}`} />
                            <span className={`text-[7px] font-black ${colorClasses.text}`}>SIRADAKİ</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-2.5 pb-32 animate-fadeIn max-w-2xl mx-auto px-0">
            {adhanAlert && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm px-5">
                    <div className={`w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl border
                        ${theme === 'light' ? 'bg-white border-emerald-100' : 'bg-slate-900 border-emerald-500/30'}`}
                    >
                        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                            <Bell className="w-8 h-8 text-emerald-500" />
                        </div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500 mb-2">
                            Ezan Vakti
                        </p>
                        <h3 className={`text-2xl font-serif font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                            {adhanAlert.label}
                        </h3>
                        <p className={`mt-2 text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-300'}`}>
                            {adhanAlert.time} vakti girdi. Allah kabul etsin.
                        </p>
                        <button
                            onClick={() => setAdhanAlert(null)}
                            className="mt-6 w-full h-12 rounded-2xl bg-emerald-500 text-white font-black active:scale-95 transition-all"
                        >
                            Tamam
                        </button>
                    </div>
                </div>
            )}
            <div className={`px-3 py-2 rounded-2xl border backdrop-blur-3xl relative overflow-hidden
                ${theme === 'light' ? 'bg-white/80 border-slate-100 shadow-md shadow-slate-200/30' : 'bg-slate-900/60 border-white/5 shadow-xl'}`}
            >
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <MapPin className="w-20 h-20" />
                </div>

                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2.5 relative z-10">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                        <h2 className={`text-sm font-black truncate ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                            {selectedCity}
                        </h2>
                        <div className="relative mt-1">
                            <select
                                title="Şehir Seçin"
                                value={selectedCity}
                                onChange={(event) => fetchByCity(event.target.value)}
                                className={`w-full h-8 px-3 rounded-xl border bg-transparent text-xs font-bold appearance-none outline-none pr-8
                                    ${theme === 'light' ? 'border-slate-200 text-slate-700' : 'border-white/10 text-white'}`}
                            >
                                {TURKEY_CITIES.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                <Activity className="w-3.5 h-3.5" />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={fetchByLocation}
                        disabled={loading}
                        title={t('prayer.autoLocation') || 'Konumumu Bul'}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-all
                            ${theme === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-white/5 hover:bg-white/10 text-white'}`}
                    >
                        <Navigation className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-500' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {PRAYERS.map((prayer) => (
                    <TimeCard
                        key={prayer.key}
                        title={prayer.title}
                        time={(times as any)?.[prayer.key]}
                        icon={prayer.icon}
                        prayerKey={prayer.key}
                        isNext={nextPrayer === prayer.key}
                        color={prayer.color}
                    />
                ))}
            </div>

            <div className={`px-3 py-2.5 rounded-2xl border relative overflow-hidden
                ${theme === 'light'
                    ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 shadow-sm'
                    : 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20'}`}
            >
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                        <Bell className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={`text-sm font-black ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                            Hatırlatıcı
                        </p>
                        <label className="mt-1 flex items-center gap-2">
                            <input
                                type="number"
                                min={0}
                                max={120}
                                value={reminderMinutes}
                                onChange={(event) => {
                                    const value = Number(event.target.value);
                                    setReminderMinutes(Math.min(120, Math.max(0, Number.isFinite(value) ? Math.round(value) : 5)));
                                }}
                                className={`w-16 h-8 rounded-xl border px-2 text-sm font-black outline-none
                                    ${theme === 'light' ? 'bg-white border-emerald-100 text-slate-800' : 'bg-white/5 border-white/10 text-white'}`}
                                aria-label="Ezan hatırlatma dakikası"
                            />
                            <span className={`text-xs font-bold ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                                dakika önce
                            </span>
                        </label>
                    </div>
                    <button
                        onClick={saveReminderMinutes}
                        disabled={isReminderSaving}
                        className="h-8 px-3 rounded-xl bg-emerald-500 text-white text-xs font-black shadow-sm active:scale-95 disabled:opacity-60"
                    >
                        {isReminderSaving ? '...' : 'Kaydet'}
                    </button>
                </div>
            </div>

            {times && (
                <div className="flex flex-col items-center gap-1 opacity-30">
                    <div className="w-8 h-1 rounded-full bg-slate-400" />
                    <p className="text-[9px] font-black uppercase tracking-[0.3em]">{times.city} • {times.date}</p>
                </div>
            )}
        </div>
    );
};

export default PrayerTimesView;
