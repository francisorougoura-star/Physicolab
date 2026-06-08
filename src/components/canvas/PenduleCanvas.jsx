import React, { useRef, useEffect } from 'react'
import { rad, deg } from '../../utils/math.js'

export default function PenduleCanvas({ state, params }) {
  const ref = useRef()

  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')
    const W = c.width, H = c.height
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#0B1120'; ctx.fillRect(0, 0, W, H)

    const cx    = W / 2
    const cy    = 50
    const scale = Math.min((H - 80) / params.L, 130)
    const px    = cx + Math.sin(state.theta) * params.L * scale
    const py    = cy + Math.cos(state.theta) * params.L * scale

    // Arc guide
    ctx.strokeStyle = '#1E3A5F'; ctx.lineWidth = 1; ctx.setLineDash([2, 4])
    ctx.beginPath()
    ctx.arc(cx, cy, params.L * scale, -Math.PI / 2 - rad(params.theta0), -Math.PI / 2 + rad(params.theta0))
    ctx.stroke(); ctx.setLineDash([])

    // Support bar
    ctx.fillStyle = '#334155'; ctx.fillRect(cx - 40, cy - 12, 80, 10)

    // String
    ctx.strokeStyle = '#94A3B8'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke()

    // Pivot
    ctx.fillStyle = '#475569'
    ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = '#64748B'; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.stroke()

    // Bob
    const mg = ctx.createRadialGradient(px - 6, py - 6, 2, px, py, 20)
    mg.addColorStop(0, '#C4B5FD'); mg.addColorStop(1, '#6D28D9')
    ctx.beginPath(); ctx.arc(px, py, 20, 0, Math.PI * 2)
    ctx.fillStyle = mg; ctx.fill()
    ctx.strokeStyle = '#A78BFA'; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.arc(px, py, 20, 0, Math.PI * 2); ctx.stroke()

    // Velocity arc arrow
    if (Math.abs(state.omega) > 0.05) {
      const r = params.L * scale
      const dir = Math.sign(state.omega)
      ctx.strokeStyle = '#34D399'; ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(cx, cy, r + 12, state.theta - Math.PI / 2 - dir * 0.3, state.theta - Math.PI / 2 + dir * 0.3)
      ctx.stroke()
    }

    // HUD
    ctx.fillStyle = '#94A3B8'; ctx.font = '11px monospace'
    ctx.fillText(`θ = ${deg(state.theta).toFixed(1)}°`, 8, 18)
    ctx.fillText(`ω = ${state.omega.toFixed(2)} rad/s`, 8, 34)
    ctx.fillText(`t = ${state.t.toFixed(2)} s`, 8, 50)
  }, [state, params])

  return (
    <canvas
      ref={ref} width={300} height={360}
      style={{ borderRadius: 10, background: '#0B1120', width: '100%' }}
    />
  )
}
