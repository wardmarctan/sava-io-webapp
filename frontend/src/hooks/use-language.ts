import { useTranslation } from '@/hooks/use-translation'

const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'id', name: 'Bahasa Indonesia' },
]

export function useLanguage() {
  const { i18n } = useTranslation()

  const changeLanguage = async (language: string) => {
    await i18n.changeLanguage(language)
  }

  return {
    language: i18n.language,
    availableLanguages,
    changeLanguage,
  }
}