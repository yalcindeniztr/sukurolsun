import React, { useState, useRef } from 'react';
import { ShieldCheck, ChevronDown } from 'lucide-react';

interface UserAgreementProps {
    onAccept: () => void;
}

const UserAgreement: React.FC<UserAgreementProps> = ({ onAccept }) => {
    const [accepted, setAccepted] = useState(false);
    const [scrolledToBottom, setScrolledToBottom] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 20) {
            setScrolledToBottom(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#f0fdf4] flex flex-col items-center justify-center p-6 select-none">
            {/* Dekoratif Arka Plan */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 right-10 w-72 h-72 rounded-full blur-[120px] bg-emerald-300/20" />
                <div className="absolute bottom-40 left-10 w-56 h-56 rounded-full blur-[100px] bg-amber-300/10" />
            </div>

            <div className="relative z-10 w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex p-4 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                        <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-slate-800">Şükür Olsun</h1>
                    <p className="text-sm text-slate-500 mt-1">Kullanım Koşulları ve Gizlilik</p>
                </div>

                {/* Sözleşme Metni */}
                <div className="bg-white rounded-3xl border border-emerald-100 shadow-lg overflow-hidden">
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="h-80 overflow-y-auto p-6 text-sm text-slate-600 leading-relaxed space-y-4"
                    >
                        <h2 className="text-lg font-bold text-slate-800">KULLANIM KOŞULLARI VE GİZLİLİK POLİTİKASI</h2>
                        <p className="text-xs text-slate-400">Son güncelleme: 24 Şubat 2026</p>

                        <h3 className="font-bold text-slate-700 mt-4">1. GENEL BİLGİ</h3>
                        <p>
                            "Şükür Olsun" uygulaması (bundan böyle "Uygulama"), kullanıcıların günlük şükür notları tutmalarını,
                            manevi içeriklerden faydalanmalarını sağlayan bir mobil uygulamadır. Uygulamayı kullanarak
                            bu koşulları kabul etmiş sayılırsınız.
                        </p>

                        <h3 className="font-bold text-slate-700">2. VERİ TOPLAMA VE GİZLİLİK</h3>
                        <p>
                            <strong>2.1.</strong> Uygulama, kişisel verilerinizi hiçbir sunucuya <strong>asla göndermez ve kaydetmez</strong>.
                            Tüm verileriniz (şükür notları, profil bilgileri, ayarlar, dualar) yalnızca kendi cihazınızın depolama alanında yerel (lokal) olarak saklanır.
                        </p>
                        <p>
                            <strong>2.2.</strong> Uygulama, kayıt olmanızı (e-posta, telefon numarası vb.) istemez ve sizi kişisel olarak tanımlayacak hiçbir bilgi toplamaz.
                        </p>
                        <p>
                            <strong>2.3.</strong> Uygulama varsayılan olarak sizden <strong>Konum veya Bildirim izni İSTEMEZ</strong>. Bu özellikler tamamen sizin kontrolünüzdedir ve isterseniz uygulama içindeki Profil ayarlarından kendiniz aktif edebilir veya istediğiniz an kapatabilirsiniz.
                        </p>
                        <p>
                            <strong>2.4.</strong> Tüm verilerinizi istediğiniz zaman Profil sayfasından tek bir dokunuşla kalıcı olarak silebilirsiniz. Silinen verilerin kurtarılması geliştirici tarafından mümkün değildir.
                        </p>

                        <h3 className="font-bold text-slate-700">3. REKLAMLAR</h3>
                        <p>
                            <strong>3.1.</strong> Uygulama, Google AdMob aracılığıyla reklam göstermektedir.
                            AdMob, cihaz bilgilerinizi (reklam kimliği, cihaz türü) kullanabilir.
                            Detaylı bilgi için <a href="https://policies.google.com/privacy" className="text-emerald-600 underline" target="_blank" rel="noopener noreferrer">Google Gizlilik Politikası</a>'nı inceleyebilirsiniz.
                        </p>

                        <h3 className="font-bold text-slate-700">4. FİKRİ MÜLKİYET</h3>
                        <p>
                            <strong>4.1.</strong> Uygulama içeriği, tasarımı ve kaynak kodu telif hakkıyla korunmaktadır.
                            İzinsiz kopyalanması, dağıtılması veya tersine mühendislik yapılması yasaktır.
                        </p>

                        <h3 className="font-bold text-slate-700">5. SORUMLULUK SINIRLAMASI VE FERAGATNAME</h3>
                        <p>
                            <strong>5.1.</strong> Uygulama "olduğu gibi" sunulmaktadır. Geliştirici, uygulamanın
                            kesintisiz veya hatasız çalışacağını, veya cihaz donanımlarıyla tam uyumlu olacağını garanti etmez.
                        </p>
                        <p>
                            <strong>5.2.</strong> <strong>Tüm verileriniz yalnızca sizin cihazınızda (lokalde) şifreli olarak tutulur.</strong> Uygulamanın silinmesi, cihazınızın arızalanması, güncellemeler sırasındaki hatalar veya işletim sisteminin önbellek temizlemesi sonucu oluşabilecek <strong>hiçbir veri kaybından geliştirici hukuki veya maddi olarak sorumlu tutulamaz.</strong> Verileri "Dışa Aktar" seçeneği ile düzenli olarak yedeklemek tamamen kullanıcının kendi sorumluluğundadır.
                        </p>
                        <p>
                            <strong>5.3.</strong> Uygulama içindeki dini içerikler (hadisler, dualar, namaz vakitleri) genel kaynaklardan
                            ve API'lerden (Aladhan vb.) derlenmiştir. Bu içeriklerin doğruluğu veya güncelliği konusunda geliştirici hiçbir şekilde mesuliyet kabul etmez, kullanıcı her zaman nihai teyidi kendi sağlamalıdır.
                        </p>

                        <h3 className="font-bold text-slate-700">6. KVKK UYUMU</h3>
                        <p>
                            <strong>6.1.</strong> 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında:
                            Uygulama kişisel veri işlememektedir. Tüm veriler yalnızca cihazınızda saklanır
                            ve hiçbir üçüncü tarafa aktarılmaz.
                        </p>

                        <h3 className="font-bold text-slate-700">7. DEĞİŞİKLİKLER</h3>
                        <p>
                            <strong>7.1.</strong> Bu koşullar önceden bildirilmeksizin güncellenebilir.
                            Güncellemeler uygulama içinden duyurulur. Uygulamayı kullanmaya devam etmeniz,
                            güncellenmiş koşulları kabul ettiğiniz anlamına gelir.
                        </p>

                        <h3 className="font-bold text-slate-700">8. İLETİŞİM</h3>
                        <p>
                            Sorularınız için: <strong>sukurolsun.app@gmail.com</strong>
                        </p>

                        <div className="h-4" />
                    </div>

                    {/* Scroll indicator */}
                    {!scrolledToBottom && (
                        <div className="flex justify-center py-2 bg-gradient-to-t from-white via-white/90 to-transparent -mt-8 relative z-10">
                            <ChevronDown className="w-5 h-5 text-slate-400 animate-bounce" />
                        </div>
                    )}
                </div>

                {/* Checkbox + Buton */}
                <div className="mt-6 space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:bg-emerald-50/50 group">
                        <input
                            type="checkbox"
                            checked={accepted}
                            onChange={(e) => setAccepted(e.target.checked)}
                            className="mt-1 w-6 h-6 rounded border-2 border-emerald-300 text-emerald-600 focus:ring-emerald-400 accent-emerald-500 shrink-0 cursor-pointer"
                        />
                        <span className="text-[13px] text-slate-600 leading-normal">
                            Kullanım koşullarını ve gizlilik politikasını okudum. Uygulamanın <strong>kapalı devre (lokal)</strong> çalıştığını, verilerimi hiçbir bulut sunucuya yedeklemediğini, bu nedenle cihaz arızası veya uygulama silinmesi durumunda oluşabilecek <strong>hiçbir veri kaybından geliştiriciyi sorumlu tutmayacağımı</strong>; konum ve bildirim izinlerinin tamamen kendi tercihim olduğunu kabul ediyorum. Geliştiriciyi her türlü <strong>teknik, hukuki ve maddi tazminat yükümlülüğünden kayıtsız şartsız muaf tuttuğumu</strong> beyan ederim.
                        </span>
                    </label>

                    <button
                        onClick={onAccept}
                        disabled={!accepted}
                        className={`w-full py-4 rounded-2xl text-center font-bold text-lg transition-all duration-300
              ${accepted
                                ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 active:scale-[0.98]'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        Devam Et
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserAgreement;
