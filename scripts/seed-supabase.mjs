// Supabase seed script — src/data/*.json verilerini Supabase tablolarına aktarır.
//
// Kullanım (proje kökünde):
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-supabase.mjs
//
// Not: SERVICE ROLE KEY yalnızca yerel/sunucu tarafındadır, ASLA tarayıcıya
// gönderilmez. Bu script RLS'i bypass ederek seed atar. Idempotent'tir
// (id çakışmasında upsert eder), tekrar çalıştırmak güvenlidir.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Eksik env: SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

const dataDir = join(process.cwd(), "src", "data");
const readJson = (name) =>
  JSON.parse(readFileSync(join(dataDir, name), "utf8"));

const teams = readJson("teams.json").map((t) => ({
  id: t.id,
  name: t.name,
  logo_url: t.logoUrl || null,
  color: t.color,
  captain: t.captain,
  description: t.description,
  photo_url: t.photoUrl || null,
  created_at: t.createdAt,
}));

const players = readJson("players.json").map((p) => ({
  id: p.id,
  team_id: p.teamId,
  name: p.name,
  number: p.number ?? null,
  position: p.position ?? null,
}));

const matches = readJson("matches.json").map((m) => ({
  id: m.id,
  week: m.week,
  home_team_id: m.homeTeamId,
  away_team_id: m.awayTeamId,
  date: m.date,
  time: m.time,
  venue: m.venue,
  status: m.status,
  home_score: m.homeScore ?? null,
  away_score: m.awayScore ?? null,
  scorers: m.scorers ?? [],
}));

const blog = readJson("blog.json").map((b) => ({
  id: b.id,
  slug: b.slug,
  title: b.title,
  excerpt: b.excerpt,
  content: b.content,
  cover_image_url: b.coverImageUrl || null,
  category: b.category,
  author: b.author,
  published_at: b.publishedAt,
  featured: b.featured,
  published: b.published,
}));

const s = readJson("settings.json");
const settings = {
  id: "default",
  hero_title: s.heroTitle,
  hero_subtitle: s.heroSubtitle,
  prize_pool: s.prizePool,
  entry_fee: s.entryFee,
  per_match_fee: s.perMatchFee,
  about_text: s.aboutText,
  contact: s.contact,
  sponsors: s.sponsors ?? [],
};

async function upsert(table, rows) {
  const { error } = await supabase.from(table).upsert(rows);
  if (error) {
    console.error(`✗ ${table}:`, error.message);
    process.exit(1);
  }
  console.log(`✓ ${table}: ${Array.isArray(rows) ? rows.length : 1} kayıt`);
}

// Sıra önemli: FK bağımlılıkları (teams → players/matches).
await upsert("teams", teams);
await upsert("players", players);
await upsert("matches", matches);
await upsert("blog_posts", blog);
await upsert("site_settings", [settings]);

console.log("\nSeed tamamlandı ✓");
