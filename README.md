# 🧛‍♂️ Katil Kim? (Vampir Köylü) - Moderatörsüz Deneyim

Arkadaşlarınızla bir araya geldiniz, Vampir Köylü oynamak istiyorsunuz ama kimse **moderatör** olmak istemiyor mu? "Katil Kim?", tam da bu sorunu çözmek için geliştirildi! 

Telefonunuzu masanın ortasına koyun ve arkanıza yaslanın. Oyunun bütün yönetimini, sesli komutlarını ve gece-gündüz döngülerini bu web uygulaması sizin yerinize yapacak. Üstelik sıfır kurulumla! 🚀

---

test : https://itsravn.github.io/katilkim/

## ✨ Özellikler

*   **🗣️ Sesli Moderatör (TTS):** Gözleriniz kapalıyken bile telefon size kimin uyanıp kimin uyuyacağını Türkçe sesli asistanla söyler.
*   **📱 PWA Desteği (Native App Hissi):** Uygulamayı tarayıcınızdan açıp **"Ana Ekrana Ekle"** diyerek tıpkı App Store veya Play Store'dan indirilmiş gerçek bir mobil oyun gibi (tam ekran, üst limitsiz) oynayabilirsiniz.
*   **🎨 Premium Tasarım:** Framer Motion ile güçlendirilmiş yumuşak geçişler, 3D kart çevirme (flip) efektleri ve karanlık uzay (Apple Frosted Glass) tasarımı.
*   **💾 Çevrimdışı/Hafıza Desteği:** Oyun ortasında ekran kilitlense veya sekmeyi kapatsanız bile, LocalStorage sayesinde oyun nerede kaldıysa tam oradan devam eder.
*   **⚡ Sunucusuz (Zero-Backend):** Verileriniz tamamen cihazınızda kalır, internette hiçbir sunucuya veri gönderilmez. Bu sayede sıfır gecikme!

---

## 🎮 Nasıl Oynanır?

1.  **Rolleri ve İsimleri Dağıtın:** Oyuncu isimlerini girin ve toplam kişi sayısı kadar (Katil, Doktor, Köylü) rol belirleyin.
2.  **Kartları Çekin:** Telefon "Ahmet'e ver" dediğinde, Ahmet telefonu alır, kartının üzerine dokunup rolünü gizlice öğrenir ve anladım diyerek geri bırakır.
3.  **Gece Fazı:** Telefon masanın ortasında durur. Sesli asistan sırayla önce Katilleri, sonra Doktoru uyandırır. Sırası gelen oyuncular sessizce uyanıp ekrandan seçimlerini yapar.
4.  **Gündüz Fazı:** Asistan herkesi uyandırır, gece yaşananları açıklar. 2 dakikalık tartışma süresi başlar.
5.  **Köy Meydanı (Oylama):** Köy oylaması yapılır ve en çok oy alan kişi asılır (veya kimse asılmaz). Oyun, katiller bitene veya köy ele geçirilene kadar devam eder!

---

## 🛠️ Teknolojiler (Sihrin Arkasındakiler)

*   **Vite + React (TypeScript):** Işık hızında render ve tip güvenliği.
*   **Zustand:** Mükemmel ve hafif state yönetimi (oyun içi faz geçişleri).
*   **Tailwind CSS + Framer Motion:** Göz alıcı animasyonlar, fizik tabanlı yaylanmalar ve pürüzsüz tasarım.
*   **Web Speech API:** Tarayıcının yerleşik metin-okuma motoru (TTS).

---

## 🚀 Kendin Kur ve Geliştir!

Eğer projeyi kendi bilgisayarında çalıştırmak istersen:

```bash
# Repoyu klonla
git clone https://github.com/itsravn/katilkim.git

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Projeyi GitHub Pages üzerinden canlıya almak istersen:
```bash
npm run build && npm run deploy
```

---
*Bol entrikalı, bol blöflü oyunlar dileriz! Yakalanmamaya çalış...* 🤫🔪
