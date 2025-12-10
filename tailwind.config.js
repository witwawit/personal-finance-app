/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app.vue',
    './app/**/*.{vue,ts}',
    './components/**/*.{vue,ts}',
    './layouts/**/*.{vue,ts}',
    './pages/**/*.{vue,ts}',      
    './nuxt.config.{ts,js}'       
  ],
  theme: {
    extend: {
      colors: {
      },
    },
  },
  plugins: [],
}

