import React, { useEffect } from 'react';
import { useApp } from '../core/AppContext';
import MainLayout from '../components/layout/MainLayout';
import { useLanguage } from '../core/LanguageContext';
import { useTheme } from '../core/ThemeContext';
import JournalHistory from '../features/journal/JournalHistory';
import ProfileView from '../features/profile/ProfileView';
import DuaView from '../features/dua/DuaView';
import ExtrasView from '../features/extras/ExtrasView';
import PrayerTimesView from '../features/prayer_times/PrayerTimesView';
import TesbihatView from '../features/tesbihat/TesbihatView';
import SpiritualStopsView from '../features/spiritual_stops/SpiritualStopsView';
import SukurVaktiView from '../features/sukur_vakti/SukurVaktiView';
import BanaHatirlatView from '../features/bana_hatirlat/BanaHatirlatView';
import OrucZamaniView from '../features/oruc_zamani/OrucZamaniView';
import PinLockScreen from '../components/PinLockScreen';
import UserAgreement from '../components/UserAgreement';
import Toast from '../components/ui/Toast';
import { AdMobService } from '../services/AdMobService';
import { ReviewService } from '../services/ReviewService';
import { storageService } from '../services/storage.service';

const RootNavigator: React.FC = () => {
  const {
    profile, entries, combinedHistory, activeTab, 
    isLoading, isLocked, showAgreement, toast, showReviewModal,
    setActiveTab, setSelectedEntry, setToast, setShowReviewModal, setIsLocked,
    handleDeleteEntry, handleToggleFavorite, handleUpdateProfile, handleAgreementAccept
  } = useApp();
  const { t } = useLanguage();
  const { theme } = useTheme();

  // Sekme değişimlerinde AdMob banner kontrolü (Tüm sekmelerde gösterim için optimize edildi)
  useEffect(() => {
    if (!isLoading && !isLocked && !showAgreement) {
      // Artık tüm sekmelerde banner gösteriyoruz (Gelir maksimizasyonu)
      AdMobService.showBanner();
    }
  }, [activeTab, isLoading, isLocked, showAgreement]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    AdMobService.trackPageViewAndShowInterstitial();
  };

  const handleSelectEntry = (entry: any) => {
    setSelectedEntry(entry);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Sözleşme ekranı
  if (showAgreement) {
    return <UserAgreement onAccept={handleAgreementAccept} />;
  }

  // 2. PIN kilidi aktifse kilit ekranını göster
  if (isLocked) {
    return <PinLockScreen onUnlock={() => setIsLocked(false)} />;
  }

  // 3. Yükleme ekranı
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f0fdf4] flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="text-4xl mb-4">🤲</div>
          <p className="text-emerald-600 font-serif text-lg">Şükür Olsun</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      profile={profile}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="space-y-6">
        {activeTab === 'prayer_times' && <PrayerTimesView profile={profile} />}
        {activeTab === 'sukur_vakti' && <SukurVaktiView />}
        {activeTab === 'bana_hatirlat' && <BanaHatirlatView />}
        {activeTab === 'oruc_zamani' && <OrucZamaniView />}

        {activeTab === 'history' && (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-serif ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{t('tabs.archive')}</h2>
              <button
                onClick={async () => {
                  const result = await (storageService as any).createNativeBackup();
                  setToast({ message: result.message, type: result.success ? 'success' : 'error' });
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-bold hover:bg-emerald-500/20 transition-all active:scale-95"
              >
                <div className="p-1 bg-emerald-500 rounded-lg text-white">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                {t('common.oneClickBackup')}
              </button>
            </div>
            <JournalHistory
              entries={combinedHistory}
              onDelete={handleDeleteEntry}
              onEdit={handleSelectEntry}
              onToggleFavorite={handleToggleFavorite}
              showFilters={true}
            />
          </div>
        )}

        {activeTab === 'dua' && <DuaView />}
        {activeTab === 'extras' && <ExtrasView />}
        {activeTab === 'tesbihat' && <TesbihatView />}
        {activeTab === 'manevi_duraklar' && <SpiritualStopsView />}

        {activeTab === 'profile' && (
          <div className="animate-fadeIn">
            <ProfileView profile={profile} entries={entries} onUpdateProfile={handleUpdateProfile} />
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-emerald-100 rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{t('common.reviewModal.title')}</h3>
              <p className="text-slate-500 text-sm mb-6">
                {t('common.reviewModal.desc')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  {t('common.reviewModal.notNow')}
                </button>
                <button
                  onClick={() => {
                    ReviewService.openPlayStore();
                    setShowReviewModal(false);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold hover:shadow-lg hover:shadow-amber-500/20 transition-all"
                >
                  {t('common.reviewModal.rate')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default RootNavigator;
