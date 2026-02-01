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
        if (!title.trim() || !content.trim()) return;

        onSave({ title, content, mood, category, promptType });
        if (!selectedEntry) resetForm();

        const btn = document.activeElement as HTMLButtonElement;
        if (btn) btn.blur();
    };

    const activeMood = MOODS.find(m => m.type === mood);
    const isAllahAction = promptType === 'allah_action';

    // Dinamik Tema Renkleri
    const themeColor = isAllahAction ? 'gold' : 'teal';
    const borderColor = isAllahAction ? 'border-amber-500/30' : 'border-teal-500/30';

    // Tab Colors - High Contrast & Theme Aware
    const activeTabClass = isAllahAction
        ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20 ring-2 ring-amber-500/50'
        : 'bg-teal-600 text-white shadow-lg shadow-teal-900/20 ring-2 ring-teal-500/50';

    const inactiveTabClass = theme === 'light'
        ? 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
        : 'text-slate-400 hover:bg-white/10 hover:text-slate-100';

    return (
        <div className={`glass-card p-6 lg:p-8 animate-fade-in relative overflow-hidden transition-all duration-500 border ${borderColor}
            ${theme === 'light' ? 'bg-white/60 shadow-xl shadow-slate-200/50' : ''}
        `}>
            {/* Top Pattern - Theme Aware Gradient */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br rounded-bl-full pointer-events-none transition-colors duration-500
                 ${isAllahAction
                    ? (theme === 'light' ? 'from-amber-200/20' : 'from-amber-600/10')
                    : (theme === 'light' ? 'from-teal-200/20' : 'from-teal-500/10')} to-transparent
            `} />

            {/* Prompt Type Tabs */}
            <div className={`flex mb-6 p-1 rounded-xl relative z-10 w-fit transition-colors
                ${theme === 'light' ? 'bg-slate-200/50 border border-slate-300' : 'bg-black/20 border border-white/5'}
            `}>
                <button
                    onClick={() => setPromptType('gratitude')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${promptType === 'gratitude' ? activeTabClass : inactiveTabClass}`}
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
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${promptType === 'allah_action' ? activeTabClass : inactiveTabClass}`}
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
                                ? 'bg-white border-slate-300 text-slate-800 focus:ring-teal-500 shadow-sm'
                                : 'bg-black/20 border-white/10 hover:border-white/20 text-slate-100'}
                        `}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-xl group-hover:scale-110 transition-transform">{activeMood?.emoji}</span>
                            <span className={`transition-colors font-medium
                                ${theme === 'light' ? 'text-slate-800' : 'group-hover:text-slate-200'}
                            `}>{activeMood?.labelTr}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-90' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-full md:w-64 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 animate-fade-in overflow-hidden ring-1 ring-black/5">
                            {MOODS.map(m => (
                                <button
                                    key={m.type}
                                    type="button"
                                    onClick={() => { setMood(m.type); setIsDropdownOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors border-b border-slate-100 last:border-0
                                        ${mood === m.type
                                            ? 'bg-teal-50 text-teal-700'
                                            : 'text-slate-900 hover:bg-slate-50'}
                                    `}
                                >
                                    <span className="text-xl">{m.emoji}</span>
                                    <span className="text-sm font-bold">{m.labelTr}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content Inputs */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            {isAllahAction ? 'Başlık (Allah rızası için ne yaptın?)' : 'Başlık (Bugün en çok neye şükrettin?)'}
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={isAllahAction ? "Örn: Komşuma yardım ettim..." : "Örn: Güneşli bir sabah..."}
                            className={`input-field text-lg font-bold placeholder-slate-600 !bg-white/5 focus:border-${themeColor}-500/50 focus:ring-${themeColor}-500/50
                                ${theme === 'light' ? 'text-slate-800 placeholder:text-slate-400 !bg-white/80 border-slate-300' : ''}
                            `}
                        />
                    </div>

                    <div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Detayları buraya yaz..."
                            className={`input-field min-h-[150px] resize-none leading-relaxed placeholder-slate-600 !bg-white/5 focus:border-${themeColor}-500/50 focus:ring-${themeColor}-500/50
                                ${theme === 'light' ? 'text-slate-800 placeholder:text-slate-400 !bg-white/80 border-slate-300' : ''}
                            `}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                    {selectedEntry && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            Vazgeç
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={!title || !content}
                        className={`flex items-center gap-2 ml-auto text-white font-medium py-3 px-6 rounded-xl shadow-lg active:scale-[0.98] transition-all duration-300
                            ${!title || !content ? 'opacity-50 cursor-not-allowed bg-slate-700' :
                                isAllahAction
                                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:shadow-amber-500/20'
                                    : 'bg-gradient-to-r from-teal-700 to-teal-600 hover:shadow-teal-500/20'
                            }`}
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
