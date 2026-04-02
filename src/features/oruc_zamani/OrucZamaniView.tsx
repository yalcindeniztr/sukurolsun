import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Sunrise, Sunset, Clock, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
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

const OrucZamaniView: React.FC = () => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [monthlyTimes, setMonthlyTimes] = useState<PrayerTimesData[]>([]);
    const [selectedCity, setSelectedCity] = useState('İstanbul');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const months = [
        { value: 1, label: 'Ocak' },
        { value: 2, label: 'Şubat' },
        { value: 3, label: 'Mart' },
        { value: 4, label: 'Nisan' },
        { value: 5, label: 'Mayıs' },
        { value: 6, label: 'Haziran' },
        { value: 7, label: 'Temmuz' },
        { value: 8, label: 'Ağustos' },
        { value: 9, label: 'Eylül' },
        { value: 10, label: 'Ekim' },
        { value: 11, label: 'Kasım' },
        { value: 12, label: 'Aralık' },
    ];

    useEffect(() => {
        fetchMonthlyTimes();
    }, [selectedCity, selectedMonth, selectedYear]);

    const fetchMonthlyTimes = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await PrayerTimeService.getMonthlyTimes(selectedCity, selectedMonth, selectedYear);
            setMonthlyTimes(data);
        } catch (err: any) {
            setError(err.message || 'Aylık vakitler alınırken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handlePrevMonth = () => {
        if (selectedMonth === 1) {
            setSelectedMonth(12);
            setSelectedYear(selectedYear - 1);
        } else {
            setSelectedMonth(selectedMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (selectedMonth === 12) {
            setSelectedMonth(1);
            setSelectedYear(selectedYear + 1);
        } else {
            setSelectedMonth(selectedMonth + 1);
        }
    };

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
        return `${hours} saat ${minutes} dakika`;
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-24">
            {/* Başlık */}
            <div className="text-center mb-8">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4
                    ${theme === 'light' ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                    <Clock className="w-5 h-5" />
                    <span className="font-bold text-sm">Oruç Zamanı</span>
                </div>
                <h2 className={`text-2xl font-serif font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                    Aylık Oruç Vakitleri
                </h2>
                <p className={`text-sm mt-2 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    İmsak ve iftar vakitlerini aylık olarak görüntüleyin
                </p>
            </div>

            {/* Filtreler */}
            <div className={`p-5 rounded-3xl border transition-all duration-300
                ${theme === 'light' ? 'bg-white/80 border-slate-200/60 shadow-sm' : 'bg-white/[0.03] border-white/5'}`}>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <MapPin className={`w-6 h-6 shrink-0 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`} />
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
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

                    <div className="flex items-center gap-3">
                        <Calendar className={`w-6 h-6 shrink-0 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`} />
                        <div className="flex-1 flex items-center gap-2">
                            <button
                                onClick={handlePrevMonth}
                                disabled={loading}
                                className={`p-2 rounded-xl transition-all
                                    ${theme === 'light' ? 'hover:bg-slate-100' : 'hover:bg-white/10'}`}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                disabled={loading}
                                className={`flex-1 p-3.5 rounded-2xl border font-medium outline-none transition-all
                                    ${theme === 'light'
                                        ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                                        : 'bg-black/20 border-white/10 text-white focus:border-emerald-500'}`}
                            >
                                {months.map(month => (
                                    <option key={month.value} value={month.value}>{month.label}</option>
                                ))}
                            </select>
                            <button
                                onClick={handleNextMonth}
                                disabled={loading}
                                className={`p-2 rounded-xl transition-all
                                    ${theme === 'light' ? 'hover:bg-slate-100' : 'hover:bg-white/10'}`}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium text-center">
                        {error}
                    </div>
                )}
            </div>

            {/* Yükleniyor */}
            {loading && (
                <div className="flex justify-center py-12">
                    <Activity className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
            )}

            {/* Vakitler Listesi */}
            {!loading && monthlyTimes.length > 0 && (
                <div className="space-y-3">
                    {monthlyTimes.map((day, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-2xl border transition-all
                                ${theme === 'light'
                                    ? 'bg-white/80 border-slate-200/60 shadow-sm hover:shadow-md'
                                    : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.05]'}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                                    {day.date}
                                </div>
                                <div className={`text-xs px-2 py-1 rounded-full font-bold
                                    ${theme === 'light' ? 'bg-orange-100 text-orange-700' : 'bg-orange-500/20 text-orange-300'}`}>
                                    {calculateFastingHours(day.imsak, day.aksam)}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className={`p-3 rounded-xl text-center
                                    ${theme === 'light' ? 'bg-emerald-50' : 'bg-emerald-500/10'}`}>
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Sunrise className={`w-4 h-4 ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                                        <span className={`text-xs font-bold ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-300'}`}>
                                            İmsak
                                        </span>
                                    </div>
                                    <div className={`text-lg font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                                        {day.imsak}
                                    </div>
                                    <div className={`text-[10px] ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`}>
                                        Oruç Başlar
                                    </div>
                                </div>
                                <div className={`p-3 rounded-xl text-center
                                    ${theme === 'light' ? 'bg-orange-50' : 'bg-orange-500/10'}`}>
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Sunset className={`w-4 h-4 ${theme === 'light' ? 'text-orange-600' : 'text-orange-400'}`} />
                                        <span className={`text-xs font-bold ${theme === 'light' ? 'text-orange-700' : 'text-orange-300'}`}>
                                            İftar
                                        </span>
                                    </div>
                                    <div className={`text-lg font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                                        {day.aksam}
                                    </div>
                                    <div className={`text-[10px] ${theme === 'light' ? 'text-orange-600' : 'text-orange-400'}`}>
                                        Oruç Biter
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && monthlyTimes.length === 0 && !error && (
                <div className={`text-center py-12 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>Seçilen ay için veri bulunamadı</p>
                </div>
            )}
        </div>
    );
};

export default OrucZamaniView;