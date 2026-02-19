import React from 'react';

export default function LoginButton({ children, type = 'button', loading }) {
	return (
		<button
			type={type}
			className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-tr from-blue-600 to-purple-600 shadow hover:shadow-lg hover:-translate-y-0.5 transition text-base focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-60"
			disabled={loading}
			aria-busy={loading}
		>
			{loading ? 'Ingresando...' : children}
		</button>
	);
}