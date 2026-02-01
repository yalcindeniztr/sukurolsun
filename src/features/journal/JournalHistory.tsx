import React, { useState, useMemo } from 'react';
import { Trash2, Edit2, Calendar, Heart, Hand, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { JournalEntry } from '../../core/types';
import { MOODS } from '../../constants';

interface JournalHistoryProps {
    entries: JournalEntry[];
    onDelete: (id: string) => void;
    onEdit: (entry: JournalEntry) => void;
    showFilters?: boolean; // For Archive View
}

const JournalHistory: React.FC<JournalHistoryProps> = ({ entries, onDelete, onEdit, showFilters = false }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<'all' | 'gratitude' | 'allah_action'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
    const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // Mevcut entry'lerden benzersiz yılları çek
    const availableYears = useMemo(() => {
        const years = new Set(entries.map(e => new Date(e.timestamp).getFullYear()));
        return Array.from(years).sort((a, b) => b - a);
    }, [entries]);

    const filteredEntries = useMemo(() => {
        return entries.filter(entry => {
            const date = new Date(entry.timestamp);

            // Tip Filtresi
            if (filterType !== 'all') {
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
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                <p className="text-slate-400">Henüz günlük eklenmemiş.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header ve Filtreler */}
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-serif text-slate-200">
                        {showFilters ? 'Arşiv' : 'Son Günlükler'}
                    </h3>
                </div>

                {showFilters && (
                    <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-white/5 animate-fade-in">
                        {/* Arama */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Başlık veya içerikte ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50 transition-colors"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {/* Tip Dropdown */}
                            <div className="bg-white/5 rounded-lg p-1 flex">
                                <button onClick={() => setFilterType('all')} className={`px-3 py-1 text-xs rounded-md transition-colors ${filterType === 'all' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Tümü</button>
                                <button onClick={() => setFilterType('gratitude')} className={`px-3 py-1 text-xs rounded-md transition-colors ${filterType === 'gratitude' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-500 hover:text-slate-300'}`}>Şükür</button>
                                <button onClick={() => setFilterType('allah_action')} className={`px-3 py-1 text-xs rounded-md transition-colors ${filterType === 'allah_action' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-500 hover:text-slate-300'}`}>Amel</button>
                            </div>

                            {/* Yıl Seçimi */}
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-500/50"
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
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-500/50"
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
                    <div className="text-center py-8 text-slate-500 text-sm">
                        Arams kriterlerine uygun kayıt bulunamadı.
                    </div>
                ) : (
                    filteredEntries.map((entry) => {
                        const date = new Date(entry.timestamp);
                        const mood = MOODS.find((m) => m.type === entry.mood);
                        const isExpanded = expandedId === entry.id;
                        const isGratitude = (entry.promptType || 'gratitude') === 'gratitude';
                        const themeColor = isGratitude ? 'teal' : 'amber'; // amber is closer to gold

                        return (
                            <div
                                key={entry.id}
                                className={`glass-card overflow-hidden transition-all duration-300 border-l-4 ${isExpanded ? `bg-white/10 border-l-${themeColor}-500` : `hover:bg-white/10 border-l-transparent hover:border-l-${themeColor}-500/50`}`}
                            >
                                <div
                                    onClick={() => toggleExpand(entry.id)}
                                    className="p-4 flex items-center justify-between cursor-pointer"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`p-2 rounded-full shrink-0 ${isGratitude ? 'bg-teal-500/10 text-teal-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                            {isGratitude ? <Heart className="w-4 h-4" /> : <Hand className="w-4 h-4" />}
                                        </div>

                                        <div className="flex flex-col min-w-0">
                                            <span className="font-medium text-slate-200 truncate pr-2">{entry.title}</span>
                                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {date.toLocaleDateString('tr-TR')}</span>
                                                {/* <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span> */}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-xl" title={mood?.labelTr}>{mood?.emoji}</span>
                                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="px-4 pb-4 pt-0 text-sm text-slate-300 animate-slide-up">
                                        <div className="bg-black/20 rounded-lg p-4 mb-3 border border-white/5">
                                            <p className="leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                                        </div>

                                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                            <span className="text-xs text-slate-500">{date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onEdit(entry); }}
                                                    className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-2"
                                                >
                                                    <Edit2 className="w-4 h-4" /> <span className="text-xs">Düzenle</span>
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
                                                    className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors flex items-center gap-2"
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
