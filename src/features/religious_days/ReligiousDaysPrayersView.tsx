import React, { useState } from 'react';
import { Book, ChevronRight, ArrowLeft, Star, Heart } from 'lucide-react';
import { useTheme } from '../../core/ThemeContext';

interface SpecialDayPrayer {
    id: string;
    dayName: string;
    description: string;
    prayers: {
        title: string;
        arabic?: string;
        reading: string;
        meaning: string;
        virtue?: string;
    }[];
}

const SPECIAL_DAYS_PRAYERS: SpecialDayPrayer[] = [
    {
        id: '1',
        dayName: 'Kadir Gecesi',
        description: 'Bin aydan daha hayırlı olan Kadir Gecesinde bolca istiğfar edilmeli, dua ve niyazda bulunulmalıdır.',
        prayers: [
            {
                title: 'Hz. Aişe\'nin Kadir Gecesi Duası',
                arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
                reading: 'Allahümme inneke afüvvün, tühibbül-afve, fa\'fü annî.',
                meaning: 'Allah’ım! Sen affedicisin, affetmeyi seversin, beni de affet.',
                virtue: 'Peygamber Efendimiz (s.a.v) Hz. Aişe validemize Kadir Gecesinde özellikle bu duayı okumasını tavsiye etmiştir.'
            }
        ]
    },
    {
        id: '2',
        dayName: 'Regaip Kandili',
        description: 'Üç ayların başlangıcı ve ilahi rahmetin coştuğu bu gecede bolca tövbe edilmelidir.',
        prayers: [
            {
                title: 'Üç Aylar Duası',
                arabic: 'اَللّهُمَّ بَارِكْ لَنَا فِى رَجَبَ وَ شَعْبَانَ وَ بَلِّغْنَا رَمَضَان',
                reading: 'Allahümme bârik lenâ fî Recebe ve Şa\'bân ve bellığnâ Ramazân.',
                meaning: 'Allah’ım! Recep ve Şaban aylarını bizim için mübarek kıl ve bizi Ramazan’a ulaştır.',
                virtue: 'Peygamber Efendimiz (s.a.v) üç aylar girdiğinde bu duayı çokça okurdu.'
            }
        ]
    },
    {
        id: '3',
        dayName: 'Berat Kandili',
        description: 'Günahlardan arınma ve temize çıkma gecesidir. Şaban ayının 15. gecesidir.',
        prayers: [
            {
                title: 'Berat Gecesi İstiğfarı',
                reading: 'Estağfirullah el-Azîm el-Kerîm, ellezî lâ ilâhe illâ hüvel-hayyül kayyûmü ve etûbü ileyh.',
                meaning: 'Kendisinden başka ilâh bulunmayan, ebedî hayatla daima diri olan, her şeyin varlığı kendisine bağlı olan, yüce ve kerem sahibi Allah’tan günahlarımın affını diler, O’na tövbe ederim.',
            }
        ]
    },
    {
        id: '4',
        dayName: 'Cuma Günü',
        description: 'Müminlerin bayramı olan Cuma gününde Kehf Suresi okumak ve salavat getirmek çok faziletlidir.',
        prayers: [
            {
                title: 'Cuma Salavatı',
                arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ',
                reading: 'Allahümme salli alâ seyyidinâ Muhammedin ve alâ âli seyyidinâ Muhammed.',
                meaning: 'Allah\'ım! Efendimiz Muhammed\'e ve Efendimiz Muhammed\'in âline rahmet et.',
                virtue: 'Cuma günü ve gecesi bana çokça salavat getirin, zira salavatlarınız bana arz olunur. (Hadis-i Şerif)'
            }
        ]
    }
];

const ReligiousDaysPrayersView: React.FC = () => {
    const { theme } = useTheme();
    const [selectedDay, setSelectedDay] = useState<SpecialDayPrayer | null>(null);

    if (selectedDay) {
        return (
            <div className="space-y-6 animate-fadeIn pb-24 h-full">
                <button
                    onClick={() => setSelectedDay(null)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95
                        ${theme === 'light' ? 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200' : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/5'}`}
                >
                    <ArrowLeft className="w-4 h-4" /> Geri Dön
                </button>

                <div className="text-center mb-8">
                    <h2 className={`text-2xl font-serif font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                        {selectedDay.dayName} Duaları
                    </h2>
                    <p className={`text-sm mt-2 px-4 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                        {selectedDay.description}
                    </p>
                </div>

                <div className="space-y-4">
                    {selectedDay.prayers.map((prayer, index) => (
                        <div key={index} className={`p-6 rounded-3xl border transition-all
                            ${theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/[0.02] border-white/5'}`}>

                            <h3 className={`font-serif font-bold text-lg mb-4 flex items-center gap-2
                                ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`}>
                                <Heart className="w-4 h-4" /> {prayer.title}
                            </h3>

                            <div className="space-y-5">
                                {prayer.arabic && (
                                    <p className={`text-2xl font-arabic text-right leading-loose
                                        ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
                                        {prayer.arabic}
                                    </p>
                                )}

                                <div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 block
                                        ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>Okunuşu</span>
                                    <p className={`text-sm italic
                                        ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                                        "{prayer.reading}"
                                    </p>
                                </div>

                                <div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 block
                                        ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>Anlamı</span>
                                    <p className={`text-sm font-medium
                                        ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
                                        {prayer.meaning}
                                    </p>
                                </div>

                                {prayer.virtue && (
                                    <div className={`mt-4 p-4 rounded-xl text-xs flex items-start gap-3
                                        ${theme === 'light' ? 'bg-amber-50 text-amber-800' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                        <Star className="w-4 h-4 shrink-0 mt-0.5" />
                                        <p>{prayer.virtue}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn pb-24 h-full">
            <div className="text-center mb-8">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4
                    ${theme === 'light' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                    <Book className="w-5 h-5" />
                    <span className="font-bold text-sm">Özel Gün Duaları</span>
                </div>
                <h2 className={`text-2xl font-serif font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                    Dini Günler Dua Rehberi
                </h2>
                <p className={`text-sm mt-2 px-4 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    Kandiller, mübarek geceler ve cuma günlerinde edebileceğiniz faziletli dualar.
                </p>
            </div>

            <div className="space-y-3">
                {SPECIAL_DAYS_PRAYERS.map(day => (
                    <button
                        key={day.id}
                        onClick={() => setSelectedDay(day)}
                        className={`w-full text-left p-5 rounded-3xl border transition-all duration-300 group flex items-center justify-between
                            ${theme === 'light'
                                ? 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md'
                                : 'bg-white/[0.02] border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.04]'}`}
                    >
                        <div>
                            <h3 className={`font-serif font-bold text-lg mb-1
                                ${theme === 'light' ? 'text-slate-800' : 'text-slate-100'}`}>
                                {day.dayName}
                            </h3>
                            <p className={`text-xs line-clamp-1
                                ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                                {day.description}
                            </p>
                        </div>
                        <div className={`p-2 rounded-full transition-colors
                            ${theme === 'light' ? 'bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500' : 'bg-white/5 text-slate-500 group-hover:bg-emerald-500/20 group-hover:text-emerald-400'}`}>
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ReligiousDaysPrayersView;
