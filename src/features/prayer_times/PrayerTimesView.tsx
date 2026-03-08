import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Sunrise, Sun, Sunset, Moon, Activity } from 'lucide-react';
import { useTheme } from '../../core/ThemeContext';
import { PrayerTimeService, PrayerTimesData } from '../../services/PrayerTimeService';

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

import { UserProfile } from '../../core/types';

interface PrayerTimesViewProps {
    profile: UserProfile | null;
}

const PrayerTimesView: React.FC<PrayerTimesViewProps> = ({ profile }) => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [times, setTimes] = useState<PrayerTimesData | null>(null);
    const [selectedCity, setSelectedCity] = useState('İstanbul');

    const fetchByLocation = async () => {
        if (profile && profile.locationEnabled === false) {
            alert("Konum izniniz Profil / Ayarlar sekmesinden kapatılmıştır. Bölgeyi otomatik bulmak için lütfen izni açınız veya manuel olarak şehir seçiniz.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await PrayerTimeService.getTimesByLocation();
            setTimes(data);
        } catch (err: any) {
            setError(err.message || 'Konum alınırken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const fetchByCity = async (city: string) => {
        setLoading(true);
        setError(null);
        setSelectedCity(city);
        try {
            const data = await PrayerTimeService.getTimesByCity(city);
            setTimes(data);
        } catch (err: any) {
            setError(err.message || 'Vakitler alınırken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    // İlk yüklemede seçili şehri getir
    useEffect(() => {
        fetchByCity(selectedCity);
    }, []);

    const TimeCard = ({ title, time, icon: Icon, isFastingRelated = false, highlightColor }: any) => (
        <div className={`p-4 rounded-3xl border flex flex-col items-center justify-center gap-2 transition-all duration-300
            ${isFastingRelated
                ? (theme === 'light' ? `bg-${highlightColor}-50 border-${highlightColor}-200 shadow-sm` : `bg-${highlightColor}-500/10 border-${highlightColor}-500/20`)
                : (theme === 'light' ? 'bg-white/80 border-slate-200 shadow-sm' : 'bg-white/[0.03] border-white/5')}
        `}>
            <Icon className={`w-6 h-6 ${isFastingRelated ? `text-${highlightColor}-600 dark:text-${highlightColor}-400` : 'text-slate-500'}`} />
            <div className="text-center">
                <p className={`text-[11px] font-bold uppercase tracking-wider mb-1
                    ${isFastingRelated ? `text-${highlightColor}-600 dark:text-${highlightColor}-400` : 'text-slate-400'}
                `}>{title}</p>
                <p className={`text-2xl font-black
                    ${theme === 'light' ? 'text-slate-800' : 'text-white'}
                `}>{time || '--:--'}</p>
            </div>
            {isFastingRelated && (
                <div className={`text-[10px] px-2 py-0.5 rounded-full font-bold
                    ${theme === 'light' ? `bg-${highlightColor}-100 text-${highlightColor}-700` : `bg-${highlightColor}-500/20 text-${highlightColor}-300`}
                `}>
                    {title === 'İmsak' ? 'Oruç Başlar' : 'İftar Vakti'}
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6 animate-fadeIn pb-24">
            {/* Başlık */}
            <div className="text-center mb-8">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4
                    ${theme === 'light' ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                    <Clock className="w-5 h-5" />
                    <span className="font-bold text-sm">Namaz ve Oruç Vakitleri</span>
                </div>
                <h2 className={`text-2xl font-serif font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                    Günlük İbadet Saatleri
                </h2>
                <p className={`text-sm mt-2 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    Oruç ve namaz vakitlerini bulunduğunuz konuma veya şehre göre takip edin.
                </p>
            </div>

            {/* Konum Araçları */}
            <div className={`p-5 rounded-3xl border transition-all duration-300
                ${theme === 'light' ? 'bg-white/80 border-slate-200/60 shadow-sm' : 'bg-white/[0.03] border-white/5'}`}>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={fetchByLocation}
                        disabled={loading}
                        className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold transition-all active:scale-[0.98]
                            ${theme === 'light'
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
                    >
                        {loading ? <Activity className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                        Otomatik Konum Bul
                    </button>

                    <div className="relative">
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
                            <span className={`px-2 text-xs font-bold uppercase ${theme === 'light' ? 'bg-white text-slate-300' : 'bg-slate-900 text-slate-600'}`}>veya</span>
                        </div>
                        <div className={`border-t ${theme === 'light' ? 'border-slate-100' : 'border-white/5'}`}></div>
                    </div>

                    <div className="flex items-center gap-3">
                        <MapPin className={`w-6 h-6 shrink-0 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`} />
                        <select
                            value={selectedCity}
                            onChange={(e) => fetchByCity(e.target.value)}
                            disabled={loading}
                            className={`flex-1 p-3.5 rounded-2xl border font-medium outline-none transition-all
                                ${theme === 'light'
                                    ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                                    : 'bg-black/20 border-white/10 text-white focus:border-emerald-500'}`}
                        >
                            {TURKEY_CITIES.sort().map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium text-center">
                        {error}
                    </div>
                )}
            </div>

            {/* Vakitler Grid */}
            {times && (
                <div className="space-y-4 animate-fadeIn">
                    <div className="text-center">
                        <p className={`text-sm font-medium ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                            Seçili Konum: <span className={`font-bold ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`}>{times.city}</span> ({times.date})
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        <TimeCard title="İmsak" time={times.imsak} icon={Sunrise} isFastingRelated={true} highlightColor="emerald" />
                        <TimeCard title="Güneş" time={times.gunes} icon={Sun} />
                        <TimeCard title="Öğle" time={times.ogle} icon={Sun} />
                        <TimeCard title="İkindi" time={times.ikindi} icon={Sun} />
                        <TimeCard title="Akşam" time={times.aksam} icon={Sunset} isFastingRelated={true} highlightColor="orange" />
                        <TimeCard title="Yatsı" time={times.yatsi} icon={Moon} />
                    </div>

                    <div className={`p-4 mt-6 rounded-2xl text-center text-xs
                        ${theme === 'light' ? 'bg-slate-50 text-slate-500' : 'bg-white/[0.02] text-slate-400'}`}>
                        * Namaz ve oruç vakitleri güvenilir aladhan.com altyapısı ve Türkiye metodolojisi (Diyanet'e yakın) temel alınarak hesaplanmaktadır. Tedbir amaçlı Diyanet takvimi ile karşılaştırmanız tavsiye edilir.
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrayerTimesView;
