import React from 'react';

export default function LoginInput({ type, name, value, onChange, placeholder, icon, autoComplete, required }) {
	return (
		<div className="relative mb-4">
			<span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</span>
			<input
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				autoComplete={autoComplete}
				required={required}
				className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-100 bg-slate-50 text-slate-900 placeholder-slate-400 transition outline-none text-base"
				aria-label={placeholder}
			/>
		</div>
	);
}