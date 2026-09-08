import { useRef } from 'react'

/** Inert by design: the 3D tilt effect was removed; kept as a no-op so existing call sites still work. */
export function useTilt() {
  const ref = useRef(null)
  return { ref, onPointerMove: undefined, onPointerLeave: undefined, style: undefined }
}
