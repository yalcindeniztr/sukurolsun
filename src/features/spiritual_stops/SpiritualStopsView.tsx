import React, { useState, useEffect, useRef } from 'react';
import { CalendarPlus, MapPin, Plus, Trash2, Search, Info, Camera, ExternalLink, Map as MapIcon, Route, X } from 'lucide-react';
import { Preferences } from '@capacitor/preferences';
import { useTheme } from '../../core/ThemeContext';
import { useLanguage } from '../../core/LanguageContext';
import { storageService } from '../../services/storage.service';

import { STATIC_STOPS as SPIRITUAL_DATA_CORE, SpiritualStop } from '../../constants/spiritual_data';

const RELIGIOUS_PLACE_KEYWORDS = [
    'cami', 'camii', 'mescit', 'türbe', 'makam', 'külliye',
    'mevlevi', 'mevlevihane', 'sahabe', 'hz.', 'hacı', 'tekke', 'dergah'
];

const STATIC_STOPS = SPIRITUAL_DATA_CORE.filter((stop) => {
    const haystack = `${stop.name} ${stop.descriptionTr} ${stop.featuresTr}`.toLocaleLowerCase('tr-TR');
    return RELIGIOUS_PLACE_KEYWORDS.some(keyword => haystack.includes(keyword));
});

const DEFAULT_STOP_IMAGE = `${import.meta.env.BASE_URL || '/'}assets/themes/kabe.png`;
const SPIRITUAL_PLAN_KEY = 'spiritual_stops_trip_plan';

const SUPPLEMENTAL_STOPS: SpiritualStop[] = [
    { id: 'sup_ist_1', name: 'Süleymaniye Camii ve Külliyesi', city: 'İstanbul', descriptionTr: 'Mimar Sinan imzalı Osmanlı külliyesi ve İstanbul siluetinin en güçlü duraklarından biridir.', descriptionEn: 'An Ottoman complex by Mimar Sinan and one of Istanbul skyline landmarks.', featuresTr: 'Cami, hazire, medrese ve avlular birlikte gezilebilir.', featuresEn: 'Mosque, cemetery, madrasas and courtyards can be visited together.', howToGetTr: 'Fatih ilçesinde; Eminönü, Beyazıt veya Vezneciler yönünden ulaşılabilir.', howToGetEn: 'In Fatih; accessible from Eminönü, Beyazıt or Vezneciler.' },
    { id: 'sup_ist_2', name: 'Sultanahmet Camii', city: 'İstanbul', descriptionTr: 'Klasik Osmanlı mimarisinin dünyaca bilinen en önemli camilerindendir.', descriptionEn: 'One of the world-known mosques of classical Ottoman architecture.', featuresTr: 'Sultanahmet Meydanı, Ayasofya-i Kebir ve tarihi yarımada rotasıyla birlikte gezilir.', featuresEn: 'Often visited with Sultanahmet Square, Hagia Sophia Grand Mosque and the historic peninsula.', howToGetTr: 'Tramvayla Sultanahmet durağından yürüyerek ulaşılır.', howToGetEn: 'Reach by tram and walk from Sultanahmet stop.' },
    { id: 'sup_ist_3', name: 'Mihrimah Sultan Camii', city: 'İstanbul', descriptionTr: 'Üsküdar sahilinde Kanuni Sultan Süleyman dönemi eseri zarif bir camidir.', descriptionEn: 'An elegant mosque from Suleiman the Magnificent era on Üsküdar coast.', featuresTr: 'Üsküdar sahili, Aziz Mahmud Hüdayi ve Şemsi Paşa rotasına eklenebilir.', featuresEn: 'Can be combined with Üsküdar coast, Aziz Mahmud Hüdayi and Şemsi Paşa route.', howToGetTr: 'Üsküdar meydanından kısa yürüyüşle ulaşılır.', howToGetEn: 'A short walk from Üsküdar square.' },
    { id: 'sup_ank_1', name: 'Aslanhane Camii', city: 'Ankara', descriptionTr: 'Ahşap direkli Anadolu Selçuklu camilerinin seçkin örneklerindendir.', descriptionEn: 'A distinguished example of wooden-column Anatolian Seljuk mosques.', featuresTr: 'Ankara Kalesi çevresiyle birlikte tarihi yürüyüş rotasına uygundur.', featuresEn: 'Fits a historical walking route around Ankara Castle.', howToGetTr: 'Altındağ, Kale çevresinde yer alır.', howToGetEn: 'Located around the Castle area in Altındağ.' },
    { id: 'sup_ank_2', name: 'Taceddin Dergahı', city: 'Ankara', descriptionTr: 'Mehmet Akif Ersoy ve İstiklal Marşı hatırasıyla kültürel değeri yüksek bir duraktır.', descriptionEn: 'A culturally significant stop tied to Mehmet Akif Ersoy and the Independence March.', featuresTr: 'Hamamönü ve Hacı Bayram rotasıyla birlikte gezilebilir.', featuresEn: 'Can be visited with Hamamönü and Hacı Bayram route.', howToGetTr: 'Hamamönü bölgesinde yürüyüş rotası içindedir.', howToGetEn: 'Within the Hamamönü walking area.' },
    { id: 'sup_kon_1', name: 'Şems-i Tebrizi Türbesi ve Camii', city: 'Konya', descriptionTr: 'Mevlana düşünce dünyasının en önemli isimlerinden Şems-i Tebrizi adına ziyaret edilen mekandır.', descriptionEn: 'A visited site dedicated to Shams-i Tabrizi, a key name in Rumi tradition.', featuresTr: 'Mevlana Müzesi ile aynı gün planlanabilir.', featuresEn: 'Can be planned on the same day as the Mevlana Museum.', howToGetTr: 'Konya merkezde yürüyüşle ulaşılabilir.', howToGetEn: 'Reachable by walking in central Konya.' },
    { id: 'sup_kon_2', name: 'Alaeddin Camii', city: 'Konya', descriptionTr: 'Anadolu Selçuklu başkentinin en önemli tarihi camilerindendir.', descriptionEn: 'One of the key historical mosques of the Anatolian Seljuk capital.', featuresTr: 'Alaeddin Tepesi ve çevresiyle kültürel rota oluşturur.', featuresEn: 'Forms a cultural route with Alaeddin Hill and surroundings.', howToGetTr: 'Alaeddin Tepesi üzerindedir; tramvayla ulaşım kolaydır.', howToGetEn: 'On Alaeddin Hill; easy access by tram.' },
    { id: 'sup_bur_1', name: 'Yeşil Cami ve Yeşil Türbe', city: 'Bursa', descriptionTr: 'Erken Osmanlı sanatının çini ve mimari yönüyle öne çıkan duraklarıdır.', descriptionEn: 'Prominent early Ottoman stops known for tiles and architecture.', featuresTr: 'Emir Sultan ve Ulu Cami rotasıyla aynı güne alınabilir.', featuresEn: 'Can be added to the same day as Emir Sultan and Grand Mosque.', howToGetTr: 'Yıldırım ilçesinde, merkezden toplu taşıma ile gidilebilir.', howToGetEn: 'In Yıldırım; accessible by public transport from the center.' },
    { id: 'sup_edi_1', name: 'Muradiye Camii', city: 'Edirne', descriptionTr: 'Çinileriyle tanınan, sakin ve tarihi bir Osmanlı camiidir.', descriptionEn: 'A quiet historical Ottoman mosque known for its tiles.', featuresTr: 'Selimiye, Eski Cami ve Üç Şerefeli rota zincirine eklenebilir.', featuresEn: 'Can be added to Selimiye, Old Mosque and Üç Şerefeli route chain.', howToGetTr: 'Edirne merkezden kısa araç yolculuğuyla ulaşılır.', howToGetEn: 'A short ride from Edirne center.' },
    { id: 'sup_urf_1', name: 'Rızvaniye Camii', city: 'Şanlıurfa', descriptionTr: 'Balıklıgöl kıyısında manevi ve tarihi dokunun içinde yer alır.', descriptionEn: 'Located by Balıklıgöl within a spiritual and historical setting.', featuresTr: 'Balıklıgöl, Halil-ür Rahman ve çarşı rotasıyla birlikte gezilir.', featuresEn: 'Visited with Balıklıgöl, Halil-ur Rahman and bazaar route.', howToGetTr: 'Balıklıgöl çevresindedir; merkezden yürüyerek ulaşılabilir.', howToGetEn: 'Around Balıklıgöl; reachable by walking from the center.' },
    { id: 'sup_diy_1', name: 'Dört Ayaklı Minare ve Şeyh Mutahhar Camii', city: 'Diyarbakır', descriptionTr: 'Sur içindeki sembol yapılardan, tarih ve mimari değeri yüksek bir duraktır.', descriptionEn: 'A symbolic structure inside Sur with strong historical and architectural value.', featuresTr: 'Ulu Cami ve Suriçi yürüyüş rotasına eklenebilir.', featuresEn: 'Can be added to Grand Mosque and Sur walking route.', howToGetTr: 'Suriçi bölgesinde yürüyerek gezilebilir.', howToGetEn: 'Walkable within the Sur district.' },
    { id: 'sup_erz_1', name: 'Çifte Minareli Medrese', city: 'Erzurum', descriptionTr: 'Selçuklu taş işçiliğinin en görkemli kültürel miraslarından biridir.', descriptionEn: 'One of the grand cultural heritages of Seljuk stonework.', featuresTr: 'Ulu Cami ve Üç Kümbetler rotasıyla birlikte planlanır.', featuresEn: 'Planned with Grand Mosque and Three Tombs route.', howToGetTr: 'Erzurum merkezde tarihi yürüyüş alanındadır.', howToGetEn: 'In central Erzurum historical walking area.' },
    { id: 'sup_kay_1', name: 'Hunat Hatun Külliyesi', city: 'Kayseri', descriptionTr: 'Cami, medrese ve türbe yapılarıyla Selçuklu şehir mirasının merkezindedir.', descriptionEn: 'A Seljuk urban heritage center with mosque, madrasa and tomb.', featuresTr: 'Kayseri Kalesi ve Kapalı Çarşı çevresiyle kolayca gezilir.', featuresEn: 'Easy to visit with Kayseri Castle and bazaar area.', howToGetTr: 'Cumhuriyet Meydanı yakınındadır.', howToGetEn: 'Near Cumhuriyet Square.' },
    { id: 'sup_sam_1', name: 'Büyük Cami', city: 'Samsun', descriptionTr: 'Samsun merkezde tarihi dokusu ve ibadet geleneğiyle öne çıkan camidir.', descriptionEn: 'A central Samsun mosque known for its historical texture and worship tradition.', featuresTr: 'Saathane ve merkez yürüyüş rotasına eklenebilir.', featuresEn: 'Can be added to Saathane and central walking route.', howToGetTr: 'İlkadım merkezde yürüyerek ulaşılabilir.', howToGetEn: 'Reachable by walking in İlkadım center.' },
    { id: 'sup_izm_1', name: 'Hisar Camii', city: 'İzmir', descriptionTr: 'Kemeraltı içinde İzmir’in en eski ve en bilinen camilerindendir.', descriptionEn: 'One of Izmir oldest and best-known mosques inside Kemeraltı.', featuresTr: 'Kemeraltı, Kızlarağası Hanı ve Konak rotasına uygundur.', featuresEn: 'Fits Kemeraltı, Kızlarağası Han and Konak route.', howToGetTr: 'Konak veya Çankaya yönünden yürüyerek ulaşılır.', howToGetEn: 'Walkable from Konak or Çankaya.' },
    { id: 'sup_tra_1', name: 'Gülbahar Hatun Türbesi', city: 'Trabzon', descriptionTr: 'Osmanlı döneminden kalan önemli bir ziyaret ve kültür noktasıdır.', descriptionEn: 'An important Ottoman-era visiting and cultural point.', featuresTr: 'Ortahisar ve Ayasofya Camii rotasıyla birlikte değerlendirilebilir.', featuresEn: 'Can be combined with Ortahisar and Hagia Sophia Mosque route.', howToGetTr: 'Ortahisar bölgesine yakın konumdadır.', howToGetEn: 'Located near Ortahisar area.' },
];

const ENRICHED_STATIC_STOPS = [...STATIC_STOPS, ...SUPPLEMENTAL_STOPS];

const SpiritualStopsView: React.FC = () => {
    const { theme } = useTheme();
    const { language, t } = useLanguage();
    const [stops, setStops] = useState<SpiritualStop[]>(ENRICHED_STATIC_STOPS);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCityFilter, setSelectedCityFilter] = useState('all');
    const [tripPlanIds, setTripPlanIds] = useState<string[]>([]);
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
        loadTripPlan();
    }, []);

    const loadCustomStops = async () => {
        const custom = await storageService.getCustomStops();
        setStops([...ENRICHED_STATIC_STOPS, ...custom]);
    };

    const loadTripPlan = async () => {
        const { value } = await Preferences.get({ key: SPIRITUAL_PLAN_KEY });
        if (!value) return;
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) setTripPlanIds(parsed.filter((id) => typeof id === 'string'));
        } catch {
            setTripPlanIds([]);
        }
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

    const cities = Array.from(new Set(stops.map((stop) => stop.city))).sort((a, b) => a.localeCompare(b, 'tr-TR'));

    const filteredStops = stops.filter(s => {
        const query = searchTerm.toLocaleLowerCase('tr-TR');
        const matchesSearch = s.name.toLocaleLowerCase('tr-TR').includes(query) ||
            s.city.toLocaleLowerCase('tr-TR').includes(query);
        const matchesCity = selectedCityFilter === 'all' || s.city === selectedCityFilter;
        return matchesSearch && matchesCity;
    });

    const getStopImage = (stop: SpiritualStop) => stop.imageUrl || DEFAULT_STOP_IMAGE;
    const getDirectionsUrl = (stop: SpiritualStop) =>
        stop.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${stop.name} ${stop.city}`)}`;
    const tripPlanStops = tripPlanIds
        .map((id) => stops.find((stop) => stop.id === id))
        .filter((stop): stop is SpiritualStop => Boolean(stop));
    const isInTripPlan = (id: string) => tripPlanIds.includes(id);
    const saveTripPlan = async (ids: string[]) => {
        setTripPlanIds(ids);
        await Preferences.set({ key: SPIRITUAL_PLAN_KEY, value: JSON.stringify(ids) });
    };
    const toggleTripPlan = async (stop: SpiritualStop) => {
        const next = isInTripPlan(stop.id)
            ? tripPlanIds.filter((id) => id !== stop.id)
            : [...tripPlanIds, stop.id];
        await saveTripPlan(next);
    };
    const openTripRoute = () => {
        if (tripPlanStops.length === 0) return;
        const destination = tripPlanStops[tripPlanStops.length - 1];
        const waypoints = tripPlanStops.slice(0, -1).map((stop) => `${stop.name} ${stop.city}`).join('|');
        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${destination.name} ${destination.city}`)}${waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ''}`;
        window.open(url, '_blank');
    };

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

                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
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
                    <select
                        value={selectedCityFilter}
                        onChange={(e) => setSelectedCityFilter(e.target.value)}
                        className={`input-field md:w-48 ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/5'}`}
                        title="İl seç"
                    >
                        <option value="all">Tüm İller</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>
            </div>

            {tripPlanStops.length > 0 && (
                <div className={`glass-card p-4 border ${theme === 'light' ? 'bg-white/85 border-emerald-100' : 'bg-slate-900/60 border-emerald-500/20'}`}>
                    <div className="flex items-center justify-between gap-3 mb-3">
                        <div>
                            <h3 className={`text-sm font-black ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>Gezi Planım</h3>
                            <p className="text-xs text-slate-500">{tripPlanStops.length} durak seçildi</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={openTripRoute}
                                className="h-9 px-3 rounded-xl bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 active:scale-95 transition-all"
                            >
                                <Route className="w-4 h-4" />
                                Rotayı Aç
                            </button>
                            <button
                                onClick={() => saveTripPlan([])}
                                className="h-9 w-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center active:scale-95 transition-all"
                                title="Planı temizle"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {tripPlanStops.map((stop, index) => (
                            <button
                                key={stop.id}
                                onClick={() => toggleTripPlan(stop)}
                                className="shrink-0 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold"
                                title="Plandan çıkar"
                            >
                                {index + 1}. {stop.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

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
                        
                        <div className="w-full h-36 overflow-hidden relative rounded-t-[2rem]">
                            <img src={getStopImage(stop)} alt={stop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
                                <span className="text-[10px] font-black text-white uppercase tracking-widest bg-emerald-500 px-3 py-1 rounded-full shadow-lg">
                                    {stop.city}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-3" onClick={() => setExpandedId(expandedId === stop.id ? null : stop.id)}>
                                <div className="flex-1 cursor-pointer">
                                    <h4 className={`text-lg font-bold leading-tight ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                                        {stop.name}
                                    </h4>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleTripPlan(stop); }}
                                        className={`p-2.5 rounded-xl transition-all shadow-sm
                                            ${isInTripPlan(stop.id)
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white'}`}
                                        title={isInTripPlan(stop.id) ? 'Plandan çıkar' : 'Gezi planına ekle'}
                                    >
                                        <CalendarPlus className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); window.open(getDirectionsUrl(stop), '_blank'); }}
                                        className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                        title={t('spiritualStops.viewOnMap') || 'Yol tarifi'}
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
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
                                                {language === 'tr' ? 'KISA BİLGİ' : 'SHORT INFO'}
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
                                <button
                                    onClick={() => window.open(getDirectionsUrl(stop), '_blank')}
                                    className="text-emerald-600 dark:text-emerald-400"
                                >
                                    {language === 'tr' ? 'YOL TARİFİ' : 'DIRECTIONS'}
                                </button>
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
