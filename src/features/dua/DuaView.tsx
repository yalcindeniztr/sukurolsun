import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BookHeart, RefreshCw, Heart, ChevronRight, Trash2 } from 'lucide-react';
import { ANNUAL_DUAS } from '../../core/duas_data';
import { useTheme } from '../../core/ThemeContext';
import { storageService } from '../../services/storage.service';
import { CustomPrayer } from '../../core/types';
import { AdMobService } from '../../services/AdMobService';
import { Preferences } from '@capacitor/preferences';

const DuaView: React.FC = () => {
    const { theme } = useTheme();

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

    const [customPrayers, setCustomPrayers] = useState<CustomPrayer[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newPrayerText, setNewPrayerText] = useState('');

    useEffect(() => {
        const loadData = async () => {
            // Favorileri yükle (Preferences'dan)
            try {
                const { value } = await Preferences.get({ key: 'sukurolsun_dua_favorites' });
                if (value) setFavorites(JSON.parse(value));
            } catch {
                const saved = localStorage.getItem('sukurolsun_dua_favorites');
                if (saved) { try { setFavorites(JSON.parse(saved)); } catch { /* */ } }
            }
            // Özel duaları yükle
            const prayers = await storageService.getCustomPrayers();
            setCustomPrayers(prayers);
            AdMobService.prepareInterstitial();
        };
        loadData();
    }, []);

    const handleAddCustomPrayerClick = async () => {
        await AdMobService.showInterstitial();
        AdMobService.prepareInterstitial();
        setIsAddModalOpen(true);
    };

    const saveCustomPrayer = async () => {
        if (!newPrayerText.trim()) return;
        const updated = await storageService.addCustomPrayer(newPrayerText);
        setCustomPrayers(updated);
        setNewPrayerText('');
        setIsAddModalOpen(false);
    };

    const handleDeleteCustomPrayer = async (id: string) => {
        if (window.confirm('Bu duayı silmek istediğinden emin misin?')) {
            const updated = await storageService.deleteCustomPrayer(id);
            setCustomPrayers(updated);
        }
    };

    const safeIndex = (currentIndex >= 0 && currentIndex < ANNUAL_DUAS.length) ? currentIndex : 0;
    const currentPrayer = ANNUAL_DUAS[safeIndex];

    const handleNext = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % ANNUAL_DUAS.length);
            setIsAnimating(false);
        }, 300);
    };

    const toggleFavorite = useCallback(async () => {
        const newFavorites = favorites.includes(currentIndex)
            ? favorites.filter(i => i !== currentIndex)
            : [...favorites, currentIndex];
        setFavorites(newFavorites);
        try {
            await Preferences.set({ key: 'sukurolsun_dua_favorites', value: JSON.stringify(newFavorites) });
        } catch {
            localStorage.setItem('sukurolsun_dua_favorites', JSON.stringify(newFavorites));
        }
    }, [favorites, currentIndex]);

    const isFavorite = favorites.includes(currentIndex);
    const isToday = currentIndex === todayIndex;

    return (
        <div className="space-y-6 animate-fadeIn pb-24">
            {/* Başlık */}
            <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border
                    ${theme === 'light'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}
                    style={{ boxShadow: theme === 'dark' ? '0 0 20px -5px rgba(16,185,129,0.2)' : undefined }}
                >
                    <BookHeart className="w-5 h-5" />
                    <span className="text-sm font-bold">
                        {isToday ? "Günün Duası" : "Dua Hazinesi"}
                    </span>
                </div>
            </div>

            {/* Dua Kartı - 3D */}
            <div className={`glass-card relative overflow-hidden p-8 md:p-10 rounded-3xl transition-all duration-500 transform
                ${isAnimating ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}
                ${theme === 'light' ? 'bg-white/70 border-slate-200/50 shadow-depth-light' : ''}
            `}>
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full pointer-events-none
                    ${theme === 'light' ? 'bg-emerald-400/8' : 'bg-emerald-400/[0.04]'}`} />
                <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-tr-full pointer-events-none
                    ${theme === 'light' ? 'bg-amber-400/8' : 'bg-amber-400/[0.03]'}`} />

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className={`mb-6 font-serif text-4xl
                        ${theme === 'light' ? 'text-emerald-600/20' : 'text-emerald-400/20'}`}>
                        {safeIndex + 1}
                    </div>

                    <div className="mb-8">
                        <p className={`text-xl md:text-2xl font-medium leading-relaxed font-serif transition-colors
                            ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                            "{currentPrayer?.text}"
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-emerald-400/50"></div>
                        <span className={`text-sm font-bold tracking-wider uppercase
                            ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`}>
                            {currentPrayer?.source}
                        </span>
                        <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-emerald-400/50"></div>
                    </div>
                </div>
            </div>

            {/* Aksiyonlar - 3D Butonlar */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={toggleFavorite}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 active:scale-95 font-bold
                        ${isFavorite
                            ? (theme === 'light'
                                ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-sm'
                                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30')
                            : (theme === 'light'
                                ? 'bg-white text-slate-600 border border-slate-200 shadow-sm hover:bg-slate-50'
                                : 'bg-white/[0.04] text-slate-400 border border-white/[0.08] hover:bg-white/[0.08]')
                        }`}
                >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    <span className="text-sm">{isFavorite ? 'Favorilerde' : 'Favorile'}</span>
                </button>

                <button
                    onClick={handleNext}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 active:scale-95 font-bold
                        ${theme === 'light'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm hover:bg-emerald-100'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                        }`}
                >
                    <RefreshCw className="w-5 h-5" />
                    <span className="text-sm">Başka Bir Dua</span>
                </button>
            </div>

            {/* Kendi Dualarım - 3D Kart */}
            <div className={`mt-12 p-6 rounded-3xl animate-slide-up transition-colors duration-500
                ${theme === 'light'
                    ? 'bg-white/70 border border-slate-200/50 shadow-depth-light'
                    : 'bg-white/[0.03] border border-white/[0.06]'}
            `}>
                <div className="flex justify-between items-end mb-6">
                    <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2
                        ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                        <Heart className={`w-4 h-4 ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                        Benim Dualarım ({customPrayers.length})
                    </h3>
                    <button
                        onClick={handleAddCustomPrayerClick}
                        className="text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-400 px-4 py-2 rounded-xl active:scale-95 transition-all"
                        style={{ boxShadow: '0 4px 14px -3px rgba(16,185,129,0.4)' }}
                    >
                        + Dua Ekle
                    </button>
                </div>

                {customPrayers.length === 0 ? (
                    <div className={`text-center py-10 rounded-2xl border-2 border-dashed transition-colors
                        ${theme === 'light' ? 'border-slate-200 bg-slate-50/50' : 'border-slate-700 bg-slate-800/30'}`}>
                        <p className={`text-sm font-medium ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Henüz özel bir dua eklemedin.</p>
                        <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>İçinden gelenleri Rabbine arz etmek için ekle.</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {customPrayers.map((prayer) => (
                            <div
                                key={prayer.id}
                                className={`group w-full text-left p-5 rounded-2xl transition-all relative border
                                    ${theme === 'light'
                                        ? 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200'
                                        : 'bg-white/[0.03] border-white/[0.05] hover:bg-white/[0.06] hover:border-emerald-500/30'}`}
                            >
                                <p className={`text-base font-serif leading-relaxed ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                                    "{prayer.text}"
                                </p>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteCustomPrayer(prayer.id); }}
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
                    <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2
                        ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
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
                                    className={`group w-full text-left p-4 rounded-2xl transition-all cursor-pointer flex justify-between items-center border
                                        ${theme === 'light'
                                            ? 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200'
                                            : 'bg-white/[0.03] border-white/[0.06] hover:bg-emerald-500/[0.06] hover:border-emerald-500/20'}`}
                                >
                                    <div className="pr-4">
                                        <p className={`text-sm line-clamp-1 transition-colors
                                            ${theme === 'light' ? 'text-slate-700 group-hover:text-emerald-700' : 'text-slate-300 group-hover:text-emerald-300'}`}>
                                            {dua.text}
                                        </p>
                                        <span className={`text-xs mt-1 block ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {dua.source}
                                        </span>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight className={`w-4 h-4 ${theme === 'light' ? 'text-emerald-500' : 'text-emerald-400'}`} />
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
                    <div className={`w-full max-w-md p-6 rounded-3xl animate-scale-in border
                        ${theme === 'light'
                            ? 'bg-white border-slate-200 shadow-2xl'
                            : 'bg-[#0c2219] border-white/[0.08] shadow-2xl'}`}
                        style={{ boxShadow: '0 25px 60px -12px rgba(0,0,0,0.5)' }}
                    >
                        <h3 className={`text-xl font-serif font-medium mb-4
                            ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>Yeni Dua Ekle</h3>

                        <textarea
                            value={newPrayerText}
                            onChange={(e) => setNewPrayerText(e.target.value)}
                            placeholder="İçinden geçenleri Rabbine arz et..."
                            className={`w-full h-32 p-4 rounded-2xl resize-none text-base outline-none transition-all border
                                ${theme === 'light'
                                    ? 'bg-slate-50 text-slate-800 border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                                    : 'bg-white/[0.03] text-slate-100 border-white/[0.08] focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20'}`}
                        />

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className={`px-4 py-2 text-sm font-bold transition-colors
                                    ${theme === 'light' ? 'text-slate-500 hover:text-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Vazgeç
                            </button>
                            <button
                                onClick={saveCustomPrayer}
                                disabled={!newPrayerText.trim()}
                                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                                style={{ boxShadow: '0 4px 14px -3px rgba(16,185,129,0.4)' }}
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
