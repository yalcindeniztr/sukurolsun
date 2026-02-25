import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Save, Award, User, Download, Upload, Check, AlertCircle, Lock, Unlock, ShieldCheck, Trash2 } from 'lucide-react';
import { UserProfile } from '../../core/types';
import { AVATARS } from '../../constants';
import { storageService } from '../../services/storage.service';
import { useTheme } from '../../core/ThemeContext';

// Rozet Tanımları
const BADGE_INFO: Record<string, { label: string, color: string }> = {
    'start_journey': { label: 'İlk Adım', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    'week_streak': { label: 'Bir Hafta', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    'month_streak': { label: 'İstikrar', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    'master_streak': { label: 'Şükür Ustası', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
};

interface ProfileViewProps {
    profile: UserProfile | null;
    onUpdateProfile: (profile: UserProfile) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdateProfile }) => {
    const { theme } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(profile?.name || '');
    const [title, setTitle] = useState(profile?.title || '');
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

    const currentAvatarUrl = AVATARS.find(url => url.includes(profile?.avatarId || 'avatar_1')) || AVATARS[0];
    const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(currentAvatarUrl);

    React.useEffect(() => {
        if (profile?.avatarId) {
            const url = AVATARS.find(u => u.includes(profile.avatarId)) || AVATARS[0];
            setSelectedAvatarUrl(url);
        }
    }, [profile?.avatarId]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (profile) {
            const avatarId = selectedAvatarUrl.split('/').pop()?.split('.')[0] || 'avatar_1';

            onUpdateProfile({
                ...profile,
                name,
                title,
                avatarId: avatarId,
            });
            setIsEditing(false);
        }
    };

    const handleExport = async () => {
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
            setBackupStatus({ type: 'success', message: 'Yedek dosyası indirildi!' });
            setTimeout(() => setBackupStatus(null), 3000);
        } catch {
            setBackupStatus({ type: 'error', message: 'Yedekleme başarısız oldu.' });
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
            setPinError('PIN 4 haneli rakam olmalı.');
            return;
        }
        if (newPin !== confirmPin) {
            setPinError('PIN\'ler eşleşmiyor.');
            return;
        }
        await storageService.setPin(newPin);
        setHasPinSet(true);
        setShowPinSetup(false);
        setNewPin('');
        setConfirmPin('');
    };

    const handleRemovePin = async () => {
        if (window.confirm('PIN korumasını kaldırmak istediğinize emin misiniz?')) {
            await storageService.removePin();
            setHasPinSet(false);
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
                        Profilim
                    </h2>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`p-2.5 rounded-2xl transition-all active:scale-95
                            ${theme === 'light'
                                ? 'hover:bg-slate-100 text-slate-400 hover:text-emerald-600'
                                : 'hover:bg-white/[0.06] text-slate-400 hover:text-emerald-400'}`}
                    >
                        {isEditing ? <span className="text-sm font-bold">Vazgeç</span> : <Edit2 className="w-5 h-5" />}
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
                                    ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>Avatar Seç</p>
                                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide justify-center">
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
                                ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>İsim</label>
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
                                ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>Unvan / Motto</label>
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
                                <Save className="w-4 h-4" />
                                <span>Değişiklikleri Kaydet</span>
                            </button>
                        </div>
                    )}
                </form>
            </div>

            {/* Badges Section - 3D Cards */}
            <div className={`glass-card p-8
                ${theme === 'light' ? 'bg-white/80 border-slate-200/50 shadow-depth-light' : ''}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Award className={`w-6 h-6 ${theme === 'light' ? 'text-amber-500' : 'text-amber-400'}`} />
                    <h3 className={`text-xl font-serif ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>Rozetlerim</h3>
                </div>

                {(!profile?.badges || profile.badges.length === 0) ? (
                    <div className={`text-center py-8 rounded-2xl border-2 border-dashed
                        ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/[0.06]'}`}>
                        <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>Henüz rozet kazanılmadı. Günlük tutmaya devam et, sürprizleri yakala!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {profile.badges.map(badgeId => {
                            const info = BADGE_INFO[badgeId];
                            if (!info) return null;
                            return (
                                <div key={badgeId}
                                    className={`p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all hover:scale-105 active:scale-95 ${info.color}`}
                                    style={{ boxShadow: '0 4px 14px -3px rgba(0,0,0,0.2)' }}
                                >
                                    <div className="p-3 bg-white/10 rounded-full shadow-inner">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <span className="font-bold text-sm text-center">{info.label}</span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Veri Yedekleme - 3D Card */}
            <div className={`glass-card p-8
                ${theme === 'light' ? 'bg-white/80 border-slate-200/50 shadow-depth-light' : ''}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Download className={`w-6 h-6 ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                    <h3 className={`text-xl font-serif ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>Veri Yedekleme</h3>
                </div>

                <p className={`text-sm mb-6 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    Tüm şükür notlarınızı, profilinizi ve ayarlarınızı yedekleyebilir veya geri yükleyebilirsiniz.
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
                        <span className="font-bold">Veriyi Dışa Aktar</span>
                    </button>

                    {/* İçe Aktar */}
                    <label className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer active:scale-95
                        ${theme === 'light'
                            ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 shadow-sm'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                        }`}>
                        <Upload className="w-5 h-5" />
                        <span className="font-bold">Veriyi İçe Aktar</span>
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
                    <h3 className={`text-xl font-serif ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>PIN Güvenlik</h3>
                </div>

                <p className={`text-sm mb-6 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    Uygulamayı açarken PIN kodu sorulmasını istiyorsanız buradan ayarlayabilirsiniz.
                </p>

                {hasPinSet ? (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Lock className={`w-5 h-5 ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                            <span className={`font-bold ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>PIN aktif</span>
                        </div>
                        <button
                            onClick={handleRemovePin}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95
                                ${theme === 'light'
                                    ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                                    : 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'}`}
                        >
                            PIN'i Kaldır
                        </button>
                    </div>
                ) : showPinSetup ? (
                    <div className="space-y-4 animate-fadeIn">
                        <div>
                            <label className={`text-xs font-bold uppercase mb-1 block tracking-wider
                                ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>Yeni PIN (4 haneli)</label>
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
                                ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>PIN'i Onayla</label>
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
                                Vazgeç
                            </button>
                            <button
                                type="button"
                                onClick={handleSetPin}
                                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold transition-all active:scale-95"
                                style={{ boxShadow: '0 4px 14px -3px rgba(16,185,129,0.4)' }}
                            >
                                PIN'i Kaydet
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
                        <span className="font-bold">PIN Ayarla</span>
                    </button>
                )}
            </div>

            {/* Tüm Verileri Sil - Kart */}
            <div className={`glass-card p-8
                ${theme === 'light' ? 'bg-white/80 border-slate-200/50 shadow-depth-light' : ''}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Trash2 className="w-6 h-6 text-red-500" />
                    <h3 className={`text-xl font-serif ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>Veri Yönetimi</h3>
                </div>

                <p className={`text-sm mb-6 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    Tüm şükür notlarınızı, profilinizi ve ayarlarınızı kalıcı olarak silebilirsiniz.
                    Bu işlem geri alınamaz.
                </p>

                <button
                    onClick={async () => {
                        if (window.confirm('⚠️ TÜM VERİLERİN SİLİNECEK!\n\nŞükür notların, profilin, duaların ve tüm ayarların kalıcı olarak silinecek.\n\nBu işlem geri alınamaz. Devam etmek istiyor musun?')) {
                            await storageService.deleteAllData();
                            window.location.reload();
                        }
                    }}
                    className="flex items-center justify-center gap-3 w-full p-4 rounded-2xl border transition-all active:scale-95
                        bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                >
                    <Trash2 className="w-5 h-5" />
                    <span className="font-bold">Tüm Verilerimi Sil</span>
                </button>
            </div>
        </div>
    );
};

export default ProfileView;
