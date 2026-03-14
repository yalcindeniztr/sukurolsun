import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Save, Award, User, Download, Upload, Check, AlertCircle, Lock, Unlock, ShieldCheck, Trash2 } from 'lucide-react';
import { UserProfile } from '../../core/types';
import { AVATARS } from '../../constants';
import { storageService } from '../../services/storage.service';
import { useTheme } from '../../core/ThemeContext';
import { Capacitor } from '@capacitor/core';
import { notificationService } from '../../services/NotificationService';
import { useLanguage } from '../../core/LanguageContext';

// Rozetler artık t() ile her renderda güncelleniyor, burası sadece Stil veriyor
const BADGE_STYLES: Record<string, { color: string }> = {
    'start_journey': { color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    'week_streak': { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    'month_streak': { color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    'master_streak': { color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
};

interface ProfileViewProps {
    profile: UserProfile | null;
    entries: any[]; // JournalEntry türünde
    onUpdateProfile: (profile: UserProfile) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, entries, onUpdateProfile }) => {
    const { theme, bgImage, setBgImage } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(profile?.name || '');
    const [title, setTitle] = useState(profile?.title || '');
    const [notificationsEnabled, setNotificationsEnabled] = useState(profile?.notificationsEnabled !== false);
    const [locationEnabled, setLocationEnabled] = useState(profile?.locationEnabled !== false);
    const [backupStatus, setBackupStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // PIN State
    const [hasPinSet, setHasPinSet] = useState(false);
    const [showPinSetup, setShowPinSetup] = useState(false);
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [pinError, setPinError] = useState('');

    useEffect(() => {
        storageService.hasPin().then(setHasPinSet);
    }, []);

    const isCustomAvatar = profile?.avatarId?.startsWith('data:image') || false;
    const initialAvatarUrl = isCustomAvatar
        ? profile!.avatarId
        : (AVATARS.find(url => url.includes(profile?.avatarId || 'avatar_1')) || AVATARS[0]);

    const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(initialAvatarUrl);

    useEffect(() => {
        if (profile?.avatarId) {
            const isCust = profile.avatarId.startsWith('data:image');
            const url = isCust
                ? profile.avatarId
                : (AVATARS.find(u => u.includes(profile.avatarId)) || AVATARS[0]);
            setSelectedAvatarUrl(url);
        }
    }, [profile?.avatarId]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target?.result as string;
                setSelectedAvatarUrl(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (profile) {
            let avatarIdToSave = 'avatar_1';
            if (selectedAvatarUrl.startsWith('data:image')) {
                avatarIdToSave = selectedAvatarUrl;
            } else {
                avatarIdToSave = selectedAvatarUrl.split('/').pop()?.split('.')[0] || 'avatar_1';
            }

            onUpdateProfile({
                ...profile,
                name,
                title,
                avatarId: avatarIdToSave,
                notificationsEnabled,
                locationEnabled
            });
            setIsEditing(false);
        }
    };

    const handleExport = async () => {
        if (Capacitor.isNativePlatform()) {
            const result = await storageService.createNativeBackup();
            setBackupStatus({ type: result.success ? 'success' : 'error', message: result.message });
            setTimeout(() => setBackupStatus(null), 3500);
        } else {
            try {
                const data = await storageService.exportAllData();
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `sukur_olsun_yedek_${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                setBackupStatus({ type: 'success', message: t('profile.backupSuccess') });
                setTimeout(() => setBackupStatus(null), 3000);
            } catch {
                setBackupStatus({ type: 'error', message: t('profile.backupError') });
            }
        }
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const content = e.target?.result as string;
            const result = await storageService.importAllData(content);
            setBackupStatus({ type: result.success ? 'success' : 'error', message: result.message });
            if (result.success) {
                setTimeout(() => window.location.reload(), 1500);
            }
        };
        reader.readAsText(file);

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // PIN İşlemleri
    const handleSetPin = async () => {
        setPinError('');
        if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
            setPinError(t('profile.pinDigitsError'));
            return;
        }
        if (newPin !== confirmPin) {
            setPinError(t('profile.pinMatchError'));
            return;
        }
        await storageService.setPin(newPin);
        setHasPinSet(true);
        setShowPinSetup(false);
        setNewPin('');
        setConfirmPin('');
    };

    const handleRemovePin = async () => {
        if (window.confirm(t('profile.removePinConfirm'))) {
            await storageService.removePin();
            setHasPinSet(false);
        }
    };

    // Bildirim İşlemleri
    const handleToggleNotifications = async (checked: boolean) => {
        setNotificationsEnabled(checked);
        if (profile) {
            onUpdateProfile({ ...profile, notificationsEnabled: checked });
        }
        await notificationService.toggleNotifications(checked);
    };

    // Konum İzni İşlemleri
    const handleToggleLocation = async (checked: boolean) => {
        setLocationEnabled(checked);
        if (profile) {
            onUpdateProfile({ ...profile, locationEnabled: checked });
        }
    };

    // Dil Değiştirme
    const handleToggleLanguage = (lang: 'tr' | 'en') => {
        setLanguage(lang);
        if (profile) {
            onUpdateProfile({ ...profile, language: lang });
        }
    };

    // Fallback avatar
    const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = AVATARS[0];
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-3xl mx-auto pb-24">

            {/* Main Profile Card - 3D */}
            <div className={`glass-card p-8 relative overflow-hidden
                ${theme === 'light' ? 'bg-white/80 border-slate-200/50 shadow-depth-light' : ''}`}
            >
                {/* Background Decor - 3D Orbs */}
                <div className={`absolute top-0 right-0 w-48 h-48 rounded-bl-full pointer-events-none
                    ${theme === 'light' ? 'bg-emerald-400/8' : 'bg-emerald-500/[0.06]'}`} />
                <div className={`absolute bottom-0 left-0 w-32 h-32 rounded-tr-full pointer-events-none
                    ${theme === 'light' ? 'bg-amber-400/8' : 'bg-amber-500/[0.04]'}`} />

                <div className="flex justify-between items-center mb-8 relative z-10">
                    <h2 className={`text-2xl font-serif flex items-center gap-3
                        ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                        <User className={`w-6 h-6 ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                        {t('common.profile')}
                    </h2>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`p-2.5 rounded-2xl transition-all active:scale-95
                            ${theme === 'light'
                                ? 'hover:bg-slate-100 text-slate-400 hover:text-emerald-600'
                                : 'hover:bg-white/[0.06] text-slate-400 hover:text-emerald-400'}`}
                    >
                        {isEditing ? <span className="text-sm font-bold">{t('common.cancel')}</span> : <Edit2 className="w-5 h-5" />}
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-8 relative z-10">

                    {/* Avatar Section - 3D Ring */}
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full p-[3px] bg-gradient-to-tr from-emerald-400 to-amber-400"
                                style={{ boxShadow: '0 8px 30px -5px rgba(16,185,129,0.3)' }}>
                                <div className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden
                                    ${theme === 'light' ? 'bg-white' : 'bg-[#0a1f16]'}`}>
                                    <img
                                        src={selectedAvatarUrl}
                                        alt="Avatar"
                                        onError={handleAvatarError}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Avatar Seçici (Edit Modunda) */}
                        {isEditing && (
                            <div className={`w-full p-4 rounded-2xl border animate-scale-in
                                ${theme === 'light'
                                    ? 'bg-slate-50 border-slate-200'
                                    : 'bg-black/20 border-white/[0.06]'}`}>
                                <p className={`text-xs font-bold uppercase text-center mb-3 tracking-wider
                                    ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>{t('profile.avatarSelect')}</p>
                                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide items-center justify-start md:justify-center">
                                    {/* Özel Resim Yükle Butonu */}
                                    <label className="flex flex-col items-center justify-center w-16 h-16 shrink-0 rounded-full border-2 border-dashed border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer overflow-hidden p-1 shadow-sm">
                                        <div className="w-full h-full rounded-full flex flex-col items-center justify-center bg-white/50 relative">
                                            <Upload className="w-5 h-5 text-emerald-600 mb-0.5" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageUpload}
                                            />
                                        </div>
                                    </label>
                                    {AVATARS.map((url, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setSelectedAvatarUrl(url)}
                                            className={`w-16 h-16 shrink-0 rounded-full border-2 transition-all p-0.5
                                                ${selectedAvatarUrl === url
                                                    ? 'border-amber-400 scale-110 shadow-lg shadow-amber-400/20'
                                                    : 'border-transparent opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <div className={`w-full h-full rounded-full overflow-hidden ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}>
                                                <img src={url} alt={`Avatar ${index}`} onError={handleAvatarError} className="w-full h-full object-cover" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Details Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className={`text-xs font-bold uppercase ml-1 tracking-wider
                                ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>{t('profile.nameLabel')}</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={!isEditing}
                                className={`input-field text-center md:text-left transition-all
                                    ${!isEditing
                                        ? `bg-transparent border-transparent pl-0 text-2xl font-serif ${theme === 'light' ? 'text-slate-800' : 'text-white'}`
                                        : theme === 'light'
                                            ? 'bg-white border-slate-200 text-slate-800 focus:border-emerald-400'
                                            : 'bg-black/20 focus:border-emerald-400/50'
                                    }`}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className={`text-xs font-bold uppercase ml-1 tracking-wider
                                ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>{t('profile.titleLabel')}</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={!isEditing}
                                className={`input-field text-center md:text-left transition-all
                                    ${!isEditing
                                        ? `bg-transparent border-transparent pl-0 text-lg font-medium ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`
                                        : theme === 'light'
                                            ? 'bg-white border-slate-200 text-slate-800 focus:border-emerald-400'
                                            : 'bg-black/20 focus:border-emerald-400/50'
                                    }`}
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex justify-center pt-4 animate-fade-in">
                            <button type="submit" className="btn-gold flex items-center gap-2 px-8">
                                <Save className="w-5 h-5" />
                                {t('common.save') || 'Kaydet'}
                            </button>
                        </div>
                    )}
                </form>
            </div>

            {/* İstatistikler ve Grafikler - 3D Card */}
            <div className={`glass-card p-8
                ${theme === 'light' ? 'bg-white/80 border-slate-200/50 shadow-depth-light' : ''}`}>
                <div className="flex items-center gap-3 mb-6">
                    <div className={`w-6 h-6 rounded flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 text-white`}>
                        <Award className="w-4 h-4" />
                    </div>
                    <h3 className={`text-xl font-serif ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{t('profile.stats.statistics')}</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {/* Toplam Not Kartı */}
                    <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 text-center
                        ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/10'}`}>
                        <div className="text-3xl font-black text-amber-500">{entries?.length || 0}</div>
                        <div className={`text-xs font-bold uppercase ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>{t('profile.stats.myJournalEntries')}</div>
                    </div>
                    {/* İstikrar Kartı */}
                    <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 text-center
                        ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/10'}`}>
                        <div className="text-3xl font-black text-emerald-500">{profile?.streak || 0}</div>
                        <div className={`text-xs font-bold uppercase ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>{t('profile.stats.streak')}</div>
                    </div>
                    {/* Rozet Sayısı */}
                    <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 text-center
                        ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/10'}`}>
                        <div className="text-3xl font-black text-blue-500">{profile?.badges?.length || 0}</div>
                        <div className={`text-xs font-bold uppercase ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>{t('profile.stats.myBadges')}</div>
                    </div>
                    {/* En iyi Ruh Hali */}
                    <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 text-center
                        ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/10'}`}>
                        <div className="text-3xl font-black">
                            {(() => {
                                if (!entries || entries.length === 0) return '🤔';
                                const moodCounts: Record<string, number> = {};
                                entries.forEach(e => { moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1; });
                                const topMood = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b);
                                const moodEmojiMap: Record<string, string> = { 
                                    grateful: '🥰', peaceful: '😌', happy: '😊', blessed: '✨', reflective: '🤔', 
                                    anxious: '😰', sad: '😔', tired: '😮‍💨', hopeful: '🤲', joyful: '😊' 
                                };
                                return moodEmojiMap[topMood] || topMood;
                            })()}
                        </div>
                        <div className={`text-xs font-bold uppercase ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>{t('profile.stats.topMood')}</div>
                    </div>
                </div>

                {/* Ruh Hali Dağılımı Basit Grafik */}
                {entries && entries.length > 0 && (
                    <div>
                        <p className={`text-xs font-bold uppercase mb-4 tracking-wider ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                            {t('profile.moodHistory')}
                        </p>
                        <div className="space-y-3">
                            {(() => {
                                const moodCounts: Record<string, number> = {};
                                entries.forEach(e => { moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1; });
                                const total = entries.length;
                                const moodLabels: Record<string, { emoji: string, color: string }> = {
                                    grateful: { emoji: '🙏', color: 'bg-emerald-500' },
                                    peaceful: { emoji: '🕊️', color: 'bg-blue-400' },
                                    happy: { emoji: '😊', color: 'bg-amber-400' },
                                    blessed: { emoji: '✨', color: 'bg-purple-400' },
                                    reflective: { emoji: '🤔', color: 'bg-slate-400' },
                                    anxious: { emoji: '😰', color: 'bg-orange-400' }, 
                                    sad: { emoji: '😔', color: 'bg-blue-400' },
                                    tired: { emoji: '😮‍💨', color: 'bg-slate-500' },
                                    hopeful: { emoji: '🤲', color: 'bg-emerald-400' },
                                    joyful: { emoji: '😊', color: 'bg-amber-500' }
                                };

                                return Object.entries(moodCounts)
                                    .sort((a, b) => b[1] - a[1]) // En çoktan aza
                                    .map(([mood, count]) => {
                                        const percent = Math.round((count / total) * 100);
                                        const config = moodLabels[mood] || { emoji: mood, color: 'bg-gray-400' };
                                        return (
                                            <div key={mood} className="flex items-center gap-3">
                                                <div className="text-xl w-8 text-center">{config.emoji}</div>
                                                <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                                                    <div className={`h-full ${config.color} rounded-full transition-all duration-1000`} style={{ width: `${percent}%` }} />
                                                </div>
                                                <div className={`text-xs font-bold w-12 text-right ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>{percent}%</div>
                                            </div>
                                        );
                                    });
                            })()}
                        </div>
                    </div>
                )}
            </div>

            {/* Badges Section - 3D Cards */}
            <div className={`glass-card p-8
                ${theme === 'light' ? 'bg-white/80 border-slate-200/50 shadow-depth-light' : ''}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Award className={`w-6 h-6 ${theme === 'light' ? 'text-amber-500' : 'text-amber-400'}`} />
                    <h3 className={`text-xl font-serif ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{t('profile.stats.myBadges')}</h3>
                </div>

                {(!profile?.badges || profile.badges.length === 0) ? (
                    <div className={`text-center py-8 border-2 border-dashed rounded-2xl
                        ${theme === 'light' ? 'border-slate-200' : 'border-white/10'}`}>
                        <Award className={`w-12 h-12 mx-auto mb-3 opacity-20 ${theme === 'light' ? 'text-slate-400' : 'text-white'}`} />
                        <p className={theme === 'light' ? 'text-slate-500' : 'text-slate-400'}>{t('profile.noBadges')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {profile.badges.map(badgeId => {
                            const style = BADGE_STYLES[badgeId];
                            if (!style) return null;
                            return (
                                <div key={badgeId}
                                    className={`p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all hover:scale-105 active:scale-95 ${style.color}`}
                                    style={{ boxShadow: '0 4px 14px -3px rgba(0,0,0,0.2)' }}
                                >
                                    <div className="p-3 bg-white/10 rounded-full shadow-inner">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <span className="font-bold text-sm text-center">{t(`profile.badges.${badgeId}` as any)}</span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Arka Plan Teması Seçici - 3D Card */}
            <div className={`glass-card p-8
                ${theme === 'light' ? 'bg-white/80 border-slate-200/50 shadow-depth-light' : ''}`}>
                <div className="flex items-center gap-3 mb-6">
                    <div className={`w-6 h-6 rounded flex items-center justify-center bg-gradient-to-r from-emerald-400 to-emerald-600 text-white`}>
                        <Award className="w-4 h-4" />
                    </div>
                    <h3 className={`text-xl font-serif ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{t('profile.theme')}</h3>
                </div>

                <p className={`text-sm mb-6 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    {t('profile.themeDesc')}
                </p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { id: 'default', label: t('profile.themes.default'), src: null },
                        { id: 'kabe', label: t('profile.themes.kabe'), src: '/assets/themes/kabe.png' },
                        { id: 'nebevi', label: t('profile.themes.nebevi'), src: '/assets/themes/nebevi.png' },
                        { id: 'nature', label: t('profile.themes.nature'), src: '/assets/themes/nature.png' }
                    ].map(t => (
                        <button
                            key={t.id}
                            onClick={() => setBgImage(t.id as any)}
                            className={`relative rounded-2xl overflow-hidden aspect-[4/3] transition-all border-4 flex flex-col
                                ${bgImage === t.id ? 'border-amber-400 scale-105 shadow-xl shadow-amber-500/20' : 'border-transparent opacity-80 hover:opacity-100 hover:scale-105'}`}
                        >
                            {t.src ? (
                                <img src={t.src} alt={t.label} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-[#f0fdf4] flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full blur-xl bg-emerald-300/50" />
                                </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur text-xs font-bold py-2 text-center text-slate-800">
                                {t.label}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Veri Yedekleme - 3D Card */}
            <div className={`glass-card p-8
                ${theme === 'light' ? 'bg-white/80 border-slate-200/50 shadow-depth-light' : ''}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Download className={`w-6 h-6 ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                    <h3 className={`text-xl font-serif ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{t('profile.backup')}</h3>
                </div>

                <p className={`text-sm mb-6 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    {t('profile.backupDesc')}
                </p>

                {/* Status Mesajı */}
                {backupStatus && (
                    <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm
                        ${backupStatus.type === 'success'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        {backupStatus.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {backupStatus.message}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Dışa Aktar */}
                    <button
                        onClick={handleExport}
                        className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all active:scale-95
                            ${theme === 'light'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 shadow-sm'
                                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                            }`}
                    >
                        <Download className="w-5 h-5" />
                        <span className="font-bold">{t('profile.export')}</span>
                    </button>

                    {/* İçe Aktar */}
                    <label className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer active:scale-95
                        ${theme === 'light'
                            ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 shadow-sm'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                        }`}>
                        <Upload className="w-5 h-5" />
                        <span className="font-bold">{t('profile.import')}</span>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            {/* PIN Güvenlik - 3D Card */}
            <div className={`glass-card p-8
                ${theme === 'light' ? 'bg-white/80 border-slate-200/50 shadow-depth-light' : ''}`}>
                <div className="flex items-center gap-3 mb-6">
                    <ShieldCheck className={`w-6 h-6 ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                    <h3 className={`text-xl font-serif ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{t('profile.pinSecurity')}</h3>
                </div>

                <p className={`text-sm mb-6 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    {t('profile.pinSecurityDesc')}
                </p>

                {hasPinSet ? (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Lock className={`w-5 h-5 ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                            <span className={`font-bold ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>{t('profile.pinActive')}</span>
                        </div>
                        <button
                            onClick={handleRemovePin}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95
                                ${theme === 'light'
                                    ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                                    : 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'}`}
                        >
                            {t('profile.removePin')}
                        </button>
                    </div>
                ) : showPinSetup ? (
                    <div className="space-y-4 animate-fadeIn">
                        <div>
                            <label className={`text-xs font-bold uppercase mb-1 block tracking-wider
                                ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>{t('profile.newPin')}</label>
                            <input
                                type="password"
                                maxLength={4}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={newPin}
                                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                                className={`input-field text-center text-2xl tracking-[1em] font-bold
                                    ${theme === 'light'
                                        ? 'bg-white border-slate-200 text-slate-800 focus:border-emerald-400'
                                        : 'bg-black/20 border-white/[0.08] text-white focus:border-emerald-400/50'}`}
                                placeholder="• • • •"
                            />
                        </div>
                        <div>
                            <label className={`text-xs font-bold uppercase mb-1 block tracking-wider
                                ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>{t('profile.confirmPin')}</label>
                            <input
                                type="password"
                                maxLength={4}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={confirmPin}
                                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                                className={`input-field text-center text-2xl tracking-[1em] font-bold
                                    ${theme === 'light'
                                        ? 'bg-white border-slate-200 text-slate-800 focus:border-emerald-400'
                                        : 'bg-black/20 border-white/[0.08] text-white focus:border-emerald-400/50'}`}
                                placeholder="• • • •"
                            />
                        </div>
                        {pinError && (
                            <p className="text-sm text-red-400 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> {pinError}
                            </p>
                        )}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => { setShowPinSetup(false); setNewPin(''); setConfirmPin(''); setPinError(''); }}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all
                                    ${theme === 'light' ? 'text-slate-500 hover:bg-slate-100' : 'text-slate-400 hover:bg-white/5'}`}
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                type="button"
                                onClick={handleSetPin}
                                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold transition-all active:scale-95"
                                style={{ boxShadow: '0 4px 14px -3px rgba(16,185,129,0.4)' }}
                            >
                                {t('profile.savePin')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowPinSetup(true)}
                        className={`flex items-center gap-3 w-full p-4 rounded-2xl border transition-all active:scale-95
                            ${theme === 'light'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'}`}
                    >
                        <Unlock className="w-5 h-5" />
                        <span className="font-bold">{t('profile.setPin')}</span>
                    </button>
                )}
            </div>

            {/* Dil Ayarları - 3D Card */}
            <div className={`glass-card p-8 mb-6
                ${theme === 'light' ? 'bg-white/80 border-slate-200/50 shadow-depth-light' : ''}`}>
                <div className="flex items-center gap-3 mb-6">
                    <AlertCircle className={`w-6 h-6 ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                    <h3 className={`text-xl font-serif ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{t('profile.language')}</h3>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className={`font-bold ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                            Türkçe / English
                        </p>
                        <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                            {t('profile.languageDesc')}
                        </p>
                    </div>
                    {/* Dil Switcher */}
                    <div className={`flex rounded-lg p-1 ${theme === 'light' ? 'bg-slate-200' : 'bg-slate-700'}`}>
                        <button
                            type="button"
                            onClick={() => handleToggleLanguage('tr')}
                            className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${language === 'tr' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600'}`}
                        >
                            TR
                        </button>
                        <button
                            type="button"
                            onClick={() => handleToggleLanguage('en')}
                            className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${language === 'en' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600'}`}
                        >
                            EN
                        </button>
                    </div>
                </div>
            </div>

            {/* Bildirim Ayarları - 3D Card */}
            <div className={`glass-card p-8
                ${theme === 'light' ? 'bg-white/80 border-slate-200/50 shadow-depth-light' : ''}`}>
                <div className="flex items-center gap-3 mb-6">
                    <AlertCircle className={`w-6 h-6 ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                    <h3 className={`text-xl font-serif ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{t('common.notificationSettings')}</h3>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className={`font-bold ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                            {t('profile.dailyVerseNotifications')}
                        </p>
                        <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                            {t('profile.dailyVerseNotificationsDesc')}
                        </p>
                    </div>
                    {/* Basit Toggle Switch */}
                    <button
                        onClick={() => handleToggleNotifications(!notificationsEnabled)}
                        className={`w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 transition-all duration-300 
                            ${notificationsEnabled ? 'bg-emerald-500' : (theme === 'dark' ? 'bg-white/10' : 'bg-slate-300')}
                        `}
                    >
                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out
                            ${notificationsEnabled ? 'translate-x-6' : ''}
                        `}></div>
                    </button>
                </div>

                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                    <div>
                        <p className={`font-bold ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                            {t('common.location')}
                        </p>
                        <p className={`text-xs mt-1 max-w-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                            {t('profile.locationDesc')}
                        </p>
                    </div>
                    {/* Basit Toggle Switch */}
                    <button
                        onClick={() => handleToggleLocation(!locationEnabled)}
                        className={`w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 transition-all duration-300 
                            ${locationEnabled ? 'bg-emerald-500' : (theme === 'dark' ? 'bg-white/10' : 'bg-slate-300')}
                        `}
                    >
                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out
                            ${locationEnabled ? 'translate-x-6' : ''}
                        `}></div>
                    </button>
                </div>
            </div>

            {/* Tüm Verileri Sil - Kart */}
            <div className={`glass-card p-8
                ${theme === 'light' ? 'bg-white/80 border-slate-200/50 shadow-depth-light' : ''}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Trash2 className="w-6 h-6 text-red-500" />
                    <h3 className={`text-xl font-serif ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{t('profile.dataManagement')}</h3>
                </div>

                <p className={`text-sm mb-6 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    {t('profile.dataManagementDesc')}
                </p>

                <button
                    onClick={async () => {
                        if (window.confirm(t('delete.warning') || '⚠️ DEVAM ETMEK İSTİYOR MUSUNUZ?')) {
                            await storageService.deleteAllData();
                            window.location.reload();
                        }
                    }}
                    className="flex items-center justify-center gap-3 w-full p-4 rounded-2xl border transition-all active:scale-95 bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                >
                    <Trash2 className="w-5 h-5" />
                    <span className="font-bold">{t('common.delete') || 'Sil'}</span>
                </button>
            </div>
        </div>
    );
};

export default ProfileView;
