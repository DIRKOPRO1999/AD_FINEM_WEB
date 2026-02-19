
import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import NewsFormCard from './NewsFormCard';
import { supabase } from '../config/supabaseClient';

export default function AdminDashboard() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNoticias();
  }, []);

  async function fetchNoticias() {
    setLoading(true);
    const { data, error } = await supabase.from('noticias').select('*').order('fecha', { ascending: false });
    if (error) setError(error.message);
    else setNoticias(data);
    setLoading(false);
  }

  function handleEdit(noticia) {
    setForm(noticia);
    setEditId(noticia.id);
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar esta noticia?')) return;
    const { error } = await supabase.from('noticias').delete().eq('id', id);
    if (error) setError(error.message);
    else fetchNoticias();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar active="noticias" />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="px-8 py-6 max-w-5xl mx-auto w-full">
          <NewsFormCard
            form={form}
            setForm={setForm}
            editId={editId}
            setEditId={setEditId}
            fetchNoticias={fetchNoticias}
            error={error}
            setError={setError}
          />
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-4 text-slate-800">Noticias existentes</h2>
            {loading ? (
              <div className="text-slate-500">Cargando noticias...</div>
            ) : (
              <table className="w-full border mt-4 bg-white rounded-xl shadow overflow-hidden">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="p-2 border-b text-left">Título</th>
                    <th className="p-2 border-b text-left">Fecha</th>
                    <th className="p-2 border-b text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {noticias.map(noticia => (
                    <tr key={noticia.id} className="border-b last:border-none">
                      <td className="p-2 text-slate-900">{noticia.titulo}</td>
                      <td className="p-2 text-slate-600">{noticia.fecha ? new Date(noticia.fecha).toLocaleDateString() : ''}</td>
                      <td className="p-2">
                        <button onClick={() => handleEdit(noticia)} className="text-blue-600 hover:text-blue-800 font-medium mr-2">Editar</button>
                        <button onClick={() => handleDelete(noticia.id)} className="text-red-600 hover:text-red-800 font-medium">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}


