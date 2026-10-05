/* =========================================================
   OTOREHBER 2026 – Kapsamlı Araç Veritabanı
   Bütün popüler modeller, gerçekçi görseller, detaylı kronik sorunlar,
   ekspertiz kontrol noktaları ve zayıf yönler.
   ========================================================= */

const BRANDS = {
  "Fiat":          { country: "İtalya",    flag: "🇮🇹", tier: "Bütçe",     desc: "Bursa Tofaş üretimi Egea ile Türkiye'nin en çok satan markalarından; ucuz parça ve her mahallede servis." },
  "Dacia":         { country: "Romanya",   flag: "🇷🇴", tier: "Bütçe",     desc: "Fiyat/performans odaklı, sade ve dayanıklı araçlar. Renault mekaniği ve LPG uyumuyla ekonomik." },
  "Renault":       { country: "Fransa",    flag: "🇫🇷", tier: "Ana Akım",  desc: "Bursa Oyak-Renault üretimi Clio ve Megane ile yaygın servis ağı ve düşük ikinci el değer kaybı." },
  "Opel":          { country: "Almanya",   flag: "🇩🇪", tier: "Ana Akım",  desc: "Stellantis çatısı altında Alman tasarımı; pratik, zengin donanımlı Corsa ve Astra modelleri." },
  "Peugeot":       { country: "Fransa",    flag: "🇫🇷", tier: "Ana Akım",  desc: "Şık fütüristik tasarım, i-Cockpit iç mekân; SUV pazarında (2008, 3008) çok güçlü pazar payı." },
  "Citroën":       { country: "Fransa",    flag: "🇫🇷", tier: "Ana Akım",  desc: "Kademeli hidrolik yastıklı (PHC) ultra konforlu süspansiyonlar ve esnek aile araçları." },
  "DS":            { country: "Fransa",    flag: "🇫🇷", tier: "Premium",   desc: "Fransız lüks sanatını yansıtan özel iç mekân dikişleri, saat tasarımlı farlar ve seçkinlik." },
  "Hyundai":       { country: "G. Kore",   flag: "🇰🇷", tier: "Ana Akım",  desc: "İzmit üretimi i10, i20 ve Bayon; 5 yıl fabrika garantisi, zengin donanım ve sorunsuzluk." },
  "Kia":           { country: "G. Kore",   flag: "🇰🇷", tier: "Ana Akım",  desc: "Sportif modern çizgiler, uzun garanti süresi ve donanımlı Sportage, Ceed, EV6 ailesi." },
  "Toyota":        { country: "Japonya",   flag: "🇯🇵", tier: "Ana Akım",  desc: "Sakarya üretimi Corolla ve C-HR; kendi kendini şarj eden hibrit öncüsü, kurşun geçirmez dayanıklılık." },
  "Honda":         { country: "Japonya",   flag: "🇯🇵", tier: "Ana Akım",  desc: "Yüksek devirli VTEC motorlar, keskin sürüş dinamiği ve Türkiye'de altın gibi korunan 2. el değeri." },
  "Nissan":        { country: "Japonya",   flag: "🇯🇵", tier: "Ana Akım",  desc: "Crossover sınıfının mucidi Qashqai ve elektrik motorundan güç alan yenilikçi e-Power hibrit." },
  "Suzuki":        { country: "Japonya",   flag: "🇯🇵", tier: "Ana Akım",  desc: "Boosterjet motorlar, AllGrip 4x4 teknolojisi, hafif ve dayanıklı Swift ile dağ keçisi Jimny." },
  "Subaru":        { country: "Japonya",   flag: "🇯🇵", tier: "Ana Akım",  desc: "Simetrik Sürekli Dört Çeker (Symmetrical AWD) ve Boxer motor; kar, kış ve yağmurda rakipsiz güvenlik." },
  "Volkswagen":    { country: "Almanya",   flag: "🇩🇪", tier: "Ana Akım",  desc: "Yüksek malzeme kalitesi, tok kapı sesi, ikinci elde anında nakde dönüşme ve geniş ürün gamı." },
  "Skoda":         { country: "Çekya",     flag: "🇨🇿", tier: "Ana Akım",  desc: "VW altyapısı + sınıf lideri devasa bagajlar (Octavia, Superb, Kodiaq) ve 'Simply Clever' pratik çözümler." },
  "Seat":          { country: "İspanya",   flag: "🇪🇸", tier: "Ana Akım",  desc: "VW grubunun Akdenizli genç, dinamik ve uygun fiyatlı hatchback ve SUV modelleri." },
  "Cupra":         { country: "İspanya",   flag: "🇪🇸", tier: "Ana Akım",  desc: "Bakır detaylı agresif tasarım, sportif süspansiyon ve Formentor ile yakalanan dev başarı." },
  "Ford":          { country: "ABD",       flag: "🇺🇸", tier: "Ana Akım",  desc: "Kocaeli Otosan ticari devi, sınıfının en iyi yol tutan Focus/Puma şasisi ve efsane Ranger/Mustang." },
  "Togg":          { country: "Türkiye",   flag: "🇹🇷", tier: "Ana Akım",  desc: "Gemlik doğumlu yerli gururumuz; akıllı yaşam cihazı konsepti, C-SUV T10X ve şık sedan T10F." },
  "Tesla":         { country: "ABD",       flag: "🇺🇸", tier: "Premium",   desc: "Elektrikli araç devriminin lideri; Supercharger ağı, kusursuz otonom yazılımı ve muazzam ivmelenme." },
  "BYD":           { country: "Çin",       flag: "🇨🇳", tier: "Ana Akım",  desc: "Dünyanın en büyük EV üreticisi; delinmeye dayanıklı Blade LFP batarya ve Türkiye fabrika yatırımı." },
  "Chery":         { country: "Çin",       flag: "🇨🇳", tier: "Bütçe",     desc: "Fiyatına göre lüks sınıf donanımlar, güçlü 1.6 turbo benzinli motor ve agresif pazar fiyatlaması." },
  "MG":            { country: "Çin / İng.",flag: "🇬🇧", tier: "Bütçe",     desc: "Köklü İngiliz mirası, SAIC teknolojisi; uygun fiyatlı MG4 EV ve ZS Hybrid modelleri." },
  "BMW":           { country: "Almanya",   flag: "🇩🇪", tier: "Premium",   desc: "'Gerçek Sürüş Keyfi', 50:50 mükemmel ağırlık dağılımı, arkadan itiş genetiği ve M performans efsanesi." },
  "Mercedes-Benz": { country: "Almanya",   flag: "🇩🇪", tier: "Premium",   desc: "Dünyada otomobili icat eden marka; konfor, prestij, sessizlik ve güvenlikte küresel referans noktası." },
  "Audi":          { country: "Almanya",   flag: "🇩🇪", tier: "Premium",   desc: "'Teknoloji ile bir adım önde'; quattro efsanevi dört çeker sistemi, Matrix LED ve sanal kokpit." },
  "Volvo":         { country: "İsveç",     flag: "🇸🇪", tier: "Premium",   desc: "Dünyanın en güvenli otomobilleri; İskandinav minimalist lüksü, ortopedik koltuklar ve sağlam çelik." },
  "Alfa Romeo":    { country: "İtalya",    flag: "🇮🇹", tier: "Premium",   desc: "Saf otomobil tutkusu, keskin direksiyon hissi ve İtalyan zarafetini taşıyan Giulia, Tonale, Stelvio." },
  "Lexus":         { country: "Japonya",   flag: "🇯🇵", tier: "Premium",   desc: "Toyota'nın ultra lüks kolu; sıfır arıza vizyonu, Takumi usta işçiliği ve fısıltı sessizliğinde kabin." },
  "Jeep":          { country: "ABD",       flag: "🇺🇸", tier: "Ana Akım",  desc: "4x4 arazinin mucidi; ikonik 7 ızgara tasarımı, Trail Rated kaya tırmanma yeteneği." },
  "Land Rover":    { country: "İngiltere", flag: "🇬🇧", tier: "Lüks",      desc: "Kraliyet lüksü ile zorlu arazinin birleşimi; Range Rover ve durdurulamaz Defender." },
  "Porsche":       { country: "Almanya",   flag: "🇩🇪", tier: "Lüks",      desc: "Her gün sürülebilen yarış otomobilleri; 911 efsanesi, PDK şanzıman mükemmelliği ve Taycan." },
  "Ferrari":       { country: "İtalya",    flag: "🇮🇹", tier: "Egzotik",   desc: "Maranello yarış genetiği, yırtıcı motor sesi ve koleksiyon değeri taşıyan süper spor şaheserler." },
  "Lamborghini":   { country: "İtalya",    flag: "🇮🇹", tier: "Egzotik",   desc: "Sant'Agata boğası; köşeli uçak tasarımları, V10/V12 gücü ve süper SUV Urus." }
};

const CATEGORIES = {
  "Hatchback":         { icon: "hatch",   desc: "Kompakt boyutlar, dar sokaklarda kıvrak manevra ve kolay park. Şehir içi ve ilk araç için ideal." },
  "Sedan":             { icon: "sedan",   desc: "Ayrı bagaj bölmesi, otoyolda dengeli sürüş ve düşük rüzgâr sesi. Türkiye'nin geleneksel aile tercihi." },
  "Station Wagon":     { icon: "wagon",   desc: "Sedan konforu ve yol tutuşuyla devasa bagaj hacminin birleşimi. Uzun yol ve kamp tutkunları için eşsiz." },
  "Crossover":         { icon: "suv",     desc: "Hatchback boyutunda yüksek oturma pozisyonu ve kasislerden rahat geçiş. Modern şehirli tercihi." },
  "SUV":               { icon: "suv",     desc: "Geniş iç mekân, yüksek görüş açısı, heybetli görünüm ve zorlu hava koşullarında 4x4 güvenliği." },
  "Arazi (4x4)":       { icon: "offroad", desc: "Ayrı merdiven şasi, arazi şanzımanı (kilitli diferansiyel), derin su ve çamur geçiş yeteneği." },
  "Pick-up":           { icon: "pickup",  desc: "1 ton taşıma ve 3.5 ton çekme kapasitesi; arazi, şantiye, tarım ve hobi için vazgeçilmez güç." },
  "MPV / Aile":        { icon: "van",     desc: "7 kişilik esnek koltuk kombinasyonu, düz zemin ve devasa yaşam alanı; kalabalık aileler için konfor." },
  "Hafif Ticari":      { icon: "van",     desc: "Hem işte yük taşımaya hem hafta sonu aileyle gezmeye uygun, düşük maliyetli milli araç sınıfı." },
  "Coupe":             { icon: "coupe",   desc: "İki kapılı veya fastback aerodinamik silüet, sportif alçak ağırlık merkezi ve saf sürüş zevki." },
  "Cabrio / Roadster": { icon: "coupe",   desc: "Açılabilir kumaş/metal tavan, rüzgârı hissetme keyfi; sahil şeritleri ve güneşli rotaların yıldızı." },
  "Süper Spor":        { icon: "coupe",   desc: "Yarış pisti teknolojisi, 500+ beygir güç, karbon fiber gövde ve baş döndürücü 0-100 ivmelenmesi." }
};

const BUDGETS = [
  { key: "giris",    name: "Giriş Seviyesi",        min: 0,          max: 1500000,    color: "#22c55e", desc: "Öğrenci, yeni başlayanlar, şehir içi ucuz ulaşım ve filo araçları (1.5 Mn ₺ altı)." },
  { key: "ekonomik", name: "Ekonomik & Aile",       min: 1500000,    max: 2500000,    color: "#84cc16", desc: "Türkiye pazarının kalbi; C segment sedanlar, kompakt SUV'lar ve uygun elektrikli araçlar." },
  { key: "orta",     name: "Orta & Üst Segment",    min: 2500000,    max: 4200000,    color: "#eab308", desc: "Dolu donanımlı D segment sedanlar, 4x4 SUV'lar, hibritler ve performanslı hot-hatch'ler." },
  { key: "premium",  name: "Premium Sınıf",         min: 4200000,    max: 8500000,    color: "#f97316", desc: "Alman premium üçlüsü (BMW 3/5, Mercedes C/E, Audi A4/A6), lüks crossover ve Volvo güvenliği." },
  { key: "luks",     name: "Lüks & Prestij",        min: 8500000,    max: 22000000,   color: "#ef4444", desc: "Amiral gemisi sedanlar (S-Class, 7 Serisi), Porsche ailesi ve büyük Range Rover modelleri." },
  { key: "egzotik",  name: "Süper Lüks & Egzotik",   min: 22000000,   max: Infinity,   color: "#a855f7", desc: "Ferrari, Lamborghini, süper sporlar ve ultra lüks koleksiyon başyapıtları." }
];

/* ---------------------------------------------------------
   KAPSAMLI KRONİK SORUNLAR ANSİKLOPEDİSİ
   Her sorunun belirtileri, ortaya çıkış km'si, ekspertiz kontrol noktası ve tamir masrafı
   --------------------------------------------------------- */
const ISSUES = {
  dsg_dq200: {
    title: "Kuru Kavrama DSG (DQ200) Mekatronik & Kavrama Titremesi",
    sev: 3,
    area: "Şanzıman / Mekatronik",
    cost: "45.000 – 120.000 ₺",
    mileage: "Genellikle 60.000 – 90.000 km arasında",
    symptoms: "Dur-kalk trafikte 1'den 2'ye geçerken silkeleme, aracı sarsan titreme, geri viteste vuruntu, kadranda vites işaretinin yanıp sönmesi ve mekatronik basınç düşüklüğü.",
    inspectionTip: "İkinci el alırken dik yokuşta durup ayağınızı frenden çekin ve hafif gaz verin. Titreme ve sarsıntı varsa kavrama bitmiştir. Mekatronik basınç tüpü revizyon faturasını isteyin.",
    desc: "VW Grubu (VW, Skoda, Seat, Audi) 7 ileri kuru kavrama DSG şanzımanda yoğun trafikte ısınan sürtünme balataları erken aşınır; mekatronik gövdesindeki basınç tüpü yuvası çatlar.",
    solution: "Trafikte aracı yarım debriyaj süründürmeyin, frene tam basın. İkinci elde kavrama ve mekatronik revizyon geçmişini kontrol ettirin."
  },
  dsg_wet: {
    title: "Islak Kavrama DSG (DQ381 / DQ250) Yağ Bakımı Hassasiyeti",
    sev: 1,
    area: "Şanzıman",
    cost: "12.000 – 22.000 ₺ (Periyodik Şanzıman Yağı)",
    mileage: "Her 60.000 km'de bir bakım gerekir",
    symptoms: "Bakım aksatılırsa vites geçişlerinde sertleşme, elektrovanaların tıkanması ve gecikmeli vites atma.",
    inspectionTip: "Yetkili veya uzman servis bakım geçmişinde 60.000 km şanzıman yağı ve filtresi değişim kaydını kontrol edin.",
    desc: "Yüksek torklu 2.0 motorlardaki ıslak kavrama DSG'ler mekanik olarak sağlamdır ancak yağı ihmal edilirse iç filtre ve mekatronik valfleri tıkanır.",
    solution: "Her 60.000 km'de bir orijinal şanzıman yağı ve filtresi değişimini aksatmayın."
  },
  puretech_belt: {
    title: "1.2 PureTech Islak Triger Kayışı Erimesi & Yağ Pompası Tıkanması",
    sev: 3,
    area: "Motor İçi Yağlama & Fren Vakumu",
    cost: "40.000 – 250.000 ₺ (Sandık Motor Riskine Kadar)",
    mileage: "40.000 – 70.000 km / 4-5 yıl",
    symptoms: "Kadranda 'Düşük Yağ Basıncı' uyarısı, fren pedalında sertleşme (vakum pompası tıkandığı için fren tutmama riski) ve aşırı yağ eksiltme.",
    inspectionTip: "Motor yağ dolum kapağını açın; kayışın sırtını fenerle inceleyin. Kenarlarında çatlama, pamuklanma veya soyulma varsa o aracı kayış değişmeden kesinlikle almayın.",
    desc: "Peugeot, Citroën ve Opel 1.2 PureTech motorda triger kayışı motor yağı içinde döner. Benzin buharı kayış kauçuğunu çözer, dökülen parçalar yağ süzgecini ve fren pompasını tıkar.",
    solution: "Kayış genişliğini her bakımda ölçtürün, değişimi 60.000 km'ye çekin ve mutlaka sadece PSA B71 2010 onaylı özel yağ kullanın."
  },
  adblue_crystal: {
    title: "AdBlue Depo Isıtıcısı & Pompa Kristalleşmesi",
    sev: 2,
    area: "Emisyon / SCR Sistemi",
    cost: "30.000 – 65.000 ₺",
    mileage: "70.000 – 120.000 km",
    symptoms: "Göstergede motor arıza lambası ve 'Motor Çalıştırma 1100 km Sonra Engellenecek' uyarısı, AdBlue seviyesinin algılanamaması.",
    inspectionTip: "Arıza tespit cihazına bağlatıp SCR / AdBlue pompa basınç testini yaptırın; depoda kristalleşme olup olmadığını inceletin.",
    desc: "PSA BlueHDi ve Ford EcoBlue dizellerde AdBlue sıvısı buharlaşarak kristalleşir ve depo içine entegre pompayı kilitler; depo komple değişmek zorunda kalır.",
    solution: "AdBlue eklerken kristalleşme önleyici katkı sıvısı kullanın; depoyu çeyreğin altına düşürmeyin."
  },
  egea_oil_fire: {
    title: "1.4 Fire Atmosferik Motor Yağ Eksiltme Eğilimi",
    sev: 1,
    area: "Motor Yağlama",
    cost: "500 – 2.000 ₺ (Takip & İlave)",
    mileage: "Sıfır kilometreden itibaren",
    symptoms: "Yağ çubuğu seviyesinin her 1.500 - 2.000 km'de bir minimum çizgisinin altına inmesi; virajlarda yağ lambasının anlık göz kırpması.",
    inspectionTip: "İkinci el alırken yağ çubuğunu çekin, seviyeyi kontrol edin. Motorun alt karterinde yağ terlemesi olup olmadığına bakın.",
    desc: "Fiat Egea 1.4 Fire 95 HP motorda segman toleransları fabrikasyon olarak geniştir; yüksek devirli kullanımda subap ve silindir duvarından yağ yanma odasına karışır.",
    solution: "Bagajda 1 litre Selenia 5W-40 yağ bulundurun; her 2.000 km'de bir düz zeminde motor soğukken çubuğu kontrol edip eksileni tamamlayın."
  },
  edc_shudder: {
    title: "Renault EDC Kuru Çift Kavrama Isınması ve Beyin Arızası",
    sev: 2,
    area: "Şanzıman / Şanzıman Beyni",
    cost: "30.000 – 85.000 ₺",
    mileage: "80.000 – 120.000 km",
    symptoms: "Sıkışık trafikte 'Vites Kutusunu Kontrol Ettirin' ikazı, 1. vitesten kalkışta silkeleme ve geri vitese zor geçiş.",
    inspectionTip: "Aracı yarım saat şehir içinde ısıtın, ardından hafif yokuşta durup kalkış yapın. Vuruntu ve gecikme var mı kontrol edin.",
    desc: "Megane ve Clio EDC şanzımanda elektro-mekanik aktüatör beyni aşırı ısıdan lehim çatlağı yapabilir; kuru debriyaj balatası dur-kalkta erken biter.",
    solution: "Yoğun trafikte vitesi manuel moda alarak 1. viteste sabit kalın; yokuşta gazla aracı asılı tutmayın."
  },
  bmw_oil_leaks: {
    title: "Külbütör Kapak Contası, Yağ Filtre Kütüğü & Plastik Su Flanşları",
    sev: 2,
    area: "Motor & Soğutma Sistemi",
    cost: "18.000 – 55.000 ₺",
    mileage: "80.000 – 120.000 km",
    symptoms: "Havalandırmadan gelen yanık yağ kokusu, egzoz manifoldu üzerine damlayan yağ, antifriz seviyesinin gizlice düşmesi ve genleşme kabı hortumu çatlaması.",
    inspectionTip: "Kaputu açıp motorun sağ tarafına (egzoz manifoldu üstü) bakın. Yağ buharı veya kurum izi varsa külbütör contası bitmiştir. Su flanşlarını kontrol edin.",
    desc: "BMW motorları yüksek çalışma sıcaklığına (105-110°C) sahiptir. Bu sıcaklık plastik ve kauçuk contaları zamanla sertleştirip gevrek hale getirir.",
    solution: "100.000 km bakımında külbütör kapağı, filtre kütük contası ve plastik su borularını orijinal OEM parçalarla yenileyin."
  },
  mercedes_m274: {
    title: "M274 1.6 / 2.0 Turbo Termostat Gövdesi & Kam Mili Dişlisi",
    sev: 2,
    area: "Motor & Soğutma",
    cost: "25.000 – 75.000 ₺",
    mileage: "90.000 – 140.000 km",
    symptoms: "Hararet göstergesinin 90 dereceye çıkamaması veya dalgalanması, ilk soğuk çalıştırmada 2-3 saniye metalik zincir çatırtısı sesi.",
    inspectionTip: "Sabah ilk çalıştırmada motorun sesini dışarıdan dinleyin. 'Trrrr' şeklinde zincir dişlisi sesi geliyorsa vanos dişlisi aşınmıştır.",
    desc: "C180, C200 ve E180 modellerindeki elektronik kontrollü termostat rezistansı bozulur; kam mili ayar vanos dişlileri yağ basıncı tutamaz.",
    solution: "Termostat uyarısı çıktığında ertelemeden değiştirin; motor yağı değişimini 10.000 km'yi geçirmeden kaliteli MB onaylı yağla yapın."
  },
  mercedes_airmatic: {
    title: "Airmatic Havalı Süspansiyon Körük Kaçağı & Kompresör Yanması",
    sev: 3,
    area: "Süspansiyon Sistemi",
    cost: "45.000 – 190.000 ₺",
    mileage: "100.000 – 150.000 km / 7-8 yıl",
    symptoms: "Araç gece park edildikten sonra sabah tek köşesinden çamurluğa basmış şekilde durması; göstergede 'Aracı Çalıştırmayın - Çok Alçak' ikazı.",
    inspectionTip: "Aracı düz zeminde stop edin ve 1 saat bekleyin. Dört tekerlek ile çamurluk arasındaki mesafeyi parmakla ölçün; çökme varsa körük kaçırıyordur.",
    desc: "Kauçuk havalı körükler zamanla gözenek açarak hava sızdırır. Kompresör sürekli çalışmak zorunda kaldığı için aşırı ısınıp yanar.",
    solution: "Körük indiğinde kompresörü yakmamak için hemen körük revizyonu veya sıfır parça taktırın."
  },
  toyota_cvt_drone: {
    title: "e-CVT / Multidrive S Yüksek Devir Motor Uğultusu (Karakteristik)",
    sev: 1,
    area: "Şanzıman Sürüş Hissi",
    cost: "0 ₺ (Teknik Arıza Değildir)",
    mileage: "Karakteristiktir",
    symptoms: "Ani gaza basıldığında motor devrinin aniden 4500-5000 RPM'e fırlayıp hız artana kadar sabit bağırması.",
    inspectionTip: "Test sürüşünde dipgaz yapın ve motor sesine alışıp alışamayacağınızı test edin. Mekanik olarak dünyanın en sorunsuz sistemidir.",
    desc: "Toyota hibrit gezegen dişli e-CVT şanzımanı debriyajsızdır. Devir ile hız doğrudan bağlı olmadığı için hızlanırken motor sesi sabit kalır.",
    solution: "Kademeli hızlanma (Pulse and Glide) tekniğiyle hem yakıt tüketimini düşürün hem sessiz sürüş sağlayın."
  },
  honda_c_pillar: {
    title: "Civic FC5 Kasa C Sütunu Dalgalanma / Sac Esnemesi",
    sev: 1,
    area: "Gövde Sacı / Kaporta",
    cost: "5.000 – 15.000 ₺ (Fabrika Köpük Uygulaması)",
    mileage: "İlk 1-2 yıl içinde",
    symptoms: "Arka camın hemen yanındaki tavan direğinde (C sütununda) ışık altında bakıldığında hafif göçük veya dalgalanma görünümü.",
    inspectionTip: "Güneş altında veya sokak lambası altında arka tavan birleşim sacına açılı bakın; dalgalanma var mı kontrol edin.",
    desc: "2016-2018 arası FC5 Civic'lerde iç yapıştırıcı mastik ve ince tavan sacı esnemesi sebebiyle görsel dalgalanma oluşmuştur.",
    solution: "Yetkili serviste iç dolgu sünger/köpük bülteni uygulanmış veya kontrol edilmiş araçları tercih edin."
  },
  honda_oil_dilution: {
    title: "1.5 VTEC Turbo Soğukta Yağa Benzin Karışması (Oil Dilution)",
    sev: 2,
    area: "Motor Yağlama",
    cost: "4.000 – 15.000 ₺",
    mileage: "Kış aylarında kısa mesafede",
    symptoms: "Yağ seviyesinin max çizgisinin üstüne çıkması ve motor yağ çubuğunu kokladığınızda yoğun çiğ benzin kokusu gelmesi.",
    inspectionTip: "Ekspertizde motor yağı çubuğunu koklayın ve seviyesini kontrol edin. Seviye normalse sorun yoktur.",
    desc: "Direkt enjeksiyonlu turbo motorda motor ısınmadan yapılan 2-3 kilometrelik kısa sürüşlerde silindir duvarındaki çiğ yakıt kartere sızar.",
    solution: "Kışın aracı en az 10-15 dakika çalışır tutacak mesafelerde sürün; motor yağı değişimini 8.000 km'de bir yaptırın."
  },
  hyundai_kia_dct: {
    title: "Hyundai & Kia 7-DCT Kuru Çift Kavrama Isınma İkazı",
    sev: 2,
    area: "Şanzıman",
    cost: "25.000 – 75.000 ₺",
    mileage: "70.000 – 110.000 km",
    symptoms: "Dik yokuşta dur-kalk yaparken ekranda 'Şanzıman Sıcaklığı Yüksek, Güvenli Bir Yerde Durun' sesli uyarısı ve kalkışta titreme.",
    inspectionTip: "Yoğun trafikte ve dik rampada test sürüşü yapın. 1. vitesten 2. vitese geçerken kavrama kaçırma veya silkeleme var mı bakın.",
    desc: "Kuru kavramalı 7-DCT şanzımanda tork konvertörü olmadığı için dik yokuşlarda yarım debriyajda balatalar çok hızlı ısınır.",
    solution: "Rampada gaza basarak arabayı havada tutmayın, frene tam basın. Çok sıkışık trafikte manuel vites moduna alın."
  },
  ford_powershift: {
    title: "PowerShift Kuru Kavrama Robotik Şanzıman Vuruntusu & TCM Beyin",
    sev: 3,
    area: "Şanzıman / TCM Beyin",
    cost: "40.000 – 95.000 ₺",
    mileage: "60.000 – 100.000 km",
    symptoms: "Kalkışta takırtı sesi, vites atmama, 'Şanzıman Arızası Hemen Servise Gidin' yazısı ve aniden çekişten düşme.",
    inspectionTip: "Focus veya Fiesta alırken şanzımanın kuru PowerShift mi yoksa tork konvertörlü mü olduğunu mutlaka teyit edin. TCM değişim faturasını isteyin.",
    desc: "Ford'un kuru çift kavramalı PowerShift şanzımanında çatal burçları tozlanır ve TCM beyni sıcaklıktan arıza yapar.",
    solution: "Mümkünse tork konvertörlü yeni 8 ileri modelleri seçin; PowerShift'te TCM yazılım güncellemelerini yetkili serviste yaptırın."
  },
  chery_fuel_infotainment: {
    title: "Yüksek Şehir İçi Tüketim & Multimedya Ekran Resetleme",
    sev: 1,
    area: "Tüketim & Elektronik",
    cost: "0 ₺ (Yazılım Güncellemesi)",
    mileage: "İlk günden itibaren",
    symptoms: "Şehir içi dur-kalk trafikte tüketimin 11 - 12.5 litreye çıkması; multimedya ekranının telefon bağlıyken aniden kararıp yeniden başlaması.",
    inspectionTip: "Multimedya yazılım sürümünü kontrol edin; servis tarafından son OTA güncellemesinin yüklenmiş olduğundan emin olun.",
    desc: "1.6 TGDI güçlü motor ve 1.7 tonluk ağır SUV gövdesi şehir içi trafiğinde yakıt tüketimini artırır; arayüz yazılımı bazen RAM şişmesi yaşar.",
    solution: "Yetkili servisteki en güncel ekran yazılımını yükletin; şehir içinde Eco sürüş modunu tercih edin."
  },
  togg_infotainment: {
    title: "Erken Üretim Serilerinde Ekran Gecikmesi & Bagaj Sensörü",
    sev: 1,
    area: "Yazılım / Elektronik",
    cost: "0 ₺ (Ücretsiz OTA Güncelleme)",
    mileage: "İlk teslimatlarda",
    symptoms: "Geniş ekranın ilk açılışta 10-15 saniye geç kendine gelmesi, akıllı bagaj açma sensörünün çamurlu havalarda ayağı algılamaması.",
    inspectionTip: "Ayarlar menüsünden Togg işletim sistemi sürümünü kontrol edin. En son 1.4+ yazılım kuruluysa sorunların %90'ı çözülmüştür.",
    desc: "Yerli üretim ilk parti araçlarda Android Automotive tabanlı arayüzün optimize edilmemiş sürümleri kullanılmıştı.",
    solution: "Aracı evde Wi-Fi ağına bağlayarak en son uzaktan yazılım güncellemelerini (OTA) eksiksiz tamamlayın."
  },
  tesla_panel_gap: {
    title: "Kasa Panel Boşlukları & Sert Arka Süspansiyon",
    sev: 1,
    area: "Montaj Kalitesi & Konfor",
    cost: "0 ₺ (Teslimat Ayarı)",
    desc: "Çamurluk ve kapı aralıklarında 1-2 mm'lik hizalama farkları; keskin kasislerde arka süspansiyonun darbe sesi yapması.",
    symptoms: "Bozuk yolda arkadan gelen vuruntu hissi, cam tavan perdesi olmaması sebebiyle yaz sıcağında kabinin ısınması.",
    inspectionTip: "Teslim alırken kontrol listesiyle kapı fitillerini, bagaj kapağı boşluklarını ve ön salıncak burçlarını kontrol edin.",
    solution: "Salıncak burç sesinde garantiden ücretsiz parça değişimi yaptırın; tavan için güneşlik filesi edinin."
  },
  dpf_clog: {
    title: "Dizel Partikül Filtresi (DPF) & EGR Kurum Tıkanması",
    sev: 2,
    area: "Egzoz Emisyon",
    cost: "15.000 – 45.000 ₺",
    mileage: "60.000 – 100.000 km (Kısa mesafe kullanımında)",
    symptoms: "Kadranda sarı partikül filtresi lambası, çekişte belirgin düşüş, stop edince fanın dakikalarca bağırması.",
    inspectionTip: "Ekspertizde bilgisayara bağlatıp DPF doluluk oranını (kurum gramajını) ölçtürün. %70 üzerindeyse rejenerasyon gerekir.",
    desc: "Sadece şehir içinde 3-5 km sürülüp kapatılan dizel araçlarda egzoz gazı 600°C'ye ulaşamaz ve filtredeki kurumlar yakılamaz.",
    solution: "Ayda 1-2 kez otoyola çıkıp 2500 devirde 30 dakika sabit sürüş yapın; kaliteli düşük küllü (Low-SAPS) yağ kullanın."
  },
  ev_winter_range: {
    title: "Kış Şartlarında Batarya Menzil Kaybı (%25 - %35)",
    sev: 1,
    area: "Batarya Verimliliği",
    cost: "0 ₺ (Fizik Kuralı)",
    mileage: "Kış mevsiminde (-5°C ve altı)",
    symptoms: "Yazın 450 km giden bataryanın kışın 310-330 km'ye düşmesi; hızlı şarj süresinin soğuk batarya sebebiyle uzaması.",
    inspectionTip: "Elektrikli araç satın alırken aracın 'Isı Pompalı' (Heat Pump) donanıma sahip olup olmadığını teyit edin.",
    desc: "Soğuk hava lityum iyon pillerin kimyasal tepkimesini yavaşlatır; kabin kaloriferi bataryadan yüksek güç çeker.",
    solution: "Aracı şarjdayken önceden ısıtın (pre-conditioning); koltuk ısıtmasını kabin klimasından daha çok kullanın."
  },
  landrover_air_elec: {
    title: "Elektronik Sensör Hataları & Havalı Süspansiyon Valfleri",
    sev: 3,
    area: "Elektronik & Süspansiyon",
    cost: "50.000 – 250.000 ₺",
    mileage: "80.000 – 130.000 km",
    symptoms: "Göstergede hayalet arıza uyarıları, multimedya ekranının donması, arazi modları arasında geçiş yaparken gecikme.",
    inspectionTip: "Yetkili servis cihazıyla tüm ECU beyinlerinin arıza hafızasını okutun; havalı süspansiyon yükseklik kalibrasyonunu test edin.",
    desc: "Araçta 40'tan fazla bağımsız elektronik kontrol ünitesi bulunur; akü voltajı azıcık düştüğünde dahi hatalar tetiklenir.",
    solution: "Akü durumunu sürekli sağlıklı tutun; araç satın alırken mutlaka garanti uzatma paketi yaptırın."
  },
  fiat_rattle: {
    title: "İç Mekân Trim Tıkırtıları & Viraj Demiri Gıcırtısı",
    sev: 1,
    area: "İç Trim & Şasi",
    cost: "1.000 – 5.000 ₺",
    mileage: "30.000 km sonrası",
    symptoms: "Kasislerden ve bozuk yollardan geçerken torpido plastiklerinden gelen çıtırtılar, ön takımdan gelen lastik gıcırtısı.",
    inspectionTip: "Bozuk parke taşlı bir yolda test sürüşü yapıp iç mekân trim seslerini dinleyin.",
    desc: "Sert plastik kapı panelleri ve viraj demir lastiklerinin tozlanması sonucu oluşan masrafsız kozmetik seslerdir.",
    solution: "Viraj demir lastiklerine silikon sprey sıktırın; trim birleşimlerine bez bant uygulaması yaptırın."
  }
};

/* ---------------------------------------------------------
   ZENGİN ARAÇ LİSTESİ (HER MODEL İÇİN GERÇEK & ÖZGÜN FOTOĞRAF)
   --------------------------------------------------------- */
const CARS = [
  // ==================== GİRİŞ SEVİYESİ (0 - 1.5 Mn ₺) ====================
  {
    brand: "Fiat", model: "Egea Sedan 1.4 Fire", cat: "Sedan", segment: "C Segment", fuel: "Benzin",
    price: 1250000, hp: 95, torque: 127, acc: 11.5, top: 186, cons: 6.4, drive: "FWD", trans: "Manuel",
    clr: 150, trunk: 520, seats: 5, comfort: 6, maint: 1, resale: 5,
    img: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80",
    issues: ["egea_oil_fire", "fiat_rattle"],
    weaknesses: [
      "120 km/s üzerinde kabin içine giren belirgin rüzgâr ve tekerlek yuvarlanma sesi",
      "Yokuşlarda ve sollamalarda zayıf çekiş (95 HP torksuz atmosferik motor rampada klima açıkken bayılır)",
      "Sert plastik kapı ve göğüs panellerinden bozuk yolda gelen trim tıkırtıları",
      "Her 1.500 - 2.000 km'de bir motor yağı ekleme zorunluluğu"
    ],
    highlights: ["Türkiye'nin en ucuz parça ve bakım maliyeti", "520 litrelik devasa aile bagajı", "LPG dönüşümüne %100 uyumlu sorunsuz atmosferik motor", "İkinci elde anında nakde dönen altın değerinde piyasa"],
    pros: ["Ekonomik satın alma fiyatı", "Her tamircide anında çözülen basit mekanik", "Geniş iç mekân ve aile konforu"],
    cons: ["Atmosferik motor sebebiyle zayıf ara hızlanmalar", "Düzenli yağ eksiltme takibi ister", "120 km/s üzeri yol sesi"]
  },
  {
    brand: "Fiat", model: "Egea Cross 1.5 Hibrit", cat: "Crossover", segment: "C Segment", fuel: "Hibrit",
    price: 1480000, hp: 130, torque: 240, acc: 10.4, top: 190, cons: 5.0, drive: "FWD", trans: "Otomatik",
    clr: 190, trunk: 440, seats: 5, comfort: 7, maint: 1, resale: 5,
    img: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=900&q=80",
    issues: ["fiat_rattle"],
    weaknesses: [
      "7 ileri çift kavramalı şanzıman 1'den 2'ye geçerken trafikte hafif tereddüt ve silkeleme yapabilir",
      "Arka koltuk baş mesafesi tavan eğimi sebebiyle uzun boylular için sedandan biraz daha alçak",
      "Kasislerde arka torsiyon çubuğunun sert darbe vurması"
    ],
    highlights: ["190 mm yerden yükseklikle kasis ve hafif arazide büyük rahatlık", "Elektrik motoruyla dur-kalkta sıfır yakıt tüketimi", "7 ileri çift kavramalı otomatik konforu", "Yerli üretim uygun kasko ve sigorta tarifesi"],
    pros: ["Cross gövdeyle şık ve kaslı duruş", "Düşük şehir içi yakıt tüketimi", "Geniş servis ağı"],
    cons: ["Şanzıman 1'den 2'ye geçerken hafif kararsızlık yaşayabilir", "Sert plastik kapı döşemeleri"]
  },
  {
    brand: "Fiat", model: "Doblo Combi 1.5 BlueHDi", cat: "Hafif Ticari", segment: "K-Hafif Ticari", fuel: "Dizel",
    price: 1380000, hp: 100, torque: 250, acc: 13.0, top: 172, cons: 5.3, drive: "FWD", trans: "Manuel",
    clr: 175, trunk: 850, seats: 5, comfort: 6, maint: 1, resale: 5,
    img: "https://images.unsplash.com/photo-1588644525273-f37b60d78512?auto=format&fit=crop&w=900&q=80",
    issues: ["adblue_crystal", "dpf_clog"],
    weaknesses: [
      "AdBlue kristalleşmesi nedeniyle depo ve pompa arıza riski",
      "Şehir içi kısa mesafeli kullanımda dizel partikül filtresinin (DPF) çabuk dolması",
      "Kamyonet ruhsatı sebebiyle her yıl araç muayenesi zorunluluğu ve otoyollarda düşük hız limiti"
    ],
    highlights: ["850 litrelik devasa bagaj ve çift sürgülü kapı pratikliği", "Hem esnafın işine hem ailenin pikniğine kusursuz uyum", "Düşük mazot tüketimi ve yüksek taşıma kapasitesi"],
    pros: ["Muazzam yükleme hacmi", "Dayanıklı yürüyen aksam", "İkinci elde çok hızlı el değiştirme"],
    cons: ["Yıllık muayene zorunluluğu", "Şehir içi kısa mesafede DPF tıkanma riski"]
  },
  {
    brand: "Renault", model: "Clio 1.0 TCe Otomatik", cat: "Hatchback", segment: "B Segment", fuel: "Benzin",
    price: 1450000, hp: 90, torque: 160, acc: 12.2, top: 180, cons: 5.4, drive: "FWD", trans: "Otomatik",
    clr: 145, trunk: 391, seats: 5, comfort: 7, maint: 1, resale: 5,
    img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=80",
    issues: ["edc_shudder"],
    weaknesses: [
      "Arka koltuk diz mesafesi uzun boylu yolcular için sınıfında dardır",
      "Yoğun dur-kalk trafikte otomatik şanzıman ısınabilir ve kalkışta hafif titreme yapabilir",
      "Easy Link multimedya ekranının bazen telefonu geç tanıması veya Bluetooth kopması"
    ],
    highlights: ["Sınıfının en geniş bagajlarından biri (391 Litre)", "Bursa Oyak-Renault üretimi; Türkiye'nin en sevilen hatchback'i", "Yumuşak dokulu kaliteli ön konsol malzemesi", "Şehir içinde kıvrak manevra ve dar sokaklara park kolaylığı"],
    pros: ["Çok düşük yakıt tüketimi", "Şehir içinde inanılmaz kıvrak ve parkı kolay", "Yüksek ikinci el değeri"],
    cons: ["Arka diz mesafesi kısıtlı", "Kuru kavrama trafikte özenli kullanım ister"]
  },
  {
    brand: "Dacia", model: "Sandero Stepway 1.0 TCe ECO-G", cat: "Hatchback", segment: "B Segment", fuel: "Benzin",
    price: 1190000, hp: 100, torque: 170, acc: 11.8, top: 177, cons: 6.2, drive: "FWD", trans: "Manuel",
    clr: 201, trunk: 410, seats: 5, comfort: 5, maint: 1, resale: 4,
    img: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80",
    issues: ["fiat_rattle"],
    weaknesses: [
      "110 km/s üzerinde kabin içine giren yüksek rüzgâr ve motor sesi (ses yalıtımı zayıftır)",
      "İç mekânın tamamında kullanılan sert ve çizilmeye müsait plastik malzeme",
      "Koltuk süngerlerinin uzun yolculuklarda bel desteğinin yetersiz kalması"
    ],
    highlights: ["Fabrikasyon LPG (ECO-G) sistemiyle kilometre başına Türkiye'nin en ucuz yakıt maliyeti", "201 mm yerden yükseklikle gerçek SUV'ları aratmayan alt açıklık", "Modüler akıllı tavan barları"],
    pros: ["İnanılmaz düşük kilometre maliyeti", "Köy ve stabilize yollarda altını sürtme derdi yok", "Basit ve dayanıklı mekanik"],
    cons: ["Sert plastik malzeme kalitesi", "110 km/s üzerinde belirgin rüzgâr sesi"]
  },
  {
    brand: "Hyundai", model: "i20 1.4 MPI Otomatik", cat: "Hatchback", segment: "B Segment", fuel: "Benzin",
    price: 1390000, hp: 100, torque: 134, acc: 12.4, top: 176, cons: 6.5, drive: "FWD", trans: "Otomatik",
    clr: 140, trunk: 352, seats: 5, comfort: 7, maint: 1, resale: 4,
    img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80",
    issues: ["fiat_rattle"],
    weaknesses: [
      "Atmosferik 1.4 MPI motor ara hızlanmalarda ağırkanlıdır; yokuşlarda devir yükseltmek gerekir",
      "Şehir içi dur-kalk trafiğinde yakıt tüketimi 7.5 - 8.2 litrelere çıkabilir",
      "Bagaj eşiğinin biraz yüksek olması ağır bavulların yüklenmesini zorlaştırır"
    ],
    highlights: ["İzmit fabrikası üretimi; yerli montaj kalitesi", "Tam otomatik tork konvertörlü şanzıman (çift kavrama gibi bozulmaz, geri kaçırmaz)", "5 yıl 100.000 km üretici garantisi", "Geniş arka koltuk diz mesafesi"],
    pros: ["Tork konvertörlü şanzımanla sıfır arıza riski", "Sorunsuz atmosferik motor", "Geniş kabin ferahlığı"],
    cons: ["Ara hızlanmalar ağırkanlı", "Şehir içi tüketim turbo motorlara göre biraz yüksek"]
  },
  {
    brand: "Citroën", model: "Berlingo 1.5 BlueHDi", cat: "Hafif Ticari", segment: "K-Hafif Ticari", fuel: "Dizel",
    price: 1490000, hp: 100, torque: 250, acc: 12.5, top: 175, cons: 5.2, drive: "FWD", trans: "Manuel",
    clr: 180, trunk: 775, seats: 5, comfort: 7, maint: 2, resale: 4,
    img: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=900&q=80",
    issues: ["adblue_crystal", "dpf_clog"],
    weaknesses: [
      "AdBlue deposu kristalleşme ve ısıtıcı rezistansı arızası (serviste depo değişimi gerekebilir)",
      "Şehir içi kısa mesafelerde DPF temizlik rejenerasyonunun tamamlanamaması",
      "Yıllık araç muayenesi ve 1. köprü geçiş kısıtlaması"
    ],
    highlights: ["Sınıfının en konforlu yumuşak süspansiyon geometrisi", "Geniş cam yüzeyler ve ferah kabin", "Büyük eşya saklama gözleri"],
    pros: ["Ticari olmasına rağmen binek araç seviyesinde sürüş yumuşaklığı", "Düşük mazot sarfiyatı", "Pratik yükleme"],
    cons: ["AdBlue pompası kristalleşme riski", "Hafif ticari hız sınırları ve yıllık muayene"]
  },
  {
    brand: "Hyundai", model: "i10 1.2 MPI", cat: "Hatchback", segment: "A Segment", fuel: "Benzin",
    price: 1120000, hp: 84, torque: 118, acc: 13.8, top: 171, cons: 5.1, drive: "FWD", trans: "Otomatik",
    clr: 140, trunk: 252, seats: 5, comfort: 6, maint: 1, resale: 4,
    img: "https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0?auto=format&fit=crop&w=900&q=80",
    issues: ["fiat_rattle"],
    weaknesses: [
      "252 litrelik küçük bagaj (büyük bebek arabası veya 2 büyük valiz sığmaz)",
      "Otoyolda 120 km/s üzerinde yan rüzgârlardan ve büyük tır geçişlerinden etkilenir",
      "AMT otomatik vites geçişlerinde vites atarken hafif öne yığılma (baş sallama) hissi yapar"
    ],
    highlights: ["İstanbul, İzmir dar sokaklarında bisiklet gibi park edebilme kabiliyeti", "A segmentinde 5 kişilik tescil hakkı sunan ender modellerden", "Düşük MTV ve sigorta vergisi"],
    pros: ["Kusursuz şehir içi manevra kabiliyeti", "Düşük yakıt sarfiyatı", "5 yıl garanti"],
    cons: ["Küçük bagaj", "Otoyolda yan rüzgârlardan etkilenme"]
  },

  // ==================== EKONOMİK & AİLE (1.5 Mn ₺ - 2.5 Mn ₺) ====================
  {
    brand: "Toyota", model: "Corolla 1.8 Hibrit Dream", cat: "Sedan", segment: "C Segment", fuel: "Hibrit",
    price: 2050000, hp: 140, torque: 185, acc: 9.3, top: 180, cons: 4.2, drive: "FWD", trans: "Otomatik",
    clr: 135, trunk: 471, seats: 5, comfort: 8, maint: 1, resale: 5,
    img: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=80",
    issues: ["toyota_cvt_drone"],
    weaknesses: [
      "Ani sollamalarda ve sert gazlamalarda e-CVT şanzımanın motor devrini 5000 RPM'e sabitleyip bağırması",
      "Multimedya ekranının çözünürlüğü ve dokunmatik tepkileri rakiplerin biraz gerisinde",
      "Kabin içi yol ve tekerlek ses yalıtımı Alman rakipler kadar izole değildir",
      "Arka koltuk altındaki hibrit batarya fanı evcil hayvan tüyü ve tozdan tıkanabilir (temizlik ister)"
    ],
    highlights: ["Şehir içi trafikte 3.8 - 4.2 L/100km rekor düşük yakıt tüketimi", "Dünyanın en güvenilir 5. Nesil Toyota Hybrid sistemi", "10 yıla kadar uzatılabilir Toyota Garanti ON sistemi", "Türkiye'de değer kaybetmeyen altın yatırımı gibi 2. el"],
    pros: ["İnanılmaz düşük şehir içi yakıt sarfiyatı", "Debriyaj, marş motoru, şarj dinamosu gibi masraflı parçaların bulunmaması", "Konforlu bağımsız arka süspansiyon"],
    cons: ["Sert dipgaz hızlanmalarda e-CVT motor uğultusu", "Multimedya ekran arayüzü sade ve yavaş"]
  },
  {
    brand: "Renault", model: "Megane Sedan 1.3 TCe EDC", cat: "Sedan", segment: "C Segment", fuel: "Benzin",
    price: 1750000, hp: 140, torque: 240, acc: 9.5, top: 205, cons: 5.9, drive: "FWD", trans: "Otomatik",
    clr: 145, trunk: 503, seats: 5, comfort: 8, maint: 2, resale: 5,
    img: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=900&q=80",
    issues: ["edc_shudder"],
    weaknesses: [
      "EDC kuru çift kavramalı şanzıman yoğun dur-kalk trafikte ısınma uyarısı verebilir",
      "R-Link / Easy Link dikey ekranında ara sıra donma ve yeniden başlama şikâyetleri",
      "Arka tavan eğimi sebebiyle 1.85m üzeri yolcular için arka koltukta baş mesafesi kısıtlıdır"
    ],
    highlights: ["Mercedes ile ortak geliştirilen efsanevi 1.3 TCe motor (yüksek tork ve canlı ara hızlanma)", "503 litrelik derin ve kullanışlı bagaj", "C şeklinde karizmatik LED far imzası", "Türkiye'nin en popüler şirket ve aile sedanı"],
    pros: ["Harika ara hızlanma ve tork", "Otoyolda sessiz ve oturaklı gövde", "Çok yüksek ikinci el talebi"],
    cons: ["Kuru kavrama EDC şanzıman yoğun trafikte dikkat ister", "Arka baş mesafesi uzun boylular için hafif basık"]
  },
  {
    brand: "Volkswagen", model: "Golf 1.5 eTSI DSG", cat: "Hatchback", segment: "C Segment", fuel: "Hibrit",
    price: 2350000, hp: 150, torque: 250, acc: 8.4, top: 224, cons: 5.4, drive: "FWD", trans: "Otomatik",
    clr: 140, trunk: 381, seats: 5, comfort: 8, maint: 2, resale: 5,
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
    issues: ["dsg_dq200"],
    weaknesses: [
      "DQ200 kuru kavrama DSG şanzıman dur-kalk trafikte 70-80 bin km sonrası kavrama titremesi yapabilir",
      "Klima ve ses ayarlarının aydınlatmasız dokunmatik slider tuşlarla yapılması (gece sürüşünde zordur)",
      "Multimedya ekranının ilk çalıştırmada bazen geç açılması veya geri görüş kamerasında gecikme"
    ],
    highlights: ["Kendi segmentine adını veren efsane (Golf Sınıfı referans yol tutuşu)", "48V Mild-Hybrid teknolojisiyle süzülme modunda sıfır tüketim", "Üst düzey kabin sessizliği ve akustik yalıtım", "İkinci elde saatler içinde satılabilen dev likidite"],
    pros: ["Muhteşem sürüş dengesi ve tok kapı hissi", "150 HP ile hem seri hem ekonomik", "Prestijli marka algısı"],
    cons: ["Dokunmatik kontroller sürüş esnasında pratik değil", "DSG kuru kavrama özenli kullanım ister"]
  },
  {
    brand: "Volkswagen", model: "Polo 1.0 TSI DSG", cat: "Hatchback", segment: "B Segment", fuel: "Benzin",
    price: 1720000, hp: 95, torque: 175, acc: 10.8, top: 187, cons: 5.3, drive: "FWD", trans: "Otomatik",
    clr: 140, trunk: 351, seats: 5, comfort: 7, maint: 2, resale: 5,
    img: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?auto=format&fit=crop&w=900&q=80",
    issues: ["dsg_dq200"],
    weaknesses: [
      "DSG kuru kavrama şanzıman yoğun trafikte aşınma ve mekatronik arıza riski taşır",
      "Yetkili servis bakım ücretleri yerli rakiplerine göre oldukça yüksektir",
      "Klima kontrollerinin dokunmatik yüzeye aktarılması sürüşte dikkat dağıtabilir"
    ],
    highlights: ["B segmentinde Golf konforu ve tokluğu sunan lider araç", "IQ.LIGHT LED Matrix far seçeneği", "İkinci el değerini döviz gibi koruma kabiliyeti"],
    pros: ["Sınıfının en sessiz kabinlerinden biri", "Yüksek malzeme kalitesi", "Geniş ikinci el pazarı"],
    cons: ["Bakım maliyetleri yerli rakiplerden biraz daha yüksek", "DSG kuru kavrama yoğun trafikte dikkat gerektirir"]
  },
  {
    brand: "Dacia", model: "Duster 1.2 TCe 4x4", cat: "SUV", segment: "C-SUV", fuel: "Benzin",
    price: 1780000, hp: 130, torque: 230, acc: 10.8, top: 180, cons: 6.5, drive: "4x4", clr: 217,
    trunk: 472, seats: 5, comfort: 6, maint: 1, resale: 5,
    img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80",
    issues: ["fiat_rattle"],
    weaknesses: [
      "120 km/s üzerinde kabin içine giren bariz rüzgâr ve motor sesi (yalıtım zayıftır)",
      "İç mekânda baştan başa kullanılan sert plastik malzeme ve basit göstergeler",
      "Koltukların uzun yolda bel desteğinin zayıf kalması ve yorması"
    ],
    highlights: ["217 mm sınıf lideri yerden yükseklik ve kilitli 4x4 arazi modu", "Türkiye'nin en popüler uygun fiyatlı arazi aracı; Karadeniz ve Doğu'nun vazgeçilmezi", "Yeni nesil modern tasarım ve hafif hibrit motor"],
    pros: ["Karlı, çamurlu, taşlı yollarda inanılmaz kabiliyetli", "Parça ve bakım fiyatları çok ekonomik", "Hızlı ikinci el satışı"],
    cons: ["İç mekânda sert plastik kullanımı", "120 km/s üzeri otoyol hızlarında rüzgâr sesi"]
  },
  {
    brand: "Peugeot", model: "2008 1.2 PureTech GT", cat: "Crossover", segment: "B-SUV", fuel: "Benzin",
    price: 2150000, hp: 130, torque: 230, acc: 9.1, top: 200, cons: 5.9, drive: "FWD", trans: "Otomatik",
    clr: 165, trunk: 434, seats: 5, comfort: 7, maint: 2, resale: 4,
    img: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=900&q=80",
    issues: ["puretech_belt"],
    weaknesses: [
      "1.2 PureTech ıslak triger kayışının her bakımda kumpasla ölçülme zorunluluğu (erime ve yağ tıkama riski)",
      "Küçük direksiyon simidinin bazı boylardaki sürücülerde gösterge panelini kapatması",
      "Arka süspansiyonun derin kasislerde sert darbe vurması"
    ],
    highlights: ["Aslan pençesi LED farlar ve fütüristik agresif dış dizayn", "3D i-Cockpit dijital gösterge ve küçük sportif direksiyon", "EAT8 tam otomatik tork konvertörlü sorunsuz Japon Aisin şanzıman"],
    pros: ["Harika tasarım ve zengin donanım", "EAT8 şanzımanın ipeksi vites geçişleri", "Yüksek sürüş pozisyonu"],
    cons: ["1.2 PureTech ıslak triger kayışı düzenli kontrol edilmelidir", "Direksiyon simidi boyunuza göre kadrana siper olabilir"]
  },
  {
    brand: "Skoda", model: "Octavia 1.5 eTSI", cat: "Sedan", segment: "C Segment", fuel: "Hibrit",
    price: 2390000, hp: 150, torque: 250, acc: 8.5, top: 229, cons: 5.3, drive: "FWD", trans: "Otomatik",
    clr: 143, trunk: 600, seats: 5, comfort: 8, maint: 2, resale: 5,
    img: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=900&q=80",
    issues: ["dsg_dq200"],
    weaknesses: [
      "Kuru kavrama 7 ileri DSG şanzımanın sıkışık trafikte aşınma ve silkeleme riski",
      "Multimedya ekranının bazı sürümlerde ilk çalıştırmada donması veya yeniden başlaması",
      "Gövde uzunluğu sebebiyle dar sokaklarda ve kapalı otoparklarda dikkatli manevra gerektirmesi"
    ],
    highlights: ["600 litrelik sınıf rekoru devasa liftback bagaj (arka camla beraber açılır)", "D segmenti sedanları kıskandıran arka koltuk diz mesafesi", "48V eTSI motorla uzun yolda 4.5 litrelere düşen tüketim"],
    pros: ["Muazzam bagaj ve iç ferahlık", "Otoyolda üst düzey konfor ve sessizlik", "Simply Clever akıllı detaylar (kapı içi şemsiye, buz kazıyıcı)"],
    cons: ["Kuru kavrama DSG şanzıman dikkat ister", "Gövde boyutları dar otoparklarda özen ister"]
  },
  {
    brand: "Honda", model: "Civic 1.5 VTEC Turbo", cat: "Sedan", segment: "C Segment", fuel: "Benzin",
    price: 2350000, hp: 182, torque: 240, acc: 8.1, top: 215, cons: 6.6, drive: "FWD", trans: "Otomatik",
    clr: 135, trunk: 519, seats: 5, comfort: 8, maint: 2, resale: 5,
    img: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=900&q=80",
    issues: ["honda_oil_dilution", "honda_c_pillar"],
    weaknesses: [
      "FC5 kasalarda arka C sütununda göçük ve dalgalanma şikâyetleri görülmüştür",
      "Aşırı soğuk kış günlerinde kısa mesafeli kullanımda benzin buharının karter yağına karışması (oil dilution)",
      "CVT şanzımanın sert hızlanmada motor sesini yüksek devirde tutması ve lastik ses yalıtımının zayıflığı"
    ],
    highlights: ["182 beygir güçle sınıfının en atak ve keyifli motor performansı", "Alçak ağırlık merkezi ve bağımsız süspansiyonla viraj ustası", "Türkiye'de en hızlı prim yapan ve aranan 2. el sedan"],
    pros: ["Etkileyici motor performansı ve hızlanma", "Geniş ve ergonomik iç mekân", "Çok güçlü ikinci el piyasası"],
    cons: ["CVT şanzıman sert hızlanmada motor devrini bağırtabilir", "Yol ve lastik yalıtımı Alman rakiplerin bir tık gerisinde"]
  },
  {
    brand: "Togg", model: "T10X V2 Uzun Menzil", cat: "SUV", segment: "C-SUV", fuel: "Elektrik",
    price: 2280000, hp: 218, torque: 350, acc: 7.8, top: 185, cons: 16.9, drive: "RWD", clr: 175,
    trunk: 441, seats: 5, comfort: 8, maint: 1, resale: 4, range: 523,
    img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=900&q=80",
    issues: ["togg_infotainment", "ev_winter_range"],
    weaknesses: [
      "İlk parti araçlarda multimedya ekranının ara sıra donması ve gecikmesi (OTA ile düzelmektedir)",
      "Ayakla temassız bagaj açma sensörünün kirli veya çamurlu havalarda geç tepki vermesi",
      "Kışın sıfırın altındaki hava sıcaklıklarında bataryada %25 civarında menzil düşüşü"
    ],
    highlights: ["Türkiye'nin yerli gururu; Gemlik tesislerinde üretilen akıllı cihaz", "523 km WLTP uzun menzil ve 88.5 kWh büyük batarya kapasitesi", "Uçtan uca uzanan 3 parçalı devasa dijital panoramik kokpit", "218 HP arkadan itiş elektrikli motor ile anında 350 Nm tork"],
    pros: ["Evden şarjda benzinlinin 1/4'ü yakıt maliyeti", "Sessiz ve pürüzsüz elektrikli sürüş", "Geniş arka diz mesafesi ve düz zemin"],
    cons: ["İlk serilerde yazılım donma şikâyetleri", "Kışın sıfır altı derecelerde %25 menzil düşüşü"]
  },
  {
    brand: "BYD", model: "Atto 3 Design", cat: "SUV", segment: "C-SUV", fuel: "Elektrik",
    price: 1980000, hp: 204, torque: 310, acc: 7.3, top: 160, cons: 15.6, drive: "FWD", clr: 175,
    trunk: 440, seats: 5, comfort: 7, maint: 1, resale: 3, range: 420,
    img: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=900&q=80",
    issues: ["ev_winter_range"],
    weaknesses: [
      "Maksimum sürat 160 km/s ile elektronik olarak sınırlandırılmıştır",
      "İç mekândaki gitar telli kapı cepleri ve spor salonu temalı havalandırma tasarımı herkese hitap etmeyebilir",
      "İkinci el pazarı ve servis ağı Türkiye'de yeni yeni oturmaktadır"
    ],
    highlights: ["Çivi delme testinde alev almayan dünyanın en güvenli Blade Batarya teknolojisi", "Standart gelen enerji tasarruflu Isı Pompası (Heat Pump)", "Dönen 15.6 inç multimedya ekranı ve gitar telli eğlenceli iç tasarım", "Manisa fabrika yatırımıyla geleceğin yerli üretim adayı"],
    pros: ["Çok zengin standart donanım paketi", "Blade bataryanın uzun ömür ve yangın güvenliği", "Düşük elektrik tüketimi"],
    cons: ["Maksimum hız 160 km/s ile sınırlı", "İkinci el piyasası yeni oturmaktadır"]
  },
  {
    brand: "Chery", model: "Tiggo 8 Pro Max 1.6 TGDI", cat: "SUV", segment: "D-SUV", fuel: "Benzin",
    price: 2150000, hp: 186, torque: 290, acc: 8.9, top: 200, cons: 8.1, drive: "AWD", clr: 196,
    trunk: 889, seats: 7, comfort: 8, maint: 2, resale: 3,
    img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",
    issues: ["chery_fuel_infotainment"],
    weaknesses: [
      "Şehir içi yoğun trafikte 11 - 12.5 litreye ulaşabilen yüksek yakıt tüketimi",
      "Multimedya ekranının Bluetooth bağlantısının zaman zaman kopması ve ekran resetleme",
      "İkinci el değer korumasının Alman ve Japon rakiplere kıyasla daha zayıf olması"
    ],
    highlights: ["7 kişilik oturma kapasitesiyle fiyatta rakipsiz aile SUV'u", "Deri ısıtmalı-soğutmalı masajlı koltuklar ve panoramik cam tavan", "Akıllı dört çeker AWD sistemi ve 186 HP canlı turbo motor"],
    pros: ["Fiyatına göre inanılmaz zengin lüks donanım", "7 koltuk esnekliği ve devasa bagaj", "Yüksek heybetli sürüş"],
    cons: ["Şehir içi trafikte yüksek yakıt tüketimi", "İkinci el değer koruması Japon ve Almanların gerisinde"]
  },
  {
    brand: "MG", model: "MG4 Electric Luxury", cat: "Hatchback", segment: "C Segment", fuel: "Elektrik",
    price: 1850000, hp: 204, torque: 250, acc: 7.7, top: 160, cons: 16.0, drive: "RWD", clr: 150,
    trunk: 363, seats: 5, comfort: 7, maint: 1, resale: 3, range: 435,
    img: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=900&q=80",
    issues: ["ev_winter_range"],
    weaknesses: [
      "İç mekânda sert plastik malzeme yoğunluğu ve sade kapı döşemeleri",
      "Multimedya arayüzünün dokunmatik tepkilerinde hafif gecikmeler yaşanması",
      "Kışın sıfırın altındaki hava şartlarında otoyolda menzilin 300 km altına inebilmesi"
    ],
    highlights: ["50:50 mükemmel ağırlık dağılımı ve arkadan itişli saf sürüş keyfi", "Euro NCAP 5 yıldızlı sağlam batarya ve gövde kafesi", "435 km menzil ve 135 kW hızlı şarj kabiliyeti"],
    pros: ["Arkadan itişli eğlenceli sürüş dinamiği", "Fiyat/performans elektrikli hatchback", "Düşük bakım masrafı"],
    cons: ["İç mekânda sert plastik kullanımı", "Multimedya arayüzü bazen yavaş tepki verebilir"]
  },
  {
    brand: "Suzuki", model: "Jimny 1.5 AllGrip", cat: "Arazi (4x4)", segment: "B-Arazi", fuel: "Benzin",
    price: 2250000, hp: 102, torque: 130, acc: 13.5, top: 145, cons: 7.7, drive: "4x4", clr: 210,
    trunk: 85, seats: 4, comfort: 4, maint: 2, resale: 5,
    img: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=900&q=80",
    issues: ["fiat_rattle"],
    weaknesses: [
      "Bagaj hacminin neredeyse olmaması (85 litre; koltuklar açıkken valiz sığmaz)",
      "Otoyolda 110 km/s üzerinde aşırı rüzgâr sesi, yan rüzgârlardan sallanma ve sert sürüş",
      "Arka koltukların dar ve konforsuz olması, uzun yola uygun olmaması"
    ],
    highlights: ["Gerçek merdiven şasi, 3 kollu rijit aks ve arazi takviye kolu (Low range)", "Dünyanın en sempatik mini G-Serisi; durdurulamaz kaya tırmanıcı", "İkinci elde sıfırından bile pahalıya satılabilen kült hobi aracı"],
    pros: ["Arazide 5 milyon liralık cipleri utandıracak kabiliyet", "Efsanevi sempatik tasarım", "Çok yüksek değer koruma"],
    cons: ["Bagaj neredeyse yok (85 L)", "Otoyolda 110 km/s üzeri rüzgârda sallanır ve konforsuzdur"]
  },

  // ==================== ORTA & ÜST SEGMENT (2.5 Mn ₺ - 4.2 Mn ₺) ====================
  {
    brand: "Tesla", model: "Model Y Long Range AWD", cat: "SUV", segment: "D-SUV", fuel: "Elektrik",
    price: 3200000, hp: 514, torque: 493, acc: 5.0, top: 217, cons: 16.5, drive: "AWD", clr: 167,
    trunk: 854, seats: 5, comfort: 8, maint: 1, resale: 4, range: 533,
    img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80",
    issues: ["tesla_panel_gap", "ev_winter_range"],
    weaknesses: [
      "Sert süspansiyon geometrisi sebebiyle Türkiye'nin yamalı asfalt ve kasislerinde darbe vuruntusu",
      "Kasa panel birleşim boşluklarında (panel gap) milimetrik sapmalar ve ön salıncak burç gıcırtısı",
      "Geleneksel kadran veya cam tavan perdesi olmaması; yaz güneşinde kabinin ısınması"
    ],
    highlights: ["Dünyanın en çok satan otomobili unvanı", "Çift motorlu dört çekerle 5.0 saniyede 0-100 süper spor hızlanması", "854 litrelik akıl almaz devasa bagaj + ön bagaj (Frunk)", "Tesla Supercharger ağında 15 dakikada 250 km şarj"],
    pros: ["Muazzam hızlanma ve çekiş", "Sınıf lideri şarj altyapısı ve telefon uygulaması", "Devasa yükleme hacmi"],
    cons: ["Sert süspansiyon kasislerde vuruntu yapabilir", "Geleneksel kadran veya cam tavan perdesi bulunmaması"]
  },
  {
    brand: "Skoda", model: "Superb 1.5 eTSI L&K Crystal", cat: "Sedan", segment: "D Segment", fuel: "Hibrit",
    price: 3650000, hp: 150, torque: 250, acc: 9.0, top: 225, cons: 5.8, drive: "FWD", trans: "Otomatik",
    clr: 142, trunk: 645, seats: 5, comfort: 10, maint: 2, resale: 5,
    img: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=900&q=80",
    issues: ["dsg_dq200"],
    weaknesses: [
      "DQ200 kuru kavrama DSG şanzımanın dur-kalk trafikte kavrama aşınması hassasiyeti",
      "5 metreye yakın uzunluğu sebebiyle AVM ve dar sokaklarda paralel park özen ister",
      "Multimedya ekranının bazı sürümlerde telefon bağlantısını geç algılaması"
    ],
    highlights: ["Makam aracı sınıfında arka diz mesafesi (bacak bacak üstüne atılabilen salon konforu)", "645 litrelik katedral büyüklüğünde bagaj", "DCC Pro çift valfli adaptif süspansiyonla uçan halı sürüş yumuşaklığı", "L&K donanımda masajlı havalandırmalı hakiki deri koltuklar"],
    pros: ["Rakipsiz arka koltuk konforu ve diz mesafesi", "Mükemmel süspansiyon konforu", "Prestijli ve vakur tasarım"],
    cons: ["Büyük gövde boyutları", "DSG şanzıman dikkat ister"]
  },
  {
    brand: "Volkswagen", model: "Passat Variant 1.5 eTSI", cat: "Station Wagon", segment: "D Segment", fuel: "Hibrit",
    price: 3850000, hp: 150, torque: 250, acc: 8.9, top: 222, cons: 5.5, drive: "FWD", trans: "Otomatik",
    clr: 145, trunk: 690, seats: 5, comfort: 9, maint: 3, resale: 5,
    img: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=900&q=80",
    issues: ["dsg_dq200"],
    weaknesses: [
      "Türkiye pazarında geleneksel sedan algısının güçlü olması sebebiyle Variant (station wagon) satışının sedana göre daha niş olması",
      "Kuru kavrama DSG şanzımanın özenli kullanım gerektirmesi",
      "Dokunmatik konsol kumandalarının sürüş esnasında bakmadan kullanılmasının zorluğu"
    ],
    highlights: ["Türkiye'de efsaneleşen Passat isminin yeni nesil Variant hali", "690 litre - koltuklar yatınca 1920 litre devasa kargo hacmi", "Otoyolda saatlerce yorulmadan gidilebilen akustik ses yalıtımı"],
    pros: ["Kusursuz uzun yol konforu", "Devasa bagaj ve yükleme pratikliği", "Güçlü ikinci el algısı"],
    cons: ["Sadece Variant karoserle üretilmesi", "Büyük gövde"]
  },
  {
    brand: "Volkswagen", model: "Tiguan 1.5 eTSI R-Line", cat: "SUV", segment: "C-SUV", fuel: "Hibrit",
    price: 3600000, hp: 150, torque: 250, acc: 9.1, top: 208, cons: 6.7, drive: "FWD", trans: "Otomatik",
    clr: 180, trunk: 652, seats: 5, comfort: 8, maint: 3, resale: 5,
    img: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80",
    issues: ["dsg_dq200"],
    weaknesses: [
      "Fiyatının D segmenti araçlarla yarışır seviyede olması",
      "R-Line donanımdaki 19-20 inç jantların çukurlarda süspansiyonu hafif sertleştirmesi",
      "Kuru kavrama DSG şanzıman yoğun trafikte ısınma eğilimi gösterebilir"
    ],
    highlights: ["Türkiye'nin en çok aranan premium C-SUV modeli", "652 litrelik geniş bagaj ve kızaklı arka koltuklar", "OLED ekranlı akıllı sürüş deneyim kontrol kumandası (Rotary dial)"],
    pros: ["Yüksek ikinci el değeri ve kolay satış", "Ferah ve kaliteli kabin", "Tok ve dengeli sürüş"],
    cons: ["Yüksek fiyat seviyesi", "AWD dört çeker olmaması"]
  },
  {
    brand: "Hyundai", model: "Tucson 1.6 T-GDI Hibrit 4x4", cat: "SUV", segment: "C-SUV", fuel: "Hibrit",
    price: 3100000, hp: 230, torque: 350, acc: 8.0, top: 193, cons: 5.9, drive: "AWD", clr: 175,
    trunk: 616, seats: 5, comfort: 8, maint: 2, resale: 4,
    img: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=900&q=80",
    issues: ["hyundai_kia_dct"],
    weaknesses: [
      "7-DCT kuru kavrama dik yokuşlarda dur-kalk yaparken şanzıman ısınma ikazı verebilir",
      "Yüksek hızlarda (130 km/s üzeri) A sütunundan gelen hafif rüzgâr sesi",
      "Piyano siyahı ön konsolun parmak izi ve toz tutması"
    ],
    highlights: ["230 beygirlik güçlü hibrit motorla seri ara hızlanmalar", "HTRAC akıllı dört çeker sistemiyle yağmur ve karda tam kontrol", "Gizli parametrik ön ızgara LED aydınlatması"],
    pros: ["Güçlü motor ve tork", "Geniş bagaj ve arka koltuk ısıtma donanımı", "5 yıl garanti"],
    cons: ["Yüksek hızlarda hafif rüzgâr sesi"]
  },
  {
    brand: "Kia", model: "Sportage 1.6 T-GDI Hibrit 4x4", cat: "SUV", segment: "C-SUV", fuel: "Hibrit",
    price: 3100000, hp: 230, torque: 350, acc: 8.0, top: 193, cons: 5.9, drive: "AWD", clr: 175,
    trunk: 587, seats: 5, comfort: 8, maint: 2, resale: 4,
    img: "https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=900&q=80",
    issues: ["hyundai_kia_dct"],
    weaknesses: [
      "Şanzıman dik rampalarda ve dur-kalkta ısınma ikazı çıkartabilir",
      "Arka süspansiyon kasislerde Tucson'a kıyasla biraz daha sert ayarlıdır",
      "Geniş kavisli ekran panelinin altında dokunmatik klima şeridinin alışkanlık istemesi"
    ],
    highlights: ["Bumerang LED farlar ve kavisli çift 12.3 inç panoramik ekran", "230 HP hibrit güç ile rampalarda nefes kesmeyen tork", "Elektronik kontrollü süspansiyon ve arazi sürüş modları"],
    pros: ["Fütüristik tasarım", "Dört çeker güvenliği", "Zengin donanım"],
    cons: ["Piyano siyahı kaplamalar çabuk toz tutar"]
  },
  {
    brand: "Peugeot", model: "3008 1.2 Hibrit GT", cat: "SUV", segment: "C-SUV", fuel: "Hibrit",
    price: 3150000, hp: 136, torque: 230, acc: 10.0, top: 201, cons: 5.4, drive: "FWD", trans: "Otomatik",
    clr: 185, trunk: 588, seats: 5, comfort: 8, maint: 2, resale: 4,
    img: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=900&q=80",
    issues: ["fiat_rattle"],
    weaknesses: [
      "Yeni fastback tavan eğimi sebebiyle arka koltuk baş mesafesi önceki kasaya göre biraz daha alçaktır",
      "Klima kontrollerinin multimedya ekranına entegre olması sebebiyle fiziksel tuş pratikliğinin olmaması",
      "136 HP hibrit motorun ara hızlanmaları 1.6 turbo rakipler kadar agresif değildir"
    ],
    highlights: ["Fastback SUV silüeti ve 21 inç kavisli panoramik i-Cockpit ekranı", "Triger zincirli yeni nesil e-DCS6 çift kavramalı hibrit motor (ıslak kayış derdi bitti)", "Şehir içi %50'ye kadar tamamen elektrikli sürüş"],
    pros: ["Göz alıcı modern dış ve iç tasarım", "Düşük şehir içi tüketim", "Geniş bagaj"],
    cons: ["Arka baş mesafesi bir tık alçak", "Klima kontrolleri ekrana gömülü"]
  },
  {
    brand: "Toyota", model: "RAV4 2.5 Hibrit AWD Passion X-Pack", cat: "SUV", segment: "D-SUV", fuel: "Hibrit",
    price: 3950000, hp: 222, torque: 221, acc: 8.1, top: 180, cons: 5.7, drive: "AWD", clr: 195,
    trunk: 580, seats: 5, comfort: 9, maint: 2, resale: 5,
    img: "https://images.unsplash.com/photo-1543465077-db45d34b88a5?auto=format&fit=crop&w=900&q=80",
    issues: ["toyota_cvt_drone"],
    weaknesses: [
      "2.5 litre motor hacmi sebebiyle Türkiye'de yıllık Motorlu Taşıtlar Vergisi (MTV) çok yüksektir",
      "Sert dipgazda e-CVT şanzımanın motor devrini bağırtması",
      "Multimedya ekran tasarımı ve grafik kalitesi Alman premiumların gerisinde kalır"
    ],
    highlights: ["Arka aksı elektrik motoruyla süren akıllı E-Four 4x4 sistemi (şaftsız hafif dört çeker)", "Dünyanın en çok satan SUV unvanı; arıza yapmayan taş gibi sağlamlık", "Geniş kabin ve 10 yıl Toyota Garanti ON kapsamı"],
    pros: ["Sıfıra yakın mekanik arıza oranı", "Mükemmel kar ve kaygan zemin çekişi", "Yüksek ikinci el değeri"],
    cons: ["2.5L motor sebebiyle yüksek MTV vergisi", "Dipgazda e-CVT sesi"]
  },
  {
    brand: "Ford", model: "Ranger Wildtrak 2.0 EcoBlue 4x4", cat: "Pick-up", segment: "Pick-up", fuel: "Dizel",
    price: 3100000, hp: 205, torque: 500, acc: 9.8, top: 180, cons: 8.6, drive: "4x4", clr: 235,
    trunk: 1200, seats: 5, comfort: 7, maint: 2, resale: 5,
    img: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=900&q=80",
    issues: ["adblue_crystal", "dpf_clog"],
    weaknesses: [
      "Kamyonet ruhsatı sebebiyle her yıl muayene, 1. köprü geçiş yasağı ve hız sınırları",
      "5.37 metre uzunluğu sebebiyle şehir içinde dar sokaklarda ve kapalı otoparklarda manevra zorluğu",
      "AdBlue depo kristalleşmesi ve kısa mesafede DPF tıkanma hassasiyeti"
    ],
    highlights: ["500 Nm devasa çekiş torku ve 3.500 kg römork çekme kapasitesi", "10 ileri otomatik şanzıman ve elektronik arazi şanzımanı", "800 mm sudan geçme derinliği ile Doğu Anadolu ve Karadeniz fatihi"],
    pros: ["Durdurulamaz arazi yeteneği ve yük kapasitesi", "Amerikan tarzı heybetli ve karizmatik duruş", "Konforlu binek benzeri kabin"],
    cons: ["Kamyonet ruhsatı zorunlulukları", "Şehir içi park zorluğu"]
  },
  {
    brand: "Toyota", model: "Hilux 2.8 D-4D Invincible 4x4", cat: "Pick-up", segment: "Pick-up", fuel: "Dizel",
    price: 3050000, hp: 204, torque: 500, acc: 10.7, top: 175, cons: 8.9, drive: "4x4", clr: 286,
    trunk: 1100, seats: 5, comfort: 6, maint: 2, resale: 5,
    img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80",
    issues: ["dpf_clog"],
    weaknesses: [
      "Arka yaprak makaslı süspansiyon boşken kasislerde arka tarafı zıplatır ve konforu düşürür",
      "Kamyonet ruhsatı sebebiyle yıllık muayene ve otoyollarda düşük hız limiti",
      "Kısa mesafe şehir içi sürüşte DPF temizliği gerektirmesi"
    ],
    highlights: ["Top Gear'ın bile yıkamadığı 'Yıkılmaz' efsanevi şasi ve yürüyen aksam", "286 mm yerden yükseklikle arazide taş-kaya tanımazlık", "İkinci elde maden, inşaat, tarım sektörünün 1 numaralı para birimi"],
    pros: ["Aşırı dayanıklı ağır hizmet şasisi", "Değerini dövizden daha iyi koruyan ikinci el", "Zorlu şartlarda sıfır sorun"],
    cons: ["Arka makaslı süspansiyon boşken zıplatma yapar", "Yıllık muayene"]
  },
  {
    brand: "Cupra", model: "Formentor VZ 2.0 TSI 310 HP 4Drive", cat: "Crossover", segment: "C-SUV", fuel: "Benzin",
    price: 4100000, hp: 310, torque: 400, acc: 4.9, top: 250, cons: 8.7, drive: "AWD", clr: 155,
    trunk: 420, seats: 5, comfort: 7, maint: 3, resale: 4,
    img: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=900&q=80",
    issues: ["dsg_wet"],
    weaknesses: [
      "Şehir içi agresif kullanımda yakıt tüketimi 11 - 13 litrelere çok çabuk çıkar",
      "Sert spor süspansiyon ve 19 inç jantlar bozuk asfaltta darbeleri kabine hissettirir",
      "Mat boya opsiyonu yıkamada ve çizik tamirinde özel bakım ister (fırça vurulamaz)"
    ],
    highlights: ["4.9 saniyede 0-100 hızlanmasıyla Porsche Macan kovalayan safkan performans", "4Drive akıllı dört çeker ve Brembo fren sistemi", "Mat renkleri, bakır logoları ve egzoz patırtılarıyla sokakların yıldızı"],
    pros: ["Muhteşem ara hızlanma ve egzoz sesi", "Agresif ve çekici dış tasarım", "Islak kavrama sağlam DSG şanzıman"],
    cons: ["Sert spor süspansiyon", "Şehir içi performanslı kullanımda yüksek tüketim"]
  },
  {
    brand: "Volkswagen", model: "Golf GTI 2.0 TSI", cat: "Hatchback", segment: "C Segment", fuel: "Benzin",
    price: 3950000, hp: 265, torque: 370, acc: 5.9, top: 250, cons: 7.2, drive: "FWD", trans: "Otomatik",
    clr: 135, trunk: 374, seats: 5, comfort: 7, maint: 3, resale: 5,
    img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=80",
    issues: ["dsg_wet"],
    weaknesses: [
      "Önden çekişli olması sebebiyle ıslak zeminde ilk kalkışta patinaja düşme eğilimi",
      "Dokunmatik direksiyon tuşlarına virajda manevra yaparken elin yanlışlıkla değmesi",
      "Yüksek hızda spor süspansiyonun kasislerde tok ama sert hissettirmesi"
    ],
    highlights: ["Otomobil tarihinin en ikonik hot-hatch modeli; ekoseli koltuklar ve kırmızı şerit", "Elektronik kilitli ön diferansiyel (VAQ) ile viraj içinde çizgiyi ray gibi koruma", "Hem günlük markete gitmeye hem hafta sonu pist yarışına uygun mükemmel denge"],
    pros: ["Zahmetsiz yüksek hız ve viraj kabiliyeti", "Islak kavrama DQ381 DSG dayanıklılığı", "Kült koleksiyon ve ikinci el değeri"],
    cons: ["Önden çekişli olduğu için ıslakta patinaja düşebilir", "Dokunmatik direksiyon tuşları"]
  },

  // ==================== PREMIUM SINIF (4.2 Mn ₺ - 8.5 Mn ₺) ====================
  {
    brand: "BMW", model: "320i Sedan M Sport", cat: "Sedan", segment: "D Segment", fuel: "Benzin",
    price: 4650000, hp: 170, torque: 250, acc: 7.6, top: 232, cons: 6.7, drive: "RWD", trans: "Otomatik",
    clr: 136, trunk: 480, seats: 5, comfort: 8, maint: 4, resale: 5,
    img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80",
    issues: ["bmw_oil_leaks"],
    weaknesses: [
      "80-100 bin km sonrasında külbütör kapak contası, yağ kütük contası ve plastik su flanşlarından sızıntı yapması",
      "M Sport süspansiyonun ve ince yanaklı run-flat lastiklerin Türkiye yollarında sert vurması",
      "Kış aylarında karlı ve buzlu rampalarda arkadan itişin kayma riski (kış lastiği zorunludur)",
      "Yetkili servis periyodik bakım ve orijinal parça fiyatlarının yüksekliği"
    ],
    highlights: ["Arkadan itiş (RWD) genetiği ve 50:50 kusursuz aks ağırlık dengesi", "ZF 8 ileri tork konvertörlü şanzıman (dünyanın en hızlı ve sorunsuz otomatiklerinden biri)", "Kavisli devasa BMW Curved Display ekranı", "Türkiye'de gençlerin ve iş dünyasının 1 numaralı prestij simgesi"],
    pros: ["Sınıfının en iyi direksiyon hissi ve sürüş dinamiği", "ZF şanzımanın kusursuz vites algoritması", "Müthiş ikinci el değeri"],
    cons: ["100.000 km sonrası plastik soğutma flanşları ve yağ contaları kontrol edilmeli", "M Sport süspansiyon konfor odaklılar için serttir"]
  },
  {
    brand: "Mercedes-Benz", model: "C 200 4MATIC AMG", cat: "Sedan", segment: "D Segment", fuel: "Benzin",
    price: 4950000, hp: 204, torque: 300, acc: 7.1, top: 241, cons: 6.8, drive: "AWD", clr: 135,
    trunk: 455, seats: 5, comfort: 9, maint: 4, resale: 5,
    img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80",
    issues: ["mercedes_m274"],
    weaknesses: [
      "M274 motorda elektronik termostat arızası ve hararet göstergesi dalgalanması",
      "Konsolun alt bölümlerindeki sert plastik kaplamalar ve piyano siyahı detayların çizilme riski",
      "Yetkili servis bakım ve parça fiyatlarının oldukça yüksek bütçe istemesi"
    ],
    highlights: ["S-Serisi'nden aktarılan dikey devasa MBUX multimedya ve 64 renkli ambiyans aydınlatması", "4MATIC sürekli dört çeker sistemiyle yağmur ve karda üst düzey yol tutuş", "48V EQ Boost hafif hibrit desteğiyle ekstra 20 HP güç"],
    pros: ["Lüks kabin ambiyansı ve yıldız prestiji", "Çok iyi akustik ses yalıtımı", "Dört çeker güvenliği"],
    cons: ["Yedek parça ve yetkili servis bakım fiyatları yüksek", "Konsolun alt kısımlarındaki sert plastikler"]
  },
  {
    brand: "Audi", model: "A4 Sedan 40 TDI quattro", cat: "Sedan", segment: "D Segment", fuel: "Dizel",
    price: 4500000, hp: 204, torque: 400, acc: 6.9, top: 244, cons: 5.4, drive: "AWD", clr: 140,
    trunk: 460, seats: 5, comfort: 8, maint: 3, resale: 4,
    img: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=900&q=80",
    issues: ["dpf_clog"],
    weaknesses: [
      "Şehir içi kısa mesafelerde dizel partikül filtresi (DPF) tıkanma ve fan açma şikâyeti",
      "Arka koltukta yüksek şaft tüneli ortada oturan yolcunun ayak alanını daraltır",
      "S tronic çift kavramalı şanzıman 60.000 km'de bir periyodik yağ bakımı ister"
    ],
    highlights: ["Efsanevi quattro dört çeker sistemi; karda ray üzerinde gidiyormuş hissi", "400 Nm tork ile otoyolda sol şeridi domine eden dizel ekonomi", "Matrix LED farlar ve sanal kokpit ergonomisi"],
    pros: ["Islak ve karlı zeminlerde olağanüstü çekiş", "Otoyolda 5 litre civarında düşük tüketim", "Zamansız şık tasarım"],
    cons: ["Şehir içi kısa mesafelerde DPF temizliği gerekir", "Arka şaft tüneli ortadaki yolcunun alanını daraltır"]
  },
  {
    brand: "BMW", model: "520i Sedan M Sport", cat: "Sedan", segment: "E Segment", fuel: "Benzin",
    price: 7200000, hp: 208, torque: 330, acc: 7.5, top: 235, cons: 6.8, drive: "RWD", trans: "Otomatik",
    clr: 140, trunk: 520, seats: 5, comfort: 10, maint: 4, resale: 5,
    img: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=900&q=80",
    issues: ["bmw_oil_leaks"],
    weaknesses: [
      "5.06 metrelik devasa boyutu sebebiyle dar sokaklarda ve standart kapalı otoparklarda park zahmeti",
      "100.000 km sonrasında plastik soğutma flanşları ve yağ contası kontrolü gerektirmesi",
      "Yüksek kasko, sigorta ve yetkili servis bakım giderleri"
    ],
    highlights: ["Yeni nesil G60 kasa; Interaction Bar kristal ışık şeridi ve ikonik parlayan böbrek ızgara", "E segmentinde sürüş dinamiği ile konforun altın dengesi", "5 metreyi aşan uzunluğuyla muazzam otoyol süzülmesi ve prestij"],
    pros: ["Kusursuz kabin sessizliği ve sürüş konforu", "Üst düzey teknolojik asistanlar ve otonom park", "Yüksek ikinci el prestiji"],
    cons: ["Büyük boyutları AVM otoparklarında dikkat ister", "Opsiyon donanımları çok pahalı"]
  },
  {
    brand: "Mercedes-Benz", model: "E 200 Exclusive", cat: "Sedan", segment: "E Segment", fuel: "Benzin",
    price: 7800000, hp: 204, torque: 320, acc: 7.5, top: 240, cons: 7.0, drive: "RWD", trans: "Otomatik",
    clr: 140, trunk: 540, seats: 5, comfort: 10, maint: 4, resale: 5,
    img: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=900&q=80",
    issues: ["mercedes_m274"],
    weaknesses: [
      "M274 motor elektronik termostat ve su pompası arızası riski",
      "MBUX Superscreen konsol camının aşırı güneş altında parlaması ve toz tutması",
      "Yetkili servis periyodik bakım paketlerinin yüksek fiyat seviyesi"
    ],
    highlights: ["Kaputun ucunda dik duran üç köşeli Mercedes yıldızı; Türkiye'de başarının simgesi", "MBUX Superscreen konsol boyu ekranlar ve entegre selfie kamerası", "Kabin içine gram rüzgâr ve motor sesi almayan çift katmanlı akustik camlar"],
    pros: ["Dünyanın en konforlu ve prestijli iş sedanlarından biri", "Harika süspansiyon darbe emişi", "Çok güçlü ikinci el talebi"],
    cons: ["Yetkili servis bakım paketleri yüksek bütçe ister"]
  },
  {
    brand: "Volvo", model: "XC60 B5 AWD Plus", cat: "SUV", segment: "D-SUV", fuel: "Hibrit",
    price: 5800000, hp: 250, torque: 350, acc: 6.9, top: 180, cons: 7.5, drive: "AWD", clr: 216,
    trunk: 483, seats: 5, comfort: 9, maint: 4, resale: 4,
    img: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=900&q=80",
    issues: ["fiat_rattle"],
    weaknesses: [
      "Maksimum sürat güvenlik politikası gereği 180 km/s ile fabrikasyon sınırlandırılmıştır",
      "Google tabanlı multimedya ekranının ara sıra Bluetooth ve harita gecikmesi yapabilmesi",
      "İkinci el satış hızı Alman üçlüsüne (BMW, Mercedes, Audi) göre biraz daha yavaştır"
    ],
    highlights: ["Boron çeliği kafes ve dünyanın en gelişmiş aktif kaza önleme güvenlik sistemleri", "Ortopedik doktorlar tarafından tasarlanan sınıfının en rahat koltukları", "Google entegre sesli asistan ve haritalar; İskandinav sade şıklığı"],
    pros: ["Rakipsiz pasif ve aktif güvenlik düzeyi", "Uzun yolda bel ağrıtmayan muazzam koltuklar", "Güçlü B5 motor ve dört çeker"],
    cons: ["180 km/s hız limiti", "İkinci el satışı Alman rakiplerden biraz daha yavaştır"]
  },
  {
    brand: "Ford", model: "Mustang GT 5.0 V8 Fastback", cat: "Coupe", segment: "Spor Coupe", fuel: "Benzin",
    price: 6500000, hp: 446, torque: 540, acc: 4.9, top: 250, cons: 12.4, drive: "RWD", clr: 135,
    trunk: 382, seats: 4, comfort: 6, maint: 3, resale: 4,
    img: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=900&q=80",
    issues: ["fiat_rattle"],
    weaknesses: [
      "5.0 litre devasa silindir hacmi sebebiyle astronomik yıllık MTV vergisi",
      "Şehir içi yoğun trafikte 15 - 18 litrelere ulaşan yüksek benzin sarfiyatı",
      "Kışın karlı ve ıslak asfaltta 446 beygirlik arkadan itişin çok çabuk arkasını savurma riski"
    ],
    highlights: ["5.0 litre atmosferik Coyote V8 motor; tüyleri diken diken eden saf Amerikan kükremesi", "MagneRide adaptif süspansiyon ve Brembo 6 pistonlu dev frenler", "Kalkış kontrolü (Launch Control) ve lastik ısıtma (Line Lock) modu"],
    pros: ["Saf motor sesi ve benzersiz ikonik hava", "V8 motor dayanıklılığı ve tork patlaması", "Her yerde tüm bakışları üzerine çekme garantisi"],
    cons: ["Yıllık MTV vergisi ve yüksek yakıt tüketimi", "Kışın karlı havada arkadan itiş dikkat ister"]
  },
  {
    brand: "Lexus", model: "ES 300h Exclusive", cat: "Sedan", segment: "E Segment", fuel: "Hibrit",
    price: 5700000, hp: 218, torque: 221, acc: 8.9, top: 180, cons: 5.3, drive: "FWD", clr: 150,
    trunk: 454, seats: 5, comfort: 10, maint: 3, resale: 4,
    img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80",
    issues: ["toyota_cvt_drone"],
    weaknesses: [
      "Sürüş karakteri tamamen konfor ve sakinlik odaklıdır; BMW gibi sportif sürüş zevki arayanları tatmin etmez",
      "e-CVT şanzıman sert hızlanmada motor devrini bağırtabilir",
      "Türkiye'de ikinci el pazarı Alman rakiplerine göre daha dar bir kitleye hitap eder"
    ],
    highlights: ["Global güvenilirlik anketlerinde art arda dünyanın en az arıza yapan lüks otomobili", "Kütüphane sessizliğinde çift katmanlı akustik kabin", "Mark Levinson 17 hoparlörlü konser salonu ses sistemi"],
    pros: ["Sıfır arıza riski ve Toyota motor mekanik güvencesi", "Lüks segmentte 5.3 litre gibi şaşırtıcı düşük yakıt tüketimi", "Ultra yumuşak süspansiyon konforu"],
    cons: ["Sportiflikten uzak sürüş hissi", "İkinci el pazarı dar bir elit kitleye hitap eder"]
  },

  // ==================== LÜKS & PRESTİJ (8.5 Mn ₺ - 22 Mn ₺) ====================
  {
    brand: "Mercedes-Benz", model: "S 450 4MATIC Uzun", cat: "Sedan", segment: "F Segment", fuel: "Benzin",
    price: 17500000, hp: 381, torque: 500, acc: 5.1, top: 250, cons: 8.8, drive: "AWD", clr: 145,
    trunk: 550, seats: 5, comfort: 10, maint: 5, resale: 4,
    img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80",
    issues: ["mercedes_airmatic"],
    weaknesses: [
      "Airmatic havalı süspansiyon körüklerinin 6-8 yıl sonra mikro kaçak yapma ve pahalı onarım riski",
      "Araçta yüzlerce sensör ve onlarca ECU beyni olması sebebiyle akü zayıflığında elektronik arıza ikazları",
      "Çok yüksek yıllık kasko, kasko muafiyeti ve bakım giderleri"
    ],
    highlights: ["Dünyanın en iyi otomobili referansı; devlet başkanlarının ve küresel iş liderlerinin tercihi", "Arka koltukta 'First Class' yatar koltuk, baldır desteği, sıcak taş masajı ve şampanya buzdolabı", "Arka aks yönlendirme (arka tekerlekler 10 derece döner) ile kompakt araç gibi dönüş çapı"],
    pros: ["Rakipsiz prestij ve lüksün zirvesi", "Havalı süspansiyonla çukurları ve kasisleri tamamen yok etme", "Eşsiz kabin sessizliği"],
    cons: ["Çok yüksek yıllık kasko ve bakım giderleri", "Garanti sonrası havalı süspansiyon masrafları"]
  },
  {
    brand: "BMW", model: "M3 Competition M xDrive", cat: "Sedan", segment: "D-Performans", fuel: "Benzin",
    price: 14200000, hp: 530, torque: 650, acc: 3.5, top: 290, cons: 10.2, drive: "AWD", clr: 125,
    trunk: 480, seats: 5, comfort: 6, maint: 5, resale: 4,
    img: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=900&q=80",
    issues: ["dsg_wet"],
    weaknesses: [
      "Sert yarış süspansiyonu ve düşük yanaklı pist lastikleri kasislerde çok sert sarsar",
      "Pist ve agresif kullanımda yüksek fren balatası, disk ve lastik aşınma masrafı",
      "Şehir içi yoğun trafikte 14 - 17 litreye çıkan yüksek yakıt sarfiyatı"
    ],
    highlights: ["3.5 saniyede 0-100 km/s roket hızlanması; S58 çift turbo 6 silindirli yarış motoru", "M xDrive akıllı çekiş sistemi (tek tuşla %100 arkadan itiş drift moduna geçebilir)", "Karbon fiber tavan ve karbon çanak yarış koltukları"],
    pros: ["Süper spor otomobilleri piste gömen viraj ve ivmelenme yeteneği", "4 kapılı olması sayesinde aileyle de kullanılabilen canavar", "Muhteşem ZF 8 ileri M şanzıman"],
    cons: ["Sert süspansiyon kasislerde çok sert vurur", "Yüksek yakıt ve lastik tüketimi"]
  },
  {
    brand: "Porsche", model: "911 Carrera S (992.2)", cat: "Coupe", segment: "Spor Coupe", fuel: "Benzin",
    price: 16500000, hp: 450, torque: 530, acc: 3.7, top: 308, cons: 10.4, drive: "RWD", clr: 115,
    trunk: 132, seats: 4, comfort: 7, maint: 5, resale: 5,
    img: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=900&q=80",
    issues: ["fiat_rattle"],
    weaknesses: [
      "Çok alçak ön tampon burun yapısı sebebiyle dik kasislerde ön lift sistemi (burun kaldırma) gerektirmesi",
      "Sadece 132 litrelik ön bagaj ve çok sembolik arka koltuklar",
      "Yetkili servis periyodik bakım ve parça fiyatlarının astronomik seviyede olması"
    ],
    highlights: ["60 yıldır formülünü koruyan efsanevi arkadan motorlu boxer tasarımı", "Dünyanın en kusursuz çift kavramalı şanzımanı PDK (göz açıp kapayana kadar vites atar)", "Hem günlük sabah işe gitmeye hem Nürburgring pistinde rekor kırmaya uygun tek otomobil"],
    pros: ["Kusursuz direksiyon hissi ve frenleme performansı", "İkinci elde değer kaybetmeyip aksine prim yapan koleksiyon gücü", "Efsanevi silüet"],
    cons: ["Alçak burun yapısı kasislerde özen ister", "Yüksek servis ve parça maliyetleri"]
  },
  {
    brand: "Porsche", model: "Taycan 4S", cat: "Sedan", segment: "E Segment", fuel: "Elektrik",
    price: 11800000, hp: 598, torque: 710, acc: 3.7, top: 250, cons: 19.5, drive: "AWD", clr: 128,
    trunk: 407, seats: 4, comfort: 8, maint: 4, resale: 3, range: 560,
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
    issues: ["ev_winter_range"],
    weaknesses: [
      "Elektrikli lüks araçlarda ikinci el değer kaybı benzinli 911'e kıyasla çok daha hızlıdır",
      "Kışın sıfırın altındaki hava şartlarında otoyol menzilinin %25-30 düşmesi",
      "Arka koltuk tavan eğimi uzun boylu yolcular için hafif basıktır"
    ],
    highlights: ["800 Volt batarya mimarisi; 320 kW ultra hızlı şarjla 18 dakikada %10'dan %80'e dolum", "Arka aksta 2 ileri özel şanzımanla yüksek otoban hızlarında bile kesilmeyen ivmelenme", "Alçak ağırlık merkeziyle bir sedanın viraj alabileceği en keskin açı"],
    pros: ["Nefes kesen elektrikli ivmelenme ve Porsche yol tutuşu", "Ultra hızlı şarj mimarisi", "Göz alıcı aerodinamik tasarım"],
    cons: ["İkinci el değer kaybı benzinli modellere göre daha hızlı", "Arka tavan eğimi uzun boylular için alçak"]
  },
  {
    brand: "Volvo", model: "XC90 T8 Recharge Plug-in Ultimate", cat: "SUV", segment: "E-SUV", fuel: "Plug-in Hibrit",
    price: 9200000, hp: 455, torque: 709, acc: 5.4, top: 180, cons: 2.1, drive: "AWD", clr: 238,
    trunk: 640, seats: 7, comfort: 10, maint: 4, resale: 4, range: 73,
    img: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=900&q=80",
    issues: ["fiat_rattle"],
    weaknesses: [
      "Elektrikli batarya bittiğinde ağır 7 kişilik SUV gövdesiyle benzin tüketiminin 9.5 - 11 litreye çıkması",
      "180 km/s fabrika azami hız sınırı",
      "Büyük dış boyutları sebebiyle dar şehir içi sokaklarda dikkatli sürüş istemesi"
    ],
    highlights: ["455 beygir toplam güç ve 73 km saf elektrikli şehir içi menzili", "Standart 7 kişilik bağımsız koltuk dizilimi ve Bowers & Wilkins ses sistemi", "Orrefors el yapımı hakiki İsveç kristal vites topuzu"],
    pros: ["Şehir içinde sıfır benzinle elektrikli gibi kullanılabilme", "Geniş 7 kişilik ultra güvenli aile yaşam alanı", "Harika süspansiyon ve malzeme kalitesi"],
    cons: ["Batarya boşaldığında benzin tüketimi yükselir", "180 km/s hız limiti"]
  },
  {
    brand: "BMW", model: "X5 xDrive40i M Sport", cat: "SUV", segment: "E-SUV", fuel: "Benzin",
    price: 11500000, hp: 381, torque: 520, acc: 5.4, top: 250, cons: 9.2, drive: "AWD", clr: 214,
    trunk: 650, seats: 5, comfort: 9, maint: 5, resale: 4,
    img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80",
    issues: ["bmw_oil_leaks"],
    weaknesses: [
      "Yüksek MTV, kasko ve periyodik yetkili servis bakım faturaları",
      "100.000 km sonrasında plastik soğutma flanşları ve yağ filtre kütük contası kontrolü istemesi",
      "Geniş 21-22 inç jantların lastik değişim masrafının çok yüksek olması"
    ],
    highlights: ["Efsanevi B58 3.0 litre sıralı 6 silindirli motor (dünyanın en pürüzsüz motoru)", "İki parçalı split bagaj kapağı (alt kapak piknikte bank olarak kullanılabilir)", "xDrive dört çeker ve havalı süspansiyonla hem arazide hem otobanda üstün hâkimiyet"],
    pros: ["Muhteşem 6 silindir homurtusu ve güç", "Yüksek prestij ve sürüş keyfi", "Geniş ve lüks iç hacim"],
    cons: ["Yüksek vergi ve işletme maliyetleri", "Dar sokaklarda manevra dikkat ister"]
  },
  {
    brand: "Audi", model: "RS 6 Avant Performance", cat: "Station Wagon", segment: "E-Performans", fuel: "Benzin",
    price: 19500000, hp: 630, torque: 850, acc: 3.4, top: 305, cons: 12.5, drive: "AWD", clr: 125,
    trunk: 565, seats: 5, comfort: 9, maint: 5, resale: 4,
    img: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80",
    issues: ["dsg_wet"],
    weaknesses: [
      "Şehir içi agresif kullanımda 16 - 21 litreye ulaşan süper spor yakıt tüketimi",
      "Karbon seramik fren diskleri ve spor lastiklerin olağanüstü yüksek değişim maliyeti",
      "Çok geniş çamurlukları ve alçak ön lipi sebebiyle AVM rampalarında sürtme riski"
    ],
    highlights: ["4.0 litrelik çift turbo V8 motor ve 630 beygir vahşi güç", "3.4 saniyede 0-100 hızlanmasıyla süper sporları utandıran aile station wagon'u", "Genişletilmiş kaslı çamurluklar ve RS spor egzoz patlamaları"],
    pros: ["Bir otomobilde olabilecek en çılgın güç ile 5 kişilik aile pratikliğinin birleşimi", "Kusursuz quattro yol tutuşu", "Koleksiyon değeri"],
    cons: ["Çok yüksek yakıt tüketimi", "Seramik fren ve bakım maliyetleri"]
  },
  {
    brand: "Land Rover", model: "Defender 110 D300 HSE", cat: "Arazi (4x4)", segment: "Lüks Arazi", fuel: "Dizel",
    price: 12500000, hp: 300, torque: 650, acc: 7.0, top: 191, cons: 9.0, drive: "4x4", clr: 291,
    trunk: 857, seats: 5, comfort: 9, maint: 5, resale: 4,
    img: "https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=900&q=80",
    issues: ["landrover_air_elec"],
    weaknesses: [
      "Karmaşık elektronik sensör ve havalı süspansiyon arıza bildirimleri",
      "Yetkili servis ve orijinal yedek parça fiyatlarının aşırı yüksekliği",
      "2.4 tonluk ağır gövde sebebiyle şehir içi tüketimin 11-13 litrelere çıkması"
    ],
    highlights: ["900 mm sudan geçme derinliği ve 291 mm havalı süspansiyon yüksekliği", "Terrain Response 2 akıllı arazi bilgisayarı ile kum, çamur, kar, kaya tanımayan yetenek", "Retro-modern ikonik tasarım ve zırh gibi sağlam monokok gövde"],
    pros: ["Arazide dünyanın en yetenekli araçlarından biri", "Otoyolda bir lüks sedan kadar sessiz ve konforlu", "Muazzam karizma"],
    cons: ["Elektronik modül arızaları ve sensör hataları", "Yüksek parça fiyatları"]
  },

  // ==================== SÜPER LÜKS & EGZOTİK (22 Mn ₺ ve üzeri) ====================
  {
    brand: "Land Rover", model: "Range Rover P530 Autobiography", cat: "SUV", segment: "Ultra Lüks SUV", fuel: "Benzin",
    price: 24500000, hp: 530, torque: 750, acc: 4.6, top: 250, cons: 12.0, drive: "AWD", clr: 295,
    trunk: 818, seats: 5, comfort: 10, maint: 5, resale: 4,
    img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",
    issues: ["landrover_air_elec"],
    weaknesses: [
      "Airmatic süspansiyon ve elektronik modüllerin garanti sonrası yüksek bakım hassasiyeti",
      "Astronomik kasko ve yıllık işletme maliyeti",
      "V8 motorun şehir içinde 16-19 litre tüketmesi"
    ],
    highlights: ["İngiliz Kraliyet Ailesi'nin resmi tercihi; lüks SUV sınıfının kurucusu", "Koltuk başlıklarında gürültü önleyici aktif hoparlörler (uçak kabini gibi sıfır ses)", "BMW kökenli 4.4 litre çift turbo V8 motor"],
    pros: ["Zirve konfor ve heybet", "Olağanüstü kabin sessizliği ve malzeme kalitesi", "Arazide ve otobanda tek hâkim"],
    cons: ["Çok yüksek kasko ve bakım masrafları", "Garanti sonrası servis hassasiyeti"]
  },
  {
    brand: "Ferrari", model: "296 GTB Assetto Fiorano", cat: "Süper Spor", segment: "Egzotik", fuel: "Plug-in Hibrit",
    price: 39000000, hp: 830, torque: 740, acc: 2.9, top: 330, cons: 6.4, drive: "RWD", clr: 105,
    trunk: 150, seats: 2, comfort: 6, maint: 5, resale: 5,
    img: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=900&q=80",
    issues: ["fiat_rattle"],
    weaknesses: [
      "Sadece 105 mm yerden yükseklik sebebiyle dik rampalı otoparklara ve kasisli sokaklara kesinlikle giremez",
      "Yalnızca 2 koltuk ve 150 litrelik küçük ön bagaj (sırt çantası kapasitesi)",
      "Yıllık bakım, kasko ve lastik maliyetinin sıfır bir C segment araba fiyatına yaklaşması"
    ],
    highlights: ["830 beygir toplam güç; 120 derece açılı V6 turbo + Formula 1 MGU-K elektrik motoru", "0-100 km/s sadece 2.9 saniye; 0-200 km/s akıl almaz 7.3 saniye!", "Ferrari'nin Maranello ses mühendislerinin 'küçük V12' lakabını taktığı çığlık atan egzoz"],
    pros: ["Dünyanın en gelişmiş şasi ve yarış elektroniği", "Safkan yarış genetiği ve inanılmaz tork", "Yatırım değeri taşıyan koleksiyonluk şaheser"],
    cons: ["Sadece 2 koltuk ve küçük ön bagaj", "Bozuk köy veya kasisli sokaklara kesinlikle sokulamaz"]
  },
  {
    brand: "Lamborghini", model: "Urus SE Plug-in Hybrid", cat: "SUV", segment: "Süper SUV", fuel: "Plug-in Hibrit",
    price: 44000000, hp: 800, torque: 950, acc: 3.4, top: 312, cons: 7.0, drive: "AWD", clr: 250,
    trunk: 616, seats: 5, comfort: 8, maint: 5, resale: 5,
    img: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=900&q=80",
    issues: ["dsg_wet"],
    weaknesses: [
      "Astronomik kasko ve yıllık vergi giderleri",
      "Seramik fren diskleri ve 23 inç özel Pirelli P Zero lastiklerinin çok yüksek değişim maliyeti",
      "Aşırı heybetli boyutları sebebiyle standart otopark çizgilerine sığmakta zorlanması"
    ],
    highlights: ["800 beygir güç ve 950 Nm tork; 312 km/s azami hızla dünyanın en hızlı süper SUV'u", "Savaş jeti kokpiti tasarımı, kırmızı kalkanlı çalıştırma butonu ve ANIMA sürüş modları", "Akaban seramik frenlerle 100 km/s'den 33 metrede durma kabiliyeti"],
    pros: ["Hem süper spor hızı hem 5 kişilik aile SUV ferahlığı", "Durdurulamaz görsel heybet ve egzoz sesi", "Çok yüksek prestij"],
    cons: ["Astronomik satın alma ve sigorta maliyetleri", "Yüksek parça giderleri"]
  }
].map((c, i) => ({ id: i + 1, ...c }));

/* ---------------------------------------------------------
   TOPLULUK GERÇEK KULLANICI DENEYİMLERİ VE KRONİK GERİ BİLDİRİMLERİ (SEED DATA)
   --------------------------------------------------------- */
const SEED_REVIEWS = [
  {
    carId: 1, // Egea Sedan 1.4
    userName: "Murat K. (Taksi & Aile Kullanıcısı)",
    city: "İstanbul",
    rating: 4,
    date: "2026-02-14",
    km: "85.000 km",
    title: "Parçası bedava, ama yağ çubuğunu elden bırakmayın",
    comment: "3 yıldır kullanıyorum. Her sokakta parçası var, bakımını mahalledeki usta 2000 liraya yapıyor. LPG ile kilometresi 1.5 TL yakıyor. Tek kronik sıkıntısı her 2000 km'de bir 300-400 gram yağ eksiltiyor, bagajda 1 litre yağ taşıyorum devamlı kontrol ediyorum.",
    verifiedOwner: true
  },
  {
    carId: 4, // Clio 1.0 TCe
    userName: "Selin B.",
    city: "İzmir",
    rating: 5,
    date: "2026-03-01",
    km: "42.000 km",
    title: "Şehir içi için bundan daha ideali yok",
    comment: "Alsancak'ın dar sokaklarında park etmek o kadar kolay ki. Yakıtı kokluyor resmen, ortalama 5.4 litre. Sadece yazın yoğun trafikte dur-kalk yaparken şanzıman 1'den 2'ye geçerken hafif bir titreme yapıyor, frene tam basınca düzeliyor.",
    verifiedOwner: true
  },
  {
    carId: 9, // Corolla 1.8 Hibrit
    userName: "Av. Cengiz Y.",
    city: "Ankara",
    rating: 5,
    date: "2026-01-20",
    km: "110.000 km",
    title: "Sanayiyi unutturan Japon harikası",
    comment: "Ankara trafiğinde kışın 4.5, yazın 3.9 litre yakıyor. Bugüne kadar sadece periyodik yağ ve filtre değişimi için servise gittim. Tek kusuru dipgaz yaptığınızda motorun bağırması, ama sakin kullanırsanız fısıltı gibi gidiyor.",
    verifiedOwner: true
  },
  {
    carId: 10, // Megane Sedan 1.3 TCe
    userName: "Burak T.",
    city: "Bursa",
    rating: 4,
    date: "2026-02-28",
    km: "68.000 km",
    title: "Motor canavar gibi ama EDC'ye dikkat",
    comment: "1.3 TCe motorun gidişi inanılmaz iyi, sol şeritte üzmez. Bagajı yayla gibi. Kronik olarak multimedya ekranı bazen donup kendini yeniden başlatıyor, serviste yazılım güncelleyince azaldı.",
    verifiedOwner: true
  },
  {
    carId: 17, // Togg T10X
    userName: "Emre G.",
    city: "Kocaeli",
    rating: 4,
    date: "2026-03-12",
    km: "35.000 km",
    title: "Evden şarjla bedavaya geziyorum, ekran yazılımı toparlandı",
    comment: "Aracın iç hacmi ve konforu Mercedes seviyesinde. Evdeki wallbox ile tam depo 150 TL'ye doluyor ve 450 km gidiyor. İlk aldığımda ekran donuyordu, gelen uzaktan güncellemelerle (OTA) tamamen akıcı oldu. Gurur duyuyoruz.",
    verifiedOwner: true
  },
  {
    carId: 23, // BMW 320i
    userName: "Kaan D.",
    city: "İstanbul",
    rating: 5,
    date: "2026-03-05",
    km: "75.000 km",
    title: "Sürüş hissi rakipsiz ama bakımını aksatmayın",
    comment: "Viraja girerken arkadan itişin verdiği haz hiçbir arabada yok. ZF şanzıman sanat eseri. Dikkat: 70.000 km'de plastik su flanşından hafif antifriz sızıntısı oldu, vaktinde fark edip orijinaliyle değiştirdim. Termostat ve hortumları takip etmek lazım.",
    verifiedOwner: true
  }
];
