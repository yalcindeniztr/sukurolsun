import React, { useState, useEffect, useCallback } from 'react';
import { Gift, ChevronDown, ChevronUp, Copy, Check, Plus, Trash2, Edit2, Save, X, FolderPlus } from 'lucide-react';
import { useTheme } from '../../core/ThemeContext';
import { RELIGIOUS_MESSAGES } from './religiousMessages';
import { storageService } from '../../services/storage.service';
import { UserMessage } from '../../core/types';

const ExtrasView: React.FC = () => {
    const { theme } = useTheme();
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [userMessages, setUserMessages] = useState<UserMessage[]>([]);
    const [newMessageText, setNewMessageText] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');
    
    // Kategori yönetimi
    const [customCategories, setCustomCategories] = useState<string[]>([]);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        const loadMessages = async () => {
            const msgs = await storageService.getUserMessages();
            setUserMessages(msgs);
            
            // Mevcut kategorileri topla
            const cats = Array.from(new Set(msgs.map(m => m.category).filter(Boolean))) as string[];
            setCustomCategories(cats);
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

    const handleUpdateMessage = useCallback(async (id: string) => {
        if (!editText.trim()) return;
        const current = await storageService.getUserMessages();
        const updated = current.map(m => m.id === id ? { ...m, text: editText.trim() } : m);
        // Doğrudan storage.set kullanarak güncelliyoruz (servis metodunu genişletmek yerine)
        await (storageService as any).saveUserMessages(updated); 
        setUserMessages(updated);
        setEditingId(null);
    }, [editText]);

    const handleDeleteMessage = useCallback(async (id: string) => {
        if (window.confirm('Bu mesajı silmek istediğinden emin misin?')) {
            const updated = await storageService.deleteUserMessage(id);
            setUserMessages(updated);
        }
    }, []);

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;
        if (!customCategories.includes(newCategoryName.trim())) {
            setCustomCategories(prev => [...prev, newCategoryName.trim()]);
        }
        setNewCategoryName('');
        setShowAddCategory(false);
    };

    const startEditing = (msg: UserMessage) => {
        setEditingId(msg.id);
        setEditText(msg.text);
    };

    // Tüm kategorileri birleştir (Statik + Özel)
    const allCategories = [
        ...RELIGIOUS_MESSAGES.map(c => ({ ...c, isCustom: false })),
        ...customCategories.filter(name => !RELIGIOUS_MESSAGES.find(c => c.title === name))
            .map(name => ({
                id: `custom_${name}`,
                title: name,
                emoji: '✨',
                messages: [],
                isCustom: true
            }))
    ];

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
                    Mesajları kopyalayıp paylaşabilir veya kendinizinkini ekleyebilirsiniz
                </p>
            </div>

            {/* Kategori Ekleme */}
            <div className="flex justify-end px-2">
                {showAddCategory ? (
                    <div className="flex gap-2 w-full animate-fadeIn">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Yeni kategori adı..."
                            className={`flex-1 p-3 rounded-xl border transition-all text-sm
                                ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10 text-white'}`}
                            autoFocus
                        />
                        <button onClick={handleAddCategory} className="p-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-400"><Check className="w-5 h-5" /></button>
                        <button onClick={() => setShowAddCategory(false)} className="p-3 rounded-xl bg-slate-500 text-white hover:bg-slate-400"><X className="w-5 h-5" /></button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowAddCategory(true)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all active:scale-95
                            ${theme === 'light' ? 'bg-white text-emerald-600 border border-emerald-100 shadow-sm' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}
                    >
                        <FolderPlus className="w-5 h-5" />
                        Yeni Kategori Ekle
                    </button>
                )}
            </div>

            {/* Kategori Listesi */}
            <div className="space-y-3">
                {allCategories.map((category) => (
                    <div
                        key={category.id}
                        className={`rounded-3xl overflow-hidden transition-all duration-300 border
                            ${theme === 'light'
                                ? 'bg-white/80 border-slate-200/60 shadow-sm hover:shadow-md'
                                : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'}`}
                    >
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
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider
                                    ${theme === 'light' ? 'bg-slate-100 text-slate-500' : 'bg-white/[0.06] text-slate-400'}`}>
                                    {(category.messages.length + userMessages.filter(m => m.category === category.title).length)} Mesaj
                                </span>
                            </div>
                            {expandedCategory === category.id ? <ChevronUp className="w-5 h-5 opacity-50" /> : <ChevronDown className="w-5 h-5 opacity-50" />}
                        </button>

                        {expandedCategory === category.id && (
                            <div className="p-4 pt-0 space-y-3 animate-fadeIn">
                                {/* Yeni Mesaj Ekleme */}
                                <div className="flex gap-2">
                                    <textarea
                                        value={newMessageText}
                                        onChange={(e) => setNewMessageText(e.target.value)}
                                        placeholder={`${category.title} için mesaj ekleyin...`}
                                        rows={1}
                                        className={`flex-1 resize-none p-3 rounded-xl border transition-all text-sm
                                            ${theme === 'light' ? 'bg-white border-slate-200 text-slate-800' : 'bg-black/20 border-white/10 text-white'}`}
                                    />
                                    <button
                                        onClick={() => handleAddMessage(category.title)}
                                        disabled={!newMessageText.trim()}
                                        className={`px-4 py-2 rounded-xl font-bold transition-all
                                            ${newMessageText.trim() ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-200 text-slate-400 hidden'}`}
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Kullanıcı Mesajları */}
                                {userMessages.filter(m => m.category === category.title).map(msg => (
                                    <div
                                        key={msg.id}
                                        className={`p-4 rounded-2xl flex items-start gap-3 border
                                            ${theme === 'light' ? 'bg-emerald-50 border-emerald-100' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                                    >
                                        {editingId === msg.id ? (
                                            <div className="flex-1 space-y-2">
                                                <textarea
                                                    value={editText}
                                                    onChange={(e) => setEditText(e.target.value)}
                                                    className="w-full p-2 rounded-lg bg-white border border-emerald-300 text-sm"
                                                    rows={3}
                                                />
                                                <div className="flex justify-end gap-2 text-xs">
                                                    <button onClick={() => setEditingId(null)} className="flex items-center gap-1 text-slate-500 font-bold"><X className="w-3 h-3"/> İptal</button>
                                                    <button onClick={() => handleUpdateMessage(msg.id)} className="flex items-center gap-1 text-emerald-600 font-bold"><Save className="w-3 h-3"/> Kaydet</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p className={`flex-1 text-sm leading-relaxed ${theme === 'light' ? 'text-emerald-800' : 'text-emerald-100'}`}>
                                                    {msg.text}
                                                </p>
                                                <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => copyToClipboard(msg.text, msg.id)} className="p-2 text-slate-400 hover:text-emerald-600"><Copy className="w-4 h-4"/></button>
                                                    <button onClick={() => startEditing(msg)} className="p-2 text-slate-400 hover:text-blue-500"><Edit2 className="w-4 h-4"/></button>
                                                    <button onClick={() => handleDeleteMessage(msg.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                                                </div>
                                                {/* Mobile visible actions */}
                                                <div className="md:hidden flex gap-1 shrink-0">
                                                    <button onClick={() => copyToClipboard(msg.text, msg.id)} className={`p-2 rounded-lg ${copiedId === msg.id ? 'bg-green-500 text-white' : 'bg-white shadow-sm text-slate-400'}`}>{copiedId === msg.id ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}</button>
                                                    <button onClick={() => startEditing(msg)} className="p-2 bg-white shadow-sm rounded-lg text-slate-400"><Edit2 className="w-4 h-4"/></button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}

                                {/* Statik Mesajlar */}
                                {category.messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`p-4 rounded-2xl flex items-start gap-3 transition-colors group
                                            ${theme === 'light' ? 'bg-slate-50 hover:bg-slate-100' : 'bg-black/20 hover:bg-black/30'}`}
                                    >
                                        <p className={`flex-1 text-sm leading-relaxed ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                                            {message.text}
                                        </p>
                                        <button
                                            onClick={() => copyToClipboard(message.text, message.id)}
                                            className={`shrink-0 p-2 rounded-xl transition-all
                                                ${copiedId === message.id ? 'bg-green-500/20 text-green-400' : 'text-slate-400 hover:text-emerald-500'}`}
                                        >
                                            {copiedId === message.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
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
