import { createI18n } from 'vue-i18n'
import countries from 'i18n-iso-countries'

import en from '../locales/en.json'
import fr from '../locales/fr.json'
import countryEn from 'i18n-iso-countries/langs/en.json'
import countryFr from 'i18n-iso-countries/langs/fr.json'

countries.registerLocale(countryEn)
countries.registerLocale(countryFr)

export default defineNuxtPlugin(({ vueApp }) => {
  const fallbackLocale = 'en'

  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: navigator.language.split('-')[0],
    fallbackLocale,
    messages: {
      en,
      fr
    }
  })

  vueApp.use(i18n)
})
