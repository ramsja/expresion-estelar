-- Reparación idempotente del permiso para borrar testimonios.
-- Ejecutar en Supabase: SQL Editor -> New query -> Run.

alter table public.testimonials enable row level security;

grant select, delete on table public.testimonials to authenticated;

drop policy if exists "Solo administradores autenticados pueden borrar"
  on public.testimonials;

create policy "Solo administradores autenticados pueden borrar"
  on public.testimonials
  for delete
  to authenticated
  using (auth.uid() is not null);
