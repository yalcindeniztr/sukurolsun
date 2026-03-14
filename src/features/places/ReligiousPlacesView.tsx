import React, { useState } from 'react';
import { ArrowLeft, Clock, MapPin, Search, BusFront, Info, Map, Star } from 'lucide-react';
import { useTheme } from '../../core/ThemeContext';
import { useLanguage } from '../../core/LanguageContext';

interface ReligiousPlace {
    id: string;
    name: string;
    city: string;
    description: string;
    historicalInfo: string;
    transportation: string;
    visitingHours: string;
}

const PLACES: ReligiousPlace[] = [
    {
        id: '1',
        name: 'Ayasofya-i Kebir Câmi-i Şerîfi',
        city: 'İstanbul',
        description: 'Dünya mimarlık tarihinin en önemli anıtlarından biri. 1500 yıllık devasa bir miras.',
        historicalInfo: '537 yılında inşa edilen yapı, 1453 yılında Fatih Sultan Mehmet tarafından camiye çevrilmiştir. 2020 yılında tekrar ibadete açılmıştır.',
        transportation: 'T1 Kabataş-Bağcılar Tramvay hattı Sultanahmet durağında inerek ulaşabilirsiniz.',
        visitingHours: 'Vakit namazları dışında ziyarete açıktır. Cuma günleri namaz saatlerinde ziyaret kısıtlıdır.'
    },
    {
        id: '2',
        name: 'Eyüp Sultan Camii ve Türbesi',
        city: 'İstanbul',
        description: 'İstanbul\'un manevi kalbi. Hz. Peygamber\'i evinde misafir eden Ebu Eyyub el-Ensari\'nin kabri.',
        historicalInfo: 'İstanbul\'un fethinden sonra inşa edilen ilk büyük camidir. 1458 yılında Fatih Sultan Mehmet tarafından yaptırılmıştır.',
        transportation: 'Eminönü veya Üsküdar\'dan kalkan Haliç Hattı vapurları veya otobüslerle Eyüp durağında inerek ulaşılabilir.',
        visitingHours: '24 saat ziyarete açıktır.'
    },
    {
        id: '3',
        name: 'Mevlânâ Müzesi ve Türbesi',
        city: 'Konya',
        description: 'Büyük mutasavvıf Mevlânâ Celâleddîn-i Rûmî\'nin kabri ve dergahı.',
        historicalInfo: 'Eski adı "Asitane-i Aliye" olan dergah, 1926\'dan beri müze olarak hizmet vermektedir. Yeşil Kubbe ile sembolleşmiştir.',
        transportation: 'Konya şehir merkezinden tramvay hattıyla "Mevlana" durağında inerek ulaşabilirsiniz.',
        visitingHours: 'Yaz: 09:00-18:30, Kış: 09:00-16:40.'
    },
    {
        id: '4',
        name: 'Hacı Bayram-ı Veli Camii',
        city: 'Ankara',
        description: 'Ankara\'nın en önemli manevi merkezi. Bayramiyye tarikatının kurucusunun kabri.',
        historicalInfo: '1427-1428 yıllarında inşa edilmiştir. Yanında Augustus Tapınağı ile yan yana olması inançlar arası hoşgörünün simgesidir.',
        transportation: 'Ulus metro durağında inerek kısa bir yürüyüşle ulaşabilirsiniz.',
        visitingHours: 'Vakit namazlarında ibadete, diğer saatlerde ziyarete açıktır.'
    },
    {
        id: '5',
        name: 'Selimiye Camii',
        city: 'Edirne',
        description: 'Mimar Sinan\'ın "ustalık eserim" dediği, dünya mimarlık tarihinin zirvelerinden.',
        historicalInfo: 'II. Selim adına 1568-1575 yılları arasında Mimar Sinan tarafından inşa edilmiştir. UNESCO Dünya Miras Listesi\'ndedir.',
        transportation: 'Edirne şehir merkezinde yer almaktadır. Yürüyerek veya şehir içi minibüslerle kolayca ulaşılabilir.',
        visitingHours: 'Vakit namazları dışında ziyarete açıktır.'
    },
    {
        id: '6',
        name: 'Balıklıgöl (Halil-ür Rahman)',
        city: 'Şanlıurfa',
        description: 'Hz. İbrahim\'in ateşe atıldığı yer olarak inanılan, kutsal balıklarıyla ünlü mekan.',
        historicalInfo: 'Efsaneye göre Nemrut tarafından ateşe atılan Hz. İbrahim için ateş suya, odunlar ise balığa dönüşmüştür.',
        transportation: 'Şanlıurfa merkez dede osman mahallesinde yer alır. Şehir içi sarı minibüslerle ulaşım sağlanır.',
        visitingHours: 'Gün boyu ziyarete açıktır.'
    },
    {
        id: '7',
        name: 'Somuncu Baba Türbesi ve Külliyesi',
        city: 'Aksaray / Malatya',
        description: 'Şeyh Hamid-i Veli Hazretleri\'nin manevi huzurunun bulunduğu külliye.',
        historicalInfo: 'Hacı Bayram Veli\'nin hocası olan Somuncu Baba, Bursa Ulu Cami\'nin açılışında ilk hutbeyi okumasıyla meşhurdur.',
        transportation: 'Darende ilçesinde (Malatya) veya Aksaray merkezdeki Ervah Kabristanı yanındaki türbesine karayolu ile ulaşılır.',
        visitingHours: '08:00 - Akşam namazına kadar.'
    },
    {
        id: '8',
        name: 'Eshab-ı Kehf Mağarası',
        city: 'Kahramanmaraş / Mersin',
        description: 'Yedi Uyurlar (Eshab-ı Kehf) kıssasının yaşandığına inanılan kutsal mağara.',
        historicalInfo: 'Dönemin zalim hükümdarından kaçıp bir mağarada 309 yıl uyuyan gençlerin hikayesinin geçtiği mekandır.',
        transportation: 'Kahramanmaraş Afşin ilçesinde veya Mersin Tarsus ilçesindeki mağaralara özel araç veya ilçeler arası otobüslerle gidilir.',
        visitingHours: '08:00 - 19:00 saatleri arası.'
    },
    {
        id: '9',
        name: 'Veysel Karani Türbesi',
        city: 'Siirt',
        description: 'Peygamber sevgisiyle yanıp tutuşan, anne itaatinin simgesi Veysel Karani.',
        historicalInfo: 'Türbe, Siirt\'in Baykan ilçesine bağlı Ziyaret beldesindedir. 1901 ve 1967 yıllarında onarım görmüştür.',
        transportation: 'Siirt-Diyarbakır karayolu üzerinde yer alan Ziyaret beldesinde bulunmaktadır.',
        visitingHours: 'Sabah ezanından yatsı ezanına kadar.'
    },
    {
        id: '10',
        name: 'Ulu Cami',
        city: 'Bursa',
        description: 'Osmanlı mimarisinin ilk çok kubbeli anıtsal yapısı. Hat sanatı müzesi niteliğindedir.',
        historicalInfo: 'Yıldırım Bayezid tarafından Niğbolu Zaferi sonrası (1396-1399) yaptırılmıştır. İçindeki şadırvanıyla meşhurdur.',
        transportation: 'Bursa Heykel meydanındadır. Tramvay veya metrodan (Şehreküstü) inerek yürüyebilirsiniz.',
        visitingHours: 'Vakit namazları dışında ziyarete açıktır.'
    },
    {
        id: '11',
        name: 'Tillo (Aydınlar) Külliyesi',
        city: 'Siirt',
        description: 'İsmail Fakirullah Hazretleri ve İbrahim Hakkı Hazretleri\'nin bulunduğu ilim merkezi.',
        historicalInfo: 'İbrahim Hakkı Hazretleri\'nin hocası için kurduğu "Işık Hadisesi" düzeneği ile tanınır. Ekinokslarda güneş ışığı hocasının kabrine vurur.',
        transportation: 'Siirt merkezden kalkan minibüslerle Tillo ilçesine (yaklaşık 10km) ulaşılır.',
        visitingHours: 'Gündüz saatlerinde ziyarete açıktır.'
    },
    {
        id: '12',
        name: 'Muradiye Külliyesi',
        city: 'Bursa',
        description: 'Osmanlı hanedanına ait son büyük külliyedir ve Bursa\'nın manevi duraklarındandır.',
        historicalInfo: 'II. Murad tarafından yaptırılmıştır. İçerisinde Fatih Sultan Mehmet\'ten II. Murad\'a kadar birçok sultan ve aile ferdinin türbesi bulunur.',
        transportation: 'Bursa Osmangazi ilçesinde, Çekirge caddesi üzerinde yer alır.',
        visitingHours: '09:00 - 18:00'
    }
];

const ReligiousPlacesView: React.FC = () => {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const [selectedPlace, setSelectedPlace] = useState<ReligiousPlace | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPlaces = PLACES.filter(place => 
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedPlace) {
        return (
            <div className="space-y-6 animate-fadeIn pb-24 h-full">
                <button
                    onClick={() => setSelectedPlace(null)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95
                        ${theme === 'light' ? 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200' : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/5'}`}
                >
                    <ArrowLeft className="w-4 h-4" /> {t('common.back')}
                </button>

                <div className={`p-8 rounded-[2.5rem] border transition-all relative overflow-hidden
                    ${theme === 'light' ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/50 border-white/10 backdrop-blur-xl'}`}>
                    
                    {/* Decorative Header */}
                    <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

                    <div className="relative z-10 space-y-8">
                        <div>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4
                                ${theme === 'light' ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                <MapPin className="w-3 h-3" /> {selectedPlace.city}
                            </span>
                            <h2 className={`text-3xl font-serif font-bold leading-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                                {selectedPlace.name}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className={`p-6 rounded-3xl ${theme === 'light' ? 'bg-slate-50' : 'bg-white/[0.03]'}`}>
                                    <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2
                                        ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`}>
                                        <Info className="w-4 h-4" /> {t('places.about')}
                                    </h3>
                                    <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                                        {selectedPlace.description}
                                    </p>
                                </div>

                                <div className={`p-6 rounded-3xl ${theme === 'light' ? 'bg-slate-50' : 'bg-white/[0.03]'}`}>
                                    <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2
                                        ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`}>
                                        <Clock className="w-4 h-4" /> {t('places.history')}
                                    </h3>
                                    <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                                        {selectedPlace.historicalInfo}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className={`p-6 rounded-3xl border-2
                                    ${theme === 'light' ? 'bg-amber-50/30 border-amber-100' : 'bg-amber-500/5 border-amber-500/20'}`}>
                                    <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2
                                        ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`}>
                                        <BusFront className="w-4 h-4" /> {t('places.transport')}
                                    </h3>
                                    <p className={`text-sm leading-relaxed font-medium ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
                                        {selectedPlace.transportation}
                                    </p>
                                </div>

                                <div className={`p-6 rounded-3xl ${theme === 'light' ? 'bg-slate-50' : 'bg-white/[0.03]'}`}>
                                    <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2
                                        ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`}>
                                        <Star className="w-4 h-4" /> {t('places.visitingHours')}
                                    </h3>
                                    <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                                        {selectedPlace.visitingHours}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn pb-24 h-full">
            <div className="text-center mb-8">
                <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full mb-6
                    ${theme === 'light' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                    <Map className="w-5 h-5" />
                    <span className="font-bold text-sm">{t('places.title')}</span>
                </div>
                <h2 className={`text-3xl font-serif font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                    {t('places.subtitle')}
                </h2>
                <p className={`text-sm mt-3 px-4 max-w-md mx-auto leading-relaxed ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                    {t('places.description')}
                </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('places.searchPlaceholder')}
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-all text-sm
                        ${theme === 'light' 
                            ? 'bg-white border-slate-200 focus:border-emerald-400 shadow-sm' 
                            : 'bg-white/5 border-white/10 focus:border-emerald-500/50 text-white'}`}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredPlaces.map(place => (
                    <button
                        key={place.id}
                        onClick={() => setSelectedPlace(place)}
                        className={`text-left p-6 rounded-[2rem] border transition-all duration-300 group relative overflow-hidden
                            ${theme === 'light'
                                ? 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1'
                                : 'bg-white/[0.03] border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.05] hover:-translate-y-1'}`}
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-[4rem]" />
                        
                        <div className="relative z-10">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mb-3
                                ${theme === 'light' ? 'bg-slate-100 text-slate-500' : 'bg-white/5 text-slate-400'}`}>
                                <MapPin className="w-2.5 h-2.5" /> {place.city}
                            </span>
                            <h3 className={`font-serif font-bold text-lg mb-2 leading-tight
                                ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                                {place.name}
                            </h3>
                            <p className={`text-xs line-clamp-2 leading-relaxed opacity-70 mb-4
                                ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                                {place.description}
                            </p>
                            <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase
                                ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`}>
                                <Info className="w-3.5 h-3.5" /> {t('places.viewDetails')}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
            
            {filteredPlaces.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-slate-500 italic">{t('places.noResults')}</p>
                </div>
            )}
        </div>
    );
};

export default ReligiousPlacesView;
