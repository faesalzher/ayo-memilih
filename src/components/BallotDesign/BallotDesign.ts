import * as THREE from 'three'
import { CANDIDATES } from '../../data/candidates'
import type { Candidate } from '../../data/candidates'
import { canvasToTexture, disposeTextures, rasterizeSvg, svgToTexture } from './svgTexture'
import type { RasterizedSvg } from './svgTexture'
import ayoLogoSvg from './assets/AyoMemilihLogo.svg?raw'
import ballotCoverSvg from './assets/BallotCover.svg?raw'
import candidateColumnSvg from './assets/CandidateColumn.svg?raw'
import ballotCandidateBackground from '../../assets/candidates/bg-ballot-candidate.png'
import innerHeaderSvg from './assets/InnerHeader.svg?raw'
import outerCoverSvg from './assets/OuterCover.svg?raw'
import outerInformationSvg from './assets/OuterInformation.svg?raw'
import outerLeftSvg from './assets/OuterLeft.svg?raw'
import kpuLogoSvg from './assets/KpuLogo.svg?raw'

export type PanelKind =
  | 'blank'
  | 'cover-folded'
  | 'cover-open'
  | 'info'
  | 'header-left'
  | 'header-center'
  | 'header-right'
  | 'candidate-01'
  | 'candidate-02'
  | 'candidate-03'

export type BallotTextures = Partial<Record<PanelKind, THREE.CanvasTexture>>

const TEXTURE_SCALE = 2

function inlineLogo(source: string, x: number, y: number, width: number, height: number) {
  const viewBox = source.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 100 100'
  const content = source.replace(/^.*?<svg\b[^>]*>/s, '').replace(/<\/svg>\s*$/, '')
  return `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="${viewBox}">${content}</svg>`
}

function applyBrandMarks(svg: string, logo: string, largeHeader = false) {
  const x = largeHeader ? 38 : 34
  const y = largeHeader ? 70 : 48
  const size = largeHeader ? 110 : 94
  const kpuLogo = logo
    ? `<image href="${logo}" x="${x}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>`
    : inlineLogo(kpuLogoSvg, x, y, size, size)
  return svg
    .replace('<g id="kpu-logo-slot"/>', kpuLogo)
    .replace('<g id="ayo-logo-slot"/>', inlineLogo(ayoLogoSvg, largeHeader ? 1388 : 380, largeHeader ? 70 : 48, largeHeader ? 110 : 94, largeHeader ? 90 : 78))
}

function disposeRasterized(rasterized: RasterizedSvg[]) {
  rasterized.forEach(({ dispose }) => dispose())
}

function makeHeaderPanelTextures(canvas: HTMLCanvasElement) {
  const panelWidth = canvas.width / 3
  return [0, 1, 2].map((column) => {
    const panelCanvas = document.createElement('canvas')
    panelCanvas.width = 512 * TEXTURE_SCALE
    panelCanvas.height = 640 * TEXTURE_SCALE
    const context = panelCanvas.getContext('2d')
    context?.drawImage(canvas, column * panelWidth, 0, panelWidth, canvas.height, 0, 0, panelCanvas.width, panelCanvas.height)
    return canvasToTexture(panelCanvas)
  })
}

export async function createStaticBallotTextures(): Promise<BallotTextures> {
  const kpuLogo = await photoAsDataUri('/idle-assets/kpu-logo.png')
  const [blank, foldedCover, openCover, info, header] = await Promise.all([
    rasterizeSvg(outerLeftSvg, 512 * TEXTURE_SCALE, 640 * TEXTURE_SCALE),
    rasterizeSvg(applyBrandMarks(ballotCoverSvg, kpuLogo), 512 * TEXTURE_SCALE, 640 * TEXTURE_SCALE),
    rasterizeSvg(applyBrandMarks(outerCoverSvg, kpuLogo), 512 * TEXTURE_SCALE, 640 * TEXTURE_SCALE),
    rasterizeSvg(outerInformationSvg, 512 * TEXTURE_SCALE, 640 * TEXTURE_SCALE),
    rasterizeSvg(applyBrandMarks(innerHeaderSvg, kpuLogo, true), 1536 * TEXTURE_SCALE, 640 * TEXTURE_SCALE),
  ])
  const headerTextures = makeHeaderPanelTextures(header.canvas)
  const textures: BallotTextures = {
    blank: canvasToTexture(blank.canvas),
    'cover-folded': canvasToTexture(foldedCover.canvas),
    'cover-open': canvasToTexture(openCover.canvas),
    info: canvasToTexture(info.canvas),
    'header-left': headerTextures[0],
    'header-center': headerTextures[1],
    'header-right': headerTextures[2],
  }
  disposeRasterized([blank, foldedCover, openCover, info, header])
  return textures
}

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[character] ?? character)
}

function textLines(value: string, x: number, maximumCharacters = 15) {
  const words = value.trim().split(/\s+/)
  const lines: string[] = []
  let line = ''
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word
    if (line && next.length > maximumCharacters) {
      lines.push(line)
      line = word
    } else line = next
  })
  if (line) lines.push(line)
  const visibleLines = lines.slice(0, 3)
  const startY = 526 - (visibleLines.length - 1) * 13
  return visibleLines.map((text, index) => `<tspan x="${x}" y="${startY + index * 26}">${escapeXml(text)}</tspan>`).join('')
}

const candidatePhotoData = new Map<string, Promise<string>>()

async function photoAsDataUri(photo: string | null) {
  if (!photo) return ''
  const cachedPhoto = candidatePhotoData.get(photo)
  if (cachedPhoto) return cachedPhoto
  const photoData = (async () => {
    try {
      const response = await fetch(photo)
      if (!response.ok) return ''
      const blob = await response.blob()
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
        reader.onerror = () => reject(new Error(`Unable to read candidate photo: ${photo}`))
        reader.readAsDataURL(blob)
      })
    } catch {
      return ''
    }
  })()
  candidatePhotoData.set(photo, photoData)
  return photoData
}

function candidateSvg(candidate: Candidate, photo: string, background: string) {
  const backgroundMarkup = background ? `<image href="${background}" x="22" y="94" width="468" height="298" preserveAspectRatio="xMidYMid slice" clip-path="url(#photo-clip)"/>` : ''
  const photoMarkup = photo ? `<image href="${photo}" x="22" y="94" width="468" height="298" preserveAspectRatio="xMidYMid meet" clip-path="url(#photo-clip)"/>` : ''
  const source = candidateColumnSvg
    .replace('{{NUMBER}}', escapeXml(String(candidate.number).padStart(2, '0')))
    .replace('{{ACCENT}}', escapeXml(candidate.accentColor))
    .replace('{{PHOTO}}', backgroundMarkup + photoMarkup)
    .replace('{{PLACEHOLDER}}', '')
    .replace('{{NAME_LINES}}', textLines(candidate.name.toUpperCase(), 139))
    .replace('{{MATE_LINES}}', textLines(candidate.viceName.toUpperCase(), 373))
  return source
}

export async function createCandidateBallotTextures(candidateIndexes = CANDIDATES.map((_candidate, index) => index)): Promise<BallotTextures> {
  const validIndexes = candidateIndexes.filter((index) => index >= 0 && index < CANDIDATES.length)
  const entries = await Promise.all(validIndexes.map(async (index) => {
    const candidate = CANDIDATES[index]
    if (!candidate) return null
    const key = (`candidate-${String(index + 1).padStart(2, '0')}`) as PanelKind
    const photo = await photoAsDataUri(candidate.ballotImage)
    const background = await photoAsDataUri(ballotCandidateBackground)
    return [key, await svgToTexture(candidateSvg(candidate, photo, background), 512 * TEXTURE_SCALE, 640 * TEXTURE_SCALE)] as const
  }))
  return Object.fromEntries(entries.filter((entry) => entry !== null)) as BallotTextures
}

export function disposeBallotTextures(textures: BallotTextures) {
  disposeTextures(Object.values(textures))
}
