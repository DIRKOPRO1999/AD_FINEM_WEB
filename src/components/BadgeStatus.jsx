import React from 'react';

export default function BadgeStatus({ status }) {
	return (
		<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
			{status}
		</span>
	);
}