import React, { useState, useEffect, useMemo } from 'react';
import { BookHeart, RefreshCw, Heart, ChevronRight, Trash2 } from 'lucide-react';
import { ANNUAL_DUAS } from '../../core/duas_data';
import { useTheme } from '../../core/ThemeContext';
import { storageService } from '../../services/storage.service';
import { CustomPrayer } from '../../core/types';
import { AdMobService } from '../../services/AdMobService';

const DuaView: React.FC = () => {
    const { theme } = useTheme();

    // Başlangıçta bugünün index'ini hesapla
    const todayIndex = useMemo(() => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        return dayOfYear % ANNUAL_DUAS.length;
    }, []);

    const [currentIndex, setCurrentIndex] = useState(todayIndex);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);

    // My Prayers State
    const [customPrayers, setCustomPrayers] = useState<CustomPrayer[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newPrayerText, setNewPrayerText] = useState('');

    // localStorage'dan favorileri ve custom duaları yükle + Reklam Hazırla
    useEffect(() => {
        const saved = localStorage.getItem('sukurolsun_dua_favorites');
        if (saved) {
            setFavorites(JSON.parse(saved));
        }

        // Custom duaları yükle
        setCustomPrayers(storageService.getCustomPrayers());

        // Geçiş reklamını önceden hazırla (Preload)
        AdMobService.prepareInterstitial();
    }, []);

    const handleAddCustomPrayerClick = async () => {
        // Reklam göster (Sıklık kontrolü servisin içinde)
        await AdMobService.showInterstitial();
        AdMobService.prepareInterstitial(); // Bir sonraki için hazırla

        setIsAddModalOpen(true);
    };

    const saveCustomPrayer = () => {
        if (!newPrayerText.trim()) return;

        const updated = storageService.addCustomPrayer(newPrayerText);
        setCustomPrayers(updated);
        setNewPrayerText('');
        setIsAddModalOpen(false);
    };

    const handleDeleteCustomPrayer = (id: string) => {
        if (window.confirm('Bu duayı silmek istediğinden emin misin?')) {
            const updated = storageService.deleteCustomPrayer(id);
            setCustomPrayers(updated);
        }
    };

    // Güvenlik kontrolü: currentIndex sınırların dışındaysa düzelt
    const safeIndex = (currentIndex >= 0 && currentIndex < ANNUAL_DUAS.length) ? currentIndex : 0;
    const currentPrayer = ANNUAL_DUAS[safeIndex];

    // Manuel olarak sonrakine geçiş
    const handleNext = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % ANNUAL_DUAS.length);
            setIsAnimating(false);
        }, 300);
    };

    const toggleFavorite = () => {
        const newFavorites = favorites.includes(currentIndex)
            ? favorites.filter(i => i !== currentIndex)
            : [...favorites, currentIndex];

        setFavorites(newFavorites);
        localStorage.setItem('sukurolsun_dua_favorites', JSON.stringify(newFavorites));
    };

    const isFavorite = favorites.includes(currentIndex);
    const isToday = currentIndex === todayIndex;

    return (
        <div className="space-y-6 animate-fadeIn pb-24">
            {/* Header */}
            <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-glow-teal
                    ${theme === 'light' ? 'bg-teal-500/10 border-teal-500/30' : 'bg-teal-500/10 border-teal-500/20'}
                `}>
                    <BookHeart className={`w-5 h-5 ${theme === 'light' ? 'text-teal-600' : 'text-teal-400'}`} />
                    <span className={`text-sm font-medium ${theme === 'light' ? 'text-teal-700' : 'text-teal-300'}`}>
                        {isToday ? "Günün Duası" : "Dua Hazinesi"}
                    </span>
                </div>
            </div>

            {/* Dua Kartı */}
            <div className={`glass-card relative overflow-hidden p-8 md:p-10 rounded-3xl transition-all duration-500 transform ${isAnimating ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}
                 ${theme === 'light' ? 'bg-white/40 border-slate-200 shadow-xl shadow-slate-200/50' : ''}
            `}>

                {/* Arka Plan Dekoru */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full pointer-events-none ${theme === 'light' ? 'bg-teal-600/10' : 'bg-teal-500/5'}`} />
                <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-tr-full pointer-events-none ${theme === 'light' ? 'bg-amber-500/10' : 'bg-amber-500/5'}`} />

                {/* İçerik */}
                <div className="relative z-10 flex flex-col items-center text-center">

                    {/* Numara */}
                    <div className={`mb-6 font-serif text-4xl ${theme === 'light' ? 'text-teal-700/20' : 'text-teal-200 opacity-30'}`}>
                        {safeIndex + 1}
                    </div>

                    {/* Türkçe Metin */}
                    <div className="mb-8">
                        <p className={`text-xl md:text-2xl font-medium leading-relaxed drop-shadow-sm font-serif transition-colors duration-300
                            ${theme === 'light' ? 'text-slate-800' : 'text-slate-100'}
                        `}>
                            "{currentPrayer?.text}"
                        </p>
                    </div>

                    {/* Kaynak */}
                    <div className="flex items-center gap-3">
                        <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-teal-500/50"></div>
                        <span className={`text-sm font-medium tracking-wide uppercase ${theme === 'light' ? 'text-teal-700' : 'text-teal-400'}`}>
                            {currentPrayer?.source}
                        </span>
                        <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-teal-500/50"></div>
                    </div>
                </div>
            </div>

            {/* Aksiyonlar */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={toggleFavorite}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg active:scale-95
                        ${isFavorite
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-rose-900/10'
                            : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                        }`}
                >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">{isFavorite ? 'Favorilerde' : 'Favorile'}</span>
                </button>

                <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:bg-teal-500/30 transition-all duration-300 shadow-lg shadow-teal-900/10 active:scale-95"
                >
                    <RefreshCw className="w-5 h-5" />
                    <span className="text-sm font-medium">Baska Bir Dua</span>
                </button>
            </div>

            {/* Kendi Dualarım Bölümü - Enhanced UI */}
            <div className={`mt-12 p-6 rounded-3xl animate-slide-up transition-colors duration-500
                ${theme === 'light' ? 'bg-white/40 border border-slate-200/60 shadow-xl shadow-slate-200/40' : 'bg-white/5 border border-white/10'}
            `}>
                <div className="flex justify-between items-end mb-6">
                    <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2
                        ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}
                    `}>
                        <Heart className="w-4 h-4 text-teal-500" />
                        Benim Dualarım ({customPrayers.length})
                    </h3>
                    <button
                        onClick={handleAddCustomPrayerClick}
                        className="text-xs font-bold text-white bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-xl shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
                    >
                        + Dua Ekle
                    </button>
                </div>

                {customPrayers.length === 0 ? (
                    <div className={`text-center py-10 rounded-2xl border-2 border-dashed transition-colors
                        ${theme === 'light' ? 'border-slate-200 bg-slate-50/50' : 'border-slate-700 bg-slate-800/30'}
                    `}>
                        <p className={`text-sm font-medium ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Henüz özel bir dua eklemedin.</p>
                        <p className="text-xs text-slate-400 mt-1">İçinden gelenleri Rabbine arz etmek için ekle.</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {customPrayers.map((prayer) => (
                            <div
                                key={prayer.id}
                                className={`group w-full text-left p-5 rounded-2xl transition-all relative border
                                    ${theme === 'light'
                                        ? 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-teal-200'
                                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-teal-500/30'}
                                `}
                            >
                                <p className={`text-base font-serif leading-relaxed ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                                    "{prayer.text}"
                                </p>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteCustomPrayer(prayer.id);
                                        }}
                                        className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                                        title="Duayı Sil"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Favori Dualar Listesi */}
            {favorites.length > 0 && (
                <div className="mt-12 animate-slide-up">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <BookHeart className="w-4 h-4" />
                        Favori Hazinem ({favorites.length})
                    </h3>
                    <div className="grid gap-3">
                        {favorites.map((index) => {
                            if (index >= ANNUAL_DUAS.length) return null;
                            const dua = ANNUAL_DUAS[index];
                            return (
                                <div
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className="group w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-teal-500/10 hover:border-teal-500/30 transition-all cursor-pointer flex justify-between items-center"
                                >
                                    <div className="pr-4">
                                        <p className="text-sm text-slate-300 line-clamp-1 group-hover:text-teal-200 transition-colors">
                                            {dua.text}
                                        </p>
                                        <span className="text-xs text-slate-500 mt-1 block">
                                            {dua.source}
                                        </span>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight className="w-4 h-4 text-teal-400" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Dua Ekleme Modalı */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl animate-scale-in border ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'}`}>
                        <h3 className={`text-xl font-serif font-medium mb-4 ${theme === 'light' ? 'text-slate-800' : 'text-slate-100'}`}>Yeni Dua Ekle</h3>

                        <textarea
                            value={newPrayerText}
                            onChange={(e) => setNewPrayerText(e.target.value)}
                            placeholder="İçinden geçenleri Rabbine arz et..."
                            className={`w-full h-32 p-4 rounded-xl resize-none text-base outline-none transition-all border
                                ${theme === 'light'
                                    ? 'bg-slate-50 text-slate-800 border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                                    : 'bg-slate-950 text-slate-200 border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'}
                            `}
                        />

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-400 transition-colors"
                            >
                                Vazgeç
                            </button>
                            <button
                                onClick={saveCustomPrayer}
                                disabled={!newPrayerText.trim()}
                                className="px-6 py-2 bg-teal-500 hover:bg-teal-400 text-white text-sm font-medium rounded-xl shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DuaView;
