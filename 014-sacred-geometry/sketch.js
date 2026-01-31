import paper from 'paper'
import { setupPaper, setupKeys, random } from '../lib/utils.js'

setupPaper('canvas')

const { Path, Point } = paper

const cx = 400
const cy = 400

function drawCircle(x, y, r, strokeWidth = 0.8) {
  new Path.Circle({
    center: new Point(x, y),
    radius: r,
    strokeColor: 'black',
    strokeWidth
  })
}

function drawLine(x1, y1, x2, y2, strokeWidth = 0.8) {
  new Path.Line({
    from: new Point(x1, y1),
    to: new Point(x2, y2),
    strokeColor: 'black',
    strokeWidth
  })
}

function drawPolygon(x, y, r, sides, rotation = 0, strokeWidth = 0.8) {
  const path = new Path({
    strokeColor: 'black',
    strokeWidth,
    closed: true
  })
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 + rotation
    path.add(new Point(
      x + Math.cos(angle) * r,
      y + Math.sin(angle) * r
    ))
  }
}

// Flower of Life pattern
function flowerOfLife(baseRadius) {
  const r = baseRadius
  drawCircle(cx, cy, r)
  
  // First ring of 6
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    drawCircle(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, r)
  }
  
  // Second ring of 12
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    const x1 = cx + Math.cos(angle) * r * 2
    const y1 = cy + Math.sin(angle) * r * 2
    drawCircle(x1, y1, r)
    
    const angle2 = angle + Math.PI / 6
    const x2 = cx + Math.cos(angle2) * r * Math.sqrt(3)
    const y2 = cy + Math.sin(angle2) * r * Math.sqrt(3)
    drawCircle(x2, y2, r)
  }
  
  // Outer boundary
  drawCircle(cx, cy, r * 3, 1.2)
}

// Metatron's Cube
function metatronsCube(radius) {
  const r = radius
  
  // 13 circles: center + 6 inner + 6 outer
  const points = [{ x: cx, y: cy }]
  
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
    points.push({
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r
    })
  }
  
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
    points.push({
      x: cx + Math.cos(angle) * r * 2,
      y: cy + Math.sin(angle) * r * 2
    })
  }
  
  // Draw circles at each point
  const circleRadius = r * 0.3
  for (const p of points) {
    drawCircle(p.x, p.y, circleRadius, 0.6)
  }
  
  // Connect all points
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      drawLine(points[i].x, points[i].y, points[j].x, points[j].y, 0.4)
    }
  }
}

// Sri Yantra inspired (interlocking triangles)
function sriYantra(radius) {
  const r = radius
  const layers = Math.floor(random(3, 6))
  
  for (let layer = 0; layer < layers; layer++) {
    const layerR = r * (1 - layer * 0.15)
    // Upward triangle
    drawPolygon(cx, cy + layerR * 0.1, layerR, 3, -Math.PI / 2)
    // Downward triangle
    drawPolygon(cx, cy - layerR * 0.1, layerR, 3, Math.PI / 2)
  }
  
  // Outer circles
  drawCircle(cx, cy, r * 1.1)
  drawCircle(cx, cy, r * 1.2)
  
  // Lotus petals
  const petalCount = Math.floor(random(8, 17))
  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2
    const x1 = cx + Math.cos(angle) * r * 1.2
    const y1 = cy + Math.sin(angle) * r * 1.2
    const x2 = cx + Math.cos(angle) * r * 1.4
    const y2 = cy + Math.sin(angle) * r * 1.4
    drawLine(x1, y1, x2, y2)
  }
}

// Seed of Life
function seedOfLife(radius) {
  const r = radius
  drawCircle(cx, cy, r)
  
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    drawCircle(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, r)
  }
}

// Radial mandala
function mandala(radius) {
  const r = radius
  const symmetry = Math.floor(random(6, 13))
  const rings = Math.floor(random(4, 8))
  
  for (let ring = 1; ring <= rings; ring++) {
    const ringR = r * (ring / rings)
    
    // Circle at this radius
    if (random(0, 1) > 0.3) {
      drawCircle(cx, cy, ringR, 0.5)
    }
    
    // Elements around ring
    const elements = symmetry * Math.floor(random(1, 3))
    for (let i = 0; i < elements; i++) {
      const angle = (i / elements) * Math.PI * 2 + ring * 0.1
      const x = cx + Math.cos(angle) * ringR
      const y = cy + Math.sin(angle) * ringR
      
      const elemType = Math.floor(random(0, 4))
      if (elemType === 0) {
        drawCircle(x, y, ringR * 0.08, 0.5)
      } else if (elemType === 1) {
        const size = ringR * 0.1
        drawLine(x - size, y, x + size, y, 0.5)
      } else if (elemType === 2) {
        drawPolygon(x, y, ringR * 0.08, 3, angle, 0.5)
      } else {
        drawPolygon(x, y, ringR * 0.06, 4, angle, 0.5)
      }
    }
    
    // Radial lines
    if (random(0, 1) > 0.5) {
      for (let i = 0; i < symmetry; i++) {
        const angle = (i / symmetry) * Math.PI * 2
        const x1 = cx + Math.cos(angle) * ringR * 0.9
        const y1 = cy + Math.sin(angle) * ringR * 0.9
        const x2 = cx + Math.cos(angle) * ringR * 1.1
        const y2 = cy + Math.sin(angle) * ringR * 1.1
        drawLine(x1, y1, x2, y2, 0.4)
      }
    }
  }
  
  // Outer boundary
  drawCircle(cx, cy, r, 1)
}

// Nested polygons
function nestedPolygons(radius) {
  const r = radius
  const sides = Math.floor(random(5, 10))
  const layers = Math.floor(random(6, 14))
  
  for (let i = 0; i < layers; i++) {
    const layerR = r * ((i + 1) / layers)
    const rotation = i * (Math.PI / sides / 2)
    drawPolygon(cx, cy, layerR, sides, rotation)
  }
  
  // Connect vertices
  if (random(0, 1) > 0.4) {
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2
      drawLine(
        cx, cy,
        cx + Math.cos(angle) * r,
        cy + Math.sin(angle) * r,
        0.4
      )
    }
  }
}

// Golden spiral approximation
function goldenSpiral(radius) {
  const phi = (1 + Math.sqrt(5)) / 2
  const r = radius
  
  // Draw golden rectangles
  let size = r
  let x = cx - r / 2
  let y = cy - r / 2 / phi
  let rotation = 0
  
  for (let i = 0; i < 8; i++) {
    const rect = new Path.Rectangle({
      point: new Point(x, y),
      size: [size, size / phi],
      strokeColor: 'black',
      strokeWidth: 0.6
    })
    rect.rotate(rotation * 180 / Math.PI, new Point(cx, cy))
    
    size = size / phi
    rotation += Math.PI / 2
  }
  
  // Spiral
  const spiral = new Path({
    strokeColor: 'black',
    strokeWidth: 1
  })
  
  for (let t = 0; t < Math.PI * 6; t += 0.05) {
    const spiralR = r * 0.05 * Math.exp(t * 0.18)
    if (spiralR > r) break
    spiral.add(new Point(
      cx + Math.cos(t) * spiralR,
      cy + Math.sin(t) * spiralR
    ))
  }
  spiral.smooth()
}

function draw() {
  const pattern = Math.floor(random(0, 7))
  const radius = random(180, 280)
  
  switch (pattern) {
    case 0:
      flowerOfLife(radius * 0.35)
      break
    case 1:
      metatronsCube(radius * 0.5)
      break
    case 2:
      sriYantra(radius)
      break
    case 3:
      seedOfLife(radius * 0.5)
      break
    case 4:
      mandala(radius)
      break
    case 5:
      nestedPolygons(radius)
      break
    case 6:
      goldenSpiral(radius)
      break
  }
  
  paper.view.draw()
}

draw()
setupKeys(draw)

console.log('Sketch loaded. Press S to save SVG, C to clear and redraw.')
