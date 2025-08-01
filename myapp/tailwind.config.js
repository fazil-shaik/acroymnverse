/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom gradient colors from hex values
        'custom-green': '#93DA97',
        'custom-pink': '#BA487F', 
        'custom-dark': '#3B060A',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'custom-gradient-light': 'linear-gradient(135deg, #93DA97 0%, #BA487F 50%, #3B060A 100%)',
        'custom-gradient-dark': 'linear-gradient(135deg, #1a4d1f 0%, #5d1e35 50%, #0a0202 100%)',
      },
      animation: {
        'gradient-move': 'gradient-move 8s ease-in-out infinite',
        'text-pop': 'text-pop 1.2s cubic-bezier(.68,-0.55,.27,1.55)',
        'fade-in': 'fade-in 1.5s ease',
        'card-bounce': 'card-bounce 1.2s cubic-bezier(.68,-0.55,.27,1.55)',
        'emoji-bounce': 'emoji-bounce 1.5s infinite',
        'btn-pop': 'btn-pop 1.2s cubic-bezier(.68,-0.55,.27,1.55)',
        'tag-float': 'tag-float 2s infinite',
      },
      keyframes: {
        'gradient-move': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        'text-pop': {
          '0%': { transform: 'scale(0.9)', opacity: '0', letterSpacing: '-2px' },
          '60%': { transform: 'scale(1.08)', opacity: '1', letterSpacing: '2px' },
          '100%': { transform: 'scale(1)', letterSpacing: '0' }
        },
        'fade-in': {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        'card-bounce': {
          '0%': { transform: 'scale(0.95)' },
          '60%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' }
        },
        'emoji-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'btn-pop': {
          '0%': { transform: 'scale(0.9)' },
          '60%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' }
        },
        'tag-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      }
    },
  },
  plugins: [],
}
