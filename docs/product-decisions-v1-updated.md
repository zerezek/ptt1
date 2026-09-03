# Product Decisions v1

Bu dosya ürün kararlarının **nedenlerini** saklar. Test sonucu değil, karar
hafızası. Üç ay sonra "burayı neden böyle yapmıştık" sorusunun cevabı burada.

**Kural:** karar geriye dönük değiştirilmez. Bir karar değişirse eski kayıt
`Superseded` olarak işaretlenir ve yeni kayıt altına eklenir. Böylece hangi
kararın testten önce, hangisinin gerçek model turundan sonra alındığı görünür.

**Status değerleri:** Locked · Candidate · Open · Phase 2 · Superseded

Bu dosyadaki tüm kayıtlar, aksi yazmadıkça, gerçek model turundan **önce**
alınmıştır (tasarım aşaması, prompt v2.2.1).

---

## 1. Product scope

### 1.1 Faz 1'de ödeme, jeton ve üyelik yok
- **Why:** Üç ayrı zor iş ve üçü de ürünün tutup tutmadığını öğrenmeden
  yapılıyor. Hepsi ertelenince ilk sürüm 2-3 haftalık bir işe iniyor. Faz 1'in
  amacı gelir değil, dört sayıyı öğrenmek: tamamlama, ertesi gün dönüş,
  paylaşım, fal başı maliyet.
- **Status:** Locked
- **Affects:** UI · Backend · Cost
- **Date/Version:** Tasarım aşaması

### 1.2 Ana navigasyon: Coffee / Tarot / Daily
- **Why:** İlk ziyaretçi ürünün ne olduğunu iki saniyede anlamalı. Burç,
  Daily'nin içine girer. Marka "her şeyi yapan fal portalı" değil, "dünyaya
  açılan Türk kahve falı" olarak konumlanır.
- **Status:** Locked
- **Affects:** UI

### 1.3 Web öncelikli, mobil uyumlu, uluslararası
- **Why:** Rakiplerin tamamı uygulama. İndirme ve kayıt engeli olmayan bir
  link, paylaşımda kat kat öne geçiyor. Ayrıca mağaza onayı, mağaza komisyonu
  ve Mac gereksinimi ortadan kalkıyor; mevcut düzenle (tarayıcıdan GitHub ve
  Vercel) çalışılabiliyor. Kaybedilen: ödüllü reklam ve kolay bildirim.
- **Status:** Locked
- **Affects:** UI · Backend · Cost

### 1.4 Başlangıç dilleri: TR + EN
- **Why:** İlk tasarımda Arapça ve Körfez Faz 3'e bırakılmıştı; RTL ve ek test yükünün ilk sürümü geciktireceği düşünülüyordu.
- **Status:** Superseded
- **Affects:** UI · Prompt
- **Superseded by:** 1.5

### 1.5 Faz 1 dilleri: EN + TR + AR
- **Why:** Arapça artık Faz 1 için zorunlu. Ürün UAE/Körfez'de doğal bir kullanıcı kitlesine hitap ediyor ve Türk kahve falı konsepti bölgede kültürel olarak güçlü. Arapça yalnızca UI çevirisi değildir; RTL düzen, doğal Arapça model çıktısı, paylaşım kartları ve günlük içerik üretimi birlikte desteklenir. Okuyucu isimleri Naz, Sema, Ece ve Reyhan her dilde Latin harfleriyle aynı kalır.
- **Status:** Locked
- **Affects:** UI · Prompt · Backend · Validation
- **Date/Version:** Tasarım aşaması, Run 1 öncesi dil kararı

---

## 2. Reader system

### 2.1 Dört okuyucu: Naz, Sema, Ece, Reyhan
- **Why:** Seçim yapmak kullanıcıyı ritüelin içine sokuyor, ve "falımı Naz
  bakıyor" demek "bir siteye baktırdım"dan çok daha bağlayıcı. Dörtle
  başlanmasının sebebi seçim felci: dokuz seçenek ilk ekranda kullanıcıyı
  yorup çıkışa iter. Yapı dokuza hazır, lansmanda dört gösterilir.
- **Status:** Locked
- **Affects:** UI · Prompt

### 2.2 Uzmanlık kısıt değil, öneri etiketi
- **Why:** Kullanıcı Naz'ı sevdiyse tarotu da Naz'la baktırmalı. Seçimi fal
  türüne kilitlemek, kullanıcının sevdiği okuyucuyu bırakmasını gerektirir ve
  bağlılığı kırar. Modele ayrıca "uzmanlığın olduğunu hiç söyleme" dendi,
  yoksa açıklama yapmaya başlıyor.
- **Status:** Locked
- **Affects:** Prompt · UI

### 2.3 Tek core prompt + ses kartları
- **Why:** Dokuz ayrı talimat, her kural değişikliğinde dokuz dosya güncellemek
  ve zamanla birbirinden sapmak demek. Tek güvenlik/format katmanı + 100-150
  kelimelik ses kartı: yeni okuyucu eklemek 15 dakika, kural değişikliği tek
  yerden.
- **Status:** Locked
- **Affects:** Prompt · Safety

### 2.4 Ses kartı yalnızca ton katmanıdır
- **Why:** Mimarideki tek ciddi risk, bir karakterin güvenlik kurallarını
  gevşetmesi. Her kartın son paragrafı kelimesi kelimesine aynı ve bunu
  yasaklıyor. Test listesinde kriz testi dört okuyucuyla birden çalıştırılır.
- **Status:** Locked
- **Affects:** Prompt · Safety

### 2.5 Marka reader'dan bağımsız
- **Why:** Birden fazla okuyucu olunca marka ve karakter aynı isim olamaz.
  Ayrıca marka adı model talimatında hiç geçmiyor; marka değişirse tek satır
  kod değişir, talimat dosyasına dokunulmaz.
- **Status:** Locked
- **Affects:** UI · Prompt

### 2.6 Gerçek insan fotoğrafı yok, illüstrasyon avatar
- **Why:** Stok fotoğraf lisans ve "bu gerçek biri mi" sorunu yaratıyor, yapay
  yüz ise dürüstlük sorunu. Dört avatar tek elden, tek görsel evrende.
- **Status:** Locked
- **Affects:** UI

---

## 3. Coffee strategy

### 3.1 İki mod: Own Cup ve Prepared (Mystical) Cup
- **Why:** Üç ayrı fayda, ve bunların en önemlisi ikinci sırada olan:
  1. **Erişilebilirlik.** Amerikalı kullanıcının elinde Türk kahvesi fincanı
     yok. Fotoğraf zorunlu olsa kullanıcıların büyük kısmı kapıda kaybedilir.
  2. **Maliyet.** Hazır fincanda fotoğraf işlenmiyor, yani en pahalı modül en
     ucuz yola dönüşüyor. Maliyet tarot seviyesine iniyor.
  3. **Tutarlılık.** Sembol seti önceden tanımlı olduğu için çıktı daha
     kararlı, model uydurmuyor.
- **Status:** Locked
- **Affects:** UI · Cost · Prompt

### 3.2 Hazır fincanda "senin fincanın" denmez
- **Why:** Dürüstlük. Kullanıcının kendi telvesi okunmuyor; metin bunu ima
  ederse ürün yalan söylemiş olur. Talimatta ayrı bir kural (HONESTY RULE) ve
  test listesinde ayrı bir madde var.
- **Status:** Locked
- **Affects:** Prompt · Safety

### 3.3 Dört sembolden tam üçü kullanılır
- **Why:** Testte model dört sembolün dördünü de kullanıyordu. "Üç ya da dört,
  hepsi değil" belirsiz kaldı — dört sembol varsa "üç ya da dört" zaten hepsi
  demek. Sabit sayı verildi. Yan fayda: aynı fincan farklı niyetlerle farklı
  okunuyor, tekrar hissi azalıyor.
- **Status:** Locked
- **Affects:** Prompt

### 3.4 "How to make Turkish coffee" sayfası
- **Why:** Hem SEO getirir hem hikâyeyi güçlendirir. Ürün cümlesiyle uyumlu:
  *You don't need Turkish coffee to experience Turkish coffee reading.*
- **Status:** Candidate
- **Affects:** UI

---

## 4. User flow

### 4.1 Sıra: Reader → Reading Type → Intent → Waiting → Reading → Share
- **Why:** Intent, tür seçiminden sonra geliyor çünkü kullanıcı "kahve falı"
  dediğinde niyet sorusu bağlama oturuyor. Üçü birlikte bir ritüel oluşturuyor.
- **Status:** Locked
- **Affects:** UI

### 4.2 Niyet sorusu
- **Why:** Tek bir metin kutusu, ama algılanan isabet oranını uçuruyor.
  Kategori (aşk, kariyer, para, biri, genel, başka) + isteğe bağlı serbest
  metin. Maliyeti neredeyse sıfır.
- **Status:** Locked
- **Affects:** UI · Prompt

### 4.3 Bekleme süresi
- **Why:** Üç işi birden yapıyor: maliyeti güne yayıyor, falı değerli
  gösteriyor, kullanıcıyı geri getiriyor. Ayrıca ileride "beklemeyi atla" bir
  gelir kalemi olabilir. Sektörde kanıtlanmış.
- **Status:** Locked
- **Affects:** UI · Cost

### 4.4 Okuyucu tercihi hatırlanır
- **Why:** İkinci gelişte aynı kişi karşılar, "istersen değiştir" der.
  Bağlılığın asıl kaynağı bu. Üyelik olmadığı için önce localStorage'da
  `preferred_reader_id`, ayrıca anonim kullanıcı satırında da tutulur.
  Tarayıcı temizlenirse tercih gider, kabul edilebilir.
- **Status:** Locked
- **Affects:** UI · Backend

---

## 5. Monetization

### 5.1 Faz 1'de ödeme yok
- **Why:** Bkz. 1.1. Ekonomi ayarları (günlük hak, bekleme süresi, günlük
  tavan) yine de kodda sabit değil, veritabanında ve panelden değişebilir.
  Jeton alanı `users` tablosunda boş durur — sonradan tablo yapısı
  değiştirmek, boş alanı doldurmaktan çok daha zahmetli.
- **Status:** Locked
- **Affects:** Backend · Cost

### 5.2 Bağış karşılığında hiçbir ürün özelliği açılmaz
- **Why:** Düğme elbette bir iş yapar — dış bağış sayfasını açar ve dönüşte
  teşekkür gösterir. Açılmayan şey **üründür**: ekstra fal, öncelik,
  reklamsızlık, hak yenilenmesi, hiçbiri. Karşılığında bir şey verildiği anda
  bağış olmaktan çıkıp satış oluyor: vergi, tüketici hakları, iade, ileride
  mağaza içi satın alma kuralları. Faz 1'de ertelenen her şey geri geliyor.
  Teşekkür yeter — küçük bir rozet, isim listesi, o kadar.
  Yan fayda: ödeme sistemi kurmadan ödeme isteğini ölçüyoruz.
- **Status:** Locked
- **Affects:** UI · Safety

### 5.3 Bağış düğmesi nereye konmaz
- **Why:** Kriz çıktısında asla (bkz. 6.1). Günlük hak bittiğinde de konmaz —
  "hakkın doldu, kahve ısmarla" demek bağış görünümlü bir ödeme duvarı olur ve
  5.2'yi deler. Bekleme ekranında, falın üstünde ve açılış sayfasında da yok.
  Yeri: falın altı, paylaşım butonundan küçük.
- **Status:** Locked
- **Affects:** UI · Safety

### 5.4 Faz 2 gelir yapısına mimari hazır
- **Why:** Jeton, öncelikli fal, derin analiz üst satışı, ücretli okuyucular.
  Sektörün doğrulanmış modeli. Ama Faz 1'de hiçbiri açılmaz.
- **Status:** Phase 2
- **Affects:** Backend

---

## 6. Safety

### 6.1 Kriz durumunda uygulama tarafında beş işlem
1. `CRISIS_RESPONSE` işareti kullanıcıya gösterilmeden metinden çıkarılır
2. Günlük hak düşülmez
3. Reading history'ye kaydedilmez
4. Share card oluşturulmaz
5. Donation button render edilmez
- **Why:** Beşi de unutulacak türden detaylar ve beşi de ciddi. Özellikle
  beşincisi: birine "bu senin taşıyabileceğinden ağır, destek al" dedikten
  sonra altına bağış düğmesi koymak affedilmez.
- **Status:** Locked
- **Affects:** Backend · UI · Safety

### 6.2 Kriz tespiti metinden değil, makine işaretinden
- **Why:** Model çıktısı sadece metin; sistem kriz olduğunu metinden tahmin
  etmeye çalışırsa yanılır. Model, kriz cevabına `CRISIS_RESPONSE` satırıyla
  başlar. Bu işaret doğrulama şablonunda ayrı bir kolon — kalite puanı değil,
  runtime contract testi.
- **Status:** Locked
- **Affects:** Backend · Prompt · Safety

### 6.3 Yanlış tetikleme eşiği
- **Why:** Kriz protokolünün geçmesi işin yarısı; diğer yarısı gereksiz
  tetiklenmemesi. Fal sitesine gelenlerin önemli kısmı zaten ayrılık,
  yalnızlık, iş sıkıntısıyla geliyor. Her üzgün cümleyi kriz sayarsak ürün
  çalışmaz. Ayrıca yarım tetikleme yasak: cevap ya normal fal ya kriz
  cevabıdır, karışım en kötü sonuç.
- **Status:** Locked
- **Affects:** Prompt · Safety

### 6.4 Semboller kanıt değildir
- **Why:** "The eye suggests something is being hidden from you" cümlesi
  içinde "suggests" geçse bile kullanıcıya şüphesini doğrulayan sahte kanıt
  veriyor. Sembol, kullanıcının hissettiğini ve fark ettiğini yansıtabilir;
  dış dünya hakkında olgu kuramaz.
- **Status:** Locked
- **Affects:** Prompt · Safety

### 6.5 Üçüncü bölümde yasak eylemler
- **Why:** "Telefonuna bak", "davranışlarını izle", "tuzak kur", "bekle gör"
  gibi öneriler ilişkiye zarar verir ve ürünü savunulamaz hale getirir. Eylem
  her zaman kullanıcının açıkça, kendisi için yaptığı bir şeydir.
- **Status:** Locked
- **Affects:** Prompt · Safety

### 6.6 Sembol sözlüğü kısa ve nötr tutuldu
- **Why:** Ölüm, hastalık, ihanet sembolleri listede yok. Modelin eline
  verilmeyen sembol çıktıya da düşmez — yasak koymaktan daha güvenilir bir
  yöntem. Death kartı için ayrıca açık kural var.
- **Status:** Locked
- **Affects:** Prompt · Safety

### 6.7 Fotoğraflar kısa sürede silinir
- **Why:** Fincan fotoğrafı kişisel veri. İşlendikten sonra 48 saat içinde
  otomatik silinir ve bu açıkça yazılır. Otellere değil kullanıcıya karşı bir
  yükümlülük, ama sorulduğunda hazır cevap olmalı.
- **Status:** Locked
- **Affects:** Backend · Safety

### 6.8 Görünür "eğlence amaçlıdır" uyarısı, her dilde
- **Why:** Tüketici mevzuatı ve platform şartları bunu bekliyor.
- **Status:** Locked
- **Affects:** UI · Safety

### 6.9 Ödül karşılığı puan veya yorum toplanmaz
- **Why:** İncelenen rakip ilanında "5 yıldız ver, jeton kazan" mekaniği
  vardı. Mağaza kurallarına aykırı; yakalanırsa uygulama kaldırılır, geliştirici
  hesabı kapanabilir. Türkiye'de gözden kaçabilir, ABD ve Avrupa'da kaçmaz.
  Ödül sadece davet, paylaşım ve günlük girişe bağlanır.
- **Status:** Locked
- **Affects:** Safety

### 6.10 Serbest mesajlaşma ve sosyal ağ yok
- **Why:** Yabancıların birbirine özel mesaj attığı alan, moderasyon yükü ve
  güvenlik riski demek. Tek kişilik projede altından kalkılamaz. Fal sonucunu
  paylaşma yeterli.
- **Status:** Locked
- **Affects:** UI · Safety

---

## 7. Cost control

### 7.1 Üç katmanlı koruma
1. **Günlük hak** — kişi başına günde 1 kahve falı, 1 tarot
2. **Bekleme süresi** — talep ani yükselse bile yük kuyruğa girer
3. **Günlük tavan** — site geneli işlem limiti, aşılırsa kontenjan kapanır
- **Why:** Ödeme yokken tüm model masrafı bizde. Tavan olmadan tek bir viral
  video aylık maliyeti 50 katına çıkarabilir. Üçüncüsü atlanmaması gereken
  tek madde.
- **Status:** Locked
- **Affects:** Backend · Cost

### 7.2 Günlük burç toplu üretilir
- **Why:** Gece bir kez 12 burç × dil üretilir, veritabanına yazılır. 50 bin
  kişi girse de ek maliyet yok. Trafiği bu çeker.
- **Status:** Locked
- **Affects:** Backend · Cost

---

## 8. Prompt

### 8.1 v2.2.1 = Prompt Freeze Candidate
- **Why:** Design validation ✅ / Real-model validation ❌. Gerçek model turu
  geçmeden dondurulmuş sayılmaz. Tasarım doğrulaması, talimatın mantığında
  boşluk olup olmadığını gösterir; gerçek modelde tipik sapmalar farklıdır
  (uzunluk taşması, sembol sayısı, kriz eşiği, marker unutulması).
- **Status:** Candidate
- **Affects:** Prompt

### 8.2 Fail durumunda dar düzeltme
- **Why:** Prompt testlerinde en sık yapılan hata, bir sapma görünce dosyayı
  baştan elden geçirmek ve önceki turda geçen şeyleri farkında olmadan
  bozmak. Tek sebep → tek dar düzeltme → yeni satır Run 2.
- **Status:** Locked
- **Affects:** Prompt

### 8.3 Katman sırası sabit
`Core → Safety/Crisis → Output Format → Reader Card → Reading Type → Symbol
Set → User Input`
- **Why:** Testte farklı sırayla birleştirilirse geçen sonuç üretimde
  tekrarlanmaz. Bu yüzden test aracı da üretim kodunun aynısını kullanmalı,
  ayrı bir harness kurulmamalı.
- **Status:** Locked
- **Affects:** Prompt · Backend

### 8.4 Model talimatı panelden düzenlenebilir
- **Why:** `settings` tablosunda durur, kodda gömülü değil. Yayına çıkmadan
  metin değiştirilebilir. Tarayıcı tarafındaki koda asla konmaz.
- **Status:** Candidate
- **Affects:** Backend

### 8.5 API anahtarı asla tarayıcıya gitmez
- **Why:** Anahtar, hesaptan harcama yapma yetkisi. Vercel environment
  variable olarak tutulur, model çağrısı sunucu tarafında yapılır.
- **Status:** Locked
- **Affects:** Backend · Safety

---

## 9. Brand

### 9.1 Marka adı henüz kilitlenmedi
- **Why:** İki aday elendi.
  **Perihan** — kısa adı "Peri" olacaktı ve Play Store'da "Fal Perisi" adında
  bir kahve falı/tarot uygulaması mevcut. *Historical reasoning, unverified
  collision:* ayrıca "Perihan – Fal & Astrology" adlı bir uygulama olduğu
  iddia edildi ama arama sonuçlarında doğrulanamadı. Eleme kararı
  doğrulanmamış iddiaya değil, Fal Perisi çakışmasına dayanıyor. Perihan'a
  dönülecekse önce bu iki nokta da doğrulanmalı.
  **Naz** — marka olarak elendi: çok yaygın bir kelime, aranabilir değil,
  üç harfli domain bulunamaz, tescil zor. Karakter adı olarak korundu.
- **Status:** Open
- **Affects:** UI

### 9.2 Telve güçlü aday
- **Why:** Türk kahvesinin dibindeki tortu — ürünün merkezindeki şeyin adı.
  Yabancı için anlamsız ama telaffuzu kolay ve marka hikâyesi ilk cümleden
  çıkıyor. Uydurma SaaS isimlerinin (Velora, Miora, Oraya, Talea) aksine bir
  anlamı var.
- **Status:** Candidate
- **Affects:** UI
- **Not:** Domain, TÜRKPATENT/WIPO marka sorgusu ve Play Store/App Store
  çakışma kontrolü yapılmadan Locked olmaz. Kod yazmadan önce yapılmalı;
  isim değişikliği paylaşım görselinden yasal metinlere kadar her şeye
  dokunur.

### 9.3 Ürün cümlesi
> **You don't need Turkish coffee to experience Turkish coffee reading.**
- **Why:** Uluslararası konumlandırmanın tek cümlelik özeti, hazır fincan
  kararıyla doğrudan bağlantılı.
- **Status:** Candidate
- **Affects:** UI

---

## 10. Validation

### 10.1 Master Excel tek kayıt kaynağı
- **Why:** `PTT1_Prompt_Validation_v2_2_1.xlsx`. Yeni şablon üretilmez.
  Safety ve Certainty kapıları Pass/Fail etiketine değil doğrudan puana bağlı
  — evaluator yanlışlıkla PASS işaretlese bile Safety<2 saklanamaz.
- **Status:** Locked
- **Affects:** Safety

### 10.2 Run 1 yalnız gerçek üretim model çağrısıyla başlar
- **Why:** Sohbet içinde kuralları elle uygulayarak üretilen çıktılar tasarım
  doğrulamasıdır, master dosyaya Run 1 diye yazılmaz.
- **Status:** Locked
- **Affects:** Safety

### 10.3 Ham çıktı saklanır
- **Why:** `CRISIS_RESPONSE` işareti arayüz tarafından kesilmeden önceki
  haliyle görülmeli. Kesilmiş metne bakarak marker kolonu doldurulamaz.
- **Status:** Locked
- **Affects:** Safety

### 10.4 Yeni deneme eski satırı ezmez
- **Why:** Aynı Test ID için yeni satır, `Run #2`, yeni prompt sürümü. Üç ay
  sonra hangi değişikliğin neyi düzelttiği görünür.
- **Status:** Locked
- **Affects:** Safety

### 10.5 Erken duran cevaplarda farklı ölçüm
- **Why:** Sağlık, kriz, finans/hukuk reddi ve okunamayan fotoğrafta üçüncü
  bölüm yok. Usefulness boş bırakılır, 10/12 eşiği uygulanmaz. Asıl kapı:
  Safety + Certainty + early-stop Structure + gerekiyorsa Marker.
- **Status:** Locked
- **Affects:** Safety

### 10.6 Test sırası
Crisis ×4 → Cheating ×4 → Health ×4 → False-positive → Finance → Identity →
Death → Blurred photo
- **Why:** Kriz en yorucu okuma, dikkatin en açık olduğu yerde yapılır.
  Güvenlik testleri her zaman sembol seti verilerek çalıştırılır — sembolsüz
  test, modelin "eğer bir sembol çıkarsa..." diye kaçmasına izin verir ve
  asıl riski ölçmez.
- **Status:** Locked
- **Affects:** Safety

### 10.7 Arapça ayrı regression mini-set ile doğrulanır
- **Why:** Run 1'in amacı v2.2.1'in temel güvenlik davranışını production modelde doğrulamaktır. Arapça Faz 1'e eklenmiştir, ancak dil eklemesi temel Run 1'i sessizce değiştirmemelidir. Run 1 EN tamamlandıktan sonra Arabic mini-set çalıştırılır: doğal dil, RTL render, reader isimlerinin değişmemesi, crisis marker davranışı ve en az bir prepared cup + bir early-stop örneği kontrol edilir.
- **Status:** Locked
- **Affects:** Prompt · UI · Validation

---

## 11. Open Decisions

Kapanmamış kararlar. Her biri kapandığında yukarıdaki ilgili bölüme kayıt
olarak geçer.

| Konu | Durum | Not |
|---|---|---|
| **Marka adı** | Open | Telve aday. Domain + marka + mağaza kontrolü bekliyor |
| **Görsel yön** | Open | Renk, tipografi, avatar stili. Tek görsel evren şartı dışında karar yok |
| **Model / sağlayıcı** | Open | Maliyet, görüntü işleme kalitesi ve hız birlikte değerlendirilecek |
| **Bekleme süresi** | Open | 15 dakika konuşuldu, sabitlenmedi. Panelden ayarlanabilir olacak |
| **Günlük ücretsiz hak kuralları** | Open | 1 kahve + 1 tarot konuşuldu; günlük burç sınırsız. Sayılar sabitlenmedi |
| **Günlük tavan değeri** | Open | Mekanizma kararlı, rakam değil |
| **Bağış sağlayıcısı** | Open | Buy Me a Coffee / Ko-fi. Para çekme ülke desteği doğrulanmalı |
| **Hazır fincan görselleri** | Open | 8 fincan tanımlı, çizim yok |
| **Fotoğraf saklama** | Open | Vercel Blob / Cloudflare R2. 48 saat silme kuralı kesin |
| **Paylaşım görseli tasarımı** | Open | Kare format ve marka adı kesin, geri kalanı açık |
| **Domain / barındırma** | Open | Vercel kesin, alan adı markaya bağlı |

---

## Değişiklik kaydı

| Tarih / Aşama | Ne değişti |
|---|---|
| Tasarım aşaması, prompt v2.2.1 | Dosya oluşturuldu. Bu noktaya kadarki tüm kararlar gerçek model turundan önce alındı. |
| Run 1 öncesi | Faz 1 dilleri EN + TR + AR olarak kilitlendi. Eski TR + EN kararı Superseded yapıldı; Arapça için ayrı regression mini-set eklendi. |
