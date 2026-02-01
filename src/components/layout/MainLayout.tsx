import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useTheme } from '../../core/ThemeContext';
import { Moon, Sun, Menu } from 'lucide-react';
import { AdMobBanner } from '../AdMobBanner';

interface MainLayoutProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, activeTab, onTabChange }) => {
    const { theme, toggleTheme } = useTheme();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Saat güncelleme
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Formatlar
    const timeString = currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const dateString = currentTime.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });

    return (
        <div className={`min-h-screen w-full relative overflow-x-hidden transition-colors duration-500 ${theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>

            {/* Dinamik Arka Plan Gradientleri */}
            <div className={`fixed inset-0 pointer-events-none transition-colors duration-500 opacity-30 
                ${theme === 'light'
                    ? 'bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-200/40 via-transparent to-transparent'
                    : 'bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent'}`}
            />
            <div className={`fixed inset-0 pointer-events-none transition-colors duration-500 opacity-20 
                ${theme === 'light'
                    ? 'bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-amber-200/40 via-transparent to-transparent'
                    : 'bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent'}`}
            />

            {/* Header */}
            <header className="sticky top-0 z-30 px-6 pt-8 pb-4 flex justify-between items-center backdrop-blur-sm bg-transparent">
                {/* Menu Button */}
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className={`p-2.5 rounded-full transition-all duration-300 shadow-sm
                        ${theme === 'light' ? 'bg-white text-slate-700 shadow-slate-200' : 'bg-white/10 text-slate-200'}`}
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className={`p-2.5 rounded-full transition-all duration-300 shadow-sm
                        ${theme === 'light' ? 'bg-white text-slate-600 hover:bg-slate-50 shadow-slate-200' : 'bg-white/10 text-amber-400 hover:bg-white/10 hover:rotate-12'}`}
                >
                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
            </header>

            {/* Ana İçerik */}
            <main className="min-h-screen relative z-10 px-4 pb-32">
                <div className="max-w-2xl mx-auto">

                    {/* Tarih ve Saat - ORTALANMIŞ */}
                    <div className="text-center mb-8 animate-fade-in pt-4">
                        <div className={`text-sm font-bold uppercase tracking-widest mb-2 opacity-80 ${theme === 'light' ? 'text-teal-700' : 'text-teal-400'}`}>
                            {dateString}
                        </div>
                        <h1 className={`text-5xl font-serif font-medium tracking-tight ${theme === 'light' ? 'text-slate-800' : 'text-slate-100'}`}>
                            {timeString}
                        </h1>
                    </div>

                    {children}
                </div>
            </main>

            {/* Reklam Banner - Bottom Fixed */}
            <AdMobBanner />

            {/* Sidebar Menu */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                activeTab={activeTab}
                onTabChange={onTabChange}
            />
        </div>
    );
};

export default MainLayout;
