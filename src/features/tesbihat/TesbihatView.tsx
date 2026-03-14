import React, { useState } from 'react';
import { RotateCcw, Activity, ChevronRight } from 'lucide-react';
import { useTheme } from '../../core/ThemeContext';
import { useLanguage } from '../../core/LanguageContext';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface Zikir {
    id: string;
    title: string;
    target: number;
    arabic?: string;
    meaning?: string;
}

const getCommonZikirs = (t: any): Zikir[] => [
    { id: '1', title: t('tesbihat.zikirs.subhanallah'), target: 33, arabic: 'سُبْحَانَ اللَّهِ', meaning: t('tesbihat.zikirs.subhanallahMeaning') },
    { id: '2', title: t('tesbihat.zikirs.elhamdulillah'), target: 33, arabic: 'الْحَمْدُ لِلَّهِ', meaning: t('tesbihat.zikirs.elhamdulillahMeaning') },
    { id: '3', title: t('tesbihat.zikirs.allahuekber'), target: 33, arabic: 'اللَّهُ أَكْبَرُ', meaning: t('tesbihat.zikirs.allahuekberMeaning') },
    { id: '4', title: t('tesbihat.zikirs.kelimeiTevhid'), target: 100, arabic: 'لَا إِلَهَ إِلَّا اللَّهُ', meaning: t('tesbihat.zikirs.kelimeiTevhidMeaning') },
    { id: '5', title: t('tesbihat.zikirs.estagfirullah'), target: 100, arabic: 'أَسْتَغْفِرُ اللَّهَ', meaning: t('tesbihat.zikirs.estagfirullahMeaning') },
    { id: '6', title: t('tesbihat.zikirs.salavat'), target: 100, arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', meaning: t('tesbihat.zikirs.salavatMeaning') }
];

const TesbihatView: React.FC = () => {
    const { t } = useLanguage();
    const COMMON_ZIKIRS = getCommonZikirs(t);
    const { theme } = useTheme();
    const [count, setCount] = useState(0);
    const [selectedZikir, setSelectedZikir] = useState<Zikir | null>(null);
    const [showZikirList, setShowZikirList] = useState(false);

    // Ses ve Titreşim ayarları
    const [vibrationEnabled, setVibrationEnabled] = useState(true);

    const handleTap = async () => {
        const newCount = count + 1;
        setCount(newCount);

        if (vibrationEnabled) {
            try {
                // Hedefe ulaşıldığında daha güçlü titreşim
                if (selectedZikir && newCount === selectedZikir.target) {
                    await Haptics.impact({ style: ImpactStyle.Heavy });
                    setTimeout(() => Haptics.impact({ style: ImpactStyle.Heavy }), 200);
                } else {
                    await Haptics.impact({ style: ImpactStyle.Light });
                }
            } catch (e) {
                // Haptics not supported
            }
        }
    };

    const resetCount = async () => {
        setCount(0);
        if (vibrationEnabled) {
            try {
                await Haptics.impact({ style: ImpactStyle.Medium });
            } catch (e) { }
        }
    };

    const selectZikir = (zikir: Zikir) => {
        setSelectedZikir(zikir);
        setCount(0);
        setShowZikirList(false);
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-24 h-full flex flex-col">
            {/* Başlık ve Hedef Bilgisi */}
            <div className="text-center pt-4">
                <button
                    onClick={() => setShowZikirList(true)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl mb-2 transition-all active:scale-95
                        ${theme === 'light'
                            ? 'bg-white border border-teal-200 text-teal-700 shadow-sm hover:bg-teal-50'
                            : 'bg-teal-500/10 border border-teal-500/20 text-teal-400 hover:bg-teal-500/20'}`}
                >
                    <span className="font-bold">{selectedZikir ? selectedZikir.title : t('tesbihat.freeZikir')}</span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                </button>

                {selectedZikir && (
                    <div className="animate-fadeIn mt-2">
                        {selectedZikir.arabic && (
                            <p className={`text-2xl font-arabic mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                                {selectedZikir.arabic}
                            </p>
                        )}
                        {selectedZikir.meaning && (
                            <p className={`text-xs px-6 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                                {selectedZikir.meaning}
                            </p>
                        )}
                        <p className={`text-sm font-bold mt-3 
                            ${count >= selectedZikir.target ? 'text-green-500' : (theme === 'light' ? 'text-slate-400' : 'text-slate-500')}`}>
                            {t('tesbihat.target')}: {selectedZikir.target} {count >= selectedZikir.target && `(${t('tesbihat.completed')})`}
                        </p>
                    </div>
                )}
            </div>

            {/* Zikirmatik Düğmesi / Sayacı */}
            <div className="flex-1 flex flex-col items-center justify-center -mt-10">

                {/* Dijital Ekran Kısmı */}
                <div className={`mb-8 px-10 py-6 rounded-3xl border-b-4 border-r-4 shadow-inner transition-all
                    ${theme === 'light'
                        ? 'bg-slate-100/80 border-slate-300'
                        : 'bg-black/40 border-black/60'}
                `}>
                    <span className="font-mono text-7xl font-black tracking-widest text-[#2c3e50] dark:text-[#7f8c8d]" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}>
                        {count.toString().padStart(4, '0')}
                    </span>
                </div>

                {/* Büyük Dokunmatik Alan */}
                <button
                    onClick={handleTap}
                    className={`relative w-64 h-64 rounded-full flex items-center justify-center transition-transform active:scale-95
                        ${theme === 'light'
                            ? 'bg-gradient-to-br from-teal-400 to-emerald-600 shadow-[0_20px_50px_-12px_rgba(20,184,166,0.5)] border-4 border-white'
                            : 'bg-gradient-to-br from-teal-600 to-emerald-800 shadow-[0_20px_50px_-12px_rgba(20,184,166,0.3)] border-4 border-slate-800'}
                    `}
                    style={{
                        WebkitTapHighlightColor: 'transparent',
                        boxShadow: `inset 0 10px 20px rgba(255,255,255,0.2), 0 20px 40px rgba(0,0,0,0.2)`
                    }}
                >
                    <div className="absolute inset-2 rounded-full border border-white/20"></div>
                    <div className="absolute inset-4 rounded-full border border-white/10"></div>
                    <span className="text-white/80 font-black tracking-widest text-2xl uppercase">{t('tesbihat.tap')}</span>
                </button>

                {/* Alt Kontroller */}
                <div className="flex items-center gap-6 mt-12">
                    <button
                        onClick={resetCount}
                        className={`p-4 rounded-full transition-all active:scale-90
                            ${theme === 'light' ? 'bg-white text-slate-400 shadow-md hover:text-red-500' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-red-400'}`}
                    >
                        <RotateCcw className="w-6 h-6" />
                    </button>

                    <button
                        onClick={() => setVibrationEnabled(!vibrationEnabled)}
                        className={`p-4 rounded-full transition-all active:scale-90
                            ${vibrationEnabled
                                ? (theme === 'light' ? 'bg-white text-emerald-500 shadow-md' : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400')
                                : (theme === 'light' ? 'bg-slate-100 text-slate-400 shadow-inner' : 'bg-black/20 border border-white/5 text-slate-600')}`}
                    >
                        <Activity className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Zikir Seçim Modalı */}
            {showZikirList && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn p-4">
                    <div className={`w-full max-w-sm rounded-[2rem] overflow-hidden flex flex-col max-h-[80vh]
                        ${theme === 'light' ? 'bg-white' : 'bg-slate-900 border border-white/10'}`}>

                        <div className="p-6 pb-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                            <h3 className={`font-bold text-lg ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                                {t('tesbihat.selectZikir')}
                            </h3>
                            <button
                                onClick={() => setShowZikirList(false)}
                                className={`text-sm font-bold px-3 py-1.5 rounded-full ${theme === 'light' ? 'bg-slate-100 text-slate-500' : 'bg-white/10 text-slate-300'}`}
                            >
                                {t('tesbihat.close')}
                            </button>
                        </div>

                        <div className="overflow-y-auto p-4 space-y-2">
                            <button
                                onClick={() => selectZikir(null as any)}
                                className={`w-full p-4 rounded-2xl text-left font-bold transition-all
                                    ${!selectedZikir
                                        ? 'bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400'
                                        : 'bg-slate-50 text-slate-600 dark:bg-white/5 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                            >
                                {t('tesbihat.freeZikirLimitless')}
                            </button>

                            {COMMON_ZIKIRS.map(zikir => (
                                <button
                                    key={zikir.id}
                                    onClick={() => selectZikir(zikir)}
                                    className={`w-full p-4 rounded-2xl text-left transition-all
                                        ${selectedZikir?.id === zikir.id
                                            ? 'bg-teal-50 border-teal-200 dark:bg-teal-500/20 dark:border-teal-500/30 border'
                                            : 'bg-white border-slate-100 dark:bg-transparent dark:border-white/10 border hover:border-teal-300 dark:hover:border-teal-600'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`font-bold ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
                                            {zikir.title}
                                        </span>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${theme === 'light' ? 'bg-slate-100 text-slate-500' : 'bg-white/10 text-slate-400'}`}>
                                            {zikir.target}
                                        </span>
                                    </div>
                                    <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {zikir.meaning}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TesbihatView;
