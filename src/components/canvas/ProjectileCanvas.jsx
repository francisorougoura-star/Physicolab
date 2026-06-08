import React, { useRef, useEffect } from 'react'
import { rad } from '../../utils/math.js'

export default function ProjectileCanvas({ state, history, params }) {
  const ref = useRef()

  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')
    const W = c.width, H = c.height
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#0B1120'; ctx.fillRect(0, 0, W, H)

    // Ground
    ctx.fillStyle = '#1E293B'; ctx.fillRect(0, H - 24, W, 24)

    const maxX = Math.max(params.v0 * params.v0 / params.g * 1.2, 10)
    const maxY = Math.max(params.h0 + (params.v0 * Math.sin(rad(params.angle))) ** 2 / (2 * params.g) + 5, 10)
    const toX  = x => 20 + (x / maxX) * (W - 40)
    const toY  = y => (H - 24) - (y / maxY) * (H - 44)

    // Theoretical trajectory (dotted)
    ctx.strokeStyle = '#1E3A5F'; ctx.lineWidth = 1; ctx.setLineDash([2, 4])
    ctx.beginPath()
    const vx0 = params.v0 * Math.cos(rad(params.angle))
    const vy0 = params.v0 * Math.sin(rad(params.angle))
    for (let i = 0; i <= 60; i++) {
      const t  = i / 60 * (2 * vy0 / params.g + 1)
      const xi = vx0 * t
      const yi = Math.max(0, params.h0 + vy0 * t - 0.5 * params.g * t * t)
      i === 0 ? ctx.moveTo(toX(xi), toY(yi)) : ctx.lineTo(toX(xi), toY(yi))
      if (yi === 0 && i > 0) break
    }
    ctx.stroke(); ctx.setLineDash([])

    // Actual trail
    if (history.length > 1) {
      ctx.strokeStyle = '#3B82F6'; ctx.lineWidth = 2
      ctx.beginPath()
      history.forEach((p, i) => i === 0 ? ctx.moveTo(toX(p.x), toY(p.y)) : ctx.lineTo(toX(p.x), toY(p.y)))
      ctx.stroke()
    }

    // Ball
    const px = toX(state.x), py = toY(state.y)
    const g2 = ctx.createRadialGradient(px - 4, py - 4, 2, px, py, 13)
    g2.addColorStop(0, '#FDE68A'); g2.addColorStop(1, '#D97706')
    ctx.beginPath(); ctx.arc(px, py, 13, 0, Math.PI * 2)
    ctx.fillStyle = g2; ctx.fill()
    ctx.strokeStyle = '#FBBF24'; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.arc(px, py, 13, 0, Math.PI * 2); ctx.stroke()

    // Velocity vector
    const scale = 18 / Math.max(params.v0, 1)
    const vx = state.vx * scale, vy = -state.vy * scale
    if (Math.abs(vx) + Math.abs(vy) > 1) {
      ctx.strokeStyle = '#34D399'; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + vx, py + vy); ctx.stroke()
      // arrowhead
      const angle = Math.atan2(vy, vx)
      ctx.fillStyle = '#34D399'
      ctx.beginPath()
      ctx.moveTo(px + vx, py + vy)
      ctx.lineTo(px + vx - 8 * Math.cos(angle - 0.4), py + vy - 8 * Math.sin(angle - 0.4))
      ctx.lineTo(px + vx - 8 * Math.cos(angle + 0.4), py + vy - 8 * Math.sin(angle + 0.4))
      ctx.closePath(); ctx.fill()
    }

    // HUD
    ctx.fillStyle = '#94A3B8'; ctx.font = '11px monospace'
    ctx.fillText(`x = ${state.x.toFixed(1)} m`, 8, 18)
    ctx.fillText(`y = ${state.y.toFixed(1)} m`, 8, 34)
  }, [state, history, params])

  return (
    <canvas
      ref={ref} width={360} height={290}
      style={{ borderRadius: 10, background: '#0B1120', width: '100%' }}
    />
  )
}
