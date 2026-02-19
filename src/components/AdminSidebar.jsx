import React from 'react';
import { Home, Newspaper, Users, FileText, Settings } from 'lucide-react';

const navItems = [
	{ label: 'Dashboard', icon: Home, href: '/admin', key: 'dashboard' },
	{ label: 'Noticias', icon: Newspaper, href: '/admin/noticias', key: 'noticias' },
	{ label: 'Usuarios', icon: Users, href: '/admin/usuarios', key: 'usuarios' },
	{ label: 'Archivos', icon: FileText, href: '/admin/archivos', key: 'archivos' },
	{ label: 'Configuración', icon: Settings, href: '/admin/configuracion', key: 'configuracion' },
];

export default function AdminSidebar({ active }) {
	return (
		<aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col justify-between fixed left-0 top-0 z-20">
			<div>
				<div className="px-6 py-5 flex items-center gap-2 border-b border-slate-200">
					<span className="text-blue-600 font-bold text-lg">AdminPro</span>
				</div>
				<nav className="mt-6">
					{navItems.map(item => {
						const Icon = item.icon;
						const isActive = active === item.key;
						return (
							<a
								key={item.key}
								href={item.href}
								className={`flex items-center gap-3 px-6 py-3 text-slate-700 font-medium border-l-4 transition-all ${isActive ? 'bg-slate-50 border-blue-600 text-blue-600' : 'border-transparent hover:bg-slate-100 hover:text-blue-600'}`}
							>
								<Icon className="w-5 h-5" />
								{item.label}
							</a>
						);
					})}
				</nav>
			</div>
			<div className="px-6 py-4 border-t border-slate-200 flex items-center gap-3">
				<div className="bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center text-slate-500 font-bold">AD</div>
				<div>
					<div className="text-xs font-semibold text-slate-700">Admin User</div>
					<div className="text-xs text-slate-500">admin@news.com</div>
				</div>
				<a href="/logout" className="ml-auto text-slate-400 hover:text-red-500">
					<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1"/></svg>
				</a>
			</div>
		</aside>
	);
}