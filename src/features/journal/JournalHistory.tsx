import React, { useState, useMemo } from 'react';
import { Trash2, Edit2, Calendar, Heart, Hand, ChevronDown, ChevronUp, Search, Star } from 'lucide-react';
import { JournalEntry } from '../../core/types';
import { MOODS } from '../../constants';
import { useTheme } from '../../core/ThemeContext';

interface JournalHistoryProps {
    entries: JournalEntry[];
    onDelete: (id: string) => void;
    onEdit: (entry: JournalEntry) => void;
    onToggleFavorite: (id: string) => void;
    showFilters?: boolean;
}

const JournalHistory: React.FC<JournalHistoryProps> = ({ entries, onDelete, onEdit, onToggleFavorite, showFilters = false }) => {
    const { theme } = useTheme();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<'all' | 'gratitude' | 'allah_action' | 'favorites'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
    const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const availableYears = useMemo(() => {
        const years = new Set(entries.map(e => new Date(e.timestamp).getFullYear()));
        return Array.from(years).sort((a, b) => b - a);
    }, [entries]);

    const filteredEntries = useMemo(() => {
        return entries.filter(entry => {
            const date = new Date(entry.timestamp);

            // Favori Filtresi
            if (filterType === 'favorites') {
                if (!entry.isFavorite) return false;
            } else if (filterType !== 'all') {
                const entryType = entry.promptType || 'gratitude';
                if (entryType !== filterType) return false;
            }

            // Arama Filtresi
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const match = entry.title.toLowerCase().includes(query) || entry.content.toLowerCase().includes(query);
                if (!match) return false;
            }

            // Tarih Filtresi - Yıl
            if (selectedYear !== 'all') {
                if (date.getFullYear() !== selectedYear) return false;
            }

            // Tarih Filtresi - Ay
            if (selectedMonth !== 'all') {
                if (date.getMonth() !== selectedMonth) return false;
            }

            return true;
        });
    }, [entries, filterType, searchQuery, selectedYear, selectedMonth]);

    if (entries.length === 0) {
        return (
            <div className={`text-center py-12 rounded-2xl border-2 border-dashed
                ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                <p className={`${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Henüz günlük eklenmemiş.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header ve Filtreler */}
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex justify-between items-center">
                    <h3 className={`text-lg font-serif ${theme === 'light' ? 'text-slate-800' : 'text-slate-100'}`}>
                        {showFilters ? 'Arşiv' : 'Son Günlükler'}
                    </h3>
                </div>

                {showFilters && (
                    <div className={`space-y-3 p-4 rounded-2xl border animate-fade-in
                        ${theme === 'light'
                            ? 'bg-white/80 border-slate-200 shadow-lg shadow-slate-200/30'
                            : 'bg-black/20 border-white/5'
                        }`}>
                        {/* Arama */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Başlık veya içerikte ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all
                                    ${theme === 'light'
                                        ? 'bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400'
                                        : 'bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50'
                                    }`}
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {/* Tip Dropdown */}
                            <div className={`rounded-xl p-1 flex ${theme === 'light' ? 'bg-slate-100' : 'bg-white/5'}`}>
                                <button onClick={() => setFilterType('all')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filterType === 'all' ? (theme === 'light' ? 'bg-white text-slate-800 shadow-sm' : 'bg-white/10 text-white') : (theme === 'light' ? 'text-slate-500 hover:text-slate-700' : 'text-slate-500 hover:text-slate-300')}`}>Tümü</button>
                                <button onClick={() => setFilterType('gratitude')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filterType === 'gratitude' ? 'bg-emerald-500/20 text-emerald-400' : (theme === 'light' ? 'text-slate-500 hover:text-slate-700' : 'text-slate-500 hover:text-slate-300')}`}>Şükür</button>
                                <button onClick={() => setFilterType('allah_action')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filterType === 'allah_action' ? 'bg-amber-500/20 text-amber-400' : (theme === 'light' ? 'text-slate-500 hover:text-slate-700' : 'text-slate-500 hover:text-slate-300')}`}>Amel</button>
                                <button onClick={() => setFilterType('favorites')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filterType === 'favorites' ? 'bg-rose-500/20 text-rose-400' : (theme === 'light' ? 'text-slate-500 hover:text-slate-700' : 'text-slate-500 hover:text-slate-300')}`}>
                                    <Star className="w-3 h-3 inline mr-1" />Favori
                                </button>
                            </div>

                            {/* Yıl Seçimi */}
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                                className={`rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none transition-all
                                    ${theme === 'light'
                                        ? 'bg-white border border-slate-200 text-slate-700 focus:border-emerald-400'
                                        : 'bg-white/5 border border-white/10 text-slate-300 focus:border-emerald-400/50'
                                    }`}
                            >
                                <option value="all">Tüm Yıllar</option>
                                {availableYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>

                            {/* Ay Seçimi */}
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                                className={`rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none transition-all
                                    ${theme === 'light'
                                        ? 'bg-white border border-slate-200 text-slate-700 focus:border-emerald-400'
                                        : 'bg-white/5 border border-white/10 text-slate-300 focus:border-emerald-400/50'
                                    }`}
                            >
                                <option value="all">Tüm Aylar</option>
                                {['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'].map((month, index) => (
                                    <option key={index} value={index}>{month}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Liste */}
            <div className="space-y-3">
                {filteredEntries.length === 0 ? (
                    <div className={`text-center py-8 text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>
                        Arama kriterlerine uygun kayıt bulunamadı.
                    </div>
                ) : (
                    filteredEntries.map((entry) => {
                        const date = new Date(entry.timestamp);
                        const mood = MOODS.find((m) => m.type === entry.mood);
                        const isExpanded = expandedId === entry.id;
                        const isGratitude = (entry.promptType || 'gratitude') === 'gratitude';

                        return (
                            <div
                                key={entry.id}
                                className={`rounded-2xl overflow-hidden transition-all duration-300 border-l-4 
                                    ${theme === 'light'
                                        ? `bg-white/80 shadow-md shadow-slate-200/40 hover:shadow-lg ${isExpanded ? (isGratitude ? 'border-l-emerald-500' : 'border-l-amber-500') : 'border-l-transparent hover:border-l-emerald-400/50'}`
                                        : `bg-white/5 backdrop-blur-sm ${isExpanded ? (isGratitude ? 'bg-white/10 border-l-emerald-400' : 'bg-white/10 border-l-amber-400') : 'hover:bg-white/10 border-l-transparent'}`
                                    }`}
                            >
                                <div
                                    onClick={() => toggleExpand(entry.id)}
                                    className="p-4 flex items-center justify-between cursor-pointer"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`p-2 rounded-xl shrink-0 ${isGratitude ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                            {isGratitude ? <Heart className="w-4 h-4" /> : <Hand className="w-4 h-4" />}
                                        </div>

                                        <div className="flex flex-col min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-bold truncate pr-2 ${theme === 'light' ? 'text-slate-800' : 'text-slate-100'}`}>{entry.title}</span>
                                                {entry.isFavorite && (
                                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-current shrink-0" />
                                                )}
                                            </div>
                                            <div className={`flex items-center gap-3 text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {date.toLocaleDateString('tr-TR')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-xl" title={mood?.labelTr}>{mood?.emoji}</span>
                                        {isExpanded ? <ChevronUp className={`w-4 h-4 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`} /> : <ChevronDown className={`w-4 h-4 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`} />}
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className={`px-4 pb-4 pt-0 text-sm animate-slide-up ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                                        <div className={`rounded-xl p-4 mb-3 border ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-black/20 border-white/5'}`}>
                                            <p className="leading-relaxed whitespace-pre-wrap">{entry.content || 'İçerik yazılmamış.'}</p>
                                        </div>

                                        <div className={`flex justify-between items-center pt-2 border-t ${theme === 'light' ? 'border-slate-100' : 'border-white/5'}`}>
                                            <span className={`text-xs ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>{date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                                            <div className="flex gap-1">
                                                {/* Favori Butonu */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(entry.id); }}
                                                    className={`p-2 rounded-xl transition-all flex items-center gap-1.5
                                                        ${entry.isFavorite
                                                            ? 'bg-amber-500/10 text-amber-400'
                                                            : theme === 'light'
                                                                ? 'hover:bg-slate-100 text-slate-400 hover:text-amber-500'
                                                                : 'hover:bg-white/10 text-slate-400 hover:text-amber-400'
                                                        }`}
                                                    title={entry.isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                                                >
                                                    <Star className={`w-4 h-4 ${entry.isFavorite ? 'fill-current' : ''}`} />
                                                    <span className="text-xs">{entry.isFavorite ? 'Favori' : 'Favorile'}</span>
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onEdit(entry); }}
                                                    className={`p-2 rounded-xl transition-all flex items-center gap-1.5
                                                        ${theme === 'light' ? 'hover:bg-slate-100 text-slate-400 hover:text-emerald-600' : 'hover:bg-white/10 text-slate-400 hover:text-emerald-400'}`}
                                                >
                                                    <Edit2 className="w-4 h-4" /> <span className="text-xs">Düzenle</span>
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
                                                    className={`p-2 rounded-xl transition-all flex items-center gap-1.5
                                                        ${theme === 'light' ? 'hover:bg-red-50 text-slate-400 hover:text-red-500' : 'hover:bg-red-500/10 text-slate-400 hover:text-red-400'}`}
                                                >
                                                    <Trash2 className="w-4 h-4" /> <span className="text-xs">Sil</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default JournalHistory;
