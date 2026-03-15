export interface SpiritualStop {
    id: string;
    name: string;
    city: string;
    descriptionTr: string;
    descriptionEn: string;
    howToGetTr: string;
    howToGetEn: string;
    featuresTr: string;
    featuresEn: string;
    isCustom?: boolean;
}

export const STATIC_STOPS: SpiritualStop[] = [
    // 1 ADANA
    {
        id: 'ada_1', name: 'Sabancı Merkez Camii', city: 'Adana',
        descriptionTr: 'Türkiye\'nin en büyük camilerinden biridir.',
        descriptionEn: 'One of the largest mosques in Turkey.',
        featuresTr: '6 minareli, Osmanlı mimarisi etkisindedir.',
        featuresEn: 'With 6 minarets, influenced by Ottoman architecture.',
        howToGetTr: 'Şehir merkezinde, Merkez Park içerisindedir.',
        howToGetEn: 'Located in the city center, within Central Park.'
    },
    {
        id: 'ada_2', name: 'Ulu Cami', city: 'Adana',
        descriptionTr: 'Ramazanoğulları dönemine ait tarihi bir yapıdır.',
        descriptionEn: 'A historical structure from the Ramazanoğulları period.',
        featuresTr: 'Selçuklu ve Memluk mimari izlerini taşır.',
        featuresEn: 'Carries traces of Seljuk and Mamluk architecture.',
        howToGetTr: 'Tarihi çarşı bölgesinde yer alır.',
        howToGetEn: 'Located in the historical bazaar area.'
    },
    // 2 ADIYAMAN
    {
        id: 'adi_1', name: 'Safvan b. Muattal Türbesi', city: 'Adıyaman',
        descriptionTr: 'Türkiye\'de kabri kesin bilinen iki sahabeden biridir.',
        descriptionEn: 'One of the two companions of the Prophet whose grave is definitely known in Turkey.',
        featuresTr: 'Manevi havası çok yüksek bir ziyaret merkezidir.',
        featuresEn: 'A visiting center with a very high spiritual atmosphere.',
        howToGetTr: 'Samsat ilçesinde, şehir merkezine 40 km uzaklıktadır.',
        howToGetEn: 'In Samsat district, 40 km from the city center.'
    },
    {
        id: 'adi_2', name: 'Ulu Cami', city: 'Adıyaman',
        descriptionTr: 'Dulkadiroğulları dönemine ait tarihi bir yapıdır.',
        descriptionEn: 'A historical structure from the Dulkadiroğulları period.',
        featuresTr: 'Şehrin en eski ve merkezi camisidir.',
        featuresEn: 'The oldest and most central mosque of the city.',
        howToGetTr: 'Şehir merkezinde cadde üzerindedir.',
        howToGetEn: 'On the main street in the city center.'
    },
    // 3 AFYONKARAHİSAR
    {
        id: 'afy_1', name: 'Mevlevi Türbe Camii', city: 'Afyonkarahisar',
        descriptionTr: 'Dünyanın ikinci önemli Mevlevihanesidir.',
        descriptionEn: 'The second most important Mevlevi lodge in the world.',
        featuresTr: 'Mevlevilik kültürü için kritik öneme sahiptir.',
        featuresEn: 'Critical importance for Mevlevi culture.',
        howToGetTr: 'Şehir merkezinde, Mevlevi Caddesi üzerindedir.',
        howToGetEn: 'In the city center, on Mevlevi Street.'
    },
    {
        id: 'afy_2', name: 'Ulu Cami', city: 'Afyonkarahisar',
        descriptionTr: 'Ahşap direkli Selçuklu camilerinin en güzel örneğidir.',
        descriptionEn: 'The most beautiful example of Seljuk mosques with wooden pillars.',
        featuresTr: '40 ahşap direğiyle ünlüdür.',
        featuresEn: 'Famous for its 40 wooden pillars.',
        howToGetTr: 'Hıdırlık Tepesi eteklerinde yer alır.',
        howToGetEn: 'Located at the foot of Hıdırlık Hill.'
    },
    // 4 AĞRI
    {
        id: 'agr_1', name: 'İshak Paşa Sarayı Camii', city: 'Ağrı',
        descriptionTr: 'Osmanlı mimarisinin doğudaki şaheseridir.',
        descriptionEn: 'Ottoman architecture masterpiece in the east.',
        featuresTr: 'Görkemli taş işçiliğiyle bilinir.',
        featuresEn: 'Known for its magnificent stonework.',
        howToGetTr: 'Doğubayazıt ilçesinde bir tepededir.',
        howToGetEn: 'On a hill in Doğubayazıt district.'
    },
    {
        id: 'agr_2', name: 'Ahmed-i Hani Türbesi', city: 'Ağrı',
        descriptionTr: 'Büyük İslam alimi Ahmed-i Hani\'nin kabridir.',
        descriptionEn: 'Tomb of the great Islamic scholar Ahmed-i Hani.',
        featuresTr: 'Bölgenin manevi odak noktasıdır.',
        featuresEn: 'The spiritual focal point of the region.',
        howToGetTr: 'İshak Paşa Sarayı\'nın hemen yanındadır.',
        howToGetEn: 'Just next to the Ishak Pasha Palace.'
    },
    // 5 AMASYA
    {
        id: 'ama_1', name: 'Sultan Bayezid Külliyesi', city: 'Amasya',
        descriptionTr: 'II. Bayezid adına yaptırılmış büyük bir külliyedir.',
        descriptionEn: 'A large complex built in the name of Bayezid II.',
        featuresTr: 'Yeşilırmak kıyısında muazzam bir mimariye sahiptir.',
        featuresEn: 'Has a magnificent architecture on the banks of the Yeşilırmak.',
        howToGetTr: 'Şehir merkezinde yer alır.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'ama_2', name: 'Şirvanlı Camii', city: 'Amasya',
        descriptionTr: 'Azerbaycan Şirvan\'dan gelenlerce yaptırılmıştır.',
        descriptionEn: 'Built by people who came from Shirvan, Azerbaijan.',
        featuresTr: 'Ahşap işçiliği çok zariftir.',
        featuresEn: 'Wooden workmanship is very elegant.',
        howToGetTr: 'Şehir merkezinde, Taşhan yakınındadır.',
        howToGetEn: 'In the city center, near Taşhan.'
    },
    // 6 ANKARA
    {
        id: 'ank_1', name: 'Hacı Bayram-ı Veli Camii', city: 'Ankara',
        descriptionTr: 'Ankara\'nın manevi kalbidir.',
        descriptionEn: 'The spiritual heart of Ankara.',
        featuresTr: 'Hacı Bayram-ı Veli Hz. kabri buradadır.',
        featuresEn: 'The tomb of Saint Haji Bayram-i Veli is here.',
        howToGetTr: 'Ulus semtinde, Augustus Tapınağı yanındadır.',
        howToGetEn: 'In Ulus district, next to the Augustus Temple.'
    },
    {
        id: 'ank_2', name: 'Kocatepe Camii', city: 'Ankara',
        descriptionTr: 'Başkentin en büyük camisidir.',
        descriptionEn: 'The largest mosque in the capital.',
        featuresTr: 'Klasik Osmanlı mimarisi örneğidir.',
        featuresEn: 'An example of classical Ottoman architecture.',
        howToGetTr: 'Kızılay yakınlarında, Kocatepe semtindedir.',
        howToGetEn: 'Near Kızılay, in the Kocatepe district.'
    },
    // 7 ANTALYA
    {
        id: 'ant_1', name: 'Yivli Minare Camii', city: 'Antalya',
        descriptionTr: 'Antalya\'nın simgesidir.',
        descriptionEn: 'Symbol of Antalya.',
        featuresTr: 'Selçuklu dönemine ait dilimli minaresiyle ünlüdür.',
        featuresEn: 'Famous for its fluted minaret from the Seljuk period.',
        howToGetTr: 'Kaleiçi girişinde yer alır.',
        howToGetEn: 'Located at the entrance of Kaleiçi.'
    },
    {
        id: 'ant_2', name: 'Murat Paşa Camii', city: 'Antalya',
        descriptionTr: 'Osmanlı mimarisinin güzel bir örneğidir.',
        descriptionEn: 'A beautiful example of Ottoman architecture.',
        featuresTr: 'Kalem işi süslemeleri görülmeye değerdir.',
        featuresEn: 'Hand-drawn decorations are worth seeing.',
        howToGetTr: 'Şehir merkezinde, Şarampol caddesindedir.',
        howToGetEn: 'In the city center, on Şarampol street.'
    },
    // 8 ARTVİN
    {
        id: 'art_1', name: 'Artvin Merkez Camii', city: 'Artvin',
        descriptionTr: 'Şehrin en eski ve ana camisidir.',
        descriptionEn: 'The oldest and main mosque of the city.',
        featuresTr: 'Geleneksel mimari izleri taşır.',
        featuresEn: 'Carries traditional architectural traces.',
        howToGetTr: 'Şehir merkezinde, çarşı içerisindedir.',
        howToGetEn: 'In the city center, inside the bazaar.'
    },
    {
        id: 'art_2', name: 'Atatepe Camii', city: 'Artvin',
        descriptionTr: 'Şehri kuşbakışı gören modern bir yapıdır.',
        descriptionEn: 'A modern structure with a bird\'s eye view of the city.',
        featuresTr: 'Yüksek bir konumda, ferah bir atmosfer sunar.',
        featuresEn: 'Offers a refreshing atmosphere in a high position.',
        howToGetTr: 'Atatepe bölgesindedir.',
        howToGetEn: 'Located in the Atatepe region.'
    },
    // 9 AYDIN
    {
        id: 'ayd_1', name: 'Aydın Ulu Cami', city: 'Aydın',
        descriptionTr: 'Şehrin en büyük tarihi camisidir.',
        descriptionEn: 'The largest historical mosque of the city.',
        featuresTr: 'Külliye şeklinde inşa edilmiştir.',
        featuresEn: 'Built as a complex.',
        howToGetTr: 'Şehir merkezinde yer alır.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'ayd_2', name: 'Bey Camii', city: 'Aydın',
        descriptionTr: 'Osmanlı dönemine ait zarif bir yapıdır.',
        descriptionEn: 'An elegant structure from the Ottoman period.',
        featuresTr: 'Süslemeleri ve kubbe yapısıyla ünlüdür.',
        featuresEn: 'Famous for its decorations and dome structure.',
        howToGetTr: 'Çarşı meydanında yer alır.',
        howToGetEn: 'Located in the bazaar square.'
    },
    // 10 BALIKESİR
    {
        id: 'bal_1', name: 'Zağnos Paşa Camii', city: 'Balıkesir',
        descriptionTr: 'Fatih Sultan Mehmed\'in veziri tarafından yaptırılmıştır.',
        descriptionEn: 'Built by the vizier of Fatih Sultan Mehmed.',
        featuresTr: 'Atatürk\'ün hutbe okuduğu camidir.',
        featuresEn: 'The mosque where Ataturk delivered a sermon.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'bal_2', name: 'Karesi Bey Türbesi', city: 'Balıkesir',
        descriptionTr: 'Karesi Beyliği\'nin kurucusuna aittir.',
        descriptionEn: 'Belongs to the founder of the Karesi Principality.',
        featuresTr: 'Tarihi bir öneme sahiptir.',
        featuresEn: 'Holds historical importance.',
        howToGetTr: 'Karesi Camii yanındadır.',
        howToGetEn: 'Next to the Karesi Mosque.'
    },
    // 11 BİLECİK
    {
        id: 'bil_1', name: 'Şeyh Edebali Türbesi', city: 'Bilecik',
        descriptionTr: 'Osmanlı\'nın manevi kurucusuna aittir.',
        descriptionEn: 'Belongs to the spiritual founder of the Ottomans.',
        featuresTr: 'Kanyon içerisinde huzurlu bir mekandır.',
        featuresEn: 'A peaceful place within the canyon.',
        howToGetTr: 'Eski Bilecik bölgesindedir.',
        howToGetEn: 'In the Old Bilecik region.'
    },
    {
        id: 'bil_2', name: 'Ertuğrul Gazi Türbesi', city: 'Bilecik',
        descriptionTr: 'Osman Gazi\'nin babasına aittir.',
        descriptionEn: 'Belongs to the father of Osman Gazi.',
        featuresTr: 'Söğüt ilçesinde manevi bir simgedir.',
        featuresEn: 'A spiritual symbol in the Söğüt district.',
        howToGetTr: 'Söğüt ilçesindedir.',
        howToGetEn: 'Located in Söğüt district.'
    },
    // 12 BİNGÖL
    {
        id: 'bin_1', name: 'Merkez Camii', city: 'Bingöl',
        descriptionTr: 'Şehrin ana ibadet merkezidir.',
        descriptionEn: 'The main worship center of the city.',
        featuresTr: 'Modern bir mimariye sahiptir.',
        featuresEn: 'Has a modern architecture.',
        howToGetTr: 'Şehir merkezinde yer alır.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'bin_2', name: 'Şeyh Ahmed Türbesi', city: 'Bingöl',
        descriptionTr: 'Önemli bir kanaat önderine aittir.',
        descriptionEn: 'Belongs to an important opinion leader.',
        featuresTr: 'Huzurlu bir ziyaret noktasıdır.',
        featuresEn: 'A peaceful visiting point.',
        howToGetTr: 'Şehir merkezine yakındır.',
        howToGetEn: 'Close to the city center.'
    },
    // 13 BİTLİS
    {
        id: 'bit_1', name: 'Selçuklu Mezarlığı', city: 'Bitlis',
        descriptionTr: 'Dünyanın en büyük Türk-İslam mezarlığıdır.',
        descriptionEn: 'The world\'s largest Turkish-Islamic cemetery.',
        featuresTr: 'Abidevi mezar taşlarıyla ünlüdür.',
        featuresEn: 'Famous for monumental tombstones.',
        howToGetTr: 'Ahlat ilçesindedir.',
        howToGetEn: 'Located in Ahlat district.'
    },
    {
        id: 'bit_2', name: 'Ulu Cami', city: 'Bitlis',
        descriptionTr: '12. yüzyıl Selçuklu yapısıdır.',
        descriptionEn: 'A 12th-century Seljuk structure.',
        featuresTr: 'Zengin taş süslemeleri vardır.',
        featuresEn: 'Has rich stone decorations.',
        howToGetTr: 'Şehir merkezinde, çarşıdadır.',
        howToGetEn: 'In the city center, in the bazaar.'
    },
    // 14 BOLU
    {
        id: 'bol_1', name: 'Hayreddin Tokadi Türbesi', city: 'Bolu',
        descriptionTr: 'Bolu\'nun manevi hamisidir.',
        descriptionEn: 'The spiritual patron of Bolu.',
        featuresTr: 'Doğa içerisinde huzur dolu bir mekandır.',
        featuresEn: 'A peaceful place within nature.',
        howToGetTr: 'İl merkezine 13 km uzaklıktadır.',
        howToGetEn: '13 km from the city center.'
    },
    {
        id: 'bol_2', name: 'Akşemseddin Türbesi', city: 'Bolu',
        descriptionTr: 'Fatih\'in hocasına aittir.',
        descriptionEn: 'Belongs to the teacher of Fatih.',
        featuresTr: 'Göynük ilçesinin manevi simgesidir.',
        featuresEn: 'The spiritual symbol of Göynük district.',
        howToGetTr: 'Göynük ilçesindedir.',
        howToGetEn: 'Located in Göynük district.'
    },
    // 15 BURDUR
    {
        id: 'bur_d_1', name: 'Ulu Cami', city: 'Burdur',
        descriptionTr: 'Şehrin en eski camisidir.',
        descriptionEn: 'The oldest mosque of the city.',
        featuresTr: 'Görkemli bir tepe üzerindedir.',
        featuresEn: 'On a magnificent hill.',
        howToGetTr: 'Şehir merkezinde yer alır.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'bur_d_2', name: 'Baki Bey Konağı', city: 'Burdur',
        descriptionTr: 'Tarihi ve manevi simgedir.',
        descriptionEn: 'Historical and spiritual symbol.',
        featuresTr: 'Osmanlı sivil mimarisi örneğidir.',
        featuresEn: 'An example of Ottoman civil architecture.',
        howToGetTr: 'Pazar mahallesindedir.',
        howToGetEn: 'In the Pazar neighborhood.'
    },
    // 16 BURSA
    {
        id: 'bur_1', name: 'Bursa Ulu Cami', city: 'Bursa',
        descriptionTr: 'Osmanlı mimarisinin şaheseridir.',
        descriptionEn: 'A masterpiece of Ottoman architecture.',
        featuresTr: '20 kubbeli ve hat yazılarıyla ünlüdür.',
        featuresEn: 'Famous for its 20 domes and calligraphy.',
        howToGetTr: 'Şehir merkezinde yer alır.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'bur_2', name: 'Emir Sultan Camii', city: 'Bursa',
        descriptionTr: 'Bursa\'nın en çok ziyaret edilen türbesidir.',
        descriptionEn: 'The most visited tomb in Bursa.',
        featuresTr: 'Yıldırım ilçesinde manevi bir merkezdir.',
        featuresEn: 'A spiritual center in the Yıldırım district.',
        howToGetTr: 'Emir Sultan semtindedir.',
        howToGetEn: 'In the Emir Sultan neighborhood.'
    },
    // 17 ÇANAKKALE
    {
        id: 'can_1', name: 'Şehitler Abidesi', city: 'Çanakkale',
        descriptionTr: 'Milli bağımsızlık sembolüdür.',
        descriptionEn: 'Symbol of national independence.',
        featuresTr: 'Tüm şehitlerimizin anısına yapılmıştır.',
        featuresEn: 'Built in memory of all our martyrs.',
        howToGetTr: 'Gelibolu Yarımadası\'ndadır.',
        howToGetEn: 'On the Gallipoli Peninsula.'
    },
    {
        id: 'can_2', name: 'Dumlupınar Şehitliği', city: 'Çanakkale',
        descriptionTr: 'Manevi bir ziyaret noktasıdır.',
        descriptionEn: 'A spiritual visiting point.',
        featuresTr: 'Vatan savunmasının simgesidir.',
        featuresEn: 'Symbol of homeland defense.',
        howToGetTr: 'Eceabat ilçesindedir.',
        howToGetEn: 'In Eceabat district.'
    },
    // 18 ÇANKIRI
    {
        id: 'cnk_1', name: 'Ulu Cami', city: 'ÇANKIRI',
        descriptionTr: 'Kanuni dönemine ait tarihi yapı.',
        descriptionEn: 'Historical structure from the Suleiman era.',
        featuresTr: 'Mimar Sinan tasarımının etkilerini taşır.',
        featuresEn: 'Carries the influences of Mimar Sinan\'s design.',
        howToGetTr: 'Şehir merkezinde yer alır.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'cnk_2', name: 'Hacı Ali Efendi Türbesi', city: 'ÇANKIRI',
        descriptionTr: 'Önemli manevi büyüklerden biridir.',
        descriptionEn: 'One of the important spiritual figures.',
        featuresTr: 'Halkın huzur bulduğu bir yerdir.',
        featuresEn: 'A place where people find peace.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    // 19 ÇORUM
    {
        id: 'cor_1', name: 'Ulu Cami', city: 'Çorum',
        descriptionTr: 'Selçuklu etkisi taşıyan tarihi cami.',
        descriptionEn: 'Historical mosque with Seljuk influence.',
        featuresTr: 'Zengin minber işçiliği vardır.',
        featuresEn: 'Has rich minbar workmanship.',
        howToGetTr: 'Şehir merkezinde, meydandadır.',
        howToGetEn: 'In the city center, in the square.'
    },
    {
        id: 'cor_2', name: 'Hıdırlık Sahabe Türbeleri', city: 'Çorum',
        descriptionTr: 'Sahabelerin kabirlerini içeren kutsal mekan.',
        descriptionEn: 'Sacred place containing the graves of companions.',
        featuresTr: 'Şehrin en önemli manevi ziyaret yeridir.',
        featuresEn: 'The most important spiritual visiting place of the city.',
        howToGetTr: 'Hıdırlık mahallesindedir.',
        howToGetEn: 'In the Hıdırlık neighborhood.'
    },
    // 20 DENİZLİ
    {
        id: 'den_1', name: 'Server Gazi Türbesi', city: 'Denizli',
        descriptionTr: 'Şehrin fatihlerinden birine aittir.',
        descriptionEn: 'Belongs to one of the conquerors of the city.',
        featuresTr: 'Park içerisinde huzurlu bir konumdadır.',
        featuresEn: 'Peaceful position within a park.',
        howToGetTr: 'Yenişehir mahallesindedir.',
        howToGetEn: 'In the Yenişehir neighborhood.'
    },
    {
        id: 'den_2', name: 'Akhan Mescidi', city: 'Denizli',
        descriptionTr: 'Selçuklu kervansarayı içinde huzur dolu bir ibadethane.',
        descriptionEn: 'A peaceful place of worship within a Seljuk caravanserai.',
        featuresTr: 'Tarihi Akhan Kervansarayı içerisindedir.',
        featuresEn: 'Inside the historical Akhan Caravanserai.',
        howToGetTr: 'Akkale bölgesindedir.',
        howToGetEn: 'Located in the Akkale region.'
    },
    // 21 DİYARBAKIR
    {
        id: 'diy_1', name: 'Ulu Cami', city: 'Diyarbakır',
        descriptionTr: 'İslam\'ın 5. Harem-i Şerifi kabul edilir.',
        descriptionEn: 'Considered the 5th Haram Sharif of Islam.',
        featuresTr: 'Anadolu\'nun en eski camisidir.',
        featuresEn: 'The oldest mosque in Anatolia.',
        howToGetTr: 'Sur içinde yer alır.',
        howToGetEn: 'Located inside Sur.'
    },
    {
        id: 'diy_2', name: 'Hz. Süleyman Camii', city: 'Diyarbakır',
        descriptionTr: '27 Sahabe kabrini barındıran kutsal mekan.',
        descriptionEn: 'Sacred place hosting 27 companion graves.',
        featuresTr: 'Manevi değeri çok yüksek bir şehitliktir.',
        featuresEn: 'A martyrdom with very high spiritual value.',
        howToGetTr: 'İçkale bölgesindedir.',
        howToGetEn: 'In the İçkale region.'
    },
    // 22 EDİRNE
    {
        id: 'edi_1', name: 'Selimiye Camii', city: 'Edirne',
        descriptionTr: 'Mimar Sinan\'ın ustalık eseridir.',
        descriptionEn: 'Mimar Sinan\'s masterpiece.',
        featuresTr: 'Dünya miras listesinde yer alır.',
        featuresEn: 'On the world heritage list.',
        howToGetTr: 'Şehir merkezinde, tepededir.',
        howToGetEn: 'In the city center, on the hill.'
    },
    {
        id: 'edi_2', name: 'Eski Cami', city: 'Edirne',
        descriptionTr: 'Hat yazılarıyla ünlü ilk dönem Osmanlı yapısı.',
        descriptionEn: 'Early period Ottoman structure famous for its calligraphy.',
        featuresTr: 'Vav harfi ve hat sanatıyla ünlüdür.',
        featuresEn: 'Famous for the letter Vav and calligraphy.',
        howToGetTr: 'Çarşı içerisindedir.',
        howToGetEn: 'Located in the bazaar.'
    },
    // 23 ELAZIĞ
    {
        id: 'ela_1', name: 'Harput Ulu Cami', city: 'Elazığ',
        descriptionTr: 'Eğik minaresiyle meşhur Artuklu eseri.',
        descriptionEn: 'Artuqid work famous for its leaning minaret.',
        featuresTr: 'Selçuklu ve Artuklu mimari sentezidir.',
        featuresEn: 'A synthesis of Seljuk and Artuqid architecture.',
        howToGetTr: 'Harput mahallesindedir.',
        howToGetEn: 'In the Harput neighborhood.'
    },
    {
        id: 'ela_2', name: 'Arap Baba Türbesi', city: 'Elazığ',
        descriptionTr: 'Manevi bir sırra sahip meşhur türbe.',
        descriptionEn: 'Famous tomb with a spiritual secret.',
        featuresTr: 'Harput\'un en çok ziyaret edilen duraklarından biridir.',
        featuresEn: 'One of Harput\'s most visited stops.',
        howToGetTr: 'Harput Kalesi yakınındadır.',
        howToGetEn: 'Near Harput Castle.'
    },
    // 24 ERZİNCAN
    {
        id: 'erz_1', name: 'Terzi Baba Türbesi', city: 'Erzincan',
        descriptionTr: 'Şehrin en büyük manevi önderidir.',
        descriptionEn: 'The greatest spiritual leader of the city.',
        featuresTr: 'Erzincan halkının gönül sultanıdır.',
        featuresEn: 'The sultan of hearts of the people of Erzincan.',
        howToGetTr: 'Merkez mezarlıktadır.',
        howToGetEn: 'In the central cemetery.'
    },
    {
        id: 'erz_2', name: 'Gülabibey Camii', city: 'Erzincan',
        descriptionTr: 'Tarihi ve huzur dolu bir ibadethane.',
        descriptionEn: 'A historical and peaceful place of worship.',
        featuresTr: 'Şehrin en eski yapılarından biridir.',
        featuresEn: 'One of the oldest structures in the city.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    // 25 ERZURUM
    {
        id: 'erzu_1', name: 'Çifte Minareli Medrese', city: 'Erzurum',
        descriptionTr: 'Erzurum\'un sembolü tarihi yapı.',
        descriptionEn: 'The historical structure symbol of Erzurum.',
        featuresTr: 'Selçuklu taş işçiliğinin zirvesidir.',
        featuresEn: 'The pinnacle of Seljuk stonework.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'erzu_2', name: 'Abdurrahman Gazi Türbesi', city: 'Erzurum',
        descriptionTr: 'Şehrin en çok ziyaret edilen manevi mekanı.',
        descriptionEn: 'The most visited spiritual place of the city.',
        featuresTr: 'Peygamber efendimizin sancaktarlarından olduğuna inanılır.',
        featuresEn: 'Believed to be one of the standard-bearers of the Prophet.',
        howToGetTr: 'Şehre 3 km uzaklıktadır.',
        howToGetEn: '3 km from the city.'
    },
    // 26 ESKİŞEHİR
    {
        id: 'esk_1', name: 'Kurşunlu Külliyesi', city: 'Eskişehir',
        descriptionTr: 'Tarihi Odunpazarı bölgesinin kalbidir.',
        descriptionEn: 'The heart of the historical Odunpazarı region.',
        featuresTr: 'Mevlevi kültürünün izlerini taşır.',
        featuresEn: 'Carries traces of Mevlevi culture.',
        howToGetTr: 'Odunpazarı\'ndadır.',
        howToGetEn: 'Located in Odunpazarı.'
    },
    {
        id: 'esk_2', name: 'Yunus Emre Türbesi', city: 'Eskişehir',
        descriptionTr: 'Gönüller sultanı Yunus Emre\'nin kabridir.',
        descriptionEn: 'The tomb of the sultan of hearts, Yunus Emre.',
        featuresTr: 'Sevgi ve hoşgörü merkezi.',
        featuresEn: 'Center of love and tolerance.',
        howToGetTr: 'Mihalıççık ilçesindedir.',
        howToGetEn: 'In Mihalıççık district.'
    },
    // 27 GAZİANTEP
    {
        id: 'gaz_1', name: 'Şirvani Camii', city: 'Gaziantep',
        descriptionTr: 'Gaziantep\'in en eski manevi mekanlarından.',
        descriptionEn: 'One of Gaziantep\'s oldest spiritual places.',
        featuresTr: 'İki şerefeli minaresiyle ünlüdür.',
        featuresEn: 'Famous for its minaret with two balconies.',
        howToGetTr: 'Kale yakınındadır.',
        howToGetEn: 'Near the castle.'
    },
    {
        id: 'gaz_2', name: 'Kurtuluş Camii', city: 'Gaziantep',
        descriptionTr: 'Tarihi dokusuyla huzur veren devasa cami.',
        descriptionEn: 'A massive mosque that gives peace with its historical texture.',
        featuresTr: 'Eski bir kiliseden dönüştürülmüştür.',
        featuresEn: 'Converted from an old church.',
        howToGetTr: 'Tepebaşı mahallesindedir.',
        howToGetEn: 'In the Tepebaşı neighborhood.'
    },
    // 28 GİRESUN
    {
        id: 'gir_1', name: 'Seyyid Vakkas Türbesi', city: 'Giresun',
        descriptionTr: 'Şehrin manevi fatihi kabul edilir.',
        descriptionEn: 'Accepted as the spiritual conqueror of the city.',
        featuresTr: 'Giresun fethinin kahramanıdır.',
        featuresEn: 'Hero of the Giresun conquest.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'gir_2', name: 'Hacı Abdullah Halife Türbesi', city: 'Giresun',
        descriptionTr: 'Bölgenin önemli manevi büyüklerindendir.',
        descriptionEn: 'One of the important spiritual figures of the region.',
        featuresTr: 'Sarıçiçek yaylası girişinde yer alır.',
        featuresEn: 'Located at the entrance of Sarıçiçek plateau.',
        howToGetTr: 'Yağlıdere ilçesindedir.',
        howToGetEn: 'In Yağlıdere district.'
    },
    // 29 GÜMÜŞHANE
    {
        id: 'gum_1', name: 'Süleymaniye Ulu Cami', city: 'Gümüşhane',
        descriptionTr: 'Eski Gümüşhane\'nin tarihi ruhunu taşır.',
        descriptionEn: 'Carries the historical spirit of Old Gümüşhane.',
        featuresTr: 'Gümüşhane\'nin en görkemli tarihi camisidir.',
        featuresEn: 'Gümüşhane\'s most magnificent historical mosque.',
        howToGetTr: 'Süleymaniye mahallesindedir.',
        howToGetEn: 'In the Süleymaniye neighborhood.'
    },
    {
        id: 'gum_2', name: 'Örümcek Ormanı Mescidi', city: 'Gümüşhane',
        descriptionTr: 'Doğa ile baş başa manevi bir durak.',
        descriptionEn: 'A spiritual stop alone with nature.',
        featuresTr: 'Benzersiz bir doğal atmosfer sunar.',
        featuresEn: 'Offers a unique natural atmosphere.',
        howToGetTr: 'Kürtün ilçesindedir.',
        howToGetEn: 'In Kürtün district.'
    },
    // 30 HAKKARİ
    {
        id: 'hak_1', name: 'Meydan Medresesi', city: 'Hakkari',
        descriptionTr: 'İlim ve irfanın bölgedeki kalesidir.',
        descriptionEn: 'The castle of science and wisdom in the region.',
        featuresTr: 'Hakkari\'nin en önemli tarihi yapısıdır.',
        featuresEn: 'Hakkari\'s most important historical structure.',
        howToGetTr: 'Biçer mahallesindedir.',
        howToGetEn: 'In the Biçer neighborhood.'
    },
    {
        id: 'hak_2', name: 'Seyyid Taha Türbesi', city: 'Hakkari',
        descriptionTr: 'Şemdinli\'nin manevi güneşidir.',
        descriptionEn: 'The spiritual sun of Şemdinli.',
        featuresTr: 'Nehri bölgesinin manevi merkezidir.',
        featuresEn: 'The spiritual center of the Nehri region.',
        howToGetTr: 'Nehri köyündedir.',
        howToGetEn: 'In Nehri village.'
    },
    // 31 HATAY
    {
        id: 'hat_1', name: 'Habib-i Neccar Camii', city: 'Hatay',
        descriptionTr: 'Anadolu\'nun ilk camisidir.',
        descriptionEn: 'The first mosque of Anatolia.',
        featuresTr: 'Birlik ve beraberliğin simgesidir.',
        featuresEn: 'Symbol of unity and togethernes.',
        howToGetTr: 'Antakya merkezindedir.',
        howToGetEn: 'Located in Antakya center.'
    },
    {
        id: 'hat_2', name: 'Bayezid-i Bestami Türbesi', city: 'Hatay',
        descriptionTr: 'Büyük İslam mutasavvıfının makamıdır.',
        descriptionEn: 'The station of the great Islamic mystic.',
        featuresTr: 'Tarihi bir tepe üzerindedir.',
        featuresEn: 'On a historical hill.',
        howToGetTr: 'Kırıkhan ilçesindedir.',
        howToGetEn: 'In Kırıkhan district.'
    },
    // 32 ISPARTA
    {
        id: 'isp_1', name: 'Isparta Ulu Cami', city: 'Isparta',
        descriptionTr: 'Gül şehrinin en eski ibadethanesidir.',
        descriptionEn: 'The oldest place of worship in the city of roses.',
        featuresTr: 'Selçuklu etkisi taşıyan tarihi mabet.',
        featuresEn: 'Historical temple with Seljuk influence.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'isp_2', name: 'Bediüzzaman Evi (Barla)', city: 'Isparta',
        descriptionTr: 'Telif edilen eserlerin manevi mekanıdır.',
        descriptionEn: 'The spiritual place of the authored works.',
        featuresTr: 'İnanç turizminin önemli duraklarındandır.',
        featuresEn: 'One of the important stops of faith tourism.',
        howToGetTr: 'Barla köyündedir.',
        howToGetEn: 'In Barla village.'
    },
    // 33 MERSİN (İÇEL)
    {
        id: 'mer_1', name: 'Ashab-ı Kehf Mağarası', city: 'Mersin',
        descriptionTr: 'Yedi Uyurlar kıssasının kutsal mekanı.',
        descriptionEn: 'The sacred place of the story of the Seven Sleepers.',
        featuresTr: 'Dünyaca ünlü tescilli ziyarethanedir.',
        featuresEn: 'World-famous registered pilgrimage site.',
        howToGetTr: 'Tarsus ilçesindedir.',
        howToGetEn: 'In Tarsus district.'
    },
    {
        id: 'mer_2', name: 'Muğdat Camii', city: 'Mersin',
        descriptionTr: 'Şehrin en görkemli modern camisidir.',
        descriptionEn: 'The most magnificent modern mosque in the city.',
        featuresTr: 'Cumhuriyet döneminin en büyük camilerindendir.',
        featuresEn: 'One of the largest mosques of the Republican era.',
        howToGetTr: 'Sahil şeridindedir.',
        howToGetEn: 'On the coastal line.'
    },
    // 34 İSTANBUL
    {
        id: 'ist_1', name: 'Eyüp Sultan Camii', city: 'İstanbul',
        descriptionTr: 'İstanbul\'un manevi kapısıdır.',
        descriptionEn: 'The spiritual gate of Istanbul.',
        featuresTr: 'Ebu Eyyub el-Ensari\'nin kabri buradadır.',
        featuresEn: 'The tomb of Abu Ayyub al-Ansari is here.',
        howToGetTr: 'Eyüpsultan ilçesindedir.',
        howToGetEn: 'In Eyüpsultan district.'
    },
    {
        id: 'ist_2', name: 'Ayasofya-i Kebir Camii', city: 'İstanbul',
        descriptionTr: 'İslam dünyasının kutlu fethinin sembolü.',
        descriptionEn: 'The symbol of the blessed conquest of the Islamic world.',
        featuresTr: 'Mimarisi ve manevi değeri eşsiz dünya mirası.',
        featuresEn: 'Unique world heritage with its architecture and spiritual value.',
        howToGetTr: 'Sultanahmet Meydanı\'ndadır.',
        howToGetEn: 'In Sultanahmet Square.'
    },
    // 35 İZMİR
    {
        id: 'izm_1', name: 'Hisar Camii', city: 'İzmir',
        descriptionTr: 'İzmir\'in kalbinde tarihi ibadethane.',
        descriptionEn: 'Historical place of worship in the heart of Izmir.',
        featuresTr: 'Klasik Osmanlı süsleme sanatının zirvesidir.',
        featuresEn: 'The pinnacle of classical Ottoman decoration art.',
        howToGetTr: 'Kemeraltı Çarşısı\'ndadır.',
        howToGetEn: 'In Kemeraltı Bazaar.'
    },
    {
        id: 'izm_2', name: 'Emir Sultan Türbesi', city: 'İzmir',
        descriptionTr: 'Şehrin en önemli manevi sığınaklarından biri.',
        descriptionEn: 'One of the city\'s most important spiritual shelters.',
        featuresTr: 'İzmir halkının en çok ziyaret ettiği türbedir.',
        featuresEn: 'The most visited tomb by the people of Izmir.',
        howToGetTr: 'Namazgah semtindedir.',
        howToGetEn: 'In the Namazgah neighborhood.'
    },
    // 36 KARS
    {
        id: 'kar_1', name: 'Harakani Türbesi', city: 'Kars',
        descriptionTr: 'Anadolu\'nun manevi fatihlerinden biridir.',
        descriptionEn: 'One of the spiritual conquerors of Anatolia.',
        featuresTr: 'Ebü\'l Hasan Harakani Hz. kabridir.',
        featuresEn: 'The tomb of Abul Hasan Harakani.',
        howToGetTr: 'Kars Kalesi yanındadır.',
        howToGetEn: 'Next to Kars Castle.'
    },
    {
        id: 'kar_2', name: 'Fethiye Camii', city: 'Kars',
        descriptionTr: 'Tarihi fethin simgesi olan cami.',
        descriptionEn: 'The mosque that is the symbol of the historical conquest.',
        featuresTr: 'Eski bir kiliseden dönüştürülmüş anıtsal yapı.',
        featuresEn: 'Monumental structure converted from an old church.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    // 37 KASTAMONU
    {
        id: 'kas_1', name: 'Şeyh Şaban-ı Veli', city: 'Kastamonu',
        descriptionTr: 'Anadolu\'nun dört büyük manevi direğinden biri.',
        descriptionEn: 'One of the four great spiritual pillars of Anatolia.',
        featuresTr: 'Huzurlu bir dergah ve külliye atmosferi.',
        featuresEn: 'A peaceful dervish lodge and complex atmosphere.',
        howToGetTr: 'Hisarardı mahallesindedir.',
        howToGetEn: 'In the Hisarardı neighborhood.'
    },
    {
        id: 'kas_2', name: 'Nasrullah Camii', city: 'Kastamonu',
        descriptionTr: 'Kurtuluş Savaşı\'nın manevi merkezlerinden.',
        descriptionEn: 'One of the spiritual centers of the War of Independence.',
        featuresTr: 'Görkemli şadırvanı ve hat sanatıyla ünlüdür.',
        featuresEn: 'Famous for its magnificent fountain and calligraphy.',
        howToGetTr: 'Meydandadır.',
        howToGetEn: 'In the square.'
    },
    // 38 KAYSERİ
    {
        id: 'kay_1', name: 'Seyyid Burhaneddin Türbesi', city: 'Kayseri',
        descriptionTr: 'Mevlana\'nın hocasının kabridir.',
        descriptionEn: 'Tomb of Rumi\'s teacher.',
        featuresTr: 'Kayseri ilim ve irfan tarihinin merkezidir.',
        featuresEn: 'The center of the history of science and wisdom in Kayseri.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'kay_2', name: 'Hunat Hatun Camii', city: 'Kayseri',
        descriptionTr: 'Selçuklu mimarisinin zarif örneği.',
        descriptionEn: 'Elegant example of Seljuk architecture.',
        featuresTr: 'Hunat Hatun Külliyesi\'nin ana yapısıdır.',
        featuresEn: 'The main structure of the Hunat Hatun Complex.',
        howToGetTr: 'Valilik yanındadır.',
        howToGetEn: 'Next to the Governorate.'
    },
    // 39 KIRKLARELİ
    {
        id: 'kir_1', name: 'Hızır Bey Camii', city: 'Kırklareli',
        descriptionTr: 'Trakya\'nın tarihi dokusunu yansıtır.',
        descriptionEn: 'Reflects the historical fabric of Thrace.',
        featuresTr: 'Kırklareli çarşısının manevi bekçisidir.',
        featuresEn: 'The spiritual guard of the Kırklareli bazaar.',
        howToGetTr: 'Çarşı içerisindedir.',
        howToGetEn: 'Located in the bazaar.'
    },
    {
        id: 'kir_2', name: 'Kadı Ali Camii', city: 'Kırklareli',
        descriptionTr: 'Zarif bir Osmanlı yapısı.',
        descriptionEn: 'An elegant Ottoman structure.',
        featuresTr: 'Sade ve huzurlu bir ibadet ortağı.',
        featuresEn: 'A simple and peaceful prayer partner.',
        howToGetTr: 'Piknik yerleri yakınındadır.',
        howToGetEn: 'Near the picnic areas.'
    },
    // 40 KIRŞEHİR
    {
        id: 'kirs_1', name: 'Ahi Evran Camii', city: 'Kırşehir',
        descriptionTr: 'Ahilik teşkilatının manevi merkezidir.',
        descriptionEn: 'The spiritual center of the Akhism organization.',
        featuresTr: 'Ahi Evran-ı Veli Hz. kabri buradadır.',
        featuresEn: 'The tomb of Ahi Evran-i Veli is here.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'kirs_2', name: 'Cacabey Camii', city: 'Kırşehir',
        descriptionTr: 'Tarihi astronomi medresesi ve cami.',
        descriptionEn: 'Historical astronomy madrasah and mosque.',
        featuresTr: 'Eşsiz mimarisi ve bilimsel önemi vardır.',
        featuresEn: 'Has a unique architecture and scientific importance.',
        howToGetTr: 'Meydandadır.',
        howToGetEn: 'In the square.'
    },
    // 41 KOCAELİ
    {
        id: 'koc_1', name: 'Orhan Camii', city: 'Kocaeli',
        descriptionTr: 'İzmit\'in fethinin sembolü olan tarihi cami.',
        descriptionEn: 'The historical mosque that is the symbol of the conquest of Izmit.',
        featuresTr: 'Kılıçla hutbe geleneğinin sürdüğü kadim mabet.',
        featuresEn: 'The ancient temple where the tradition of sermon with sword continues.',
        howToGetTr: 'Hacı Hasan mahallesindedir.',
        howToGetEn: 'In the Hacı Hasan neighborhood.'
    },
    {
        id: 'koc_2', name: 'Çoban Mustafa Paşa Külliyesi', city: 'Kocaeli',
        descriptionTr: 'Gebze\'nin en önemli tarihi yapısı.',
        descriptionEn: 'The most important historical structure of Gebze.',
        featuresTr: 'Mimar Sinan ve Mimar Hayreddin eseridir.',
        featuresEn: 'A work of Mimar Sinan and Mimar Hayreddin.',
        howToGetTr: 'Gebze ilçe merkezindedir.',
        howToGetEn: 'Located in Gebze district center.'
    },
    // 42 KONYA
    {
        id: 'kon_1', name: 'Mevlana Türbesi', city: 'Konya',
        descriptionTr: 'Mevlana Celaleddin Rumi\'nin kabri ve manevi merkezi.',
        descriptionEn: 'The tomb and spiritual center of Mevlana Celaleddin Rumi.',
        featuresTr: 'Dünyanın en önemli tasavvuf merkezlerinden biridir.',
        featuresEn: 'One of the world\'s most important Sufi centers.',
        howToGetTr: 'Şehir merkezinde, Mevlana Meydanı\'ndadır.',
        howToGetEn: 'Located in the city center, in Mevlana Square.'
    },
    {
        id: 'kon_2', name: 'Aziziye Camii', city: 'Konya',
        descriptionTr: 'Osmanlı Barok mimarisinin eşsiz bir örneği.',
        descriptionEn: 'A unique example of Ottoman Baroque architecture.',
        featuresTr: 'Avrupa ve Osmanlı mimari sentezidir.',
        featuresEn: 'A synthesis of European and Ottoman architecture.',
        howToGetTr: 'Mevlana Müzesi yanındaki çarşı içerisindedir.',
        howToGetEn: 'In the bazaar next to the Mevlana Museum.'
    },
    // 43 KÜTAHYA
    {
        id: 'kut_1', name: 'Ulu Cami', city: 'Kütahya',
        descriptionTr: 'Yıldırım Bayezid döneminden kalma şehzadeler şehri camisi.',
        descriptionEn: 'The city mosque of princes from the Bayezid I period.',
        featuresTr: 'Kütahya çinileriyle süslü tarihi mekan.',
        featuresEn: 'Historical place decorated with Kütahya tiles.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'kut_2', name: 'Hayme Ana Türbesi', city: 'Kütahya',
        descriptionTr: 'Ertuğrul Gazi\'nin annesi, Devlet Ana\'nın kabridir.',
        descriptionEn: 'The tomb of State Mother, the mother of Ertuğrul Gazi.',
        featuresTr: 'Osmanlı\'nın doğuşundaki ana figürdür.',
        featuresEn: 'Main figure in the birth of the Ottomans.',
        howToGetTr: 'Domaniç ilçesindedir.',
        howToGetEn: 'In Domaniç district.'
    },
    // 44 MALATYA
    {
        id: 'mal_1', name: 'Battalgazi Ulu Cami', city: 'Malatya',
        descriptionTr: 'Selçuklu mimarisinin Anadolu\'daki nadide örneklerinden.',
        descriptionEn: 'One of the rare examples of Seljuk architecture in Anatolia.',
        featuresTr: 'İran Selçuklu mimari tarzını yansıtır.',
        featuresEn: 'Reflects the Iranian Seljuk architectural style.',
        howToGetTr: 'Battalgazi ilçesindedir.',
        howToGetEn: 'In Battalgazi district.'
    },
    {
        id: 'mal_2', name: 'Somuncu Baba Türbesi', city: 'Malatya',
        descriptionTr: 'Darende\'de maneviyat ve doğanın buluştuğu nokta.',
        descriptionEn: 'The point where spirituality and nature meet in Darende.',
        featuresTr: 'Tohma Çayı kıyısında doğa harikası bir ziyaretgah.',
        featuresEn: 'A natural wonder sanctuary on the banks of Tohma Stream.',
        howToGetTr: 'Darende ilçesindedir.',
        howToGetEn: 'In Darende district.'
    },
    // 45 MANİSA
    {
        id: 'man_1', name: 'Muradiye Camii', city: 'Manisa',
        descriptionTr: 'Mimar Sinan\'ın tasarladığı görkemli yapı.',
        descriptionEn: 'The magnificent structure designed by Mimar Sinan.',
        featuresTr: 'Klasik Osmanlı mimarisinin zerafetini taşır.',
        featuresEn: 'Carries the elegance of classical Ottoman architecture.',
        howToGetTr: 'Şehir merkezinde yer alır.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'man_2', name: 'Yiğitbaş Veli Türbesi', city: 'Manisa',
        descriptionTr: 'Manisa için büyük önem taşıyan bir manevi durak.',
        descriptionEn: 'A spiritual stop of great importance for Manisa.',
        featuresTr: 'Ahmed Şemseddin Marmaravî Hz. kabridir.',
        featuresEn: 'The tomb of Ahmed Shamsuddin Marmaravi.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    // 46 KAHRAMANMARAŞ
    {
        id: 'kah_1', name: 'Ashab-ı Kehf Külliyesi', city: 'Kahramanmaraş',
        descriptionTr: 'Afşin\'deki Yedi Uyurlar kutsal mekanı.',
        descriptionEn: 'The sacred place of the Seven Sleepers in Afşin.',
        featuresTr: 'Dini ve tarihi bir efsanenin merkezi.',
        featuresEn: 'Center of a religious and historical legend.',
        howToGetTr: 'Afşin ilçesindedir.',
        howToGetEn: 'In Afşin district.'
    },
    {
        id: 'kah_2', name: 'Kahramanmaraş Ulu Cami', city: 'Kahramanmaraş',
        descriptionTr: 'Şehrin en eski ve tarihi mabedi.',
        descriptionEn: 'The oldest and historical temple of the city.',
        featuresTr: 'Dulkadiroğulları dönemine ait anıtsal eser.',
        featuresEn: 'Monumental work from the Dulkadiroğulları period.',
        howToGetTr: 'Çarşı içerisindedir.',
        howToGetEn: 'Located in the bazaar.'
    },
    // 47 MARDİN
    {
        id: 'mar_1', name: 'Zinciriye Medresesi', city: 'Mardin',
        descriptionTr: 'Altın kalpli insanların şehri Mardin\'in simgesi.',
        descriptionEn: 'The symbol of Mardin, the city of people with golden hearts.',
        featuresTr: 'Görkemli taş sanatı ve şehir manzarası.',
        featuresEn: 'Magnificent stone art and city view.',
        howToGetTr: 'Eski Mardin\'dedir.',
        howToGetEn: 'In Old Mardin.'
    },
    {
        id: 'mar_2', name: 'Zeynel Abidin Camii', city: 'Mardin',
        descriptionTr: 'Sahabe kabri barındıran huzur mekanı.',
        descriptionEn: 'A place of peace hosting a companion tomb.',
        featuresTr: 'İnanç turizminin önemli merkezlerinden biridir.',
        featuresEn: 'One of the important centers of faith tourism.',
        howToGetTr: 'Nusaybin ilçesindedir.',
        howToGetEn: 'In Nusaybin district.'
    },
    // 48 MUĞLA
    {
        id: 'mug_1', name: 'Muğla Ulu Cami', city: 'Muğla',
        descriptionTr: '14. yüzyıl Menteşeoğulları yadigarı.',
        descriptionEn: 'Legacy of the Menteşeids from the 14th century.',
        featuresTr: 'Kitabesiyle tarihi kökenleri korunmaktadır.',
        featuresEn: 'Historical origins are preserved with its inscription.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'mug_2', name: 'Şahidi Camii', city: 'Muğla',
        descriptionTr: 'Mevlevi kültürünü yaşatan manevi mekan.',
        descriptionEn: 'Spiritual place keeping the Mevlevi culture alive.',
        featuresTr: 'Şahidi İbrahim Dede\'nin manevi huzuru.',
        featuresEn: 'The spiritual presence of Shahidi Ibrahim Dede.',
        howToGetTr: 'Saburhane mahallesindedir.',
        howToGetEn: 'In the Saburhane neighborhood.'
    },
    // 49 MUŞ
    {
        id: 'mus_1', name: 'Muş Ulu Cami', city: 'Muş',
        descriptionTr: 'Lale şehri Muş\'un tarihi camisi.',
        descriptionEn: 'The historical mosque of the city of tulips, Muş.',
        featuresTr: 'Şehrin en köklü ve ferah ibadethanesi.',
        featuresEn: 'The most deep-rooted and spacious place of worship in the city.',
        howToGetTr: 'Şehir merkezinde, kale altındadır.',
        howToGetEn: 'In the city center, under the castle.'
    },
    {
        id: 'mus_2', name: 'Arak Manastırı Mescidi', city: 'Muş',
        descriptionTr: 'Bölgedeki medeniyetler mozaiğinin bir parçası.',
        descriptionEn: 'A part of the mosaic of civilizations in the region.',
        featuresTr: 'Tarihi dönüşümün ve hoşgörünün simgesi.',
        featuresEn: 'Symbol of historical transformation and tolerance.',
        howToGetTr: 'Karaağaçlı köyündedir.',
        howToGetEn: 'In Karaağaçlı village.'
    },
    // 50 NEVŞEHİR
    {
        id: 'nev_1', name: 'Hacı Bektaş-ı Veli Külliyesi', city: 'Nevşehir',
        descriptionTr: 'Hoşgörü felsefesinin dünyaya yayıldığı merkez.',
        descriptionEn: 'The center where the philosophy of tolerance spread to the world.',
        featuresTr: 'Bektaşilik yolunun manevi karargahıdır.',
        featuresEn: 'The spiritual headquarters of the Bektashi path.',
        howToGetTr: 'Hacıbektaş ilçesindedir.',
        howToGetEn: 'In Hacıbektaş district.'
    },
    {
        id: 'nev_2', name: 'Kurşunlu Camii', city: 'Nevşehir',
        descriptionTr: 'Nevşehirli Damat İbrahim Paşa yadigarı.',
        descriptionEn: 'Legacy of Damat Ibrahim Pasha of Nevşehir.',
        featuresTr: 'Osmanlı Barok mimari öğeleri içerir.',
        featuresEn: 'Contains Ottoman Baroque architectural elements.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    // 51 NİĞDE
    {
        id: 'nig_1', name: 'Niğde Ulu Cami', city: 'Niğde',
        descriptionTr: 'Kapısındaki Arapça ve taş işlemeyle tanınır.',
        descriptionEn: 'Known for the Arabic and stone embroidery on its gate.',
        featuresTr: 'Minberindeki taş işçiliği başyapıt değerindedir.',
        featuresEn: 'Stone workmanship on its minbar is of masterpiece value.',
        howToGetTr: 'Alaeddin Tepesi\'ndedir.',
        howToGetEn: 'In Alaeddin Hill.'
    },
    {
        id: 'nig_2', name: 'Hüdavent Hatun Türbesi', city: 'Niğde',
        descriptionTr: 'Zarif bir Selçuklu dönemi türbesi.',
        descriptionEn: 'An elegant Seljuk period tomb.',
        featuresTr: 'İlhanlı ve Selçuklu mimari karmasıdır.',
        featuresEn: 'A mix of Ilkhanid and Seljuk architecture.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    // 52 ORDU
    {
        id: 'ord_1', name: 'Aziziye Camii', city: 'Ordu',
        descriptionTr: 'Şehrin en merkezi tarihi camisidir.',
        descriptionEn: 'The most central historical mosque of the city.',
        featuresTr: 'Ordu\'nun modernleşen yüzünde bir tarih kalesi.',
        featuresEn: 'A castle of history in the modernizing face of Ordu.',
        howToGetTr: 'Çarşı içerisindedir.',
        howToGetEn: 'Located in the bazaar.'
    },
    {
        id: 'ord_2', name: 'Yalı Camii', city: 'Ordu',
        descriptionTr: 'Görkemli sahil şeridi yakınında manevi durak.',
        descriptionEn: 'A spiritual stop near the magnificent coastal line.',
        featuresTr: 'Deniz kokusuyla maneviyatın birleştiği nokta.',
        featuresEn: 'The point where spirituality meets the smell of the sea.',
        howToGetTr: 'Sahil yolundadır.',
        howToGetEn: 'On the coastal road.'
    },
    // 53 RİZE
    {
        id: 'riz_1', name: 'Şeyh Camii', city: 'Rize',
        descriptionTr: 'Rize\'nin en eski manevi mekanlarındandır.',
        descriptionEn: 'One of Rize\'s oldest spiritual places.',
        featuresTr: 'Taş işçiliğiyle dikkat çeken görkemli yapı.',
        featuresEn: 'Magnificent structure attracting attention with stone workmanship.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'riz_2', name: 'Kıbledağı Camii', city: 'Rize',
        descriptionTr: 'Bulutların üzerindeki görkemli cami.',
        descriptionEn: 'The magnificent mosque above the clouds.',
        featuresTr: 'Muazzam manzarasıyla manevi bir seyir terası.',
        featuresEn: 'A spiritual viewing terrace with its enormous view.',
        howToGetTr: 'Güneysu ilçesindedir.',
        howToGetEn: 'In Güneysu district.'
    },
    // 54 SAKARYA
    {
        id: 'sak_1', name: 'Orhan Camii', city: 'Sakarya',
        descriptionTr: 'Adapazarı\'nın en eski camisi ve fethin sembolü.',
        descriptionEn: 'The oldest mosque in Adapazarı and the symbol of the conquest.',
        featuresTr: 'Adapazarı\'nın kuruluş kimliği niteliğindedir.',
        featuresEn: 'It is in the nature of the founding identity of Adapazarı.',
        howToGetTr: 'Adapazarı merkezindedir.',
        howToGetEn: 'Located in Adapazarı center.'
    },
    {
        id: 'sak_2', name: 'Şeyh Muslihiddin Camii', city: 'Sakarya',
        descriptionTr: 'Çivisiz tarihi ahşap cami.',
        descriptionEn: 'Historical nail-less wooden mosque.',
        featuresTr: 'Mimari harikası ahşap geçme tekniği.',
        featuresEn: 'Wooden interlocking technique architectural wonder.',
        howToGetTr: 'Kaynarca ilçesindedir.',
        howToGetEn: 'In Kaynarca district.'
    },
    // 55 SAMSUN
    {
        id: 'sam_1', name: 'Büyük Cami', city: 'Samsun',
        descriptionTr: 'Karadeniz\'in en büyük ve tarihi camilerinden biri.',
        descriptionEn: 'One of the largest and historical mosques of the Black Sea.',
        featuresTr: 'Kesme taş mimarisiyle şehrin odağıdır.',
        featuresEn: 'The focus of the city with its cut stone architecture.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'sam_2', name: 'Seyyid Kudbettin Türbesi', city: 'Samsun',
        descriptionTr: 'Şehrin manevi önderlerinden birinin kabri.',
        descriptionEn: 'Tomb of one of the spiritual leaders of the city.',
        featuresTr: 'Abdülkadir Geylani Hz. soyundan geldiğine inanılır.',
        featuresEn: 'Believed to have come from the lineage of Abdulqadir Geylani.',
        howToGetTr: 'Kökçüoğlu mahallesindedir.',
        howToGetEn: 'In the Kökçüoğlu neighborhood.'
    },
    // 56 SİİRT
    {
        id: 'sii_1', name: 'Veysel Karani Türbesi', city: 'Siirt',
        descriptionTr: 'Hz. Peygamber sevdalısı Veysel Karani Hz. kabridir.',
        descriptionEn: 'Tomb of Veysel Karani, lover of the Prophet.',
        featuresTr: 'Anne sevgisi ve maneviyatın evrensel simgesi.',
        featuresEn: 'Universal symbol of motherly love and spirituality.',
        howToGetTr: 'Baykan ilçesindedir.',
        howToGetEn: 'In Baykan district.'
    },
    {
        id: 'sii_2', name: 'Tillo Işık Hadisesi (İbrahim Hakkı Hz.)', city: 'Siirt',
        descriptionTr: 'Bilim ve maneviyatın buluştuğu mucizevi yapı.',
        descriptionEn: 'Miraculous structure where science and spirituality meet.',
        featuresTr: 'Güneşin kabre düşme hadisesi meşhurdur.',
        featuresEn: 'The incident of the sun falling on the grave is famous.',
        howToGetTr: 'Tillo ilçesindedir.',
        howToGetEn: 'In Tillo district.'
    },
    // 57 SİNOP
    {
        id: 'sin_1', name: 'Alaeddin Camii', city: 'Sinop',
        descriptionTr: 'Selçuklu fethinin en önemli simgesi.',
        descriptionEn: 'The most important symbol of the Seljuk conquest.',
        featuresTr: 'Tarihi avlusuyla huzurlu bir atmosfer sunar.',
        featuresEn: 'Offers a peaceful atmosphere with its historical courtyard.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'sin_2', name: 'Seyyid Bilal Türbesi', city: 'Sinop',
        descriptionTr: 'Şehrin manevi bekçisi kabul edilen önemli zat.',
        descriptionEn: 'Important figure considered the spiritual guard of the city.',
        featuresTr: 'Sinop yarımadasının manevi kalesidir.',
        featuresEn: 'The spiritual castle of the Sinop peninsula.',
        howToGetTr: 'Yarımadanın uç kısmındadır.',
        howToGetEn: 'At the end of the peninsula.'
    },
    // 58 SİVAS
    {
        id: 'siv_1', name: 'Ulu Cami', city: 'Sivas',
        descriptionTr: 'Eğik minaresiyle meşhur, kadim bir mabet.',
        descriptionEn: 'Ancient temple famous for its leaning minaret.',
        featuresTr: 'Danişmendliler döneminden kalma özgün yapı.',
        featuresEn: 'Original structure from the Danishmendids period.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'siv_2', name: 'Şemseddin Sivas-i Türbesi', city: 'Sivas',
        descriptionTr: 'Sivas\'ın en büyük manevi mimarı.',
        descriptionEn: 'The greatest spiritual architect of Sivas.',
        featuresTr: 'Sivas\'ın kurtuluşunda manevi rolü büyüktür.',
        featuresEn: 'His spiritual role in the liberation of Sivas is great.',
        howToGetTr: 'Meydan Camii haziresindedir.',
        howToGetEn: 'In the Meydan Mosque graveyard.'
    },
    // 59 TEKİRDAĞ
    {
        id: 'tek_1', name: 'Rüstem Paşa Camii', city: 'Tekirdağ',
        descriptionTr: 'Mimar Sinan eseri, kentin tarihi sembolü.',
        descriptionEn: 'Mimar Sinan work, the historical symbol of the city.',
        featuresTr: 'Klasik Osmanlı mimarisinin zarif bir yansıması.',
        featuresEn: 'An elegant reflection of classical Ottoman architecture.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'tek_2', name: 'Eski Cami', city: 'Tekirdağ',
        descriptionTr: 'Sade ve huzurlu bir Osmanlı dönemi camisi.',
        descriptionEn: 'A simple and peaceful Ottoman period mosque.',
        featuresTr: 'Laleli süslemeleri ve tarihi kitabesi dikkat çeker.',
        featuresEn: 'Tulip decorations and historical inscription attract attention.',
        howToGetTr: 'Eski şehir merkezindedir.',
        howToGetEn: 'In the old city center.'
    },
    // 60 TOKAT
    {
        id: 'tok_1', name: 'Tokat Ulu Cami', city: 'Tokat',
        descriptionTr: 'Çini süslemeleri ve tarihiyle büyüleyen mabet.',
        descriptionEn: 'Temple that fascinates with its tile decorations and history.',
        featuresTr: 'Emeviler dönemine kadar uzanan tarihi bir köken.',
        featuresEn: 'A historical origin dating back to the Umayyad period.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'tok_2', name: 'Beysun Camii', city: 'Tokat',
        descriptionTr: 'Tarihi İpek Yolu üzerindeki duraklardan biri.',
        descriptionEn: 'One of the stops on the historical Silk Road.',
        featuresTr: 'Roma ve İslam mimari izlerini bir arada barındırır.',
        featuresEn: 'Hosts Roman and Islamic architectural traces together.',
        howToGetTr: 'Sulusaray ilçesindedir.',
        howToGetEn: 'In Sulusaray district.'
    },
    // 61 TRABZON
    {
        id: 'tra_1', name: 'Ayasofya Camii', city: 'Trabzon',
        descriptionTr: 'Tarihi kiliseden dönüştürülen görkemli cami.',
        descriptionEn: 'Magnificent mosque converted from a historical church.',
        featuresTr: 'Bizans ve İslam mimari öğelerinin eşsiz sentezi.',
        featuresEn: 'Unique synthesis of Byzantine and Islamic architectural elements.',
        howToGetTr: 'Sahil şeridindedir.',
        howToGetEn: 'On the coastal line.'
    },
    {
        id: 'tra_2', name: 'Gülbahar Hatun Camii', city: 'Trabzon',
        descriptionTr: 'Yavuz Sultan Selim\'in annesi adına yaptırılmıştır.',
        descriptionEn: 'Built in the name of Yavuz Sultan Selim\'s mother.',
        featuresTr: 'Osmanlı külliye mimarisinin Trabzon\'daki temsilcisi.',
        featuresEn: 'Representative of Ottoman complex architecture in Trabzon.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    // 62 TUNCELİ
    {
        id: 'tun_1', name: 'Munzur Baba Türbesi (Ziyareti)', city: 'Tunceli',
        descriptionTr: 'Bölge halkı için kutsal kabul edilen en önemli durak.',
        descriptionEn: 'The most important stop considered sacred for the local people.',
        featuresTr: 'Munzur Çayı\'nın doğduğu kutsal bir tabiat köşesi.',
        featuresEn: 'A sacred natural corner where Munzur Stream is born.',
        howToGetTr: 'Ovacık ilçesindedir.',
        howToGetEn: 'In Ovacık district.'
    },
    {
        id: 'tun_2', name: 'Düzgün Baba Türbesi', city: 'Tunceli',
        descriptionTr: 'Manevi sırrı ve hikayesiyle meşhur ziyaret tepesi.',
        descriptionEn: 'Famous visiting hill with its spiritual secret and story.',
        featuresTr: 'Dağın zirvesinde, inziva ve huşu mekanı.',
        featuresEn: 'A place of seclusion and awe at the summit of the mountain.',
        howToGetTr: 'Nazımiye ilçesindedir.',
        howToGetEn: 'In Nazımiye district.'
    },
    // 63 ŞANLIURFA
    {
        id: 'san_1', name: 'Balıklıgöl (Makam-ı İbrahim)', city: 'Şanlıurfa',
        descriptionTr: 'Hz. İbrahim\'in ateşe atıldığı yer kabul edilir.',
        descriptionEn: 'Accepted as the place where Prophet Abraham was thrown into the fire.',
        featuresTr: 'İnanç turizminin dünya çapındaki merkezi.',
        featuresEn: 'The worldwide center of faith tourism.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'san_2', name: 'Hz. Eyyüb Sabır Makamı', city: 'Şanlıurfa',
        descriptionTr: 'Hz. Eyyüb\'ün çilesini ve sabrını simgeleyen mekan.',
        descriptionEn: 'Place symbolizing the suffering and patience of Prophet Job.',
        featuresTr: 'Sabır ve şifa arayanların manevi sığınağı.',
        featuresEn: 'Spiritual shelter for those seeking patience and healing.',
        howToGetTr: 'Eyyübiye semtindedir.',
        howToGetEn: 'In the Eyyübiye district.'
    },
    // 64 UŞAK
    {
        id: 'usa_1', name: 'Uşak Ulu Cami', city: 'Uşak',
        descriptionTr: 'Germiyanoğulları mirası tarihi mabet.',
        descriptionEn: 'Historical temple of Germiyanid legacy.',
        featuresTr: 'Şehrin en eski camisi ve tarih kalesi.',
        featuresEn: 'The oldest mosque and historical castle of the city.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'usa_2', name: 'Burma Camii', city: 'Uşak',
        descriptionTr: 'Görkemli taş süslemeli tarihi mabet.',
        descriptionEn: 'Historical temple with magnificent stone decorations.',
        featuresTr: 'Osmanlı mimarisinin yerel üslup ile harmanlandığı eser.',
        featuresEn: 'A work where Ottoman architecture is blended with local style.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    // 65 VAN
    {
        id: 'van_1', name: 'Van Kalesi Camii (Husrev Paşa)', city: 'Van',
        descriptionTr: 'Van Kalesi eteklerindeki Mimar Sinan eseri.',
        descriptionEn: 'Mimar Sinan work at the foot of Van Castle.',
        featuresTr: 'Klasik Osmanlı üslubunun doğudaki görkemli örneği.',
        featuresEn: 'Majestic example of classical Ottoman style in the east.',
        howToGetTr: 'Kalenin güneyindedir.',
        howToGetEn: 'South of the castle.'
    },
    {
        id: 'van_2', name: 'Abdurrahman Gazi Türbesi', city: 'Van',
        descriptionTr: 'Şehrin manevi koruyucusu olarak görülür.',
        descriptionEn: 'Seen as the spiritual protector of the city.',
        featuresTr: 'Van manzarasını gören kutsal bir tepe.',
        featuresEn: 'A sacred hill overlooking the Van view.',
        howToGetTr: 'Kale yakınında, yüksek bir tepededir.',
        howToGetEn: 'On a high hill near the castle.'
    },
    // 66 YOZGAT
    {
        id: 'yoz_1', name: 'Çapanoğlu Camii', city: 'Yozgat',
        descriptionTr: 'Şehrin kalbinde Osmanlı mimari şaheseri.',
        descriptionEn: 'Ottoman architecture masterpiece in the heart of the city.',
        featuresTr: 'Barok ve Rokoko etkilerinin görüldüğü görkemli iç mekan.',
        featuresEn: 'Magnificent interior where Baroque and Rococo influences are seen.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'yoz_2', name: 'Şeyh Ahmed Efendi Türbesi', city: 'Yozgat',
        descriptionTr: 'Yozgat\'ın manevi mimarlarından birinin kabri.',
        descriptionEn: 'The tomb of one of the spiritual architects of Yozgat.',
        featuresTr: 'Halkın derin saygı duyduğu manevi bir merkez.',
        featuresEn: 'A spiritual center deeply respected by the people.',
        howToGetTr: 'Osmanpaşa beldesindedir.',
        howToGetEn: 'In Osmanpaşa town.'
    },
    // 67 ZONGULDAK
    {
        id: 'zon_1', name: 'Zonguldak Ulu Cami', city: 'Zonguldak',
        descriptionTr: 'Madenci şehrinin en merkezi camisidir.',
        descriptionEn: 'The most central mosque of the miner city.',
        featuresTr: 'Şehrin sosyal ve manevi hayatının merkez noktası.',
        featuresEn: 'The center point of the city\'s social and spiritual life.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'zon_2', name: 'Köksal Baba Türbesi', city: 'Zonguldak',
        descriptionTr: 'Bölge halkı tarafından çok ziyaret edilen manevi mekan.',
        descriptionEn: 'Spiritual place visited frequently by the regional people.',
        featuresTr: 'Halkın huzur ve dua için buluştuğu nokta.',
        featuresEn: 'The point where people meet for peace and prayer.',
        howToGetTr: 'Kozlu ilçesindedir.',
        howToGetEn: 'In Kozlu district.'
    },
    // 68 AKSARAY
    {
        id: 'aks_1', name: 'Somuncu Baba Türbesi', city: 'Aksaray',
        descriptionTr: 'Şeyh Hamid-i Veli Hazretleri\'nin ebedi istirahatgahı.',
        descriptionEn: 'The eternal resting place of Sheikh Hamid-i Veli.',
        featuresTr: 'Manevi feyziyle tüm Anadoluyu aydınlatan büyük zat.',
        featuresEn: 'The great person who enlightened all of Anatolia with his spiritual inspiration.',
        howToGetTr: 'Ervah Mezarlığı yanındadır.',
        howToGetEn: 'Next to Ervah Cemetery.'
    },
    {
        id: 'aks_2', name: 'Aksaray Ulu Cami', city: 'Aksaray',
        descriptionTr: 'Selçuklu mimarisinin görkemli bir örneği.',
        descriptionEn: 'A magnificent example of Seljuk architecture.',
        featuresTr: 'Selçuklu taş işçiliğinin tüm zerafetini taşır.',
        featuresEn: 'Carries all the elegance of Seljuk stonework.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    // 69 BAYBURT
    {
        id: 'bay_1', name: 'Bayburt Ulu Cami', city: 'Bayburt',
        descriptionTr: 'Kadim şehrin en eski manevi kalesi.',
        descriptionEn: 'The oldest spiritual castle of the ancient city.',
        featuresTr: 'Selçuklu mimari mirasının nadide bir örneğidir.',
        featuresEn: 'A rare example of Seljuk architectural heritage.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'bay_2', name: 'Şehit Osman Türbesi', city: 'Bayburt',
        descriptionTr: 'Şehri tepeden gören kutsal bir ziyaret yeri.',
        descriptionEn: 'A sacred visiting place with a birds-eye view of the city.',
        featuresTr: 'Bayburt Kalesi karşısındaki manevi bekçi.',
        featuresEn: 'The spiritual guard opposite Bayburt Castle.',
        howToGetTr: 'Şehit Osman Tepesi\'ndedir.',
        howToGetEn: 'On Şehit Osman Hill.'
    },
    // 70 KARAMAN
    {
        id: 'krm_1', name: 'Aktekke Camii (Mader-i Mevlana)', city: 'Karaman',
        descriptionTr: 'Mevlana\'nın annesi ve kardeşlerinin kabirlerini barındırır.',
        descriptionEn: 'Hosts the graves of Rumi\'s mother and brothers.',
        featuresTr: 'Mevlevilik tarihinin önemli başlangıç noktalarındandır.',
        featuresEn: 'One of the important starting points in the history of Mevleviyye.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'krm_2', name: 'Yunus Emre Camii', city: 'Karaman',
        descriptionTr: 'Büyük mutasavvıf Yunus Emre\'ye atfedilen tarihi mekan.',
        descriptionEn: 'Historical place attributed to the great mystic Yunus Emre.',
        featuresTr: 'Karaman\'ın manevi ve edebi kimliğinin simgesi.',
        featuresEn: 'Symbol of Karaman\'s spiritual and literary identity.',
        howToGetTr: 'Kirişçi mahallesindedir.',
        howToGetEn: 'In the Kirişçi neighborhood.'
    },
    // 71 KIRIKKALE
    {
        id: 'kkk_1', name: 'Nur Camii', city: 'Kırıkkale',
        descriptionTr: 'Kırıkkale\'nin en büyük ve modern simgesi.',
        descriptionEn: 'The largest and most modern symbol of Kırıkkale.',
        featuresTr: 'Selçuklu ve Osmanlı mimari esintileriyle modern tasarım.',
        featuresEn: 'Modern design with Seljuk and Ottoman architectural breezes.',
        howToGetTr: 'Şehir merkezinde, meydana hakim konundadır.',
        howToGetEn: 'In the city center, overlooking the square.'
    },
    {
        id: 'kkk_2', name: 'Hasandede Türbesi', city: 'Kırıkkale',
        descriptionTr: 'Manevi bir feyiz kaynağı olan önemli ziyarethane.',
        descriptionEn: 'An important pilgrimage site, a source of spiritual inspiration.',
        featuresTr: 'Hasandede Hz. manevi huzurunun adresi.',
        featuresEn: 'The address of the spiritual peace of Hasandede.',
        howToGetTr: 'Hasandede köyündedir.',
        howToGetEn: 'In Hasandede village.'
    },
    // 72 BATMAN
    {
        id: 'bat_1', name: 'Gıyaseddin Türbesi (Yakın bölge)', city: 'Batman',
        descriptionTr: 'Bölgenin manevi odak noktası olan büyük zat.',
        descriptionEn: 'The great person who is the spiritual focal point of the region.',
        featuresTr: 'Hasankeyf\'in manevi havasını yansıtan mabet.',
        featuresEn: 'Temple reflecting the spiritual atmosphere of Hasankeyf.',
        howToGetTr: 'Ziyaret beldesindedir.',
        howToGetEn: 'Located in the Ziyaret town.'
    },
    {
        id: 'bat_2', name: 'Batman Zeynel Bey Türbesi', city: 'Batman',
        descriptionTr: 'Hasankeyf\'in en önemli manevi yadigarı.',
        descriptionEn: 'The most important spiritual legacy of Hasankeyf.',
        featuresTr: 'Akkoyunlu mimarisinin bezemeleriyle ünlü şaheseri.',
        featuresEn: 'Masterpiece of Akkoyunlu architecture famous for its decorations.',
        howToGetTr: 'Hasankeyf yeni yerleşkesindedir.',
        howToGetEn: 'In the new Hasankeyf settlement.'
    },
    // 73 ŞIRNAK
    {
        id: 'sir_1', name: 'Hz. Nuh Türbesi', city: 'Şırnak',
        descriptionTr: 'Tufandan sonra Nuh Peygamber\'in kabrinin olduğuna inanılan yer.',
        descriptionEn: 'The place believed to be the grave of Prophet Noah after the flood.',
        featuresTr: 'İnsanlığın ikinci doğuşunun manevi simgesi.',
        featuresEn: 'Spiritual symbol of the second birth of humanity.',
        howToGetTr: 'Cizre ilçesinin merkezindedir.',
        howToGetEn: 'Located in Cizre district center.'
    },
    {
        id: 'sir_2', name: 'İsmail Ebul-İz El Cezeri Türbesi', city: 'Şırnak',
        descriptionTr: 'Büyük İslam alimi ve sibernetiğin kurucusunun kabridir.',
        descriptionEn: 'Tomb of the great Islamic scholar and founder of cybernetics.',
        featuresTr: 'Bilim ve maneviyatın aynı kabirde buluştuğu mekan.',
        featuresEn: 'The place where science and spirituality meet in the same grave.',
        howToGetTr: 'Cizre ilçesindedir.',
        howToGetEn: 'In Cizre district.'
    },
    // 74 BARTIN
    {
        id: 'brt_1', name: 'Bartın Şadırvanlı Cami', city: 'Bartın',
        descriptionTr: 'Şehrin kalbinde tarihi ve huzurlu bir cami.',
        descriptionEn: 'A historical and peaceful mosque in the heart of the city.',
        featuresTr: 'Pencere ve kapı süslemeleriyle dikkat çeken yapı.',
        featuresEn: 'Structure attracting attention with window and door decorations.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'brt_2', name: 'Ebu Derda Türbesi', city: 'Bartın',
        descriptionTr: 'Sahabe adına makam olarak inşa edilen manevi durak.',
        descriptionEn: 'Spiritual stop built as a station in the name of the companion.',
        featuresTr: 'Bartın\'ın en eski manevi sığınağıdır.',
        featuresEn: 'The oldest spiritual shelter of Bartın.',
        howToGetTr: 'Şehir merkezinde bir tepededir.',
        howToGetEn: 'On a hill in the city center.'
    },
    // 75 ARDAHAN
    {
        id: 'ard_1', name: 'Ardahan Merkez Camii', city: 'Ardahan',
        descriptionTr: 'Şehrin en eski ve ana mabetlerinden biri.',
        descriptionEn: 'One of the city\'s oldest and main temples.',
        featuresTr: 'Sade ve vakur Rus dönemi taş işçiliği esintileri.',
        featuresEn: 'Simple and dignified Russian period stone workmanship breezes.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'ard_2', name: 'Kaptanpaşa Camii', city: 'Ardahan',
        descriptionTr: 'Zarif taş mimarisiyle dikkat çeken tarihi eser.',
        descriptionEn: 'Historical work attracting attention with its elegant stone architecture.',
        featuresTr: 'Ardahan çarşısının huzur durağıdır.',
        featuresEn: 'The peace stop of the Ardahan bazaar.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    // 76 IĞDIR
    {
        id: 'igd_1', name: 'Iğdır Ulu Cami', city: 'Iğdır',
        descriptionTr: 'Şehrin en merkezi ve büyük ibadethanesi.',
        descriptionEn: 'The most central and large place of worship in the city.',
        featuresTr: 'Modern mimari ile inancın buluşma noktası.',
        featuresEn: 'Meeting point of modern architecture and faith.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'igd_2', name: 'Yedi Yetimler Türbesi', city: 'Iğdır',
        descriptionTr: 'Manevi bir hüznü ve huzuru barındıran ziyaretgah.',
        descriptionEn: 'A sanctuary that holds spiritual sadness and peace.',
        featuresTr: 'Halk efsaneleriyle örülü manevi bir durak.',
        featuresEn: 'A spiritual stop woven with folk legends.',
        howToGetTr: 'İl merkezine yakın bir köydedir.',
        howToGetEn: 'In a village near the city center.'
    },
    // 77 YALOVA
    {
        id: 'yal_1', name: 'Yalova Merkez Camii', city: 'Yalova',
        descriptionTr: 'Huzurlu bahçesi ve merkezi konumuyla şehrin odağı.',
        descriptionEn: 'The focal point of the city with its peaceful garden and central location.',
        featuresTr: 'Şehir hayatının ortasında ferah bir durak.',
        featuresEn: 'A refreshing stop in the middle of city life.',
        howToGetTr: 'Sahile yakın, şehir merkezindedir.',
        howToGetEn: 'Near the coast, in the city center.'
    },
    {
        id: 'yal_2', name: 'Hacı Banu Camii', city: 'Yalova',
        descriptionTr: 'Çiftlikköy bölgesinde zarif bir manevi durak.',
        descriptionEn: 'An elegant spiritual stop in the Çiftlikköy region.',
        featuresTr: 'Yöresel mimari doku ve huzurlu iç mekan.',
        featuresEn: 'Local architectural texture and peaceful interior.',
        howToGetTr: 'Çiftlikköy ilçesindedir.',
        howToGetEn: 'In Çiftlikköy district.'
    },
    // 78 KARABÜK
    {
        id: 'kbk_1', name: 'Safranbolu Ulu Cami', city: 'Karabük',
        descriptionTr: 'Dünya miras kenti Safranbolu\'nun tarihi mabetlerinden.',
        descriptionEn: 'One of the historical temples of the world heritage city Safranbolu.',
        featuresTr: 'Tarihi mahalle ortasında, asırlık taş yapı.',
        featuresEn: 'Centuries-old stone structure in the middle of the historical neighborhood.',
        howToGetTr: 'Safranbolu eski çarşıdadır.',
        howToGetEn: 'In Safranbolu old bazaar.'
    },
    {
        id: 'kbk_2', name: 'Köprülü Mehmet Paşa Camii', city: 'Karabük',
        descriptionTr: 'Osmanlı sadrazamı tarafından yaptırılan şaheser.',
        descriptionEn: 'A masterpiece built by the Ottoman grand vizier.',
        featuresTr: 'Safranbolu\'nun silüetindeki en değerli parçalardan biridir.',
        featuresEn: 'One of the most valuable pieces in the silhouette of Safranbolu.',
        howToGetTr: 'Safranbolu tarihi alanındadır.',
        howToGetEn: 'In the historical area of Safranbolu.'
    },
    // 79 KİLİS
    {
        id: 'kis_1', name: 'Kilis Ulu Cami', city: 'Kilis',
        descriptionTr: 'Sınır boylarının kadim manevi kalesi.',
        descriptionEn: 'The ancient spiritual castle of the border lines.',
        featuresTr: 'Ortadoğu ve Anadolu mimari esintilerinin sentezi.',
        featuresEn: 'Synthesis of Middle Eastern and Anatolian architectural breezes.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'kis_2', name: 'Sahabe Türbeleri (Kilis)', city: 'Kilis',
        descriptionTr: 'Çok sayıda sahabenin kabrine ev sahipliği yapar.',
        descriptionEn: 'Hosts many companion graves.',
        featuresTr: 'İnanç turizminin bölgedeki en yoğun duraklarındandır.',
        featuresEn: 'One of the most intense stops of faith tourism in the region.',
        howToGetTr: 'Şehir etrafındaki tepelerdedir.',
        howToGetEn: 'On the hills around the city.'
    },
    // 80 OSMANİYE
    {
        id: 'osm_1', name: 'Envar-ül Hamit Camii', city: 'Osmaniye',
        descriptionTr: 'Şehrin en köklü ve tarihi manevi mekanı.',
        descriptionEn: 'The most deep-rooted and historical spiritual place of the city.',
        featuresTr: 'Osmaniye\'nin tarihi kimliğinin çekirdeğidir.',
        featuresEn: 'The core of Osmaniye\'s historical identity.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'osm_2', name: 'Şehit Ali Kılıç Türbesi', city: 'Osmaniye',
        descriptionTr: 'Milli mücadele kahramanının manevi huzuru.',
        descriptionEn: 'The spiritual presence of the national struggle hero.',
        featuresTr: 'Vatan sevgisi ve maneviyatın birleştiği nokta.',
        featuresEn: 'The point where love for homeland and spirituality meet.',
        howToGetTr: 'İl merkezine yakındır.',
        howToGetEn: 'Close to the city center.'
    },
    // 81 DÜZCE
    {
        id: 'duz_1', name: 'Merkez Büyük Cami', city: 'Düzce',
        descriptionTr: 'Düzce\'nin kalbinde modern ve ferah bir mabet.',
        descriptionEn: 'A modern and spacious temple in the heart of Düzce.',
        featuresTr: 'Modern şehircilik ile dini hassasiyetin örnek yapısı.',
        featuresEn: 'The exemplary structure of modern urbanism and religious sensitivity.',
        howToGetTr: 'Şehir merkezindedir.',
        howToGetEn: 'Located in the city center.'
    },
    {
        id: 'duz_2', name: 'Akçakoca Merkez Camii', city: 'Düzce',
        descriptionTr: 'Modern mimarisi ve deniz manzarasıyla eşsiz bir cami.',
        descriptionEn: 'A unique mosque with its modern architecture and sea views.',
        featuresTr: 'Çadır formundaki tasarımıyla dünyaca ünlü ödüllü cami.',
        featuresEn: 'World-famous award-winning mosque with its tent-shaped design.',
        howToGetTr: 'Akçakoca ilçesindedir.',
        howToGetEn: 'In Akçakoca district.'
    }
];
