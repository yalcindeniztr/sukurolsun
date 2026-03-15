import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Search, Info } from 'lucide-react';
import { useTheme } from '../../core/ThemeContext';
import { useLanguage } from '../../core/LanguageContext';
import { storageService } from '../../services/storage.service';

import { STATIC_STOPS as SPIRITUAL_DATA_CORE, SpiritualStop } from '../../constants/spiritual_data';

const STATIC_STOPS = SPIRITUAL_DATA_CORE;

const SpiritualStopsView: React.FC = () => {
    const { theme } = useTheme();
    const { language, t } = useLanguage();
    const [stops, setStops] = useState<SpiritualStop[]>(STATIC_STOPS);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    
    const [newName, setNewName] = useState('');
    const [newCity, setNewCity] = useState('');
    const [newDesc, setNewDesc] = useState('');

    useEffect(() => {
        loadCustomStops();
    }, []);

    const loadCustomStops = async () => {
        const custom = await storageService.getCustomStops();
        setStops([...STATIC_STOPS, ...custom]);
    };

    const handleAddStop = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newCity) return;

        const newStop: SpiritualStop = {
            id: Date.now().toString(),
            name: newName,
            city: newCity,
            descriptionTr: newDesc,
            descriptionEn: newDesc,
            featuresTr: '',
            featuresEn: '',
            howToGetTr: '',
            howToGetEn: '',
            isCustom: true
        };

        await storageService.addCustomStop(newStop);
        setNewName('');
        setNewCity('');
        setNewDesc('');
        setShowAddForm(false);
        loadCustomStops();
    };

    const handleDeleteStop = async (id: string) => {
        if (window.confirm(t('common.deleteConfirm'))) {
            await storageService.deleteCustomStop(id);
            loadCustomStops();
        }
    };

    const filteredStops = stops.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* Header section with search */}
            <div className={`glass-card p-6 ${theme === 'light' ? 'bg-white/80' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h2 className={`text-2xl font-serif text-emerald-800 dark:text-emerald-400 flex items-center gap-3`}>
                        <MapPin className="w-6 h-6" />
                        {t('nav.maneviDuraklar')}
                    </h2>
                    
                    <button 
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="btn-primary flex items-center gap-2 px-4 py-2 text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        {t('common.add')}
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                        type="text"
                        placeholder={t('common.search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`input-field pl-12 ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/5'}`}
                    />
                </div>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <div className={`glass-card p-6 animate-scale-in ${theme === 'light' ? 'bg-white' : ''}`}>
                    <h3 className="text-lg font-bold mb-4">{t('spiritualStops.addNew')}</h3>
                    <form onSubmit={handleAddStop} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input 
                                type="text" 
                                placeholder={t('spiritualStops.namePlaceholder' as any) || 'Mekan İsmi'}
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="input-field"
                                required
                            />
                            <input 
                                type="text" 
                                placeholder={t('spiritualStops.cityPlaceholder' as any) || 'Şehir'}
                                value={newCity}
                                onChange={(e) => setNewCity(e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>
                        <textarea 
                            placeholder={t('spiritualStops.descPlaceholder' as any) || 'Kısa Açıklama'}
                            value={newDesc}
                            onChange={(e) => setNewDesc(e.target.value)}
                            className="input-field min-h-[100px]"
                        />
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary px-6">
                                {t('common.cancel')}
                            </button>
                            <button type="submit" className="btn-gold px-8">
                                {t('common.save')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredStops.map((stop) => (
                    <div key={stop.id} 
                        className={`glass-card p-5 group transition-all duration-300 border border-transparent 
                        ${expandedId === stop.id ? 'border-emerald-500/50 scale-[1.01]' : 'hover:border-emerald-500/30'}
                        ${theme === 'light' ? 'bg-white shadow-soft' : 'bg-slate-900/40'}`}>
                        
                        <div className="flex justify-between items-start mb-3" onClick={() => setExpandedId(expandedId === stop.id ? null : stop.id)}>
                            <div className="flex-1 cursor-pointer">
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 mb-2 inline-block`}>
                                    {stop.city}
                                </span>
                                <h4 className={`text-lg font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                                    {stop.name}
                                </h4>
                            </div>
                            <div className="flex items-center gap-1">
                                {stop.isCustom && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDeleteStop(stop.id); }}
                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                <div className={`p-2 transition-transform duration-300 ${expandedId === stop.id ? 'rotate-180' : ''}`}>
                                    <Info className={`w-5 h-5 ${expandedId === stop.id ? 'text-emerald-500' : 'text-slate-400'}`} />
                                </div>
                            </div>
                        </div>

                        <p className={`text-sm leading-relaxed mb-2 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                            {language === 'tr' ? stop.descriptionTr : stop.descriptionEn}
                        </p>

                        {/* Expandable Details */}
                        {expandedId === stop.id && (
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 space-y-4 animate-scale-in">
                                {((language === 'tr' ? stop.featuresTr : stop.featuresEn)) && (
                                    <div>
                                        <h5 className="text-[10px] font-black tracking-widest text-emerald-500 uppercase mb-1">
                                            {language === 'tr' ? 'ÖNE ÇIKAN ÖZELLİKLER' : 'KEY FEATURES'}
                                        </h5>
                                        <p className="text-xs text-slate-500 leading-relaxed italic">
                                            {language === 'tr' ? stop.featuresTr : stop.featuresEn}
                                        </p>
                                    </div>
                                )}
                                {((language === 'tr' ? stop.howToGetTr : stop.howToGetEn)) && (
                                    <div>
                                        <h5 className="text-[10px] font-black tracking-widest text-amber-500 uppercase mb-1">
                                            {language === 'tr' ? 'NASIL GİDİLİR?' : 'HOW TO GET THERE?'}
                                        </h5>
                                        <p className="text-xs text-slate-500 leading-relaxed italic">
                                            {language === 'tr' ? stop.howToGetTr : stop.howToGetEn}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                            {stop.isCustom ? t('common.userAdded') : t('common.recommended')}
                        </div>
                    </div>
                ))}
            </div>

            {filteredStops.length === 0 && (
                <div className="text-center py-20 opacity-50">
                    <Search className="w-12 h-12 mx-auto mb-4" />
                    <p>{t('common.noResults')}</p>
                </div>
            )}
        </div>
    );
};

export default SpiritualStopsView;
