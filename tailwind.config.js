/**
 * Tailwind is used ONLY by the property-listing module (src/listings).
 *
 * - preflight is off so the existing Rajiv Williams pages keep their own reset
 * - content paths only scan listings files, so unused site pages do not mint utilities
 * - important: true is required because global.css is unlayered (`* { padding: 0 }`)
 *   and would otherwise beat Tailwind's layered utilities (padding/grid/flex vanish)
 * - listing pages still wrap UI in `.sy-root` for the mini-reset and component classes
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/listings/**/*.{js,jsx}'],
  important: true,
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        ink: '#F2EFE9',
        faded: '#9A9289',
        night: '#0B0A09',
        panel: '#141210',
        chip: '#1A1714',
        line: 'rgba(242,239,233,0.10)',
        gold: { 300: '#E8C97A', 400: '#D4B06A', 500: '#C39B53', 600: '#A67C3D' },
      },
      fontFamily: {
        sans: ["'Jost'", 'system-ui', '-apple-system', 'sans-serif'],
        serif: ["'Cormorant Garamond'", "'Times New Roman'", 'serif'],
      },
      boxShadow: {
        card: '0 20px 50px rgba(0,0,0,.55)',
        lift: '0 34px 80px rgba(0,0,0,.70)',
      },
    },
  },
  plugins: [],
}
