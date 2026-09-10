import lockup from '../assets/site/gold1.png'

/**
 * Full RW lockup (monogram over signature, brand gold) — the identity itself, never
 * flattened like partner logos. `size` is height in px; .rw-wordmark steps it down on mobile.
 */
export default function Wordmark({ size = 72 }) {
  return (
    <img
      src={lockup}
      alt="Rajiv Williams"
      className="rw-wordmark"
      style={{ height: size, width: 'auto', display: 'block' }}
    />
  )
}
