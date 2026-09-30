import { useCallback, useEffect, useRef, useState } from 'react'
import { Lottie } from 'lottie-react'
import successData from '../utils/Success.json'

/**
 * Thumbs-up receipt for the careers apply confirmation.
 *
 * Decorative: the submission is already confirmed by the heading and copy, so
 * the animation is hidden from assistive tech rather than given a label.
 *
 * Loops continuously, and replays from the first frame on hover or click so it
 * responds to the candidate poking at it. Click matters as much as hover —
 * touch devices never fire mouseenter, so without it the replay would be
 * unreachable on a phone, which is where most applications get filled in.
 *
 * With `prefers-reduced-motion: reduce` only the final frame is drawn and the
 * replay handlers return early, so the mark still reads as finished without
 * anything moving.
 *
 * Playback pauses while the tab is hidden. A permanently looping animation
 * otherwise keeps ticking in every background tab the candidate has open.
 *
 * The explicit width/height on <Lottie> are load-bearing: the animation fills
 * whatever box it is given and shows nothing in a box of no height, so sizing
 * only the wrapper around it leaves the player collapsed and invisible.
 *
 * Uses the full engine rather than the smaller `LottieLight` build. This file
 * is an After Effects export; it was checked for expressions and has none, so
 * LottieLight would work too — but the full build is the safer default for
 * future exports.
 */
export default function SuccessAnimation({ size = 132, className = '' }) {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  // lottie-react v3 takes this as a plain prop (there is no useLottieRef hook in
  // this version) and fills it with a LottieHandle: play/pause/stop/seek/setLoop.
  const lottieRef = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (reduced) return undefined
    const onVisibility = () => {
      const instance = lottieRef.current
      if (!instance) return
      if (document.hidden) instance.pause()
      else instance.play()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [reduced])

  // stop() rewinds to the first playable frame, so stop-then-play is the replay.
  // This handle has no goToAndPlay — v3 exposes seek()/play() instead.
  const replay = useCallback(() => {
    if (reduced) return
    const instance = lottieRef.current
    if (!instance) return
    instance.stop()
    instance.play()
  }, [reduced])

  return (
    <div
      className={`rw-success-anim ${className}`.trim()}
      onMouseEnter={replay}
      onClick={replay}
    >
      {reduced ? (
        <Lottie
          lottieRef={lottieRef}
          src={successData}
          loop={false}
          autoplay={false}
          segment={[100, 100]}
          style={{ width: size, height: size }}
          aria-hidden
        />
      ) : (
        <Lottie
          lottieRef={lottieRef}
          src={successData}
          loop
          autoplay
          style={{ width: size, height: size }}
          aria-hidden
        />
      )}
    </div>
  )
}
