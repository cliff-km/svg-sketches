import paper from 'paper'
import { setupPaper, setupKeys, random } from '../lib/utils.js'
import { createNoise } from '../lib/noise.js'

setupPaper('canvas')

const { Path, Point } = paper

function draw() {
  const noise = createNoise(Math.random() * 10000)
  const scale = 0.005
  const numLines = 800
  const stepLength = 5
  const steps = 50
  
  for (let i = 0; i < numLines; i++) {
    // Start at random position
    let x = random(0, 800)
    let y = random(0, 800)
    
    const path = new Path({
      strokeColor: 'black',
      strokeWidth: 0.5
    })
    
    path.add(new Point(x, y))
    
    // Follow the flow field
    for (let step = 0; step < steps; step++) {
      // Get angle from noise
      const angle = noise.noise2D(x * scale, y * scale) * Math.PI * 2
      
      // Move in that direction
      x += Math.cos(angle) * stepLength
      y += Math.sin(angle) * stepLength
      
      // Stop if we leave the canvas
      if (x < 0 || x > 800 || y < 0 || y > 800) break
      
      path.add(new Point(x, y))
    }
    
    // Smooth the path
    path.smooth({ type: 'continuous' })
  }
  
  paper.view.draw()
}

draw()
setupKeys(draw)

console.log('Sketch loaded. Press S to save SVG, C to clear and redraw.')
