// Dini Gün ve Bayram Mesajları
// Her kategori ayrı başlık altında, kullanıcı istediğini kopyalayabilir

export interface ReligiousMessage {
    id: string;
    text: string;
}

export interface ReligiousCategory {
    id: string;
    title: string;
    emoji: string;
    messages: ReligiousMessage[];
}

export const RELIGIOUS_MESSAGES: ReligiousCategory[] = [
    {
        id: 'ramazan_bayrami',
        title: 'Ramazan Bayramı',
        emoji: '🌙',
        messages: [
            { id: 'rb1', text: 'Ramazan Bayramınız mübarek olsun. Allah oruçlarınızı, ibadetlerinizi kabul etsin. Hayırlı bayramlar.' },
            { id: 'rb2', text: 'Bu mübarek bayramda dualarınız kabul, kalpleriniz mutlulukla dolsun. Ramazan Bayramınız kutlu olsun.' },
            { id: 'rb3', text: 'Ramazan ayının bereketini yaşadığımız bu günlerde, bayramın sevinci kalbinizi aydınlatsın. İyi bayramlar.' },
            { id: 'rb4', text: 'Gönülleriniz sevinçle, eviniz bereketle, sofralarınız nimetle dolsun. Ramazan Bayramınız kutlu olsun.' },
            { id: 'rb5', text: 'Bu bayram, sevdiklerinizle birlikte sağlık ve huzur içinde geçirmeniz dileğiyle. Hayırlı bayramlar.' },
        ]
    },
    {
        id: 'kurban_bayrami',
        title: 'Kurban Bayramı',
        emoji: '🐑',
        messages: [
            { id: 'kb1', text: 'Kurban Bayramınız mübarek olsun. Kestiğiniz kurbanlar kabul olsun. Hayırlı bayramlar.' },
            { id: 'kb2', text: 'Bu mübarek Kurban Bayramı\'nda sevdiklerinizle birlikte nice mutlu anlar yaşamanız dileğiyle.' },
            { id: 'kb3', text: 'Kurban Bayramı\'nın bereketinin üzerinizden eksik olmaması temennisiyle, iyi bayramlar.' },
            { id: 'kb4', text: 'Hz. İbrahim\'in teslimiyetini hatırladığımız bu güzel günde, bayramınız kutlu olsun.' },
            { id: 'kb5', text: 'Kurban Bayramınızı en içten dileklerimle kutlar, sağlık ve huzur dolu günler dilerim.' },
        ]
    },
    {
        id: 'mevlid_kandili',
        title: 'Mevlid Kandili',
        emoji: '🕌',
        messages: [
            { id: 'mk1', text: 'Alemlere rahmet olarak gönderilen Peygamberimizin doğum günü olan Mevlid Kandili\'niz mübarek olsun.' },
            { id: 'mk2', text: 'Bu mübarek gecede dualarınız kabul, kalpleriniz huzurla dolsun. Mevlid Kandiliniz kutlu olsun.' },
            { id: 'mk3', text: 'Peygamber Efendimizin doğduğu bu kutlu gecede, ümmetine şefaati üzerimize olsun. Kandiliniz mübarek olsun.' },
            { id: 'mk4', text: 'Mevlid Kandili\'nin feyz ve bereketiyle gönüllerimiz aydınlansın. Hayırlı kandiller.' },
        ]
    },
    {
        id: 'regaib_kandili',
        title: 'Regaib Kandili',
        emoji: '✨',
        messages: [
            { id: 'rk1', text: 'Üç ayların başlangıcı olan Regaib Kandili\'niz mübarek olsun. Allah hayırlara vesile eylesin.' },
            { id: 'rk2', text: 'Regaib Kandili\'nin getireceği manevi bereketin evlerinize dolması temennisiyle, kandiliniz kutlu olsun.' },
            { id: 'rk3', text: 'Bu mübarek gecede yapacağınız dualar kabul, ibadetler makbul olsun. Regaib Kandiliniz hayırlı olsun.' },
        ]
    },
    {
        id: 'mirac_kandili',
        title: 'Miraç Kandili',
        emoji: '🌟',
        messages: [
            { id: 'mc1', text: 'Peygamberimizin miracına şahitlik eden bu mübarek gecede, dualarınız kabul olsun. Miraç Kandiliniz mübarek olsun.' },
            { id: 'mc2', text: 'Göklere yükselişin simgesi olan Miraç Kandili\'nde, gönüllerimiz de yücelsin. Hayırlı kandiller.' },
            { id: 'mc3', text: 'Miraç Kandili\'nin feyz ve bereketinin üzerinize olması temennisiyle, kandiliniz kutlu olsun.' },
        ]
    },
    {
        id: 'berat_kandili',
        title: 'Berat Kandili',
        emoji: '📿',
        messages: [
            { id: 'bk1', text: 'Günahlardan arınma ve bağışlanma gecesi olan Berat Kandili\'niz mübarek olsun.' },
            { id: 'bk2', text: 'Bu gece af ve mağfiret dileme gecesidir. Berat Kandiliniz hayırlara vesile olsun.' },
            { id: 'bk3', text: 'Berat Kandili\'nde Allah tüm günahlarımızı affetsin, kalplerimizi nurlandırsın. Kandiliniz mübarek olsun.' },
        ]
    },
    {
        id: 'kadir_gecesi',
        title: 'Kadir Gecesi',
        emoji: '🌌',
        messages: [
            { id: 'kg1', text: 'Bin aydan hayırlı olan Kadir Geceniz mübarek olsun. Dualarınız kabul, ibadetleriniz makbul olsun.' },
            { id: 'kg2', text: 'Kur\'an-ı Kerim\'in indirildiği bu mübarek gecede, Allah\'ın rahmeti üzerinize olsun. Kadir Geceniz hayırlı olsun.' },
            { id: 'kg3', text: 'Bu gece, yılın en kıymetli gecesidir. Kadir Gecesi\'nin bereketinden nasibimiz bol olsun.' },
            { id: 'kg4', text: 'Kadir Gecesi\'nde yapılan dualar kabul olur. Allah dualarınızı geri çevirmesin. Hayırlı geceler.' },
        ]
    },
    {
        id: 'muharrem_asure',
        title: 'Muharrem / Aşure',
        emoji: '🍲',
        messages: [
            { id: 'ma1', text: 'Muharrem ayınız ve Aşure Gününüz mübarek olsun. Allah hayırlara vesile eylesin.' },
            { id: 'ma2', text: 'Aşure Günü\'nün bereketinin sofralarınızdan eksik olmaması temennisiyle, hayırlı günler.' },
            { id: 'ma3', text: 'Bu mübarek günde oruç tutanların oruçları kabul olsun. Aşure Gününüz kutlu olsun.' },
        ]
    },
    {
        id: 'cuma_mesajlari',
        title: 'Cuma Mesajları',
        emoji: '🤲',
        messages: [
            { id: 'cm1', text: 'Hayırlı Cumalar. Allah dualarınızı kabul etsin, gönlünüzü ferahlatsın.' },
            { id: 'cm2', text: 'Cuma\'nın bereketiyle hayırlı işler başlamanız temennisiyle, hayırlı Cumalar.' },
            { id: 'cm3', text: 'Bugün dualar kabul olur. Dualarınız kabul, Cumanız mübarek olsun.' },
            { id: 'cm4', text: 'Cuma gününün huzur ve bereketinden nasibiniz bol olsun. Hayırlı Cumalar.' },
            { id: 'cm5', text: 'Bu mübarek günde sevdiklerinizle birlikte huzurlu anlar yaşamanız dileğiyle. Cumanız mübarek olsun.' },
            { id: 'cm6', text: 'Allah\'ın selamı, rahmeti ve bereketi üzerinize olsun. Hayırlı Cumalar.' },
        ]
    }
];
