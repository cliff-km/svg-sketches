import paper from 'paper'
import { setupPaper, setupKeys, random } from '../lib/utils.js'
import { createNoise } from '../lib/noise.js'

setupPaper('canvas')

const { Path, Point } = paper

function draw() {
  const noise = createNoise(random(0, 10000))
  
  // Controlled variation in parameters
  const noiseScale = random(0.0015, 0.004)
  const stepLength = 2
  const maxSteps = 500
  const lineSpacing = random(2, 4)
  
  // Single gentle curve influence
  const curveType = Math.floor(random(0, 3))
  const curveCenter = {
    x: random(200, 600),
    y: random(200, 600)
  }
  const curveStrength = random(0.3, 0.8)
  
  function getFlowAngle(x, y) {
    // Base: smooth large-scale noise
    let angle = noise.noise2D(x * noiseScale, y * noiseScale) * Math.PI * 1.5
    
    // Add one gentle systematic curve
    if (curveType === 0) {
      // Gentle S-curve
      angle += Math.sin((y - curveCenter.y) * 0.003) * curveStrength
    } else if (curveType === 1) {
      // Gentle radial bend
      const dx = x - curveCenter.x
      const dy = y - curveCenter.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > 50) {
        angle += Math.atan2(dy, dx) * curveStrength * 0.3
      }
    } else {
      // Gentle diagonal flow
      angle += (x + y) * 0.0005 * curveStrength
    }
    
    return angle
  }
  
  // Start from left and top edges only for cleaner flow
  const starts = []
  
  for (let y = -50; y < 850; y += lineSpacing) {
    starts.push({ x: -30, y })
  }
  for (let x = -50; x < 850; x += lineSpacing) {
    starts.push({ x, y: -30 })
  }
  
  for (const start of starts) {
    let x = start.x
    let y = start.y
    
    const path = new Path({
      strokeColor: 'black',
      strokeWidth: random(0.5, 0.9),
      strokeCap: 'round'
    })
    
    path.add(new Point(x, y))
    
    for (let step = 0; step < maxSteps; step++) {
      const angle = getFlowAngle(x, y)
      
      x += Math.cos(angle) * stepLength
      y += Math.sin(angle) * stepLength
      
      path.add(new Point(x, y))
      
      if (x > 830 || y > 830 || x < -50 || y < -50) break
    }
    
    if (path.segments.length > 2) {
      path.smooth({ type: 'continuous' })
    }
  }
  
  paper.view.draw()
}

draw()
setupKeys(draw)

console.log('Sketch loaded. Press S to save SVG, C to clear and redraw.')
