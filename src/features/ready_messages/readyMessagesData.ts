export interface ReadyMessageCategory {
  id: string;
  title: string;
  description: string;
  messages: string[];
}

export const READY_MESSAGE_CATEGORIES: ReadyMessageCategory[] = [
  {
    id: 'uc-aylar',
    title: 'Üç Aylar',
    description: 'Recep, Şaban ve Ramazan iklimi için hazır tebrik mesajları.',
    messages: [
      'Üç ayların rahmeti, bereketi ve huzuru hanenize dolsun. Dualarınız kabul, gönlünüz ferah olsun.',
      'Recep, Şaban ve Ramazan ayları sizlere sağlık, huzur ve manevi güzellikler getirsin.',
      'Mübarek üç aylar vesilesiyle kalbiniz huzurla, sofranız bereketle, ömrünüz hayırla dolsun.',
      'Üç ayların feyzi üzerinize olsun; dualarınız kabul, ibadetleriniz makbul olsun.',
      'Rahmet kapılarının açıldığı bu mübarek günlerde Rabbim gönlünüze ferahlık versin.',
      'Üç aylarınız mübarek olsun. Rabbim bu ayları affa, arınmaya ve güzel başlangıçlara vesile kılsın.',
      'Maneviyatın arttığı bu güzel günlerde Allah gönlünüzden geçen hayırlı duaları kabul eylesin.',
      'Üç ayların bereketi ailemize, milletimize ve tüm İslam alemine huzur getirsin.',
      'Bu mübarek zamanlarda kalplerimiz iyilikle, dillerimiz dua ile, ömrümüz bereketle dolsun.',
      'Üç aylarınız hayırlı olsun. Rabbim Ramazan’a sağlık, afiyet ve huzur içinde ulaştırsın.'
    ]
  },
  {
    id: 'regaip',
    title: 'Regaip Kandili',
    description: 'Regaip Kandili için paylaşılabilir tebrik mesajları.',
    messages: [
      'Regaip Kandiliniz mübarek olsun. Rabbim gönlünüzden geçen hayırlı duaları kabul eylesin.',
      'Bu mübarek gece rahmet, bereket ve affa vesile olsun. Regaip Kandiliniz kutlu olsun.',
      'Regaip Kandili’nin huzuru evinize, bereketi sofranıza, nuru kalbinize dolsun.',
      'Duaların semaya yükseldiği bu gecede Rabbim sizi sevdiklerinizle huzur içinde yaşatsın.',
      'Regaip Kandiliniz mübarek olsun; tövbelerimiz kabul, kalplerimiz arınmış olsun.',
      'Bu güzel kandil gecesi iyiliklere, hayırlı başlangıçlara ve affa vesile olsun.',
      'Rabbim Regaip Kandili hürmetine gönlünüze ferahlık, ömrünüze bereket versin.',
      'Regaip Kandili’niz kutlu olsun. Allah dualarınızı kabul, ibadetlerinizi makbul eylesin.',
      'Rahmet kapılarının açıldığı bu gecede sevdiklerinizle huzur ve afiyet dilerim.',
      'Regaip Kandili’nin manevi iklimi kalbinize huzur, hayatınıza güzellik getirsin.'
    ]
  },
  {
    id: 'mirac',
    title: 'Miraç Kandili',
    description: 'Miraç Kandili için hazır mesajlar.',
    messages: [
      'Miraç Kandiliniz mübarek olsun. Rabbim dualarınızı kabul, gönlünüzü huzurla doldursun.',
      'Miraç gecesinin rahmeti, bereketi ve nuru üzerinize olsun.',
      'Bu mübarek gece affımıza, arınmamıza ve hayırlı kapıların açılmasına vesile olsun.',
      'Miraç Kandili’niz kutlu olsun; namazınız, duanız ve niyetleriniz makbul olsun.',
      'Rabbim bu gece hürmetine kalplerimizi imanla, evlerimizi huzurla doldursun.',
      'Miraç Kandili, tüm İslam alemine barış, rahmet ve selamet getirsin.',
      'Duaların kabul olduğu bu özel gecede Rabbim sevdiklerinizle nice huzurlu günler nasip etsin.',
      'Miraç Kandiliniz mübarek olsun. Allah gönlünüzdeki hayırlı dilekleri kabul eylesin.',
      'Bu gece manevi yükselişimize ve güzel ahlakla yaşamamıza vesile olsun.',
      'Miraç Kandili’nin feyzi ve bereketi ömrünüze güzellik katsın.'
    ]
  },
  {
    id: 'berat',
    title: 'Berat Kandili',
    description: 'Berat Kandili için af ve dua temalı mesajlar.',
    messages: [
      'Berat Kandiliniz mübarek olsun. Rabbim bizleri affına mazhar olan kullarından eylesin.',
      'Bu mübarek gece günahlardan arınmaya, kalplerin huzur bulmasına vesile olsun.',
      'Berat gecesinin rahmeti ve bereketi hanenize dolsun; dualarınız kabul olsun.',
      'Rabbim Berat Kandili hürmetine gönlünüzü ferah, yolunuzu hayırlı eylesin.',
      'Berat Kandiliniz kutlu olsun. Allah tövbelerimizi kabul, kusurlarımızı affeylesin.',
      'Bu gece sevdiklerinizle birlikte sağlık, huzur ve afiyet içinde olmanızı dilerim.',
      'Berat Kandili, tüm dargınlıkların bitmesine ve kalplerin yumuşamasına vesile olsun.',
      'Rabbim bu gece amel defterlerimizi hayırla doldursun, bizleri rahmetinden ayırmasın.',
      'Berat Kandili’nin nuru kalbinize, bereketi evinize, huzuru ömrünüze yansısın.',
      'Dualarınız kabul, kandiliniz mübarek, gönlünüz huzurlu olsun.'
    ]
  },
  {
    id: 'kadir',
    title: 'Kadir Gecesi',
    description: 'Kadir Gecesi için paylaşılabilecek mesajlar.',
    messages: [
      'Bin aydan hayırlı Kadir Geceniz mübarek olsun. Rabbim dualarınızı kabul eylesin.',
      'Kadir Gecesi’nin rahmeti, bereketi ve mağfireti üzerinize olsun.',
      'Bu mübarek gece affımıza, arınmamıza ve hayırlı bir ömre vesile olsun.',
      'Rabbim Kadir Gecesi hürmetine gönlünüzdeki hayırlı duaları kabul etsin.',
      'Kadir Geceniz mübarek olsun; Kur’an’ın nuru kalplerimizi aydınlatsın.',
      'Bu gece yapılan dualar kabul, ibadetler makbul, tövbeler nasuh olsun.',
      'Kadir Gecesi tüm İslam alemine huzur, birlik ve selamet getirsin.',
      'Rabbim bizleri Kadir Gecesi’nin feyzinden hakkıyla nasiplenenlerden eylesin.',
      'Bu mübarek gecede sevdiklerinizle sağlık, huzur ve afiyet dilerim.',
      'Kadir Geceniz mübarek olsun. Allah rahmetini, mağfiretini ve bereketini üzerimize indirsin.'
    ]
  },
  {
    id: 'mevlid',
    title: 'Mevlid Kandili',
    description: 'Mevlid Kandili için Peygamber sevgisi temalı mesajlar.',
    messages: [
      'Mevlid Kandiliniz mübarek olsun. Peygamber Efendimizin ahlakı hayatımıza rehber olsun.',
      'Bu mübarek gece rahmet, sevgi ve güzel ahlakın gönüllerimize yerleşmesine vesile olsun.',
      'Mevlid Kandili’nin nuru evinize huzur, kalbinize ferahlık getirsin.',
      'Alemlere rahmet olarak gönderilen Peygamberimizin sevgisi gönlümüzden eksik olmasın.',
      'Mevlid Kandiliniz kutlu olsun. Rabbim bizleri sünnet üzere yaşayan kullarından eylesin.',
      'Bu gece salavatlarımız kabul, dualarımız makbul olsun.',
      'Mevlid Kandili tüm insanlığa barış, merhamet ve huzur getirsin.',
      'Rabbim bu kandil vesilesiyle kalplerimizi sevgi, merhamet ve imanla doldursun.',
      'Mevlid Kandiliniz mübarek olsun; sevdiklerinizle huzurlu ve bereketli günler dilerim.',
      'Peygamber Efendimizin örnek hayatı yolumuzu aydınlatsın. Kandiliniz mübarek olsun.'
    ]
  },
  {
    id: 'ramazan',
    title: 'Ramazan Ayı',
    description: 'Ramazan ayı başlangıcı ve Ramazan içi mesajlar.',
    messages: [
      'Ramazan ayınız mübarek olsun. Rabbim oruçlarımızı, dualarımızı ve ibadetlerimizi kabul eylesin.',
      'Rahmet, bereket ve mağfiret ayı Ramazan hanenize huzur getirsin.',
      'Ramazan’ın feyzi sofranıza bereket, kalbinize huzur, ömrünüze hayır katsın.',
      'Rabbim bu mübarek ayı sağlık, afiyet ve güzel amellerle geçirmeyi nasip etsin.',
      'Ramazan ayınız kutlu olsun; birlik, paylaşma ve kardeşlik duygularımız artsın.',
      'Bu güzel ayda gönlünüz dua ile, eviniz bereket ile dolsun.',
      'Ramazan’ın manevi iklimi tüm sevdiklerinize huzur ve afiyet getirsin.',
      'Oruçlarımız kabul, dualarımız makbul, sofralarımız bereketli olsun.',
      'Ramazan ayı kalplerimizin arınmasına ve iyiliklerin çoğalmasına vesile olsun.',
      'Rabbim bizi Ramazan’ın rahmetinden, mağfiretinden ve kurtuluşundan nasiplendirsin.'
    ]
  },
  {
    id: 'ramazan-bayrami',
    title: 'Ramazan Bayramı',
    description: 'Ramazan Bayramı için tebrik mesajları.',
    messages: [
      'Ramazan Bayramınız mübarek olsun. Sevdiklerinizle huzur, sağlık ve mutluluk dolu nice bayramlar dilerim.',
      'Bayramınız kutlu olsun; sofranız bereketli, gönlünüz huzurlu, yuvanız neşeli olsun.',
      'Ramazan Bayramı’nın sevinci ve bereketi hanenize dolsun.',
      'Rabbim bu bayramı kardeşliğe, barışa ve güzel günlere vesile kılsın.',
      'Bayramınız mübarek olsun. Dargınlıklar bitsin, gönüller birleşsin.',
      'Ramazan Bayramı sevdiklerinizle birlikte sağlık, afiyet ve huzur getirsin.',
      'Bayramın bereketi sofranıza, neşesi evinize, huzuru kalbinize dolsun.',
      'Ramazan Bayramınız kutlu olsun. Allah nice güzel bayramlara eriştirsin.',
      'Bu bayram yüzünüzden tebessüm, kalbinizden huzur eksik olmasın.',
      'Rabbim bayram sevincimizi daim, birlik ve beraberliğimizi güçlü eylesin.'
    ]
  },
  {
    id: 'kurban-bayrami',
    title: 'Kurban Bayramı',
    description: 'Kurban Bayramı için hazır tebrik mesajları.',
    messages: [
      'Kurban Bayramınız mübarek olsun. Rabbim kurbanlarınızı kabul, dualarınızı makbul eylesin.',
      'Kurban Bayramı’nın bereketi hanenize, huzuru kalbinize dolsun.',
      'Bayramınız kutlu olsun; paylaşmanın, kardeşliğin ve merhametin güzelliği daim olsun.',
      'Rabbim bu bayramı sağlık, huzur ve hayırlı kapıların açılmasına vesile kılsın.',
      'Kurban Bayramınız mübarek olsun. Sevdiklerinizle nice güzel bayramlar dilerim.',
      'Bayramın sevinci evinize, bereketi sofranıza, duası ömrünüze yansısın.',
      'Rabbim ibadetlerinizi kabul, gönüllerinizi huzurlu eylesin.',
      'Kurban Bayramı tüm İslam alemine barış, rahmet ve birlik getirsin.',
      'Bu bayram iyiliklerin çoğalmasına, gönüllerin birleşmesine vesile olsun.',
      'Kurban Bayramınız mübarek, dualarınız kabul, yuvanız huzurlu olsun.'
    ]
  },
  {
    id: 'hicri-yilbasi',
    title: 'Hicri Yılbaşı',
    description: 'Hicri yılbaşı için dua ve temenni mesajları.',
    messages: [
      'Hicri yeni yılınız hayırlı olsun. Rabbim yeni yılı hayır, huzur ve bereketle geçirmeyi nasip etsin.',
      'Yeni hicri yıl, kalplerimize iman, evlerimize huzur, işlerimize bereket getirsin.',
      'Hicri yılbaşınız mübarek olsun. Rabbim geçmişimizi affedip geleceğimizi hayırlı eylesin.',
      'Bu yeni yıl tövbeye, güzel amellere ve hayırlı başlangıçlara vesile olsun.',
      'Hicri yeni yılda dualarınız kabul, yolunuz açık, gönlünüz ferah olsun.',
      'Rabbim bu yılı sevdiklerinizle sağlık, afiyet ve huzur içinde geçirmeyi nasip etsin.',
      'Hicri yılbaşınız kutlu olsun; iyilik, rahmet ve bereket üzerinizden eksik olmasın.',
      'Yeni yıl, ümmete birlik ve insanlığa barış getirsin.',
      'Rabbim bu yeni hicri yılı hayırlara vesile, kötülüklerden uzak eylesin.',
      'Hicri yılbaşınız mübarek olsun. Allah ömrümüzü rızasına uygun yaşamayı nasip etsin.'
    ]
  },
  {
    id: 'asure',
    title: 'Aşure Günü',
    description: 'Muharrem ve Aşure Günü için hazır mesajlar.',
    messages: [
      'Aşure Gününüz mübarek olsun. Rabbim birlik, bereket ve paylaşma duygumuzu artırsın.',
      'Muharrem ayı ve Aşure Günü hayırlara vesile olsun; dualarınız kabul olsun.',
      'Aşure’nin bereketi sofranıza, huzuru hanenize, rahmeti kalbinize dolsun.',
      'Rabbim bu özel günde bizleri affına ve rahmetine mazhar eylesin.',
      'Aşure Günü’nüz kutlu olsun. Paylaşmanın bereketi daim olsun.',
      'Bu mübarek gün kardeşliğimizin güçlenmesine ve gönüllerin birleşmesine vesile olsun.',
      'Aşure Günü hürmetine Rabbim dualarımızı kabul, işlerimizi hayırlı eylesin.',
      'Muharrem ayının huzuru ve Aşure’nin bereketi üzerinize olsun.',
      'Rabbim bu gün vesilesiyle evlerimize sağlık, sofralarımıza bereket versin.',
      'Aşure Gününüz mübarek olsun; iyilikleriniz çoğalsın, gönlünüz huzur bulsun.'
    ]
  },
  {
    id: 'cuma',
    title: 'Cuma Günü',
    description: 'Mübarek Cuma günü için hazır mesajlar.',
    messages: [
      'Hayırlı Cumalar. Rabbim dualarınızı kabul, gönlünüzü huzurla doldursun.',
      'Cumanız mübarek olsun. Allah evinize bereket, kalbinize ferahlık versin.',
      'Bu mübarek cuma günü hayırlara, affa ve güzel haberlere vesile olsun.',
      'Hayırlı Cumalar. Rabbim sevdiklerinizle sağlık ve huzur içinde yaşamayı nasip etsin.',
      'Cuma’nın rahmeti, bereketi ve nuru üzerinize olsun.',
      'Dualarınız kabul, ibadetleriniz makbul, gününüz huzurlu olsun. Hayırlı Cumalar.',
      'Rabbim bu cuma hürmetine gönlünüzden geçen hayırlı dilekleri kabul eylesin.',
      'Hayırlı Cumalar. Kalplerimiz iyilikle, dillerimiz dua ile dolsun.',
      'Cumanız mübarek olsun; Rabbim işlerimizi kolay, yolumuzu hayırlı eylesin.',
      'Bu güzel gün tüm İslam alemine barış, huzur ve rahmet getirsin.'
    ]
  }
];
