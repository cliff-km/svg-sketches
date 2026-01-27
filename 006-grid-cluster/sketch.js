import paper from 'paper'
import { setupPaper, setupKeys, random } from '../lib/utils.js'
import { createNoise } from '../lib/noise.js'

setupPaper('canvas')

const { Path, Point } = paper

function draw() {
  const noise = createNoise(random(0, 10000))
  
  // Create organic connected shapes using noise threshold
  function shouldDraw(x, y) {
    // Layered noise for organic shapes
    let value = 0
    value += noise.noise2D(x * 0.012, y * 0.012) * 1.0
    value += noise.noise2D(x * 0.025, y * 0.025) * 0.5
    value += noise.noise2D(x * 0.05, y * 0.05) * 0.25
    
    // Threshold creates connected regions
    return value > 0.15
  }
  
  const gridSize = 8
  
  // Draw horizontal lines - connected segments
  for (let y = 50; y < 750; y += gridSize) {
    let inLine = false
    let lineStart = 0
    
    for (let x = 50; x <= 750; x += gridSize) {
      const draw = shouldDraw(x, y)
      
      if (draw && !inLine) {
        inLine = true
        lineStart = x
      } else if (!draw && inLine) {
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
  
  // Draw vertical lines
  for (let x = 50; x < 750; x += gridSize) {
    let inLine = false
    let lineStart = 0
    
    for (let y = 50; y <= 750; y += gridSize) {
      const draw = shouldDraw(x, y)
      
      if (draw && !inLine) {
        inLine = true
        lineStart = y
      } else if (!draw && inLine) {
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
  
  // Add random symbols in drawn regions
  for (let x = 50; x < 750; x += gridSize) {
    for (let y = 50; y < 750; y += gridSize) {
      if (shouldDraw(x, y) && random(0, 1) < 0.08) {
        const size = random(2, 6)
        const symbolType = Math.floor(random(0, 4))
        
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
    }
  }
  
  paper.view.draw()
}

draw()
setupKeys(draw)

console.log('Sketch loaded. Press S to save SVG, C to clear and redraw.')
