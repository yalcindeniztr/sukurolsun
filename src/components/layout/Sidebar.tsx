import React, { useRef, useEffect } from 'react';
import { PenSquare, Archive, BookHeart, User, X, ChevronRight } from 'lucide-react';
import { useTheme } from '../../core/ThemeContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const NAV_ITEMS = [
    { id: 'home', label: 'Şükür Günlüğü', icon: PenSquare, description: 'Yeni bir şükür notu ekle' },
    { id: 'history', label: 'Geçmiş Arşivi', icon: Archive, description: 'Tüm notlarını incele' },
    { id: 'dua', label: 'Dua Hazinesi', icon: BookHeart, description: 'Dualar ve zikirler' },
    { id: 'profile', label: 'Profilim', icon: User, description: 'Rozetlerin ve gelişimin' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeTab, onTabChange }) => {
    const { theme } = useTheme();
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Dışarı tıklandığında kapat
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleNavClick = (id: string) => {
        onTabChange(id);
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-500
                    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                `}
                aria-hidden="true"
            />

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] z-50 transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) shadow-2xl
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    ${theme === 'light'
                        ? 'bg-white/90 backdrop-blur-xl border-r border-slate-200'
                        : 'bg-slate-950/90 backdrop-blur-xl border-r border-white/10'}
                `}
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-500/20 to-transparent rounded-bl-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-amber-500/20 to-transparent rounded-tr-full pointer-events-none" />

                {/* Header */}
                <div className="p-8 pb-6 flex justify-between items-start relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`p-2 rounded-xl ${theme === 'light' ? 'bg-teal-100 text-teal-600' : 'bg-teal-500/20 text-teal-400'}`}>
                                <BookHeart className="w-5 h-5" />
                            </div>
                        </div>
                        <h2 className={`text-2xl font-serif font-bold tracking-tight ${theme === 'light' ? 'text-slate-800' : 'text-slate-100'}`}>
                            Şükür Olsun
                        </h2>
                        <p className={`text-xs font-medium tracking-wide uppercase mt-1 opacity-70 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                            Yolculuğun Başlasın
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full transition-all duration-300 hover:rotate-90 ${theme === 'light' ? 'hover:bg-slate-100 text-slate-400 hover:text-slate-600' : 'hover:bg-white/10 text-slate-500 hover:text-slate-300'}`}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Divider */}
                <div className={`h-px mx-8 ${theme === 'light' ? 'bg-gradient-to-r from-slate-200 to-transparent' : 'bg-gradient-to-r from-white/10 to-transparent'}`} />

                {/* Nav Items */}
                <div className="p-6 space-y-3 relative z-10">
                    {NAV_ITEMS.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                style={{ animationDelay: `${index * 50}ms` }}
                                className={`w-full group flex items-center p-4 rounded-2xl transition-all duration-300 relative overflow-hidden animate-slide-in-left
                                    ${isActive
                                        ? (theme === 'light'
                                            ? 'bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-500/20'
                                            : 'bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/30')
                                        : (theme === 'light'
                                            ? 'text-slate-600 hover:bg-slate-50'
                                            : 'text-slate-400 hover:bg-white/5')
                                    }
                                `}
                            >
                                {/* Active Indicator Bar */}
                                {isActive && (
                                    <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-teal-500" />
                                )}

                                <div className={`p-2.5 rounded-xl mr-4 transition-all duration-300
                                    ${isActive
                                        ? (theme === 'light' ? 'bg-white shadow-sm text-teal-600' : 'bg-teal-500/20 text-teal-300')
                                        : (theme === 'light' ? 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600' : 'bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-slate-300')
                                    }
                                `}>
                                    <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                </div>

                                <div className="flex-1 text-left">
                                    <div className={`font-bold text-sm tracking-wide ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'} transition-transform duration-300`}>{item.label}</div>
                                    <div className={`text-[10px] mt-0.5 font-medium opacity-60`}>
                                        {item.description}
                                    </div>
                                </div>

                                <ChevronRight className={`w-4 h-4 transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0 text-teal-500' : 'opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'}`} />
                            </button>
                        );
                    })}
                </div>

            </div>
        </>
    );
};

export default Sidebar;
