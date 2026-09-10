import { useRef, useState, useCallback, useEffect, useLayoutEffect } from 'react'
import './OptionWheel.css'

/**
 * OptionWheel (React Bits): options sit on a circle whose radius keeps arc length
 * between neighbours equal to one row height; `tilt` controls the curl. Captures
 * `wheel` events, so keep it out of always-visible chrome — fine inside a locked modal.
 * Added `onActivate`, firing on click/Enter of an already-selected option (for nav).
 */
const OptionWheel = ({
  items = [],
  defaultSelected = 0,
  onChange,
  onActivate,
  textColor = '#a6a6a6',
  activeColor = '#ffffff',
  side = 'left',
  fontSize = 3,
  spacing = 1.4,
  curve = 1,
  tilt = 6,
  blur = 2,
  fade = 0.25,
  minOpacity = 0.05,
  smoothing = 200,
  inset = 80,
  loop = false,
  draggable = true,
  soundUrl = '',
  soundVolume = 0.5,
  className = '',
}) => {
  const rootRef = useRef(null)
  const itemRefs = useRef([])
  const posRef = useRef(defaultSelected)
  const targetRef = useRef(defaultSelected)
  const rafRef = useRef(null)
  const lastRef = useRef(0)
  const cfgRef = useRef({})
  const onChangeRef = useRef(onChange)
  const onActivateRef = useRef(onActivate)
  const selectedRef = useRef(defaultSelected)
  const wheelTimerRef = useRef(null)
  const dragRef = useRef(null)
  const dragMovedRef = useRef(false)
  const audioRef = useRef(null)
  const audioUrlRef = useRef('')
  const lastTickRef = useRef(0)
  const [selectedIndex, setSelectedIndex] = useState(defaultSelected)
  const [isDragging, setIsDragging] = useState(false)

  const remPx =
    typeof window !== 'undefined'
      ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
      : 16

  onChangeRef.current = onChange
  onActivateRef.current = onActivate
  cfgRef.current = {
    count: items.length,
    items,
    rowH: Math.max(fontSize * spacing * remPx, 1),
    curve, tilt, blur, fade, minOpacity, side, loop, smoothing, draggable,
    soundUrl, soundVolume,
  }

  // Positions each option relative to `next`; run synchronously before first paint too.
  const layout = useCallback((next) => {
    const cfg = cfgRef.current
    const els = itemRefs.current
    const n = cfg.count
    const mirror = cfg.side === 'right' ? -1 : 1
    const tiltRad = (cfg.tilt * Math.PI) / 180
    const R = tiltRad > 0.0005 ? cfg.rowH / tiltRad : 0
    // A non-finite rowH would make transforms NaN and stack the options; fall back to a flat list.
    const rowH = Number.isFinite(cfg.rowH) && cfg.rowH > 0 ? cfg.rowH : 48
    const radius = Number.isFinite(R) ? R : 0

    for (let i = 0; i < n; i++) {
      const el = els[i]
      if (!el) continue
      let d = i - next
      if (cfg.loop && n > 1) {
        d = ((d % n) + n) % n
        if (d > n / 2) d -= n
      }
      const dist = Math.abs(d)
      let x = 0
      let y = d * rowH
      let rot = 0
      if (radius > 0) {
        const ang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, d * tiltRad))
        y = radius * Math.sin(ang)
        x = -mirror * radius * (1 - Math.cos(ang)) * cfg.curve
        rot = (mirror * ang * 180) / Math.PI
      }
      el.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rot.toFixed(3)}deg)`
      el.style.opacity = String(Math.max(cfg.minOpacity, 1 - dist * cfg.fade))
      el.style.filter = cfg.blur > 0 ? `blur(${(dist * cfg.blur).toFixed(2)}px)` : 'none'
      el.style.setProperty('--ow-p', Math.max(0, 1 - Math.min(dist, 1)).toFixed(4))
    }
  }, [])

  const runFrame = useCallback((now) => {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05)
    lastRef.current = now
    const tau = Math.max(cfgRef.current.smoothing, 1) / 1000
    const k = 1 - Math.exp(-dt / tau)

    const target = targetRef.current
    const cur = posRef.current
    let next = cur + (target - cur) * k
    const settled = Math.abs(target - next) < 0.001
    if (settled) next = target
    posRef.current = next

    layout(next)
    rafRef.current = settled ? null : requestAnimationFrame(runFrame)
  }, [layout])

  const startLoop = useCallback(() => {
    if (rafRef.current != null) return
    lastRef.current = performance.now()
    rafRef.current = requestAnimationFrame(runFrame)
  }, [runFrame])

  const playTick = useCallback(() => {
    const { soundUrl: url, soundVolume: vol } = cfgRef.current
    if (!url) return
    const now = performance.now()
    if (now - lastTickRef.current < 70) return
    lastTickRef.current = now
    if (!audioRef.current || audioUrlRef.current !== url) {
      audioRef.current = new Audio(url)
      audioRef.current.preload = 'auto'
      audioUrlRef.current = url
    }
    const audio = audioRef.current
    audio.volume = Math.min(Math.max(vol, 0), 1)
    audio.currentTime = 0
    audio.play()?.catch(() => {})
  }, [])

  const applyTarget = useCallback(
    (value, snap) => {
      const cfg = cfgRef.current
      let v = value
      if (!cfg.loop) v = Math.min(Math.max(v, 0), Math.max(cfg.count - 1, 0))
      if (snap) v = Math.round(v)
      targetRef.current = v
      const idx = ((Math.round(v) % cfg.count) + cfg.count) % cfg.count
      if (idx !== selectedRef.current) {
        selectedRef.current = idx
        setSelectedIndex(idx)
        onChangeRef.current?.(idx, cfg.items[idx])
        playTick()
      }
      startLoop()
    },
    [startLoop, playTick],
  )

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      const cfg = cfgRef.current
      const delta = e.deltaMode === 1 ? e.deltaY * 24 : e.deltaY
      const step = Math.max(-1, Math.min(1, delta / cfg.rowH))
      applyTarget(targetRef.current + step, false)
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current)
      wheelTimerRef.current = setTimeout(() => applyTarget(targetRef.current, true), 140)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current)
    }
  }, [applyTarget])

  const handlePointerDown = useCallback((e) => {
    if (!cfgRef.current.draggable) return
    dragRef.current = { y: e.clientY, start: targetRef.current, id: e.pointerId }
    dragMovedRef.current = false
    setIsDragging(true)
  }, [])

  const handlePointerMove = useCallback(
    (e) => {
      const drag = dragRef.current
      if (!drag) return
      const dy = e.clientY - drag.y
      if (!dragMovedRef.current && Math.abs(dy) > 4) {
        dragMovedRef.current = true
        rootRef.current?.setPointerCapture(drag.id)
      }
      if (dragMovedRef.current) applyTarget(drag.start - dy / cfgRef.current.rowH, false)
    },
    [applyTarget],
  )

  const handlePointerEnd = useCallback(() => {
    if (!dragRef.current) return
    dragRef.current = null
    setIsDragging(false)
    if (dragMovedRef.current) applyTarget(targetRef.current, true)
  }, [applyTarget])

  const handleItemClick = useCallback(
    (index) => {
      if (dragMovedRef.current) return
      const cfg = cfgRef.current
      const cur = targetRef.current
      const curIdx = ((Math.round(cur) % cfg.count) + cfg.count) % cfg.count
      // Clicking the option already at the centre commits to it.
      if (index === curIdx) {
        onActivateRef.current?.(index, cfg.items[index])
        return
      }
      let d = index - curIdx
      if (cfg.loop && cfg.count > 1) {
        if (d > cfg.count / 2) d -= cfg.count
        else if (d < -cfg.count / 2) d += cfg.count
      }
      applyTarget(cur + d, true)
    },
    [applyTarget],
  )

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        const cfg = cfgRef.current
        const idx = ((Math.round(targetRef.current) % cfg.count) + cfg.count) % cfg.count
        onActivateRef.current?.(idx, cfg.items[idx])
        return
      }
      let delta = null
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') delta = -1
      else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') delta = 1
      if (delta == null) return
      e.preventDefault()
      applyTarget(Math.round(targetRef.current) + delta, true)
    },
    [applyTarget],
  )

  useEffect(() => {
    applyTarget(targetRef.current, false)
  }, [items, fontSize, spacing, curve, tilt, blur, fade, minOpacity, side, loop, smoothing, applyTarget])

  // Lays the wheel out before first paint, so options never appear stacked while waiting for rAF.
  useLayoutEffect(() => {
    layout(posRef.current)
  }, [layout, items])

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      audioRef.current?.pause()
    },
    [],
  )

  return (
    <div
      ref={rootRef}
      role="listbox"
      tabIndex={0}
      aria-label="Site navigation"
      className={`option-wheel${side === 'right' ? ' option-wheel--right' : ''}${isDragging ? ' option-wheel--dragging' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--ow-text-color': textColor,
        '--ow-active-color': activeColor,
        '--ow-font-size': `${fontSize}rem`,
        '--ow-inset': `${inset}px`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onKeyDown={handleKeyDown}
    >
      {items.map((label, index) => (
        <div
          key={`${label}-${index}`}
          ref={(el) => { itemRefs.current[index] = el }}
          role="option"
          aria-selected={selectedIndex === index}
          className={`option-wheel__item${selectedIndex === index ? ' option-wheel__item--selected' : ''}`}
          onClick={() => handleItemClick(index)}
        >
          {label}
        </div>
      ))}
    </div>
  )
}

export default OptionWheel
