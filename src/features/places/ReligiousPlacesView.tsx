import React, { useState } from 'react';
import { Map, Navigation, ArrowLeft, Star, Clock, MapPin } from 'lucide-react';
import { useTheme } from '../../core/ThemeContext';

interface ReligiousPlace {
    id: string;
    name: string;
    city: string;
    description: string;
    imageUrl: string;
    historicalInfo: string;
    details: string;
}

const PLACES: ReligiousPlace[] = [
    {
        id: '1',
        name: 'Ayasofya-i Kebir Câmi-i Şerîfi',
        city: 'İstanbul',
        description: 'Dünya mimarlık tarihinin günümüze kadar ayakta kalmış en önemli anıtları arasında yer alan muazzam yapı.',
        imageUrl: 'https://images.unsplash.com/photo-1598911543285-cfdb8c46ce19?q=80&w=600&auto=format&fit=crop',
        historicalInfo: '532-537 yılları arasında inşa edilmiş, 1453\'te camiye çevrilmiştir.',
        details: 'Fatih Sultan Mehmet\'in fethinden sonra İslam dünyasının en önemli sembollerinden biri olmuştur. İçerisindeki hat levhaları ve mimari dokusuyla büyüleyicidir.'
    },
    {
        id: '2',
        name: 'Sultanahmet Camii',
        city: 'İstanbul',
        description: 'Mavi çinileriyle dünyaca ünlü, altı minaresiyle eşsiz bir Osmanlı mimarisi şaheseri.',
        imageUrl: 'https://images.unsplash.com/photo-1541432900762-1ee7c5fb12b5?q=80&w=600&auto=format&fit=crop',
        historicalInfo: '1609-1616 yılları arasında I. Ahmed tarafından yaptırılmıştır.',
        details: 'Mimar Sedefkâr Mehmed Ağa\'nın eseridir. Klasik dönemin en büyük eserlerinden sayılır. Turistler tarafından "Mavi Cami (Blue Mosque)" olarak bilinir.'
    },
    {
        id: '3',
        name: 'Mevlânâ Müzesi ve Türbesi',
        city: 'Konya',
        description: 'Mevlânâ Celâleddîn-i Rûmî\'nin kabrinin bulunduğu maneviyat dolu külliye.',
        imageUrl: 'https://images.unsplash.com/photo-1627993339396-857c3fcb2230?q=80&w=600&auto=format&fit=crop',
        historicalInfo: 'Aslen Selçuklu Sarayı\'nın gül bahçesiyken Sultan Alâeddin Keykubad tarafından Mevlânâ\'nın babasına hediye edilmiştir.',
        details: 'Yeşil Kubbe (Kubbe-i Hadra) ile tanınır. Her yıl yüz binlerce ziyaretçi tarafından dualarla ziyaret edilmektedir.'
    },
    {
        id: '4',
        name: 'Balıklıgöl (Halil-ür Rahman)',
        city: 'Şanlıurfa',
        description: 'Hz. İbrahim\'in ateşe atıldığı yer olarak bilinen, içindeki kutsal balıklarla meşhur göl.',
        imageUrl: 'https://images.unsplash.com/photo-1588614925721-e374d75432a5?q=80&w=600&auto=format&fit=crop',
        historicalInfo: 'Tarihi Urfa Kalesi\'nin hemen önünde yer alan, dini ve efsanevi önemi çok büyük bir alandır.',
        details: 'Gölün içindeki sazan türü balıklar kutsal kabul edildiğinden yenilmez ve korunur. Çevresindeki camiler ve yeşil alan manevi bir huzur verir.'
    },
    {
        id: '5',
        name: 'Eyüp Sultan Camii ve Türbesi',
        city: 'İstanbul',
        description: 'İstanbul\'un ilk camilerinden olup, Hz. Muhammed\'i evinde misafir eden Ebu Eyyûb el-Ensarî\'nin kabrini barındırır.',
        imageUrl: 'https://images.unsplash.com/photo-1601618055418-68f742f88ea5?q=80&w=600&auto=format&fit=crop',
        historicalInfo: '1458 yılında Fatih Sultan Mehmet tarafından inşa ettirilmiştir.',
        details: 'İstanbul\'un manevi kalbi konumundadır. Özellikle cuma günleri, kandil geceleri ve ramazan aylarında en çok ziyaret edilen mekânların başında gelir.'
    },
    {
        id: '6',
        name: 'Süleymaniye Camii',
        city: 'İstanbul',
        description: 'Kanunî Sultan Süleyman adına Mimar Sinan tarafından yapılan ihtişamlı külliye.',
        imageUrl: 'https://images.unsplash.com/photo-1579758774794-273f5505e6b2?q=80&w=600&auto=format&fit=crop',
        historicalInfo: '1551-1557 yılları arasında inşa edilmiştir.',
        details: 'Mimar Sinan\'ın kalfalık eseri olarak adlandırdığı bu cami, mükemmel akustiği, hava akımı mühendisliği ve sade ihtişamıyla İslam mimarisinin zirvelerindendir.'
    }
];

const ReligiousPlacesView: React.FC = () => {
    const { theme } = useTheme();
    const [selectedPlace, setSelectedPlace] = useState<ReligiousPlace | null>(null);

    // Detay Görünümü
    if (selectedPlace) {
        return (
            <div className="space-y-6 animate-fadeIn pb-24">
                <button
                    onClick={() => setSelectedPlace(null)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95
                        ${theme === 'light' ? 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200' : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/5'}`}
                >
                    <ArrowLeft className="w-4 h-4" /> Geri Dön
                </button>

                <div className={`overflow-hidden rounded-[2rem] border transition-all
                    ${theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-white/10'}`}>

                    <div className="h-64 relative">
                        <img
                            src={selectedPlace.imageUrl}
                            alt={selectedPlace.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white/90 text-[10px] font-bold uppercase tracking-wider w-fit mb-3">
                                <MapPin className="w-3 h-3" /> {selectedPlace.city}
                            </span>
                            <h2 className="text-2xl font-serif font-bold text-white leading-tight">
                                {selectedPlace.name}
                            </h2>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2
                                ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`}>
                                <Star className="w-4 h-4" /> Hakkında
                            </h3>
                            <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                                {selectedPlace.description}
                            </p>
                        </div>

                        <div>
                            <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2
                                ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`}>
                                <Clock className="w-4 h-4" /> Tarihçe
                            </h3>
                            <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                                {selectedPlace.historicalInfo}
                            </p>
                        </div>

                        <div>
                            <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2
                                ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`}>
                                <Navigation className="w-4 h-4" /> Ziyaret Bilgisi
                            </h3>
                            <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                                {selectedPlace.details}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Liste Görünümü
    return (
        <div className="space-y-6 animate-fadeIn pb-24">
            <div className="text-center mb-6">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4
                    ${theme === 'light' ? 'bg-sky-50 text-sky-600 border border-sky-200' : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'}`}>
                    <Map className="w-5 h-5" />
                    <span className="font-bold text-sm">Dini Mekanlar</span>
                </div>
                <h2 className={`text-2xl font-serif font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                    Türkiye'nin Kutsal Mirası
                </h2>
                <p className={`text-sm mt-2 px-4 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    Geçmişten günümüze manevi havasıyla huzur veren kutsal mekanlarımızı keşfedin.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PLACES.map(place => (
                    <button
                        key={place.id}
                        onClick={() => setSelectedPlace(place)}
                        className={`text-left rounded-3xl overflow-hidden border transition-all duration-300 group
                            ${theme === 'light'
                                ? 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10'
                                : 'bg-white/[0.02] border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.04]'}`}
                    >
                        <div className="h-40 relative overflow-hidden">
                            <img
                                src={place.imageUrl}
                                alt={place.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-3 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                                <MapPin className="w-3 h-3" /> {place.city}
                            </div>
                        </div>

                        <div className="p-5">
                            <h3 className={`font-serif font-bold text-lg mb-2 line-clamp-1
                                ${theme === 'light' ? 'text-slate-800' : 'text-slate-100'}`}>
                                {place.name}
                            </h3>
                            <p className={`text-xs line-clamp-2 leading-relaxed
                                ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                                {place.description}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ReligiousPlacesView;
