import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Newspaper } from 'lucide-react';

export default function NoticiasSidebar() {
   const [user, setUser] = useState(null);
   const navigate = useNavigate();

   useEffect(() => {
	   const session = supabase.auth.session ? supabase.auth.session() : supabase.auth.getSession?.();
	   if (session && session.user) {
		   setUser(session.user);
	   } else {
		   supabase.auth.getUser().then(({ data }) => {
			   if (data?.user) setUser(data.user);
		   });
	   }
	   // Suscribirse a cambios de sesión
	   const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
		   setUser(session?.user || null);
	   });
	   return () => { listener?.unsubscribe?.(); };
   }, []);

   const handleLogout = async () => {
	   await supabase.auth.signOut();
	   navigate('/login');
   };

   const avatarUrl = user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/40?img=3';
   const displayName = user?.user_metadata?.full_name || user?.email || 'Usuario';
   const displayEmail = user?.email || '';
   return (
		<aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between z-30">
			{/* Logo */}
			<div className="px-8 pt-8 pb-4">
				<span className="font-bold text-xl text-slate-900 tracking-tight">NoticiasAdmin</span>
			</div>
			{/* Único ítem de navegación */}
			<nav className="flex-1 flex flex-col items-center justify-center">
				<a
					href="#"
					className="flex items-center gap-3 px-6 py-3 rounded-lg bg-blue-50 text-blue-600 font-semibold text-base w-48 justify-center shadow-sm"
				>
					<Newspaper className="w-5 h-5" />
					Noticias
				</a>
			</nav>
			{/* Perfil abajo */}
			   <div className="px-8 pb-8 flex items-center gap-3">
				   <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full border border-slate-200" />
				   <div className="flex-1">
					   <div className="text-sm font-medium text-slate-800 leading-tight">{displayName}</div>
					   <div className="text-xs text-slate-400">{displayEmail}</div>
				   </div>
				   <button className="ml-2 text-slate-400 hover:text-red-500 transition" title="Cerrar sesión" onClick={handleLogout}>
					   <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1"/></svg>
				   </button>
			   </div>
		</aside>
	);
}