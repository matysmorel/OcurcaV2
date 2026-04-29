"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { translations, type Language, type TranslationKey } from "@/lib/translations"

const STORAGE_KEY = "ocurca_lang"

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => translations.en[key],
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en")

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === "en" || saved === "cs") setLangState(saved)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = (next: Language) => {
    setLangState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  const t = (key: TranslationKey): string => translations[lang][key]

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
