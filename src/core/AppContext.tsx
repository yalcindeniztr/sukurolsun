import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { storageService } from '../services/storage.service';
import { gamificationService } from '../services/gamification.service';
import { AdMobService } from '../services/AdMobService';
import { ReviewService } from '../services/ReviewService';
import { notificationService } from '../services/NotificationService';
import { UserProfile, JournalEntry, CustomPrayer, UserMessage, MoodType, PromptType } from './types';
import { DEFAULT_PROFILE } from '../constants';
import { ANNUAL_DUAS } from './duas_data';
import { Preferences } from '@capacitor/preferences';

interface AppContextType {
  profile: UserProfile | null;
  entries: JournalEntry[];
  customPrayers: CustomPrayer[];
  userMessages: UserMessage[];
  combinedHistory: JournalEntry[];
  selectedEntry: JournalEntry | undefined;
  activeTab: string;
  isLoading: boolean;
  isLocked: boolean;
  showAgreement: boolean;
  toast: { message: string; type: 'success' | 'error' } | null;
  showReviewModal: boolean;
  
  setProfile: (profile: UserProfile) => void;
  setActiveTab: (tab: string) => void;
  setSelectedEntry: (entry: JournalEntry | undefined) => void;
  setToast: (toast: { message: string; type: 'success' | 'error' } | null) => void;
  setShowReviewModal: (show: boolean) => void;
  setIsLocked: (locked: boolean) => void;
  setShowAgreement: (show: boolean) => void;
  
  handleSaveEntry: (entryData: Omit<JournalEntry, 'id' | 'timestamp'>) => Promise<void>;
  handleDeleteEntry: (id: string) => Promise<void>;
  handleToggleFavorite: (id: string) => Promise<void>;
  handleUpdateProfile: (updatedProfile: UserProfile) => Promise<void>;
  handleAgreementAccept: () => Promise<void>;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [customPrayers, setCustomPrayers] = useState<CustomPrayer[]>([]);
  const [userMessages, setUserMessages] = useState<UserMessage[]>([]);
  const [duaFavorites, setDuaFavorites] = useState<number[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('prayer_times');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    const initApp = async () => {
      try {
        const hasAccepted = await storageService.hasAcceptedAgreement();
        if (!hasAccepted) {
          setShowAgreement(true);
          setIsLoading(false);
          return;
        }

        const hasPin = await storageService.hasPin();
        if (hasPin) setIsLocked(true);

        const [loadedProfile, loadedEntries, loadedPrayers, loadedMessages] = await Promise.all([
          storageService.getProfile(),
          storageService.getEntries(),
          storageService.getCustomPrayers(),
          storageService.getUserMessages(),
        ]);
        
        let loadedDuaFavorites: number[] = [];
        try {
          const { value } = await Preferences.get({ key: 'sukurolsun_dua_favorites' });
          if (value) loadedDuaFavorites = JSON.parse(value);
        } catch {
          const saved = localStorage.getItem('sukurolsun_dua_favorites');
          if (saved) {
            try { loadedDuaFavorites = JSON.parse(saved); } catch { /* */ }
          }
        }

        setProfile(loadedProfile || DEFAULT_PROFILE);
        setEntries(loadedEntries);
        setCustomPrayers(loadedPrayers);
        setUserMessages(loadedMessages);
        setDuaFavorites(loadedDuaFavorites);

        await AdMobService.initialize();
        await notificationService.init();
        ReviewService.trackFirstOpen();
      } catch (error) {
        console.error("App init error:", error);
        setProfile(DEFAULT_PROFILE);
      } finally {
        setIsLoading(false);
      }
    };
    initApp();
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

      const currentStreak = gamificationService.calculateStreak(updatedEntries);
      if (profile) {
        const newBadges = gamificationService.checkNewBadges(currentStreak, profile.badges || []);
        const updatedProfile = {
          ...profile,
          streak: currentStreak,
          badges: [...(profile.badges || []), ...newBadges]
        };
        setProfile(updatedProfile);
        await storageService.saveProfile(updatedProfile);
        if (newBadges.length > 0) showToast(`Tebrikler! Yeni bir rozet kazandın! 🎉`, 'success');
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
    AdMobService.trackSaveAndShowInterstitial();
  }, [selectedEntry, profile, showToast]);

  const handleDeleteEntry = useCallback(async (id: string) => {
    if (confirm('Bu kaydı silmek istediğinden emin misin?')) {
      if (customPrayers.some(p => p.id === id)) {
        const up = await storageService.deleteCustomPrayer(id);
        setCustomPrayers(up);
        showToast('Dua silindi.', 'success');
      } else if (userMessages.some(m => m.id === id)) {
        const um = await storageService.deleteUserMessage(id);
        setUserMessages(um);
        showToast('Mesaj silindi.', 'success');
      } else {
        const updatedEntries = await storageService.deleteEntry(id);
        setEntries(updatedEntries);
        if (selectedEntry?.id === id) setSelectedEntry(undefined);
        showToast('Kayıt silindi.', 'success');
        if (profile) {
          const currentStreak = gamificationService.calculateStreak(updatedEntries);
          const updatedProfile = { ...profile, streak: currentStreak };
          setProfile(updatedProfile);
          await storageService.saveProfile(updatedProfile);
        }
      }
    }
  }, [selectedEntry, profile, showToast, customPrayers, userMessages]);

  const handleToggleFavorite = useCallback(async (id: string) => {
    if (!customPrayers.some(p => p.id === id) && !userMessages.some(m => m.id === id)) {
      const updatedEntries = await storageService.toggleFavorite(id);
      setEntries(updatedEntries);
    }
  }, [customPrayers, userMessages]);

  const handleUpdateProfile = useCallback(async (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    await storageService.saveProfile(updatedProfile);
    showToast('Profilin güncellendi!', 'success');
  }, [showToast]);

  const handleAgreementAccept = useCallback(async () => {
    await storageService.acceptAgreement();
    setShowAgreement(false);
    setIsLoading(true);
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

  const combinedHistory = useMemo(() => {
    const prayersAsEntries: JournalEntry[] = customPrayers.map(p => ({
      id: p.id,
      title: 'Özel Dua',
      content: p.text,
      mood: 'peaceful',
      promptType: 'allah_action',
      category: 'dua',
      timestamp: p.timestamp,
    }));
    const messagesAsEntries: JournalEntry[] = userMessages.map(m => ({
      id: m.id,
      title: m.category || 'Mesaj',
      content: m.text,
      mood: 'grateful',
      promptType: 'gratitude',
      category: 'mesaj',
      timestamp: m.timestamp,
    }));
    
    // Dua favorilerini JournalEntry formatına dönüştür
    const duaFavoritesAsEntries: JournalEntry[] = duaFavorites.map((duaIndex) => {
      const dua = ANNUAL_DUAS[duaIndex];
      if (!dua) return null;
      return {
        id: `dua_fav_${duaIndex}`,
        title: dua.sourceTr || 'Dua',
        content: dua.textTr + '\n\n' + dua.textEn,
        mood: 'peaceful' as MoodType,
        promptType: 'allah_action' as PromptType,
        category: 'dua_favori',
        timestamp: new Date().toISOString(),
        isFavorite: true,
      } as JournalEntry;
    }).filter((entry): entry is JournalEntry => entry !== null);
    
    return [...entries, ...prayersAsEntries, ...messagesAsEntries, ...duaFavoritesAsEntries].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [entries, customPrayers, userMessages, duaFavorites]);

  return (
    <AppContext.Provider value={{
      profile, entries, customPrayers, userMessages, combinedHistory, selectedEntry, 
      activeTab, isLoading, isLocked, showAgreement, toast, showReviewModal,
      setProfile, setActiveTab, setSelectedEntry, setToast, setShowReviewModal, setIsLocked, setShowAgreement,
      handleSaveEntry, handleDeleteEntry, handleToggleFavorite, handleUpdateProfile, handleAgreementAccept, showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
};
