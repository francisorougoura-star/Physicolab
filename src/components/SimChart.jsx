import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Tooltip, Legend, Filler,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: {
    legend: { labels: { color: '#94A3B8', font: { size: 11 }, boxWidth: 12 } },
    title:  { display: false },
  },
  scales: {
    x: {
      ticks: { color: '#64748B', maxTicksLimit: 6, font: { size: 10 } },
      grid:  { color: '#1E293B' },
    },
    y: {
      ticks: { color: '#64748B', font: { size: 10 } },
      grid:  { color: '#1E293B' },
    },
  },
}

export default function SimChart({ history, series }) {
  const labels   = history.map(p => p.t.toFixed(2))
  const datasets = series.map(s => ({
    label:           s.label,
    data:            history.map(p => p[s.key]),
    borderColor:     s.color,
    backgroundColor: s.color + '18',
    borderWidth:     1.5,
    pointRadius:     0,
    tension:         0.3,
    fill:            false,
  }))

  return (
    <div style={{ background: '#0F172A', borderRadius: 8, padding: '8px 8px 4px', height: 190 }}>
      <Line data={{ labels, datasets }} options={CHART_OPTIONS} />
    </div>
  )
}
