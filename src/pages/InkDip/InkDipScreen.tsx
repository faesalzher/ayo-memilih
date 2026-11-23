import { useEffect } from 'react'
import type { CSSProperties, RefObject } from 'react'
import { audioManager } from '../../services/audio/AudioManager'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Button from '../../components/common/Button'
import FlowHeader from '../../components/layout/FlowHeader'
import FlowFooter from '../../components/layout/FlowFooter'
import ScreenBackground from '../../components/layout/ScreenBackground'
import TutorialBubble from '../../components/tutorial/TutorialBubble'
import { useInkDip } from './useInkDip'
import type { InkDipState } from './useInkDip'
import './InkDipScreen.css'

const HAND = '/assets/Cartoon%20Hand%20with%20Downward%20Pinky.png'
const INKED_HAND = '/assets/Purple-Inked%20Pinky%20Finger.png'
const CONFETTI: { dx: string; dy: string; rot: string; delay: string; color: string }[] = [
  { dx: '-30cqw', dy: '-22cqw', rot: '240deg', delay: '0s', color: '#f0991f' },
  { dx: '-18cqw', dy: '-30cqw', rot: '-200deg', delay: '0.05s', color: '#ffd54a' },
  { dx: '-6cqw', dy: '-34cqw', rot: '180deg', delay: '0.1s', color: '#7b0d14' },
  { dx: '8cqw', dy: '-32cqw', rot: '260deg', delay: '0.02s', color: '#55a76a' },
  { dx: '20cqw', dy: '-26cqw', rot: '-220deg', delay: '0.08s', color: '#792489' },
  { dx: '30cqw', dy: '-14cqw', rot: '200deg', delay: '0.12s', color: '#f0991f' },
  { dx: '-34cqw', dy: '-6cqw', rot: '-160deg', delay: '0.15s', color: '#2e86c1' },
  { dx: '34cqw', dy: '-4cqw', rot: '230deg', delay: '0.04s', color: '#ffd54a' },
  { dx: '-24cqw', dy: '-8cqw', rot: '300deg', delay: '0.18s', color: '#55a76a' },
  { dx: '24cqw', dy: '-10cqw', rot: '-280deg', delay: '0.06s', color: '#7b0d14' },
  { dx: '-10cqw', dy: '-24cqw', rot: '320deg', delay: '0.2s', color: '#2e86c1' },
  { dx: '12cqw', dy: '-20cqw', rot: '-300deg', delay: '0.14s', color: '#792489' },
]

function DraggableHand({ state, offset, handRef, onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onKeyDown }: Omit<ReturnType<typeof useInkDip>, 'targetRef'>) {
  const inked = state === 'lifting' || state === 'flipping' || state === 'success'
  const flipped = state === 'flipping' || state === 'success'
  const moving = state === 'dragging' || state === 'dipping'
  return (
    <div
      className={`ink-hand${moving ? ' is-dragging' : ''}${inked ? ' is-inked' : ''}${flipped ? ' is-flipped' : ''}`}
      style={{ '--hand-x': `${offset.x}px`, '--hand-y': `${offset.y}px` } as CSSProperties}
      role="button"
      tabIndex={inked ? -1 : 0}
      aria-label="Seret tangan ke botol tinta. Dengan keyboard, tekan Enter, gunakan tombol panah, lalu tekan Enter untuk melepas."
      aria-disabled={inked}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onKeyDown={onKeyDown}
    >
      <img ref={handRef} className="ink-hand-image ink-hand-base" src={HAND} alt="" draggable={false} />
      <img className={`ink-hand-image ink-hand-colored${inked ? ' is-visible' : ''}`} src={INKED_HAND} alt="" draggable={false} />
    </div>
  )
}

function InkBottleDropZone({ targetRef, state }: { targetRef: RefObject<HTMLDivElement | null>; state: InkDipState }) {
  return (
    <div className={`ink-bottle${state === 'dragging' || state === 'dipping' ? ' is-target' : ''}${state === 'dipping' ? ' is-dipping' : ''}${state === 'flipping' ? ' is-flipping' : ''}`}>
      <img src="/assets/botol_tinta_pemilu.png" alt="Botol tinta pemilu" draggable={false} />
      <div ref={targetRef} className="ink-target" aria-hidden="true"><span className="ink-ripple" /></div>
    </div>
  )
}

export default function InkDipScreen({ onComplete }: { onComplete: () => void }) {
  const { state, offset, handRef, targetRef, onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onKeyDown } = useInkDip()
  const reduceMotion = useReducedMotion()
  const success = state === 'success'

  useEffect(() => {
    if (state === 'dipping') audioManager.playSfx('liquidDip')
    if (state === 'success') audioManager.playSfx('resultsReveal')
  }, [state])
  const dipPhase = state === 'ready' || state === 'dragging' || state === 'dipping'
  const message = state === 'dipping' ? 'Sedikit lagi! Angkat jarimu!' : 'Seret jari kelingkingmu ke dalam tinta!'

  return (
    <main className="figma-host">
      <ScreenBackground as="section" className={`figma-frame ink-frame${success ? ' is-success' : ''}`} aria-label="Celupkan jari ke tinta">
        <FlowHeader
          title={success ? 'SUARA BERHASIL DICATAT' : 'TENTUKAN PILIHANMU!'}
          subtitle={success ? 'Terima kasih sudah ikut belajar memilih!' : 'Celupkan jari kelingkingmu ke dalam tinta pemilu.'}
        />
        <FlowFooter />
        <div className="ink-interaction">
          {dipPhase && <div className="ink-path" aria-hidden="true" />}
          {!success && <InkBottleDropZone targetRef={targetRef} state={state} />}
          <DraggableHand state={state} offset={offset} handRef={handRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerCancel} onKeyDown={onKeyDown} />
          <AnimatePresence>
            {success && <motion.div
              key="ink-notice"
              className="ink-notice"
              role="status"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="ink-notice-badge" aria-hidden="true"><img src="/assets/Group%20257.png" alt="" draggable={false} /></span>
              <h2>SUARAMU BERHASIL DICATAT!</h2>
              <p>Terima kasih telah menyelesaikan simulasi pemungutan suara.</p>
            </motion.div>}
          </AnimatePresence>
          {success && <>
            {CONFETTI.map((piece, index) => (
              <span
                key={index}
                className="ink-confetti"
                aria-hidden="true"
                style={{ '--dx': piece.dx, '--dy': piece.dy, '--rot': piece.rot, '--delay': piece.delay, '--confetti-color': piece.color } as CSSProperties}
              />
            ))}
            <span className="ink-sparkle ink-sparkle-one" aria-hidden="true">✦</span>
            <span className="ink-sparkle ink-sparkle-two" aria-hidden="true">✦</span>
          </>}
        </div>
        {dipPhase && <div className="ink-tutorial" aria-live="polite">
          <TutorialBubble speaker="angga">{`${message} Sentuh dan seret jarimu ke botol tinta.`}</TutorialBubble>
        </div>}
        {success && <Button className="flow-button ink-finish" onClick={onComplete}>LIHAT HASIL</Button>}
      </ScreenBackground>
    </main>
  )
}