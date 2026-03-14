import React, { useState, useRef } from 'react';
import { ShieldCheck, ChevronDown } from 'lucide-react';
import { useLanguage } from '../core/LanguageContext';

interface UserAgreementProps {
    onAccept: () => void;
}

const UserAgreement: React.FC<UserAgreementProps> = ({ onAccept }) => {
    const { t } = useLanguage();
    const [accepted, setAccepted] = useState(false);
    const [scrolledToBottom, setScrolledToBottom] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 20) {
            setScrolledToBottom(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#f0fdf4] flex flex-col items-center justify-center p-6 select-none">
            {/* Dekoratif Arka Plan */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 right-10 w-72 h-72 rounded-full blur-[120px] bg-emerald-300/20" />
                <div className="absolute bottom-40 left-10 w-56 h-56 rounded-full blur-[100px] bg-amber-300/10" />
            </div>

            <div className="relative z-10 w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex p-4 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                        <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-slate-800">{t('common.appName')}</h1>
                    <p className="text-sm text-slate-500 mt-1">{t('agreement.subtitle')}</p>
                </div>

                {/* Sözleşme Metni */}
                <div className="bg-white rounded-3xl border border-emerald-100 shadow-lg overflow-hidden">
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="h-80 overflow-y-auto p-6 text-sm text-slate-600 leading-relaxed space-y-4"
                    >
                        <h2 className="text-lg font-bold text-slate-800 uppercase">{t('agreement.policyTitle')}</h2>
                        <p className="text-xs text-slate-400">{t('agreement.lastUpdate')}</p>

                        <h3 className="font-bold text-slate-700 mt-4">{t('agreement.sections.genel')}</h3>
                        <p>{t('agreement.sections.genelText')}</p>

                        <h3 className="font-bold text-slate-700">{t('agreement.sections.veri')}</h3>
                        <p>{t('agreement.sections.veriText1')}</p>
                        <p>{t('agreement.sections.veriText2')}</p>
                        <p>{t('agreement.sections.veriText3')}</p>

                        <h3 className="font-bold text-slate-700">{t('agreement.sections.reklam')}</h3>
                        <p>{t('agreement.sections.reklamText')}</p>

                        <h3 className="font-bold text-slate-700">{t('agreement.sections.sorumluluk')}</h3>
                        <p>{t('agreement.sections.sorumlulukText')}</p>

                        <h3 className="font-bold text-slate-700">{t('agreement.sections.iletisim')}</h3>
                        <p>{t('agreement.sections.iletisimText')}</p>

                        <div className="h-4" />
                    </div>

                    {/* Scroll indicator */}
                    {!scrolledToBottom && (
                        <div className="flex justify-center py-2 bg-gradient-to-t from-white via-white/90 to-transparent -mt-8 relative z-10">
                            <ChevronDown className="w-5 h-5 text-slate-400 animate-bounce" />
                        </div>
                    )}
                </div>

                {/* Checkbox + Buton */}
                <div className="mt-6 space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:bg-emerald-50/50 group">
                        <input
                            type="checkbox"
                            checked={accepted}
                            onChange={(e) => setAccepted(e.target.checked)}
                            className="mt-1 w-6 h-6 rounded border-2 border-emerald-300 text-emerald-600 focus:ring-emerald-400 accent-emerald-500 shrink-0 cursor-pointer"
                        />
                        <span className="text-[13px] text-slate-600 leading-normal" dangerouslySetInnerHTML={{ __html: t('agreement.checkboxText') }}>
                        </span>
                    </label>

                    <button
                        onClick={onAccept}
                        disabled={!accepted}
                        className={`w-full py-4 rounded-2xl text-center font-bold text-lg transition-all duration-300
              ${accepted
                                ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 active:scale-[0.98]'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {t('agreement.continue')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserAgreement;
