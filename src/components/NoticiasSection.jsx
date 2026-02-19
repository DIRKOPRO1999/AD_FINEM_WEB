import React, { useMemo, useState } from 'react';
import useNoticias from '../hooks/useNoticias';
import { Link } from 'react-router-dom';
import slugify from '../utils/slugify';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';

const SkeletonCard = () => (
  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm transition-all duration-300 border border-gray-100 relative overflow-hidden h-full">
    <div className="w-full h-44 md:h-48 bg-gray-100 rounded-xl mb-4 animate-pulse" />
    <div className="h-3 bg-gray-200 rounded w-1/6 mb-3 animate-pulse" />
    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
    <div className="h-4 bg-gray-200 rounded w-full mt-2 animate-pulse" />
  </div>
);

const NoticiasSection = () => {
  const { noticias, loading, error } = useNoticias();
  const [activeNoticia, setActiveNoticia] = useState(null);

  const richTextOptions = useMemo(() => ({
    renderNode: {
      [BLOCKS.HEADING_1]: (node, children) => (
        <h1 className="text-2xl md:text-3xl font-black text-brand-teal mt-6 mb-3">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (node, children) => (
        <h2 className="text-xl md:text-2xl font-bold text-brand-teal mt-6 mb-3">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (node, children) => (
        <h3 className="text-lg md:text-xl font-bold text-brand-teal mt-5 mb-2">{children}</h3>
      ),
      [BLOCKS.PARAGRAPH]: (node, children) => (
        <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-3">{children}</p>
      ),
      [BLOCKS.UL_LIST]: (node, children) => (
        <ul className="list-disc pl-5 text-gray-700 text-sm md:text-base mb-3">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (node, children) => (
        <ol className="list-decimal pl-5 text-gray-700 text-sm md:text-base mb-3">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (node, children) => (
        <li className="mb-1">{children}</li>
      ),
      [INLINES.HYPERLINK]: (node, children) => (
        <a href={node.data.uri} className="text-brand-orange font-semibold underline" target="_blank" rel="noreferrer">
          {children}
        </a>
      ),
    },
  }), []);

  const getExcerpt = (body) => {
    if (!body) return '';
    if (typeof body === 'string') return body.slice(0, 140) + (body.length > 140 ? '…' : '');

    try {
      const text = body.content
        ?.flatMap((block) => block.content || [])
        .map((c) => c.value)
        .filter(Boolean)
        .join(' ')
        .trim();
      if (!text) return '';
      return text.slice(0, 140) + (text.length > 140 ? '…' : '');
    } catch {
      return '';
    }
  };

  if (error) return <div className="text-center py-12 text-red-600">Error cargando noticias.</div>;

  return (
    <section id="noticias" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-brand-teal mb-2">Actualidad y Análisis Jurídico</h2>
          <p className="text-gray-600 mt-2 text-justify">Noticias y análisis seleccionados por Consultores jurídicos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {loading
            ? // mostrar 6 skeletons para ocupar el espacio y evitar salto de diseño
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : noticias.map((n) => {
                const slug = slugify(n.titulo || n.title || n.id || n.fecha);
                return (
                  <Link
                    to={`/noticias/${slug}`}
                    key={n.id}
                    className="text-left bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 group border border-gray-100 hover:border-brand-orange/20 relative overflow-hidden h-full"
                  >
                    {n.url_imagen ? (
                      <img
                        src={n.url_imagen}
                        alt={n.titulo || 'Noticia'}
                        loading="lazy"
                        className="w-full h-44 md:h-48 object-cover rounded-xl mb-4"
                      />
                    ) : (
                      <div className="w-full h-44 md:h-48 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-400">Imagen no disponible</div>
                    )}

                    <p className="text-xs text-gray-400 mb-2">{n.fecha ? new Date(n.fecha).toLocaleDateString() : ''}</p>
                    <h3 className="text-lg md:text-xl font-bold text-brand-teal mb-2 md:mb-3 group-hover:text-brand-orange transition-colors">{n.titulo}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed text-justify">{n.resumen || getExcerpt(n.body)}</p>
                  </Link>
                );
              })}
        </div>

        {activeNoticia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">{activeNoticia.fecha ? new Date(activeNoticia.fecha).toLocaleDateString() : ''}</p>
                  <h3 className="text-lg md:text-xl font-bold text-brand-teal">{activeNoticia.titulo}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveNoticia(null)}
                  className="text-gray-500 hover:text-brand-orange font-bold"
                >
                  Cerrar
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {activeNoticia.url_imagen && (
                  <img
                    src={activeNoticia.url_imagen}
                    alt={activeNoticia.titulo || 'Noticia'}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                )}
                {activeNoticia.resumen && (
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed text-justify">{activeNoticia.resumen}</p>
                )}
                {activeNoticia.cuerpo && (
                  <div className="mt-2">
                    <div className="text-gray-700 text-sm md:text-base leading-relaxed text-justify" dangerouslySetInnerHTML={{ __html: activeNoticia.cuerpo }} />
                  </div>
                )}
                {activeNoticia.url_pdf && (
                  <>
                    <div className="mt-4 border rounded overflow-hidden">
                      <iframe
                        src={activeNoticia.url_pdf}
                        title="Documento PDF"
                        className="w-full h-64 md:h-[48vh]"
                        frameBorder="0"
                      />
                    </div>
                    <div className="mt-3 flex gap-4 items-center">
                      <a href={activeNoticia.url_pdf} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-bold">Abrir en nueva pestaña</a>
                      <a href={activeNoticia.url_pdf} download className="text-sm text-gray-500 underline">Descargar PDF</a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NoticiasSection;
