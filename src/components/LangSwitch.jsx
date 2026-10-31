import { useLang } from '../i18n/LangProvider'
import { mono } from '../theme'

/** Header language toggle. Labels stay EN | తెలుగు in both languages so the switch is always readable. */
export default function LangSwitch() {
  const { lang, setLang, t } = useLang()

  return (
    <div className="rw-lang-switch" role="group" aria-label={t('ui.language')}>
      <button
        type="button"
        className={`rw-lang-btn${lang === 'en' ? ' is-on' : ''}`}
        style={{ fontFamily: mono }}
        aria-pressed={lang === 'en'}
        onClick={() => setLang('en')}
      >
        EN
      </button>
      <span className="rw-lang-sep" aria-hidden="true">|</span>
      <button
        type="button"
        className={`rw-lang-btn rw-lang-te${lang === 'te' ? ' is-on' : ''}`}
        aria-pressed={lang === 'te'}
        onClick={() => setLang('te')}
      >
        తెలుగు
      </button>
    </div>
  )
}
