import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { RootState } from '@react-three/fiber'
import type { BallotPhase, PunchState, PunchTarget } from './ballotTypes'
import { animatePaperPhase } from './PaperAnimation'
import type { PaperAnimationRefs } from './PaperAnimation'
import { createCandidateBallotTextures, createStaticBallotTextures, disposeBallotTextures } from '../BallotDesign/BallotDesign'
import type { BallotTextures, PanelKind } from '../BallotDesign/BallotDesign'
import { SIMULATION_CANDIDATES } from '../../config/candidates'
import './Ballot3D.css'

type Props = {
  phase: BallotPhase
  selectedCandidate: string | null
  punchTarget: PunchTarget | null
  onOpenComplete?: () => void
  onFlipComplete?: () => void
  onRefoldOuterComplete?: () => void
  onFoldComplete?: () => void
  punchState: PunchState
  onPunchComplete?: () => void
  compact?: boolean
}

const PANEL_WIDTH = 1.68
const PANEL_HEIGHT = 2
const PAPER_THICKNESS = 0.004

function makePaperGeometry(width: number, height: number, corners: readonly boolean[], radius = 0.08) {
  const left = -width / 2
  const right = width / 2
  const bottom = -height / 2
  const top = height / 2
  const [topLeft, topRight, bottomRight, bottomLeft] = corners.map((corner) => corner ? radius : 0)
  const shape = new THREE.Shape()
  shape.moveTo(left + bottomLeft, bottom)
  shape.lineTo(right - bottomRight, bottom)
  shape.quadraticCurveTo(right, bottom, right, bottom + bottomRight)
  shape.lineTo(right, top - topRight)
  shape.quadraticCurveTo(right, top, right - topRight, top)
  shape.lineTo(left + topLeft, top)
  shape.quadraticCurveTo(left, top, left, top - topLeft)
  shape.lineTo(left, bottom + bottomLeft)
  shape.quadraticCurveTo(left, bottom, left + bottomLeft, bottom)
  const geometry = new THREE.ShapeGeometry(shape, 12)
  const positions = geometry.getAttribute('position')
  const uvs = geometry.getAttribute('uv')
  for (let index = 0; index < positions.count; index += 1) {
    uvs.setXY(index, positions.getX(index) / width + 0.5, positions.getY(index) / height + 0.5)
  }
  return geometry
}

function makeTornPaperHole() {
  const outer = new THREE.Shape()
  const inner = new THREE.Shape()
  const sides = 18
  for (let i = 0; i < sides; i += 1) {
    const angle = (i / sides) * Math.PI * 2
    const radius = 0.073 * (1 + 0.11 * Math.sin(i * 2.17) + 0.055 * Math.cos(i * 3.31))
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius * 0.9
    if (i === 0) outer.moveTo(x, y)
    else outer.lineTo(x, y)
  }
  outer.closePath()
  for (let i = sides - 1; i >= 0; i -= 1) {
    const angle = (i / sides) * Math.PI * 2
    const radius = 0.047 * (1 + 0.1 * Math.sin(i * 2.17 + 0.4))
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius * 0.9
    if (i === sides - 1) inner.moveTo(x, y)
    else inner.lineTo(x, y)
  }
  inner.closePath()
  outer.holes.push(inner)
  return {
    fiber: new THREE.ShapeGeometry(outer, 24),
    center: new THREE.ShapeGeometry(inner, 24),
  }
}

function usePrintedTextures() {
  const [textures, setTextures] = useState<BallotTextures>({})
  const ownedTextures = useRef(new Set<THREE.CanvasTexture>())
  const textureMap = useRef<BallotTextures>({})

  useEffect(() => {
    let active = true
    createStaticBallotTextures().then((staticTextures) => {
      if (!active) {
        disposeBallotTextures(staticTextures)
        return
      }
      Object.values(staticTextures).forEach((texture) => texture && ownedTextures.current.add(texture))
      textureMap.current = { ...textureMap.current, ...staticTextures }
      setTextures({ ...textureMap.current })
    }).catch((error: unknown) => console.error('Failed to create static ballot artwork', error))
    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true
    createCandidateBallotTextures().then((candidateTextures) => {
      if (!active) {
        disposeBallotTextures(candidateTextures)
        return
      }
      Object.entries(candidateTextures).forEach(([key, texture]) => {
        if (!texture) return
        const oldTexture = textureMap.current[key as PanelKind]
        if (oldTexture && oldTexture !== texture) {
          oldTexture.dispose()
          ownedTextures.current.delete(oldTexture)
        }
        ownedTextures.current.add(texture)
      })
      textureMap.current = { ...textureMap.current, ...candidateTextures }
      setTextures({ ...textureMap.current })
    }).catch((error: unknown) => console.error('Failed to create candidate ballot artwork', error))
    return () => { active = false }
  }, [])

  useEffect(() => () => {
    ownedTextures.current.forEach((texture) => texture.dispose())
    ownedTextures.current.clear()
    textureMap.current = {}
  }, [])

  return textures
}

function PaperRig({ phase, selectedCandidate, punchTarget, onOpenComplete, onFlipComplete, onRefoldOuterComplete, onFoldComplete, punchState, onPunchComplete }: Props) {
  const root = useRef<THREE.Group>(null)
  const leftTop = useRef<THREE.Group>(null)
  const rightTop = useRef<THREE.Group>(null)
  const bottomRow = useRef<THREE.Group>(null)
  const leftBottom = useRef<THREE.Group>(null)
  const rightBottom = useRef<THREE.Group>(null)
  const shadow = useRef<THREE.Mesh>(null)
  const pin = useRef<THREE.Group>(null)
  const [holeVisible, setHoleVisible] = useState(false)
  const textures = usePrintedTextures()
  const paperMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#fcfbf9', side: THREE.DoubleSide }), [])
  const paperGeometries = useMemo(() => {
    const corners = [[true, false, false, false], [false, true, false, false], [false, false, true, false], [false, false, false, true]]
    return {
      folded: makePaperGeometry(PANEL_WIDTH, PANEL_HEIGHT, [true, true, true, true], 0.12),
      corners: corners.map((corner) => makePaperGeometry(PANEL_WIDTH, PANEL_HEIGHT, corner)),
    }
  }, [])
  const creaseTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 1
    const context = canvas.getContext('2d')!
    const gradient = context.createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop(0, 'rgba(0,0,0,0)')
    gradient.addColorStop(0.42, 'rgba(0,0,0,0.06)')
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.55)')
    gradient.addColorStop(0.58, 'rgba(0,0,0,0.015)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, canvas.width, 1)
    return new THREE.CanvasTexture(canvas)
  }, [])
  const shadowTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 96
    const context = canvas.getContext('2d')
    if (context) {
      const gradient = context.createRadialGradient(128, 48, 8, 128, 48, 128)
      gradient.addColorStop(0, 'rgba(72,42,35,.24)')
      gradient.addColorStop(0.58, 'rgba(72,42,35,.12)')
      gradient.addColorStop(1, 'rgba(72,42,35,0)')
      context.fillStyle = gradient
      context.fillRect(0, 0, 256, 96)
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }, [])
  const nailMetal = useMemo(() => new THREE.MeshStandardMaterial({ color: '#aab3b8', metalness: 0.72, roughness: 0.28 }), [])
  const nailHeadMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#d4d9db', metalness: 0.78, roughness: 0.24 }), [])
  const tornHole = useMemo(() => makeTornPaperHole(), [])
  const holeFiberGeometry = tornHole.fiber
  const holeCenterGeometry = tornHole.center

  useLayoutEffect(() => {
    const refs = [root.current, leftTop.current, rightTop.current, bottomRow.current, leftBottom.current, rightBottom.current, shadow.current]
    if (refs.some((ref) => !ref)) return
    return animatePaperPhase(phase, {
      root: root.current!,
      leftTop: leftTop.current!,
      rightTop: rightTop.current!,
      bottomRow: bottomRow.current!,
      leftBottom: leftBottom.current!,
      rightBottom: rightBottom.current!,
      shadow: shadow.current!,
    } satisfies PaperAnimationRefs, onOpenComplete, onFlipComplete, onRefoldOuterComplete, onFoldComplete)
  }, [phase, onOpenComplete, onFlipComplete, onRefoldOuterComplete, onFoldComplete])

  useLayoutEffect(() => {
    if (punchState !== 'punching' || !pin.current || !root.current || !punchTarget || !selectedCandidate) return

    const pinGroup = pin.current
    const paper = root.current
    // The hole is placed in the rotated paper's local coordinates at
    // (-screenX, screenY), which maps back to world (+screenX, screenY).
    // The nail is a scene-level group, so use that resulting world position.
    // Keep its long axis in the screen plane (Y): a Z-aligned nail points
    // straight at the camera and reads only as a tiny circle.
    gsap.set(pinGroup.position, {
      x: punchTarget.screenX,
      y: punchTarget.screenY + 0.92,
      z: 0.72,
    })
    pinGroup.visible = true

    const timeline = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: () => {
        pinGroup.visible = false
        onPunchComplete?.()
      },
    })
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) timeline.timeScale(4)
    timeline.to(pinGroup.position, {
      y: punchTarget.screenY + 0.34,
      z: 0.18,
      duration: 0.42,
      ease: 'power2.in',
    })
    timeline.call(() => {
      gsap.to(paper.position, { z: -0.025, duration: 0.07, yoyo: true, repeat: 1, ease: 'power1.out' })
    })
    timeline.to(pinGroup.position, {
      y: punchTarget.screenY + 0.28,
      z: 0.07,
      duration: 0.09,
      ease: 'power1.in',
    })
    timeline.call(() => setHoleVisible(true))
    timeline.to(pinGroup.position, {
      y: punchTarget.screenY + 0.92,
      z: 0.72,
      duration: 0.42,
      ease: 'power2.out',
    })
    return () => { timeline.kill() }
  }, [punchState, selectedCandidate, punchTarget, onPunchComplete])

  useEffect(() => () => {
    paperMaterial.dispose()
    paperGeometries.folded.dispose()
    paperGeometries.corners.forEach((geometry) => geometry.dispose())
    creaseTexture.dispose()
    shadowTexture.dispose()
    nailMetal.dispose()
    nailHeadMaterial.dispose()
    holeFiberGeometry.dispose()
    holeCenterGeometry.dispose()
  }, [paperMaterial, paperGeometries, creaseTexture, shadowTexture, nailMetal, nailHeadMaterial, holeFiberGeometry, holeCenterGeometry])

  const coverKind: PanelKind = phase === 'outer-open' || phase === 'flipping-inner' || phase === 'opened' || phase === 'refolding-outer' || phase === 'folding-cover'
    ? 'cover-open'
    : 'cover-folded'

  const panel = (kind: PanelKind, backKind: PanelKind, position: [number, number, number], corner?: number, edges: readonly ('left' | 'right' | 'top' | 'bottom')[] = []) => {
    const candidateNumber = backKind.startsWith('candidate-')
      ? SIMULATION_CANDIDATES[Number(backKind.slice(-2)) - 1]?.number
      : undefined
    const dimCandidate = Boolean(selectedCandidate && candidateNumber && candidateNumber !== selectedCandidate)
    const geometry = kind === 'cover-folded' ? paperGeometries.folded : corner === undefined ? undefined : paperGeometries.corners[corner]
    const backGeometry = kind === 'cover-folded' ? paperGeometries.folded : corner === undefined ? undefined : paperGeometries.corners[[1, 0, 3, 2][corner]]
    return <group position={position}>
    {phase !== 'folded-cover' && <>
      <mesh position={[0, -0.08, -0.012]} geometry={geometry}>{!geometry && <planeGeometry args={[PANEL_WIDTH, PANEL_HEIGHT]}/>}<meshBasicMaterial color="#D3C9B6" side={THREE.FrontSide} depthWrite={false}/></mesh>
      <mesh position={[0, -0.08, 0.012]} geometry={geometry}>{!geometry && <planeGeometry args={[PANEL_WIDTH, PANEL_HEIGHT]}/>}<meshBasicMaterial color="#D3C9B6" side={THREE.BackSide} depthWrite={false}/></mesh>
    </>}
    <mesh material={paperMaterial} geometry={geometry}>{!geometry && <planeGeometry args={[PANEL_WIDTH, PANEL_HEIGHT]}/>}</mesh>
    {textures[kind] && <mesh position={[0, 0, PAPER_THICKNESS / 2 + 0.001]} geometry={geometry}>{!geometry && <planeGeometry args={[PANEL_WIDTH, PANEL_HEIGHT]}/>}<meshBasicMaterial key={textures[kind]!.uuid} map={textures[kind]} toneMapped={false} side={THREE.DoubleSide}/></mesh>}
    {textures[backKind] && <mesh position={[0, 0, -PAPER_THICKNESS / 2 - 0.001]} rotation={[0, Math.PI, 0]} geometry={backGeometry}>{!backGeometry && <planeGeometry args={[PANEL_WIDTH, PANEL_HEIGHT]}/>}<meshBasicMaterial key={textures[backKind]!.uuid} map={textures[backKind]} toneMapped={false} side={THREE.DoubleSide}/></mesh>}
    {dimCandidate && <mesh position={[0, 0, -PAPER_THICKNESS / 2 - 0.003]} rotation={[0, Math.PI, 0]} geometry={backGeometry}>{!backGeometry && <planeGeometry args={[PANEL_WIDTH, PANEL_HEIGHT]}/>}<meshBasicMaterial color="#5b4a43" transparent opacity={0.24} depthWrite={false} side={THREE.DoubleSide}/></mesh>}
    {phase !== 'folded-cover' && edges.flatMap((edge) => [1, -1].map((side) => {
      const vertical = edge === 'left' || edge === 'right'
      const x = edge === 'left' ? -PANEL_WIDTH / 2 : edge === 'right' ? PANEL_WIDTH / 2 : 0
      const y = edge === 'top' ? PANEL_HEIGHT / 2 : edge === 'bottom' ? -PANEL_HEIGHT / 2 : 0
      return <mesh key={`${edge}-${side}`} position={[x, y, side * 0.008]} rotation={[0, 0, vertical ? 0 : Math.PI / 2]}>
        <planeGeometry args={[0.16, vertical ? PANEL_HEIGHT : PANEL_WIDTH]} />
        <meshBasicMaterial map={creaseTexture} transparent depthWrite={false} side={side === 1 ? THREE.FrontSide : THREE.BackSide} />
      </mesh>
    }))}
  </group>
  }

  const chosenIndex = selectedCandidate ? SIMULATION_CANDIDATES.findIndex((candidate) => candidate.number === selectedCandidate) : -1
  const holeX = punchTarget ? -punchTarget.screenX : 0
  const holeZ = -PAPER_THICKNESS / 2 - 0.006

  // Don't show the untextured paper core: it looks like a blank white ballot
  // while SVG artwork is still rasterizing or if a texture hasn't arrived yet.
  return <>
  <group ref={root} visible={Boolean(textures['cover-folded'])}>
    {(phase === 'folded-cover' || phase === 'opening-outer-fold' || phase === 'folding-cover') && <group position={[0, PANEL_HEIGHT / 2, -0.02]}>
      <mesh geometry={paperGeometries.folded} position={[0, -0.1, -0.004]} scale={[1.02, 1.02, 1]}><meshBasicMaterial color="#b9aa91" side={THREE.DoubleSide} /></mesh>
      <mesh geometry={paperGeometries.folded} scale={[1.02, 1.02, 1]}><meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} /></mesh>
    </group>}
    <group ref={leftTop} visible={phase !== 'folded-cover'} position={[-PANEL_WIDTH / 2, PANEL_HEIGHT / 2, 0]}>{panel('blank', 'header-right', [-PANEL_WIDTH / 2, 0, 0], 0, ['right', 'bottom'])}</group>
    {panel(coverKind, 'header-center', [0, PANEL_HEIGHT / 2, 0], undefined, ['left', 'right', 'bottom'])}
    <group ref={rightTop} visible={phase !== 'folded-cover'} position={[PANEL_WIDTH / 2, PANEL_HEIGHT / 2, 0]}>{panel('info', 'header-left', [PANEL_WIDTH / 2, 0, 0], 1, ['left', 'bottom'])}</group>
    <group ref={bottomRow} visible={phase !== 'folded-cover'}>
      <group ref={leftBottom} position={[-PANEL_WIDTH / 2, -PANEL_HEIGHT / 2, 0]}>{panel('blank', 'candidate-03', [-PANEL_WIDTH / 2, 0, 0], 3, ['right', 'top'])}</group>
      {panel('blank', 'candidate-02', [0, -PANEL_HEIGHT / 2, 0], undefined, ['left', 'right', 'top'])}
      <group ref={rightBottom} position={[PANEL_WIDTH / 2, -PANEL_HEIGHT / 2, 0]}>{panel('blank', 'candidate-01', [PANEL_WIDTH / 2, 0, 0], 2, ['left', 'top'])}</group>
    </group>
    {phase === 'opened' && chosenIndex >= 0 && punchTarget && <group position={[holeX, punchTarget.screenY, holeZ]} rotation={[0, Math.PI, 0]} visible={holeVisible || punchState === 'punched' || punchState === 'completed'}>
      <mesh position={[0, 0, -0.002]} scale={1.16} geometry={holeFiberGeometry}><meshBasicMaterial color="#55483c" side={THREE.DoubleSide}/></mesh>
      <mesh geometry={holeFiberGeometry}><meshBasicMaterial color="#d1c6b4" side={THREE.DoubleSide}/></mesh>
      <mesh position={[0, 0, 0.001]} geometry={holeCenterGeometry}><meshBasicMaterial color="#211916" side={THREE.DoubleSide}/></mesh>
    </group>}
    <mesh ref={shadow} position={[0, -0.12, -0.18]} scale={[0.72, 0.32, 1]}><planeGeometry args={[2, 0.65]}/><meshBasicMaterial map={shadowTexture} transparent opacity={0.86} toneMapped={false}/></mesh>
  </group>
  <group ref={pin} visible={false}>
    <group rotation={[0.34, 0, 0]}>
      <mesh castShadow position={[0, 0.18, 0]} material={nailHeadMaterial}><cylinderGeometry args={[0.085, 0.085, 0.055, 28]}/></mesh>
      <mesh castShadow position={[0, 0.125, 0]} material={nailMetal}><cylinderGeometry args={[0.057, 0.067, 0.045, 24]}/></mesh>
      <mesh castShadow position={[0, -0.055, 0]} material={nailMetal}><cylinderGeometry args={[0.027, 0.027, 0.315, 20]}/></mesh>
      <mesh castShadow position={[0, -0.245, 0]} rotation={[0, 0, Math.PI]} material={nailHeadMaterial}><coneGeometry args={[0.027, 0.105, 20]}/></mesh>
    </group>
  </group>
  </>
}

export default function Ballot3D(props: Props) {
  const shellRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const fitCamera = useCallback((width: number, height: number) => {
    const camera = cameraRef.current
    if (!camera || width <= 0 || height <= 0) return
    camera.left = -width / 2
    camera.right = width / 2
    camera.top = height / 2
    camera.bottom = -height / 2
    camera.zoom = props.compact ? Math.min(width / 4, height / 4.65) : Math.min(width / 5.3, height / 4.4)
    camera.updateProjectionMatrix()
    rendererRef.current?.setSize(width, height, false)
  }, [props.compact])
  const handleCreated = useCallback((state: RootState) => {
    cameraRef.current = state.camera as THREE.OrthographicCamera
    rendererRef.current = state.gl
    const bounds = shellRef.current?.getBoundingClientRect()
    fitCamera(bounds?.width ?? state.size.width, bounds?.height ?? state.size.height)
  }, [fitCamera])

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return
    const syncSize = (width = shell.clientWidth, height = shell.clientHeight) => fitCamera(width, height)
    const observer = new ResizeObserver(([entry]) => syncSize(entry.contentRect.width, entry.contentRect.height))
    const handleWindowResize = () => syncSize()
    observer.observe(shell)
    window.addEventListener('resize', handleWindowResize)
    // Prompt R3F to measure the fixed-size kiosk viewport on its first mount.
    const initialResize = window.setTimeout(() => window.dispatchEvent(new Event('resize')), 0)
    return () => {
      window.clearTimeout(initialResize)
      window.removeEventListener('resize', handleWindowResize)
      observer.disconnect()
    }
  }, [fitCamera])

  return <div ref={shellRef} className={`ballot-3d-shell phase-${props.phase}`}>
    <Canvas shadows orthographic camera={{ position: [0, 0, 10], zoom: 1 }} onCreated={handleCreated} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={1.8}/>
      <directionalLight position={[-3, 5, 7]} intensity={1.15} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
      <PaperRig {...props}/>
    </Canvas>
  </div>
}
