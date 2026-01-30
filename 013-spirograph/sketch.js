import paper from 'paper'
import { setupPaper, setupKeys, random } from '../lib/utils.js'

setupPaper('canvas')

const { Path, Point } = paper

function gcd(a, b) {
  a = Math.abs(Math.round(a))
  b = Math.abs(Math.round(b))
  while (b) {
    const t = b
    b = a % b
    a = t
  }
  return a
}

function draw() {
  const cx = 400
  const cy = 400
  
  // Random spirograph parameters
  const R = Math.floor(random(120, 280))
  const r = Math.floor(random(15, R * 0.85))
  const d = random(r * 0.2, r * 1.4)
  const isHypo = random(0, 1) > 0.3
  
  // Calculate rotations for complete pattern
  const g = gcd(R, r)
  const rotations = r / g
  const steps = Math.max(800, rotations * 120)
  const maxT = rotations * Math.PI * 2
  
  const path = new Path({
    strokeColor: 'black',
    strokeWidth: random(0.5, 1.0),
    strokeCap: 'round'
  })
  
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * maxT
    
    let x, y
    if (isHypo) {
      x = (R - r) * Math.cos(t) + d * Math.cos((R - r) / r * t)
      y = (R - r) * Math.sin(t) - d * Math.sin((R - r) / r * t)
    } else {
      x = (R + r) * Math.cos(t) - d * Math.cos((R + r) / r * t)
      y = (R + r) * Math.sin(t) - d * Math.sin((R + r) / r * t)
    }
    
    path.add(new Point(cx + x, cy + y))
  }
  
  path.smooth({ type: 'continuous' })
  
  paper.view.draw()
}

draw()
setupKeys(draw)

console.log('Sketch loaded. Press S to save SVG, C to clear and redraw.')
