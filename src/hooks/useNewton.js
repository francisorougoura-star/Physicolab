import { useState, useEffect, useCallback } from 'react'
import useSimLoop from './useSimLoop.js'
import { MAX_PTS } from '../utils/constants.js'
import { rad } from '../utils/math.js'

const G = 9.81

export default function useNewton({ scenario, masse, force, mu_k, mu_s, angle_plan, speed }) {
  const [state,   setState]   = useState({ x: 0, v: 0, a: 0, t: 0, running: false, isStatic: true })
  const [history, setHistory] = useState([])
  const [metrics, setMetrics] = useState({ vMax: 0, xMax: 0, eDiss: 0 })

  const reset = useCallback(() => {
    setState({ x: 0, v: 0, a: 0, t: 0, running: false, isStatic: true })
    setHistory([])
    setMetrics({ vMax: 0, xMax: 0, eDiss: 0 })
  }, [scenario, masse, force, mu_k, mu_s, angle_plan])

  useEffect(() => { reset() }, [scenario, masse, force, mu_k, mu_s, angle_plan, reset])

  const step = useCallback((dt) => {
    setState(prev => {
      const N       = masse * G * (scenario === 'plan' ? Math.cos(rad(angle_plan)) : 1)
      const fGrav   = scenario === 'plan' ? masse * G * Math.sin(rad(angle_plan)) : 0
      const fNet    = (scenario === 'fma' || scenario === 'plan') ? (force + fGrav) : force
      const fStatic = mu_s * N
      const fKinet  = mu_k * N

      let a = 0, friction = 0, nextStatic = prev.isStatic

      if (prev.isStatic) {
        if (Math.abs(fNet) > fStatic) {
          nextStatic = false
          friction   = -Math.sign(fNet) * fKinet
          a          = (fNet + friction) / masse
        }
      } else {
        friction = prev.v !== 0 ? -Math.sign(prev.v) * fKinet : 0
        a        = (fNet + friction) / masse
      }

      const v = prev.v + a * dt
      const x = prev.x + v * dt
      const t = prev.t + dt

      setHistory(h => {
        const pt = { t: +t.toFixed(3), x: +x.toFixed(3), v: +v.toFixed(3), a: +a.toFixed(3), friction: +Math.abs(friction).toFixed(2) }
        const next = [...h, pt]
        return next.length > MAX_PTS ? next.slice(-MAX_PTS) : next
      })
      setMetrics(m => ({
        vMax:  Math.max(m.vMax, Math.abs(v)),
        xMax:  Math.max(m.xMax, Math.abs(x)),
        eDiss: m.eDiss + Math.abs(friction) * Math.abs(v) * dt,
      }))
      return { x, v, a, t, running: true, isStatic: nextStatic }
    })
  }, [scenario, masse, force, mu_k, mu_s, angle_plan])

  useSimLoop(state.running, speed, step)

  return {
    state, history, metrics,
    start: () => setState(p => ({ ...p, running: true })),
    pause: () => setState(p => ({ ...p, running: false })),
    reset,
  }
}
