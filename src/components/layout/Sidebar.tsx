import React, { useEffect } from 'react';
import { Home, BookOpen, Heart, Gift, User, Share2, Calendar, Star, Clock, Activity, Map, DownloadCloud, LogOut } from 'lucide-react';
import { Share } from '@capacitor/share';
import { ReviewService } from '../../services/ReviewService';
import { App as CapacitorApp } from '@capacitor/app';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const navItems = [
    { id: 'home', label: 'Anasayfa', icon: Home },
    { id: 'dua', label: 'Dualar', icon: Heart },
    { id: 'tesbihat', label: 'Tesbihat', icon: Activity },
    { id: 'prayer_times', label: 'Vakitler', icon: Clock },
    { id: 'places', label: 'Mekanlar', icon: Map },
    { id: 'extras', label: 'Mesajlar', icon: Gift },
    { id: 'religious_days', label: 'Dini Günler', icon: Calendar },
    { id: 'history', label: 'Arşiv', icon: BookOpen },
    { id: 'profile', label: 'Profilim', icon: User },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeTab, onTabChange }) => {

    // Body scroll lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300
                    ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-[260px] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl border-r border-slate-200/50 dark:border-white/10`}
                style={{
                    boxShadow: isOpen
                        ? '10px 0 40px -10px rgba(0,0,0,0.1), 20px 0 60px -15px rgba(0,0,0,0.05)'
                        : 'none'
                }}
            >
                {/* Header */}
                <div className="pt-10 pb-6 px-6">
                    <h2 className="text-2xl font-serif font-black bg-gradient-to-br from-emerald-600 to-teal-800 dark:from-emerald-400 dark:to-teal-600 bg-clip-text text-transparent">
                        Şükür Olsun
                    </h2>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">
                        Manevi Günlüğün
                    </p>
                </div>

                {/* Navigation */}
                <nav className="px-3 flex-1 overflow-y-auto space-y-1 pb-24">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 group
                                    ${isActive
                                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 active:scale-95'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 active:bg-slate-200 dark:active:bg-white/10'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 transition-colors 
                                    ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400'}`}
                                />
                                <span className={`text-sm font-medium ${isActive ? 'font-bold' : ''}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}

                    <div className="h-4" /> {/* Spacer */}

                    {/* Share Button (Special item) */}
                    <button
                        onClick={async () => {
                            try {
                                await Share.share({
                                    title: 'Şükür Olsun',
                                    text: 'Harika bir manevi günlük uygulaması keşfettim! Sen de Şükür Olsun uygulamasını dene.',
                                    url: 'https://play.google.com/store/apps/details?id=com.yalcin.sukurolsun',
                                    dialogTitle: 'Şükür Olsun Uygulamasını Paylaş',
                                });
                            } catch (error) {
                                console.log('Error sharing', error);
                                // Fallback for Web
                                if (navigator.share) {
                                    navigator.share({
                                        title: 'Şükür Olsun',
                                        text: 'Harika bir manevi günlük uygulaması keşfettim! Sen de Şükür Olsun uygulamasını dene.',
                                        url: 'https://play.google.com/store/apps/details?id=com.yalcin.sukurolsun'
                                    }).catch(() => { });
                                }
                            }
                        }}
                        className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 group text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 active:bg-slate-200"
                    >
                        <Share2 className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
                        <span className="text-sm font-medium">Uygulamayı paylaş</span>
                    </button>

                    {/* Rate Us Button */}
                    <button
                        onClick={() => ReviewService.openPlayStore()}
                        className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 group text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 active:bg-slate-200"
                    >
                        <Star className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
                        <span className="text-sm font-medium">Bizi Değerlendirin</span>
                    </button>

                    {/* Update Check Button */}
                    <button
                        onClick={() => {
                            // Burada manuel bir alert/toast veya UpdateChecker'ı tetikleyecek bir Event emit edilebilir.
                            // Şimdilik sadece toast gösterelim
                            alert("Şu an en güncel sürümü kullanıyorsunuz.");
                        }}
                        className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 group text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 active:bg-slate-200"
                    >
                        <DownloadCloud className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                        <span className="text-sm font-medium">Güncellemeleri Kontrol Et</span>
                    </button>
                    {/* Exit App Button */}
                    <button
                        onClick={async () => {
                            if (window.confirm("Uygulamadan çıkmak istediğinize emin misiniz?")) {
                                try {
                                    await CapacitorApp.exitApp();
                                } catch (e) {
                                    console.log("Çıkış desteklenmiyor (Web ortamı vb.)", e);
                                    window.close();
                                }
                            }
                        }}
                        className="w-full mt-4 flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 group text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 active:bg-red-100"
                    >
                        <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-600 transition-colors" />
                        <span className="text-sm font-bold">Çıkış Yap</span>
                    </button>
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white dark:from-slate-900 dark:via-slate-900 to-transparent">
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-[10px] font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-500 mb-0.5">by ziberkan</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">v1.4.0</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
