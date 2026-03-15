import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Search, Info } from 'lucide-react';
import { useTheme } from '../../core/ThemeContext';
import { useLanguage } from '../../core/LanguageContext';
import { storageService } from '../../services/storage.service';

interface SpiritualStop {
    id: string;
    name: string;
    city: string;
    descriptionTr: string;
    descriptionEn: string;
    isCustom?: boolean;
}

const STATIC_STOPS: SpiritualStop[] = [
    { id: 'ist_1', name: 'Sultan Ahmed Camii', city: 'İstanbul', descriptionTr: 'Mavi Camii olarak da bilinir, 6 minaresiyle ünlüdür.', descriptionEn: 'Also known as the Blue Mosque, famous for its 6 minarets.' },
    { id: 'ist_2', name: 'Ayasofya-i Kebir Cami-i Şerifi', city: 'İstanbul', descriptionTr: 'Dünya mimarlık tarihinin en önemli yapılarından biridir.', descriptionEn: 'One of the most important structures in the history of world architecture.' },
    { id: 'ist_3', name: 'Eyüp Sultan Camii', city: 'İstanbul', descriptionTr: 'Ebu Eyyub el-Ensari\'nin türbesine ev sahipliği yapar.', descriptionEn: 'Hosts the tomb of Abu Ayyub al-Ansari.' },
    { id: 'edr_1', name: 'Selimiye Camii', city: 'Edirne', descriptionTr: 'Mimar Sinan\'ın ustalık eseridir.', descriptionEn: 'Mimar Sinan\'s masterpiece.' },
    { id: 'kon_1', name: 'Mevlana Müzesi', city: 'Konya', descriptionTr: 'Hazreti Mevlana\'nın dergahı ve türbesidir.', descriptionEn: 'The dervish lodge and tomb of Mevlana Rumi.' },
    { id: 'san_1', name: 'Balıklıgöl (Rızvaniye Camii)', city: 'Şanlıurfa', descriptionTr: 'Hz. İbrahim\'in ateşe atıldığı yer olarak bilinir.', descriptionEn: 'Known as the place where Prophet Abraham was thrown into the fire.' },
    { id: 'ank_1', name: 'Hacı Bayram-ı Veli Camii', city: 'Ankara', descriptionTr: 'Ankara\'nın manevi merkezidir.', descriptionEn: 'The spiritual center of Ankara.' },
    { id: 'bur_1', name: 'Ulu Cami', city: 'Bursa', descriptionTr: 'Osmanlı mimarisinin en görkemli örneklerinden biridir.', descriptionEn: 'One of the most magnificent examples of Ottoman architecture.' },
];

const SpiritualStopsView: React.FC = () => {
    const { theme } = useTheme();
    const { language, t } = useLanguage();
    const [stops, setStops] = useState<SpiritualStop[]>(STATIC_STOPS);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    
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
                        {t('sidebar.maneviDuraklar' as any) || 'Manevi Duraklar'}
                    </h2>
                    
                    <button 
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="btn-primary flex items-center gap-2 px-4 py-2 text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        {t('common.add' as any) || 'Yeni Ekle'}
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                        type="text"
                        placeholder={t('common.search' as any) || 'Ara... (İsim veya Şehir)'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`input-field pl-12 ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/5'}`}
                    />
                </div>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <div className={`glass-card p-6 animate-scale-in ${theme === 'light' ? 'bg-white' : ''}`}>
                    <h3 className="text-lg font-bold mb-4">{t('spiritualStops.addNew' as any) || 'Yeni Mekan Ekle'}</h3>
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
                    <div key={stop.id} className={`glass-card p-5 group transition-all hover:scale-[1.02] border border-transparent hover:border-emerald-500/30 ${theme === 'light' ? 'bg-white shadow-soft' : 'bg-slate-900/40'}`}>
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 mb-2 inline-block`}>
                                    {stop.city}
                                </span>
                                <h4 className={`text-lg font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                                    {stop.name}
                                </h4>
                            </div>
                            {stop.isCustom && (
                                <button 
                                    onClick={() => handleDeleteStop(stop.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                            {language === 'tr' ? stop.descriptionTr : stop.descriptionEn}
                        </p>
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                            <Info className="w-3 h-3" />
                            {stop.isCustom ? (t('common.userAdded' as any) || 'SİZİN EKLEMENİZ') : (t('common.recommended' as any) || 'ÖNERİLEN DURAK')}
                        </div>
                    </div>
                ))}
            </div>

            {filteredStops.length === 0 && (
                <div className="text-center py-20 opacity-50">
                    <Search className="w-12 h-12 mx-auto mb-4" />
                    <p>{t('common.noResults' as any) || 'Sonuç bulunamadı.'}</p>
                </div>
            )}
        </div>
    );
};

export default SpiritualStopsView;
