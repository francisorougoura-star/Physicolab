export function downloadBlob(blob, filename) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

export function exportCSV(history, moduleName) {
  if (!history.length) return
  const keys = Object.keys(history[0])
  const rows = [keys.join(','), ...history.map(p => keys.map(k => p[k]).join(','))].join('\n')
  downloadBlob(new Blob([rows], { type: 'text/csv' }), `physicslab_${moduleName}_${Date.now()}.csv`)
}

export function exportJSON(module, params, metrics, history) {
  const data = JSON.stringify({ module, params, metrics, dataHistory: history }, null, 2)
  downloadBlob(new Blob([data], { type: 'application/json' }), `physicslab_${module}_${Date.now()}.json`)
}

export function exportCanvasPNG(canvasRef, moduleName) {
  if (!canvasRef?.current) return
  canvasRef.current.toBlob(blob => {
    downloadBlob(blob, `physicslab_${moduleName}_${Date.now()}.png`)
  })
}

// ─── localStorage helpers ──────────────────────────────────
const LS_KEY = 'physicslab_saves'

export function loadSaves() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') } catch { return [] }
}

export function persistSaves(saves) {
  localStorage.setItem(LS_KEY, JSON.stringify(saves))
}
