import React, { useState } from 'react';
import { Heart, BookOpen, Save } from 'lucide-react';
import { useTheme } from '../../core/ThemeContext';
import VerseBanner from '../journal/VerseBanner';
import JournalEntryForm from '../journal/JournalEntryForm';
import JournalHistory from '../journal/JournalHistory';
import { useApp } from '../../core/AppContext';

const SukurVaktiView: React.FC = () => {
    const { theme } = useTheme();
    const { entries, handleSaveEntry, handleDeleteEntry, handleToggleFavorite, selectedEntry, setSelectedEntry, setActiveTab } = useApp();
    const [activeSection, setActiveSection] = useState<'duas' | 'journal'>('duas');

    // Şükür duaları listesi
    const sukruDualari = [
        {
            id: 1,
            title: "Elhamdülillah",
            arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
            turkish: "Alemlerin Rabbi olan Allah'a hamdolsun.",
            description: "Her nimet için şükürün ifadesi."
        },
        {
            id: 2,
            title: "Şükür Duası",
            arabic: "اللَّهُمَّ لَكَ الْحَمْدُ كَمَا يَنْبَغِي لِجَلَالِ وَجْهِكَ وَعَظِيمِ سُلْطَانِكَ",
            turkish: "Allah'ım, senin celaline ve yüce kudretine lâyık şekilde hamd ederim.",
            description: "Nimetler için şükür duası."
        },
        {
            id: 3,
            title: "İftar Duası",
            arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ",
            turkish: "Susuzluk gitti, damarlar ıslanacak, sevabım da Allah'ın izniyle sabit olacak.",
            description: "Oruç açarken okunan dua."
        },
        {
            id: 4,
            title: "Yemek Duası",
            arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
            turkish: "Allah'ın adıyla ve bereketiyle.",
            description: "Yemek yerken okunan kısa dua."
        },
        {
            id: 5,
            title: "Sabır Duası",
            arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَتَوَفَّنَا مُسْلِمِينَ",
            turkish: "Rabbimiz, bize sabır saç ve bizi Müslüman olarak öldür.",
            description: "Sabır ve şükür için dua."
        }
    ];

    const handleSelectEntry = (entry: any) => {
        setSelectedEntry(entry);
        setActiveTab('sukur_vakti');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-24">
            {/* Başlık */}
            <div className="text-center mb-8">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4
                    ${theme === 'light' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    <Heart className="w-5 h-5" />
                    <span className="font-bold text-sm">Şükür Vakti</span>
                </div>
                <h2 className={`text-2xl font-serif font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                    Şükür ve İbadet Köşesi
                </h2>
                <p className={`text-sm mt-2 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    Nimetlerin şükrünü eda edin, günlük ibadetlerinizi kaydedin
                </p>
            </div>

            {/* Sekmeler */}
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveSection('duas')}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all
                        ${activeSection === 'duas'
                            ? theme === 'light'
                                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                : 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                            : theme === 'light'
                                ? 'bg-white text-slate-600 border border-slate-200'
                                : 'bg-white/5 text-slate-300 border border-white/10'}`}
                >
                    <Heart className="w-4 h-4 inline mr-2" />
                    Şükür Duaları
                </button>
                <button
                    onClick={() => setActiveSection('journal')}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all
                        ${activeSection === 'journal'
                            ? theme === 'light'
                                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                : 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                            : theme === 'light'
                                ? 'bg-white text-slate-600 border border-slate-200'
                                : 'bg-white/5 text-slate-300 border border-white/10'}`}
                >
                    <BookOpen className="w-4 h-4 inline mr-2" />
                    Günlük Şükür
                </button>
            </div>

            {/* İçerik */}
            {activeSection === 'duas' && (
                <div className="space-y-4">
                    <VerseBanner />
                    <div className="space-y-3">
                        {sukruDualari.map((dua) => (
                            <div
                                key={dua.id}
                                className={`p-5 rounded-2xl border transition-all
                                    ${theme === 'light'
                                        ? 'bg-white/80 border-amber-200/60 shadow-sm hover:shadow-md'
                                        : 'bg-white/[0.03] border-amber-500/20 hover:bg-white/[0.05]'}`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className={`font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                                        {dua.title}
                                    </h3>
                                    <button
                                        className={`p-2 rounded-lg transition-colors
                                            ${theme === 'light' ? 'text-slate-400 hover:text-amber-500' : 'text-slate-500 hover:text-amber-400'}`}
                                        onClick={() => {
                                            navigator.clipboard.writeText(dua.turkish);
                                            alert('Dua metni kopyalandı!');
                                        }}
                                    >
                                        <Save className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className={`text-lg font-medium mb-2 text-center leading-relaxed
                                    ${theme === 'light' ? 'text-amber-800' : 'text-amber-200'}`}
                                    dir="rtl"
                                >
                                    {dua.arabic}
                                </p>
                                <p className={`text-sm mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                                    {dua.turkish}
                                </p>
                                <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {dua.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeSection === 'journal' && (
                <div className="space-y-6">
                    <JournalEntryForm
                        onSave={handleSaveEntry}
                        selectedEntry={selectedEntry}
                        onCancel={() => setSelectedEntry(undefined)}
                    />
                    {entries.length > 0 && (
                        <div className="mt-6">
                            <h3 className={`text-lg font-bold mb-4 ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                                Son Şükür Notları
                            </h3>
                            <JournalHistory
                                entries={entries.slice(0, 5)}
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
                                    Tüm Geçmişi Gör ({entries.length}) →
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SukurVaktiView;