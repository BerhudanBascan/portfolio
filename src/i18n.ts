import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import tr from './locales/tr.json'
import de from './locales/de.json'

const savedLang = localStorage.getItem('lang')
const systemLang = navigator.language.split('-')[0]
const defaultLang = savedLang || (['en', 'tr', 'de'].includes(systemLang) ? systemLang : 'en')

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, tr: { translation: tr }, de: { translation: de } },
  lng: defaultLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lng) => localStorage.setItem('lang', lng))

export default i18n