import { useState, useEffect, useCallback } from 'react'
import useSimLoop from './useSimLoop.js'
import { MAX_PTS } from '../utils/constants.js'

export default function useCircuit({ R, L, C, V0, regime, speed }) {
  const [state,   setState]   = useState({ t: 0, Vc: 0, I: 0, running: false })
  const [history, setHistory] = useState([])
  const [metrics, setMetrics] = useState({ tau: 0, Imax: 0, regime_type: '' })

  const reset = useCallback(() => {
    const tau  = regime === 'RC' ? R * C : regime === 'RL' ? L / R : Math.sqrt(L * C)
    let rtype  = ''
    if (regime === 'RLC') {
      const alpha  = R / (2 * L)
      const omega0 = 1 / Math.sqrt(L * C)
      rtype = alpha > omega0 ? 'Sur-amorti' : alpha < omega0 ? 'Sous-amorti' : 'Critique'
    }
    setState({ t: 0, Vc: 0, I: 0, running: false })
    setHistory([])
    setMetrics({ tau: +tau.toFixed(4), Imax: 0, regime_type: rtype })
  }, [R, L, C, V0, regime])

  useEffect(() => { reset() }, [R, L, C, V0, regime, reset])

  const step = useCallback((dt) => {
    setState(prev => {
      let Vc = prev.Vc, I = prev.I

      if (regime === 'RC') {
        Vc = prev.Vc + (V0 - prev.Vc) / (R * C) * dt
        I  = (V0 - Vc) / R
      } else if (regime === 'RL') {
        I  = prev.I + (V0 - R * prev.I) / L * dt
        Vc = R * I
      } else {
        // Runge-Kutta 4 for RLC
        const f1 = (vc, i) => i / C
        const f2 = (vc, i) => (V0 - vc - R * i) / L
        const k1v = f1(prev.Vc, prev.I) * dt, k1i = f2(prev.Vc, prev.I) * dt
        const k2v = f1(prev.Vc + k1v/2, prev.I + k1i/2) * dt, k2i = f2(prev.Vc + k1v/2, prev.I + k1i/2) * dt
        const k3v = f1(prev.Vc + k2v/2, prev.I + k2i/2) * dt, k3i = f2(prev.Vc + k2v/2, prev.I + k2i/2) * dt
        const k4v = f1(prev.Vc + k3v,   prev.I + k3i)   * dt, k4i = f2(prev.Vc + k3v,   prev.I + k3i)   * dt
        Vc = prev.Vc + (k1v + 2*k2v + 2*k3v + k4v) / 6
        I  = prev.I  + (k1i + 2*k2i + 2*k3i + k4i) / 6
      }

      const t  = prev.t + dt
      const P  = V0 * I
      const Ec = 0.5 * C * Vc * Vc
      const EL = 0.5 * L * I * I

      setHistory(h => {
        const pt = { t: +t.toFixed(4), Vc: +Vc.toFixed(4), I: +I.toFixed(5), P: +P.toFixed(4), Ec: +Ec.toFixed(6), EL: +EL.toFixed(6) }
        const next = [...h, pt]
        return next.length > MAX_PTS ? next.slice(-MAX_PTS) : next
      })
      setMetrics(m => ({ ...m, Imax: Math.max(m.Imax, Math.abs(I)) }))
      return { t, Vc, I, running: true }
    })
  }, [R, L, C, V0, regime])

  useSimLoop(state.running, speed, step)

  return {
    state, history, metrics,
    start: () => setState(p => ({ ...p, running: true })),
    pause: () => setState(p => ({ ...p, running: false })),
    reset,
  }
}
