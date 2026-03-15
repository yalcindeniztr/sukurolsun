import { Mood, UserProfile } from './core/types';

export const MOODS: Mood[] = [
  { type: 'peaceful', emoji: '😌', labelTr: 'Huzurlu', labelEn: 'Peaceful', color: 'text-teal-400', bg: 'bg-teal-500/20' },
  { type: 'grateful', emoji: '🥰', labelTr: 'Minnettar', labelEn: 'Grateful', color: 'text-rose-400', bg: 'bg-rose-500/20' },
  { type: 'hopeful', emoji: '🤲', labelTr: 'Umutlu', labelEn: 'Hopeful', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  { type: 'joyful', emoji: '😊', labelTr: 'Neşeli', labelEn: 'Joyful', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  { type: 'reflective', emoji: '🤔', labelTr: 'Düşünceli', labelEn: 'Reflective', color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
  { type: 'anxious', emoji: '😰', labelTr: 'Daralmış', labelEn: 'Anxious', color: 'text-orange-400', bg: 'bg-orange-500/20' },
  { type: 'sad', emoji: '😔', labelTr: 'Hüzünlü', labelEn: 'Sad', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { type: 'tired', emoji: '😮‍💨', labelTr: 'Yorgun', labelEn: 'Tired', color: 'text-slate-400', bg: 'bg-slate-500/20' },
];

export const CATEGORIES = [
  { type: 'faith', labelTr: 'İnanç', labelEn: 'Faith' },
  { type: 'family', labelTr: 'Aile', labelEn: 'Family' },
  { type: 'health', labelTr: 'Sağlık', labelEn: 'Health' },
  { type: 'nature', labelTr: 'Doğa', labelEn: 'Nature' },
  { type: 'work', labelTr: 'İş/Okul', labelEn: 'Work/School' },
];

export const DEFAULT_PROFILE: UserProfile = {
  id: 'user_1',
  name: 'Misafir',
  title: 'Şükür Yolcusu',
  avatarId: 'avatar_1',
  joinedDate: new Date().toISOString(),
  streak: 0,
  badges: [],
  notificationsEnabled: false,
};

// Vite base URL'i ile uyumlu avatar yolları
const BASE = import.meta.env.BASE_URL || '/';
export const AVATARS = [
  `${BASE}avatars/avatar_1.png`,
  `${BASE}avatars/avatar_2.png`,
  `${BASE}avatars/avatar_3.png`,
  `${BASE}avatars/avatar_4.png`,
  `${BASE}avatars/avatar_5.png`,
];
