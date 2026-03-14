import React, { useState, useEffect } from 'react';
import { Book, ChevronRight, ArrowLeft, Star, Heart, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../../core/ThemeContext';
import { storageService } from '../../services/storage.service';

interface Prayer {
    id?: string;
    title: string;
    arabic?: string;
    reading: string;
    meaning: string;
    virtue?: string;
    isCustom?: boolean;
}

interface SpecialDayPrayer {
    id: string;
    dayName: string;
    description: string;
    prayers: Prayer[];
    isCustom?: boolean;
}

const STATIC_DAYS_PRAYERS: SpecialDayPrayer[] = [
    {
        id: 'static_1',
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
        id: 'static_2',
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
    }
];

const ReligiousDaysPrayersView: React.FC = () => {
    const { theme } = useTheme();
    const [selectedDay, setSelectedDay] = useState<SpecialDayPrayer | null>(null);
    const [customDays, setCustomDays] = useState<any[]>([]);
    const [customItems, setCustomItems] = useState<any[]>([]);
    
    // Management states
    const [isAddingDay, setIsAddingDay] = useState(false);
    const [newDayTitle, setNewDayTitle] = useState('');
    const [newDayDesc, setNewDayDesc] = useState('');
    
    const [isAddingPrayer, setIsAddingPrayer] = useState(false);
    const [newPrayer, setNewPrayer] = useState<Partial<Prayer>>({ title: '', reading: '', meaning: '', arabic: '', virtue: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const days = await storageService.getReligiousDays();
        const items = await storageService.getReligiousDayItems();
        setCustomDays(days);
        setCustomItems(items);
    };

    const handleAddDay = async () => {
        if (!newDayTitle.trim()) return;
        await storageService.addReligiousDay(newDayTitle.trim(), newDayDesc.trim());
        await loadData();
        setNewDayTitle('');
        setNewDayDesc('');
        setIsAddingDay(false);
    };

    const handleDeleteDay = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Bu günü ve içindeki tüm duaları silmek istediğine emin misin?')) {
            await storageService.deleteReligiousDay(id);
            await loadData();
        }
    };

    const handleAddPrayer = async () => {
        if (!selectedDay || !newPrayer.title || !newPrayer.reading) return;
        const text = JSON.stringify(newPrayer);
        await storageService.addReligiousDayItem(selectedDay.id, 'dua', text);
        await loadData();
        setNewPrayer({ title: '', reading: '', meaning: '', arabic: '', virtue: '' });
        setIsAddingPrayer(false);
    };

    const handleDeletePrayer = async (itemId: string) => {
        if (window.confirm('Bu duayı silmek istediğine emin misin?')) {
            await storageService.deleteReligiousDayItem(itemId);
            await loadData();
        }
    };

    // Merge static and custom
    const allDays = [
        ...STATIC_DAYS_PRAYERS.map(d => ({ ...d, isCustom: false })),
        ...customDays.map(d => ({
            id: d.id,
            dayName: d.title,
            description: d.date || '', // date field used as description here
            prayers: customItems
                .filter(i => i.dayId === d.id && i.type === 'dua')
                .map(i => {
                    try {
                        return { ...JSON.parse(i.text), id: i.id, isCustom: true };
                    } catch {
                        return { title: 'Hatalı Veri', reading: i.text, meaning: '', id: i.id, isCustom: true };
                    }
                }),
            isCustom: true
        }))
    ];

    if (selectedDay) {
        // Re-find selected day in allDays to get updated context
        const currentSelected = allDays.find(d => d.id === selectedDay.id) || selectedDay;
        
        return (
            <div className="space-y-6 animate-fadeIn pb-24 h-full">
                <button
                    onClick={() => setSelectedDay(null)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95
                        ${theme === 'light' ? 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm' : 'bg-white/10 text-slate-300 border border-white/5'}`}
                >
                    <ArrowLeft className="w-4 h-4" /> Vazgeç
                </button>

                <div className="text-center mb-8">
                    <h2 className={`text-2xl font-serif font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                        {currentSelected.dayName} Duaları
                    </h2>
                    <p className={`text-sm mt-2 px-4 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                        {currentSelected.description}
                    </p>
                </div>

                {/* Add Prayer Form for Custom Days */}
                {currentSelected.isCustom && (
                    <div className={`p-6 rounded-[2rem] border-2 border-dashed transition-all mb-6
                        ${theme === 'light' ? 'bg-emerald-50/50 border-emerald-200' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                        {isAddingPrayer ? (
                            <div className="space-y-4 animate-fadeIn">
                                <input
                                    type="text"
                                    placeholder="Dua Başlığı"
                                    value={newPrayer.title}
                                    onChange={e => setNewPrayer({...newPrayer, title: e.target.value})}
                                    className={`w-full p-3 rounded-xl border text-sm ${theme === 'light' ? 'bg-white' : 'bg-black/40 text-white border-white/10'}`}
                                />
                                <textarea
                                    placeholder="Arapça Metin (Opsiyonel)"
                                    value={newPrayer.arabic}
                                    onChange={e => setNewPrayer({...newPrayer, arabic: e.target.value})}
                                    className={`w-full p-3 rounded-xl border text-sm font-arabic text-right ${theme === 'light' ? 'bg-white' : 'bg-black/40 text-white border-white/10'}`}
                                />
                                <textarea
                                    placeholder="Okunuşu"
                                    value={newPrayer.reading}
                                    onChange={e => setNewPrayer({...newPrayer, reading: e.target.value})}
                                    className={`w-full p-3 rounded-xl border text-sm ${theme === 'light' ? 'bg-white' : 'bg-black/40 text-white border-white/10'}`}
                                />
                                <textarea
                                    placeholder="Anlamı"
                                    value={newPrayer.meaning}
                                    onChange={e => setNewPrayer({...newPrayer, meaning: e.target.value})}
                                    className={`w-full p-3 rounded-xl border text-sm ${theme === 'light' ? 'bg-white' : 'bg-black/40 text-white border-white/10'}`}
                                />
                                <div className="flex gap-2">
                                    <button onClick={handleAddPrayer} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-bold">Kaydet</button>
                                    <button onClick={() => setIsAddingPrayer(false)} className="px-6 bg-slate-500 text-white rounded-xl font-bold">İptal</button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => setIsAddingPrayer(true)} className="w-full flex items-center justify-center gap-2 text-emerald-600 font-bold py-2">
                                <Plus className="w-5 h-5" /> Yeni Dua Ekle
                            </button>
                        )}
                    </div>
                )}

                <div className="space-y-4">
                    {currentSelected.prayers.map((prayer, index) => (
                        <div key={index} className={`p-6 rounded-[2rem] border transition-all relative group
                            ${theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/[0.02] border-white/5'}`}>
                            
                            {prayer.isCustom && (
                                <button
                                    onClick={() => prayer.id && handleDeletePrayer(prayer.id)}
                                    className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}

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
                                        ${theme === 'light' ? 'bg-amber-50 text-amber-800 border border-amber-100' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                        <Star className="w-4 h-4 shrink-0 mt-0.5" />
                                        <p>{prayer.virtue}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {currentSelected.prayers.length === 0 && (
                        <div className="text-center py-12 opacity-50 italic">
                            Henüz bu kategoriye dua eklenmemiş.
                        </div>
                    )}
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
                    <span className="font-bold text-sm">Dua Rehberi</span>
                </div>
                <h2 className={`text-2xl font-serif font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                    Dua ve Niyaz Rehberi
                </h2>
                <p className={`text-sm mt-2 px-4 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    Kandiller, mübarek geceler ve kendi eklediğiniz özel dualar.
                </p>
            </div>

            {/* Add Custom Day Form */}
            <div className="px-2">
                {isAddingDay ? (
                    <div className={`p-6 rounded-[2.5rem] border-2 border-emerald-500/30 space-y-4 animate-fadeIn ${theme === 'light' ? 'bg-white' : 'bg-white/5'}`}>
                        <input
                            type="text"
                            placeholder="Kategori Adı (Örn: Borçlardan Kurtulma)"
                            value={newDayTitle}
                            onChange={e => setNewDayTitle(e.target.value)}
                            className={`w-full p-3 rounded-xl border text-sm ${theme === 'light' ? 'bg-white' : 'bg-black/40 text-white border-white/10'}`}
                            autoFocus
                        />
                        <input
                            type="text"
                            placeholder="Kısa Açıklama"
                            value={newDayDesc}
                            onChange={e => setNewDayDesc(e.target.value)}
                            className={`w-full p-3 rounded-xl border text-sm ${theme === 'light' ? 'bg-white' : 'bg-black/40 text-white border-white/10'}`}
                        />
                        <div className="flex gap-2">
                            <button onClick={handleAddDay} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-bold">Kategori Oluştur</button>
                            <button onClick={() => setIsAddingDay(false)} className="px-6 bg-slate-500 text-white rounded-xl font-bold">İptal</button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAddingDay(true)}
                        className={`w-full flex items-center justify-center gap-2 p-5 rounded-[2rem] border-2 border-dashed font-bold transition-all active:scale-95
                            ${theme === 'light' ? 'bg-white border-slate-200 text-emerald-600' : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'}`}
                    >
                        <Plus className="w-5 h-5" /> Yeni Dua Kategorisi Ekle
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {allDays.map(day => (
                    <button
                        key={day.id}
                        onClick={() => setSelectedDay(day)}
                        className={`w-full text-left p-6 rounded-[2rem] border transition-all duration-300 group flex items-center justify-between
                            ${theme === 'light'
                                ? 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-lg shadow-sm hover:-translate-y-1'
                                : 'bg-white/[0.03] border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.06] hover:-translate-y-1'}`}
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-serif font-bold text-lg
                                    ${theme === 'light' ? 'text-slate-800' : 'text-slate-100'}`}>
                                    {day.dayName}
                                </h3>
                                {day.isCustom && (
                                    <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Özel</span>
                                )}
                            </div>
                            <p className={`text-xs line-clamp-1 opacity-70
                                ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                                {day.description}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {day.isCustom && (
                                <div
                                    onClick={(e) => handleDeleteDay(day.id, e)}
                                    className="p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </div>
                            )}
                            <div className={`p-2 rounded-full transition-colors
                                ${theme === 'light' ? 'bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500' : 'bg-white/5 text-slate-500 group-hover:bg-emerald-500/20 group-hover:text-emerald-400'}`}>
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ReligiousDaysPrayersView;
