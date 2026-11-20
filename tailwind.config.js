/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#123D2A',
          dark: '#0B251B',
          secondary: '#245C40',
          accent: '#67B58A',
          light: '#E9F4ED',
          white: '#FFFFFF',
          bg: '#F7F9F7',
          'text-primary': '#17251D',
          'text-secondary': '#7B887F',
          border: '#E5EBE6',
        },
        dark: {
          bg: '#07150F',
          surface: '#0B251B',
          card: '#102E20',
          border: '#1A4532',
          text: '#E9F4ED',
          muted: '#8DA396',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(11, 37, 27, 0.05), 0 1px 2px -1px rgba(11, 37, 27, 0.05)',
        'card': '0 4px 6px -1px rgba(11, 37, 27, 0.05), 0 2px 4px -2px rgba(11, 37, 27, 0.05)',
        'elevated': '0 10px 15px -3px rgba(11, 37, 27, 0.08), 0 4px 6px -4px rgba(11, 37, 27, 0.08)',
        'glow': '0 0 15px rgba(103, 181, 138, 0.25)',
      }
    },
  },
  plugins: [],
}
