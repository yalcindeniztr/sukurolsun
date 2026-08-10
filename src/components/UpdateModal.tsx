import React from 'react';
import { Download, Sparkles, ExternalLink, X } from 'lucide-react';
import { useTheme } from '../core/ThemeContext';
import { UpdateInfo, UpdateService } from '../services/UpdateService';

interface UpdateModalProps {
    updateInfo: UpdateInfo;
    onClose: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ updateInfo, onClose }) => {
    const { theme } = useTheme();

    const handleUpdateNow = () => {
        UpdateService.openPlayStore();
    };

    const handleLater = async () => {
        await UpdateService.dismissUpdateForDay();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
            <div className={`w-full max-w-sm rounded-3xl p-6 relative overflow-hidden card-3d-embossed hologram-shimmer shadow-2xl border
                ${theme === 'light'
                    ? 'bg-gradient-to-b from-white via-emerald-50/40 to-white border-emerald-200'
                    : 'bg-gradient-to-b from-slate-900 via-emerald-950/40 to-slate-900 border-emerald-500/30'}`}
            >
                {/* Decorative Sparkle Icon */}
                <div className="absolute -right-4 -top-4 opacity-15 pointer-events-none">
                    <Sparkles className="w-28 h-28 text-amber-500 animate-pulse" />
                </div>

                {!updateInfo.isForceUpdate && (
                    <button
                        onClick={handleLater}
                        className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                        title="Kapat"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}

                {/* Main Icon */}
                <div className="w-16 h-16 mx-auto rounded-2xl embossed-button flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 mb-4 animate-bounce">
                    <Download className="w-8 h-8" />
                </div>

                <div className="text-center space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-[10px] uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 fill-amber-500 text-amber-500" />
                        Yeni Sürüm Mevcut ({updateInfo.latestVersion})
                    </span>

                    <h3 className={`text-2xl font-serif font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                        Şükür Olsun Güncellendi!
                    </h3>

                    <p className={`text-xs font-medium leading-relaxed px-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                        {updateInfo.releaseNotes}
                    </p>

                    <div className="pt-2 flex items-center justify-center gap-2 text-[11px] font-bold text-slate-400">
                        <span>Mevcut: v{UpdateService.getCurrentVersion()}</span>
                        <span>→</span>
                        <span className="text-emerald-600 dark:text-emerald-400">Yeni: v{updateInfo.latestVersion}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-2.5">
                    <button
                        onClick={handleUpdateNow}
                        className="w-full py-3.5 px-4 rounded-2xl embossed-button text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                    >
                        <span>Play Store'da Güncelle</span>
                        <ExternalLink className="w-4 h-4" />
                    </button>

                    {!updateInfo.isForceUpdate && (
                        <button
                            onClick={handleLater}
                            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-center
                                ${theme === 'light' ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                        >
                            Daha Sonra Hatırlat
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateModal;
