import React, { useEffect, useMemo, useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { MessageCircle, Search, Send, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../../core/ThemeContext';
import { READY_MESSAGE_CATEGORIES } from './readyMessagesData';

const CUSTOM_READY_MESSAGES_KEY = 'custom_ready_messages';

const ReadyMessagesView: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [openCategoryId, setOpenCategoryId] = useState(READY_MESSAGE_CATEGORIES[0]?.id || '');
  const [customMessages, setCustomMessages] = useState<Record<string, string[]>>({});
  const [newMessageCategoryId, setNewMessageCategoryId] = useState(READY_MESSAGE_CATEGORIES[0]?.id || '');
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const loadCustomMessages = async () => {
      const { value } = await Preferences.get({ key: CUSTOM_READY_MESSAGES_KEY });
      if (!value) return;
      try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          setCustomMessages(parsed);
        }
      } catch {
        setCustomMessages({});
      }
    };

    loadCustomMessages();
  }, []);

  const categoriesWithCustomMessages = useMemo(() => {
    return READY_MESSAGE_CATEGORIES.map((category) => ({
      ...category,
      messages: [...category.messages, ...(customMessages[category.id] || [])]
    }));
  }, [customMessages]);

  const filteredCategories = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase('tr-TR');
    if (!query) return categoriesWithCustomMessages;

    return categoriesWithCustomMessages
      .map((category) => ({
        ...category,
        messages: category.messages.filter((message) =>
          message.toLocaleLowerCase('tr-TR').includes(query) ||
          category.title.toLocaleLowerCase('tr-TR').includes(query)
        )
      }))
      .filter((category) => category.messages.length > 0);
  }, [categoriesWithCustomMessages, searchTerm]);

  const saveCustomMessages = async (nextMessages: Record<string, string[]>) => {
    setCustomMessages(nextMessages);
    await Preferences.set({ key: CUSTOM_READY_MESSAGES_KEY, value: JSON.stringify(nextMessages) });
  };

  const handleAddMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    const cleanMessage = newMessage.trim();
    if (!cleanMessage) return;

    const nextMessages = {
      ...customMessages,
      [newMessageCategoryId]: [...(customMessages[newMessageCategoryId] || []), cleanMessage]
    };

    await saveCustomMessages(nextMessages);
    setNewMessage('');
    setOpenCategoryId(newMessageCategoryId);
  };

  const handleDeleteCustomMessage = async (categoryId: string, message: string) => {
    const nextCategoryMessages = (customMessages[categoryId] || []).filter((item) => item !== message);
    const nextMessages = { ...customMessages, [categoryId]: nextCategoryMessages };
    if (nextCategoryMessages.length === 0) delete nextMessages[categoryId];
    await saveCustomMessages(nextMessages);
  };

  const sendViaWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const appUrl = `whatsapp://send?text=${encodedMessage}`;
    const webUrl = `https://wa.me/?text=${encodedMessage}`;

    window.location.href = appUrl;
    window.setTimeout(() => {
      window.open(webUrl, '_blank');
    }, 700);
  };

  return (
    <div className="space-y-5 animate-fade-in pb-28">
      <div className={`rounded-3xl p-5 border overflow-hidden relative
        ${theme === 'light' ? 'bg-white/85 border-emerald-100 shadow-sm' : 'bg-slate-900/60 border-white/10'}`}
      >
        <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-emerald-500/10" />
        <div className="relative z-10 flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
            <MessageCircle className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="min-w-0">
            <h2 className={`text-2xl font-serif font-black ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
              Hazır Mesajlar
            </h2>
            <p className={`mt-1 text-sm leading-relaxed ${theme === 'light' ? 'text-slate-500' : 'text-slate-300'}`}>
              Dini günler, kandiller ve bayramlar için WhatsApp ile gönderebileceğiniz hazır mesajlar.
            </p>
          </div>
        </div>

        <div className="relative mt-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Başlık veya mesaj ara..."
            className={`w-full h-12 rounded-2xl border pl-11 pr-4 text-sm font-medium outline-none
              ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-white/5 border-white/10 text-white'}`}
          />
        </div>
      </div>

      <form
        onSubmit={handleAddMessage}
        className={`rounded-3xl p-4 border space-y-3
          ${theme === 'light' ? 'bg-white/85 border-emerald-100 shadow-sm' : 'bg-slate-900/60 border-white/10'}`}
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Plus className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h3 className={`text-sm font-black ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
              Kendi Mesajını Ekle
            </h3>
            <p className="text-xs text-slate-500">Mesajın seçtiğin başlığın altında saklanır.</p>
          </div>
        </div>

        <select
          value={newMessageCategoryId}
          onChange={(event) => setNewMessageCategoryId(event.target.value)}
          className={`w-full h-11 rounded-2xl border px-3 text-sm font-bold outline-none
            ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-white/5 border-white/10 text-white'}`}
          title="Mesaj başlığı seç"
        >
          {READY_MESSAGE_CATEGORIES.map((category) => (
            <option key={category.id} value={category.id}>{category.title}</option>
          ))}
        </select>

        <textarea
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          placeholder="Göndermek istediğin hazır mesajı yaz..."
          className={`w-full min-h-[110px] rounded-2xl border p-3 text-sm leading-relaxed outline-none resize-none
            ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400' : 'bg-white/5 border-white/10 text-white placeholder:text-slate-500'}`}
        />

        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="w-full h-11 rounded-2xl bg-emerald-500 text-white text-sm font-black flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Mesajı Ekle
        </button>
      </form>

      <div className="space-y-3">
        {filteredCategories.map((category) => {
          const isOpen = openCategoryId === category.id;
          return (
            <section
              key={category.id}
              className={`rounded-3xl border overflow-hidden
                ${theme === 'light' ? 'bg-white/85 border-slate-100 shadow-sm' : 'bg-slate-900/50 border-white/10'}`}
            >
              <button
                onClick={() => setOpenCategoryId(isOpen ? '' : category.id)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left active:scale-[0.99] transition-all"
              >
                <div className="min-w-0">
                  <h3 className={`text-lg font-black ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                    {category.title}
                  </h3>
                  <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                    {category.description} · {category.messages.length} mesaj
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-3">
                  {category.messages.map((message, index) => {
                    const isCustomMessage = (customMessages[category.id] || []).includes(message);
                    return (
                    <article
                      key={`${category.id}-${index}`}
                      className={`rounded-2xl p-4 border
                        ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-black/20 border-white/5'}`}
                    >
                      <p className={`text-sm leading-relaxed whitespace-pre-wrap ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                        {message}
                      </p>
                      <div className="mt-3 flex justify-end gap-2">
                        {isCustomMessage && (
                          <button
                            onClick={() => handleDeleteCustomMessage(category.id, message)}
                            className="h-10 w-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center active:scale-95 transition-all"
                            title="Mesajı sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => sendViaWhatsApp(message)}
                          className="h-10 px-4 rounded-xl bg-emerald-500 text-white text-sm font-black flex items-center gap-2 active:scale-95 transition-all"
                        >
                          <Send className="w-4 h-4" />
                          Gönder
                        </button>
                      </div>
                    </article>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-16 opacity-60">
          <Search className="w-10 h-10 mx-auto mb-3" />
          <p className="text-sm">Aradığınız mesaja uygun sonuç bulunamadı.</p>
        </div>
      )}
    </div>
  );
};

export default ReadyMessagesView;
