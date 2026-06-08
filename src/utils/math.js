export const rad = (d) => d * Math.PI / 180
export const deg = (r) => r * 180 / Math.PI
export const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
export const uuid = () => Math.random().toString(36).slice(2) + Date.now().toString(36)
