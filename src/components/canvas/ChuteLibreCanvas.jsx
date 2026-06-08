import React, { useRef, useEffect } from 'react'

export default function ChuteLibreCanvas({ state, params }) {
  const ref = useRef()

  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')
    const W = c.width, H = c.height
    ctx.clearRect(0, 0, W, H)

    // Background
    ctx.fillStyle = '#0B1120'; ctx.fillRect(0, 0, W, H)

    // Grid lines
    ctx.strokeStyle = '#0F172A'; ctx.lineWidth = 1
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

    // Ground
    ctx.fillStyle = '#1E293B'; ctx.fillRect(0, H - 24, W, 24)
    ctx.fillStyle = '#334155'
    for (let x = 0; x < W; x += 18) ctx.fillRect(x, H - 24, 10, 4)

    // Height scale
    ctx.strokeStyle = '#1E3A5F'; ctx.lineWidth = 1; ctx.setLineDash([3, 4])
    ctx.beginPath(); ctx.moveTo(W - 20, 20); ctx.lineTo(W - 20, H - 24); ctx.stroke()
    ctx.setLineDash([])

    // Ball position
    const yPx = (H - 24) - (state.y / params.h0) * (H - 60)
    const grad = ctx.createRadialGradient(W / 2 - 6, yPx - 6, 2, W / 2, yPx, 18)
    grad.addColorStop(0, '#93C5FD')
    grad.addColorStop(1, '#1D4ED8')
    ctx.beginPath(); ctx.arc(W / 2, yPx, 18, 0, Math.PI * 2)
    ctx.fillStyle = grad; ctx.fill()
    // Outline
    ctx.strokeStyle = '#60A5FA'; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.arc(W / 2, yPx, 18, 0, Math.PI * 2); ctx.stroke()

    // Velocity arrow
    if (state.v > 0.5) {
      const arrowLen = Math.min(state.v * 3, 65)
      ctx.strokeStyle = '#34D399'; ctx.lineWidth = 2.5
      ctx.beginPath(); ctx.moveTo(W / 2, yPx + 20); ctx.lineTo(W / 2, yPx + 20 + arrowLen); ctx.stroke()
      ctx.fillStyle = '#34D399'
      ctx.beginPath()
      ctx.moveTo(W / 2, yPx + 20 + arrowLen + 9)
      ctx.lineTo(W / 2 - 6, yPx + 20 + arrowLen)
      ctx.lineTo(W / 2 + 6, yPx + 20 + arrowLen)
      ctx.closePath(); ctx.fill()
    }

    // Labels
    ctx.fillStyle = '#94A3B8'; ctx.font = '11px monospace'
    ctx.fillText(`y = ${state.y.toFixed(2)} m`, 10, 18)
    ctx.fillText(`v = ${state.v.toFixed(2)} m/s`, 10, 34)
    ctx.fillText(`t = ${state.t.toFixed(2)} s`, 10, 50)
  }, [state, params])

  return (
    <canvas
      ref={ref} width={300} height={340}
      style={{ borderRadius: 10, background: '#0B1120', width: '100%' }}
    />
  )
}
