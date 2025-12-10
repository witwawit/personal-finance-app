export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxt/fonts'],
  css: [
    '@/assets/css/tailwind.css',
  ],
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui'
  },
  fonts: {}
})
