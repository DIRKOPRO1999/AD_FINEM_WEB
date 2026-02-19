import React from 'react';
import { Bold, Italic, Underline, List, Link } from 'lucide-react';

export default function RichTextToolbar() {
	return (
		<div className="flex gap-2 mb-2">
			<button type="button" className="p-2 rounded hover:bg-blue-50 text-slate-500 hover:text-blue-600" title="Negrita"><Bold className="w-4 h-4" /></button>
			<button type="button" className="p-2 rounded hover:bg-blue-50 text-slate-500 hover:text-blue-600" title="Cursiva"><Italic className="w-4 h-4" /></button>
			<button type="button" className="p-2 rounded hover:bg-blue-50 text-slate-500 hover:text-blue-600" title="Subrayado"><Underline className="w-4 h-4" /></button>
			<button type="button" className="p-2 rounded hover:bg-blue-50 text-slate-500 hover:text-blue-600" title="Lista"><List className="w-4 h-4" /></button>
			<button type="button" className="p-2 rounded hover:bg-blue-50 text-slate-500 hover:text-blue-600" title="Link"><Link className="w-4 h-4" /></button>
		</div>
	);
}