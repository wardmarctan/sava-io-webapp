import { useLanguage } from '@/hooks/use-language'

export function LanguageSwitcher() {
  const { language, availableLanguages, changeLanguage } = useLanguage()

  return (
    <label className="language-switcher">
      <span>Language</span>
      <select value={language} onChange={(event) => changeLanguage(event.target.value)}>
        {availableLanguages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.name}
          </option>
        ))}
      </select>
    </label>
  )
}