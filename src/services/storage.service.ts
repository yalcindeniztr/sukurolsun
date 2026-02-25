import { JournalEntry, UserProfile, AppSettings, CustomPrayer, UserMessage } from '../core/types';
import { Preferences } from '@capacitor/preferences';

const STORAGE_KEYS = {
  ENTRIES: 'sukur_entries',
  PROFILE: 'sukur_profile',
  SETTINGS: 'sukur_settings',
  CUSTOM_PRAYERS: 'sukur_custom_prayers',
  PIN_HASH: 'sukur_pin_hash',
  AGREEMENT_ACCEPTED: 'sukur_agreement_accepted',
  USER_MESSAGES: 'sukur_user_messages',
};

/** Basit XSS temizleme fonksiyonu */
const sanitizeString = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/** SHA-256 hash fonksiyonu (PIN için) */
const hashPin = async (pin: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + 'sukurolsun_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/** Capacitor Preferences wrapper - native kalıcı depolama */
const storage = {
  async get(key: string): Promise<string | null> {
    try {
      const { value } = await Preferences.get({ key });
      return value;
    } catch {
      // Web fallback
      return localStorage.getItem(key);
    }
  },
  async set(key: string, value: string): Promise<void> {
    try {
      await Preferences.set({ key, value });
    } catch {
      // Web fallback
      localStorage.setItem(key, value);
    }
  },
  async remove(key: string): Promise<void> {
    try {
      await Preferences.remove({ key });
    } catch {
      localStorage.removeItem(key);
    }
  }
};

class StorageService {
  // ===== Entries =====
  async getEntries(): Promise<JournalEntry[]> {
    try {
      const data = await storage.get(STORAGE_KEYS.ENTRIES);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed)
        ? parsed.sort((a: JournalEntry, b: JournalEntry) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        : [];
    } catch {
      return [];
    }
  }

  async saveEntries(entries: JournalEntry[]): Promise<boolean> {
    try {
      await storage.set(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
      return true;
    } catch {
      return false;
    }
  }

  async addEntry(entry: JournalEntry): Promise<JournalEntry[]> {
    const safeEntry: JournalEntry = {
      ...entry,
      title: sanitizeString(entry.title),
      content: sanitizeString(entry.content),
    };
    const current = await this.getEntries();
    const updated = [safeEntry, ...current];
    await this.saveEntries(updated);
    return updated;
  }

  async updateEntry(updatedEntry: JournalEntry): Promise<JournalEntry[]> {
    const safeEntry: JournalEntry = {
      ...updatedEntry,
      title: sanitizeString(updatedEntry.title),
      content: sanitizeString(updatedEntry.content),
    };
    const current = await this.getEntries();
    const updated = current.map(e => e.id === safeEntry.id ? safeEntry : e);
    await this.saveEntries(updated);
    return updated;
  }

  async deleteEntry(id: string): Promise<JournalEntry[]> {
    const current = await this.getEntries();
    const updated = current.filter(e => e.id !== id);
    await this.saveEntries(updated);
    return updated;
  }

  async toggleFavorite(id: string): Promise<JournalEntry[]> {
    const current = await this.getEntries();
    const updated = current.map(e =>
      e.id === id ? { ...e, isFavorite: !e.isFavorite } : e
    );
    await this.saveEntries(updated);
    return updated;
  }

  // ===== Profile =====
  async getProfile(): Promise<UserProfile | null> {
    try {
      const data = await storage.get(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  async saveProfile(profile: UserProfile): Promise<boolean> {
    try {
      await storage.set(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      return true;
    } catch {
      return false;
    }
  }

  // ===== Settings =====
  async getSettings(): Promise<AppSettings> {
    const defaultSettings: AppSettings = {
      language: 'tr',
      dailyReminderTime: null,
      enableNotifications: false,
    };
    try {
      const data = await storage.get(STORAGE_KEYS.SETTINGS);
      if (!data) return defaultSettings;
      return { ...defaultSettings, ...JSON.parse(data) };
    } catch {
      return defaultSettings;
    }
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await storage.set(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // Sessiz hata
    }
  }

  // ===== Custom Prayers =====
  async getCustomPrayers(): Promise<CustomPrayer[]> {
    try {
      const data = await storage.get(STORAGE_KEYS.CUSTOM_PRAYERS);
      if (!data) return [];
      return JSON.parse(data).sort((a: CustomPrayer, b: CustomPrayer) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch {
      return [];
    }
  }

  async saveCustomPrayers(prayers: CustomPrayer[]): Promise<boolean> {
    try {
      await storage.set(STORAGE_KEYS.CUSTOM_PRAYERS, JSON.stringify(prayers));
      return true;
    } catch {
      return false;
    }
  }

  async addCustomPrayer(text: string): Promise<CustomPrayer[]> {
    const newPrayer: CustomPrayer = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      text: sanitizeString(text),
      timestamp: new Date().toISOString()
    };
    const current = await this.getCustomPrayers();
    const updated = [newPrayer, ...current];
    await this.saveCustomPrayers(updated);
    return updated;
  }

  async deleteCustomPrayer(id: string): Promise<CustomPrayer[]> {
    const current = await this.getCustomPrayers();
    const updated = current.filter(p => p.id !== id);
    await this.saveCustomPrayers(updated);
    return updated;
  }

  // ===== PIN Güvenlik =====
  async setPin(pin: string): Promise<void> {
    const hash = await hashPin(pin);
    await storage.set(STORAGE_KEYS.PIN_HASH, hash);
  }

  async verifyPin(pin: string): Promise<boolean> {
    const storedHash = await storage.get(STORAGE_KEYS.PIN_HASH);
    if (!storedHash) return true; // PIN ayarlanmamışsa doğrudan geç
    const inputHash = await hashPin(pin);
    return inputHash === storedHash;
  }

  async hasPin(): Promise<boolean> {
    const hash = await storage.get(STORAGE_KEYS.PIN_HASH);
    return !!hash;
  }

  async removePin(): Promise<void> {
    await storage.remove(STORAGE_KEYS.PIN_HASH);
  }

  // ===== Veri Yedekleme =====
  async exportAllData(): Promise<string> {
    const data = {
      entries: await this.getEntries(),
      profile: await this.getProfile(),
      settings: await this.getSettings(),
      customPrayers: await this.getCustomPrayers(),
      exportDate: new Date().toISOString(),
      appVersion: '1.2.0'
    };
    return JSON.stringify(data, null, 2);
  }

  async importAllData(jsonData: string): Promise<{ success: boolean; message: string }> {
    try {
      if (jsonData.length > 5 * 1024 * 1024) {
        return { success: false, message: 'Dosya boyutu çok büyük (max 5MB).' };
      }

      const data = JSON.parse(jsonData);

      if (!data || typeof data !== 'object') {
        return { success: false, message: 'Geçersiz yedek dosyası formatı.' };
      }

      if (!data.entries || !Array.isArray(data.entries)) {
        return { success: false, message: 'Geçersiz yedek dosyası: entries bulunamadı.' };
      }

      const isValidEntry = (entry: unknown): entry is JournalEntry => {
        if (!entry || typeof entry !== 'object') return false;
        const e = entry as Record<string, unknown>;
        return typeof e.id === 'string' && typeof e.title === 'string' && typeof e.timestamp === 'string';
      };

      const validEntries = data.entries.filter(isValidEntry);

      await this.saveEntries(validEntries);
      if (data.profile && typeof data.profile === 'object') await this.saveProfile(data.profile);
      if (data.settings && typeof data.settings === 'object') await this.saveSettings(data.settings);
      if (data.customPrayers && Array.isArray(data.customPrayers)) await this.saveCustomPrayers(data.customPrayers);

      return { success: true, message: 'Veriler başarıyla geri yüklendi!' };
    } catch {
      return { success: false, message: 'Dosya okunamadı. Geçerli bir yedek dosyası seçin.' };
    }
  }
  // ===== Kullanıcı Sözleşmesi =====
  async hasAcceptedAgreement(): Promise<boolean> {
    const val = await storage.get(STORAGE_KEYS.AGREEMENT_ACCEPTED);
    return val === 'true';
  }

  async acceptAgreement(): Promise<void> {
    await storage.set(STORAGE_KEYS.AGREEMENT_ACCEPTED, 'true');
  }

  // ===== Kullanıcı Mesajları =====
  async getUserMessages(): Promise<UserMessage[]> {
    try {
      const data = await storage.get(STORAGE_KEYS.USER_MESSAGES);
      if (!data) return [];
      return JSON.parse(data).sort((a: UserMessage, b: UserMessage) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch {
      return [];
    }
  }

  async addUserMessage(text: string, category?: string): Promise<UserMessage[]> {
    const msg: UserMessage = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      text: sanitizeString(text),
      category,
      timestamp: new Date().toISOString()
    };
    const current = await this.getUserMessages();
    const updated = [msg, ...current];
    await storage.set(STORAGE_KEYS.USER_MESSAGES, JSON.stringify(updated));
    return updated;
  }

  async deleteUserMessage(id: string): Promise<UserMessage[]> {
    const current = await this.getUserMessages();
    const updated = current.filter(m => m.id !== id);
    await storage.set(STORAGE_KEYS.USER_MESSAGES, JSON.stringify(updated));
    return updated;
  }

  // ===== Tüm Verileri Sil =====
  async deleteAllData(): Promise<void> {
    const allKeys = Object.values(STORAGE_KEYS).filter(k => k !== STORAGE_KEYS.AGREEMENT_ACCEPTED);
    for (const key of allKeys) {
      await storage.remove(key);
    }
    // Dua favorilerini de temizle
    await storage.remove('sukurolsun_dua_favorites');
    await storage.remove('sukur_review_state');
  }
}

export const storageService = new StorageService();
