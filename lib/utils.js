import paper from 'paper'

/**
 * Initialize Paper.js on a canvas
 */
export function setupPaper(canvasId = 'canvas') {
  const canvas = document.getElementById(canvasId)
  paper.setup(canvas)
  return paper
}

/**
 * Save current Paper.js project as SVG
 * Call from console: saveSVG() or bind to a key
 */
export function saveSVG(filename) {
  const name = filename || `sketch-${Date.now()}.svg`
  const svg = paper.project.exportSVG({ asString: true })
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  
  URL.revokeObjectURL(url)
  console.log(`Saved: ${name}`)
}

/**
 * Clear the canvas
 */
export function clear() {
  paper.project.clear()
}

/**
 * Set up keyboard shortcuts
 * S = save SVG
 * C = clear and re-run
 */
export function setupKeys(drawFn) {
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return
    
    if (e.key === 's' && !e.metaKey && !e.ctrlKey) {
      e.preventDefault()
      saveSVG()
    }
    
    if (e.key === 'c' && !e.metaKey && !e.ctrlKey) {
      e.preventDefault()
      clear()
      if (drawFn) drawFn()
    }
  })
}

/**
 * Random number between min and max
 */
export function random(min = 0, max = 1) {
  return Math.random() * (max - min) + min
}

/**
 * Random integer between min and max (inclusive)
 */
export function randomInt(min, max) {
  return Math.floor(random(min, max + 1))
}

/**
 * Pick random item from array
 */
export function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Map a value from one range to another
 */
export function map(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
}

/**
 * Constrain a value between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Linear interpolation
 */
export function lerp(a, b, t) {
  return a + (b - a) * t
}

/**
 * Expose utilities to window for console access
 */
window.saveSVG = saveSVG
window.clear = clear
