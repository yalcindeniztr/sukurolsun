import React, { useEffect, useState } from 'react';
import { BookOpen, Search, Bookmark, Share2, Copy, ArrowLeft, Star, Filter, Check } from 'lucide-react';
import { QuranService, SURAH_LIST, SurahMeta, Ayah, QuranBookmark } from '../../services/QuranService';
import { useTheme } from '../../core/ThemeContext';
import { Share } from '@capacitor/share';

const QuranView: React.FC = () => {
    const { theme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedJuz, setSelectedJuz] = useState<number | 'all'>('all');
    const [selectedSurah, setSelectedSurah] = useState<SurahMeta | null>(null);
    const [ayahs, setAyahs] = useState<Ayah[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [fontSize, setFontSize] = useState<number>(18);
    const [bookmark, setBookmark] = useState<QuranBookmark | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [copiedAyah, setCopiedAyah] = useState<number | null>(null);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        const activeBookmark = await QuranService.getBookmark();
        setBookmark(activeBookmark);
        const favs = await QuranService.getFavorites();
        setFavorites(favs);
    };

    const handleSelectSurah = async (surah: SurahMeta, targetAyah?: number) => {
        setSelectedSurah(surah);
        setLoading(true);
        setErrorMsg(null);
        try {
            const data = await QuranService.getSurahAyahs(surah.number);
            setAyahs(data);
            if (targetAyah) {
                setTimeout(() => {
                    const el = document.getElementById(`ayah-${targetAyah}`);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 400);
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'Sure yüklenirken hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBookmark = async (surah: SurahMeta, ayahNumber: number) => {
        const newBookmark: QuranBookmark = {
            surahNumber: surah.number,
            surahName: surah.name,
            ayahNumber,
            timestamp: Date.now()
        };
        await QuranService.saveBookmark(newBookmark);
        setBookmark(newBookmark);
    };

    const handleToggleFav = async (surahNumber: number, ayahNumber: number) => {
        const updated = await QuranService.toggleFavorite(surahNumber, ayahNumber);
        setFavorites(updated);
    };

    const handleCopyAyah = (surahName: string, ayahNo: number, text: string) => {
        const textToCopy = `"${text}"\n\n(Kuran-ı Kerim Meali - Elmalılı H. Yazır, ${surahName} Suresi ${ayahNo}. Ayet)`;
        navigator.clipboard.writeText(textToCopy);
        setCopiedAyah(ayahNo);
        setTimeout(() => setCopiedAyah(null), 2000);
    };

    const handleShareAyah = async (surahName: string, ayahNo: number, text: string) => {
        const message = `"${text}"\n\n(Kuran-ı Kerim Meali - Elmalılı H. Yazır, ${surahName} Suresi ${ayahNo}. Ayet)`;
        try {
            await Share.share({
                title: `${surahName} Suresi ${ayahNo}. Ayet`,
                text: message,
                dialogTitle: 'Ayeti Paylaş'
            });
        } catch (e) {
            if (navigator.share) {
                navigator.share({ title: `${surahName} Suresi`, text: message }).catch(() => {});
            }
        }
    };

    const filteredSurahs = SURAH_LIST.filter(surah => {
        const matchSearch = surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            String(surah.number).includes(searchQuery);
        const matchJuz = selectedJuz === 'all' || surah.juz === selectedJuz;
        return matchSearch && matchJuz;
    });

    return (
        <div className="space-y-4 pb-28 animate-fadeIn max-w-3xl mx-auto px-1">
            {/* Header Banner */}
            <div className={`relative overflow-hidden rounded-3xl p-6 text-slate-800 card-3d-embossed hologram-shimmer
                ${theme === 'light'
                    ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50/40 border-emerald-200/80 shadow-depth-light'
                    : 'bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 border-emerald-500/30'}`}
            >
                <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
                    <BookOpen className="w-48 h-48 text-emerald-600 dark:text-emerald-400" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-2xl embossed-button flex items-center justify-center text-white shadow-lg">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">
                                Kuran-ı Kerim
                            </span>
                            <h2 className={`text-2xl font-serif font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                                Türkçe Meali
                            </h2>
                        </div>
                    </div>
                    <p className={`text-xs font-medium ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                        Elmalılı Muhammet Hamdi Yazır Hak Dini Kur'an Dili sadeleştirilmiş meal tercümesi.
                    </p>

                    {/* Bookmark Quick Jump */}
                    {bookmark && !selectedSurah && (
                        <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                                <Bookmark className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                                <span>Son Kaldığınız Yer: <strong>{bookmark.surahName} {bookmark.ayahNumber}. Ayet</strong></span>
                            </div>
                            <button
                                onClick={() => {
                                    const targetSurah = SURAH_LIST.find(s => s.number === bookmark.surahNumber);
                                    if (targetSurah) handleSelectSurah(targetSurah, bookmark.ayahNumber);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-black shadow-md hover:bg-emerald-600 active:scale-95 transition-all"
                            >
                                Devam Et
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Reader View */}
            {selectedSurah ? (
                <div className="space-y-4 animate-scale-in">
                    {/* Top Bar Navigation & Settings */}
                    <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 sticky top-[108px] z-30 backdrop-blur-2xl shadow-md
                        ${theme === 'light' ? 'bg-white/90 border-slate-200/80' : 'bg-slate-900/90 border-white/10'}`}
                    >
                        <button
                            onClick={() => setSelectedSurah(null)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white font-bold text-xs active:scale-95 transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Sureler</span>
                        </button>

                        <div className="text-center flex-1 min-w-0">
                            <h3 className={`text-base font-serif font-black truncate ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                                {selectedSurah.number}. {selectedSurah.name} Suresi
                            </h3>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                {selectedSurah.arabicName} • {selectedSurah.numberOfAyahs} Ayet • {selectedSurah.revelationType}
                            </p>
                        </div>

                        {/* Font Size Adjuster */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white flex items-center justify-center font-bold text-xs"
                                title="Yazıyı Küçült"
                            >
                                A-
                            </button>
                            <button
                                onClick={() => setFontSize(prev => Math.min(28, prev + 2))}
                                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white flex items-center justify-center font-bold text-xs"
                                title="Yazıyı Büyüt"
                            >
                                A+
                            </button>
                        </div>
                    </div>

                    {/* Bismillah Header (except Tawbah - Surah 9) */}
                    {selectedSurah.number !== 9 && (
                        <div className="text-center py-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                            <p className="text-2xl font-serif text-emerald-700 dark:text-emerald-300 tracking-wider">
                                ﷽
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium italic">
                                Rahmân ve Rahîm olan Allah'ın ismiyle
                            </p>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="py-20 text-center space-y-3">
                            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Meal Yükleniyor...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {errorMsg && (
                        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-center">
                            <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{errorMsg}</p>
                            <button
                                onClick={() => handleSelectSurah(selectedSurah)}
                                className="mt-3 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md"
                            >
                                Tekrar Dene
                            </button>
                        </div>
                    )}

                    {/* Ayahs Container */}
                    {!loading && !errorMsg && (
                        <div className="space-y-3">
                            {ayahs.map((ayah) => {
                                const isBookmarked = bookmark?.surahNumber === selectedSurah.number && bookmark?.ayahNumber === ayah.number;
                                const isFav = favorites.includes(`${selectedSurah.number}:${ayah.number}`);

                                return (
                                    <div
                                        key={ayah.number}
                                        id={`ayah-${ayah.number}`}
                                        className={`p-4 rounded-2xl border transition-all relative ${
                                            isBookmarked
                                                ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md ring-2 ring-emerald-500/30'
                                                : theme === 'light'
                                                    ? 'bg-white border-slate-100 shadow-sm hover:border-emerald-200'
                                                    : 'bg-slate-900/50 border-white/5 hover:border-white/20'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-white/5">
                                            <div className="flex items-center gap-2">
                                                <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/20">
                                                    {ayah.number}
                                                </span>
                                                <span className="text-[11px] font-bold text-slate-400">
                                                    Ayet {ayah.number}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                {/* Save Bookmark */}
                                                <button
                                                    onClick={() => handleSaveBookmark(selectedSurah, ayah.number)}
                                                    className={`p-1.5 rounded-lg transition-colors ${
                                                        isBookmarked
                                                            ? 'bg-emerald-500 text-white'
                                                            : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-white/5'
                                                    }`}
                                                    title={isBookmarked ? 'Kaldığınız Ayraç' : 'Kaldığım Yeri Kaydet'}
                                                >
                                                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
                                                </button>

                                                {/* Favorite Ayah */}
                                                <button
                                                    onClick={() => handleToggleFav(selectedSurah.number, ayah.number)}
                                                    className={`p-1.5 rounded-lg transition-colors ${
                                                        isFav
                                                            ? 'text-amber-500 bg-amber-500/10'
                                                            : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-white/5'
                                                    }`}
                                                    title="Favorilere Ekle"
                                                >
                                                    <Star className={`w-4 h-4 ${isFav ? 'fill-amber-500' : ''}`} />
                                                </button>

                                                {/* Copy Ayah */}
                                                <button
                                                    onClick={() => handleCopyAyah(selectedSurah.name, ayah.number, ayah.text)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                                                    title="Ayeti Kopyala"
                                                >
                                                    {copiedAyah === ayah.number ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                                </button>

                                                {/* Share Ayah */}
                                                <button
                                                    onClick={() => handleShareAyah(selectedSurah.name, ayah.number, ayah.text)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                                                    title="Ayeti Paylaş"
                                                >
                                                    <Share2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <p
                                            style={{ fontSize: `${fontSize}px`, lineHeight: '1.75' }}
                                            className={`font-sans ${theme === 'light' ? 'text-slate-800' : 'text-slate-100'}`}
                                        >
                                            {ayah.text}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ) : (
                /* Surah Grid Selection View */
                <div className="space-y-4">
                    {/* Search Bar & Juz Filter */}
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2.5">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Sure adı veya numarası ile ara... (Örn: Yasin, 36, Bakara)"
                                className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-xs font-bold outline-none shadow-sm transition-all
                                    ${theme === 'light'
                                        ? 'bg-white border-slate-200 focus:border-emerald-500 text-slate-800'
                                        : 'bg-slate-900/80 border-white/10 focus:border-emerald-400 text-white'}`}
                            />
                        </div>

                        {/* Juz Filter */}
                        <div className="relative">
                            <select
                                value={selectedJuz}
                                onChange={(e) => setSelectedJuz(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                                className={`h-11 px-4 rounded-2xl border text-xs font-bold outline-none appearance-none pr-8 cursor-pointer w-full
                                    ${theme === 'light'
                                        ? 'bg-white border-slate-200 text-slate-800'
                                        : 'bg-slate-900/80 border-white/10 text-white'}`}
                            >
                                <option value="all">Tüm Cüzler (1-30)</option>
                                {Array.from({ length: 30 }, (_, i) => i + 1).map(juz => (
                                    <option key={juz} value={juz}>{juz}. Cüz</option>
                                ))}
                            </select>
                            <Filter className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Surahs Count Badge */}
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[11px] font-bold text-slate-400">
                            Toplam {filteredSurahs.length} Sure Gösteriliyor
                        </span>
                    </div>

                    {/* Surahs Cards List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {filteredSurahs.map((surah) => {
                            const isBookmarkedSurah = bookmark?.surahNumber === surah.number;

                            return (
                                <button
                                    key={surah.number}
                                    onClick={() => handleSelectSurah(surah)}
                                    className={`p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all card-3d-embossed group relative overflow-hidden
                                        ${theme === 'light'
                                            ? 'bg-white border-slate-100 hover:border-emerald-300'
                                            : 'bg-slate-900/40 border-white/5 hover:border-emerald-500/40'}`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-serif font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                                            {surah.number}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className={`text-sm font-serif font-black truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                                                {surah.name} Suresi
                                            </h4>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                                {surah.numberOfAyahs} Ayet • {surah.revelationType} • {surah.juz}. Cüz
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <p className="font-serif text-base text-emerald-700 dark:text-emerald-300 font-black">
                                            {surah.arabicName}
                                        </p>
                                        {isBookmarkedSurah && (
                                            <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1">
                                                <Bookmark className="w-2.5 h-2.5 fill-emerald-500" />
                                                Kaldığın Yer
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuranView;
