import { THEME, serif } from '../theme'

// Writes theme tokens as CSS custom properties on a wrapper so global.css and descendants can read them.
export function ThemeProvider({ children }) {
  return (
    <div
      id="rw-app-shell"
      className="rw-app-shell"
      style={{
        ...THEME,
        // Root of the type stack; label-role elements opt into `mono` explicitly.
        fontFamily: serif,
        // Greyscale antialiasing keeps light-on-dark serif text from looking bold and muddy.
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
