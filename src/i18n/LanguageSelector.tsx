"use client"

import { useEffect } from "react"
import { useTranslation, type Locale } from "./I18nContext"

const flags: Record<Locale, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
  es: "🇪🇸",
}

const labels: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  es: "ES",
}

export default function LanguageSelector() {
  const { locale, setLocale } = useTranslation()

  useEffect(() => {
    const saved = localStorage.getItem("menuqr-locale")
    if (saved && (saved === "fr" || saved === "en" || saved === "es")) {
      if (saved !== locale) {
        setLocale(saved as Locale)
      }
    }
  }, [locale, setLocale])

  return (
    <div className="flex items-center gap-1">
      {(Object.keys(labels) as Locale[]).map((lang) => (
        <button
          key={lang}
          onClick={() => setLocale(lang)}
          className={`px-2 py-1 rounded-md text-sm font-medium transition-colors ${
            locale === lang
              ? "bg-white/20 text-white"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
          aria-label={`Switch to ${labels[lang]}`}
        >
          {flags[lang]} {labels[lang]}
        </button>
      ))}
    </div>
  )
}
