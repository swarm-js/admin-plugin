// https://nuxt.com/docs/api/configuration/nuxt-config

import { appDescription, appTitle } from './constants'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite'

const lifecycle = process.env.npm_lifecycle_event

export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@element-plus/nuxt', '@vueuse/nuxt', '@pinia/nuxt'],
  plugins: ['~/plugins/fontawesome.js', '~/plugins/i18n.js'],
  app: {
    baseURL: '/admin/',
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'black-translucent'
        },
        { name: 'theme-color', content: '#0d171b' },
        { name: 'robots', content: 'noindex,nofollow' }
      ]
    }
  },
  ssr: false,

  // css
  css: [
    '~/assets/scss/index.scss',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],

  // build
  build: {
    transpile: lifecycle === 'build' ? ['element-plus'] : []
  },

  components: true,

  elementPlus: {
    icon: 'ElIcon',
    importStyle: 'scss',
    themes: []
  },

  pinia: {
    autoImports: ['defineStore']
  },

  // vite plugins
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/scss/element/index.scss" as element;`
        }
      }
    },
    plugins: [
      AutoImport({
        // resolvers: [ElementPlusResolver()]
      }),
      Components({
        dts: true
        // resolvers: [ElementPlusResolver()]
      }),
      VueI18nVitePlugin({
        include: [
          resolve(dirname(fileURLToPath(import.meta.url)), './locales/*.json')
        ]
      })
    ]
  },

  // vueuse
  vueuse: {
    ssrHandlers: true
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL
    }
  }
})
