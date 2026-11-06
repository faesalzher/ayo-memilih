import * as THREE from 'three'

export type RasterizedSvg = {
  canvas: HTMLCanvasElement
  dispose: () => void
}

export async function rasterizeSvg(svg: string, width: number, height: number): Promise<RasterizedSvg> {
  const sizedSvg = svg.replace(/<svg\b([^>]*)>/, (_root, attributes: string) => {
    const sizedAttributes = attributes
      .replace(/\swidth="[^"]*"/, '')
      .replace(/\sheight="[^"]*"/, '')
    return `<svg${sizedAttributes} width="${width}" height="${height}">`
  })
  const url = URL.createObjectURL(new Blob([sizedSvg], { type: 'image/svg+xml;charset=utf-8' }))
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const loadedImage = new Image()
      loadedImage.onload = () => resolve(loadedImage)
      loadedImage.onerror = () => reject(new Error('Unable to load ballot SVG texture'))
      loadedImage.src = url
    })
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Unable to create ballot texture canvas')
    context.drawImage(image, 0, 0, width, height)
    return { canvas, dispose: () => { image.src = '' } }
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function canvasToTexture(canvas: HTMLCanvasElement, anisotropy = 4) {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = anisotropy
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}

export async function svgToTexture(svg: string, width: number, height: number, anisotropy = 4) {
  const rasterized = await rasterizeSvg(svg, width, height)
  const texture = canvasToTexture(rasterized.canvas, anisotropy)
  rasterized.dispose()
  return texture
}

export function disposeTextures(textures: Iterable<THREE.CanvasTexture | undefined>) {
  Array.from(textures).forEach((texture) => texture?.dispose())
}
