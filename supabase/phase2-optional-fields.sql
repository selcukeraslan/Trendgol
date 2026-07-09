-- Faz 2 — Zorunlu alanları kaldırma
-- Fikstürde tarih opsiyonel olabilsin diye matches.date NOT NULL kısıtı kaldırılır.
-- Supabase SQL Editor'de bir kez çalıştırın.
--
-- Diğer opsiyonel alanlar (saat, saha, açıklama, kaptan vb.) NOT NULL kalır ancak
-- boş string ("") olarak saklanır; şema değişikliği gerektirmez.

alter table public.matches alter column date drop not null;
