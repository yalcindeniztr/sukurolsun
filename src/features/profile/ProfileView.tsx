import React, { useState } from 'react';
import { Edit2, Save, Award, User } from 'lucide-react';
import { UserProfile } from '../../core/types';
import { AVATARS } from '../../constants';

// Rozet Tanımları
const BADGE_INFO: Record<string, { label: string, color: string }> = {
    'start_journey': { label: 'İlk Adım', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
    'week_streak': { label: 'Bir Hafta', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    'month_streak': { label: 'İstikrar', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    'master_streak': { label: 'Şükür Ustası', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
};

interface ProfileViewProps {
    profile: UserProfile | null;
    onUpdateProfile: (profile: UserProfile) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdateProfile }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(profile?.name || '');
    const [title, setTitle] = useState(profile?.title || '');

    // Avatar ID'yi parse etme (örn: '/avatars/avatar_1.png' -> 'avatar_1') veya direkt url kullanma
    // Veritabanında full path mi yoksa id mi tuttuğumuza göre değişir. 
    // Mevcut yapıda constants.ts'te full path var. Profile'de avatarId var.
    // Eşleşme mantığını kuralım:
    const currentAvatarUrl = AVATARS.find(url => url.includes(profile?.avatarId || 'avatar_1')) || AVATARS[0];
    const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(currentAvatarUrl);

    // Profil yüklendiğinde avatarı güncelle
    React.useEffect(() => {
        if (profile?.avatarId) {
            const url = AVATARS.find(u => u.includes(profile.avatarId)) || AVATARS[0];
            setSelectedAvatarUrl(url);
        }
    }, [profile?.avatarId]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (profile) {
            // URL'den ID çıkarma (basitçe dosya adı)
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

    return (
        <div className="space-y-6 animate-fade-in max-w-3xl mx-auto pb-24">

            {/* Main Profile Card */}
            <div className="glass-card p-8 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-bl-full pointer-events-none" />

                <div className="flex justify-between items-center mb-8 relative z-10">
                    <h2 className="text-2xl font-serif text-slate-100 flex items-center gap-3">
                        <User className="w-6 h-6 text-teal-400" />
                        Profilim
                    </h2>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-teal-300 transition-colors"
                    >
                        {isEditing ? <span className="text-sm font-medium">Vazgeç</span> : <Edit2 className="w-5 h-5" />}
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-8 relative z-10">

                    {/* Avatar Section */}
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full p-[3px] bg-gradient-to-tr from-teal-500 to-amber-500 shadow-xl shadow-teal-500/20">
                                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={selectedAvatarUrl}
                                        alt="Avatar"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                            </div>
                            {/* "Seri" yazısı kaldırıldı. */}
                        </div>

                        {/* Avatar Seleyici (Sadece Edit Modunda) */}
                        {isEditing && (
                            <div className="w-full bg-black/20 p-4 rounded-2xl border border-white/5 animate-slide-up">
                                <p className="text-xs font-bold text-slate-500 uppercase text-center mb-3">Avatar Seç</p>
                                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide justify-center">
                                    {AVATARS.map((url, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setSelectedAvatarUrl(url)}
                                            className={`w-16 h-16 shrink-0 rounded-full border-2 transition-all p-0.5
                                                ${selectedAvatarUrl === url
                                                    ? 'border-amber-500 scale-110 shadow-lg shadow-amber-500/20'
                                                    : 'border-transparent opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <div className="w-full h-full rounded-full overflow-hidden bg-slate-800">
                                                <img src={url} alt={`Avatar ${index}`} className="w-full h-full object-cover" />
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
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">İsim</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={!isEditing}
                                className={`input-field text-center md:text-left transition-all
                                    ${!isEditing
                                        ? 'bg-transparent border-transparent pl-0 text-2xl font-serif text-slate-100'
                                        : 'bg-black/20 focus:border-teal-500/50'
                                    }`}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Unvan / Motto</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={!isEditing}
                                className={`input-field text-center md:text-left transition-all
                                    ${!isEditing
                                        ? 'bg-transparent border-transparent pl-0 text-lg text-teal-400 font-medium'
                                        : 'bg-black/20 focus:border-teal-500/50'
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

            {/* Badges Section */}
            <div className="glass-card p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Award className="w-6 h-6 text-amber-400" />
                    <h3 className="text-xl font-serif text-slate-100">Rozetlerim</h3>
                </div>

                {(!profile?.badges || profile.badges.length === 0) ? (
                    <div className="text-center py-8 bg-white/5 rounded-xl border border-white/5 border-dashed">
                        <p className="text-slate-500 text-sm">Henüz rozet kazanılmadı. Günlük tutmaya devam et, sürprizleri yakala!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {profile.badges.map(badgeId => {
                            const info = BADGE_INFO[badgeId];
                            if (!info) return null;
                            return (
                                <div key={badgeId} className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-transform hover:scale-105 ${info.color}`}>
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
        </div>
    );
};

export default ProfileView;
