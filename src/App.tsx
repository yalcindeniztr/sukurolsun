import { useState, useEffect } from 'react';
import MainLayout from './components/layout/MainLayout';
import VerseBanner from './features/journal/VerseBanner';
import JournalEntryForm from './features/journal/JournalEntryForm';
import JournalHistory from './features/journal/JournalHistory';
import ProfileView from './features/profile/ProfileView';
import DuaView from './features/dua/DuaView';
import Toast from './components/ui/Toast';
import { storageService } from './services/storage.service';
import { gamificationService } from './services/gamification.service';
import { AdMobService } from './services/AdMobService';
import { UserProfile, JournalEntry } from './core/types';
import { DEFAULT_PROFILE } from './constants';

function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('home');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const loadedProfile = storageService.getProfile();
    const loadedEntries = storageService.getEntries();

    setProfile(loadedProfile || DEFAULT_PROFILE);
    setEntries(loadedEntries);

    AdMobService.initialize();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleSaveEntry = (entryData: Omit<JournalEntry, 'id' | 'timestamp'>) => {
    let updatedEntries;

    if (selectedEntry) {
      // Güncelleme
      const updatedEntry = { ...selectedEntry, ...entryData };
      updatedEntries = storageService.updateEntry(updatedEntry);
      setSelectedEntry(undefined);
      showToast('Günlük başarıyla güncellendi.', 'success');
    } else {
      // Yeni Kayıt
      const newEntry: JournalEntry = {
        ...entryData,
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        category: 'general',
        timestamp: new Date().toISOString(),
      };
      updatedEntries = storageService.addEntry(newEntry);
      showToast('Şükür notun kaydedildi.', 'success');

      // Oyunlaştırma Mantığı
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
        storageService.saveProfile(updatedProfile);

        if (newBadges.length > 0) {
          showToast(`Tebrikler! Yeni bir rozet kazandın! 🎉`, 'success');
        }
      }
    }

    setEntries(updatedEntries);
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Bu günlüğü silmek istediğinden emin misin?')) {
      const updatedEntries = storageService.deleteEntry(id);
      setEntries(updatedEntries);
      if (selectedEntry?.id === id) {
        setSelectedEntry(undefined);
      }
      showToast('Kayıt silindi.', 'success');

      // Seri yeniden hesaplama
      const currentStreak = gamificationService.calculateStreak(updatedEntries);
      if (profile) {
        const updatedProfile = { ...profile, streak: currentStreak };
        setProfile(updatedProfile);
        storageService.saveProfile(updatedProfile);
      }
    }
  };

  const handleSelectEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setSelectedEntry(undefined);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    storageService.saveProfile(updatedProfile);
    showToast('Profilin güncellendi!', 'success');
  };

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
        {/* YAZ (Ana Sayfa) */}
        {activeTab === 'home' && (
          <>
            <VerseBanner />
            <JournalEntryForm
              onSave={handleSaveEntry}
              selectedEntry={selectedEntry}
              onCancel={handleCancelEdit}
            />
            {/* Son 3 Giriş */}
            {entries.length > 0 && (
              <div className="mt-6">
                <JournalHistory
                  entries={entries.slice(0, 3)}
                  onDelete={handleDeleteEntry}
                  onEdit={handleSelectEntry}
                  showFilters={false}
                />
                {entries.length > 3 && (
                  <button
                    onClick={() => setActiveTab('history')}
                    className="w-full mt-4 py-3 text-sm text-slate-400 hover:text-teal-400 transition-colors border border-white/10 rounded-xl hover:bg-white/5"
                  >
                    Tüm geçmişi gör ({entries.length}) →
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* ARŞİV */}
        {activeTab === 'history' && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-serif text-white mb-6">Arşiv</h2>
            <JournalHistory
              entries={entries}
              onDelete={handleDeleteEntry}
              onEdit={handleSelectEntry}
              showFilters={true}
            />
          </div>
        )}

        {/* DUA */}
        {activeTab === 'dua' && (
          <DuaView />
        )}

        {/* PROFİL */}
        {activeTab === 'profile' && (
          <div className="animate-fadeIn">
            <ProfileView profile={profile} onUpdateProfile={handleUpdateProfile} />
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default App;
