import signature from '../assets/site/gold22.png'

/** Gold signature over a portrait frame; pointer-transparent so frame's tilt handlers still get the cursor. */
export default function SignatureOverlay() {
  return (
    <div
      style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '64px 24px 20px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        background: 'linear-gradient(to top, rgba(11,10,9,.72), rgba(11,10,9,0))',
        pointerEvents: 'none',
      }}
    >
      <img src={signature} alt="Rajiv Williams" style={{ width: 'min(62%, 240px)', height: 'auto', display: 'block' }} />
    </div>
  )
}
