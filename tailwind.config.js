/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#005A66',     // Color principal (Azul Ad Finem)
          dark: '#00424b',     // Versión más oscura para hovers
          orange: '#EE7C3B',   // Color secundario (Naranja)
          light: '#f0f9fa',    // Color de fondo muy suave
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Fuente limpia recomendada
      }
    },
  },
  plugins: [],
}