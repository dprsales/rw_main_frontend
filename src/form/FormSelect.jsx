import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/** Dark-gold listbox select used by Brand Consulting and assessment forms. */
export default function FormSelect({
  id,
  value,
  options,
  placeholder = 'Select',
  onChange,
  labelFor,
  'aria-invalid': ariaInvalid,
  required = false,
}) {
  const reactId = useId()
  const show = (option) => (labelFor ? labelFor(option) : option)
  const uid = id || `rw-sel-${reactId.replace(/:/g, '')}`
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [pos, setPos] = useState(null)
  const [dropUp, setDropUp] = useState(false)
  const btn = useRef(null)
  const menu = useRef(null)
  const typeRef = useRef({ buf: '', at: 0 })
  const selectedIndex = options.indexOf(value)

  const place = () => {
    const el = btn.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const gap = 8
    const below = window.innerHeight - r.bottom - 16
    const above = r.top - 16
    const openUp = below < 200 && above > below
    setDropUp(openUp)
    setPos({
      position: 'fixed',
      left: Math.max(12, Math.min(r.left, window.innerWidth - r.width - 12)),
      width: r.width,
      maxHeight: Math.min(288, Math.max(120, openUp ? above : below)),
      ...(openUp
        ? { bottom: window.innerHeight - r.top + gap, top: 'auto' }
        : { top: r.bottom + gap, bottom: 'auto' }),
    })
  }

  useLayoutEffect(() => {
    if (!open) return undefined
    setActive(selectedIndex >= 0 ? selectedIndex : 0)
    place()
    const onMove = () => place()
    window.addEventListener('resize', onMove)
    window.addEventListener('scroll', onMove, true)
    return () => {
      window.removeEventListener('resize', onMove)
      window.removeEventListener('scroll', onMove, true)
    }
  }, [open, selectedIndex])

  useEffect(() => {
    if (!open) return undefined
    const onDoc = (event) => {
      if (btn.current?.contains(event.target) || menu.current?.contains(event.target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  useEffect(() => {
    if (!open) return
    menu.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  function pick(option) {
    onChange(option)
    setOpen(false)
    btn.current?.focus()
  }

  function onKeyDown(event) {
    const { key } = event
    if (!open && (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ')) {
      event.preventDefault()
      setOpen(true)
      return
    }
    if (!open) return
    if (key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      return
    }
    if (key === 'ArrowDown') {
      event.preventDefault()
      setActive((i) => (i + 1) % options.length)
      return
    }
    if (key === 'ArrowUp') {
      event.preventDefault()
      setActive((i) => (i <= 0 ? options.length - 1 : i - 1))
      return
    }
    if (key === 'Home') {
      event.preventDefault()
      setActive(0)
      return
    }
    if (key === 'End') {
      event.preventDefault()
      setActive(options.length - 1)
      return
    }
    if (key === 'Enter' || key === ' ') {
      event.preventDefault()
      if (options[active]) pick(options[active])
      return
    }
    if (key === 'Tab') {
      setOpen(false)
      return
    }
    if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const now = Date.now()
      const next = `${now - typeRef.current.at < 600 ? typeRef.current.buf : ''}${key.toLowerCase()}`
      typeRef.current = { buf: next, at: now }
      const idx = options.findIndex((option) => option.toLowerCase().startsWith(next))
      if (idx >= 0) setActive(idx)
    }
  }

  return (
    <div className={`rw-form-select${open ? ' is-open' : ''}${value ? ' is-picked' : ''}`}>
      <button
        ref={btn}
        type="button"
        id={uid}
        className="rw-form-field rw-form-select-btn"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={`${uid}-list`}
        aria-activedescendant={open ? `${uid}-opt-${active}` : undefined}
        aria-invalid={ariaInvalid || undefined}
        aria-required={required || undefined}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
      >
        <span className="rw-form-select-label">{value ? show(value) : placeholder}</span>
        <svg className="rw-form-select-caret" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M2.4 4.4 6 8l3.6-3.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && pos && createPortal(
        <ul
          ref={menu}
          id={`${uid}-list`}
          className={`rw-form-select-menu${dropUp ? ' is-up' : ''}`}
          role="listbox"
          style={pos}
        >
          {options.map((option, i) => {
            const on = value === option
            return (
              <li key={option} role="none">
                <button
                  type="button"
                  id={`${uid}-opt-${i}`}
                  data-idx={i}
                  role="option"
                  aria-selected={on}
                  className={`rw-form-select-option${on ? ' is-on' : ''}${i === active ? ' is-active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => pick(option)}
                >
                  <span>{show(option)}</span>
                  {on && (
                    <svg className="rw-form-select-check" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path d="M2.5 7.2 5.6 10.2 11.5 3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </li>
            )
          })}
        </ul>,
        document.body,
      )}
    </div>
  )
}
