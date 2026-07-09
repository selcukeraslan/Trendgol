# Değişiklik Özeti — `alperen` branch

Bu doküman, `alperen` branch'inde yapılan geliştirmeleri reviewer için özetler.
Tüm değişiklikler `tsc --noEmit` ve `eslint` kontrollerinden temiz geçmiştir.

**Kapsam:** Görsel arayüz (açık tema paleti), ana sayfa hero duyuru slider'ı,
fikstür/golcü geliştirmeleri, puan durumu "form" sütunu, admin maç formu
düzeltmeleri ve dark-mode erişilebilirlik.

**Not:** Fonksiyonel mimari (repository/store/tip katmanları) korunmuştur;
değişiklikler ağırlıkla sunum katmanındadır. Yeni kütüphane eklenmemiştir.

---

## 1. Açık tema paleti (recolor)

Site dark-first temadan, açık zeminli + koyu petrol yeşili + turkuaz vurgulu
premium bir görünüme geçirildi. Uygulama tamamen token tabanlı olduğu için
değişiklik ağırlıkla CSS değişkenlerinde yapıldı.

- **`src/app/globals.css`**
  - `:root` (açık tema) ve `.dark` token değerleri palete göre yeniden yazıldı
    (zemin `#eef3f2`, kartlar beyaz, birincil/CTA turkuaz `#0fb8a9`, altın lider
    rengi `#e0b341`).
  - `.dark` tutarlı koyu petrol varyanta çevrildi (tema toggle çalışmaya devam
    ediyor).
  - `color-scheme: light/dark` eklendi → native kontroller (select açılır
    listesi, tarih/saat seçici) doğru şemada çiziliyor.
- **`src/app/layout.tsx`** — `defaultTheme` `dark` → `light`, `enableSystem={false}`.
  Site açık açılıyor; toggle ile dark hâlâ seçilebiliyor.

## 2. Hero + duyuru slider'ı

"Futbolun Kalbi..." hero alanı iki kolona çevrildi; sağ kolonda blog/duyuru
slider'ı gösteriliyor (referans örnek baz alındı).

- **`src/components/landing/hero.tsx`**
  - Koyu petrol hero bloğu (arka plan gradient + turkuaz parıltı), koyu zemine
    uygun metin/buton renkleri.
  - `posts` varsa iki kolon (sol: başlık/CTA, sağ: slider), yoksa eski ortalı
    tek kolon. Öne çıkan (featured) yazılar önce.
- **`src/components/landing/hero-announcements.tsx`** _(yeni)_
  - Kapak görseli + kategori, tarih, başlık, özet, "Yazıyı oku" butonu.
  - İleri/geri okları + nokta göstergeleri.
  - **Otomatik geçiş** (6 sn), hover'da durur, manuel geçişte süre sıfırlanır,
    "hareketi azalt" tercihinde çalışmaz.
  - Her geçişte yumuşak fade/slide animasyonu; sona gelince başa döner.

## 3. Ana sayfa düzeni

- **`src/app/(public)/page.tsx`**
  - Bölüm sırası: `Yaklaşan Maçlar → Puan Durumu → Nasıl Katılırım →
    Katılım Şartları → Sponsorlar → CTA`.
  - Yayınlanmış blog yazıları çekilip (`getPublishedBlogPosts`) Hero'ya geçiliyor.
- **`src/components/landing/participation-terms.tsx`**
  - "Katılım Şartları" bölümü "Nasıl Katılırım" altına taşındı.
  - Ücret/ödül kartlarında `0` / boş değerler gizleniyor (`hasAmount` yardımcısı);
    admin'den gerçek tutar girilince otomatik geri geliyor.
- **`src/components/landing/blog-preview.tsx`** _(yeni — şu an kullanılmıyor)_
  - Yatay kaydırılabilir blog vitrini olarak eklendi, sonra hero slider'ı bu
    işlevi üstlenince ana sayfadan çıkarıldı. Dosya ileride yeniden kullanım için
    duruyor; **import edilmiyor** (isterseniz silinebilir).

## 4. Fikstür & golcü gösterimi

- **`src/components/fixtures/match-card.tsx`**
  - Planlanan maçlarda saat altındaki "karşı karşıya" yazısı kaldırıldı.
  - Oynanan maçlarda **golcü listesi**: hangi takımdan kim (isim + `×N`),
    her golcünün yanında soft futbol topu ikonu (inline SVG), takımların altında
    ortalanmış ve ayrık.
  - Opsiyonel `players` prop'u (golcü isimlerini çözmek için).
- **`src/app/(public)/fikstur/page.tsx`**
  - `getPlayers` verisi çekilip karta geçiliyor.
  - **Takım filtresi:** seçilen takımın tüm sezon maçları (haftaya göre) listelenir;
    "Tüm takımlar"da normal haftalık görünüm. Sonuç yoksa boş durum gösterilir.

## 5. Puan durumu — son 5 maç formu

- **`src/types/index.ts`** — `FormResult` tipi ve `Standing.form` alanı (türetilir).
- **`src/lib/standings.ts`** — oynanan maçlar tarihe göre kronolojik işlenerek her
  takımın G/B/M form dizisi hesaplanıyor.
- **`src/components/standings/standings-table.tsx`** — "Form" sütunu: son 5 maç
  renkli rozet (G=yeşil, B=gri, M=kırmızı), soldan sağa eskiden yeniye.
  Mobilde gizli (`md+`), özet/landing tablosunda gösterilmiyor.
- **`src/app/(public)/puan-durumu/page.tsx`** — açıklama satırına Form notu eklendi.
- **`src/components/teams/team-stats.tsx`** — yeni `form` alanı için tip uyumu
  (varsayılan `form: []`).

## 6. Admin maç formu & dark-mode erişilebilirlik

- **`src/components/admin/match-form.tsx`**
  - Golcü dropdown'ında oyuncu adının yanında **takım adı** gösteriliyor:
    `Emre Yıldız (Night Ravens FC)`.
  - Dark modda native `<select>` metinlerinin okunmaması düzeltildi: select'lere
    solid zemin + net metin rengi, tüm `<option>`'lara açık zemin/metin renkleri
    (`bg-popover text-popover-foreground`).

---

## Değişen / eklenen dosyalar

**Değişen:**
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/(public)/page.tsx`
- `src/app/(public)/fikstur/page.tsx`
- `src/app/(public)/puan-durumu/page.tsx`
- `src/components/landing/hero.tsx`
- `src/components/landing/participation-terms.tsx`
- `src/components/fixtures/match-card.tsx`
- `src/components/standings/standings-table.tsx`
- `src/components/teams/team-stats.tsx`
- `src/components/admin/match-form.tsx`
- `src/lib/standings.ts`
- `src/types/index.ts`

**Yeni:**
- `src/components/landing/hero-announcements.tsx`
- `src/components/landing/blog-preview.tsx` _(şu an import edilmiyor)_

---

## Reviewer için notlar

- **Ortam değişkeni:** Uygulama canlı bir Supabase projesine bağlı çalışır
  (`.env.local` / `.env` — repoya dahil değil, `.gitignore` ile hariç). Yerelde
  çalıştırmak için `NEXT_PUBLIC_SUPABASE_URL` ve
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` gerekir.
- **Varsayılan tema artık açık** (`light`). Toggle ile dark seçilebilir; her iki
  temada kontrast kontrol edildi.
- **Blog kapak görselleri:** Yazılara kapak görseli yüklenmemişse hero slider'ı
  ve kartlar placeholder gösterir; admin'den görsel yüklenince gerçek görsel çıkar.
- **`blog-preview.tsx`** şu an kullanılmıyor — silinebilir ya da ileride ana sayfa
  blog listesi için tekrar bağlanabilir.
- **Doğrulama:** `npx tsc --noEmit` ve `npx eslint` temiz. Görsel doğrulama için
  Supabase bağlantısı gerektiğinden runtime testi env ile yapılmalıdır.
