import { useState, useEffect, useCallback } from 'react'
import useSimLoop from './useSimLoop.js'
import { MAX_PTS } from '../utils/constants.js'
import { rad } from '../utils/math.js'

export default function useProjectile({ v0, angle, h0, g, masse, speed }) {
  const [state,   setState]   = useState({ x: 0, y: h0, vx: v0 * Math.cos(rad(angle)), vy: v0 * Math.sin(rad(angle)), t: 0, running: false })
  const [history, setHistory] = useState([])
  const [metrics, setMetrics] = useState({ portee: 0, hMax: h0, tVol: 0 })

  const reset = useCallback(() => {
    setState({ x: 0, y: h0, vx: v0 * Math.cos(rad(angle)), vy: v0 * Math.sin(rad(angle)), t: 0, running: false })
    setHistory([])
    setMetrics({ portee: 0, hMax: h0, tVol: 0 })
  }, [v0, angle, h0])

  useEffect(() => { reset() }, [v0, angle, h0, g, masse, reset])

  const step = useCallback((dt) => {
    setState(prev => {
      if (prev.y <= 0 && prev.vy < 0) {
        setMetrics(m => ({ ...m, portee: prev.x, tVol: prev.t }))
        return { ...prev, running: false }
      }
      const vy  = prev.vy - g * dt
      const x   = prev.x + prev.vx * dt
      const y   = Math.max(0, prev.y + vy * dt)
      const t   = prev.t + dt
      const v   = Math.sqrt(prev.vx ** 2 + vy ** 2)
      const ek  = 0.5 * masse * v * v
      const ep  = masse * g * y
      setHistory(h => {
        const pt = { t: +t.toFixed(3), x: +x.toFixed(2), y: +y.toFixed(2), v: +v.toFixed(2), ek: +ek.toFixed(2), ep: +ep.toFixed(2) }
        const next = [...h, pt]
        return next.length > MAX_PTS ? next.slice(-MAX_PTS) : next
      })
      setMetrics(m => ({ ...m, hMax: Math.max(m.hMax, y) }))
      return { x, y, vx: prev.vx, vy, t, running: true }
    })
  }, [g, masse])

  useSimLoop(state.running, speed, step)

  return {
    state, history, metrics,
    start: () => setState(p => ({ ...p, running: true })),
    pause: () => setState(p => ({ ...p, running: false })),
    reset,
  }
}
