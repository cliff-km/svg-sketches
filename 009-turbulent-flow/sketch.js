import paper from 'paper'
import { setupPaper, setupKeys, random } from '../lib/utils.js'
import { createNoise } from '../lib/noise.js'

setupPaper('canvas')

const { Path, Point } = paper

function draw() {
  const noise1 = createNoise(random(0, 10000))
  const noise2 = createNoise(random(0, 10000))
  const noise3 = createNoise(random(0, 10000))
  
  // Multiple turbulence centers
  const numVortices = Math.floor(random(3, 8))
  const vortices = []
  for (let i = 0; i < numVortices; i++) {
    vortices.push({
      x: random(100, 700),
      y: random(100, 700),
      strength: random(0.5, 2),
      radius: random(80, 200)
    })
  }
  
  // Get turbulent flow angle at a point
  function getFlowAngle(x, y) {
    // Base noise layers at different frequencies
    let angle = 0
    angle += noise1.noise2D(x * 0.004, y * 0.004) * Math.PI * 2
    angle += noise2.noise2D(x * 0.015, y * 0.015) * Math.PI * 1.5
    angle += noise3.noise2D(x * 0.04, y * 0.04) * Math.PI * 0.8
    
    // Add vortex influence
    for (const v of vortices) {
      const dx = x - v.x
      const dy = y - v.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < v.radius && dist > 5) {
        // Circular flow around vortex
        const vortexAngle = Math.atan2(dy, dx) + Math.PI / 2
        const influence = (1 - dist / v.radius) * v.strength
        angle += vortexAngle * influence
      }
    }
    
    return angle
  }
  
  const markLength = random(6, 14)
  const spacing = random(5, 9)
  
  for (let x = 40; x < 760; x += spacing) {
    for (let y = 40; y < 760; y += spacing) {
      const ox = random(-spacing * 0.4, spacing * 0.4)
      const oy = random(-spacing * 0.4, spacing * 0.4)
      const px = x + ox
      const py = y + oy
      
      const angle = getFlowAngle(px, py)
      
      // Length varies with local turbulence
      const turbulence = Math.abs(noise3.noise2D(px * 0.02, py * 0.02))
      const len = markLength * (0.5 + turbulence * 1.5)
      
      const x1 = px - Math.cos(angle) * len / 2
      const y1 = py - Math.sin(angle) * len / 2
      const x2 = px + Math.cos(angle) * len / 2
      const y2 = py + Math.sin(angle) * len / 2
      
      new Path.Line({
        from: new Point(x1, y1),
        to: new Point(x2, y2),
        strokeColor: 'black',
        strokeWidth: random(0.3, 0.7),
        strokeCap: 'round'
      })
    }
  }
  
  paper.view.draw()
}

draw()
setupKeys(draw)

console.log('Sketch loaded. Press S to save SVG, C to clear and redraw.')
