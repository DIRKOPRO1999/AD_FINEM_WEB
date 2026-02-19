# AD_FINEM_WEB

Sitio web Ad-Finem (React + Vite + TailwindCSS).

## Desarrollo local

```bash
npm install
npm run dev
```

## Producción

```bash
npm run build
```

---

## SEO & Cloudflare (qué hice y qué falta por hacer)

### Cambios ya aplicados en el repo ✅
- Meta tags OG/Twitter, JSON-LD (Organization) y `canonical` en `index.html`.
- `robots.txt` y `sitemap.xml` en `public/`.
- Páginas ` /noticias/:slug` con metadata dinámica (`NoticiaPage`).
- `generate-sitemap` (build‑time) que genera `public/sitemap.xml` desde `src/data/noticias/`.
- Ejemplos de Cloudflare Worker para evitar que `/sitemap.xml` devuelva `index.html` y para servir sitemap dinámico desde Supabase.

### Qué debes hacer desde Cloudflare (no puede hacerse desde el repo)
1. Verificar que `https://ad-finem.co/sitemap.xml` devuelve `Content-Type: application/xml`.
2. Si usas un Worker que hace fallback a SPA, añade la excepción para `/sitemap.xml` y `/robots.txt` (usa `scripts/cloudflare-worker-sitemap-exception.js`).
3. (Opcional) Desplegar `scripts/cloudflare-worker-sitemap-dynamic.js` en Workers y configurar `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` en las variables del Worker.
4. En Google Search Console: añadir propiedad, verificar dominio (meta o archivo), y enviar `https://ad-finem.co/sitemap.xml`.

### Cómo regenerar el sitemap localmente (útil si añades noticias en `src/data/noticias`)
- `npm run generate-sitemap` — genera `public/sitemap.xml` a partir de `src/data/noticias/*.json`.
- `npm run build` ejecutará `generate-sitemap` automáticamente (prebuild).

Si quieres, te puedo preparar y guiar paso a paso para desplegar el Worker en tu cuenta Cloudflare y verificar el sitemap en Search Console.
