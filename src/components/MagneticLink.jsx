import { useMagnetic } from '../hooks/useMagnetic'

/** An <a> (or any element via `as`) that drifts toward the cursor on hover. */
export default function MagneticLink({ as: Tag = 'a', style, children, ...rest }) {
  const { ref, style: magStyle, ...handlers } = useMagnetic()
  return (
    <Tag ref={ref} {...handlers} style={{ ...magStyle, ...style }} {...rest}>
      {children}
    </Tag>
  )
}
