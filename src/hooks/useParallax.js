import { useCallback, useRef } from 'react'

// Drifts a target element as the cursor moves over its container.
export function useParallax({ strength = 16, scale = 1.02 } = {}) {
  const targetRef = useRef(null)

  const onPointerMove = useCallback((ev) => {
    const target = targetRef.current
    if (!target) return
    const rc = ev.currentTarget.getBoundingClientRect()
    const nx = (ev.clientX - rc.left) / rc.width - 0.5
    const ny = (ev.clientY - rc.top) / rc.height - 0.5
    target.style.transform = `translate(${nx * strength}px, ${ny * strength}px) scale(${scale})`
  }, [strength, scale])

  const onPointerLeave = useCallback(() => {
    const target = targetRef.current
    if (target) target.style.transform = 'translate(0,0) scale(1)'
  }, [])

  return {
    targetRef,
    targetStyle: { transition: 'transform .4s cubic-bezier(.2,.7,.2,1)' },
    container: { onPointerMove, onPointerLeave },
  }
}
