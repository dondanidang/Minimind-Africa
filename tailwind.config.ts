import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'admin-lg': '1600px', // Custom breakpoint for admin table view
      },
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#CCB5D9',
          600: '#CCB5D9',
          700: '#b89fc8',
          800: '#a489b7',
          900: '#9073a6',
        },
        accent: {
          yellow: '#F6F1BF',
          'yellow-light': '#F6F1BF',
        },
      },
    },
  },
  plugins: [],
}
export default config

