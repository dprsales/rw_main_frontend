import { useRef } from 'react'

/** Inert by design - the hero/project image drift effect was removed. Kept as a no-op so call sites keep working. */
export function useParallax() {
  const targetRef = useRef(null)
  return { targetRef, targetStyle: undefined, container: {} }
}
