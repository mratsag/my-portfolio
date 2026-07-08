// Türkçe-duyarlı slugify. supabase/migrations/0002_add_blog_slug.sql içindeki
// public.slugify_tr() ile BİREBİR aynı sonucu üretir (ç→c, ğ→g, ı→i, ö→o, ş→s, ü→u).
// Yeni blog/proje oluştururken slug üretmek için kullanılır.

const TR_MAP: Record<string, string> = {
  ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u',
  Ç: 'c', Ğ: 'g', İ: 'i', Ö: 'o', Ş: 's', Ü: 'u',
}

export function slugifyTr(input: string): string {
  return (input || '')
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (ch) => TR_MAP[ch] ?? ch)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // alfasayısal olmayan → tire
    .replace(/-{2,}/g, '-')      // ardışık tireleri tekle
    .replace(/^-+|-+$/g, '')     // baş/son tireleri kırp
}
