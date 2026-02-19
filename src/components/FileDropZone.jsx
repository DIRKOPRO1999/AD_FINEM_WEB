import React, { useRef } from 'react';
import { Image, FileText } from 'lucide-react';

export default function FileDropZone({ accept, maxSize, onDrop, preview, label, info }) {
	const inputRef = useRef();
	const isImage = accept.includes('image');
	const Icon = isImage ? Image : FileText;

	function handleFile(e) {
		const file = e.target.files[0];
		if (file && file.size <= maxSize * 1024 * 1024) {
			onDrop(file);
		}
	}

	function handleDrop(e) {
		e.preventDefault();
		const file = e.dataTransfer.files[0];
		if (file && file.size <= maxSize * 1024 * 1024) {
			onDrop(file);
		}
	}

	return (
		<div
			className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 cursor-pointer hover:border-blue-600 transition"
			onClick={() => inputRef.current.click()}
			onDrop={handleDrop}
			onDragOver={e => e.preventDefault()}
		>
			<Icon className="w-8 h-8 text-slate-400 mb-2" />
			<div className="text-slate-700 font-medium mb-1">{label}</div>
			<div className="text-xs text-slate-400 mb-2">{info}</div>
			<input
				ref={inputRef}
				type="file"
				accept={accept}
				className="hidden"
				onChange={handleFile}
			/>
			{preview && (
				isImage ? (
					<img src={preview} alt="preview" className="mt-3 rounded-lg h-20 object-cover" />
				) : (
					<a href={preview} target="_blank" rel="noopener noreferrer" className="mt-3 text-blue-600 underline">Ver PDF</a>
				)
			)}
		</div>
	);
}