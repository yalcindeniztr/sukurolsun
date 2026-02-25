import React, { useState, useEffect } from 'react';
import { Save, Heart, Hand, ChevronRight, CheckCircle2 } from 'lucide-react';
import { JournalEntry, MoodType, PromptType } from '../../core/types';
import { AdMobService } from '../../services/AdMobService';
import { MOODS } from '../../constants';
import { useTheme } from '../../core/ThemeContext';

interface JournalEntryFormProps {
    onSave: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => void;
    selectedEntry?: JournalEntry;
    onCancel?: () => void;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ onSave, selectedEntry, onCancel }) => {
    const { theme } = useTheme();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState<MoodType>('grateful');
    const [category, setCategory] = useState('general');
    const [promptType, setPromptType] = useState<PromptType>('gratitude');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (selectedEntry) {
            setTitle(selectedEntry.title);
            setContent(selectedEntry.content);
            setMood(selectedEntry.mood);
            setCategory(selectedEntry.category);
            setPromptType(selectedEntry.promptType || 'gratitude');
        } else {
            resetForm();
        }
    }, [selectedEntry]);

    const resetForm = () => {
        setTitle('');
        setContent('');
        setMood('grateful');
        setCategory('general');
        setPromptType('gratitude');
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        onSave({ title, content, mood, category, promptType });
        if (!selectedEntry) resetForm();

        const btn = document.activeElement as HTMLButtonElement;
        if (btn) btn.blur();
    };

    const activeMood = MOODS.find(m => m.type === mood);
    const isAllahAction = promptType === 'allah_action';

    // Dinamik Tema Renkleri - Daha açık teal (emerald)
    const borderColor = isAllahAction ? 'border-amber-400/30' : 'border-emerald-400/30';

    // Tab Colors - Yüksek Kontrast
    const activeTabClass = isAllahAction
        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/50'
        : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/50';

    const inactiveTabClass = theme === 'light'
        ? 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
        : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-100';

    return (
        <div className={`glass-card p-6 lg:p-8 animate-fade-in relative overflow-hidden transition-all duration-500 border ${borderColor}
            ${theme === 'light' ? 'bg-white/70 shadow-depth-light' : ''}
        `}>
            {/* Top Pattern */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br rounded-bl-full pointer-events-none transition-colors duration-500
                 ${isAllahAction
                    ? (theme === 'light' ? 'from-amber-200/15' : 'from-amber-500/[0.06]')
                    : (theme === 'light' ? 'from-emerald-200/15' : 'from-emerald-400/[0.06]')} to-transparent
            `} />

            {/* Prompt Type Tabs - 3D */}
            <div className={`flex mb-6 p-1 rounded-2xl relative z-10 w-fit transition-colors
                ${theme === 'light' ? 'bg-slate-100 border border-slate-200' : 'bg-black/20 border border-white/[0.04]'}
            `}>
                <button
                    onClick={() => setPromptType('gratitude')}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 active:scale-95 ${promptType === 'gratitude' ? activeTabClass : inactiveTabClass}`}
                >
                    <Heart className={`w-4 h-4 ${promptType === 'gratitude' ? 'fill-current' : ''}`} />
                    <span>Şükür Sebebim</span>
                </button>
                <button
                    onClick={async () => {
                        await AdMobService.showInterstitial();
                        AdMobService.prepareInterstitial();
                        setPromptType('allah_action');
                    }}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 active:scale-95 ${promptType === 'allah_action' ? activeTabClass : inactiveTabClass}`}
                >
                    <Hand className={`w-4 h-4 ${promptType === 'allah_action' ? 'fill-current' : ''}`} />
                    <span>Allah İçin Yaptım</span>
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6 relative z-10">

                {/* Mood Dropdown */}
                <div className="relative">
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2
                        ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}
                    `}>Ruh Hali</label>
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`w-full md:w-64 flex items-center justify-between input-field cursor-pointer group transition-all duration-200
                             ${theme === 'light'
                                ? 'bg-white border-slate-200 text-slate-800 shadow-sm hover:shadow-md'
                                : 'bg-black/20 border-white/[0.08] hover:border-white/[0.15] text-slate-100'}
                        `}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-xl group-hover:scale-110 transition-transform">{activeMood?.emoji}</span>
                            <span className={`transition-colors font-bold
                                ${theme === 'light' ? 'text-slate-800' : 'group-hover:text-slate-200'}
                            `}>{activeMood?.labelTr}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-90' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className={`absolute top-full left-0 mt-2 w-full md:w-64 rounded-2xl shadow-2xl z-50 animate-scale-in overflow-hidden ring-1
                            ${theme === 'light'
                                ? 'bg-white border border-slate-200 ring-black/5'
                                : 'bg-slate-900 border border-white/10 ring-white/5'}`}>
                            {MOODS.map(m => (
                                <button
                                    key={m.type}
                                    type="button"
                                    onClick={() => { setMood(m.type); setIsDropdownOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors last:border-0
                                        ${mood === m.type
                                            ? (theme === 'light' ? 'bg-emerald-50 text-emerald-700' : 'bg-emerald-500/10 text-emerald-300')
                                            : (theme === 'light' ? 'text-slate-800 hover:bg-slate-50 border-b border-slate-100' : 'text-slate-200 hover:bg-white/5 border-b border-white/5')}
                                    `}
                                >
                                    <span className="text-xl">{m.emoji}</span>
                                    <span className="text-sm font-bold">{m.labelTr}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content Inputs - Yüksek Kontrast */}
                <div className="space-y-4">
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2
                            ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                            {isAllahAction ? 'Başlık (Allah rızası için ne yaptın?)' : 'Başlık (Bugün en çok neye şükrettin?)'}
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={isAllahAction ? "Örn: Komşuma yardım ettim..." : "Örn: Güneşli bir sabah..."}
                            className={`input-field text-lg font-bold transition-all
                                ${theme === 'light'
                                    ? 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 shadow-sm'
                                    : 'bg-white/[0.03] border-white/[0.08] text-white placeholder-slate-600 focus:border-emerald-400/50'
                                }`}
                        />
                    </div>

                    <div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Detayları buraya yaz... (opsiyonel)"
                            className={`input-field min-h-[150px] resize-none leading-relaxed transition-all
                                ${theme === 'light'
                                    ? 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 shadow-sm'
                                    : 'bg-white/[0.03] border-white/[0.08] text-slate-100 placeholder-slate-600 focus:border-emerald-400/50'
                                }`}
                        />
                    </div>
                </div>

                {/* Actions - 3D Butonlar */}
                <div className="flex items-center justify-between pt-2">
                    {selectedEntry && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className={`text-sm font-medium transition-colors
                                ${theme === 'light' ? 'text-slate-500 hover:text-slate-700' : 'text-slate-400 hover:text-white'}`}
                        >
                            Vazgeç
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={!title.trim()}
                        className={`flex items-center gap-2 ml-auto text-white font-bold py-3 px-7 rounded-2xl active:scale-[0.97] transition-all duration-300
                            ${!title.trim() ? 'opacity-40 cursor-not-allowed bg-slate-700' :
                                isAllahAction
                                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 hover:shadow-xl hover:shadow-amber-500/20'
                                    : 'bg-gradient-to-r from-emerald-500 to-emerald-400 hover:shadow-xl hover:shadow-emerald-500/20'
                            }`}
                        style={title.trim() ? {
                            boxShadow: isAllahAction
                                ? '0 4px 14px -3px rgba(245,158,11,0.4)'
                                : '0 4px 14px -3px rgba(16,185,129,0.4)'
                        } : undefined}
                    >
                        {selectedEntry ? <Save className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        <span>{selectedEntry ? 'Güncelle' : 'Kaydet'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JournalEntryForm;
