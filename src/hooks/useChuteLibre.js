import { useState, useEffect, useCallback } from 'react'
import useSimLoop from './useSimLoop.js'
import { MAX_PTS } from '../utils/constants.js'

export default function useChuteLibre({ h0, masse, g, speed }) {
  const [state,   setState]   = useState({ y: h0, v: 0, t: 0, running: false })
  const [history, setHistory] = useState([])
  const [metrics, setMetrics] = useState({ vMax: 0, tChute: 0, vImpact: 0 })

  const reset = useCallback(() => {
    setState({ y: h0, v: 0, t: 0, running: false })
    setHistory([])
    setMetrics({ vMax: 0, tChute: 0, vImpact: 0 })
  }, [h0])

  useEffect(() => { reset() }, [h0, masse, g, reset])

  const step = useCallback((dt) => {
    setState(prev => {
      // Si déjà au sol, on arrête la simulation
      if (prev.y <= 0) {
        return prev
      }
      
      const v   = prev.v + g * dt
      const y   = Math.max(0, prev.y - v * dt)
      const t   = prev.t + dt
      const ek  = 0.5 * masse * v * v
      const ep  = masse * g * y
      
      // Vérifie si on vient de toucher le sol
      const isImpact = y <= 0
      
      setHistory(h => {
        const pt = { t: +t.toFixed(3), y: +y.toFixed(3), v: +v.toFixed(3), ek: +ek.toFixed(2), ep: +ep.toFixed(2), emec: +(ek + ep).toFixed(2) }
        const next = [...h, pt]
        return next.length > MAX_PTS ? next.slice(-MAX_PTS) : next
      })
      
      setMetrics(m => ({
        ...m,
        vMax:    Math.max(m.vMax, v),
        vImpact: isImpact ? v : m.vImpact,
        tChute:  isImpact ? t : m.tChute,
      }))
      
      // Arrête automatiquement quand hauteur = 0
      return { y, v, t, running: !isImpact }
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
