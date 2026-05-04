"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

export type Locale = "fr" | "en" | "es"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string | Record<string, string>
}

const I18nContext = createContext<I18nContextType | null>(null)

const dictionaries: Record<Locale, Record<string, unknown>> = {
  fr: {} as Record<string, unknown>,
  en: {} as Record<string, unknown>,
  es: {} as Record<string, unknown>,
}

let loaded = false

function loadDictionariesSync() {
  if (loaded) return
  try {
    const fr = require("./fr.json")
    const en = require("./en.json")
    const es = require("./es.json")
    dictionaries.fr = fr
    dictionaries.en = en
    dictionaries.es = es
    loaded = true
  } catch {
    // fallback: leave empty
  }
}

loadDictionariesSync()

function getNestedValue(obj: Record<string, unknown>, path: string): string | Record<string, string> | undefined {
  const keys = path.split(".")
  let current: unknown = obj
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }
  if (typeof current === "string") return current
  if (current && typeof current === "object") return current as Record<string, string>
  return undefined
}

export function I18nProvider({ children, defaultLocale = "fr" }: { children: ReactNode; defaultLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    document.documentElement.lang = newLocale
    localStorage.setItem("menuqr-locale", newLocale)
  }, [])

  const t = useCallback(
    (key: string): string | Record<string, string> => {
      const dict = dictionaries[locale]
      const value = getNestedValue(dict, key)
      if (value !== undefined) return value
      // fallback to fr
      const fallback = getNestedValue(dictionaries.fr, key)
      return fallback !== undefined ? fallback : key
    },
    [locale]
  )

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider")
  }
  return context
}
