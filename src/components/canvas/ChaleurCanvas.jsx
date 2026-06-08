import React, { useRef, useEffect } from 'react'

export default function ChaleurCanvas({ state }) {
  const ref = useRef()

  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')
    const W = c.width, H = c.height
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#0B1120'; ctx.fillRect(0, 0, W, H)

    const T = state.T
    if (!T || T.length === 0) return

    const Tmin = Math.min(...T) - 1
    const Tmax = Math.max(...T) + 1
    const range = Tmax - Tmin || 1
    const barH  = 55, barY = H / 2 - barH / 2
    const bw    = W - 60, bx = 30

    // Color bar
    T.forEach((t, i) => {
      const x    = bx + (i / (T.length - 1)) * bw
      const norm = (t - Tmin) / range
      const r    = Math.floor(30  + norm * 220)
      const g    = Math.floor(norm < 0.5 ? norm * 80 : (1 - norm) * 80)
      const b    = Math.floor(220 - norm * 200)
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.fillRect(x - 1, barY, bw / T.length + 2, barH)
    })
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.5
    ctx.strokeRect(bx, barY, bw, barH)

    // T(x) profile
    const profileH = 90, profileY = barY - profileH - 18
    // Axes
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(bx, profileY); ctx.lineTo(bx, profileY + profileH); ctx.lineTo(bx + bw, profileY + profileH); ctx.stroke()

    ctx.strokeStyle = '#FB923C'; ctx.lineWidth = 2.5
    ctx.beginPath()
    T.forEach((t, i) => {
      const x = bx + (i / (T.length - 1)) * bw
      const y = profileY + profileH - ((t - Tmin) / range) * profileH
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.stroke()

    // Temperature axis labels
    ctx.fillStyle = '#94A3B8'; ctx.font = '10px monospace'; ctx.textAlign = 'right'
    ctx.fillText(`${Tmax.toFixed(0)}°C`, bx - 3, profileY + 6)
    ctx.fillText(`${Tmin.toFixed(0)}°C`, bx - 3, profileY + profileH)
    ctx.textAlign = 'center'
    ctx.fillStyle = '#60A5FA'
    ctx.fillText(`${T[0].toFixed(1)}°C`, bx, barY + barH + 14)
    ctx.fillStyle = '#EF4444'
    ctx.fillText(`${T[T.length - 1].toFixed(1)}°C`, bx + bw, barY + barH + 14)

    // HUD
    ctx.textAlign = 'left'
    ctx.fillStyle = '#94A3B8'; ctx.font = '11px monospace'
    ctx.fillText(`t = ${state.t.toFixed(2)} s`, 8, 18)
    ctx.fillText(`T(L/2) = ${T[Math.floor(T.length / 2)].toFixed(1)}°C`, 8, 34)
  }, [state])

  return (
    <canvas
      ref={ref} width={310} height={260}
      style={{ borderRadius: 10, background: '#0B1120', width: '100%' }}
    />
  )
}
