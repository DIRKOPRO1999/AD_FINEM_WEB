import React, { useState } from 'react';
import useNoticias from '../hooks/useNoticias';

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

  if (error) return <div className="text-center py-12 text-red-600">Error cargando noticias.</div>;

  return (
    <section id="noticias" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-teal">Actualidad Jurídica</h2>
          <p className="text-gray-600 mt-2">Noticias y análisis seleccionados por Ad-Finem.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {loading
            ? // mostrar 6 skeletons para ocupar el espacio y evitar salto de diseño
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : noticias.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setActiveNoticia(n)}
                  className="text-left bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 group border border-gray-100 hover:border-brand-orange/20 relative overflow-hidden h-full"
                >
                  {n.urlImagen ? (
                    <img
                      src={n.urlImagen}
                      alt={n.titulo || 'Noticia'}
                      loading="lazy"
                      className="w-full h-44 md:h-48 object-cover rounded-xl mb-4"
                    />
                  ) : (
                    <div className="w-full h-44 md:h-48 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-400">Imagen no disponible</div>
                  )}

                  <p className="text-xs text-gray-400 mb-2">{n.fecha ? new Date(n.fecha).toLocaleDateString() : ''}</p>
                  <h3 className="text-lg md:text-xl font-bold text-brand-teal mb-2 md:mb-3 group-hover:text-brand-orange transition-colors">{n.titulo}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{n.resumen}</p>
                </button>
              ))}
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
                {activeNoticia.urlImagen && (
                  <img
                    src={activeNoticia.urlImagen}
                    alt={activeNoticia.titulo || 'Noticia'}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                )}
                {activeNoticia.resumen && (
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">{activeNoticia.resumen}</p>
                )}
                {activeNoticia.body && (
                  <div className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
                    {activeNoticia.body}
                  </div>
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
