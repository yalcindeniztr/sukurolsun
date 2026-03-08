import React, { useState, useEffect, useCallback } from 'react';
import { Gift, ChevronDown, ChevronUp, Copy, Check, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../../core/ThemeContext';
import { RELIGIOUS_MESSAGES, ReligiousCategory } from './religiousMessages';
import { storageService } from '../../services/storage.service';
import { UserMessage } from '../../core/types';

const ExtrasView: React.FC = () => {
    const { theme } = useTheme();
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [userMessages, setUserMessages] = useState<UserMessage[]>([]);
    const [newMessageText, setNewMessageText] = useState('');

    useEffect(() => {
        const loadMessages = async () => {
            const msgs = await storageService.getUserMessages();
            setUserMessages(msgs);
        };
        loadMessages();
    }, []);

    const toggleCategory = (categoryId: string) => {
        setExpandedCategory(prev => prev === categoryId ? null : categoryId);
    };

    const copyToClipboard = async (text: string, messageId: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(messageId);
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            // Kopyalama desteklenmiyor
        }
    };

    const handleAddMessage = useCallback(async (categoryTitle: string) => {
        if (!newMessageText.trim()) return;
        const updated = await storageService.addUserMessage(newMessageText.trim(), categoryTitle);
        setUserMessages(updated);
        setNewMessageText('');
    }, [newMessageText]);

    const handleDeleteMessage = useCallback(async (id: string) => {
        if (window.confirm('Bu mesajı silmek istediğinden emin misin?')) {
            const updated = await storageService.deleteUserMessage(id);
            setUserMessages(updated);
        }
    }, []);

    return (
        <div className="space-y-6 animate-fadeIn pb-24">
            {/* Başlık */}
            <div className="text-center mb-8">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4
                    ${theme === 'light' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    <Gift className="w-5 h-5" />
                    <span className="font-bold text-sm">Ek Özellikler</span>
                </div>
                <h2 className={`text-2xl font-serif font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                    Dini Gün Mesajları
                </h2>
                <p className={`text-sm mt-2 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    İstediğiniz mesajı kopyalayıp paylaşabilirsiniz
                </p>
            </div>



            {/* Kategori Listesi - 3D Kartlar */}
            <div className="space-y-3">
                {RELIGIOUS_MESSAGES.map((category: ReligiousCategory) => (
                    <div
                        key={category.id}
                        className={`rounded-3xl overflow-hidden transition-all duration-300 border
                            ${theme === 'light'
                                ? 'bg-white/80 border-slate-200/60 shadow-sm hover:shadow-md'
                                : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'}`}
                    >
                        {/* Kategori Başlığı */}
                        <button
                            onClick={() => toggleCategory(category.id)}
                            className={`w-full flex items-center justify-between p-5 transition-colors
                                ${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-white/[0.03]'}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{category.emoji}</span>
                                <span className={`font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                                    {category.title}
                                </span>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-bold
                                    ${theme === 'light' ? 'bg-slate-100 text-slate-500' : 'bg-white/[0.06] text-slate-400'}`}>
                                    {category.messages.length} mesaj
                                </span>
                            </div>
                            {expandedCategory === category.id
                                ? <ChevronUp className={`w-5 h-5 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`} />
                                : <ChevronDown className={`w-5 h-5 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`} />
                            }
                        </button>

                        {/* Mesaj Listesi ve Ekleme */}
                        {expandedCategory === category.id && (
                            <div className="p-4 pt-0 space-y-3 animate-fadeIn">
                                {/* Yeni Mesaj Ekleme */}
                                <div className="flex gap-2">
                                    <textarea
                                        value={newMessageText}
                                        onChange={(e) => setNewMessageText(e.target.value)}
                                        placeholder="Kendi mesajınızı ekleyin..."
                                        rows={1}
                                        className={`flex-1 resize-none p-3 rounded-xl border transition-all ${theme === 'light' ? 'bg-white border-slate-200 text-slate-800' : 'bg-black/20 border-white/10 text-white'}`}
                                        maxLength={500}
                                    />
                                    <button
                                        onClick={() => handleAddMessage(category.title)}
                                        disabled={!newMessageText.trim()}
                                        className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1
                                            ${newMessageText.trim()
                                                ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-sm'
                                                : 'bg-slate-200 text-slate-400 cursor-not-allowed hidden'}`}
                                    >
                                        <Plus className="w-4 h-4" />
                                        Ekle
                                    </button>
                                </div>

                                {/* Kullanıcının Eklediği Mesajlar */}
                                {userMessages.filter(m => m.category === category.title).map(msg => (
                                    <div
                                        key={msg.id}
                                        className={`p-4 rounded-2xl flex items-start gap-3 group transition-all border
                                            ${theme === 'light'
                                                ? 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100'
                                                : 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20'}`}
                                    >
                                        <p className={`flex-1 text-sm leading-relaxed
                                            ${theme === 'light' ? 'text-emerald-800' : 'text-emerald-100'}`}>
                                            {msg.text}
                                        </p>
                                        <div className="flex gap-1 shrink-0">
                                            <button
                                                onClick={() => copyToClipboard(msg.text, msg.id)}
                                                className={`p-2 rounded-xl transition-all active:scale-95
                                                    ${copiedId === msg.id
                                                        ? 'bg-green-500/20 text-green-500'
                                                        : theme === 'light'
                                                            ? 'bg-white text-slate-400 hover:text-emerald-600 shadow-sm'
                                                            : 'bg-black/20 text-slate-400 hover:text-emerald-400'
                                                    }`}
                                                title="Kopyala"
                                            >
                                                {copiedId === msg.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteMessage(msg.id)}
                                                className={`p-2 rounded-xl transition-all active:scale-95
                                                    ${theme === 'light'
                                                        ? 'bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 shadow-sm'
                                                        : 'bg-black/20 text-slate-400 hover:text-red-400 hover:bg-red-500/10'
                                                    }`}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Sabit Mesajlar */}
                                {category.messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`p-4 rounded-2xl flex items-start gap-3 group transition-all
                                            ${theme === 'light'
                                                ? 'bg-slate-50 hover:bg-slate-100'
                                                : 'bg-black/20 hover:bg-black/30'}`}
                                    >
                                        <p className={`flex-1 text-sm leading-relaxed
                                            ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                                            {message.text}
                                        </p>
                                        <button
                                            onClick={() => copyToClipboard(message.text, message.id)}
                                            className={`shrink-0 p-2 rounded-xl transition-all active:scale-95
                                                ${copiedId === message.id
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : theme === 'light'
                                                        ? 'bg-white text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 shadow-sm'
                                                        : 'bg-white/[0.06] text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/20'
                                                }`}
                                            title="Kopyala"
                                        >
                                            {copiedId === message.id
                                                ? <Check className="w-4 h-4" />
                                                : <Copy className="w-4 h-4" />
                                            }
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExtrasView;
