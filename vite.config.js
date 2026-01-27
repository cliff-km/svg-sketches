import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readdirSync, statSync } from 'fs'

// Auto-discover sketch folders
function getSketchEntries() {
  const entries = {
    main: resolve(__dirname, 'index.html')
  }
  
  const sketchDirs = readdirSync(__dirname).filter(f => {
    const path = resolve(__dirname, f)
    return statSync(path).isDirectory() && 
           f.match(/^\d{3}-/) && 
           readdirSync(path).includes('index.html')
  })
  
  for (const dir of sketchDirs) {
    entries[dir] = resolve(__dirname, dir, 'index.html')
  }
  
  return entries
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: getSketchEntries()
    }
  }
})
