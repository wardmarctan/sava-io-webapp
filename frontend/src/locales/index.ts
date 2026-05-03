import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLanguage, setLanguage } from '@/lib/storage'

type TranslationModule = {
  default: Record<string, unknown>
}

function loadTranslations() {
  const files = import.meta.glob('./*/**/*.json', { eager: true }) as Record<string, TranslationModule>
  const resources: Record<string, Record<string, unknown>> = {}

  Object.entries(files).forEach(([path, module]) => {
    const match = /\.\/([^/]+)\/(.+)\.json$/.exec(path)
    if (!match) {
      return
    }

    const language = match[1]
    const namespace = match[2]

    resources[language] ??= {}
    resources[language][namespace] = module.default
  })

  return resources
}

const preferredLanguage = getLanguage() ?? 'en'

i18next
  .use(initReactI18next)
  .init({
    lng: preferredLanguage,
    fallbackLng: 'en',
    resources: loadTranslations() as any,
  } as any)

i18next.on('languageChanged', (language) => {
  setLanguage(language)
})

export default i18next