# Expresión Estelar

Sitio web estático con reserva y recepción de testimonios por WhatsApp.

## Edición sin código

1. Abrir `/admin/` desde el sitio publicado.
2. Iniciar sesión con la invitación de Netlify Identity.
3. Cambiar textos, precios, horarios o WhatsApp.
4. Pulsar **Publicar**; Netlify actualizará la web automáticamente.

La web y su editor quedan identificados únicamente como **Expresión Estelar · Rebeca Presidente**.

## Moderar testimonios

1. Abrir `/moderar.html` desde el sitio publicado.
2. Iniciar sesión con una cuenta creada en **Supabase → Authentication → Users**.
3. Pulsar **Borrar** en el testimonio no deseado.

Si el panel indica que Supabase no autorizó el borrado, ejecutar una vez el archivo
`supabase-fix-delete-policy.sql` desde **Supabase → SQL Editor**. La página confirma
que la fila haya sido eliminada y ya no muestra un éxito falso cuando una política
RLS bloquea la operación.
