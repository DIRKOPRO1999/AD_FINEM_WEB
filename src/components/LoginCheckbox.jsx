import React from 'react';

export default function LoginCheckbox({ checked, onChange, label, id }) {
	return (
		<label htmlFor={id} className="flex items-center gap-2 cursor-pointer select-none text-slate-600 text-sm">
			<input
				id={id}
				type="checkbox"
				checked={checked}
				onChange={onChange}
				className="accent-blue-600 w-4 h-4 rounded border border-slate-300 focus:ring-blue-200"
			/>
			{label}
		</label>
	);
}