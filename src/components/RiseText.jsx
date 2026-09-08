// Headline lines that slide up from behind a clipping mask on load. `block` stacks lines; otherwise they flow inline.
export default function RiseText({ lines, block = false, baseDelay = 0.13, step = 0.11 }) {
  let rank = 0 // line breaks don't take a turn in the stagger

  return lines.map((line, i) => {
    if (line.br) return <br key={`br-${i}`} />
    const delay = baseDelay + rank++ * step

    return (
      <span
        key={i}
        className="rw-rise-mask"
        style={{
          display: block ? 'block' : 'inline-block',
          overflow: 'hidden',
          verticalAlign: 'top',
          // Extra padding gives italic descenders room below the mask edge; negative margin keeps rhythm unchanged.
          paddingBottom: '.42em',
          marginBottom: '-.30em',
        }}
      >
        <span
          className={line.copper ? 'rw-rise-line rw-gold-text' : 'rw-rise-line'}
          style={{
            display: 'inline-block',
            // pre-wrap keeps the separating space but still lets long phrases wrap on narrow screens.
            whiteSpace: 'pre-wrap',
            transform: 'translateY(115%)',
            animation: `rw-rise .9s cubic-bezier(.16,.84,.28,1) ${delay}s both`,
            fontStyle: line.italic ? 'italic' : undefined,
          }}
        >
          {line.text}
        </span>
      </span>
    )
  })
}
