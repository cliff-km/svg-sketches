# SVG Sketches

A minimal setup for generative SVG art, optimized for plotter output.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 to see the gallery.

## Creating a New Sketch

1. Create a new folder with the pattern `NNN-name`:
   ```bash
   mkdir 003-my-sketch
   ```

2. Add `index.html` and `sketch.js` (copy from an existing sketch)

3. Add the sketch to the gallery in `index.html`:
   ```js
   const sketches = [
     { id: '001-circles', name: 'Circles' },
     { id: '002-flow-field', name: 'Flow Field' },
     { id: '003-my-sketch', name: 'My Sketch' },  // add this
   ]
   ```

4. Navigate to http://localhost:5173/003-my-sketch/

## Keyboard Shortcuts

While viewing a sketch:
- **S** — Save as SVG
- **C** — Clear and redraw (useful for randomized sketches)

## Utilities

Import from `lib/utils.js`:
- `setupPaper(canvasId)` — Initialize Paper.js
- `saveSVG(filename?)` — Export current canvas as SVG
- `clear()` — Clear the canvas
- `setupKeys(drawFn)` — Set up keyboard shortcuts
- `random(min, max)` — Random float
- `randomInt(min, max)` — Random integer
- `randomChoice(array)` — Pick random item
- `map(value, inMin, inMax, outMin, outMax)` — Remap value
- `clamp(value, min, max)` — Constrain value
- `lerp(a, b, t)` — Linear interpolation

Import from `lib/noise.js`:
- `createNoise(seed?)` — Create a noise generator
- `noise.noise2D(x, y)` — 2D Perlin noise (-1 to 1)
- `noise.noise3D(x, y, z)` — 3D noise (useful for animating 2D)

## Plotter Workflow

Once you have an SVG you like:

1. Install vpype: `pip install vpype`
2. Optimize for plotting:
   ```bash
   vpype read sketch.svg linemerge linesort write optimized.svg
   ```
3. Plot via Inkscape or your plotter's software

## Project Structure

```
sketches/
├── index.html          # Gallery page
├── lib/
│   ├── utils.js        # Common utilities
│   └── noise.js        # Noise functions
├── 001-circles/
│   ├── index.html
│   └── sketch.js
├── 002-flow-field/
│   ├── index.html
│   └── sketch.js
└── ...
```
