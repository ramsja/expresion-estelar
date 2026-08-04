import type { Context } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

export default async (req: Request, context: Context) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const user = context.clientContext?.user;
  if (!user) {
    return Response.json(
      { error: 'No autorizado. Inicia sesión como administrador para borrar testimonios.' },
      { status: 401 }
    );
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json(
      { error: 'Falta configurar SUPABASE_SERVICE_ROLE_KEY en las variables de entorno de Netlify.' },
      { status: 500 }
    );
  }

  let id: string | number | undefined;
  try {
    const body = await req.json();
    id = body?.id;
  } catch {
    return Response.json({ error: 'Cuerpo de la petición inválido.' }, { status: 400 });
  }
  if (!id) {
    return Response.json({ error: 'Falta el id del testimonio a borrar.' }, { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
};
