import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Bell, Clock } from 'lucide-react';
import { useTheme } from '../../core/ThemeContext';

interface Reminder {
  id: string;
  name: string;
  date: string;
  time: string;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
  enabled: boolean;
}

const BanaHatirlatView: React.FC = () => {
  const { theme } = useTheme();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    repeat: 'none' as 'none' | 'daily' | 'weekly' | 'monthly',
    enabled: true,
  });

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = () => {
    const stored = localStorage.getItem('bana_hatirlat_reminders');
    if (stored) {
      setReminders(JSON.parse(stored));
    }
  };

  const saveReminders = (newReminders: Reminder[]) => {
    localStorage.setItem('bana_hatirlat_reminders', JSON.stringify(newReminders));
    setReminders(newReminders);
  };

  const handleAdd = () => {
    if (!formData.name.trim()) return;
    const newReminder: Reminder = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      name: formData.name.trim(),
      date: formData.date,
      time: formData.time,
      repeat: formData.repeat,
      enabled: formData.enabled,
    };
    saveReminders([newReminder, ...reminders]);
    resetForm();
  };

  const handleUpdate = () => {
    if (!formData.name.trim() || !editingId) return;
    const updated = reminders.map(r =>
      r.id === editingId
        ? { ...r, name: formData.name.trim(), date: formData.date, time: formData.time, repeat: formData.repeat, enabled: formData.enabled }
        : r
    );
    saveReminders(updated);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu hatırlatıcıyı silmek istediğinize emin misiniz?')) {
      saveReminders(reminders.filter(r => r.id !== id));
    }
  };

  const toggleEnabled = (id: string) => {
    const updated = reminders.map(r =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    saveReminders(updated);
  };

  const startEdit = (reminder: Reminder) => {
    setEditingId(reminder.id);
    setFormData({
      name: reminder.name,
      date: reminder.date,
      time: reminder.time,
      repeat: reminder.repeat,
      enabled: reminder.enabled,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', date: '', time: '', repeat: 'none', enabled: true });
    setShowForm(false);
    setEditingId(null);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getRepeatLabel = (repeat: string) => {
    switch (repeat) {
      case 'daily': return 'Her gün';
      case 'weekly': return 'Her hafta';
      case 'monthly': return 'Her ay';
      default: return 'Tek seferlik';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-24">
      {/* Başlık */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4
          ${theme === 'light' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
          <Bell className="w-5 h-5" />
          <span className="font-bold text-sm">Bana Hatırlat</span>
        </div>
        <h2 className={`text-2xl font-serif font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
          Kişisel Hatırlatıcılar
        </h2>
        <p className={`text-sm mt-2 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
          İsim, gün, saat veya saatler ekleyerek kendiniz için hatırlatma kurabilirsiniz
        </p>
      </div>

      {/* Ekleme Butonu */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all active:scale-[0.98]
            ${theme === 'light'
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
        >
          <Plus className="w-5 h-5" />
          Yeni Hatırlatıcı Ekle
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className={`p-5 rounded-3xl border animate-fadeIn
          ${theme === 'light' ? 'bg-white/80 border-slate-200/60 shadow-sm' : 'bg-white/[0.03] border-white/5'}`}>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                Hatırlatıcı Adı
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Örn: İftar vakti, Meeting, Doğum günü..."
                className={`w-full p-3 rounded-xl border transition-all text-sm
                  ${theme === 'light'
                    ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'bg-black/20 border-white/10 text-white focus:border-emerald-500'}`}
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                  Tarih (Opsiyonel)
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`w-full p-3 rounded-xl border transition-all text-sm
                    ${theme === 'light'
                      ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'bg-black/20 border-white/10 text-white focus:border-emerald-500'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                  Saat
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className={`w-full p-3 rounded-xl border transition-all text-sm
                    ${theme === 'light'
                      ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'bg-black/20 border-white/10 text-white focus:border-emerald-500'}`}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                Tekrar
              </label>
              <select
                value={formData.repeat}
                onChange={(e) => setFormData({ ...formData, repeat: e.target.value as any })}
                className={`w-full p-3 rounded-xl border transition-all text-sm
                  ${theme === 'light'
                    ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'bg-black/20 border-white/10 text-white focus:border-emerald-500'}`}
              >
                <option value="none">Tek seferlik</option>
                <option value="daily">Her gün</option>
                <option value="weekly">Her hafta</option>
                <option value="monthly">Her ay</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
              />
              <label className={`text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                Bildirim etkin
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={resetForm}
              className={`flex-1 py-3 rounded-xl font-bold transition-all
                ${theme === 'light' ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <X className="w-5 h-5 inline mr-2" />
              İptal
            </button>
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              disabled={!formData.name.trim()}
              className={`flex-1 py-3 rounded-xl font-bold transition-all
                ${formData.name.trim()
                  ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg'
                  : 'bg-slate-200 text-slate-400'}`}
            >
              <Save className="w-5 h-5 inline mr-2" />
              {editingId ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </div>
      )}

      {/* Hatırlatıcı Listesi */}
      <div className="space-y-3">
        {reminders.length === 0 ? (
          <div className={`text-center py-12 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Henüz hatırlatıcı eklenmedi</p>
          </div>
        ) : (
          reminders.map(reminder => (
            <div
              key={reminder.id}
              className={`p-4 rounded-2xl border transition-all
                ${reminder.enabled
                  ? theme === 'light'
                    ? 'bg-white border-emerald-200 shadow-sm'
                    : 'bg-emerald-500/5 border-emerald-500/20'
                  : theme === 'light'
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-white/[0.02] border-white/5'
                }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className={`font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                    {reminder.name}
                  </h3>
                  <div className={`text-sm mt-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    {reminder.date && <span>{formatDate(reminder.date)} • </span>}
                    {reminder.time && <span>{reminder.time}</span>}
                    {reminder.repeat !== 'none' && (
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold
                        ${theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/20 text-blue-300'}`}>
                        {getRepeatLabel(reminder.repeat)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleEnabled(reminder.id)}
                    className={`p-2 rounded-full transition-all ${
                      reminder.enabled
                        ? 'bg-emerald-500 text-white'
                        : theme === 'light'
                          ? 'bg-slate-200 text-slate-400'
                          : 'bg-white/10 text-slate-400'
                    }`}
                    title={reminder.enabled ? 'Bildirim Açık' : 'Bildirim Kapalı'}
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => startEdit(reminder)}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'light' ? 'text-slate-400 hover:text-blue-500' : 'text-slate-500 hover:text-blue-400'
                    }`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(reminder.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'light' ? 'text-slate-400 hover:text-red-500' : 'text-slate-500 hover:text-red-400'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BanaHatirlatView;