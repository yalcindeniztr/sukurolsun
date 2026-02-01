import { Mood, UserProfile } from './core/types';

export const MOODS: Mood[] = [
  { type: 'peaceful', emoji: '😌', labelTr: 'Huzurlu', labelEn: 'Peaceful', color: 'text-teal-400', bg: 'bg-teal-500/20' },
  { type: 'grateful', emoji: '🥰', labelTr: 'Minnettar', labelEn: 'Grateful', color: 'text-rose-400', bg: 'bg-rose-500/20' },
  { type: 'hopeful', emoji: '🤲', labelTr: 'Umutlu', labelEn: 'Hopeful', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  { type: 'joyful', emoji: '😊', labelTr: 'Neşeli', labelEn: 'Joyful', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  { type: 'reflective', emoji: '🤔', labelTr: 'Düşünceli', labelEn: 'Reflective', color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
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
};

export const AVATARS = [
  '/avatars/avatar_1.png',
  '/avatars/avatar_2.png',
  '/avatars/avatar_3.png',
  '/avatars/avatar_4.png',
  '/avatars/avatar_5.png',
  '/avatars/avatar_6.png',
];
