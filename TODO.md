# Trendgol — Yapılacaklar (Yol Haritası)

Proje büyük ölçüde tamamlanmış bir halı saha ligi front-end'i. Aşağıdaki fazlar
kalan işleri kapsar. Her faz tamamlandıkça bu dosya güncellenir.

Durum: `[ ]` bekliyor · `[~]` devam ediyor · `[x]` tamamlandı

---

## Faz 1 — Cila & Kalite `[x]` TAMAMLANDI

- [x] Merkezi zod şemaları (`src/schemas/`), formlar buradan import ediyor
- [x] Cascade silme (takım silinince oyuncu + maçlar da siliniyor)
- [x] Ana sayfa loading/error state (`useAsyncData` + skeleton/error)
- [x] Seed versiyonlama (`base.ts` → `SEED_VERSION` + migration)
- [x] Erişilebilirlik (aria-current, aria-pressed, label bağları)
- [x] Doğrulama: lint temiz, tsc temiz (build yalnızca offline font kısıtından hata veriyor)

---

## Faz 2 — Eksik Özellikler `[x]` TAMAMLANDI

- [x] Golcü krallığı: maç bazlı gol kaydı (`Match.scorers`), `calculateTopScorers`
      selector, public "Gol Krallığı" sayfası, admin maç formunda golcü girişi
      (`Player.goals` kaldırıldı, goller artık maçlardan türetiliyor)
- [x] Dinamik sponsorlar: hardcoded liste → `SiteSettings.sponsors`, admin ayarlardan yönetim
- [x] Görsel önizleme: takım logo/foto ve blog kapağı URL alanlarına canlı önizleme
      (yeni `ImagePreview` bileşeni; team-form'a photoUrl alanı da eklendi)
- [x] Blog içerik editörü: "Yaz / Önizle" toggle (public çıktıyla birebir canlı önizleme)
- [x] İletişim formu: `contactRepository.sendContactMessage` soyutlaması + submitting/hata durumu

---

## Teknoloji Kararı

**Backend/DB: Supabase** (Postgres + Auth + Storage). Faz 3 auth iskeleti
Supabase auth şekline (email/şifre, session, user.role) göre tasarlanır ama
hâlâ mock'tur; gerçek `supabase-js` bağlantısı Faz 4'te yapılır.

## Faz 3 — Gerçek Auth (iskelet, Supabase-uyumlu) `[x]` TAMAMLANDI

- [x] `authService` katmanı (`signIn`/`signOut`/`getSession`, Promise döner,
      Supabase auth şekline uygun — session + user)
- [x] `AuthUser` + `UserRole` tipleri (`role`), mock session (localStorage)
- [x] `authStore` doğrudan set yerine servisi çağırır (hydrate/signIn/signOut)
- [x] `loginSchema` email + şifre doğrulaması + hatalı giriş mesaj yolu
- [x] `AuthGuard`'a opsiyonel rol kontrolü; topbar `user.name` gösterir

---

## Faz 4 — Backend'e Bağlama (Supabase) `[~]` DEVAM EDİYOR

Altyapı (kimlik bilgisi gerektirmeyen):
- [x] `@supabase/supabase-js` kuruldu
- [x] Supabase client modülü (`src/lib/supabase/client.ts`, env'den, tembel)
- [x] SQL şema + RLS (`supabase/schema.sql`)
- [x] Seed script (`scripts/seed-supabase.mjs`, src/data JSON → Supabase)
- [x] `.env.example` + `.gitignore` istisnası

Kimlik bilgisi sonrası:
- [x] `.env.local` (URL + publishable key)
- [x] Repository geçişi: her repo `getSupabase()` çağırır (camelCase ↔ snake_case
      eşleme), imzalar aynı — sayfa/store değişmedi; `base.ts` (localStorage) silindi
- [x] Cascade silme artık DB'de (ON DELETE CASCADE)
- [x] `authService` → `supabase.auth` (signInWithPassword / signOut / getSession)
- [x] İletişim formu → `contact_messages` tablosuna insert
- [x] tsc + lint temiz
- [x] Kullanıcı testi: şema + seed + admin user → gerçek giriş ve veri doğrulandı ✓
- [x] Görsel upload (Supabase Storage): `assets` bucket + `ImageUpload` bileşeni;
      site logosu admin'den yüklenebiliyor (navbar + footer dinamik). SQL:
      `supabase/logo-upgrade.sql` (kullanıcı çalıştırır)
