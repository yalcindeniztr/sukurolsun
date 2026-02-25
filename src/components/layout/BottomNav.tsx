import React from 'react';
import { Home, BookOpen, Heart, Gift, User } from 'lucide-react';

interface BottomNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const tabs = [
    { id: 'home', label: 'Yaz', icon: Home },
    { id: 'history', label: 'Arşiv', icon: BookOpen },
    { id: 'dua', label: 'Dua', icon: Heart },
    { id: 'extras', label: 'Ekstra', icon: Gift },
    { id: 'profile', label: 'Profil', icon: User },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-emerald-100/60 bg-white/90 backdrop-blur-xl">
            <div className="max-w-md mx-auto flex items-center justify-around py-2">
                {tabs.map(({ id, label, icon: Icon }) => {
                    const isActive = activeTab === id;
                    return (
                        <button
                            key={id}
                            onClick={() => onTabChange(id)}
                            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all active:scale-90
                                ${isActive
                                    ? 'text-emerald-600'
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'fill-emerald-100' : ''}`} />
                            <span className={`text-[10px] font-bold ${isActive ? 'text-emerald-700' : 'text-slate-400'}`}>{label}</span>
                            {isActive && <div className="w-4 h-0.5 bg-emerald-500 rounded-full" />}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
