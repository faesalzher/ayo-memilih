import * as THREE from 'three'
import { SIMULATION_CANDIDATES } from '../../config/candidates'
import type { SimulationCandidate } from '../../config/candidates'
import { canvasToTexture, disposeTextures, rasterizeSvg, svgToTexture } from './svgTexture'
import type { RasterizedSvg } from './svgTexture'
import ayoLogoSvg from './assets/AyoMemilihLogo.svg?raw'
import ballotCoverSvg from './assets/BallotCover.svg?raw'
import candidateColumnSvg from './assets/CandidateColumn.svg?raw'
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

function applyBrandMarks(svg: string, largeHeader = false) {
  return svg
    .replace('<g id="kpu-logo-slot"/>', inlineLogo(kpuLogoSvg, largeHeader ? 38 : 34, largeHeader ? 70 : 48, largeHeader ? 110 : 94, largeHeader ? 110 : 94))
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
  const [blank, foldedCover, openCover, info, header] = await Promise.all([
    rasterizeSvg(outerLeftSvg, 512 * TEXTURE_SCALE, 640 * TEXTURE_SCALE),
    rasterizeSvg(applyBrandMarks(ballotCoverSvg), 512 * TEXTURE_SCALE, 640 * TEXTURE_SCALE),
    rasterizeSvg(applyBrandMarks(outerCoverSvg), 512 * TEXTURE_SCALE, 640 * TEXTURE_SCALE),
    rasterizeSvg(outerInformationSvg, 512 * TEXTURE_SCALE, 640 * TEXTURE_SCALE),
    rasterizeSvg(applyBrandMarks(innerHeaderSvg, true), 1536 * TEXTURE_SCALE, 640 * TEXTURE_SCALE),
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

function textLines(value: string, x: number, startY = 458, maximumCharacters = 17) {
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
  return lines.slice(0, 3).map((text, index) => `<tspan x="${x}" y="${startY + index * 21}">${escapeXml(text)}</tspan>`).join('')
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

function placeholderPortrait(candidate: SimulationCandidate) {
  return `<g>
    <path d="M22 296h468v96H22z" fill="#c92724" opacity=".28"/>
    <path d="M60 392c4-91 39-141 108-141s104 50 108 141" fill="${escapeXml(candidate.shirt)}"/>
    <circle cx="168" cy="225" r="61" fill="${escapeXml(candidate.skin)}"/>
    <path d="M107 215c3-60 113-73 122 3-25-19-72-17-122-3" fill="#392a2a"/>
    <circle cx="344" cy="225" r="61" fill="${escapeXml(candidate.runningMateSkin)}"/>
    <path d="M283 215c3-60 113-73 122 3-25-19-72-17-122-3" fill="#392a2a"/>
    <path d="M236 392c4-91 39-141 108-141s104 50 108 141" fill="${escapeXml(candidate.runningMateShirt)}"/>
    <path d="M141 232h54M317 232h54" stroke="#342a2a" stroke-width="7" stroke-linecap="round"/>
    <path d="M151 260q17 14 34 0M327 260q17 14 34 0" fill="none" stroke="#8b4b4a" stroke-width="5" stroke-linecap="round"/>
  </g>`
}

function candidateSvg(candidate: SimulationCandidate, photo: string) {
  const photoMarkup = photo ? `<image href="${photo}" x="22" y="94" width="468" height="298" preserveAspectRatio="xMidYMid slice" clip-path="url(#photo-clip)"/>` : ''
  const source = candidateColumnSvg
    .replace('{{NUMBER}}', escapeXml(candidate.number))
    .replace('{{ACCENT}}', escapeXml(candidate.accent))
    .replace('{{PHOTO}}', photoMarkup)
    .replace('{{PLACEHOLDER}}', photo ? '' : placeholderPortrait(candidate))
    .replace('{{NAME_LINES}}', textLines(candidate.name.toUpperCase(), 139))
    .replace('{{MATE_LINES}}', textLines(candidate.runningMate.toUpperCase(), 373))
  return source
}

export async function createCandidateBallotTextures(candidateIndexes = SIMULATION_CANDIDATES.map((_candidate, index) => index)): Promise<BallotTextures> {
  const validIndexes = candidateIndexes.filter((index) => index >= 0 && index < SIMULATION_CANDIDATES.length)
  const entries = await Promise.all(validIndexes.map(async (index) => {
    const candidate = SIMULATION_CANDIDATES[index]
    if (!candidate) return null
    const key = (`candidate-${String(index + 1).padStart(2, '0')}`) as PanelKind
    const photo = await photoAsDataUri(candidate.photo)
    return [key, await svgToTexture(candidateSvg(candidate, photo), 512 * TEXTURE_SCALE, 640 * TEXTURE_SCALE)] as const
  }))
  return Object.fromEntries(entries.filter((entry) => entry !== null)) as BallotTextures
}

export function disposeBallotTextures(textures: BallotTextures) {
  disposeTextures(Object.values(textures))
}
