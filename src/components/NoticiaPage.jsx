import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useNoticias from '../hooks/useNoticias';
import slugify from '../utils/slugify';

function setOrCreateMeta(attrName, attrValue, content) {
  const selector = `meta[${attrName}="${attrValue}"]`;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
  return el;
}

export default function NoticiaPage() {
  const { slug } = useParams();
  const { noticias, loading, error } = useNoticias();

  // Buscar en noticias del CMS (supabase)
  const noticiaFromDB = (noticias || []).find((n) => {
    const title = n.titulo || n.title || '';
    return slugify(title) === slug;
  });

  // Fallback: archivos locales en /src/data/noticias
  let local = null;
  if (!noticiaFromDB) {
    const modules = import.meta.glob('../data/noticias/*.json', { eager: true });
    for (const path in modules) {
      const data = modules[path].default || modules[path];
      const s = slugify(data.title || data.titulo || path.split('/').pop().replace('.json', ''));
      if (s === slug) {
        local = data;
        break;
      }
    }
  }

  const article = noticiaFromDB || local;

  useEffect(() => {
    if (!article) return;
    const title = article.titulo || article.title || 'Noticia';
    const desc = article.resumen || (typeof article.body === 'string' ? article.body.slice(0, 160) : '');

    document.title = `${title} — Ad Finem`;

    // description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', desc);

    // og tags
    setOrCreateMeta('property', 'og:title', `${title} — Ad Finem`);
    setOrCreateMeta('property', 'og:description', desc);
    setOrCreateMeta('property', 'og:url', window.location.href);
    const imageUrl = article.url_imagen || article.thumbnail || article.image || '/LOGO%20AD%20FINEM.png';
    setOrCreateMeta('property', 'og:image', imageUrl);

    // canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', window.location.href);
  }, [article]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center">Cargando noticia...</div>;
  if (error) return <div className="min-h-[60vh] text-red-600">Error cargando noticia.</div>;
  if (!article) return <div className="min-h-[60vh] flex items-center justify-center">Noticia no encontrada.</div>;

  return (
    <main className="container mx-auto px-6 py-16">
      <Link to="/" className="text-sm text-slate-500 hover:underline mb-6 inline-block">← Volver</Link>
      <article className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow">
        <p className="text-xs text-gray-400 mb-2">{article.date || article.fecha ? new Date(article.date || article.fecha).toLocaleDateString() : ''}</p>
        <h1 className="text-3xl font-extrabold text-brand-teal mb-4">{article.titulo || article.title}</h1>

        { (article.url_imagen || article.thumbnail) && (
          <img src={article.url_imagen || article.thumbnail} alt={article.titulo || article.title} className="w-full h-auto rounded-xl mb-6 object-cover" />
        ) }

        {article.resumen && <p className="text-gray-700 mb-4">{article.resumen}</p>}

        {article.body && (
          <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: article.body }} />
        )}

        {(article.pdfUrl || article.url_pdf) && (
          <div className="mt-6">
            <a href={article.pdfUrl || article.url_pdf} target="_blank" rel="noopener noreferrer" className="text-brand-orange font-bold underline">Abrir documento PDF</a>
          </div>
        )}
      </article>
    </main>
  );
}
