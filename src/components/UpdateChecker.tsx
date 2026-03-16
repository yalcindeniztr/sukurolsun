import React, { useState, useEffect } from 'react';
import { DownloadCloud, X } from 'lucide-react';
import { useTheme } from '../core/ThemeContext';
import { ReviewService } from '../services/ReviewService';

// Mevcut versiyon
const CURRENT_VERSION = '1.7.0';
// En güncel versiyon bilgisi
const LATEST_VERSION = '1.7.0';

const UpdateChecker: React.FC = () => {
    const { theme } = useTheme();
    const [showUpdate, setShowUpdate] = useState(false);

    useEffect(() => {
        // Gerçek senaryoda burada fetch() ile bir sunucudan son versiyon kontrol edilir.
        // Örnek: const response = await fetch('https://api.yoursite.com/version');
        // const data = await response.json();

        const isUpdateAvailable = LATEST_VERSION.localeCompare(CURRENT_VERSION, undefined, { numeric: true, sensitivity: 'base' }) > 0;

        if (isUpdateAvailable) {
            setShowUpdate(true);
        }

        // Otomatik kontrolü başlat (örneğin sadece production'da)
    }, []);

    if (!showUpdate) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className={`w-full max-w-sm rounded-3xl p-6 relative overflow-hidden
                ${theme === 'light' ? 'bg-white shadow-2xl' : 'bg-slate-900 border border-white/10 shadow-2xl'}
            `}>
                <button
                    onClick={() => setShowUpdate(false)}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-colors 
                        ${theme === 'light' ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}
                >
                    <X className="w-5 h-5" />
                </button>

                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 
                    ${theme === 'light' ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    <DownloadCloud className="w-8 h-8" />
                </div>

                <h3 className={`text-xl font-bold text-center mb-2 
                    ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                    Yeni Güncelleme Mevcut!
                </h3>

                <p className={`text-center text-sm mb-6
                    ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    Şükür Olsun uygulamasının yeni özellikleri, hata düzeltmeleri ve performans iyileştirmelerini içeren {LATEST_VERSION} sürümü yayınlandı.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => {
                            setShowUpdate(false);
                            ReviewService.openPlayStore(); // Uygulamayı güncellemek için markete yönlendir
                        }}
                        className={`w-full py-3.5 rounded-2xl font-bold transition-all active:scale-95
                            ${theme === 'light'
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
                    >
                        Hemen Güncelle
                    </button>
                    <button
                        onClick={() => setShowUpdate(false)}
                        className={`w-full py-3.5 rounded-2xl font-bold transition-all
                            ${theme === 'light'
                                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                        Daha Sonra Hatırlat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateChecker;
