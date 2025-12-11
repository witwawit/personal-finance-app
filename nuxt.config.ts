export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxt/fonts'],
  css: [
    '@/assets/css/tailwind.css',
  ],
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;700&display=swap',
        },
      ],
    },
  },
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui'
  },
})
