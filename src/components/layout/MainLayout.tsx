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

    const getBackgroundStyle = () => {
        if (bgImage === 'kabe') return { backgroundImage: 'url(/assets/themes/kabe.png)', backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center' };
        if (bgImage === 'nebevi') return { backgroundImage: 'url(/assets/themes/nebevi.png)', backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center' };
        if (bgImage === 'nature') return { backgroundImage: 'url(/assets/themes/nature.png)', backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center' };
        return {}; // default
    };

    return (
        <div className="min-h-screen w-full relative overflow-x-hidden bg-[#f0fdf4] text-slate-800" style={getBackgroundStyle()}>

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
            <div className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b pt-safe-top
                ${bgImage === 'default' ? 'bg-[#f0fdf4]/90 border-emerald-100/80' : 'bg-white/80 border-slate-200/50'}`}>
                {/* Tarih & Saat */}
                <div className="text-center pt-8 pb-2">
                    <p className="text-sm font-bold tracking-widest text-emerald-600 uppercase">
                        {new Date().toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', weekday: 'long' }).toUpperCase()}
                    </p>
                    <p className="text-5xl font-light text-slate-700 mt-1 tracking-tight font-mono">
                        {new Date().toLocaleTimeString(language === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>

                {/* Header */}
                <header className="px-5 pt-4 pb-3 flex justify-between items-center">
                    {/* Menu Button */}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2.5 rounded-2xl hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 active:scale-90 transition-all"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Logo */}
                    <h1 className="text-lg font-serif font-bold text-emerald-700 tracking-wide">
                        {t('common.appName')}
                    </h1>

                    {/* Sağ Taraf - Aksiyonlar */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => window.history.length > 2 ? window.history.back() : onTabChange('home')}
                            className="p-1.5 rounded-xl hover:bg-emerald-50 text-emerald-600 active:scale-90 transition-all font-bold"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => onTabChange('home')}
                            className="p-1.5 rounded-xl hover:bg-emerald-50 text-emerald-600 active:scale-90 transition-all font-bold"
                        >
                            <Home className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => handleSidebarTabChange('profile')}
                            className="w-9 h-9 ml-1 rounded-full overflow-hidden border-2 border-emerald-200 active:scale-90 transition-all shadow-sm"
                        >
                            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover bg-white" />
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

            {/* İçerik */}
            <main className="relative z-10 px-4 md:px-8 lg:px-12 pt-[180px] pb-12 max-w-4xl mx-auto">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
