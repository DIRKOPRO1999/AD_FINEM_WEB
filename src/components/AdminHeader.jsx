import React from 'react';
import { Eye, Plus } from 'lucide-react';

export default function AdminHeader() {
	return (
		<header className="flex items-center justify-between py-8 px-8 bg-transparent">
			<div>
				<h1 className="text-3xl font-bold text-slate-900">Panel de Noticias</h1>
				<p className="text-slate-500 mt-1">Gestiona y publica las últimas novedades.</p>
			</div>
			<div className="flex gap-3">
				<a
					href="/"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-2 border border-slate-300 bg-white text-slate-700 font-medium px-4 py-2 rounded-lg hover:border-blue-600 hover:text-blue-600 transition"
				>
					<Eye className="w-5 h-5" />
					Ver Sitio
				</a>
				<button
					className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
				>
					<Plus className="w-5 h-5" />
					Nueva Noticia
				</button>
			</div>
		</header>
	);
}