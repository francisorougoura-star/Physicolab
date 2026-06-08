import { useEffect, useRef } from 'react'

/**
 * Drives a simulation step function via requestAnimationFrame.
 * @param {boolean} enabled  - run loop when true
 * @param {number}  speed    - time multiplier (0.25 | 0.5 | 1 | 2)
 * @param {function} stepFn  - (dt: number) => void  — called each frame
 */
export default function useSimLoop(enabled, speed, stepFn) {
  const rafRef  = useRef(null)
  const lastRef = useRef(null)

  useEffect(() => {
    if (!enabled) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }

    const loop = (now) => {
      if (lastRef.current !== null) {
        const raw = (now - lastRef.current) / 1000
        const dt  = Math.min(raw, 0.05) * speed   // cap at 50 ms
        stepFn(dt)
      }
      lastRef.current = now
      rafRef.current  = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(rafRef.current)
      lastRef.current = null
    }
  }, [enabled, speed, stepFn])
}
