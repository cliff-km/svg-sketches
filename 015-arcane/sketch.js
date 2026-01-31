import paper from 'paper'
import { setupPaper, setupKeys, random } from '../lib/utils.js'

setupPaper('canvas')

const { Path, Point } = paper

const cx = 400
const cy = 400

// Wobbly line for hand-drawn feel
function wobble(val, amount = 1.5) {
  return val + random(-amount, amount)
}

function drawWobbleCircle(x, y, r, strokeWidth = 0.8, segments = 60) {
  const path = new Path({
    strokeColor: 'black',
    strokeWidth,
    closed: true
  })
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2
    const wobbleR = r + random(-r * 0.015, r * 0.015)
    path.add(new Point(
      x + Math.cos(angle) * wobbleR,
      y + Math.sin(angle) * wobbleR
    ))
  }
  path.smooth({ type: 'continuous' })
}

function drawWobbleLine(x1, y1, x2, y2, strokeWidth = 0.8) {
  const path = new Path({
    strokeColor: 'black',
    strokeWidth
  })
  const steps = Math.max(8, Math.hypot(x2 - x1, y2 - y1) / 10)
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = x1 + (x2 - x1) * t
    const y = y1 + (y2 - y1) * t
    const w = i === 0 || i === steps ? 0 : 1
    path.add(new Point(wobble(x, w), wobble(y, w)))
  }
  path.smooth({ type: 'continuous' })
}

function drawSigil(x, y, size) {
  const points = Math.floor(random(5, 9))
  const vertices = []
  
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2 + random(-0.2, 0.2)
    const r = size * random(0.4, 1)
    vertices.push({
      x: x + Math.cos(angle) * r,
      y: y + Math.sin(angle) * r
    })
  }
  
  // Connect in star pattern
  const skip = Math.floor(random(2, points / 2 + 1))
  for (let i = 0; i < points; i++) {
    const j = (i + skip) % points
    drawWobbleLine(vertices[i].x, vertices[i].y, vertices[j].x, vertices[j].y, 0.6)
  }
  
  // Small circle at center
  if (random(0, 1) > 0.3) {
    drawWobbleCircle(x, y, size * random(0.1, 0.25), 0.5)
  }
}

function drawAlchemySymbol(x, y, size) {
  const type = Math.floor(random(0, 8))
  
  if (type === 0) {
    // Fire (triangle up)
    drawWobbleLine(x, y - size, x - size * 0.7, y + size * 0.5, 0.7)
    drawWobbleLine(x - size * 0.7, y + size * 0.5, x + size * 0.7, y + size * 0.5, 0.7)
    drawWobbleLine(x + size * 0.7, y + size * 0.5, x, y - size, 0.7)
  } else if (type === 1) {
    // Water (triangle down)
    drawWobbleLine(x, y + size, x - size * 0.7, y - size * 0.5, 0.7)
    drawWobbleLine(x - size * 0.7, y - size * 0.5, x + size * 0.7, y - size * 0.5, 0.7)
    drawWobbleLine(x + size * 0.7, y - size * 0.5, x, y + size, 0.7)
  } else if (type === 2) {
    // Sun (circle with rays)
    drawWobbleCircle(x, y, size * 0.5, 0.7)
    const rays = Math.floor(random(6, 12))
    for (let i = 0; i < rays; i++) {
      const angle = (i / rays) * Math.PI * 2
      drawWobbleLine(
        x + Math.cos(angle) * size * 0.55,
        y + Math.sin(angle) * size * 0.55,
        x + Math.cos(angle) * size,
        y + Math.sin(angle) * size,
        0.5
      )
    }
  } else if (type === 3) {
    // Moon (crescent)
    drawWobbleCircle(x, y, size * 0.7, 0.7)
    drawWobbleCircle(x + size * 0.3, y, size * 0.55, 0.7)
  } else if (type === 4) {
    // Cross with circle
    drawWobbleCircle(x, y, size * 0.7, 0.7)
    drawWobbleLine(x, y - size, x, y + size, 0.6)
    drawWobbleLine(x - size, y, x + size, y, 0.6)
  } else if (type === 5) {
    // Serpent S
    const path = new Path({ strokeColor: 'black', strokeWidth: 0.7 })
    for (let i = 0; i <= 20; i++) {
      const t = i / 20
      path.add(new Point(
        wobble(x + Math.sin(t * Math.PI * 2) * size * 0.4),
        wobble(y - size + t * size * 2)
      ))
    }
    path.smooth()
  } else if (type === 6) {
    // Eye
    drawWobbleCircle(x, y, size * 0.3, 0.7)
    const path = new Path({ strokeColor: 'black', strokeWidth: 0.7 })
    path.add(new Point(x - size, y))
    path.add(new Point(x, y - size * 0.5))
    path.add(new Point(x + size, y))
    path.add(new Point(x, y + size * 0.5))
    path.closed = true
    path.smooth()
  } else {
    // Pentacle
    for (let i = 0; i < 5; i++) {
      const a1 = (i / 5) * Math.PI * 2 - Math.PI / 2
      const a2 = ((i + 2) / 5) * Math.PI * 2 - Math.PI / 2
      drawWobbleLine(
        x + Math.cos(a1) * size,
        y + Math.sin(a1) * size,
        x + Math.cos(a2) * size,
        y + Math.sin(a2) * size,
        0.6
      )
    }
  }
}

function drawRunicMark(x, y, size) {
  const strokes = Math.floor(random(2, 5))
  for (let i = 0; i < strokes; i++) {
    const angle = random(-Math.PI / 3, Math.PI / 3)
    const len = size * random(0.5, 1)
    drawWobbleLine(
      x, y - len / 2,
      x + Math.sin(angle) * len,
      y + len / 2,
      random(0.5, 1)
    )
  }
  // Occasional cross stroke
  if (random(0, 1) > 0.5) {
    const yOff = random(-size * 0.3, size * 0.3)
    drawWobbleLine(x - size * 0.4, y + yOff, x + size * 0.4, y + yOff, 0.5)
  }
}

function draw() {
  // Outer binding circles
  const rings = Math.floor(random(2, 5))
  for (let i = 0; i < rings; i++) {
    const r = 320 - i * random(15, 35)
    drawWobbleCircle(cx, cy, r, random(0.6, 1.2))
  }
  
  // Inner geometric structure
  const innerType = Math.floor(random(0, 3))
  
  if (innerType === 0) {
    // Central sigil with surrounding symbols
    drawSigil(cx, cy, random(80, 140))
    
    const orbitals = Math.floor(random(4, 9))
    const orbitR = random(180, 240)
    for (let i = 0; i < orbitals; i++) {
      const angle = (i / orbitals) * Math.PI * 2 + random(-0.1, 0.1)
      const x = cx + Math.cos(angle) * orbitR
      const y = cy + Math.sin(angle) * orbitR
      drawAlchemySymbol(x, y, random(20, 35))
    }
  } else if (innerType === 1) {
    // Layered polygons with symbols at vertices
    const sides = Math.floor(random(5, 8))
    for (let layer = 0; layer < 3; layer++) {
      const r = 250 - layer * 60
      const rot = layer * (Math.PI / sides / 2)
      
      for (let i = 0; i < sides; i++) {
        const a1 = (i / sides) * Math.PI * 2 + rot
        const a2 = ((i + 1) / sides) * Math.PI * 2 + rot
        drawWobbleLine(
          cx + Math.cos(a1) * r, cy + Math.sin(a1) * r,
          cx + Math.cos(a2) * r, cy + Math.sin(a2) * r,
          0.7
        )
        
        if (layer === 0) {
          const sx = cx + Math.cos(a1) * r
          const sy = cy + Math.sin(a1) * r
          drawAlchemySymbol(sx, sy, 18)
        }
      }
    }
    
    // Center symbol
    drawAlchemySymbol(cx, cy, random(40, 60))
    
  } else {
    // Radiating lines with runic marks
    const rays = Math.floor(random(8, 16))
    for (let i = 0; i < rays; i++) {
      const angle = (i / rays) * Math.PI * 2
      drawWobbleLine(
        cx + Math.cos(angle) * 60,
        cy + Math.sin(angle) * 60,
        cx + Math.cos(angle) * 280,
        cy + Math.sin(angle) * 280,
        0.5
      )
      
      // Runic marks along ray
      const marks = Math.floor(random(2, 5))
      for (let m = 0; m < marks; m++) {
        const dist = random(100, 250)
        drawRunicMark(
          cx + Math.cos(angle) * dist,
          cy + Math.sin(angle) * dist,
          random(12, 22)
        )
      }
    }
    
    // Central sigil
    drawSigil(cx, cy, random(50, 80))
  }
  
  // Scattered small marks in outer ring
  const scatterCount = Math.floor(random(8, 20))
  for (let i = 0; i < scatterCount; i++) {
    const angle = random(0, Math.PI * 2)
    const dist = random(260, 310)
    const x = cx + Math.cos(angle) * dist
    const y = cy + Math.sin(angle) * dist
    
    if (random(0, 1) > 0.5) {
      drawRunicMark(x, y, random(8, 14))
    } else {
      // Small dot cluster
      for (let d = 0; d < Math.floor(random(1, 4)); d++) {
        drawWobbleCircle(x + random(-8, 8), y + random(-8, 8), random(1, 3), 0.8, 12)
      }
    }
  }
  
  paper.view.draw()
}

draw()
setupKeys(draw)

console.log('Sketch loaded. Press S to save SVG, C to clear and redraw.')
