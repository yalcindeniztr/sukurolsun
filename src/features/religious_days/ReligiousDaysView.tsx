import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, ChevronDown, ChevronUp, Check, Copy, BookOpen } from 'lucide-react';
import { useTheme } from '../../core/ThemeContext';
import { storageService } from '../../services/storage.service';
import { ReligiousDay, ReligiousDayItem } from '../../core/types';
import ReligiousDaysPrayersView from './ReligiousDaysPrayersView';

const ReligiousDaysView: React.FC = () => {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<'myDays' | 'guide'>('myDays');
    const [days, setDays] = useState<ReligiousDay[]>([]);
    const [items, setItems] = useState<ReligiousDayItem[]>([]);
    const [expandedDay, setExpandedDay] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Yeni Gün Ekleme Formu
    const [showAddDay, setShowAddDay] = useState(false);
    const [newDayTitle, setNewDayTitle] = useState('');
    const [newDayDate, setNewDayDate] = useState('');

    // Yeni İtem Ekleme Formu
    const [newItemText, setNewItemText] = useState('');
    const [newItemType, setNewItemType] = useState<'dua' | 'mesaj'>('dua');

    useEffect(() => {
        const loadData = async () => {
            const [loadedDays, loadedItems] = await Promise.all([
                storageService.getReligiousDays(),
                storageService.getReligiousDayItems()
            ]);
            setDays(loadedDays);
            setItems(loadedItems);
        };
        loadData();
    }, []);

    const handleAddDay = async () => {
        if (!newDayTitle.trim()) return;
        const formattedDate = newDayDate ? new Date(newDayDate).toLocaleDateString('tr-TR') : undefined;
        const updated = await storageService.addReligiousDay(newDayTitle.trim(), formattedDate);
        setDays(updated);
        setNewDayTitle('');
        setNewDayDate('');
        setShowAddDay(false);
    };

    const handleDeleteDay = async (id: string) => {
        if (window.confirm('Bu dini günü ve altındaki tüm mesajları silmek istediğinize emin misiniz?')) {
            const updated = await storageService.deleteReligiousDay(id);
            setDays(updated);
            const remainingItems = await storageService.getReligiousDayItems();
            setItems(remainingItems);
        }
    };

    const handleAddItem = async (dayId: string) => {
        if (!newItemText.trim()) return;
        const updated = await storageService.addReligiousDayItem(dayId, newItemType, newItemText.trim());
        setItems(updated);
        setNewItemText('');
    };

    const handleDeleteItem = async (id: string) => {
        if (window.confirm('Bu içeriği silmek istediğinize emin misiniz?')) {
            const updated = await storageService.deleteReligiousDayItem(id);
            setItems(updated);
        }
    };

    const copyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            // Kopyalama desteklenmiyor
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-24">
            {/* Header / Tabs */}
            <div className="text-center mb-6">
                <div className={`p-1 inline-flex rounded-2xl mb-6
                    ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}>
                    <button
                        onClick={() => setActiveTab('myDays')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all
                            ${activeTab === 'myDays'
                                ? (theme === 'light' ? 'bg-white text-indigo-600 shadow-sm' : 'bg-slate-700 text-indigo-400 shadow-sm')
                                : (theme === 'light' ? 'text-slate-500' : 'text-slate-400')}`}
                    >
                        Takvim & Günler
                    </button>
                    <button
                        onClick={() => setActiveTab('guide')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all
                            ${activeTab === 'guide'
                                ? (theme === 'light' ? 'bg-white text-indigo-600 shadow-sm' : 'bg-slate-700 text-indigo-400 shadow-sm')
                                : (theme === 'light' ? 'text-slate-500' : 'text-slate-400')}`}
                    >
                        <BookOpen className="w-4 h-4" />
                        Dua Rehberi
                    </button>
                </div>
            </div>

            {activeTab === 'guide' ? (
                <ReligiousDaysPrayersView />
            ) : (
                <div className="space-y-6 animate-fadeIn">
                    <div className="text-center mb-8">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4
                            ${theme === 'light' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                            <Calendar className="w-5 h-5" />
                            <span className="font-bold text-sm">Dini Günler</span>
                        </div>
                        <h2 className={`text-2xl font-serif font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                            Özel Dini Günler ve Kandiller
                        </h2>
                        <p className={`text-sm mt-2 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                            Kendinize özel dini günler oluşturun ve dualarınızı kaydedin.
                        </p>
                    </div>

                    {/* Yeni Gün Ekleme Kartı */}
                    <div className={`rounded-3xl border transition-all duration-300 p-5
                ${theme === 'light'
                            ? 'bg-white/80 border-indigo-200/60 shadow-sm'
                            : 'bg-white/[0.03] border-indigo-500/20'}`}>

                        <div className="flex items-center justify-between mb-4">
                            <span className={`font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                                Takvim & Günler ({days.length})
                            </span>
                            <button
                                onClick={() => setShowAddDay(!showAddDay)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all
                            ${theme === 'light'
                                        ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                        : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20'}`}
                            >
                                <Plus className="w-4 h-4" /> Ekle
                            </button>
                        </div>

                        {showAddDay && (
                            <div className="space-y-3 animate-fadeIn mb-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5">
                                <input
                                    type="text"
                                    placeholder="Dinin Günün Adı (Örn: Kadir Gecesi 2024)"
                                    value={newDayTitle}
                                    onChange={(e) => setNewDayTitle(e.target.value)}
                                    className={`w-full p-3 rounded-xl border transition-all ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-black/20 border-white/10 text-white'}`}
                                />
                                <input
                                    type="date"
                                    value={newDayDate}
                                    onChange={(e) => setNewDayDate(e.target.value)}
                                    className={`w-full p-3 rounded-xl border transition-all ${theme === 'light' ? 'bg-white border-slate-200 text-slate-700' : 'bg-black/20 border-white/10 text-slate-200'}`}
                                />
                                <button
                                    onClick={handleAddDay}
                                    disabled={!newDayTitle.trim()}
                                    className={`w-full py-3 rounded-xl font-bold transition-all
                                ${newDayTitle.trim()
                                            ? 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-sm'
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed hidden'}`}
                                >
                                    Günü Kaydet
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Günler Listesi */}
                    <div className="space-y-3">
                        {days.map((day) => (
                            <div
                                key={day.id}
                                className={`rounded-3xl overflow-hidden transition-all duration-300 border
                            ${theme === 'light'
                                        ? 'bg-white/80 border-slate-200/60 shadow-sm hover:shadow-md'
                                        : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'}`}
                            >
                                {/* Başlık Çubuğu */}
                                <div className={`w-full flex items-center justify-between p-5 transition-colors
                                ${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-white/[0.03]'}`}>
                                    <button
                                        onClick={() => setExpandedDay(expandedDay === day.id ? null : day.id)}
                                        className="flex-1 flex items-center gap-3 text-left"
                                    >
                                        <span className={`font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                                            {day.title}
                                        </span>
                                        {day.date && (
                                            <span className={`text-xs px-2.5 py-1 rounded-full
                                        ${theme === 'light' ? 'bg-slate-100 text-slate-500' : 'bg-white/[0.06] text-slate-400'}`}>
                                                {day.date}
                                            </span>
                                        )}
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold
                                    ${theme === 'light' ? 'bg-indigo-50 text-indigo-500' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                            {items.filter(i => i.dayId === day.id).length} içerik
                                        </span>
                                        {expandedDay === day.id
                                            ? <ChevronUp className={`w-5 h-5 ml-auto ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`} />
                                            : <ChevronDown className={`w-5 h-5 ml-auto ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`} />
                                        }
                                    </button>
                                    <button
                                        onClick={() => handleDeleteDay(day.id)}
                                        className="ml-3 p-2 rounded-xl text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* İçerik (Dualar/Mesajlar) */}
                                {expandedDay === day.id && (
                                    <div className="p-4 pt-0 space-y-3 animate-fadeIn border-t border-slate-100 dark:border-white/5">
                                        {/* Yeni İtem Formu */}
                                        <div className="p-3 my-3 rounded-2xl bg-black/5 dark:bg-white/5 space-y-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setNewItemType('dua')}
                                                    className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${newItemType === 'dua' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/20 text-slate-500'}`}
                                                >
                                                    Dua Yaz
                                                </button>
                                                <button
                                                    onClick={() => setNewItemType('mesaj')}
                                                    className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${newItemType === 'mesaj' ? 'bg-indigo-500 text-white' : 'bg-white/50 dark:bg-black/20 text-slate-500'}`}
                                                >
                                                    Mesaj Ekle
                                                </button>
                                            </div>
                                            <div className="flex gap-2">
                                                <textarea
                                                    value={newItemText}
                                                    onChange={(e) => setNewItemText(e.target.value)}
                                                    placeholder={`${newItemType === 'dua' ? 'Özel duanızı yazın...' : 'Göndermek üzere mesaj yazın...'}`}
                                                    rows={2}
                                                    className={`flex-1 resize-none p-3 rounded-xl border transition-all ${theme === 'light' ? 'bg-white border-slate-200 text-slate-800' : 'bg-black/20 border-white/10 text-white'}`}
                                                />
                                                <button
                                                    onClick={() => handleAddItem(day.id)}
                                                    disabled={!newItemText.trim()}
                                                    className={`px-4 py-2 rounded-xl font-bold transition-all flex h-auto items-center justify-center
                                                ${newItemText.trim()
                                                            ? 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-sm'
                                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* İtem Listesi */}
                                        {items.filter(i => i.dayId === day.id).map((item) => (
                                            <div
                                                key={item.id}
                                                className={`p-4 rounded-2xl flex items-start gap-3 group transition-all border
                                            ${theme === 'light'
                                                        ? 'bg-white border-slate-100'
                                                        : 'bg-black/20 border-white/5'}`}
                                            >
                                                <div className="flex-1">
                                                    <span className={`inline-block mb-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${theme === 'light' ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-500/20 text-indigo-400'}`}>
                                                        {item.type === 'dua' ? 'Dua' : 'Mesaj'}
                                                    </span>
                                                    <p className={`text-sm leading-relaxed
                                                ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                                                        {item.text}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col gap-1 shrink-0">
                                                    <button
                                                        onClick={() => copyToClipboard(item.text, item.id)}
                                                        className={`p-2 rounded-xl transition-all active:scale-95
                                                    ${copiedId === item.id
                                                                ? 'bg-green-500/20 text-green-500'
                                                                : theme === 'light'
                                                                    ? 'bg-slate-50 text-slate-400 hover:text-indigo-600 shadow-sm'
                                                                    : 'bg-white/5 text-slate-400 hover:text-indigo-400'
                                                            }`}
                                                    >
                                                        {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem(item.id)}
                                                        className={`p-2 rounded-xl transition-all active:scale-95
                                                    ${theme === 'light'
                                                                ? 'bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 shadow-sm'
                                                                : 'bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10'
                                                            }`}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {days.length === 0 && (
                            <div className="p-6 text-center">
                                <p className={`text-sm ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Henüz özel bir gün eklemediniz. Yukarıdaki 'Ekle' butonuyla başlayın.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReligiousDaysView;
