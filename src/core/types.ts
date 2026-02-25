export type Language = 'tr' | 'en';
export type Theme = 'light' | 'dark';

export type MoodType = 'peaceful' | 'grateful' | 'hopeful' | 'joyful' | 'reflective' | 'somber';
export type PromptType = 'gratitude' | 'allah_action';

export interface CustomPrayer {
  id: string;
  text: string;
  timestamp: string;
}

export interface Mood {
  type: MoodType;
  emoji: string;
  labelTr: string;
  labelEn: string;
  color: string;
  bg: string;
}

export interface Badge {
  id: string;
  labelTr: string;
  icon: string; // e.g., 'award', 'star'
  requiredStreak: number;
  color: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: MoodType;
  promptType: PromptType;
  category: string;
  timestamp: string; // ISO String
  isArchived?: boolean;
  isFavorite?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  avatarId: string;
  joinedDate: string;
  streak: number;
  badges: string[]; // List of badge IDs
}

export interface AppSettings {
  language: Language;
  dailyReminderTime: string | null;
  enableNotifications: boolean;
}

export interface AppState {
  entries: JournalEntry[];
  profile: UserProfile | null;
  settings: AppSettings;
}

export interface UserMessage {
  id: string;
  text: string;
  category?: string;
  timestamp: string;
}
