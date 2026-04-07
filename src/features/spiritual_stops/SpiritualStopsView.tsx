import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Plus, Trash2, Search, Info, Camera, ExternalLink, Map as MapIcon } from 'lucide-react';
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
    const [newImageUrl, setNewImageUrl] = useState<string | undefined>(undefined);
    const [newMapsUrl, setNewMapsUrl] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadCustomStops();
    }, []);

    const loadCustomStops = async () => {
        const custom = await storageService.getCustomStops();
        setStops([...STATIC_STOPS, ...custom]);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 400;
                const MAX_HEIGHT = 400;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                setNewImageUrl(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
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
            isCustom: true,
            imageUrl: newImageUrl,
            googleMapsUrl: newMapsUrl || undefined
        };

        await storageService.addCustomStop(newStop);
        setNewName('');
        setNewCity('');
        setNewDesc('');
        setNewImageUrl(undefined);
        setNewMapsUrl('');
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
                        {t('tabs.maneviDuraklar')}
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
                    <form onSubmit={handleAddStop} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input 
                                type="text" 
                                placeholder={t('spiritualStops.namePlaceholder') || 'Mekan İsmi'}
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="input-field"
                                required
                            />
                            <input 
                                type="text" 
                                placeholder={t('spiritualStops.cityPlaceholder') || 'Şehir'}
                                value={newCity}
                                onChange={(e) => setNewCity(e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>
                        
                        <textarea 
                            placeholder={t('spiritualStops.descPlaceholder') || 'Kısa Açıklama'}
                            value={newDesc}
                            onChange={(e) => setNewDesc(e.target.value)}
                            className="input-field min-h-[100px]"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Image Picker */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                                    {t('spiritualStops.imageLabel')}
                                </label>
                                <div className="flex items-center gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`w-20 h-20 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all
                                            ${newImageUrl ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'}`}
                                    >
                                        {newImageUrl ? (
                                            <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            <>
                                                <Camera className="w-6 h-6 opacity-40" />
                                                <span className="text-[8px] font-bold">EKLE</span>
                                            </>
                                        )}
                                    </button>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="hidden"
                                        title={t('spiritualStops.imageLabel')}
                                    />
                                    {newImageUrl && (
                                        <button 
                                            type="button" 
                                            onClick={() => setNewImageUrl(undefined)}
                                            className="text-[10px] font-bold text-red-500 hover:underline"
                                        >
                                            Kaldır
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Maps URL */}
                            <div className="space-y-2">
                                <label htmlFor="maps-url" className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                                    {t('spiritualStops.mapsLabel')}
                                </label>
                                <div className="relative">
                                    <MapIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        id="maps-url"
                                        type="url"
                                        placeholder="https://maps.google.com/..."
                                        title={t('spiritualStops.mapsLabel')}
                                        value={newMapsUrl}
                                        onChange={(e) => setNewMapsUrl(e.target.value)}
                                        className="input-field pl-12 h-14"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary px-6 py-3">
                                {t('common.cancel')}
                            </button>
                            <button type="submit" className="btn-gold px-10 py-3 shadow-depth-light">
                                {t('common.save')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredStops.map((stop) => (
                    <div key={stop.id} 
                        className={`glass-card group transition-all duration-300 border border-transparent flex flex-col
                        ${expandedId === stop.id ? 'border-emerald-500/50 scale-[1.01]' : 'hover:border-emerald-500/30'}
                        ${theme === 'light' ? 'bg-white shadow-soft' : 'bg-slate-900/40'}`}>
                        
                        {/* Image Header if exists */}
                        {stop.imageUrl && (
                            <div className="w-full h-48 overflow-hidden relative rounded-t-[2rem]">
                                <img src={stop.imageUrl} alt={stop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest bg-emerald-500 px-3 py-1 rounded-full shadow-lg">
                                        {stop.city}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-3" onClick={() => setExpandedId(expandedId === stop.id ? null : stop.id)}>
                                <div className="flex-1 cursor-pointer">
                                    {!stop.imageUrl && (
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 mb-2 inline-block`}>
                                            {stop.city}
                                        </span>
                                    )}
                                    <h4 className={`text-lg font-bold leading-tight ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                                        {stop.name}
                                    </h4>
                                </div>
                                <div className="flex items-center gap-1">
                                    {stop.googleMapsUrl && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); window.open(stop.googleMapsUrl, '_blank'); }}
                                            className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                            title={t('spiritualStops.viewOnMap')}
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    )}
                                    {stop.isCustom && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDeleteStop(stop.id); }}
                                            className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                            title={t('common.delete')}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    <div className={`p-2 transition-transform duration-300 ${expandedId === stop.id ? 'rotate-180' : ''}`}>
                                        <Info className={`w-5 h-5 ${expandedId === stop.id ? 'text-emerald-500' : 'text-slate-400'}`} />
                                    </div>
                                </div>
                            </div>

                            <p className={`text-sm leading-relaxed mb-4 line-clamp-3 ${expandedId === stop.id ? 'line-clamp-none' : ''} ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
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

                            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                <span>{stop.isCustom ? t('spiritualStops.userAdded') : t('spiritualStops.recommended')}</span>
                                {!stop.imageUrl && stop.city && <span>{stop.city}</span>}
                            </div>
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
