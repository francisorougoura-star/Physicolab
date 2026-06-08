import React, { useRef, useEffect } from 'react'

export default function CircuitCanvas({ state, params }) {
  const ref = useRef()

  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')
    const W = c.width, H = c.height
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#0B1120'; ctx.fillRect(0, 0, W, H)

    const pad = 50, lw = 3
    const left = pad, right = W - pad, top = pad, bottom = H - pad
    const midX = W / 2, midY = H / 2

    // Draw circuit wires
    const norm = Math.min(1, Math.abs(state.I) / Math.max(params.V0 / params.R, 0.001))
    const wireColor = state.I > 0.0001 ? `rgba(52,211,153,${0.3 + 0.7 * norm})` : '#1E293B'

    ctx.strokeStyle = wireColor; ctx.lineWidth = lw + 1
    ctx.beginPath()
    ctx.moveTo(left, top); ctx.lineTo(right, top)
    ctx.lineTo(right, bottom); ctx.lineTo(left, bottom); ctx.lineTo(left, top)
    ctx.stroke()

    // Animated current dashes
    if (state.I > 0.0001) {
      const dashOff = -(state.t * 80 % 24)
      ctx.strokeStyle = `rgba(52,211,153,${0.6 + 0.4 * norm})`
      ctx.lineWidth = lw; ctx.setLineDash([12, 12]); ctx.lineDashOffset = dashOff
      ctx.beginPath()
      ctx.moveTo(left, top); ctx.lineTo(right, top)
      ctx.lineTo(right, bottom); ctx.lineTo(left, bottom); ctx.lineTo(left, top)
      ctx.stroke(); ctx.setLineDash([])
    }

    // Component: Resistor (top)
    const rX = midX - 30, rY = top - 12
    ctx.fillStyle = '#FBBF24'; ctx.strokeStyle = '#D97706'; ctx.lineWidth = 1.5
    ctx.fillRect(rX, rY, 60, 14); ctx.strokeRect(rX, rY, 60, 14)
    ctx.fillStyle = '#292524'; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center'
    ctx.fillText(`R=${params.R}Ω`, midX, rY + 10)

    // Voltage source (left)
    const srcX = left - 18, srcY = midY - 20
    ctx.fillStyle = '#3B82F6'; ctx.strokeStyle = '#1D4ED8'; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.arc(left, midY, 20, 0, Math.PI * 2)
    ctx.fillStyle = '#0F172A'; ctx.fill()
    ctx.strokeStyle = '#3B82F6'; ctx.lineWidth = 2; ctx.stroke()
    ctx.fillStyle = '#60A5FA'; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center'
    ctx.fillText('+', left - 7, midY + 4)
    ctx.fillText('–', left + 7, midY + 4)
    ctx.fillStyle = '#94A3B8'; ctx.font = '10px monospace'
    ctx.fillText(`${params.V0}V`, left, midY + 34)

    // Capacitor or Inductor (bottom / right)
    if (params.regime !== 'RL') {
      // Capacitor (bottom)
      ctx.strokeStyle = '#A78BFA'; ctx.lineWidth = 2.5
      const cy = bottom
      ctx.beginPath(); ctx.moveTo(midX - 18, cy); ctx.lineTo(midX + 18, cy); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(midX - 18, cy + 7); ctx.lineTo(midX + 18, cy + 7); ctx.stroke()
      ctx.fillStyle = '#7C3AED'; ctx.font = '10px monospace'; ctx.textAlign = 'center'
      ctx.fillText(`C=${params.C}F`, midX, bottom + 22)
    }
    if (params.regime !== 'RC') {
      // Inductor (right)
      const ix = right, iy = midY
      ctx.strokeStyle = '#F472B6'; ctx.lineWidth = 2
      for (let i = 0; i < 4; i++) {
        ctx.beginPath()
        ctx.arc(ix + 6, iy - 20 + i * 12, 6, Math.PI, 0)
        ctx.stroke()
      }
      ctx.fillStyle = '#BE185D'; ctx.font = '10px monospace'; ctx.textAlign = 'left'
      ctx.fillText(`L=${params.L}H`, ix + 14, iy + 4)
    }

    // Values
    ctx.textAlign = 'left'
    ctx.fillStyle = '#60A5FA'; ctx.font = '12px monospace'
    ctx.fillText(`Vc = ${state.Vc.toFixed(3)} V`, 8, 18)
    ctx.fillStyle = '#34D399'
    ctx.fillText(`I  = ${state.I.toFixed(4)} A`, 8, 34)
    ctx.fillStyle = '#FBBF24'
    ctx.fillText(`t  = ${state.t.toFixed(3)} s`, 8, 50)
  }, [state, params])

  return (
    <canvas
      ref={ref} width={280} height={250}
      style={{ borderRadius: 10, background: '#0B1120', width: '100%' }}
    />
  )
}
