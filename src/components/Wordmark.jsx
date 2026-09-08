import lockup from '../assets/site/gold1.png'

/** Full RW lockup (monogram over signature) in brand gold. `size` is rendered height in px. */
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
