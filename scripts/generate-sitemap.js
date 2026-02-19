import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Simple slugify (duplicated to avoid bundling src util)
function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'src', 'data', 'noticias');
const publicDir = path.join(__dirname, '..', 'public');
const SITE_URL = process.env.SITE_URL || 'https://ad-finem.co';

async function readLocalNoticias() {
  try {
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
    return files.map(f => {
      const raw = fs.readFileSync(path.join(dataDir, f), 'utf8');
      const json = JSON.parse(raw);
      const title = json.title || json.titulo || f.replace('.json', '');
      const date = json.date || json.fecha || json.lastmod || '';
      const slug = slugify(title);
      return { title, date, slug };
    });
  } catch (err) {
    return [];
  }
}

function formatDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt)) return d.slice(0, 10);
  return dt.toISOString().slice(0, 10);
}

async function buildSitemap() {
  const noticias = await readLocalNoticias();

  const urls = [];
  urls.push({ loc: `${SITE_URL}/`, lastmod: formatDate(new Date()) , changefreq: 'daily', priority: '1.0' });
  urls.push({ loc: `${SITE_URL}/noticias`, lastmod: formatDate(new Date()), changefreq: 'daily', priority: '0.8' });

  noticias.forEach(n => {
    urls.push({ loc: `${SITE_URL}/noticias/${n.slug}`, lastmod: formatDate(n.date), changefreq: 'monthly', priority: '0.6' });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')}\n</urlset>`;

  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');
  console.log(`Sitemap generado: ${path.join(publicDir, 'sitemap.xml')}`);
}

buildSitemap().catch(err => {
  console.error('Error generando sitemap:', err);
  process.exit(1);
});
