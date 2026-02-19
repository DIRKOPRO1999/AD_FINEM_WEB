import React, { useState } from 'react';
import BadgeStatus from './BadgeStatus';
import FileDropZone from './FileDropZone';
import RichTextToolbar from './RichTextToolbar';
import { Calendar } from 'lucide-react';

const initialForm = {
	titulo: '',
	resumen: '',
	cuerpo: '',
	fecha: '',
	url_imagen: '',
	url_pdf: ''
};

export default function NewsFormCard({ form, setForm, editId, setEditId, fetchNoticias, error, setError }) {
	const [fileImg, setFileImg] = useState(null);
	const [filePdf, setFilePdf] = useState(null);
	const [uploading, setUploading] = useState(false);

	function handleChange(e) {
		setForm({ ...form, [e.target.name]: e.target.value });
	}

	// Simulación de upload (reemplazar por lógica real)
	function handleFileUpload(file, type) {
		setUploading(true);
		setTimeout(() => {
			setUploading(false);
			setForm(f => ({ ...f, [type === 'imagen' ? 'url_imagen' : 'url_pdf']: URL.createObjectURL(file) }));
		}, 1000);
	}

	function handleSubmit(e) {
		e.preventDefault();
		setError('');
		if (!form.titulo) return setError('El título es obligatorio');
		// Lógica de submit real aquí
		setForm(initialForm);
		setFileImg(null);
		setFilePdf(null);
		setEditId(null);
		fetchNoticias && fetchNoticias();
	}

	return (
		<div className="bg-white rounded-xl shadow-lg p-8 mb-8">
			<div className="flex items-center mb-6">
				<span className="mr-3 text-blue-600">
					<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-2h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"/></svg>
				</span>
				<h3 className="text-xl font-bold text-slate-900 flex-1">Crear Nueva Noticia</h3>
				<BadgeStatus status="Borrador" />
			</div>
			<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="col-span-1 md:col-span-2">
					<label className="block text-slate-700 font-semibold mb-2">Título de la Noticia</label>
					<input
						name="titulo"
						value={form?.titulo || ''}
						onChange={handleChange}
						className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition text-slate-900 bg-slate-50"
						placeholder="Ingresa un título llamativo..."
						required
					/>
				</div>
				<div>
					<label className="block text-slate-700 font-semibold mb-2">Fecha de Publicación</label>
					<div className="relative">
						<input
							type="date"
							name="fecha"
							value={form?.fecha || ''}
							onChange={handleChange}
							className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition text-slate-900 bg-slate-50 pr-10"
							placeholder="mm/dd/yyyy"
						/>
						<Calendar className="absolute right-3 top-2.5 w-5 h-5 text-slate-400 pointer-events-none" />
					</div>
				</div>
				<div className="col-span-1 md:col-span-2">
					<label className="block text-slate-700 font-semibold mb-2">Resumen Breve</label>
					<textarea
						name="resumen"
						value={form?.resumen || ''}
						onChange={handleChange}
						className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition text-slate-900 bg-slate-50"
						placeholder="Escribe un breve extracto que aparecerá en la lista de noticias..."
						maxLength={250}
					/>
					<div className="text-xs text-slate-400 mt-1 text-right">{(form?.resumen?.length || 0)}/250 caracteres</div>
				</div>
				<div className="col-span-1 md:col-span-2">
					<label className="block text-slate-700 font-semibold mb-2">Cuerpo de la Noticia</label>
					<div className="bg-slate-50 border border-slate-200 rounded-lg p-2">
						<RichTextToolbar />
						<textarea
							name="cuerpo"
							value={form?.cuerpo || ''}
							onChange={handleChange}
							className="w-full h-32 border-none bg-transparent px-2 py-1 text-slate-900 focus:outline-none resize-none"
							placeholder="Escribe el contenido completo aquí..."
						/>
					</div>
				</div>
				<div className="col-span-1">
					<label className="block text-slate-700 font-semibold mb-2">Imagen Destacada</label>
					<FileDropZone
						accept="image/*"
						maxSize={5}
						onDrop={file => { setFileImg(file); handleFileUpload(file, 'imagen'); }}
						preview={form?.url_imagen}
						label="Click o arrastra imagen"
						info="PNG, JPG hasta 5MB"
					/>
				</div>
				<div className="col-span-1">
					<label className="block text-slate-700 font-semibold mb-2">Documento Adjunto (PDF)</label>
					<FileDropZone
						accept="application/pdf"
						maxSize={10}
						onDrop={file => { setFilePdf(file); handleFileUpload(file, 'pdf'); }}
						preview={form?.url_pdf}
						label="Click o arrastra PDF"
						info="Max 10MB"
					/>
				</div>
				{error && <div className="col-span-1 md:col-span-2 text-red-500 font-bold">{error}</div>}
				<div className="col-span-1 md:col-span-2 flex gap-3 mt-4">
					<button
						type="submit"
						className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-blue-700 transition disabled:opacity-60"
						disabled={uploading}
					>
						{editId ? 'Actualizar' : 'Crear Noticia'}
					</button>
					{editId && (
						<button
							type="button"
							onClick={() => { setForm(initialForm); setEditId(null); }}
							className="text-slate-500 underline"
						>Cancelar edición</button>
					)}
				</div>
			</form>
		</div>
	);
}