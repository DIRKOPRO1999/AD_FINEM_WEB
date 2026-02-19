/**
 * Cloudflare Worker: devuelve sitemap.xml dinámico.
 * - Si están presentes SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en el entorno del Worker,
 *   obtiene noticias desde Supabase y genera entradas <url> dinámicamente.
 * - Si no están, devuelve el sitemap estático en el origen (fetch('/sitemap.xml')).
 *
 * NOTA: para desplegar en Cloudflare Worker necesitas configurar estas variables de entorno
 *       y publicar el script (ver README abajo).
 */

addEventListener('fetch', event => {
  event.respondWith(handle(event));
});

async function handle(event) {
  const url = new URL(event.request.url);
  if (url.pathname !== '/sitemap.xml') return fetch(event.request);

  const SUPABASE_URL = SUPABASE_URL || globalThis.SUPABASE_URL;
  const SUPABASE_KEY = SUPABASE_SERVICE_ROLE_KEY || globalThis.SUPABASE_SERVICE_ROLE_KEY;
  const SITE_URL = (globalThis.SITE_URL || 'https://ad-finem.co').replace(/\/$/, '');

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    // fallback: serve the static sitemap from origin
    return fetch(new Request(`${SITE_URL}/sitemap.xml`));
  }

  // fetch noticias from Supabase REST
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/noticias?select=id,titulo,fecha`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    if (!res.ok) throw new Error('Supabase error');
    const noticias = await res.json();

    const urls = [];
    urls.push({ loc: `${SITE_URL}/`, lastmod: new Date().toISOString().slice(0,10), changefreq: 'daily', priority: '1.0' });
    urls.push({ loc: `${SITE_URL}/noticias`, lastmod: new Date().toISOString().slice(0,10), changefreq: 'daily', priority: '0.8' });

    noticias.forEach(n => {
      const slug = slugify(n.titulo || n.title || n.id || n.fecha);
      const lastmod = (n.fecha && n.fecha.slice ? n.fecha.slice(0,10) : (new Date().toISOString().slice(0,10)));
      urls.push({ loc: `${SITE_URL}/noticias/${slug}`, lastmod, changefreq: 'monthly', priority: '0.6' });
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')}\n</urlset>`;

    return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
  } catch (err) {
    return new Response('<!-- sitemap worker error -->', { status: 500, headers: { 'content-type': 'text/plain' } });
  }
}

// worker-local slugify (same as client)
function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}
