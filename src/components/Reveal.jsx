import { useInView } from '../hooks/useInView'

const EASE = 'cubic-bezier(.2,.75,.25,1)'

/** Fade-and-lift style object, exported for sections sharing one `useInView` observer across children. */
export function revealStyle(inView, delay = 0) {
  return {
    opacity: inView ? 1 : 0,
    transform: inView ? 'none' : 'translateY(34px) scale(.986)',
    transition: `opacity .9s ${EASE} ${delay}ms, transform .9s ${EASE} ${delay}ms`,
  }
}

/** Fades + lifts children into view once. `delay` (ms) staggers list items, e.g. `base + i * 90`. */
export default function Reveal({ as: Tag = 'div', delay = 0, style, children, ...rest }) {
  const [ref, inView] = useInView()

  return (
    <Tag ref={ref} style={{ ...revealStyle(inView, delay), ...style }} {...rest}>
      {children}
    </Tag>
  )
}
