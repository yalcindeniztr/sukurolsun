

// Bu liste 365 gün için genişletilebilir.
// Şimdilik döngüsel kullanım için zengin bir başlangıç seti sunuyoruz.
export interface Verse {
    text: string;
    source: string;
}

export const ANNUAL_VERSES: Verse[] = [
    { text: "Şükrederseniz, andolsun ki size (nimetimi) artırırım.", source: "İbrahim Suresi, 7" },
    { text: "O, hanginizin daha güzel amel yapacağını sınamak için ölümü ve hayatı yaratandır.", source: "Mülk Suresi, 2" },
    { text: "Rabbinin nimetine gelince; işte onu anlat da anlat.", source: "Duha Suresi, 11" },
    { text: "Sabredenlere, mükafatları hesapsız ödenecektir.", source: "Zümer Suresi, 10" },
    { text: "Allah, şükredenleri mükafatlandıracaktır.", source: "Al-i İmran Suresi, 144" },
    { text: "Biz her şeyi bir ölçüye göre yarattık.", source: "Kamer Suresi, 49" },
    { text: "Şüphesiz Allah, tevekkül edenleri sever.", source: "Al-i İmran Suresi, 159" },
    { text: "İnsan için ancak çalıştığının karşılığı vardır.", source: "Necm Suresi, 39" },
    { text: "Elbette her zorlukla beraber bir kolaylık vardır.", source: "İnşirah Suresi, 5" },
    { text: "Allah size kolaylık diler, zorluk dilemez.", source: "Bakara Suresi, 185" },
    { text: "Rabbiniz şöyle buyurdu: Bana dua edin, size icabet edeyim.", source: "Mümin Suresi, 60" },
    { text: "Bilsinler ki, kalpler ancak Allah'ı anmakla huzur bulur.", source: "Ra'd Suresi, 28" },
    { text: "Kim zerre miktarı hayır yapmışsa onu görür.", source: "Zilzal Suresi, 7" },
    { text: "Allah, işiten ve bilendir.", source: "Bakara Suresi, 256" },
    { text: "Sizin en hayırlınız, insanlara en faydalı olanınızdır.", source: "Hadis-i Şerif" },
    { text: "Mümin, müminin aynasıdır.", source: "Hadis-i Şerif" },
    { text: "Güzel söz sadakadır.", source: "Hadis-i Şerif" },
    { text: "Tebessüm sadakadır.", source: "Hadis-i Şerif" },
    { text: "Kolaylaştırınız, zorlaştırmayınız; müjdeleyiniz, nefret ettirmeyiniz.", source: "Hadis-i Şerif" },
    { text: "Temizlik imandandır.", source: "Hadis-i Şerif" },
    // ... Bu liste kullanıcı isteğine göre 365'e tamamlanabilir.
    // Algoritma (DayOfYear % ListLength) ile her gün farklı bir tane gösterecek.
];
