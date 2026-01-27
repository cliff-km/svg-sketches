import paper from 'paper'
import { setupPaper, setupKeys, random, map } from '../lib/utils.js'
import { createNoise } from '../lib/noise.js'

setupPaper('canvas')

const { Path, Point } = paper

function draw() {
  const noise = createNoise(Math.random() * 10000)
  
  // Grid settings
  const cols = 80
  const rows = 80
  const cellSize = 800 / cols
  const margin = 40
  
  // Distortion settings
  const noiseScale = 0.015
  const distortAmount = 25
  const warpScale = 0.008
  const warpAmount = 60
  
  // Create grid of points with noise-based distortion
  const points = []
  
  for (let y = 0; y <= rows; y++) {
    const row = []
    for (let x = 0; x <= cols; x++) {
      // Base position
      let px = margin + x * ((800 - margin * 2) / cols)
      let py = margin + y * ((800 - margin * 2) / rows)
      
      // Primary distortion - creates the main topological warping
      const warpAngle = noise.noise2D(px * warpScale, py * warpScale) * Math.PI * 2
      px += Math.cos(warpAngle) * warpAmount
      py += Math.sin(warpAngle) * warpAmount
      
      // Secondary distortion - adds fine detail
      const dx = noise.noise2D(px * noiseScale, py * noiseScale) * distortAmount
      const dy = noise.noise2D(px * noiseScale + 100, py * noiseScale + 100) * distortAmount
      
      row.push(new Point(px + dx, py + dy))
    }
    points.push(row)
  }
  
  // Draw horizontal lines
  for (let y = 0; y <= rows; y++) {
    const path = new Path({
      strokeColor: 'black',
      strokeWidth: 0.4
    })
    
    for (let x = 0; x <= cols; x++) {
      path.add(points[y][x])
    }
    
    path.smooth({ type: 'continuous' })
  }
  
  // Draw vertical lines
  for (let x = 0; x <= cols; x++) {
    const path = new Path({
      strokeColor: 'black',
      strokeWidth: 0.4
    })
    
    for (let y = 0; y <= rows; y++) {
      path.add(points[y][x])
    }
    
    path.smooth({ type: 'continuous' })
  }
  
  paper.view.draw()
}

draw()
setupKeys(draw)

console.log('Sketch loaded. Press S to save SVG, C to clear and redraw.')
