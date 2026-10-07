import signature from '../assets/site/gold21.png'
import { useInView } from '../hooks/useInView'

/**
 * Same gold signature as the home hero (gold21.png), drawn on and brightened so it
 * reads over the portrait. Pointer-transparent so the frame's tilt handlers still
 * get the cursor. Parent must be `position: relative`.
 */
export default function SignatureOverlay() {
  const [ref, inView] = useInView({ rootMargin: '0px 0px -10% 0px' })
  return (
    <div
      className="rw-portrait-sign"
      style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '64px 24px 20px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        background: 'linear-gradient(to top, rgba(11,10,9,.72), rgba(11,10,9,0))',
        pointerEvents: 'none',
      }}
    >
      <span ref={ref} className={`rw-realty-signature-reveal${inView ? ' is-drawn' : ''}`}>
        <img className="rw-realty-signature" src={signature} alt="Rajiv Williams" />
      </span>
    </div>
  )
}
