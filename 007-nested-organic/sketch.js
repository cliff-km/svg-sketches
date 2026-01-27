import paper from 'paper'
import { setupPaper, setupKeys, random } from '../lib/utils.js'
import { createNoise } from '../lib/noise.js'

setupPaper('canvas')

const { Path, Point } = paper

function draw() {
  const noise = createNoise(random(0, 10000))
  const noiseSymbols = createNoise(random(0, 10000))
  
  // Create organic blob for grid
  function createOrganicBlob(cx, cy, avgRadius, irregularity) {
    const points = []
    const numPoints = Math.floor(random(25, 45))
    const noiseOffset = random(0, 1000)
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2
      let r = avgRadius * (1 + random(-irregularity * 0.5, irregularity * 0.5))
      r += noise.noise2D(
        Math.cos(angle) * 2 + noiseOffset,
        Math.sin(angle) * 2 + noiseOffset
      ) * avgRadius * irregularity
      
      points.push({
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r
      })
    }
    return points
  }
  
  function pointInPolygon(x, y, polygon) {
    let inside = false
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y
      const xj = polygon[j].x, yj = polygon[j].y
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside
      }
    }
    return inside
  }
  
  function distToPolygonEdge(x, y, polygon) {
    let minDist = Infinity
    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length
      const px = polygon[i].x, py = polygon[i].y
      const qx = polygon[j].x, qy = polygon[j].y
      const dx = qx - px, dy = qy - py
      const t = Math.max(0, Math.min(1, ((x - px) * dx + (y - py) * dy) / (dx * dx + dy * dy)))
      const nearX = px + t * dx, nearY = py + t * dy
      const dist = Math.sqrt((x - nearX) ** 2 + (y - nearY) ** 2)
      minDist = Math.min(minDist, dist)
    }
    return minDist
  }
  
  // Create thread/string paths for symbols
  const symbolThreads = []
  const numThreads = Math.floor(random(8, 18))
  
  for (let t = 0; t < numThreads; t++) {
    const thread = []
    let x = random(100, 700)
    let y = random(100, 700)
    let angle = random(0, Math.PI * 2)
    const threadNoiseOffset = random(0, 1000)
    const threadWidth = random(15, 45)
    const steps = Math.floor(random(30, 80))
    
    for (let s = 0; s < steps; s++) {
      thread.push({ x, y, width: threadWidth * (0.5 + random(0, 1)) })
      
      // Wander using noise
      angle += noiseSymbols.noise2D(x * 0.01 + threadNoiseOffset, y * 0.01) * 0.8
      const stepLen = random(8, 15)
      x += Math.cos(angle) * stepLen
      y += Math.sin(angle) * stepLen
    }
    symbolThreads.push(thread)
  }
  
  // Main grid blob
  const gridBlob = createOrganicBlob(
    random(300, 500),
    random(300, 500),
    random(220, 320),
    0.4
  )
  
  function isGridRegion(x, y) {
    if (!pointInPolygon(x, y, gridBlob)) return false
    const edgeDist = distToPolygonEdge(x, y, gridBlob)
    const noiseVal = noise.noise2D(x * 0.02, y * 0.02) * 12
    return edgeDist > noiseVal
  }
  
  function isSymbolRegion(x, y) {
    // Check if near any thread
    for (const thread of symbolThreads) {
      for (const pt of thread) {
        const dist = Math.sqrt((x - pt.x) ** 2 + (y - pt.y) ** 2)
        if (dist < pt.width) {
          // Add noise for irregular edges
          const noiseVal = noiseSymbols.noise2D(x * 0.05, y * 0.05) * pt.width * 0.5
          if (dist < pt.width - noiseVal) return true
        }
      }
    }
    return false
  }
  
  const gridSize = 8
  
  // Horizontal lines
  for (let y = 50; y < 750; y += gridSize) {
    let inLine = false
    let lineStart = 0
    
    for (let x = 50; x <= 750; x += gridSize) {
      const inGrid = isGridRegion(x, y)
      
      if (inGrid && !inLine) {
        inLine = true
        lineStart = x
      } else if (!inGrid && inLine) {
        new Path.Line({
          from: new Point(lineStart, y),
          to: new Point(x - gridSize, y),
          strokeColor: 'black',
          strokeWidth: 0.5
        })
        inLine = false
      }
    }
    if (inLine) {
      new Path.Line({
        from: new Point(lineStart, y),
        to: new Point(750, y),
        strokeColor: 'black',
        strokeWidth: 0.5
      })
    }
  }
  
  // Vertical lines
  for (let x = 50; x < 750; x += gridSize) {
    let inLine = false
    let lineStart = 0
    
    for (let y = 50; y <= 750; y += gridSize) {
      const inGrid = isGridRegion(x, y)
      
      if (inGrid && !inLine) {
        inLine = true
        lineStart = y
      } else if (!inGrid && inLine) {
        new Path.Line({
          from: new Point(x, lineStart),
          to: new Point(x, y - gridSize),
          strokeColor: 'black',
          strokeWidth: 0.5
        })
        inLine = false
      }
    }
    if (inLine) {
      new Path.Line({
        from: new Point(x, lineStart),
        to: new Point(x, 750),
        strokeColor: 'black',
        strokeWidth: 0.5
      })
    }
  }
  
  // Symbols centered on grid intersections - variance in occurrence/overlap
  function drawSymbol(x, y, size, symbolType) {
    if (symbolType === 0) {
      new Path.Rectangle({
        point: new Point(x - size/2, y - size/2),
        size: [size, size],
        strokeColor: 'black',
        strokeWidth: 0.5
      })
    } else if (symbolType === 1) {
      const tri = new Path({
        strokeColor: 'black',
        strokeWidth: 0.5
      })
      tri.add(new Point(x, y - size))
      tri.add(new Point(x - size, y + size * 0.7))
      tri.add(new Point(x + size, y + size * 0.7))
      tri.closed = true
    } else if (symbolType === 2) {
      new Path.Line({
        from: new Point(x - size, y - size),
        to: new Point(x + size, y + size),
        strokeColor: 'black',
        strokeWidth: 0.5
      })
      new Path.Line({
        from: new Point(x + size, y - size),
        to: new Point(x - size, y + size),
        strokeColor: 'black',
        strokeWidth: 0.5
      })
    } else {
      new Path.Circle({
        center: new Point(x, y),
        radius: size / 2,
        strokeColor: 'black',
        strokeWidth: 0.5
      })
    }
  }
  
  for (let x = 50; x < 750; x += gridSize) {
    for (let y = 50; y < 750; y += gridSize) {
      if (!isGridRegion(x, y)) continue
      if (!isSymbolRegion(x, y)) continue
      
      // High variance in how many overlapping symbols - some spots very dense
      const density = noiseSymbols.noise2D(x * 0.03, y * 0.03)
      const numSymbols = density > 0.3 ? Math.floor(random(4, 12)) : 
                         density > 0 ? Math.floor(random(2, 6)) :
                         Math.floor(random(1, 3))
      
      for (let s = 0; s < numSymbols; s++) {
        const size = random(1.5, 6)
        const symbolType = Math.floor(random(0, 4))
        drawSymbol(x, y, size, symbolType)
      }
    }
  }
  
  paper.view.draw()
}

draw()
setupKeys(draw)

console.log('Sketch loaded. Press S to save SVG, C to clear and redraw.')
