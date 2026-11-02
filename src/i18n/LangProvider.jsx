import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { chrome } from './chrome'
import { pages } from './pages'

export const LANG_STORAGE = 'rw-lang'

const strings = {
  en: { ...chrome.en, ...pages.en },
  te: { ...chrome.te, ...pages.te },
}

function format(str, vars) {
  if (!vars) return str
  return String(str).replace(/\{(\w+)\}/g, (_, k) => (vars[k] == null ? `{${k}}` : String(vars[k])))
}

const LangContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (key, vars) => format(strings.en[key] ?? key, vars),
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

  const t = useCallback((key, vars) => format(strings[lang]?.[key] ?? strings.en[key] ?? key, vars), [lang])
  const setLang = useCallback((next) => setLangState(next === 'te' ? 'te' : 'en'), [])
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}
