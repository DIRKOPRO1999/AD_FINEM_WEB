
import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { Calendar, Folder, Image, FileText, Plus, Trash2, Eye } from 'lucide-react';

const categorias = [
	'Actualidad',
	'Deportes',
	'Cultura',
	'Tecnología',
	'Salud',
];

const noticiasEjemplo = [
	{
		id: 1,
		titulo: 'OpenAI lanza GPT-5: la nueva frontera de la IA',
		fecha: '2026-02-17',
		categoria: 'Tecnología',
		cuerpo: 'OpenAI ha presentado GPT-5, un modelo que redefine los límites de la inteligencia artificial generativa.',
		estado: 'Publicado',
		imagen: null,
		pdf: null,
	},
	{
		id: 2,
		titulo: 'Meta anuncia gafas AR accesibles para todos',
		fecha: '2026-02-16',
		categoria: 'Tecnología',
		cuerpo: 'Meta ha revelado unas gafas de realidad aumentada económicas, marcando un hito en la adopción masiva.',
		estado: 'Publicado',
		imagen: null,
		pdf: null,
	},
	{
		id: 3,
		titulo: 'Descubren nueva cepa de ransomware global',
		fecha: '2026-02-15',
		categoria: 'Actualidad',
		cuerpo: 'Expertos en ciberseguridad alertan sobre una variante de ransomware que afecta a empresas en todo el mundo.',
		estado: 'Borrador',
		imagen: null,
		pdf: null,
	},
];


export default function NoticiasDashboard() {
	const [form, setForm] = useState({ titulo: '', fecha: '', categoria: '', cuerpo: '', imagen: null, pdf: null });
	const [noticias, setNoticias] = useState([]);
	const [fileImgName, setFileImgName] = useState('');
	const [filePdfName, setFilePdfName] = useState('');
	const [loading, setLoading] = useState(true);
	const [uploadError, setUploadError] = useState('');
	const [isNormalizing, setIsNormalizing] = useState(false);
	// --- EDICIÓN DE NOTICIAS ---
	const [editId, setEditId] = useState(null);

	useEffect(() => {
		fetchNoticias();
	}, []);

	async function fetchNoticias() {
		setLoading(true);
		const { data, error } = await supabase.from('noticias').select('*').order('fecha', { ascending: false });
		if (error) {
			setNoticias([]);
			setLoading(false);
			return;
		}
		const bucket = 'noticias-files';
		const normalized = (data || []).map(noticia => {
			const copy = { ...noticia };
			// si la DB tiene solo nombre de archivo (antiguo), construir publicUrl
			if (copy.imagen && typeof copy.imagen === 'string' && !copy.imagen.startsWith('http')) {
				const path = copy.imagen.includes('/') ? copy.imagen : `imagens/${copy.imagen}`;
				const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
				copy.imagen = urlData?.publicUrl || copy.imagen;
			}
			if (copy.pdf && typeof copy.pdf === 'string' && !copy.pdf.startsWith('http')) {
				const path = copy.pdf.includes('/') ? copy.pdf : `pdfs/${copy.pdf}`;
				const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
				copy.pdf = urlData?.publicUrl || copy.pdf;
			}
			return copy;
		});
		setNoticias(normalized);
		setLoading(false);
	}

	function handleChange(e) {
		setForm({ ...form, [e.target.name]: e.target.value });
	}

	function handleFile(type, file) {
		if (!file) return;
		setForm({ ...form, [type]: file });
		if (type === 'imagen') setFileImgName(file.name);
		if (type === 'pdf') setFilePdfName(file.name);
	}

	function removeFile(type) {
		setForm({ ...form, [type]: null });
		if (type === 'imagen') setFileImgName('');
		if (type === 'pdf') setFilePdfName('');
	}

	function sanitizeFileName(name) {
		// elimina acentos, caracteres extraños y convierte espacios a guiones
		const parts = name.split('.');
		const ext = parts.length > 1 ? parts.pop() : '';
		const base = parts.join('.');
		const normalized = base.normalize('NFD').replace(/\p{Diacritic}/gu, '');
		const safe = normalized
			.replace(/[^a-zA-Z0-9 _-]/g, '') // dejar letras/números/espacio/guión
			.trim()
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-');
		const filename = safe || 'file';
		return ext ? `${filename}.${ext}` : filename;
	}

	async function uploadFile(file, type) {
		if (!file) return null;
		const safeName = sanitizeFileName(file.name);
		const filePath = `${type}s/${Date.now()}-${safeName}`;
		const bucket = 'noticias-files';
		const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
			upsert: true,
			contentType: type === 'pdf' ? 'application/pdf' : file.type,
		});
		if (error) {
			console.error('Error subiendo archivo:', error.message, 'key:', filePath, error);
			return null;
		}
		const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
		return publicUrlData?.publicUrl || null;
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setUploadError('');
		if (!form.titulo || !form.fecha || !form.categoria || !form.cuerpo) return;
		let imagenUrl = null;
		let pdfUrl = null;
		if (form.imagen) {
			imagenUrl = await uploadFile(form.imagen, 'imagen');
			if (!imagenUrl) {
				setUploadError('Error: no se pudo subir la imagen. Revisa el nombre/formatos.');
				return;
			}
		}
		if (form.pdf) {
			pdfUrl = await uploadFile(form.pdf, 'pdf');
			if (!pdfUrl) {
				setUploadError('Error: no se pudo subir el PDF. Revisa el nombre/formatos.');
				return;
			}
		}
		const nuevaNoticia = {
			...form,
			estado: 'Publicado',
			imagen: imagenUrl,
			pdf: pdfUrl,
		};
		const { error } = await supabase.from('noticias').insert([nuevaNoticia]);
		if (!error) {
			fetchNoticias();
			setForm({ titulo: '', fecha: '', categoria: '', cuerpo: '', imagen: null, pdf: null });
			setFileImgName('');
			setFilePdfName('');
			console.log('Noticia publicada:', JSON.stringify(nuevaNoticia, null, 2));
		}
	}

	async function handleDelete(id) {
		const { error } = await supabase.from('noticias').delete().eq('id', id);
		if (!error) fetchNoticias();
	}

	function handleVerSitio() {
		window.open('/', '_blank');
	}

	async function normalizeStoredUrls() {
		setIsNormalizing(true);
		const bucket = 'noticias-files';
		const { data: rows, error } = await supabase.from('noticias').select('id, imagen, pdf');
		if (error) {
			console.error('Error leyendo noticias para normalizar:', error.message);
			setIsNormalizing(false);
			return;
		}
		for (const r of rows || []) {
			const updates = {};
			if (r.imagen && typeof r.imagen === 'string' && !r.imagen.startsWith('http')) {
				const path = r.imagen.includes('/') ? r.imagen : `imagens/${r.imagen}`;
				const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
				if (urlData?.publicUrl) updates.imagen = urlData.publicUrl;
			}
			if (r.pdf && typeof r.pdf === 'string' && !r.pdf.startsWith('http')) {
				const path = r.pdf.includes('/') ? r.pdf : `pdfs/${r.pdf}`;
				const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
				if (urlData?.publicUrl) updates.pdf = urlData.publicUrl;
			}
			if (Object.keys(updates).length > 0) {
				const { error: uErr } = await supabase.from('noticias').update(updates).eq('id', r.id);
				if (uErr) console.error('Error actualizando noticia', r.id, uErr.message);
			}
		}
		await fetchNoticias();
		setIsNormalizing(false);
	}

	return (
		<main className="bg-slate-50 min-h-screen pl-64 p-8">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-2xl font-bold text-slate-900">Gestión de Noticias</h1>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={handleVerSitio}
						className="flex items-center gap-2 border border-slate-300 bg-white text-slate-700 font-medium px-4 py-2 rounded-lg hover:border-blue-600 hover:text-blue-600 transition"
					>
						<Eye className="w-5 h-5" />
						Ver Sitio
					</button>
					<button
						type="button"
						onClick={normalizeStoredUrls}
						disabled={isNormalizing}
						className="flex items-center gap-2 border border-slate-300 bg-white text-slate-700 font-medium px-4 py-2 rounded-lg hover:border-slate-400 hover:text-slate-600 transition"
					>
						<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12a9 9 0 1018 0 9 9 0 00-18 0zm4 0v1a4 4 0 004 4h1"/></svg>
						{isNormalizing ? 'Actualizando...' : 'Actualizar URLs'}
					</button>
					<button
						type="submit"
						form="noticia-form"
						className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
					>
						<Plus className="w-5 h-5" />
						Publicar Nueva
					</button>
				</div>
			</div>
			{/* Formulario PRO */}
			<form id="noticia-form" onSubmit={editId ? handleUpdate : handleSubmit} className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 p-8 mb-10 max-w-3xl mx-auto">
				{uploadError && (
					<div className="mb-4 rounded-md bg-red-50 border border-red-100 px-4 py-2 text-red-700 text-sm">{uploadError}</div>
				)}
				<div className="mb-5">
					<label className="block text-slate-700 font-semibold mb-2">Título de la Noticia</label>
					<input
						name="titulo"
						value={form.titulo}
						onChange={handleChange}
						className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition text-slate-900 bg-slate-50"
						placeholder="Ej: OpenAI lanza GPT-5..."
						required
					/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
					<div>
						<label className="block text-slate-700 font-semibold mb-2">Fecha</label>
						<div className="relative">
							<input
								type="date"
								name="fecha"
								value={form.fecha}
								onChange={handleChange}
								className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition text-slate-900 bg-slate-50 pr-10"
								required
							/>
							<Calendar className="absolute right-3 top-3 w-5 h-5 text-slate-400 pointer-events-none" />
						</div>
					</div>
					<div>
						<label className="block text-slate-700 font-semibold mb-2">Categoría</label>
						<div className="relative">
							<select
								name="categoria"
								value={form.categoria}
								onChange={handleChange}
								className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition text-slate-900 bg-slate-50 appearance-none pr-8"
								required
							>
								<option value="" disabled>Selecciona una categoría</option>
								{categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
							</select>
							<Folder className="absolute right-3 top-3 w-5 h-5 text-slate-400 pointer-events-none" />
						</div>
					</div>
				</div>
				<div className="mb-5">
					<label className="block text-slate-700 font-semibold mb-2">Cuerpo de la Noticia</label>
					<div className="bg-slate-50 border border-slate-200 rounded-lg p-2">
						<textarea
							name="cuerpo"
							value={form.cuerpo}
							onChange={handleChange}
							className="w-full h-32 border-none bg-transparent px-2 py-1 text-slate-900 focus:outline-none resize-none"
							placeholder="Escribe el contenido completo aquí..."
							required
						/>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
					<div>
						<label className="block text-slate-700 font-semibold mb-2">Imagen Destacada</label>
						<div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 cursor-pointer hover:border-blue-600 transition relative">
							<Image className="w-8 h-8 text-slate-400 mb-2" />
							<div className="text-slate-700 font-medium mb-1">Click o arrastra imagen</div>
							<div className="text-xs text-slate-400 mb-2">PNG, JPG hasta 5MB</div>
							<input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFile('imagen', e.target.files[0])} />
							{fileImgName && (
								<div className="mt-2 flex items-center gap-2">
									<span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">{fileImgName}</span>
									<button type="button" onClick={() => removeFile('imagen')} className="text-red-500 text-xs font-bold ml-1">Quitar</button>
								</div>
							)}
						</div>
					</div>
					<div>
						<label className="block text-slate-700 font-semibold mb-2">Documento Adjunto (PDF)</label>
						<div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 cursor-pointer hover:border-blue-600 transition relative">
							<FileText className="w-8 h-8 text-slate-400 mb-2" />
							<div className="text-slate-700 font-medium mb-1">Click o arrastra PDF</div>
							<div className="text-xs text-slate-400 mb-2">Max 10MB</div>
							<input type="file" accept="application/pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFile('pdf', e.target.files[0])} />
							{filePdfName && (
								<div className="mt-2 flex items-center gap-2">
									<span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">{filePdfName}</span>
									<button type="button" onClick={() => removeFile('pdf')} className="text-red-500 text-xs font-bold ml-1">Quitar</button>
								</div>
							)}
						</div>
					</div>
				</div>
				<div className="flex justify-end gap-2">
					{editId ? (
						<>
							<button type="submit" className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-yellow-600 transition">Actualizar</button>
							<button type="button" onClick={() => { setEditId(null); setForm({ titulo: '', fecha: '', categoria: '', cuerpo: '', imagen: null, pdf: null }); setFileImgName(''); setFilePdfName(''); }} className="bg-slate-300 text-slate-700 px-6 py-2 rounded-lg font-bold shadow hover:bg-slate-400 transition">Cancelar</button>
						</>
					) : (
						<button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-blue-700 transition">Publicar</button>
					)}
				</div>
			</form>
			{/* Listado rápido últimas 5 noticias */}
			<div className="max-w-3xl mx-auto">
				<h2 className="text-lg font-semibold text-slate-800 mb-3">Noticias Existentes</h2>
				{loading ? (
					<div className="text-slate-400 text-center py-8">Cargando noticias...</div>
				) : noticias.length === 0 ? (
					<div className="text-slate-400 text-center py-8">No hay noticias registradas</div>
				) : (
					<table className="w-full bg-white rounded-xl shadow border border-slate-100 overflow-hidden">
						<thead>
							<tr className="bg-slate-100 text-slate-600">
								<th className="p-3 text-left font-medium">Título</th>
								<th className="p-3 text-left font-medium">Fecha</th>
								<th className="p-3 text-left font-medium">Estado</th>
								<th className="p-3 text-left font-medium">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{noticias.slice(0, 5).map(noticia => (
								<tr key={noticia.id} className="border-b last:border-none">
									<td className="p-3 text-slate-900">
										{noticia.imagen && typeof noticia.imagen === 'string' && noticia.imagen.startsWith('http') && (
											<img src={noticia.imagen} alt="Imagen" className="h-10 w-10 object-cover rounded mr-2 inline-block align-middle" onError={e => { e.target.style.display = 'none'; }} />
										)}
										{noticia.titulo}
									</td>
									<td className="p-3 text-slate-500">{noticia.fecha}</td>
									<td className="p-3">
										<span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${noticia.estado === 'Publicado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
											{noticia.estado}
										</span>
									</td>
									<td className="p-3 flex gap-2 items-center">
										{noticia.pdf && (
											<a href={noticia.pdf} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">Ver PDF</a>
										)}
										<button
											type="button"
											onClick={() => handleEdit(noticia)}
											className="text-yellow-500 hover:text-yellow-700 p-1"
											title="Editar"
										>
											<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 01-1.263-1.263l1-4a4 4 0 01.828-1.414z" /></svg>
										</button>
										<button
											type="button"
											onClick={() => handleDelete(noticia.id)}
											className="text-red-500 hover:text-red-700 p-1"
											title="Eliminar"
										>
											<Trash2 className="w-5 h-5" />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</main>
	);
	function handleEdit(noticia) {
		setEditId(noticia.id);
		setForm({
			titulo: noticia.titulo,
			fecha: noticia.fecha,
			categoria: noticia.categoria,
			cuerpo: noticia.cuerpo,
			imagen: null,
			pdf: null,
		});
		setFileImgName('');
		setFilePdfName('');
	}

	async function handleUpdate(e) {
		e.preventDefault();
		setUploadError('');
		if (!form.titulo || !form.fecha || !form.categoria || !form.cuerpo) return;
		let imagenUrl = null;
		let pdfUrl = null;
		if (form.imagen) {
			imagenUrl = await uploadFile(form.imagen, 'imagen');
			if (!imagenUrl) {
				setUploadError('Error: no se pudo subir la imagen. Revisa el nombre/formatos.');
				return;
			}
		}
		if (form.pdf) {
			pdfUrl = await uploadFile(form.pdf, 'pdf');
			if (!pdfUrl) {
				setUploadError('Error: no se pudo subir el PDF. Revisa el nombre/formatos.');
				return;
			}
		}
		const updateFields = {
			titulo: form.titulo,
			fecha: form.fecha,
			categoria: form.categoria,
			cuerpo: form.cuerpo,
		};
		if (imagenUrl) updateFields.imagen = imagenUrl;
		if (pdfUrl) updateFields.pdf = pdfUrl;
		const { error } = await supabase.from('noticias').update(updateFields).eq('id', editId);
		if (!error) {
			fetchNoticias();
			setForm({ titulo: '', fecha: '', categoria: '', cuerpo: '', imagen: null, pdf: null });
			setFileImgName('');
			setFilePdfName('');
			setEditId(null);
		}
	}
}