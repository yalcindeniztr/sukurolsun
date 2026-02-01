import { JournalEntry, UserProfile, AppSettings, CustomPrayer } from '../core/types';

const STORAGE_KEYS = {
  ENTRIES: 'sukur_entries',
  PROFILE: 'sukur_profile',
  SETTINGS: 'sukur_settings',
  CUSTOM_PRAYERS: 'sukur_custom_prayers',
};

class StorageService {
  // Entries Management
  getEntries(): JournalEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ENTRIES);
      if (!data) return [];
      const parsed = JSON.parse(data);
      // Sort by date descending by default
      return Array.isArray(parsed)
        ? parsed.sort((a: JournalEntry, b: JournalEntry) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        : [];
    } catch (error) {
      console.error('Failed to load entries:', error);
      return [];
    }
  }

  saveEntries(entries: JournalEntry[]): boolean {
    try {
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
      return true;
    } catch (error) {
      console.error('Failed to save entries:', error);
      return false;
    }
  }

  addEntry(entry: JournalEntry): JournalEntry[] {
    const current = this.getEntries();
    const updated = [entry, ...current];
    this.saveEntries(updated);
    return updated;
  }

  updateEntry(updatedEntry: JournalEntry): JournalEntry[] {
    const current = this.getEntries();
    const updated = current.map(e => e.id === updatedEntry.id ? updatedEntry : e);
    this.saveEntries(updated);
    return updated;
  }

  deleteEntry(id: string): JournalEntry[] {
    const current = this.getEntries();
    const updated = current.filter(e => e.id !== id);
    this.saveEntries(updated);
    return updated;
  }

  // Profile Management
  getProfile(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load profile:', error);
      return null;
    }
  }

  saveProfile(profile: UserProfile): boolean {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      return true;
    } catch (error) {
      console.error('Failed to save profile:', error);
      return false;
    }
  }

  // Settings Management
  getSettings(): AppSettings {
    const defaultSettings: AppSettings = {
      language: 'tr',
      dailyReminderTime: null,
      enableNotifications: false,
    };

    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return defaultSettings;
      return { ...defaultSettings, ...JSON.parse(data) };
    } catch (error) {
      return defaultSettings;
    }
  }

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  // Custom Prayers Management
  getCustomPrayers(): CustomPrayer[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_PRAYERS);
      if (!data) return [];
      return JSON.parse(data).sort((a: CustomPrayer, b: CustomPrayer) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error('Failed to load custom prayers:', error);
      return [];
    }
  }

  saveCustomPrayers(prayers: CustomPrayer[]): boolean {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_PRAYERS, JSON.stringify(prayers));
      return true;
    } catch (error) {
      console.error('Failed to save custom prayers:', error);
      return false;
    }
  }

  addCustomPrayer(text: string): CustomPrayer[] {
    const newPrayer: CustomPrayer = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      text,
      timestamp: new Date().toISOString()
    };
    const current = this.getCustomPrayers();
    const updated = [newPrayer, ...current];
    this.saveCustomPrayers(updated);
    return updated;
  }

  deleteCustomPrayer(id: string): CustomPrayer[] {
    const current = this.getCustomPrayers();
    const updated = current.filter(p => p.id !== id);
    this.saveCustomPrayers(updated);
    return updated;
  }
}

export const storageService = new StorageService();
