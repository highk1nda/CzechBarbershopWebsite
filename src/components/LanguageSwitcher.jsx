import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { code: 'cs', flag: '🇨🇿', label: 'Čeština' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'uk', flag: '🇺🇦', label: 'Українська' },
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <div role="group" aria-label="Jazyk / Language / Мова" className="flex items-center gap-1">
      {LANGUAGES.map(({ code, flag, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => i18n.changeLanguage(code)}
          aria-pressed={i18n.language === code}
          aria-label={label}
          title={label}
          className={`w-8 h-8 flex items-center justify-center rounded-full text-base leading-none transition-all duration-200 ${
            i18n.language === code
              ? 'opacity-100 ring-2 ring-mauve scale-105'
              : 'opacity-45 grayscale hover:opacity-90 hover:grayscale-0'
          }`}
        >
          <span aria-hidden="true">{flag}</span>
        </button>
      ))}
    </div>
  )
}
