import paper from 'paper'
import { setupPaper, setupKeys, random } from '../lib/utils.js'

setupPaper('canvas')

const { Path, Point } = paper

function draw() {
  // Simple dendrite from a point
  function dendrite(x, y, angle, length, depth) {
    if (depth > 10 || length < 2) return
    
    const endX = x + Math.cos(angle) * length
    const endY = y + Math.sin(angle) * length
    
    new Path.Line({
      from: new Point(x, y),
      to: new Point(endX, endY),
      strokeColor: 'black',
      strokeWidth: 0.5,
      strokeCap: 'round'
    })
    
    // Continue
    if (random(0, 1) < 0.85) {
      dendrite(endX, endY, angle + random(-0.4, 0.4), length * random(0.8, 0.95), depth + 1)
    }
    
    // Branch
    if (random(0, 1) < 0.4) {
      const side = random(0, 1) < 0.5 ? -1 : 1
      dendrite(endX, endY, angle + side * random(0.5, 1.2), length * random(0.5, 0.8), depth + 1)
    }
  }
  
  // 7 random origin points with varying weights
  const origins = []
  for (let i = 0; i < 7; i++) {
    origins.push({
      x: random(150, 650),
      y: random(150, 650),
      weight: random(0.2, 1.8)  // Some origins get way more, some way less
    })
  }
  
  // Normalize weights
  const totalWeight = origins.reduce((sum, o) => sum + o.weight, 0)
  
  // Distribute ~1500 dendrites based on weight
  const totalDendrites = 1500
  
  for (const origin of origins) {
    const count = Math.floor((origin.weight / totalWeight) * totalDendrites)
    
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2)
      // Length at 75% scale
      const length = random(4, 45)
      dendrite(origin.x, origin.y, angle, length, 0)
    }
  }
  
  paper.view.draw()
}

draw()
setupKeys(draw)

console.log('Sketch loaded. Press S to save SVG, C to clear and redraw.')
