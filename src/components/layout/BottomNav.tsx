import React from 'react';
import { PenSquare, Archive, BookHeart, User } from 'lucide-react';

interface BottomNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
    { id: 'home', label: 'Yaz', icon: PenSquare },
    { id: 'history', label: 'Arşiv', icon: Archive },
    { id: 'dua', label: 'Dua', icon: BookHeart },
    { id: 'profile', label: 'Profil', icon: User },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
    return (
        <nav className="fixed bottom-28 left-4 right-4 z-50 bg-slate-950/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl safe-area-bottom transition-all duration-300">
            <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-4">
                {NAV_ITEMS.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`flex flex-col items-center justify-center py-2 px-4 rounded-2xl transition-all duration-300 min-w-[70px]
                                ${isActive
                                    ? 'bg-teal-500/20 text-teal-400 scale-105'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <div className={`relative ${isActive ? 'animate-pulse' : ''}`}>
                                <Icon className={`w-6 h-6 transition-all ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
                                {/* Aktif Gösterge */}
                                {isActive && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-teal-400 rounded-full animate-ping" />
                                )}
                            </div>
                            <span className={`text-xs mt-1 font-medium transition-all ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
