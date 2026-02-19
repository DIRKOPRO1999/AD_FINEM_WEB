// Cloudflare Worker example — permite servir archivos estáticos como /sitemap.xml y /robots.txt
addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Si es sitemap o robots o cualquier asset con extensión, pasa al origen normal
  if (url.pathname === '/sitemap.xml' || url.pathname === '/robots.txt' || /\.[a-z0-9]{2,6}$/.test(url.pathname)) {
    return event.respondWith(fetch(req));
  }

  // Fallback SPA (ejemplo simple) — ajustar según tu Worker actual
  event.respondWith(
    fetch(req).then(res => res).catch(() => new Response('Not found', { status: 404 }))
  );
});
