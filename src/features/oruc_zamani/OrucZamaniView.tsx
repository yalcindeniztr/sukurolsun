import React, { useState, useEffect, useMemo } from 'react';
import { Sunrise, Sunset, Clock, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../../core/ThemeContext';
import { PrayerTimeService, PrayerTimesData } from '../../services/PrayerTimeService';
import { Preferences } from '@capacitor/preferences';

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

const MONTH_NAMES = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", 
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

const OrucZamaniView: React.FC = () => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [monthlyTimes, setMonthlyTimes] = useState<PrayerTimesData[]>([]);
    const [selectedCity, setSelectedCity] = useState('İstanbul');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [expandedMonth, setExpandedMonth] = useState<number>(new Date().getMonth());

    useEffect(() => {
        const loadInitialCity = async () => {
            const { value: city } = await Preferences.get({ key: 'prayer_city' });
            if (city) {
                setSelectedCity(city);
            }
        };
        loadInitialCity();
    }, []);

    useEffect(() => {
        fetchYearlyTimes();
    }, [selectedCity, selectedYear]);

    const fetchYearlyTimes = async () => {
        setLoading(true);
        setError(null);
        setMonthlyTimes([]);
        try {
            const allYearData: PrayerTimesData[] = [];
            // Paralel çekim yaparak hızı artırıyoruz
            const months = Array.from({ length: 12 }, (_, i) => i + 1);
            const rawResults = await Promise.all(
                months.map(m => PrayerTimeService.getMonthlyTimes(selectedCity, m, selectedYear).catch(() => []))
            );
            
            rawResults.forEach(data => allYearData.push(...data));
            setMonthlyTimes(allYearData);
        } catch (err: any) {
            setError(err.message || 'Veriler alınırken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const groupedData = useMemo(() => {
        const groups: Record<number, PrayerTimesData[]> = {};
        monthlyTimes.forEach(day => {
            // Tarih formatı: "01.01.2024"
            const month = parseInt(day.date.split('.')[1]) - 1;
            if (!groups[month]) groups[month] = [];
            groups[month].push(day);
        });
        return groups;
    }, [monthlyTimes]);

    const calculateFastingHours = (imsak: string, aksam: string) => {
        const parseTime = (time: string) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };
        const imsakMinutes = parseTime(imsak);
        const aksamMinutes = parseTime(aksam);
        let diff = aksamMinutes - imsakMinutes;
        if (diff < 0) diff += 24 * 60;
        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;
        return `${hours}s ${minutes}d`;
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-24">
            {/* Başlık Bölümü */}
            <div className={`p-8 rounded-[2.5rem] text-center border relative overflow-hidden transition-all duration-500
                ${theme === 'light' ? 'bg-orange-50/50 border-orange-100 shadow-xl shadow-orange-200/20' : 'bg-orange-500/5 border-orange-500/10'}
            `}>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4
                    ${theme === 'light' ? 'bg-white text-orange-600 border border-orange-100 shadow-sm' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                    <Clock className="w-5 h-5" />
                    <span className="font-black text-[10px] uppercase tracking-widest">Yıllık İmsakiye</span>
                </div>
                <h2 className={`text-3xl font-black mb-2 ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                    {selectedCity} - {selectedYear}
                </h2>
                <div className="flex justify-center gap-2 mt-4">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        <Sunrise className="w-3 h-3" /> İmsak
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                        <Sunset className="w-3 h-3" /> İftar
                    </div>
                </div>
            </div>

            {/* Filtre Panel */}
            <div className={`p-4 rounded-3xl border grid grid-cols-2 gap-3
                ${theme === 'light' ? 'bg-white border-slate-200/60 shadow-sm' : 'bg-white/[0.03] border-white/5'}`}>
                
                <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 px-1">Şehir</label>
                    <select
                        value={selectedCity}
                        onChange={async (e) => {
                            const newCity = e.target.value;
                            setSelectedCity(newCity);
                            await Preferences.set({ key: 'prayer_city', value: newCity });
                        }}
                        disabled={loading}
                        className={`w-full p-3 rounded-xl border font-bold text-xs outline-none transition-all
                            ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/10 text-white'}`}
                    >
                        {TURKEY_CITIES.sort().map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 px-1">Yıl</label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        disabled={loading}
                        className={`w-full p-3 rounded-xl border font-bold text-xs outline-none transition-all
                            ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/10 text-white'}`}
                    >
                        {[2024, 2025, 2026, 2027].map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* İçerik */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="relative">
                        <Activity className="w-12 h-12 text-orange-500 animate-spin" />
                        <Clock className="w-6 h-6 text-orange-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-xs font-black text-slate-400 animate-pulse tracking-widest uppercase">Veriler Hazırlanıyor...</p>
                </div>
            ) : error ? (
                <div className="p-6 rounded-3xl bg-red-50 border border-red-100 text-center">
                    <p className="text-red-600 font-bold mb-2">Hata Oluştu</p>
                    <p className="text-xs text-red-500">{error}</p>
                    <button onClick={fetchYearlyTimes} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full text-xs font-black shadow-lg shadow-red-500/30">TEKRAR DENE</button>
                </div>
            ) : (
                <div className="space-y-4">
                    {MONTH_NAMES.map((monthName, mIndex) => {
                        const days = groupedData[mIndex] || [];
                        if (days.length === 0) return null;
                        const isExpanded = expandedMonth === mIndex;

                        return (
                            <div key={mIndex} className={`rounded-[2rem] border overflow-hidden transition-all duration-300
                                ${theme === 'light' ? 'bg-white border-slate-100' : 'bg-white/[0.02] border-white/5'}`}>
                                
                                <button
                                    onClick={() => setExpandedMonth(isExpanded ? -1 : mIndex)}
                                    className={`w-full p-5 flex items-center justify-between transition-colors
                                        ${isExpanded ? (theme === 'light' ? 'bg-orange-50/50' : 'bg-orange-500/10') : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm
                                            ${theme === 'light' ? 'bg-orange-100 text-orange-600' : 'bg-orange-500/20 text-orange-400'}`}>
                                            {String(mIndex + 1).padStart(2, '0')}
                                        </div>
                                        <div className="text-left">
                                            <h3 className={`font-black tracking-tight ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                                                {monthName}
                                            </h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                {days.length} Gün Kayıtlı
                                            </p>
                                        </div>
                                    </div>
                                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                </button>

                                {isExpanded && (
                                    <div className="px-4 pb-5 space-y-2 animate-slideDown">
                                        {days.map((day, dIndex) => (
                                            <div key={dIndex} className={`p-3 rounded-2xl flex items-center justify-between border
                                                ${theme === 'light' ? 'bg-slate-50/50 border-slate-100' : 'bg-white/5 border-white/5'}`}>
                                                
                                                <div className="flex flex-col">
                                                    <span className={`text-[10px] font-black tracking-tighter ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
                                                        {day.date.split('.')[0]} {monthName}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase">{calculateFastingHours(day.imsak, day.aksam)}</span>
                                                </div>

                                                <div className="flex gap-2">
                                                    <div className="text-center min-w-[50px]">
                                                        <p className="text-[8px] font-black text-emerald-600 uppercase">İmsak</p>
                                                        <p className={`text-sm font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{day.imsak}</p>
                                                    </div>
                                                    <div className="w-px h-6 bg-slate-200 dark:bg-white/10 self-center" />
                                                    <div className="text-center min-w-[50px]">
                                                        <p className="text-[8px] font-black text-orange-600 uppercase">İftar</p>
                                                        <p className={`text-sm font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{day.aksam}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrucZamaniView;