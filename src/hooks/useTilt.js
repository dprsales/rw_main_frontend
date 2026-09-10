import { useRef } from 'react'

/** Inert by design - the cursor-following 3D tilt on images was removed. Kept as a no-op so call sites keep working. */
export function useTilt() {
  const ref = useRef(null)
  return { ref, onPointerMove: undefined, onPointerLeave: undefined, style: undefined }
}
