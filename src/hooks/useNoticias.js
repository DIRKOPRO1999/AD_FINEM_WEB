import { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';

const useNoticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNoticias = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('noticias').select('*').order('fecha', { ascending: false });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Normalizar campos para la vista pública:
      // - url_imagen <- imagen (si ya es URL úsala, si es nombre/clave genera publicUrl)
      // - url_pdf <- pdf
      // - body <- cuerpo (para compatibilidad con el componente)
      const bucket = 'noticias-files';
      const normalized = await Promise.all((data || []).map(async (n) => {
        const copy = { ...n };
        // body fallback
        if (!copy.body && copy.cuerpo) copy.body = copy.cuerpo;
        // imagen -> url_imagen
        if (copy.imagen) {
          if (typeof copy.imagen === 'string' && copy.imagen.startsWith('http')) {
            copy.url_imagen = copy.imagen;
          } else {
            const path = copy.imagen.includes('/') ? copy.imagen : `imagens/${copy.imagen}`;
            const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
            copy.url_imagen = urlData?.publicUrl || null;
          }
        } else {
          copy.url_imagen = null;
        }
        // pdf -> url_pdf
        if (copy.pdf) {
          if (typeof copy.pdf === 'string' && copy.pdf.startsWith('http')) {
            copy.url_pdf = copy.pdf;
          } else {
            const path = copy.pdf.includes('/') ? copy.pdf : `pdfs/${copy.pdf}`;
            const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
            copy.url_pdf = urlData?.publicUrl || null;
          }
        } else {
          copy.url_pdf = null;
        }
        return copy;
      }));

      setNoticias(normalized);
      setLoading(false);
    };
    fetchNoticias();
  }, []);

  return { noticias, loading, error };
};

export default useNoticias;
