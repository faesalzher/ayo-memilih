import type { CSSProperties, RefObject } from 'react'
import Button from '../../components/common/Button'
import FlowHeader from '../../components/layout/FlowHeader'
import ScreenBackground from '../../components/layout/ScreenBackground'
import { useInkDip } from './useInkDip'
import type { InkDipState } from './useInkDip'
import './InkDipScreen.css'

const HAND = '/assets/Cartoon%20Hand%20with%20Downward%20Pinky.png'
const INKED_HAND = '/assets/Purple-Inked%20Pinky%20Finger.png'

function DraggableHand({ state, offset, handRef, onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onKeyDown }: Omit<ReturnType<typeof useInkDip>, 'targetRef'>) {
  const inked = state === 'lifting' || state === 'success'
  const moving = state === 'dragging' || state === 'dipping'
  return (
    <div
      className={`ink-hand${moving ? ' is-dragging' : ''}${inked ? ' is-inked' : ''}`}
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
      <img ref={handRef} className="ink-hand-image" src={HAND} alt="" draggable={false} />
      <img className={`ink-hand-image ink-hand-colored${inked ? ' is-visible' : ''}`} src={INKED_HAND} alt="" draggable={false} />
    </div>
  )
}

function InkBottleDropZone({ targetRef, state }: { targetRef: RefObject<HTMLDivElement | null>; state: InkDipState }) {
  return (
    <div className={`ink-bottle${state === 'dragging' || state === 'dipping' ? ' is-target' : ''}${state === 'dipping' ? ' is-dipping' : ''}`}>
      <img src="/assets/botol_tinta_pemilu.png" alt="Botol tinta pemilu" draggable={false} />
      <div ref={targetRef} className="ink-target" aria-hidden="true"><span className="ink-ripple" /></div>
    </div>
  )
}

function InkDipSuccess() {
  return <div className="ink-success" role="status">
    <h2>YEAY! JARIMU SUDAH BERTINTA!</h2>
    <p>Kamu sudah menyelesaikan simulasi pemungutan suara!</p>
  </div>
}

export default function InkDipScreen({ onComplete }: { onComplete: () => void }) {
  const { state, offset, handRef, targetRef, onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onKeyDown } = useInkDip()
  const success = state === 'success'
  const message = state === 'dipping' ? 'Sedikit lagi! Angkat jarimu!' : 'Seret jari kelingkingmu ke dalam tinta!'

  return (
    <main className="figma-host">
      <ScreenBackground as="section" className="figma-frame ink-frame" backgroundImage="/figma-assets/519df.svg" aria-label="Celupkan jari ke tinta">
        <FlowHeader title="SATU TANDA, BUKTI SUDAH MEMILIH!" subtitle="Celupkan jari kelingkingmu ke dalam tinta pemilu." />
        <div className="ink-interaction">
          {!success && <div className="ink-path" aria-hidden="true" />}
          <InkBottleDropZone targetRef={targetRef} state={state} />
          <DraggableHand state={state} offset={offset} handRef={handRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerCancel} onKeyDown={onKeyDown} />
          {success && <>
            <img className="ink-mascot ink-mascot-left" src="/figma-assets/a2f45.png" alt="" />
            <img className="ink-mascot ink-mascot-right" src="/figma-assets/d918e.png" alt="" />
            <span className="ink-sparkle ink-sparkle-one" aria-hidden="true">✦</span>
            <span className="ink-sparkle ink-sparkle-two" aria-hidden="true">✦</span>
          </>}
        </div>
        {success ? <InkDipSuccess /> : <div className="ink-instructions" aria-live="polite">
          <strong>{message}</strong>
          <p>Sentuh dan seret jarimu ke botol tinta.</p>
        </div>}
        {success && <Button className="flow-button ink-finish" onClick={onComplete}>SELESAI</Button>}
      </ScreenBackground>
    </main>
  )
}