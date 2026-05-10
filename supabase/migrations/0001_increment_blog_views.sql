-- Atomic blog view increment.
-- Race condition'a karşı tek SQL deyiminde okur + günceller + yeni değeri döner.
--
-- Kullanım (API tarafından):
--   const { data } = await supabase.rpc('increment_blog_views', { blog_id: id })
--   // data = yeni views değeri (integer)
--
-- Uygulama: Supabase Dashboard → SQL Editor → bu dosyanın içeriğini yapıştır → Run.

create or replace function public.increment_blog_views(blog_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_views integer;
begin
  update public.blogs
  set views = coalesce(views, 0) + 1
  where id = blog_id
  returning views into new_views;
  return new_views;
end;
$$;

-- Public anon ve authenticated rollere execute izni ver (service_role zaten herşeye erişebilir).
grant execute on function public.increment_blog_views(uuid) to anon, authenticated, service_role;
