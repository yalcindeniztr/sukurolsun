import React, { useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { Megaphone, X } from 'lucide-react';
import { AdMobService } from '../services/AdMobService';

const HIDE_KEY = 'sukur_ad_intro_widget_hidden';

const AdIntroWidget: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadPreference = async () => {
      const { value } = await Preferences.get({ key: HIDE_KEY });
      if (mounted && value !== 'true') {
        setIsVisible(true);
        AdMobService.prepareInterstitial();
      }
    };

    loadPreference();

    return () => {
      mounted = false;
    };
  }, []);

  const closeWidget = async () => {
    if (dontShowAgain) {
      await Preferences.set({ key: HIDE_KEY, value: 'true' });
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-md animate-fadeIn">
      <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-2xl shadow-emerald-900/15">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Megaphone className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Reklam bilgilendirmesi</h3>
                <p className="mt-1 text-sm leading-5 text-slate-600">
                  Uygulama ücretsiz kalabilsin diye banner reklamlar gösterilir. Kayıt sonrası geçiş reklamları en az 2 dakika arayla çıkar.
                </p>
              </div>
              <button
                type="button"
                onClick={closeWidget}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Kapat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-600">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(event) => setDontShowAgain(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
              />
              Açılışta gösterme
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdIntroWidget;
