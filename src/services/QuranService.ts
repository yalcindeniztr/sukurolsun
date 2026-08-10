import { Preferences } from '@capacitor/preferences';

export interface SurahMeta {
    number: number;
    name: string; // Turkish name
    englishName: string;
    arabicName: string;
    numberOfAyahs: number;
    revelationType: 'Mekke' | 'Medine';
    juz: number;
}

export interface Ayah {
    number: number; // Ayah number in surah
    text: string;   // Elmalılı Hamdi Yazır translation text
}

export interface QuranBookmark {
    surahNumber: number;
    surahName: string;
    ayahNumber: number;
    timestamp: number;
}

const QURAN_BOOKMARK_KEY = 'sukur_olsun_quran_bookmark_v1';
const QURAN_FAVORITES_KEY = 'sukur_olsun_quran_favorites_v1';

export const SURAH_LIST: SurahMeta[] = [
    { number: 1, name: 'Fâtiha', englishName: 'Al-Fatiha', arabicName: 'الفاتحة', numberOfAyahs: 7, revelationType: 'Mekke', juz: 1 },
    { number: 2, name: 'Bakara', englishName: 'Al-Baqarah', arabicName: 'البقرة', numberOfAyahs: 286, revelationType: 'Medine', juz: 1 },
    { number: 3, name: 'Âl-i İmrân', englishName: 'Ali \'Imran', arabicName: 'آل عمران', numberOfAyahs: 200, revelationType: 'Medine', juz: 3 },
    { number: 4, name: 'Nisâ', englishName: 'An-Nisa', arabicName: 'النساء', numberOfAyahs: 176, revelationType: 'Medine', juz: 4 },
    { number: 5, name: 'Mâide', englishName: 'Al-Ma\'idah', arabicName: 'المائدة', numberOfAyahs: 120, revelationType: 'Medine', juz: 6 },
    { number: 6, name: 'En\'âm', englishName: 'Al-An\'am', arabicName: 'الأنعام', numberOfAyahs: 165, revelationType: 'Mekke', juz: 7 },
    { number: 7, name: 'A\'râf', englishName: 'Al-A\'raf', arabicName: 'الأعراف', numberOfAyahs: 206, revelationType: 'Mekke', juz: 8 },
    { number: 8, name: 'Enfâl', englishName: 'Al-Anfal', arabicName: 'الأنفال', numberOfAyahs: 75, revelationType: 'Medine', juz: 9 },
    { number: 9, name: 'Tevbe', englishName: 'At-Tawbah', arabicName: 'التوبة', numberOfAyahs: 129, revelationType: 'Medine', juz: 10 },
    { number: 10, name: 'Yûnus', englishName: 'Yunus', arabicName: 'يونس', numberOfAyahs: 109, revelationType: 'Mekke', juz: 11 },
    { number: 11, name: 'Hûd', englishName: 'Hud', arabicName: 'هود', numberOfAyahs: 123, revelationType: 'Mekke', juz: 11 },
    { number: 12, name: 'Yûsuf', englishName: 'Yusuf', arabicName: 'يوسف', numberOfAyahs: 111, revelationType: 'Mekke', juz: 12 },
    { number: 13, name: 'Ra\'d', englishName: 'Ar-Ra\'d', arabicName: 'الرعد', numberOfAyahs: 43, revelationType: 'Medine', juz: 13 },
    { number: 14, name: 'İbrâhîm', englishName: 'Ibrahim', arabicName: 'إبراهيم', numberOfAyahs: 52, revelationType: 'Mekke', juz: 13 },
    { number: 15, name: 'Hicr', englishName: 'Al-Hijr', arabicName: 'الحجر', numberOfAyahs: 99, revelationType: 'Mekke', juz: 14 },
    { number: 16, name: 'Nahl', englishName: 'An-Nahl', arabicName: 'النحل', numberOfAyahs: 128, revelationType: 'Mekke', juz: 14 },
    { number: 17, name: 'İsrâ', englishName: 'Al-Isra', arabicName: 'الإسراء', numberOfAyahs: 111, revelationType: 'Mekke', juz: 15 },
    { number: 18, name: 'Kehf', englishName: 'Al-Kahf', arabicName: 'الكهف', numberOfAyahs: 110, revelationType: 'Mekke', juz: 15 },
    { number: 19, name: 'Meryem', englishName: 'Maryam', arabicName: 'مريم', numberOfAyahs: 98, revelationType: 'Mekke', juz: 16 },
    { number: 20, name: 'Tâhâ', englishName: 'Taha', arabicName: 'طه', numberOfAyahs: 135, revelationType: 'Mekke', juz: 16 },
    { number: 21, name: 'Enbiyâ', englishName: 'Al-Anbiya', arabicName: 'الأنبيائ', numberOfAyahs: 112, revelationType: 'Mekke', juz: 17 },
    { number: 22, name: 'Hac', englishName: 'Al-Hajj', arabicName: 'الحج', numberOfAyahs: 78, revelationType: 'Medine', juz: 17 },
    { number: 23, name: 'Mü\'minûn', englishName: 'Al-Mu\'minun', arabicName: 'المؤمنون', numberOfAyahs: 118, revelationType: 'Mekke', juz: 18 },
    { number: 24, name: 'Nûr', englishName: 'An-Nur', arabicName: 'النور', numberOfAyahs: 64, revelationType: 'Medine', juz: 18 },
    { number: 25, name: 'Furkân', englishName: 'Al-Furqan', arabicName: 'الفرقان', numberOfAyahs: 77, revelationType: 'Mekke', juz: 18 },
    { number: 26, name: 'Şuarâ', englishName: 'Ash-Shu\'ara', arabicName: 'الشعراء', numberOfAyahs: 227, revelationType: 'Mekke', juz: 19 },
    { number: 27, name: 'Neml', englishName: 'An-Naml', arabicName: 'النمل', numberOfAyahs: 93, revelationType: 'Mekke', juz: 19 },
    { number: 28, name: 'Kasas', englishName: 'Al-Qasas', arabicName: 'القصص', numberOfAyahs: 88, revelationType: 'Mekke', juz: 20 },
    { number: 29, name: 'Ankebût', englishName: 'Al-\'Ankabut', arabicName: 'العنكبوت', numberOfAyahs: 69, revelationType: 'Mekke', juz: 20 },
    { number: 30, name: 'Rûm', englishName: 'Ar-Rum', arabicName: 'الروم', numberOfAyahs: 60, revelationType: 'Mekke', juz: 21 },
    { number: 31, name: 'Lokmân', englishName: 'Luqman', arabicName: 'لقمان', numberOfAyahs: 34, revelationType: 'Mekke', juz: 21 },
    { number: 32, name: 'Secde', englishName: 'As-Sajdah', arabicName: 'السجدة', numberOfAyahs: 30, revelationType: 'Mekke', juz: 21 },
    { number: 33, name: 'Ahzâb', englishName: 'Al-Ahzab', arabicName: 'الأحزاب', numberOfAyahs: 73, revelationType: 'Medine', juz: 21 },
    { number: 34, name: 'Sebe\'', englishName: 'Saba\'', arabicName: 'سبإ', numberOfAyahs: 54, revelationType: 'Mekke', juz: 22 },
    { number: 35, name: 'Fâtır', englishName: 'Fatir', arabicName: 'فاطر', numberOfAyahs: 45, revelationType: 'Mekke', juz: 22 },
    { number: 36, name: 'Yâsîn', englishName: 'Ya-Sin', arabicName: 'يس', numberOfAyahs: 83, revelationType: 'Mekke', juz: 22 },
    { number: 37, name: 'Sâffât', englishName: 'As-Saffat', arabicName: 'الصافات', numberOfAyahs: 182, revelationType: 'Mekke', juz: 23 },
    { number: 38, name: 'Sâd', englishName: 'Sad', arabicName: 'ص', numberOfAyahs: 88, revelationType: 'Mekke', juz: 23 },
    { number: 39, name: 'Zümer', englishName: 'Az-Zumar', arabicName: 'الزمر', numberOfAyahs: 75, revelationType: 'Mekke', juz: 23 },
    { number: 40, name: 'Mü\'min (Gâfir)', englishName: 'Ghafir', arabicName: 'غافر', numberOfAyahs: 85, revelationType: 'Mekke', juz: 24 },
    { number: 41, name: 'Fussilet', englishName: 'Fussilat', arabicName: 'فصلت', numberOfAyahs: 54, revelationType: 'Mekke', juz: 24 },
    { number: 42, name: 'Şûrâ', englishName: 'Ash-Shura', arabicName: 'الشورى', numberOfAyahs: 53, revelationType: 'Mekke', juz: 25 },
    { number: 43, name: 'Zuhruf', englishName: 'Az-Zukhruf', arabicName: 'الزخرف', numberOfAyahs: 89, revelationType: 'Mekke', juz: 25 },
    { number: 44, name: 'Duhân', englishName: 'Ad-Dukhan', arabicName: 'الدخان', numberOfAyahs: 59, revelationType: 'Mekke', juz: 25 },
    { number: 45, name: 'Câsiye', englishName: 'Al-Jathiyah', arabicName: 'الجاثية', numberOfAyahs: 37, revelationType: 'Mekke', juz: 25 },
    { number: 46, name: 'Ahkâf', englishName: 'Al-Ahqaf', arabicName: 'الأحقاف', numberOfAyahs: 35, revelationType: 'Mekke', juz: 26 },
    { number: 47, name: 'Muhammed', englishName: 'Muhammad', arabicName: 'محمد', numberOfAyahs: 38, revelationType: 'Medine', juz: 26 },
    { number: 48, name: 'Fetih', englishName: 'Al-Fath', arabicName: 'الفتح', numberOfAyahs: 29, revelationType: 'Medine', juz: 26 },
    { number: 49, name: 'Hucurât', englishName: 'Al-Hujurat', arabicName: 'الحجرات', numberOfAyahs: 18, revelationType: 'Medine', juz: 26 },
    { number: 50, name: 'Kâf', englishName: 'Qaf', arabicName: 'ق', numberOfAyahs: 45, revelationType: 'Mekke', juz: 26 },
    { number: 51, name: 'Zâriyât', englishName: 'Adh-Dhariyat', arabicName: 'الذاريات', numberOfAyahs: 60, revelationType: 'Mekke', juz: 26 },
    { number: 52, name: 'Tûr', englishName: 'At-Tur', arabicName: 'الطور', numberOfAyahs: 49, revelationType: 'Mekke', juz: 27 },
    { number: 53, name: 'Necm', englishName: 'An-Najm', arabicName: 'النجم', numberOfAyahs: 62, revelationType: 'Mekke', juz: 27 },
    { number: 54, name: 'Kamer', englishName: 'Al-Qamar', arabicName: 'القمر', numberOfAyahs: 55, revelationType: 'Mekke', juz: 27 },
    { number: 55, name: 'Rahmân', englishName: 'Ar-Rahman', arabicName: 'الرحمن', numberOfAyahs: 78, revelationType: 'Medine', juz: 27 },
    { number: 56, name: 'Vâkıa', englishName: 'Al-Waqi\'ah', arabicName: 'الواقعة', numberOfAyahs: 96, revelationType: 'Mekke', juz: 27 },
    { number: 57, name: 'Hadîd', englishName: 'Al-Hadid', arabicName: 'الحديد', numberOfAyahs: 29, revelationType: 'Medine', juz: 27 },
    { number: 58, name: 'Mücâdele', englishName: 'Al-Mujadila', arabicName: 'المجادلة', numberOfAyahs: 22, revelationType: 'Medine', juz: 28 },
    { number: 59, name: 'Haşr', englishName: 'Al-Hashr', arabicName: 'الحشر', numberOfAyahs: 24, revelationType: 'Medine', juz: 28 },
    { number: 60, name: 'Mümtehine', englishName: 'Al-Mumtahanah', arabicName: 'الممتحنة', numberOfAyahs: 13, revelationType: 'Medine', juz: 28 },
    { number: 61, name: 'Saf', englishName: 'As-Saff', arabicName: 'الصف', numberOfAyahs: 14, revelationType: 'Medine', juz: 28 },
    { number: 62, name: 'Cuma', englishName: 'Al-Jumu\'ah', arabicName: 'الجمعة', numberOfAyahs: 11, revelationType: 'Medine', juz: 28 },
    { number: 63, name: 'Münâfikûn', englishName: 'Al-Munafiqun', arabicName: 'المنافقون', numberOfAyahs: 11, revelationType: 'Medine', juz: 28 },
    { number: 64, name: 'Teğâbün', englishName: 'At-Taghabun', arabicName: 'التغابن', numberOfAyahs: 18, revelationType: 'Medine', juz: 28 },
    { number: 65, name: 'Talâk', englishName: 'At-Talaq', arabicName: 'الطلاق', numberOfAyahs: 12, revelationType: 'Medine', juz: 28 },
    { number: 66, name: 'Tahrîm', englishName: 'At-Tahrim', arabicName: 'التحريم', numberOfAyahs: 12, revelationType: 'Medine', juz: 28 },
    { number: 67, name: 'Mülk (Tebâreke)', englishName: 'Al-Mulk', arabicName: 'الملك', numberOfAyahs: 30, revelationType: 'Mekke', juz: 29 },
    { number: 68, name: 'Kalem', englishName: 'Al-Qalam', arabicName: 'القلم', numberOfAyahs: 52, revelationType: 'Mekke', juz: 29 },
    { number: 69, name: 'Hâkka', englishName: 'Al-Haqqah', arabicName: 'الحاقة', numberOfAyahs: 52, revelationType: 'Mekke', juz: 29 },
    { number: 70, name: 'Meâric', englishName: 'Al-Ma\'arij', arabicName: 'المعارج', numberOfAyahs: 44, revelationType: 'Mekke', juz: 29 },
    { number: 71, name: 'Nûh', englishName: 'Nuh', arabicName: 'نوح', numberOfAyahs: 28, revelationType: 'Mekke', juz: 29 },
    { number: 72, name: 'Cin', englishName: 'Al-Jinn', arabicName: 'الجن', numberOfAyahs: 28, revelationType: 'Mekke', juz: 29 },
    { number: 73, name: 'Müzzemmil', englishName: 'Al-Muzzammil', arabicName: 'المزمل', numberOfAyahs: 20, revelationType: 'Mekke', juz: 29 },
    { number: 74, name: 'Müddessir', englishName: 'Al-Muddaththir', arabicName: 'المدثر', numberOfAyahs: 56, revelationType: 'Mekke', juz: 29 },
    { number: 75, name: 'Kıyâme', englishName: 'Al-Qiyamah', arabicName: 'القيامة', numberOfAyahs: 40, revelationType: 'Mekke', juz: 29 },
    { number: 76, name: 'İnsân (Dehr)', englishName: 'Al-Insan', arabicName: 'الإنسان', numberOfAyahs: 31, revelationType: 'Medine', juz: 29 },
    { number: 77, name: 'Mürselât', englishName: 'Al-Mursalat', arabicName: 'المرسلات', numberOfAyahs: 50, revelationType: 'Mekke', juz: 29 },
    { number: 78, name: 'Nebe\' (Amme)', englishName: 'An-Naba\'', arabicName: 'النبإ', numberOfAyahs: 40, revelationType: 'Mekke', juz: 30 },
    { number: 79, name: 'Nâziât', englishName: 'An-Nazi\'at', arabicName: 'النازعات', numberOfAyahs: 46, revelationType: 'Mekke', juz: 30 },
    { number: 80, name: 'Abese', englishName: '\'Abasa', arabicName: 'عبس', numberOfAyahs: 42, revelationType: 'Mekke', juz: 30 },
    { number: 81, name: 'Tekvîr', englishName: 'At-Takwir', arabicName: 'التكوير', numberOfAyahs: 29, revelationType: 'Mekke', juz: 30 },
    { number: 82, name: 'İnfitâr', englishName: 'Al-Infitar', arabicName: 'الإنفطار', numberOfAyahs: 19, revelationType: 'Mekke', juz: 30 },
    { number: 83, name: 'Mutaffifîn', englishName: 'Al-Mutaffifin', arabicName: 'المطففين', numberOfAyahs: 36, revelationType: 'Mekke', juz: 30 },
    { number: 84, name: 'İnşikâk', englishName: 'Al-Inshiqaq', arabicName: 'الإنشقاق', numberOfAyahs: 25, revelationType: 'Mekke', juz: 30 },
    { number: 85, name: 'Bürûc', englishName: 'Al-Buruj', arabicName: 'البروج', numberOfAyahs: 22, revelationType: 'Mekke', juz: 30 },
    { number: 86, name: 'Târık', englishName: 'At-Tariq', arabicName: 'الطارق', numberOfAyahs: 17, revelationType: 'Mekke', juz: 30 },
    { number: 87, name: 'A\'lâ', englishName: 'Al-A\'la', arabicName: 'الأعلى', numberOfAyahs: 19, revelationType: 'Mekke', juz: 30 },
    { number: 88, name: 'Gâşiye', englishName: 'Al-Ghashiyah', arabicName: 'الغاشية', numberOfAyahs: 26, revelationType: 'Mekke', juz: 30 },
    { number: 89, name: 'Fecr', englishName: 'Al-Fajr', arabicName: 'الفجر', numberOfAyahs: 30, revelationType: 'Mekke', juz: 30 },
    { number: 90, name: 'Beled', englishName: 'Al-Balad', arabicName: 'البلد', numberOfAyahs: 20, revelationType: 'Mekke', juz: 30 },
    { number: 91, name: 'Şems', englishName: 'Ash-Shams', arabicName: 'الشمس', numberOfAyahs: 15, revelationType: 'Mekke', juz: 30 },
    { number: 92, name: 'Leyl', englishName: 'Al-Layl', arabicName: 'الليل', numberOfAyahs: 21, revelationType: 'Mekke', juz: 30 },
    { number: 93, name: 'Duhâ', englishName: 'Ad-Duhaa', arabicName: 'الضحى', numberOfAyahs: 11, revelationType: 'Mekke', juz: 30 },
    { number: 94, name: 'İnşirâh', englishName: 'Ash-Sharh', arabicName: 'الشرح', numberOfAyahs: 8, revelationType: 'Mekke', juz: 30 },
    { number: 95, name: 'Tîn', englishName: 'At-Tin', arabicName: 'التين', numberOfAyahs: 8, revelationType: 'Mekke', juz: 30 },
    { number: 96, name: 'Alak', englishName: 'Al-\'Alaq', arabicName: 'العلق', numberOfAyahs: 19, revelationType: 'Mekke', juz: 30 },
    { number: 97, name: 'Kadir', englishName: 'Al-Qadr', arabicName: 'القدر', numberOfAyahs: 5, revelationType: 'Mekke', juz: 30 },
    { number: 98, name: 'Beyyine', englishName: 'Al-Bayyinah', arabicName: 'البينة', numberOfAyahs: 8, revelationType: 'Medine', juz: 30 },
    { number: 99, name: 'Zilzâl', englishName: 'Az-Zalzalah', arabicName: 'الزلزلة', numberOfAyahs: 8, revelationType: 'Medine', juz: 30 },
    { number: 100, name: 'Âdiyât', englishName: 'Al-\'Adiyat', arabicName: 'العاديات', numberOfAyahs: 11, revelationType: 'Mekke', juz: 30 },
    { number: 101, name: 'Kâria', englishName: 'Al-Qari\'ah', arabicName: 'القارعة', numberOfAyahs: 11, revelationType: 'Mekke', juz: 30 },
    { number: 102, name: 'Tekâsür', englishName: 'At-Takathur', arabicName: 'التكاثر', numberOfAyahs: 8, revelationType: 'Mekke', juz: 30 },
    { number: 103, name: 'Asr', englishName: 'Al-\'Asr', arabicName: 'العصر', numberOfAyahs: 3, revelationType: 'Mekke', juz: 30 },
    { number: 104, name: 'Hümeze', englishName: 'Al-Humazah', arabicName: 'الهمزة', numberOfAyahs: 9, revelationType: 'Mekke', juz: 30 },
    { number: 105, name: 'Fîl', englishName: 'Al-Fil', arabicName: 'الفيل', numberOfAyahs: 5, revelationType: 'Mekke', juz: 30 },
    { number: 106, name: 'Kureyş', englishName: 'Quraysh', arabicName: 'قريش', numberOfAyahs: 4, revelationType: 'Mekke', juz: 30 },
    { number: 107, name: 'Mâûn', englishName: 'Al-Ma\'un', arabicName: 'الماعون', numberOfAyahs: 7, revelationType: 'Mekke', juz: 30 },
    { number: 108, name: 'Kevser', englishName: 'Al-Kawthar', arabicName: 'الكوثر', numberOfAyahs: 3, revelationType: 'Mekke', juz: 30 },
    { number: 109, name: 'Kâfirûn', englishName: 'Al-Kafirun', arabicName: 'الكافرون', numberOfAyahs: 6, revelationType: 'Mekke', juz: 30 },
    { number: 110, name: 'Nasr', englishName: 'An-Nasr', arabicName: 'النصر', numberOfAyahs: 3, revelationType: 'Medine', juz: 30 },
    { number: 111, name: 'Tebbet (Mesed)', englishName: 'Al-Masad', arabicName: 'المسد', numberOfAyahs: 5, revelationType: 'Mekke', juz: 30 },
    { number: 112, name: 'İhlâs', englishName: 'Al-Ikhlas', arabicName: 'الإخلاص', numberOfAyahs: 4, revelationType: 'Mekke', juz: 30 },
    { number: 113, name: 'Felak', englishName: 'Al-Falaq', arabicName: 'الفلق', numberOfAyahs: 5, revelationType: 'Mekke', juz: 30 },
    { number: 114, name: 'Nâs', englishName: 'An-Nas', arabicName: 'الناس', numberOfAyahs: 6, revelationType: 'Mekke', juz: 30 }
];

const FALLBACK_SURAH_1: Ayah[] = [
    { number: 1, text: 'Rahmân ve Rahîm olan Allah\'ın ismiyle.' },
    { number: 2, text: 'Hamd, âlemlerin Rabbi olan Allah\'a mahsustur.' },
    { number: 3, text: 'O, Rahmân ve Rahîm\'dir.' },
    { number: 4, text: 'Din (ödül ve ceza) gününün sahibidir.' },
    { number: 5, text: '(Rabbimiz!) Yalnız sana kulluk eder ve yalnız senden yardım dileriz.' },
    { number: 6, text: 'Bizi dosdoğru yola ilet.' },
    { number: 7, text: 'Nimet verdiğin kimselerin yoluna; gazaba uğramışların ve sapmışların yoluna değil.' }
];

const FALLBACK_SURAH_112: Ayah[] = [
    { number: 1, text: 'De ki: O Allah tektir.' },
    { number: 2, text: 'Allah Samed\'dir (her şey O\'na muhtaçtır, O hiçbir şeye muhtaç değildir).' },
    { number: 3, text: 'O doğurmamış ve doğurulmamıştır.' },
    { number: 4, text: 'Hiçbir şey O\'nun dengi değildir.' }
];

const FALLBACK_SURAH_113: Ayah[] = [
    { number: 1, text: 'De ki: Sabahın Rabbine sığınırım;' },
    { number: 2, text: 'Yarattığı şeylerin şerrinden,' },
    { number: 3, text: 'Karanlığı çöktüğü zaman gecenin şerrinden,' },
    { number: 4, text: 'Düğümlere üfleyen büyücülerin şerrinden,' },
    { number: 5, text: 'Ve haset ettiği zaman hasetçinin şerrinden.' }
];

const FALLBACK_SURAH_114: Ayah[] = [
    { number: 1, text: 'De ki: İnsanların Rabbine sığınırım,' },
    { number: 2, text: 'İnsanların hükümdarına,' },
    { number: 3, text: 'İnsanların ilâhına;' },
    { number: 4, text: 'Sinsi vesvesecinin şerrinden,' },
    { number: 5, text: 'Ki o, insanların göğüslerine vesvese fısıldar.' },
    { number: 6, text: 'Gerek cinlerden gerek insanlardan (olan tüm vesvesecilerden).' }
];

export class QuranService {
    static async getSurahAyahs(surahNumber: number): Promise<Ayah[]> {
        const cacheKey = `quran_surah_yazir_${surahNumber}`;
        try {
            const { value } = await Preferences.get({ key: cacheKey });
            if (value) {
                const cached = JSON.parse(value);
                if (Array.isArray(cached) && cached.length > 0) {
                    return cached;
                }
            }
        } catch (e) {
            console.warn('Önbellekten sure okunurken hata oluştu:', e);
        }

        // Try API 1: AlQuran.cloud (Elmalılı Muhammet Hamdi Yazır: tr.yazir)
        try {
            const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/tr.yazir`);
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'OK' && data.data && Array.isArray(data.data.ayahs)) {
                    const ayahs: Ayah[] = data.data.ayahs.map((item: any) => ({
                        number: item.numberInSurah,
                        text: item.text
                    }));
                    await Preferences.set({ key: cacheKey, value: JSON.stringify(ayahs) });
                    return ayahs;
                }
            }
        } catch (e) {
            console.warn('AlQuran.cloud API çağrısı başarısız, yedek API deneniyor:', e);
        }

        // Try API 2: Fawaz Ahmed Quran API CDN (Elmalılı Hamdi Yazır)
        try {
            const response = await fetch(`https://cdn.jsdelivr.net/gh/fawazahed/quran-api@1/editions/tur-elmalilihamdi/surahs/${surahNumber}.json`);
            if (response.ok) {
                const data = await response.json();
                if (data && Array.isArray(data.ayahs)) {
                    const ayahs: Ayah[] = data.ayahs.map((item: any, idx: number) => ({
                        number: item.ayah || idx + 1,
                        text: item.text
                    }));
                    await Preferences.set({ key: cacheKey, value: JSON.stringify(ayahs) });
                    return ayahs;
                }
            }
        } catch (e) {
            console.warn('Fawaz Ahmed Quran API çağrısı başarısız:', e);
        }

        // Fallbacks for common surahs
        if (surahNumber === 1) return FALLBACK_SURAH_1;
        if (surahNumber === 112) return FALLBACK_SURAH_112;
        if (surahNumber === 113) return FALLBACK_SURAH_113;
        if (surahNumber === 114) return FALLBACK_SURAH_114;

        throw new Error('İnternet bağlantınızı kontrol edin. Sure verisi alınamadı.');
    }

    static async getBookmark(): Promise<QuranBookmark | null> {
        try {
            const { value } = await Preferences.get({ key: QURAN_BOOKMARK_KEY });
            return value ? JSON.parse(value) : null;
        } catch (e) {
            return null;
        }
    }

    static async saveBookmark(bookmark: QuranBookmark): Promise<void> {
        try {
            await Preferences.set({ key: QURAN_BOOKMARK_KEY, value: JSON.stringify(bookmark) });
        } catch (e) {
            console.error('Ayraç kaydedilemedi:', e);
        }
    }

    static async getFavorites(): Promise<string[]> {
        try {
            const { value } = await Preferences.get({ key: QURAN_FAVORITES_KEY });
            return value ? JSON.parse(value) : [];
        } catch (e) {
            return [];
        }
    }

    static async toggleFavorite(surahNumber: number, ayahNumber: number): Promise<string[]> {
        const key = `${surahNumber}:${ayahNumber}`;
        const current = await this.getFavorites();
        const exists = current.includes(key);
        const updated = exists ? current.filter(k => k !== key) : [...current, key];
        await Preferences.set({ key: QURAN_FAVORITES_KEY, value: JSON.stringify(updated) });
        return updated;
    }
}
