import { createClient } from 'contentful';

// --- CONFIGURE AQUÍ ---
// Recomendado: definir en Netlify (o en local) las siguientes variables de entorno:
// VITE_CONTENTFUL_SPACE_ID y VITE_CONTENTFUL_ACCESS_TOKEN
// Vite expone variables que empiezan por VITE_ a `import.meta.env` en runtime.
// Por seguridad no deje credenciales reales en el repo: si desea desarrollo
// local rápido, copie `.env.example` a `.env` y pegue sus valores allí.
export const SPACE_ID = import.meta.env.VITE_CONTENTFUL_SPACE_ID || 'YOUR_SPACE_ID_HERE';
export const ACCESS_TOKEN = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN_HERE';

export const isContentfulConfigured = Boolean(
  SPACE_ID && ACCESS_TOKEN && !SPACE_ID.includes('YOUR_') && !ACCESS_TOKEN.includes('YOUR_')
);

const client = isContentfulConfigured
  ? createClient({ space: SPACE_ID, accessToken: ACCESS_TOKEN })
  : null;

export default client;
