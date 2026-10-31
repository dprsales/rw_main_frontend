import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { chrome } from './chrome'

export const LANG_STORAGE = 'rw-lang'

const LangContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (key) => chrome.en[key] ?? key,
})

function readLang() {
  try {
    return localStorage.getItem(LANG_STORAGE) === 'te' ? 'te' : 'en'
  } catch {
    return 'en'
  }
}

export function applyDocumentLang(lang) {
  const next = lang === 'te' ? 'te' : 'en'
  document.documentElement.lang = next
  document.documentElement.setAttribute('data-lang', next)
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(readLang)

  useEffect(() => {
    applyDocumentLang(lang)
    try { localStorage.setItem(LANG_STORAGE, lang) } catch { /* storage blocked */ }
  }, [lang])

  const t = useCallback((key) => chrome[lang]?.[key] ?? chrome.en[key] ?? key, [lang])
  const setLang = useCallback((next) => setLangState(next === 'te' ? 'te' : 'en'), [])
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}
