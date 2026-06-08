import { useState, useEffect, useCallback } from 'react'
import useSimLoop from './useSimLoop.js'
import { MAX_PTS } from '../utils/constants.js'

export default function useChaleur({ k, L, nx, T_left, T_right, T0, speed }) {
  const dx     = L / (nx - 1)
  const alpha  = k
  const dt_max = 0.4 * dx * dx / alpha   // CFL stability condition

  const makeInitial = () => {
    const T = Array.from({ length: nx }, () => T0)
    T[0]      = T_left
    T[nx - 1] = T_right
    return T
  }

  const [state,   setState]   = useState(() => ({ T: makeInitial(), t: 0, running: false }))
  const [history, setHistory] = useState([])
  const [metrics, setMetrics] = useState({ Tmax: Math.max(T_left, T_right), Tmin: Math.min(T_left, T_right), stable: false })

  const reset = useCallback(() => {
    setState({ T: makeInitial(), t: 0, running: false })
    setHistory([])
    setMetrics({ Tmax: Math.max(T_left, T_right), Tmin: Math.min(T_left, T_right), stable: false })
  }, [nx, T_left, T_right, T0, k, L])

  useEffect(() => { reset() }, [nx, T_left, T_right, T0, k, L, reset])

  const step = useCallback((dt_raw) => {
    setState(prev => {
      const steps = Math.max(1, Math.ceil(dt_raw / dt_max))
      const dt    = dt_raw / steps
      let T = [...prev.T]

      for (let s = 0; s < steps; s++) {
        const Tnew = [...T]
        for (let i = 1; i < nx - 1; i++) {
          Tnew[i] = T[i] + alpha * dt / (dx * dx) * (T[i+1] - 2*T[i] + T[i-1])
        }
        Tnew[0]      = T_left
        Tnew[nx - 1] = T_right
        T = Tnew
      }

      const t    = prev.t + dt_raw
      const mid  = T[Math.floor(nx / 2)]
      const Tmax = Math.max(...T)
      const Tmin = Math.min(...T)
      const stable = Math.abs(Tmax - Tmin) < 2 && t > 1

      setHistory(h => {
        const pt = { t: +t.toFixed(3), Tmid: +mid.toFixed(2), Tmax: +Tmax.toFixed(2), Tmin: +Tmin.toFixed(2) }
        const next = [...h, pt]
        return next.length > MAX_PTS ? next.slice(-MAX_PTS) : next
      })
      setMetrics({ Tmax: +Tmax.toFixed(1), Tmin: +Tmin.toFixed(1), stable })
      return { T, t, running: true }
    })
  }, [alpha, dx, nx, T_left, T_right, dt_max])

  useSimLoop(state.running, speed, step)

  return {
    state, history, metrics,
    start: () => setState(p => ({ ...p, running: true })),
    pause: () => setState(p => ({ ...p, running: false })),
    reset,
  }
}
