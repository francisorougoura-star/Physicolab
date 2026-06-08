import React, { useRef, useEffect } from 'react'
import { rad } from '../../utils/math.js'

export default function NewtonCanvas({ state, params }) {
  const ref = useRef()

  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')
    const W = c.width, H = c.height
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#0B1120'; ctx.fillRect(0, 0, W, H)

    const groundY = H - 40

    // Inclined plane
    if (params.scenario === 'plan') {
      const a = rad(params.angle_plan)
      ctx.save(); ctx.translate(10, groundY)
      ctx.fillStyle = '#1E293B'
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W - 20, 0)
      ctx.lineTo(W - 20, -(W - 20) * Math.tan(a)); ctx.closePath(); ctx.fill()
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 1; ctx.stroke()
      ctx.restore()
    } else {
      // Flat ground
      ctx.fillStyle = '#1E293B'; ctx.fillRect(0, groundY, W, 40)
      ctx.fillStyle = '#334155'
      for (let x = 0; x < W; x += 20) ctx.fillRect(x, groundY, 10, 4)
    }

    // Block position (looping)
    const xPx = 30 + ((state.x * 15) % (W - 80) + (W - 80)) % (W - 80)
    const yBase = params.scenario === 'plan'
      ? groundY - (xPx - 10) * Math.tan(rad(params.angle_plan))
      : groundY

    ctx.fillStyle = '#1D4ED8'
    ctx.fillRect(xPx - 22, yBase - 40, 44, 40)
    ctx.strokeStyle = '#3B82F6'; ctx.lineWidth = 2
    ctx.strokeRect(xPx - 22, yBase - 40, 44, 40)
    // Mass label
    ctx.fillStyle = '#93C5FD'; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center'
    ctx.fillText(`${params.masse}kg`, xPx, yBase - 16)
    ctx.textAlign = 'left'

    // Normal force (green, upward)
    ctx.strokeStyle = '#10B981'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(xPx, yBase - 40); ctx.lineTo(xPx, yBase - 75); ctx.stroke()
    ctx.fillStyle = '#10B981'
    ctx.beginPath(); ctx.moveTo(xPx, yBase - 80); ctx.lineTo(xPx - 5, yBase - 72); ctx.lineTo(xPx + 5, yBase - 72); ctx.fill()
    ctx.font = '10px monospace'; ctx.fillText('N', xPx + 6, yBase - 70)

    // Applied force (yellow, horizontal)
    if (Math.abs(params.force) > 0) {
      const fScale  = Math.min(Math.abs(params.force) * 0.6, 60) * Math.sign(params.force)
      const arrowX  = xPx + 22
      ctx.strokeStyle = '#FBBF24'; ctx.lineWidth = 2.5
      ctx.beginPath(); ctx.moveTo(arrowX, yBase - 20); ctx.lineTo(arrowX + fScale, yBase - 20); ctx.stroke()
      ctx.fillStyle = '#FBBF24'
      ctx.beginPath()
      const d = fScale > 0 ? 1 : -1
      ctx.moveTo(arrowX + fScale + d * 9, yBase - 20)
      ctx.lineTo(arrowX + fScale, yBase - 26)
      ctx.lineTo(arrowX + fScale, yBase - 14)
      ctx.closePath(); ctx.fill()
      ctx.font = '10px monospace'; ctx.fillText('F', arrowX + fScale / 2 - 3, yBase - 24)
    }

    // Gravity (red, downward)
    ctx.strokeStyle = '#EF4444'; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(xPx, yBase); ctx.lineTo(xPx, yBase + 28); ctx.stroke()
    ctx.fillStyle = '#EF4444'
    ctx.beginPath(); ctx.moveTo(xPx, yBase + 33); ctx.lineTo(xPx - 4, yBase + 25); ctx.lineTo(xPx + 4, yBase + 25); ctx.fill()
    ctx.font = '10px monospace'; ctx.fillText('g', xPx + 5, yBase + 24)

    // HUD
    ctx.fillStyle = '#94A3B8'; ctx.font = '11px monospace'; ctx.textAlign = 'left'
    ctx.fillText(`a = ${state.a.toFixed(2)} m/s²`, 8, 18)
    ctx.fillText(`v = ${state.v.toFixed(2)} m/s`, 8, 34)
    ctx.fillText(`x = ${state.x.toFixed(1)} m`, 8, 50)
  }, [state, params])

  return (
    <canvas
      ref={ref} width={320} height={240}
      style={{ borderRadius: 10, background: '#0B1120', width: '100%' }}
    />
  )
}
