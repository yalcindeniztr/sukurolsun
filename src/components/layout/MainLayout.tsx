import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';

interface MainLayoutProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, activeTab, onTabChange }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleTabChange = (tab: string) => {
        onTabChange(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSidebarTabChange = (tab: string) => {
        handleTabChange(tab);
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen w-full relative overflow-x-hidden bg-[#f0fdf4] text-slate-800">

            {/* Dekoratif Arka Plan */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 right-[-50px] w-[300px] h-[300px] rounded-full blur-[120px] bg-emerald-300/20" />
                <div className="absolute bottom-40 left-[-80px] w-[350px] h-[350px] rounded-full blur-[120px] bg-emerald-200/15" />
                <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] rounded-full blur-[80px] bg-amber-200/10" />
            </div>

            {/* Tarih & Saat */}
            <div className="relative z-10 text-center pt-8 pb-2">
                <p className="text-sm font-bold tracking-widest text-emerald-600 uppercase">
                    {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' }).toUpperCase()}
                </p>
                <p className="text-5xl font-light text-slate-700 mt-1 tracking-tight font-mono">
                    {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-30 px-5 pt-4 pb-3 flex justify-between items-center
                bg-white/70 backdrop-blur-xl border-b border-emerald-100/50">

                {/* Menu Button */}
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2.5 rounded-2xl hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 active:scale-90 transition-all"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Logo */}
                <h1 className="text-lg font-serif font-bold text-emerald-700 tracking-wide">
                    Şükür Olsun
                </h1>

                {/* Sağ taraf boşluk */}
                <div className="w-10" />
            </header>

            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                activeTab={activeTab}
                onTabChange={handleSidebarTabChange}
            />

            {/* İçerik */}
            <main className="relative z-10 px-4 md:px-8 lg:px-12 py-6 max-w-4xl mx-auto pb-32">
                {children}
            </main>

            {/* Bottom Navigation */}
            <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
    );
};

export default MainLayout;
