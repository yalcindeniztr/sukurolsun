import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Sabit Türkçe ve İngilizce dil içerikleri (Uygulamanın statik verileri)
const resources = {
  tr: {
    translation: {
      "app.title": "Şükür Olsun",
      "app.subtitle": "Manaviyatınızı güçlendirin",
      "tab.home": "Ana Sayfa",
      "tab.archive": "Arşiv",
      "tab.messages": "Mesajlar",
      "tab.dua": "Dini Günler & Dualar",
      "tab.extras": "Namaz & Tesbihat",
      "tab.profile": "Profil",
      "tab.quran": "Kuran Meali",
      "tabs.prayerTimes": "Ezan Vakitleri",
      "tabs.sukurVakti": "Şükür Vakti",
      "tabs.tesbihat": "Tesbihat",
      "tabs.quran": "Kuran Meali",
      "tabs.banaHatirlat": "Bana Hatırlat",
      "tabs.maneviDuraklar": "Manevi Duraklar",
      "tabs.archive": "Şükür Arşivi",
      "tabs.profile": "Profil & Ayarlar",
      "home.greeting": "Bugün nasılsın, {{name}}?",
      "home.greeting_default": "Bugün nasılsın?",
      "action.save": "Kaydet",
      "action.cancel": "Vazgeç",
      "action.delete": "Sil",
      "action.edit": "Düzenle",
      "action.backup": "Veriyi Dışa Aktar",
      "action.restore": "Veriyi İçe Aktar",
      "profile.permissions": "İzinler",
      "profile.location": "Konum İzni",
      "profile.location_desc": "Namaz ve oruç vakitlerini konumunuza göre otomatik hesaplamak için kullanılır. Dilediğiniz zaman kapatabilirsiniz.",
      "profile.notifications": "Günlük Ayet Bildirimleri",
      "profile.notifications_desc": "Her gün saat 09:00'da size özel seçilmiş bir ayet gönderilir.",
      "profile.language": "Dil / Language",
      "profile.stats": "İstatistiklerim",
      "profile.streak": "Günlük İstikrar",
      "profile.total": "Toplam Şükür Notu",
      "profile.moods": "Ruh Hali Dağılımı",
      "settings.pin": "PIN Güvenlik",
      "settings.pin_cancel": "PIN'i Kaldır",
      "themes.title": "Arka Plan Teması",
      "themes.default": "Sade Zümrüt",
      "themes.kabe": "Kabe-i Muazzama",
      "themes.mescid": "Mescid-i Nebevi",
      "themes.nature": "Huzurlu Doğa",
      "themes.gold": "Altın Nur 3D",
      "themes.aksa": "Kudüs & Gece",
      "themes.rose": "Gül-i Muhammedî",
      "delete.warning": "Tüm Verilerimi Sil",
      "prayer.title": "Namaz ve Oruç Vakitleri",
      "prayer.auto": "Otomatik Konum Bul"
    }
  },
  en: {
    translation: {
      "app.title": "Sukur Olsun",
      "app.subtitle": "Strengthen your spirituality",
      "tab.home": "Home",
      "tab.archive": "Archive",
      "tab.messages": "Messages",
      "tab.dua": "Holy Days & Prayers",
      "tab.extras": "Prayers & Tasbih",
      "tab.profile": "Profile",
      "tab.quran": "Kuran Meali",
      "tabs.prayerTimes": "Prayer Times",
      "tabs.sukurVakti": "Time for Gratitude",
      "tabs.tesbihat": "Tasbihat",
      "tabs.quran": "Kuran Meali",
      "tabs.banaHatirlat": "Remind Me",
      "tabs.maneviDuraklar": "Spiritual Stops",
      "tabs.archive": "Gratitude Archive",
      "tabs.profile": "Profile & Settings",
      "home.greeting": "How are you today, {{name}}?",
      "home.greeting_default": "How are you today?",
      "action.save": "Save",
      "action.cancel": "Cancel",
      "action.delete": "Delete",
      "action.edit": "Edit",
      "action.backup": "Export Data",
      "action.restore": "Import Data",
      "profile.permissions": "Permissions",
      "profile.location": "Location Permission",
      "profile.location_desc": "Used to automatically calculate prayer and fasting times based on your location. You can disable it anytime.",
      "profile.notifications": "Daily Verse Notifications",
      "profile.notifications_desc": "A specially selected verse is sent to you every day at 09:00.",
      "profile.language": "Language",
      "profile.stats": "My Statistics",
      "profile.streak": "Daily Streak",
      "profile.total": "Total Gratitude Notes",
      "profile.moods": "Mood Distribution",
      "settings.pin": "PIN Security",
      "settings.pin_cancel": "Remove PIN",
      "themes.title": "Background Theme",
      "themes.default": "Simple Emerald",
      "themes.kabe": "Holy Kaaba",
      "themes.mescid": "Al-Masjid an-Nabawi",
      "themes.nature": "Peaceful Nature",
      "themes.gold": "Golden Radiance 3D",
      "themes.aksa": "Al-Aqsa & Night",
      "themes.rose": "Rose of Prophet",
      "delete.warning": "Delete All My Data",
      "prayer.title": "Prayer and Fasting Times",
      "prayer.auto": "Find Location Automatically"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'tr', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  });

export default i18n;
