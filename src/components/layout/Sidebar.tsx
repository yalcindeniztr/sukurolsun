import React, { useEffect } from 'react';
import { Home, BookOpen, Heart, Gift, User } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const navItems = [
    { id: 'home', label: 'Ana Sayfa', icon: Home },
    { id: 'history', label: 'Arşiv', icon: BookOpen },
    { id: 'dua', label: 'Dualar', icon: Heart },
    { id: 'extras', label: 'Ek Özellikler', icon: Gift },
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
                className={`fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 ease-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    bg-white/95 backdrop-blur-2xl border-r border-emerald-100/60`}
                style={{
                    boxShadow: isOpen
                        ? '10px 0 40px -10px rgba(16,185,129,0.1), 20px 0 60px -15px rgba(0,0,0,0.05)'
                        : 'none'
                }}
            >
                {/* Header */}
                <div className="p-6 pb-4 border-b border-emerald-100/50">
                    <h2 className="text-xl font-serif font-bold text-emerald-700">Şükür Olsun</h2>
                    <p className="text-xs text-slate-500 mt-1">Manevi Günlüğün</p>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group active:scale-[0.97]
                                    ${isActive
                                        ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm border border-emerald-200/50'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-500'}`} />
                                <span className="text-sm">{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-emerald-100/50">
                    <p className="text-xs text-slate-400 text-center">v1.2.0</p>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
