import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { animate, motion, useAnimationControls, useMotionValue, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
const Ballot3D = lazy(() => import('../../components/Ballot3D/Ballot3D'))
import type { BallotPhase, PunchState, PunchTarget } from '../../components/Ballot3D/ballotTypes'
import BallotBoxImage from '../../img/ballot-box.png'
import { SIMULATION_CANDIDATES } from '../../config/candidates'
import ScreenBackground from '../../components/layout/ScreenBackground'
import FlowHeader from '../../components/layout/FlowHeader'
import FigmaAsset from '../../components/figma/FigmaAsset'
import { NavigationControls } from '../../components/navigation/NavigationControls'
import FlowFooter from '../../components/layout/FlowFooter'
import GuideArrowButton from '../../components/navigation/GuideArrowButton'
import TutorialBubble from '../../components/tutorial/TutorialBubble'
import '../../App.css'
import './OpenBallot.css'

const PANEL_WIDTH = 1.68
type FinaleStage = 'idle' | 'ballot-inserted' | 'centering-box' | 'voting-finished'

type OpenBallotProps = {
  onComplete?: (candidateNumber: string) => void
  onBack?: () => void
}

export default function OpenBallot({ onComplete, onBack }: OpenBallotProps) {
  const [phase, setPhase] = useState<BallotPhase>('folded-cover')
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)
  const [punchState, setPunchState] = useState<PunchState>('idle')
  const [punchTarget, setPunchTarget] = useState<PunchTarget | null>(null)
  const [deliveryReady, setDeliveryReady] = useState(false)
  const [finaleStage, setFinaleStage] = useState<FinaleStage>('idle')
  const [targetActive, setTargetActive] = useState(false)
  const [ballotReady, setBallotReady] = useState(false)
  const markBallotReady = useCallback(() => setBallotReady(true), [])
  const transitionLocked = useRef(false)
  const dropSlotRef = useRef<HTMLDivElement>(null)
  const ballotDragRef = useRef<HTMLDivElement>(null)
  const dragControls = useAnimationControls()
  const dragRotation = useMotionValue(0)
  const reduceMotion = useReducedMotion()
  const deposited = finaleStage !== 'idle'
  const outerOpen = phase === 'outer-open'
  const opened = phase === 'opened'
  const folding = phase === 'refolding-outer' || phase === 'folding-cover'

  const startOpening = useCallback(() => {
    if (transitionLocked.current || phase !== 'folded-cover' || deliveryReady) return
    transitionLocked.current = true
    setPhase('opening-outer-fold')
  }, [deliveryReady, phase])

  const finishOpening = useCallback(() => {
    if (!transitionLocked.current) return
    transitionLocked.current = false
    setPhase('outer-open')
  }, [])

  const startFlip = useCallback(() => {
    if (transitionLocked.current || phase !== 'outer-open') return
    transitionLocked.current = true
    setPhase('flipping-inner')
  }, [phase])

  const finishFlip = useCallback(() => {
    if (!transitionLocked.current) return
    transitionLocked.current = false
    setPhase('opened')
  }, [])

  const startRefold = useCallback(() => {
    if (phase !== 'opened' || punchState !== 'completed' || transitionLocked.current) return
    transitionLocked.current = true
    setPhase('refolding-outer')
  }, [phase, punchState])

  const startCoverFold = useCallback(() => setPhase('folding-cover'), [])

  const finishCoverFold = useCallback(() => {
    transitionLocked.current = false
    setPhase('folded-cover')
    setDeliveryReady(true)
  }, [])

  useEffect(() => {
    if (punchState !== 'candidate-selected') return
    const startPin = gsap.delayedCall(0.2, () => setPunchState('punching'))
    return () => { startPin.kill() }
  }, [punchState])

  useEffect(() => {
    let timer: number | undefined
    if (finaleStage === 'ballot-inserted') {
      timer = window.setTimeout(() => setFinaleStage('centering-box'), reduceMotion ? 50 : 520)
    } else if (finaleStage === 'centering-box') {
      timer = window.setTimeout(() => setFinaleStage('voting-finished'), reduceMotion ? 50 : 850)
    }
    return () => { if (timer !== undefined) window.clearTimeout(timer) }
  }, [finaleStage, reduceMotion])

  useEffect(() => {
    if (finaleStage === 'voting-finished' && selectedCandidate) onComplete?.(selectedCandidate)
  }, [finaleStage, onComplete, selectedCandidate])

  const finishPunch = useCallback(() => {
    transitionLocked.current = false
    setPunchState('punched')
    requestAnimationFrame(() => setPunchState('completed'))
  }, [])

  const handlePaperTouch = (event: PointerEvent<HTMLDivElement>) => {
    if (deliveryReady) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height

    if (phase === 'folded-cover') {
      const coverHalfWidth = Math.min(0.48, 0.1764 * bounds.height / bounds.width + 0.025)
      if (Math.abs(x - 0.5) <= coverHalfWidth && Math.abs(y - 0.5) <= 0.24) startOpening()
      return
    }

    if (phase !== 'opened' || punchState !== 'idle' || transitionLocked.current) return

    // Match pointer coordinates to the printed photograph region of the sheet.
    const zoom = Math.min(bounds.width / 5.45, bounds.height / 4.45)
    const sheetWidth = 5.04 * zoom / bounds.width
    const sheetHeight = 4 * zoom / bounds.height
    const sheetLeft = (1 - sheetWidth) / 2
    const sheetTop = (1 - sheetHeight) / 2
    const photoTop = sheetTop + 2.294 * zoom / bounds.height
    const photoBottom = sheetTop + 3.225 * zoom / bounds.height
    if (y < photoTop || y > photoBottom || x < sheetLeft || x > sheetLeft + sheetWidth) return

    const columnWidth = sheetWidth / 3
    const column = Math.floor((x - sheetLeft) / columnWidth)
    const candidate = SIMULATION_CANDIDATES[column]
    if (!candidate || column < 0 || column > 2) return

    const columnX = x - (sheetLeft + column * columnWidth)
    const imageLeft = 22 / 512 * columnWidth
    const imageWidth = 468 / 512 * columnWidth
    if (columnX < imageLeft || columnX > imageLeft + imageWidth) return

    const imageX = (columnX - imageLeft) / imageWidth
    const imageY = (y - photoTop) / (photoBottom - photoTop)
    const target: PunchTarget = {
      screenX: (column - 1) * PANEL_WIDTH + (imageX - 0.5) * PANEL_WIDTH,
      screenY: -0.294 - imageY * 0.931,
    }

    transitionLocked.current = true
    setSelectedCandidate(candidate.number)
    setPunchTarget(target)
    setPunchState('candidate-selected')
  }

  const isOverDropSlot = (point: { x: number; y: number }, padding: number) => {
    const rect = dropSlotRef.current?.getBoundingClientRect()
    if (!rect) return false
    return point.x >= rect.left - padding && point.x <= rect.right + padding &&
      point.y >= rect.top - padding && point.y <= rect.bottom + padding
  }

  const handleBallotDrag = (_event: unknown, info: { point: { x: number; y: number }; offset: { x: number } }) => {
    if (!deliveryReady || deposited) return
    dragRotation.set(Math.max(-5, Math.min(5, info.offset.x * 0.025)))
    setTargetActive(isOverDropSlot(info.point, 14))
  }

  const finishBallotDrag = (_event: unknown, info: { point: { x: number; y: number }; offset: { x: number; y: number } }) => {
    if (!deliveryReady || deposited) return
    const droppedInSlot = isOverDropSlot(info.point, 10)
    setTargetActive(false)
    if (droppedInSlot) {
      setFinaleStage('ballot-inserted')
      const ballotRect = ballotDragRef.current?.getBoundingClientRect()
      const slotRect = dropSlotRef.current?.getBoundingClientRect()
      const xIntoSlot = ballotRect && slotRect
        ? info.offset.x + slotRect.left + slotRect.width / 2 - ballotRect.left - ballotRect.width / 2
        : info.offset.x
      const yIntoSlot = ballotRect && slotRect
        ? info.offset.y + slotRect.top + slotRect.height / 2 - ballotRect.top - ballotRect.height / 2
        : info.offset.y
      animate(dragRotation, 12, { duration: reduceMotion ? 0.01 : 0.3, ease: 'easeIn' })
      void dragControls.start({ x: xIntoSlot, y: yIntoSlot, scale: 0.12, opacity: 0, transition: { duration: reduceMotion ? 0.01 : 0.34, ease: 'easeIn' } })
    } else {
      animate(dragRotation, 0, { type: 'spring', stiffness: 260, damping: 24 })
      void dragControls.start({ x: 0, y: 0, scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 330, damping: 25 } })
    }
  }

  const selectedCandidateData = SIMULATION_CANDIDATES.find((candidate) => candidate.number === selectedCandidate)
  const instruction = deliveryReady
    ? 'Sentuh dan geser surat suara menuju lubang bagian atas kotak suara.'
    : folding
      ? 'Surat suara sedang dilipat kembali.'
      : opened
        ? punchState === 'completed'
          ? `Coblosan berhasil! Pilihanmu: ${selectedCandidateData?.name} ${selectedCandidateData?.runningMate}. Tekan panah kanan untuk melipat kembali surat suara.`
          : punchState === 'punching'
            ? 'Paku sedang mencoblos pilihanmu...'
            : punchState === 'candidate-selected'
              ? 'Pilihan terkunci. Paku bersiap mencoblos...'
              : 'Sentuh langsung gambar pasangan calon untuk mencoblos.'
        : outerOpen
          ? 'Lipatan terbuka. Tekan panah kanan untuk melihat sisi dalam surat suara.'
          : phase === 'flipping-inner'
            ? 'Membalik surat suara...'
            : phase === 'opening-outer-fold'
              ? 'Membuka lipatan surat suara...'
              : 'Sentuh surat suara untuk membuka lipatannya.'

  const finaleInProgress = finaleStage === 'ballot-inserted'
  const boxCentered = finaleStage === 'centering-box' || finaleStage === 'voting-finished'

  return <ScreenBackground as="main" className="app-shell voting-screen">
    <div className="app-content">
      <FlowHeader title="TENTUKAN PILIHANMU" subtitle="Yuk, praktikkan pilihanmu dan jadilah pemilih cerdas!" />
      <div className="flow-header-icon" aria-hidden="true">
        <FigmaAsset file="32d6e.png" left="0" top="0" width="100%" height="100%" />
      </div>
      <div className="voting-content-spacer" aria-hidden="true" />
      <section className={`ballot-stage${deliveryReady ? ' delivery-stage' : ''}${boxCentered ? ' finale-stage' : ''}`} aria-live="polite">
        <motion.div
          ref={ballotDragRef}
          className={`ballot-touch-wrapper${ballotReady ? ' is-ready' : ''}${deliveryReady && !deposited ? ' draggable-ballot' : ''}${deposited ? ' ballot-inserting' : ''}`}
          layout="position"
          transition={{ layout: { type: 'spring', stiffness: 230, damping: 26 } }}
          onPointerDownCapture={handlePaperTouch}
          drag={deliveryReady && !deposited}
          dragMomentum={false}
          dragElastic={0.08}
          animate={dragControls}
          style={{ rotate: dragRotation }}
          onDrag={handleBallotDrag}
          onDragEnd={finishBallotDrag}
          whileDrag={deliveryReady && !deposited ? { scale: 1.045, zIndex: 5, filter: 'drop-shadow(0 22px 18px #67443c45)' } : undefined}
        >
          <Suspense fallback={<div className="ballot-3d-shell" aria-label="Memuat surat suara" />}>
            <Ballot3D
              phase={phase}
              compact={deliveryReady}
              selectedCandidate={selectedCandidate}
              punchTarget={punchTarget}
              punchState={punchState}
              onOpenComplete={finishOpening}
              onFlipComplete={finishFlip}
              onRefoldOuterComplete={startCoverFold}
              onFoldComplete={finishCoverFold}
              onPunchComplete={finishPunch}
              onReady={markBallotReady}
            />
          </Suspense>
        </motion.div>
        {deliveryReady && <motion.div
          className={`ballot-drop-scene${boxCentered ? ' ballot-drop-scene-final' : ''}`}
          layout="position"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ layout: { type: 'spring', stiffness: 150, damping: 26 }, x: { type: 'spring', stiffness: 120, damping: 24 }, opacity: { duration: reduceMotion ? 0.01 : 0.6, ease: 'easeOut' } }}
        >
          <motion.div
            className={`ballot-box${targetActive ? ' target-active' : ''}${deposited ? ' ballot-box-success' : ''}`}
            layout="position"
            animate={finaleInProgress ? { scale: [1, 1.07, 1], y: [0, -10, 0] } : { scale: boxCentered ? 1.12 : 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : finaleInProgress ? 0.48 : 0.65, ease: 'easeInOut' }}
          >
            <div ref={dropSlotRef} className="ballot-box-art">
              <img src={BallotBoxImage} alt="Kotak suara KPU simulasi" draggable={false} />
              {deliveryReady && !deposited && <div className="ballot-box-hint" aria-hidden="true">
                <svg viewBox="0 0 24 40" preserveAspectRatio="none">
                  <path d="M12 0 V30 M4 22 L12 32 L20 22" />
                </svg>
              </div>}
              <div className="ballot-box-slot-hit" role="img" aria-label="Lubang kotak suara" />
            </div>
          </motion.div>
        </motion.div>}
        {!deposited && <TutorialBubble speaker="angga">{instruction}</TutorialBubble>}
      </section>
      {!deposited && <NavigationControls className="voting-navigation">
        {onBack && <GuideArrowButton direction="back" className="voting-arrow" aria-label="Kembali ke daftar kandidat" title="Kembali ke daftar kandidat" onClick={onBack} />}
        <GuideArrowButton
          direction="next"
          className="voting-arrow voting-arrow-next"
          aria-label={outerOpen ? 'Lihat sisi dalam surat suara' : 'Lipat surat suara'}
          title={outerOpen ? 'Lihat sisi dalam surat suara' : 'Lipat surat suara'}
          disabled={!outerOpen && !(opened && punchState === 'completed' && !deliveryReady)}
          onClick={outerOpen ? startFlip : startRefold}
        />
      </NavigationControls>}
    </div>
    <FlowFooter />
  </ScreenBackground>
}
