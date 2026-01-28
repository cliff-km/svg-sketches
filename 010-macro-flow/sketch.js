import paper from 'paper'
import { setupPaper, setupKeys, random } from '../lib/utils.js'
import { createNoise } from '../lib/noise.js'

setupPaper('canvas')

const { Path, Point } = paper

function draw() {
  const noise = createNoise(random(0, 10000))
  
  // Very low frequency noise for macro-level flow
  const noiseScale = random(0.0008, 0.002)
  
  // Optional: add a systemic drift direction
  const driftAngle = random(0, Math.PI * 2)
  const driftStrength = random(0.2, 0.6)
  
  function getFlowAngle(x, y) {
    // Large-scale noise
    let angle = noise.noise2D(x * noiseScale, y * noiseScale) * Math.PI * 2
    
    // Add subtle secondary wave
    angle += noise.noise2D(x * noiseScale * 2.5, y * noiseScale * 2.5) * Math.PI * 0.4
    
    // Blend with systemic drift
    angle = angle * (1 - driftStrength) + driftAngle * driftStrength
    
    return angle
  }
  
  const markLength = random(10, 18)
  const spacing = random(6, 10)
  
  for (let x = 40; x < 760; x += spacing) {
    for (let y = 40; y < 760; y += spacing) {
      const ox = random(-spacing * 0.3, spacing * 0.3)
      const oy = random(-spacing * 0.3, spacing * 0.3)
      const px = x + ox
      const py = y + oy
      
      const angle = getFlowAngle(px, py)
      const len = markLength * random(0.8, 1.2)
      
      const x1 = px - Math.cos(angle) * len / 2
      const y1 = py - Math.sin(angle) * len / 2
      const x2 = px + Math.cos(angle) * len / 2
      const y2 = py + Math.sin(angle) * len / 2
      
      new Path.Line({
        from: new Point(x1, y1),
        to: new Point(x2, y2),
        strokeColor: 'black',
        strokeWidth: random(0.4, 0.7),
        strokeCap: 'round'
      })
    }
  }
  
  paper.view.draw()
}

draw()
setupKeys(draw)

console.log('Sketch loaded. Press S to save SVG, C to clear and redraw.')
