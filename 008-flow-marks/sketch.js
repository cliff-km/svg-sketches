import paper from 'paper'
import { setupPaper, setupKeys, random } from '../lib/utils.js'
import { createNoise } from '../lib/noise.js'

setupPaper('canvas')

const { Path, Point } = paper

function draw() {
  const noise = createNoise(random(0, 10000))
  
  // Flow field parameters
  const noiseScale = random(0.003, 0.008)
  const markLength = random(8, 20)
  const spacing = random(6, 12)
  
  // Draw short marks following the flow field
  for (let x = 50; x < 750; x += spacing) {
    for (let y = 50; y < 750; y += spacing) {
      // Add slight random offset to break up grid
      const ox = random(-spacing * 0.3, spacing * 0.3)
      const oy = random(-spacing * 0.3, spacing * 0.3)
      const px = x + ox
      const py = y + oy
      
      // Get flow angle from noise
      const angle = noise.noise2D(px * noiseScale, py * noiseScale) * Math.PI * 2
      
      // Mark length with slight variation
      const len = markLength * random(0.7, 1.3)
      
      // Draw the mark centered on the point
      const x1 = px - Math.cos(angle) * len / 2
      const y1 = py - Math.sin(angle) * len / 2
      const x2 = px + Math.cos(angle) * len / 2
      const y2 = py + Math.sin(angle) * len / 2
      
      new Path.Line({
        from: new Point(x1, y1),
        to: new Point(x2, y2),
        strokeColor: 'black',
        strokeWidth: random(0.4, 0.8),
        strokeCap: 'round'
      })
    }
  }
  
  paper.view.draw()
}

draw()
setupKeys(draw)

console.log('Sketch loaded. Press S to save SVG, C to clear and redraw.')
