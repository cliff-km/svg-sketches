import paper from 'paper'
import { setupPaper, setupKeys, random } from '../lib/utils.js'
import { createNoise } from '../lib/noise.js'

setupPaper('canvas')

const { Path, Point } = paper

function draw() {
  const noise1 = createNoise(random(0, 10000))
  const noise2 = createNoise(random(0, 10000))
  
  // Highly varied parameters
  const baseScale = random(0.001, 0.008)
  const secondScale = random(0.003, 0.015)
  const stepLength = 2
  const maxSteps = 600
  const lineSpacing = random(1.5, 4)
  
  // Random flow modifiers
  const flowType = Math.floor(random(0, 4))
  const twistStrength = random(0, 2)
  const waveFreq = random(0.5, 3)
  const waveAmp = random(0, 1.5)
  
  // Random attractor/repulsor points
  const numAttractors = Math.floor(random(0, 4))
  const attractors = []
  for (let i = 0; i < numAttractors; i++) {
    attractors.push({
      x: random(100, 700),
      y: random(100, 700),
      strength: random(-2, 2),
      radius: random(100, 300)
    })
  }
  
  function getFlowAngle(x, y) {
    let angle = 0
    
    // Base noise
    angle += noise1.noise2D(x * baseScale, y * baseScale) * Math.PI * 2
    
    // Secondary noise layer
    angle += noise2.noise2D(x * secondScale, y * secondScale) * Math.PI * 0.8
    
    // Flow type variations
    if (flowType === 1) {
      // Radial from center
      const dx = x - 400, dy = y - 400
      angle += Math.atan2(dy, dx) * twistStrength
    } else if (flowType === 2) {
      // Wave distortion
      angle += Math.sin(y * 0.01 * waveFreq) * waveAmp
      angle += Math.cos(x * 0.01 * waveFreq) * waveAmp * 0.5
    } else if (flowType === 3) {
      // Spiral
      const dx = x - 400, dy = y - 400
      const dist = Math.sqrt(dx * dx + dy * dy)
      angle += Math.atan2(dy, dx) + dist * 0.005 * twistStrength
    }
    
    // Attractor influence
    for (const a of attractors) {
      const dx = x - a.x, dy = y - a.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < a.radius && dist > 10) {
        const attractAngle = Math.atan2(dy, dx)
        const influence = (1 - dist / a.radius) * a.strength
        angle += attractAngle * influence
      }
    }
    
    return angle
  }
  
  // Start lines from all edges
  const edges = []
  
  // Left edge
  for (let y = -100; y < 900; y += lineSpacing) {
    edges.push({ x: -50, y })
  }
  // Top edge
  for (let x = -100; x < 900; x += lineSpacing) {
    edges.push({ x, y: -50 })
  }
  // Right edge
  for (let y = -100; y < 900; y += lineSpacing) {
    edges.push({ x: 850, y })
  }
  // Bottom edge
  for (let x = -100; x < 900; x += lineSpacing) {
    edges.push({ x, y: 850 })
  }
  
  for (const start of edges) {
    let x = start.x
    let y = start.y
    
    const path = new Path({
      strokeColor: 'black',
      strokeWidth: random(0.4, 0.8),
      strokeCap: 'round'
    })
    
    path.add(new Point(x, y))
    
    for (let step = 0; step < maxSteps; step++) {
      const angle = getFlowAngle(x, y)
      
      x += Math.cos(angle) * stepLength
      y += Math.sin(angle) * stepLength
      
      path.add(new Point(x, y))
      
      // Stop when out of bounds
      if (x < -100 || x > 900 || y < -100 || y > 900) break
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
