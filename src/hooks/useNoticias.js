import { useEffect, useState } from 'react';
import client, { isContentfulConfigured } from '../config/contentfulClient';

const useNoticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchNoticias = async () => {
      setLoading(true);

      const loadLocalNoticias = async () => {
        // import.meta.glob está disponible en Vite; usamos eager para obtener los módulos ahora
        const modules = import.meta.glob('../data/noticias/*.json', { eager: true });
        const items = Object.values(modules).map((m) => (m && m.default ? m.default : m));

        const mapped = items.map((fields, idx) => {
          const titulo = fields.title || fields.titulo || '';
          const fecha = fields.date || fields.fecha || fields.createdAt || null;
          const resumen = fields.resumen || fields.summary || fields.description || '';
          const urlImagen = fields.thumbnail || fields.thumbnailUrl || fields.image || fields.imagen || null;
          const body = fields.body || fields.cuerpo || fields.content || fields.contenido || '';
          const slug = fields.slug || fields.id || `local-${idx}`;

          return {
            id: slug,
            slug,
            titulo,
            fecha,
            urlImagen,
            resumen,
            body,
            createdAt: fields.createdAt || fecha,
          };
        });

        mapped.sort((a, b) => new Date(b.fecha || b.createdAt) - new Date(a.fecha || a.createdAt));
        if (mounted) setNoticias(mapped);
      };

      // Fallback: si Contentful no está configurado, cargar JSON locales
      if (!isContentfulConfigured || !client) {
        try {
          await loadLocalNoticias();
        } catch (err) {
          if (mounted) setError(err);
        } finally {
          if (mounted) setLoading(false);
        }
        return;
      }

      try {
        const res = await client.getEntries({ content_type: 'noticia', limit: 100 });
        const items = res?.items || [];

        const mapped = items.map((item) => {
          const fields = item.fields || {};
          const titulo = fields.titulo || fields.title || fields.nombre || '';
          const fecha = fields.fecha || fields.date || item.sys?.createdAt || null;
          const resumen = fields.resumen || fields.summary || fields.description || '';
          const body = fields.body || fields.cuerpo || fields.content || fields.contenido || '';
          const slug = fields.slug || item.sys?.id;

          let urlImagen = null;
          const imagen = fields.imagen || fields.image || fields.thumbnail || null;
          if (imagen && imagen.fields && imagen.fields.file && imagen.fields.file.url) {
            const url = imagen.fields.file.url;
            urlImagen = url.startsWith('//') ? `https:${url}` : url;
          }

          return {
            id: item.sys?.id,
            slug,
            titulo,
            fecha,
            urlImagen,
            resumen,
            body,
            createdAt: item.sys?.createdAt,
          };
        });

        mapped.sort((a, b) => new Date(b.fecha || b.createdAt) - new Date(a.fecha || a.createdAt));

        if (mounted) setNoticias(mapped);

        // Si Contentful no devuelve noticias, usar fallback local
        if (mounted && mapped.length === 0) {
          await loadLocalNoticias();
        }
      } catch (err) {
        // Si falla Contentful, intenta fallback local
        try {
          await loadLocalNoticias();
        } catch (innerErr) {
          if (mounted) setError(innerErr);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchNoticias();
    return () => { mounted = false; };
  }, []);

  return { noticias, loading, error };
};

export default useNoticias;
