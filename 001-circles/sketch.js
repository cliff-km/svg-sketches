import paper from 'paper'
import { setupPaper, setupKeys, random } from '../lib/utils.js'

setupPaper('canvas')

const { Path, Point, Color } = paper

function draw() {
  const center = new Point(400, 400)
  const rings = 12
  const dotsPerRing = 24
  
  for (let ring = 1; ring <= rings; ring++) {
    const radius = ring * 30
    const dots = dotsPerRing + ring * 2
    
    for (let i = 0; i < dots; i++) {
      const angle = (i / dots) * Math.PI * 2
      const wobble = random(-5, 5)
      const r = radius + wobble
      
      const x = center.x + Math.cos(angle) * r
      const y = center.y + Math.sin(angle) * r
      
      const dotRadius = random(2, 6)
      
      const circle = new Path.Circle({
        center: new Point(x, y),
        radius: dotRadius,
        strokeColor: 'black',
        strokeWidth: 1
      })
    }
  }
  
  paper.view.draw()
}

draw()
setupKeys(draw)

console.log('Sketch loaded. Press S to save SVG, C to clear and redraw.')
