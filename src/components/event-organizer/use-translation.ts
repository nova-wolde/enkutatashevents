import { useEventStore, Language } from './store'
import { translations } from './translations'

export function useTranslation() {
  const { language, setLanguage } = useEventStore()
  const t = translations[language]
  return { t, language, setLanguage, isAmharic: language === 'am' }
}
