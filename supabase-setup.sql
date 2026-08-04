-- Configuración de la base de datos de testimonios para Expresión Estelar
-- Ejecutar una sola vez en Supabase: panel del proyecto -> SQL Editor -> New query -> pegar -> Run

-- 1) Tabla de testimonios
create table if not exists testimonials (
  id bigint generated always as identity primary key,
  name text not null,
  country text,
  message text not null,
  rating int not null default 5,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2) Activar Row Level Security (RLS)
alter table testimonials enable row level security;

-- 3) Permitir que cualquiera LEA los testimonios (para mostrarlos en la web)
create policy "Lectura pública para testimonios"
  on testimonials for select
  using (true);

-- 4) Permitir que cualquiera INSERTE un testimonio (para el formulario público)
create policy "Cualquiera puede insertar testimonios"
  on testimonials for insert
  with check (true);

-- 5) Permitir BORRAR SOLO a administradores con sesión iniciada (Supabase Auth).
--    El público (clave anon sin login) NO puede borrar. Esto habilita el botón
--    de borrar de la página privada moderar.html.
create policy "Solo administradores autenticados pueden borrar"
  on testimonials for delete
  to authenticated
  using (true);
