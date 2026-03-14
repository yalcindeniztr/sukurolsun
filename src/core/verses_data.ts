

// Bu liste 365 gün için genişletilebilir.
// Şimdilik döngüsel kullanım için zengin bir başlangıç seti sunuyoruz.
export interface Verse {
    textTr: string;
    textEn: string;
    sourceTr: string;
    sourceEn: string;
}

export const ANNUAL_VERSES: Verse[] = [
    { 
        textTr: "Şükrederseniz, andolsun ki size (nimetimi) artırırım.", 
        textEn: "If you are grateful, I will surely increase you [in favor].",
        sourceTr: "İbrahim Suresi, 7",
        sourceEn: "Surah Ibrahim, 7"
    },
    { 
        textTr: "O, hanginizin daha güzel amel yapacağını sınamak için ölümü ve hayatı yaratandır.", 
        textEn: "He who created death and life to test you [as to] which of you is best in deed.",
        sourceTr: "Mülk Suresi, 2",
        sourceEn: "Surah Al-Mulk, 2"
    },
    { 
        textTr: "Rabbinin nimetine gelince; işte onu anlat da anlat.", 
        textEn: "And as for the favor of your Lord, report [it].",
        sourceTr: "Duha Suresi, 11",
        sourceEn: "Surah Ad-Duha, 11"
    },
    { 
        textTr: "Sabredenlere, mükafatları hesapsız ödenecektir.", 
        textEn: "Indeed, the patient will be given their reward without account.",
        sourceTr: "Zümer Suresi, 10",
        sourceEn: "Surah Az-Zumar, 10"
    },
    { 
        textTr: "Allah, şükredenleri mükafatlandıracaktır.", 
        textEn: "Allah will reward the grateful.",
        sourceTr: "Al-i İmran Suresi, 144",
        sourceEn: "Surah Ali 'Imran, 144"
    },
    { 
        textTr: "Biz her şeyi bir ölçüye göre yarattık.", 
        textEn: "Indeed, all things We created with predestination.",
        sourceTr: "Kamer Suresi, 49",
        sourceEn: "Surah Al-Qamar, 49"
    },
    { 
        textTr: "Şüphesiz Allah, tevekkül edenleri sever.", 
        textEn: "Indeed, Allah loves those who rely [upon Him].",
        sourceTr: "Al-i İmran Suresi, 159",
        sourceEn: "Surah Ali 'Imran, 159"
    },
    { 
        textTr: "İnsan için ancak çalıştığının karşılığı vardır.", 
        textEn: "And that there is not for man except that [good] for which he strives.",
        sourceTr: "Necm Suresi, 39",
        sourceEn: "Surah An-Najm, 39"
    },
    { 
        textTr: "Elbette her zorlukla beraber bir kolaylık vardır.", 
        textEn: "Indeed, with hardship [will be] ease.",
        sourceTr: "İnşirah Suresi, 5",
        sourceEn: "Surah Ash-Sharh, 5"
    },
    { 
        textTr: "Allah size kolaylık diler, zorluk dilemez.", 
        textEn: "Allah intends for you ease and does not intend for you hardship.",
        sourceTr: "Bakara Suresi, 185",
        sourceEn: "Surah Al-Baqarah, 185"
    }
];    // ... Bu liste kullanıcı isteğine göre 365'e tamamlanabilir.
    // Algoritma (DayOfYear % ListLength) ile her gün farklı bir tane gösterecek.
