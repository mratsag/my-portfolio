-- blogs tablosuna SEO dostu slug kolonu ekler + mevcut kayıtları başlıktan doldurur.
--
-- Türkçe karakterler transliterasyonla KORUNUR (ç→c, ğ→g, ı→i, ö→o, ş→s, ü→u),
-- projelerdeki eski lossy slugify'dan (Türkçe harfleri silen) farklı ve daha temiz.
-- Bloglar UUID ile indekslendiğinden geçmiş slug yok → doğru biçimle üretmek güvenli.
--
-- Idempotent: tekrar çalıştırılabilir; yalnızca slug'ı boş olan satırları doldurur.
-- Uygulama: Supabase Dashboard → SQL Editor → bu dosyanın içeriğini yapıştır → Run.
-- ÖNEMLİ: Bu SQL prod'da çalıştıktan SONRA kod tarafı (sitemap/middleware/linkler)
-- blog slug'a çevrilecek. Sıralama: önce bu migration, sonra kod deploy'u.

begin;

-- 1) slug kolonu
alter table public.blogs
  add column if not exists slug text;

-- 2) Türkçe-duyarlı slugify yardımcı fonksiyonu (yeni blog oluştururken de kullanılabilir)
create or replace function public.slugify_tr(txt text)
returns text
language sql
immutable
as $$
  select trim(both '-' from
    regexp_replace(
      regexp_replace(
        lower(
          translate(
            coalesce(txt, ''),
            'çğıöşüÇĞİÖŞÜ',   -- kaynak: Türkçe küçük + büyük
            'cgiosucgiosu'    -- hedef: ASCII (İ→i, büyükler lower() öncesi ASCII'ye)
          )
        ),
        '[^a-z0-9]+', '-', 'g'   -- alfasayısal olmayan → tire
      ),
      '-{2,}', '-', 'g'          -- ardışık tireleri tekle
    )
  );
$$;

grant execute on function public.slugify_tr(text) to anon, authenticated, service_role;

-- 3) Mevcut kayıtları doldur — aynı slug'a düşenlere -2, -3 ... eki verilir
with base as (
  select
    id,
    nullif(public.slugify_tr(title), '') as s,
    created_at
  from public.blogs
  where slug is null or slug = ''
),
numbered as (
  select
    id,
    coalesce(s, id::text) as base_slug,     -- başlık boşsa id'ye düş
    row_number() over (
      partition by coalesce(s, id::text)
      order by created_at nulls last, id
    ) as rn
  from base
)
update public.blogs b
set slug = case when n.rn = 1 then n.base_slug
                else n.base_slug || '-' || n.rn end
from numbered n
where b.id = n.id;

-- 4) Benzersizlik (yalnızca dolu slug'lar için — gelecekteki null insert'lere izin verir)
create unique index if not exists blogs_slug_key
  on public.blogs (slug)
  where slug is not null;

commit;
