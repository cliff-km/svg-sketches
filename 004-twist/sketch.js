import paper from 'paper'
import { setupPaper, setupKeys, random, map } from '../lib/utils.js'
import { createNoise } from '../lib/noise.js'

setupPaper('canvas')

const { Path, Point } = paper

function draw() {
  const noise = createNoise(Math.random() * 10000)
  const cx = 400
  const cy = 400
  
  // Twisted ribbon parameters
  const height = 540
  const twists = 1.5  // Number of 180° twists
  const ribbonWidth = 140   // How wide the ribbon is
  const ribbonThickness = 8 // How thick (thin for flat ribbon)
  
  const yStart = cy - height / 2
  
  const vSteps = 300
  const uSteps = 80
  
  const hatches = []
  
  // Two ribbons intertwined
  for (let ribbon = 0; ribbon < 2; ribbon++) {
    const phaseOffset = ribbon * Math.PI
    
    for (let vi = 0; vi <= vSteps; vi++) {
      const v = vi / vSteps
      const y = yStart + v * height
      
      // Pinch profile - hourglass shape
      const pinch = Math.sin(v * Math.PI)
      const scale = 0.2 + 0.8 * Math.pow(pinch, 0.4)
      
      const width = ribbonWidth * scale
      const thickness = ribbonThickness * scale
      
      // Twist angle at this height
      const twist = v * Math.PI * twists + phaseOffset
      
      for (let ui = 0; ui <= uSteps; ui++) {
        const u = ui / uSteps
        const theta = u * Math.PI * 2  // Around the ribbon cross-section
        
        // Elliptical cross-section (flat ribbon = wide, thin ellipse)
        // Before rotation
        const localX = Math.cos(theta) * width
        const localZ = Math.sin(theta) * thickness
        
        // Rotate by twist angle around Y axis
        const x3d = localX * Math.cos(twist) - localZ * Math.sin(twist)
        const z3d = localX * Math.sin(twist) + localZ * Math.cos(twist)
        
        // Surface normal (points outward from ellipse center)
        // For an ellipse, normal is not simply (cos, sin) - need to account for ellipse shape
        const nx = Math.cos(theta) / width
        const nz = Math.sin(theta) / thickness
        const nLen = Math.sqrt(nx * nx + nz * nz)
        
        // Rotate normal by twist
        const normalX = (nx / nLen) * Math.cos(twist) - (nz / nLen) * Math.sin(twist)
        const normalZ = (nx / nLen) * Math.sin(twist) + (nz / nLen) * Math.cos(twist)
        
        // Only draw front-facing surface
        if (normalZ < 0.1) continue
        
        // Project to 2D
        const x2d = cx + x3d
        const y2d = y
        
        // Density based on how much surface faces camera
        const baseDensity = normalZ * 0.9
        const noiseVal = noise.noise2D(x2d * 0.015, y2d * 0.015) * 0.1
        const density = baseDensity + noiseVal
        
        if (random(0, 1) > density) continue
        
        // Hatch direction - follows the ribbon lengthwise (vertical flow)
        // Tangent along the ribbon is mostly vertical but curves with the twist
        const flowAngle = Math.PI / 2 + twist * 0.15 + noise.noise2D(x2d * 0.01, y2d * 0.01) * 0.2
        
        const len = 4 + random(0, 2)
        const px = x2d + random(-1, 1)
        const py = y2d + random(-1, 1)
        
        hatches.push({
          x1: px - Math.cos(flowAngle) * len / 2,
          y1: py - Math.sin(flowAngle) * len / 2,
          x2: px + Math.cos(flowAngle) * len / 2,
          y2: py + Math.sin(flowAngle) * len / 2,
          z: z3d,
          sw: map(normalZ, 0.1, 1, 0.4, 1.0)
        })
      }
    }
  }
  
  hatches.sort((a, b) => a.z - b.z)
  
  for (const h of hatches) {
    new Path.Line({
      from: new Point(h.x1, h.y1),
      to: new Point(h.x2, h.y2),
      strokeColor: 'black',
      strokeWidth: h.sw,
      strokeCap: 'round'
    })
  }
  
  paper.view.draw()
}

draw()
setupKeys(draw)

console.log('Sketch loaded. Press S to save SVG, C to clear and redraw.')
