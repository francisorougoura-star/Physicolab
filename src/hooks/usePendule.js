import { useState, useEffect, useCallback, useRef } from 'react'
import useSimLoop from './useSimLoop.js'
import { MAX_PTS } from '../utils/constants.js'
import { rad, deg } from '../utils/math.js'

export default function usePendule({ L, masse, theta0, g, b, speed }) {
  const [state,   setState]   = useState({ theta: rad(theta0), omega: 0, t: 0, running: false })
  const [history, setHistory] = useState([])
  const [metrics, setMetrics] = useState({ periode: 0, ampli: Math.abs(rad(theta0)), eDiss: 0 })
  const crossRef = useRef({ lastSign: null, lastT: null })

  const reset = useCallback(() => {
    setState({ theta: rad(theta0), omega: 0, t: 0, running: false })
    setHistory([])
    setMetrics({ periode: 0, ampli: Math.abs(rad(theta0)), eDiss: 0 })
    crossRef.current = { lastSign: null, lastT: null }
  }, [theta0])

  useEffect(() => { reset() }, [theta0, L, masse, g, b, reset])

  const step = useCallback((dt) => {
    setState(prev => {
      // Euler-Cromer (energy-conserving for oscillators)
      const alpha = -(g / L) * Math.sin(prev.theta) - b * prev.omega
      const omega = prev.omega + alpha * dt
      const theta = prev.theta + omega * dt
      const t     = prev.t + dt
      const ek    = 0.5 * masse * (L * omega) ** 2
      const ep    = masse * g * L * (1 - Math.cos(theta))

      // Période: detect zero-crossing descending
      const sign = Math.sign(theta)
      if (crossRef.current.lastSign !== null && sign !== crossRef.current.lastSign && crossRef.current.lastSign === 1) {
        if (crossRef.current.lastT !== null) {
          setMetrics(m => ({ ...m, periode: +(2 * (t - crossRef.current.lastT)).toFixed(3) }))
        }
        crossRef.current.lastT = t
      }
      crossRef.current.lastSign = sign

      setMetrics(m => ({
        ...m,
        ampli: Math.max(m.ampli, Math.abs(theta)),
        eDiss: m.eDiss + b * omega * omega * dt,
      }))
      setHistory(h => {
        const pt = { t: +t.toFixed(3), theta: +deg(theta).toFixed(2), omega: +omega.toFixed(3), ek: +ek.toFixed(3), ep: +ep.toFixed(3) }
        const next = [...h, pt]
        return next.length > MAX_PTS ? next.slice(-MAX_PTS) : next
      })
      return { theta, omega, t, running: true }
    })
  }, [g, L, masse, b])

  useSimLoop(state.running, speed, step)

  return {
    state, history, metrics,
    start: () => setState(p => ({ ...p, running: true })),
    pause: () => setState(p => ({ ...p, running: false })),
    reset,
  }
}
