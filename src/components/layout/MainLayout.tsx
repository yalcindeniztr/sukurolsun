import React, { useState } from 'react';
import { Menu, Home, ArrowLeft } from 'lucide-react';
import Sidebar from './Sidebar';
import { UserProfile } from '../../core/types';
import { AVATARS } from '../../constants';
import { useTheme } from '../../core/ThemeContext';
import { useLanguage } from '../../core/LanguageContext';

interface MainLayoutProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
    profile: UserProfile | null;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, activeTab, onTabChange, profile }) => {
    const { language, t } = useLanguage();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isCustomAvatar = profile?.avatarId?.startsWith('data:image') || false;
    const avatarUrl = isCustomAvatar
        ? profile!.avatarId
        : (AVATARS.find(url => url.includes(profile?.avatarId || 'avatar_1')) || AVATARS[0]);

    const handleTabChange = (tab: string) => {
        onTabChange(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSidebarTabChange = (tab: string) => {
        handleTabChange(tab);
        setIsSidebarOpen(false);
    };

    const { bgImage } = useTheme();

    return (
        <div className="min-h-screen w-full relative overflow-x-hidden bg-[#f0fdf4] text-slate-800 theme-bg" data-theme-bg={bgImage}>

            {/* Dekoratif Arka Plan (Sadece Default temada belirgin) */}
            {bgImage === 'default' && (
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-20 right-[-50px] w-[300px] h-[300px] rounded-full blur-[120px] bg-emerald-300/20" />
                    <div className="absolute bottom-40 left-[-80px] w-[350px] h-[350px] rounded-full blur-[120px] bg-emerald-200/15" />
                    <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] rounded-full blur-[80px] bg-amber-200/10" />
                </div>
            )}

            {/* Koyulaştırıcı / Karartıcı Overlay (Resim seçiliyse yazılar okunsun diye) */}
            {bgImage !== 'default' && (
                <div className="fixed inset-0 pointer-events-none bg-white/60 backdrop-blur-[2px]" />
            )}

            {/* Üst Kısım Yapışkan - Tarih, Saat ve Header */}
            <div className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b pt-safe-top overflow-hidden
                ${bgImage === 'default' ? 'bg-[#f0fdf4]/90 border-emerald-100/80 shadow-sm' : 'bg-white/85 border-slate-200/50 shadow-sm'}`}>
                
                {/* Dini Motif / Islamic Geometric Background Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <pattern id="islamicPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
                            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1"/>
                            <path d="M10 10 L90 90 M90 10 L10 90" stroke="currentColor" strokeWidth="0.5"/>
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#islamicPattern)" />
                    </svg>
                </div>

                {/* Tarih & Saat */}
                <div className="relative z-10 text-center pt-4 pb-1">
                    <p className="text-[10px] font-bold tracking-[0.16em] text-emerald-600/80 uppercase">
                        {new Date().toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', weekday: 'long' }).toUpperCase()}
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-0.5">
                        <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-emerald-200/50" />
                        <p className="text-3xl font-light text-slate-800 tracking-tighter font-mono">
                            {new Date().toLocaleTimeString(language === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-emerald-200/50" />
                    </div>
                </div>

                {/* Header (Navigasyon) */}
                <header className="relative z-10 px-3 pt-0 pb-2 grid grid-cols-[auto_1fr_auto] items-center gap-2">
                    {/* Sol - Menu */}
                    <div className="flex justify-start items-center gap-2 min-w-0">
                        <button
                            onClick={() => handleSidebarTabChange('profile')}
                            className="w-12 h-12 min-w-12 min-h-12 aspect-square rounded-full overflow-hidden border-[3px] border-white bg-white shadow-lg shadow-emerald-900/10 ring-2 ring-emerald-200/70 active:scale-95 transition-all"
                            aria-label="Profil"
                        >
                            <img src={avatarUrl} alt="Profile" className="block w-full h-full aspect-square object-cover rounded-full" />
                        </button>
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2.5 rounded-2xl bg-white/50 border border-emerald-50 dark:border-white/5 shadow-sm text-slate-500 hover:text-emerald-600 active:scale-95 transition-all"
                            title={t('nav.home') || 'Menü'}
                            aria-label="Menü"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Orta - Logo & Motif */}
                    <div className="flex flex-col items-center justify-center min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                             {/* Küçük Motif Süslemesi */}
                            <svg className="w-3.5 h-3.5 shrink-0 text-emerald-600/30" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L14.85 9.15L22 12L14.85 14.85L12 22L9.15 14.85L2 12L9.15 9.15L12 2Z" />
                            </svg>
                            <h1 className="text-sm sm:text-base font-serif font-bold text-emerald-800 tracking-tight leading-none uppercase truncate">
                                {t('common.appName')}
                            </h1>
                            <svg className="w-3.5 h-3.5 shrink-0 text-emerald-600/30" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L14.85 9.15L22 12L14.85 14.85L12 22L9.15 14.85L2 12L9.15 9.15L12 2Z" />
                            </svg>
                        </div>
                        <div className="h-[2px] w-8 bg-emerald-500/20 rounded-full mt-1" />
                    </div>

                    {/* Sağ - Aksiyonlar */}
                    <div className="flex justify-end items-center gap-1.5">
                        <button
                            onClick={() => window.history.length > 2 ? window.history.back() : onTabChange('prayer_times')}
                            className="p-2 rounded-xl bg-white/50 border border-emerald-50 dark:border-white/5 shadow-sm text-emerald-600 active:scale-95 transition-all"
                            title="Geri"
                            aria-label="Geri Dön"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => onTabChange('prayer_times')}
                            className="p-2 rounded-xl bg-white/50 border border-emerald-50 dark:border-white/5 shadow-sm text-emerald-600 active:scale-95 transition-all"
                            title="Ana Sayfa"
                            aria-label="Ana Sayfaya Git"
                        >
                            <Home className="w-5 h-5" />
                        </button>
                    </div>
                </header>
            </div>

            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                activeTab={activeTab}
                onTabChange={handleSidebarTabChange}
            />

            {/* İçerik - Banner için alt boşluk artırıldı (pb-28) */}
            <main className="relative z-10 px-3 md:px-8 lg:px-12 pt-[132px] pb-28 max-w-4xl mx-auto">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
