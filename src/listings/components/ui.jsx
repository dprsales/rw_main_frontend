import { useEffect, useRef, useState } from 'react'

export function Chip({ label, selected, onClick, showCheck = true }) {
  return (
    <button type="button" onClick={onClick} className={`chip ${selected ? 'selected' : ''}`} aria-pressed={!!selected}>
      {selected && showCheck && <span className="text-gold-300">✓</span>}
      {label}
    </button>
  )
}

export function ToggleGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`toggle-btn ${value === opt ? 'active' : ''}`}
          aria-pressed={value === opt}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export function CountGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          aria-pressed={value === opt}
          className={`h-10 min-w-[2.75rem] rounded-md border px-3 text-sm font-medium transition-colors ${
            value === opt
              ? 'border-gold-500 bg-gold-500 text-night'
              : 'border-line bg-chip text-ink hover:border-gold-500/60'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export function StepField({ label, required, hint, error, className = '', children }) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="field-label">
        {label}
        {required && <span className="text-gold-500"> *</span>}
      </label>
      {children}
      {hint && <p className={`mt-1 text-xs ${error ? 'text-red-300' : 'text-faded'}`}>{hint}</p>}
    </div>
  )
}

export function CollapsibleRow({ icon, label, selected, options, onToggleOption }) {
  return (
    <details className="group rounded-md border border-line bg-night/40 open:border-gold-500/50">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm text-ink">
        <span className="flex items-center gap-2.5">
          <span>{icon}</span>
          {label}
          {selected?.length > 0 && (
            <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-xs text-gold-300">{selected.length}</span>
          )}
        </span>
        <span className="text-faded transition-transform group-open:rotate-180">⌄</span>
      </summary>
      <div className="flex flex-wrap gap-2 border-t border-line p-3">
        {options.map((opt) => (
          <Chip key={opt} label={opt} selected={selected?.includes(opt)} onClick={() => onToggleOption(opt)} />
        ))}
      </div>
    </details>
  )
}

export function StepCard({ step, title, subtitle, children, footer }) {
  return (
    <div className="card p-5 sm:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-serif text-3xl font-normal text-ink">{title}</h2>
        <p className="eyebrow">Step {step} of 5</p>
      </div>
      {subtitle && <p className="mt-1 text-sm text-faded">{subtitle}</p>}
      <hr className="mb-5 mt-4 border-t border-line" />
      {children}
      {footer && <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">{footer}</div>}
    </div>
  )
}

const STATUS = {
  pending: { label: 'Pending approval', cls: 'border-amber-400/40 bg-amber-400/10 text-amber-300', dot: 'bg-amber-400' },
  approved: { label: 'Approved · Live', cls: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300', dot: 'bg-emerald-400' },
  rejected: { label: 'Not approved', cls: 'border-red-400/40 bg-red-400/10 text-red-300', dot: 'bg-red-400' },
}

export function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.pending
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider ${s.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

export function VerifiedBadge({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-night/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-300 backdrop-blur ${className}`}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2l2.4 2.1 3.2-.3.9 3.1 2.8 1.6-1 3 1 3-2.8 1.6-.9 3.1-3.2-.3L12 22l-2.4-2.1-3.2.3-.9-3.1L2.7 15.5l1-3-1-3 2.8-1.6.9-3.1 3.2.3L12 2zm-1.2 13.6l6-6-1.4-1.4-4.6 4.6-2.2-2.2-1.4 1.4 3.6 3.6z" /></svg>
      Verified
    </span>
  )
}

export function ErrorNote({ children }) {
  if (!children) return null
  return (
    <p role="alert" className="mt-3 rounded-md border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
      {children}
    </p>
  )
}

// ---------------- dropdowns ----------------

const norm = (o) => (o !== null && typeof o === 'object' ? o : { value: o, label: o })

/** Native single-select dropdown (best UX on mobile). Options: strings or {value,label}. */
export function Select({ value, onChange, options, placeholder = 'Select', invalid, className = '', ...rest }) {
  return (
    <select
      className={`field-input select-input ${invalid ? 'is-invalid' : ''} ${className}`}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    >
      <option value="">{placeholder}</option>
      {options.map(norm).map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

/** Dropdown with an "Other…" escape hatch that reveals a text box. */
export function SelectOrOther({ value, onChange, options, placeholder = 'Select', otherPlaceholder = 'Type here', invalid }) {
  const [other, setOther] = useState(false)
  const custom = !!value && !options.includes(value)
  const showInput = other || custom
  return (
    <div className="space-y-2">
      <Select
        value={showInput ? '__other' : value}
        placeholder={placeholder}
        invalid={invalid && !showInput}
        options={[...options, { value: '__other', label: 'Other…' }]}
        onChange={(v) => {
          if (v === '__other') { setOther(true); onChange('') }
          else { setOther(false); onChange(v) }
        }}
      />
      {showInput && (
        <input className={`field-input ${invalid && !value ? 'is-invalid' : ''}`} placeholder={otherPlaceholder} autoFocus={other}
          value={value || ''} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  )
}

/** Multi-select dropdown with checkboxes. `value` is an array of strings. */
export function MultiSelect({ options, value = [], onChange, placeholder = 'Select', invalid }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggle = (o) => onChange(value.includes(o) ? value.filter((v) => v !== o) : [...value, o])
  const summary = !value.length
    ? placeholder
    : value.length <= 2
      ? value.join(', ')
      : `${value.slice(0, 2).join(', ')} +${value.length - 2}`

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`field-input select-input flex items-center gap-2 text-left ${invalid ? 'is-invalid' : ''} ${open ? '!border-gold-500' : ''}`}
      >
        <span className={`min-w-0 flex-1 truncate ${value.length ? 'text-ink' : 'text-faded/70'}`}>{summary}</span>
        {value.length > 0 && <span className="shrink-0 rounded-full bg-gold-500/15 px-2 text-xs text-gold-300">{value.length}</span>}
      </button>
      {open && (
        <div role="listbox" aria-multiselectable className="pop absolute left-0 z-30 mt-1 max-h-64 w-full min-w-[230px] overflow-auto rounded-md border border-line bg-panel p-1 shadow-lift">
          {options.map((o) => {
            const on = value.includes(o)
            return (
              <button key={o} type="button" role="option" aria-selected={on} onClick={() => toggle(o)}
                className={`flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm transition-colors hover:bg-chip ${on ? 'text-gold-300' : 'text-ink'}`}>
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] ${on ? 'border-gold-500 bg-gold-500 text-night' : 'border-line'}`}>{on ? '✓' : ''}</span>
                {o}
              </button>
            )
          })}
          {value.length > 0 && (
            <button type="button" onClick={() => onChange([])} className="mt-1 w-full border-t border-line px-2.5 py-2 text-left text-xs text-faded hover:text-gold-300">
              Clear selection
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/** Expected-possession picker: two dropdowns (month + year) → "YYYY-MM". */
export function MonthYearSelect({ value, onChange, months, years }) {
  const [y = '', m = ''] = (value || '').split('-')
  const set = (ny, nm) => onChange(ny && nm ? `${ny}-${nm}` : ny || nm ? `${ny}-${nm}` : '')
  return (
    <div className="grid grid-cols-2 gap-2">
      <Select value={m} options={months} placeholder="Month" onChange={(v) => set(y, v)} />
      <Select value={y} options={years} placeholder="Year" onChange={(v) => set(v, m)} />
    </div>
  )
}
