import { useState, useEffect, useCallback } from 'react';
import MainLayout from './components/layout/MainLayout';
import VerseBanner from './features/journal/VerseBanner';
import JournalEntryForm from './features/journal/JournalEntryForm';
import JournalHistory from './features/journal/JournalHistory';
import ProfileView from './features/profile/ProfileView';
import DuaView from './features/dua/DuaView';
import ExtrasView from './features/extras/ExtrasView';
import PinLockScreen from './components/PinLockScreen';
import UserAgreement from './components/UserAgreement';
import Toast from './components/ui/Toast';
import { storageService } from './services/storage.service';
import { gamificationService } from './services/gamification.service';
import { AdMobService } from './services/AdMobService';
import { ReviewService } from './services/ReviewService';
import { UserProfile, JournalEntry } from './core/types';
import { DEFAULT_PROFILE } from './constants';

function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('home');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);

  // Uygulama başlangıcında veri yükleme ve PIN kontrolü
  useEffect(() => {
    const initApp = async () => {
      try {
        // Sözleşme kontrolü
        const hasAccepted = await storageService.hasAcceptedAgreement();
        if (!hasAccepted) {
          setShowAgreement(true);
          setIsLoading(false);
          return;
        }

        // PIN kontrolü
        const hasPin = await storageService.hasPin();
        if (hasPin) {
          setIsLocked(true);
        }

        // Verileri yükle
        const [loadedProfile, loadedEntries] = await Promise.all([
          storageService.getProfile(),
          storageService.getEntries(),
        ]);

        setProfile(loadedProfile || DEFAULT_PROFILE);
        setEntries(loadedEntries);

        // AdMob başlat
        AdMobService.initialize();

        // İlk kullanım tarihini kaydet (Review için)
        ReviewService.trackFirstOpen();
      } catch {
        // Hata durumunda varsayılan değerlerle başla
        setProfile(DEFAULT_PROFILE);
        setEntries([]);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  const handleSaveEntry = useCallback(async (entryData: Omit<JournalEntry, 'id' | 'timestamp'>) => {
    let updatedEntries: JournalEntry[];

    if (selectedEntry) {
      const updatedEntry = { ...selectedEntry, ...entryData };
      updatedEntries = await storageService.updateEntry(updatedEntry);
      setSelectedEntry(undefined);
      showToast('Günlük başarıyla güncellendi.', 'success');
    } else {
      const newEntry: JournalEntry = {
        ...entryData,
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        category: 'general',
        timestamp: new Date().toISOString(),
      };
      updatedEntries = await storageService.addEntry(newEntry);
      showToast('Şükür notun kaydedildi.', 'success');

      // Oyunlaştırma
      const currentStreak = gamificationService.calculateStreak(updatedEntries);
      const currentBadges = profile?.badges || [];
      const newBadges = gamificationService.checkNewBadges(currentStreak, currentBadges);

      if (profile) {
        const updatedProfile = {
          ...profile,
          streak: currentStreak,
          badges: [...currentBadges, ...newBadges]
        };
        setProfile(updatedProfile);
        await storageService.saveProfile(updatedProfile);

        if (newBadges.length > 0) {
          showToast(`Tebrikler! Yeni bir rozet kazandın! 🎉`, 'success');
        }
      }
    }

    setEntries(updatedEntries);

    if (!selectedEntry) {
      const shouldShowReview = await ReviewService.incrementAndCheck();
      if (shouldShowReview) {
        setTimeout(() => setShowReviewModal(true), 1500);
        await ReviewService.markPromptShown();
      }
    }
  }, [selectedEntry, profile, showToast]);

  const handleDeleteEntry = useCallback(async (id: string) => {
    if (confirm('Bu günlüğü silmek istediğinden emin misin?')) {
      const updatedEntries = await storageService.deleteEntry(id);
      setEntries(updatedEntries);
      if (selectedEntry?.id === id) {
        setSelectedEntry(undefined);
      }
      showToast('Kayıt silindi.', 'success');

      const currentStreak = gamificationService.calculateStreak(updatedEntries);
      if (profile) {
        const updatedProfile = { ...profile, streak: currentStreak };
        setProfile(updatedProfile);
        await storageService.saveProfile(updatedProfile);
      }
    }
  }, [selectedEntry, profile, showToast]);

  const handleToggleFavorite = useCallback(async (id: string) => {
    const updatedEntries = await storageService.toggleFavorite(id);
    setEntries(updatedEntries);
  }, []);

  const handleSelectEntry = useCallback((entry: JournalEntry) => {
    setSelectedEntry(entry);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setSelectedEntry(undefined);
  }, []);

  const handleUpdateProfile = useCallback(async (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    await storageService.saveProfile(updatedProfile);
    showToast('Profilin güncellendi!', 'success');
  }, [showToast]);

  const handlePinUnlock = useCallback(() => {
    setIsLocked(false);
  }, []);

  const handleAgreementAccept = useCallback(async () => {
    await storageService.acceptAgreement();
    setShowAgreement(false);
    setIsLoading(true);
    // Sözleşme kabul edildikten sonra uygulamayı başlat
    const [loadedProfile, loadedEntries] = await Promise.all([
      storageService.getProfile(),
      storageService.getEntries(),
    ]);
    setProfile(loadedProfile || DEFAULT_PROFILE);
    setEntries(loadedEntries);
    AdMobService.initialize();
    ReviewService.trackFirstOpen();
    setIsLoading(false);
  }, []);

  // Sözleşme ekranı
  if (showAgreement) {
    return <UserAgreement onAccept={handleAgreementAccept} />;
  }

  // PIN kilidi aktifse kilit ekranını göster
  if (isLocked) {
    return <PinLockScreen onUnlock={handlePinUnlock} />;
  }

  // Yükleme ekranı
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
      onTabChange={setActiveTab}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="space-y-6">
        {activeTab === 'home' && (
          <>
            <VerseBanner />
            <JournalEntryForm
              onSave={handleSaveEntry}
              selectedEntry={selectedEntry}
              onCancel={handleCancelEdit}
            />
            {entries.length > 0 && (
              <div className="mt-6">
                <JournalHistory
                  entries={entries.slice(0, 3)}
                  onDelete={handleDeleteEntry}
                  onEdit={handleSelectEntry}
                  onToggleFavorite={handleToggleFavorite}
                  showFilters={false}
                />
                {entries.length > 3 && (
                  <button
                    onClick={() => setActiveTab('history')}
                    className="w-full mt-4 py-3 text-sm text-slate-400 hover:text-emerald-400 transition-colors border border-white/10 rounded-xl hover:bg-white/5"
                  >
                    Tüm geçmişi gör ({entries.length}) →
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {activeTab === 'history' && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-serif text-white mb-6">Arşiv</h2>
            <JournalHistory
              entries={entries}
              onDelete={handleDeleteEntry}
              onEdit={handleSelectEntry}
              onToggleFavorite={handleToggleFavorite}
              showFilters={true}
            />
          </div>
        )}

        {activeTab === 'dua' && <DuaView />}
        {activeTab === 'extras' && <ExtrasView />}

        {activeTab === 'profile' && (
          <div className="animate-fadeIn">
            <ProfileView profile={profile} onUpdateProfile={handleUpdateProfile} />
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-emerald-100 rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Uygulamamızı Beğendiniz mi?</h3>
              <p className="text-slate-500 text-sm mb-6">
                Play Store'da bizi değerlendirerek destek olabilirsiniz.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Şimdi Değil
                </button>
                <button
                  onClick={() => {
                    ReviewService.openPlayStore();
                    setShowReviewModal(false);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold hover:shadow-lg hover:shadow-amber-500/20 transition-all"
                >
                  Değerlendir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default App;
