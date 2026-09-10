import { THEME, serif } from '../theme'

/**
 * Writes cinematic tokens as CSS custom properties on a wrapper so every descendant
 * (including global.css rules) can read them. Just a styled wrapper — no state/context needed.
 */
export function ThemeProvider({ children }) {
  return (
    <div
      id="rw-app-shell"
      className="rw-app-shell"
      style={{
        ...THEME,
        // Root of the type stack; label elements opt into `mono` since serif fails at 9-13px.
        fontFamily: serif,
        // Greyscale antialiasing keeps light-on-dark serif thin instead of bold and muddy.
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
        background: 'var(--bg)',
        color: 'var(--ink)',
        // min-height lives in global.css so it can pair svh with a vh fallback.
        width: '100%',
        position: 'relative',
      }}
    >
      {children}
    </div>
  )
}
