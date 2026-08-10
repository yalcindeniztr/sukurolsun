import React, { useState } from 'react';
import { BookOpen, Hand, Heart, Sparkles } from 'lucide-react';
import { useTheme } from '../../core/ThemeContext';
import JournalEntryForm from '../journal/JournalEntryForm';
import JournalHistory from '../journal/JournalHistory';
import { useApp } from '../../core/AppContext';
import { PromptType } from '../../core/types';

const SukurVaktiView: React.FC = () => {
    const { theme } = useTheme();
    const { entries, handleSaveEntry, handleDeleteEntry, handleToggleFavorite, selectedEntry, setSelectedEntry, setActiveTab } = useApp();
    const [activeSection, setActiveSection] = useState<PromptType>('gratitude');

    const handleSelectEntry = (entry: any) => {
        setSelectedEntry(entry);
        setActiveTab('sukur_vakti');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredEntries = entries
        .filter(entry => (entry.promptType || 'gratitude') === activeSection)
        .slice(0, 5);

    const isAllahAction = activeSection === 'allah_action';

    return (
        <div className="space-y-6 animate-fadeIn pb-24 max-w-2xl mx-auto px-1">
            {/* Header Banner */}
            <div className={`text-center p-6 rounded-3xl card-3d-embossed hologram-shimmer relative overflow-hidden
                ${theme === 'light'
                    ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50/50 border-emerald-200/80 shadow-depth-light'
                    : 'bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 border-emerald-500/30'}`}
            >
                <div className="absolute top-2 right-3 opacity-20 pointer-events-none">
                    <Sparkles className="w-12 h-12 text-amber-500 animate-pulse" />
                </div>

                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 shadow-sm border
                    ${theme === 'light' ? 'bg-white text-emerald-700 border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                    <Heart className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                    <span className="font-bold text-xs uppercase tracking-wider">Şükür Vakti Geldi</span>
                </div>
                <h2 className={`text-2xl font-serif font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                    Bugün Allah'a Neler İçin Şükrediyorsun?
                </h2>
                <p className={`mt-1 text-xs font-medium ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                    Günün bereketini, sağlığını ve nimetlerini kalbinle hisset ve unutmamak için kaydet.
                </p>
            </div>

            {/* Tab Selection Switcher */}
            <div className={`grid grid-cols-2 gap-2 p-1.5 rounded-2xl border card-3d-embossed
                ${theme === 'light' ? 'bg-white/90 border-slate-200 shadow-sm' : 'bg-slate-900/80 border-white/10'}`}>
                <button
                    onClick={() => setActiveSection('gratitude')}
                    className={`min-h-12 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 active:scale-95
                        ${!isAllahAction
                            ? 'embossed-button text-white shadow-lg'
                            : theme === 'light' ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 hover:bg-white/5'}`}
                >
                    <BookOpen className="w-4 h-4" />
                    Günlük Şükür
                </button>
                <button
                    onClick={() => setActiveSection('allah_action')}
                    className={`min-h-12 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 active:scale-95
                        ${isAllahAction
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30'
                            : theme === 'light' ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 hover:bg-white/5'}`}
                >
                    <Hand className="w-4 h-4" />
                    Allah İçin Ne Yaptın?
                </button>
            </div>

            {/* Entry Form */}
            <div className="card-3d-embossed rounded-3xl p-1 bg-white/50 dark:bg-slate-900/50">
                <JournalEntryForm
                    key={activeSection}
                    onSave={handleSaveEntry}
                    selectedEntry={selectedEntry}
                    onCancel={() => setSelectedEntry(undefined)}
                    forcedPromptType={activeSection}
                />
            </div>

            {/* Recent History List */}
            {filteredEntries.length > 0 && (
                <div className="mt-8 space-y-4">
                    <h3 className={`text-lg font-serif font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                        {isAllahAction ? 'Son Allah İçin Yaptıkların' : 'Son Şükür Notların'}
                    </h3>
                    <JournalHistory
                        entries={filteredEntries}
                        onDelete={handleDeleteEntry}
                        onEdit={handleSelectEntry}
                        onToggleFavorite={handleToggleFavorite}
                        showFilters={false}
                    />
                    {entries.length > 5 && (
                        <button
                            onClick={() => setActiveTab('history')}
                            className="w-full py-3.5 text-xs font-black text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors border border-emerald-500/20 rounded-2xl hover:bg-emerald-500/10 active:scale-98"
                        >
                            Tüm Şükür Arşivini Gör →
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default SukurVaktiView;
