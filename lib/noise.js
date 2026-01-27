/**
 * Simple 2D/3D Perlin-style noise
 * Based on Stefan Gustavson's simplex noise implementation
 */

class Noise {
  constructor(seed = Math.random() * 65536) {
    this.p = new Uint8Array(512)
    this.perm = new Uint8Array(512)
    
    // Initialize permutation table
    const p = new Uint8Array(256)
    for (let i = 0; i < 256; i++) p[i] = i
    
    // Shuffle with seed
    let s = seed
    for (let i = 255; i > 0; i--) {
      s = (s * 16807) % 2147483647
      const j = s % (i + 1)
      ;[p[i], p[j]] = [p[j], p[i]]
    }
    
    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255]
    }
  }
  
  // 2D noise, returns value between -1 and 1
  noise2D(x, y) {
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255
    
    x -= Math.floor(x)
    y -= Math.floor(y)
    
    const u = this.fade(x)
    const v = this.fade(y)
    
    const A = this.perm[X] + Y
    const B = this.perm[X + 1] + Y
    
    return this.lerp(
      this.lerp(this.grad2D(this.perm[A], x, y), this.grad2D(this.perm[B], x - 1, y), u),
      this.lerp(this.grad2D(this.perm[A + 1], x, y - 1), this.grad2D(this.perm[B + 1], x - 1, y - 1), u),
      v
    )
  }
  
  // 3D noise (useful for animating 2D noise over time)
  noise3D(x, y, z) {
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255
    const Z = Math.floor(z) & 255
    
    x -= Math.floor(x)
    y -= Math.floor(y)
    z -= Math.floor(z)
    
    const u = this.fade(x)
    const v = this.fade(y)
    const w = this.fade(z)
    
    const A = this.perm[X] + Y
    const AA = this.perm[A] + Z
    const AB = this.perm[A + 1] + Z
    const B = this.perm[X + 1] + Y
    const BA = this.perm[B] + Z
    const BB = this.perm[B + 1] + Z
    
    return this.lerp(
      this.lerp(
        this.lerp(this.grad3D(this.perm[AA], x, y, z), this.grad3D(this.perm[BA], x - 1, y, z), u),
        this.lerp(this.grad3D(this.perm[AB], x, y - 1, z), this.grad3D(this.perm[BB], x - 1, y - 1, z), u),
        v
      ),
      this.lerp(
        this.lerp(this.grad3D(this.perm[AA + 1], x, y, z - 1), this.grad3D(this.perm[BA + 1], x - 1, y, z - 1), u),
        this.lerp(this.grad3D(this.perm[AB + 1], x, y - 1, z - 1), this.grad3D(this.perm[BB + 1], x - 1, y - 1, z - 1), u),
        v
      ),
      w
    )
  }
  
  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }
  
  lerp(a, b, t) {
    return a + t * (b - a)
  }
  
  grad2D(hash, x, y) {
    const h = hash & 3
    const u = h < 2 ? x : y
    const v = h < 2 ? y : x
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v)
  }
  
  grad3D(hash, x, y, z) {
    const h = hash & 15
    const u = h < 8 ? x : y
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v)
  }
}

// Factory function for easy use
export function createNoise(seed) {
  return new Noise(seed)
}

export { Noise }
