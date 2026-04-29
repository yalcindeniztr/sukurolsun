import React, { useState } from 'react';
import { BookOpen, Hand, Heart } from 'lucide-react';
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
        <div className="space-y-6 animate-fadeIn pb-24">
            <div className="text-center mb-6">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4
                    ${theme === 'light' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    <Heart className="w-5 h-5" />
                    <span className="font-bold text-sm">Şükür Vakti</span>
                </div>
                <h2 className={`text-2xl font-serif font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                    Günlük niyetini kaydet
                </h2>
            </div>

            <div className={`grid grid-cols-2 gap-2 p-1 rounded-2xl
                ${theme === 'light' ? 'bg-white/80 border border-slate-200 shadow-sm' : 'bg-black/20 border border-white/10'}`}>
                <button
                    onClick={() => setActiveSection('gratitude')}
                    className={`min-h-12 px-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2
                        ${!isAllahAction ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}
                >
                    <BookOpen className="w-4 h-4" />
                    Günlük Şükür
                </button>
                <button
                    onClick={() => setActiveSection('allah_action')}
                    className={`min-h-12 px-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2
                        ${isAllahAction ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}
                >
                    <Hand className="w-4 h-4" />
                    Allah İçin Ne Yaptın
                </button>
            </div>

            <JournalEntryForm
                key={activeSection}
                onSave={handleSaveEntry}
                selectedEntry={selectedEntry}
                onCancel={() => setSelectedEntry(undefined)}
                forcedPromptType={activeSection}
            />

            {filteredEntries.length > 0 && (
                <div className="mt-6">
                    <h3 className={`text-lg font-bold mb-4 ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                        {isAllahAction ? 'Son Allah İçin Yaptıkların' : 'Son Şükür Notları'}
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
                            className="w-full mt-4 py-3 text-sm text-slate-400 hover:text-emerald-400 transition-colors border border-white/10 rounded-xl hover:bg-white/5"
                        >
                            Tüm Geçmişi Gör
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default SukurVaktiView;
