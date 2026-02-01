<div# Şükür Olsun - Manevi Günlük Uygulaması

Modern, güvenli ve estetik bir şükür günlüğü uygulaması.

## 🌟 Özellikler

*   **Premium Arayüz:** Glassmorphism tasarımı, yumuşak geçişler ve antrasit/teal/altın renk paleti.
*   **Günün Ayeti:** Her gün değişen, özel tasarımlı ayet kartları.
*   **Günlük Tutma:** Ruh hali seçimi ve detaylı metin girişi ile şükürlerinizi kaydedin.
*   **Geçmiş ve Düzenleme:** Eski kayıtlarınızı görüntüleyin, düzenleyin veya silin.
*   **Gizlilik:** Tüm verileriniz tarayıcınızda (Local Storage) güvenle saklanır.

## 🛠️ Teknoloji Yığını

*   **Frontend:** React, TypeScript, Vite
*   **Styling:** Tailwind CSS (Custom Config)
*   **Icons:** Lucide React
*   **Build:** Vite + TSC

## 📂 Proje Yapısı

```
src/
├── core/           # Temel tipler ve statik veriler (types.ts, verses.ts)
├── features/       # Özellik bazlı bileşenler (journal/...)
├── components/     # Genel UI bileşenleri (layout/...)
├── services/       # İş mantığı ve veri yönetimi (storage.service.ts)
└── lib/            # Yardımcı kütüphaneler
```

## 🚀 Kurulum

1.  Bağımlılıkları yükleyin: `npm install`
2.  Geliştirme sunucusunu başlatın: `npm run dev`
3.  Derleme: `npm run build`
   `npm run dev`
