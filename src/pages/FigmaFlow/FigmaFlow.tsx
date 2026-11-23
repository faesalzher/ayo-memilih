import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { FIGMA_CANDIDATES } from '../../config/figmaCandidates'
import Button from '../../components/common/Button'
import CandidateCard from '../../components/candidate/CandidateCard'
import CandidateDetailModal from '../../components/candidate/CandidateDetailModal'
import FigmaAsset from '../../components/figma/FigmaAsset'
import { position } from '../../utils/figmaPosition'
import ScreenBackground from '../../components/layout/ScreenBackground'
import ScreenHeader from '../../components/layout/ScreenHeader'
import FlowHeader from '../../components/layout/FlowHeader'
import FlowFooter from '../../components/layout/FlowFooter'
import { NavigationControls } from '../../components/navigation/NavigationControls'
import GuideArrowButton from '../../components/navigation/GuideArrowButton'
import TutorialBubble from '../../components/tutorial/TutorialBubble'
import { audioManager } from '../../services/audio/AudioManager'
import AdminAccessDialog from '../../components/admin/AdminAccessDialog'
import './FigmaFlow.css'

type Screen = 'idle' | 'guide' | 'candidates' | 'details'

function FlatButton({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick: () => void
}) {
  return <Button className={`flow-button ${className}`} onClick={onClick}>{children}</Button>
}

const IDLE_TAGLINE = 'SIMULASI EDUKASI PEMILIHAN UMUM'
const IDLE_TYPE_INTERVAL_MS = 28

function IdleScreen({ onStart }: { onStart: () => void }) {
  useEffect(() => {
    audioManager.playBgm('idle')
  }, [])
  const [typedCount, setTypedCount] = useState(0)
  const [adminOpen, setAdminOpen] = useState(false)
  const isTyping = typedCount < IDLE_TAGLINE.length

  useEffect(() => {
    if (!isTyping) return
    const timer = window.setTimeout(() => setTypedCount((count) => count + 1), IDLE_TYPE_INTERVAL_MS)
    return () => window.clearTimeout(timer)
  }, [isTyping, typedCount])

  return (
    <ScreenBackground as="section" className="figma-frame idle-frame" aria-label="Ayo Memilih">
      <FigmaAsset file="4345b.png" {...position(-27, -55, 1112, 1975)} />
      <FigmaAsset file="6b4b7.svg" {...position(-150, -430, 1380, 900)} />
      <FigmaAsset file="ab6d1.svg" {...position(-80, -395, 1240, 820)} />
      <ScreenHeader
        brandClassName="idle-kpu-header"
        logoClassName="idle-brand-logo"
        onLogoHold={() => setAdminOpen(true)}
        brandTextClassName="idle-brand-copy"
      />
      <p className="idle-tagline">
        <span>{IDLE_TAGLINE.slice(0, typedCount)}</span>
        {isTyping && <span className="idle-caret" aria-hidden="true" />}
        <span className="idle-tagline-rest" aria-hidden="true">{IDLE_TAGLINE.slice(typedCount)}</span>
      </p>
      <img className="idle-title" src="/idle-assets/ayo-memilih-title.svg" alt="Ayo Memilih" />
      <FigmaAsset file="a2f45.png" {...position(110, 947, 429, 677)} />
      <FigmaAsset file="d918e.png" {...position(501, 863, 433, 761)} />
      <FlatButton className="idle-start" onClick={onStart}>
        <FigmaAsset file="a2ccf.svg" {...position(39, 10, 53, 53)} />
        <span>MULAI</span>
      </FlatButton>
      {adminOpen && <AdminAccessDialog onClose={() => setAdminOpen(false)} />}
      <img className="idle-social" src="/idle-assets/sosmed-kpu.png" alt="Media sosial KPU Kota Batu" />
    </ScreenBackground>
  )
}

function GuideStep({ number, label, x, y, barOffset, barWidth }: { number: number; label: string; x: number; y: number; barOffset: number; barWidth: number }) {
  const first = number === 1
  const barHeight = first ? 90.5 : 87.251
  return (
    <div className="guide-step" style={position(x, y, barOffset + barWidth, 105)}>
      <FigmaAsset file={first ? '50fc6.svg' : number === 2 ? 'f5ffe.svg' : '54939.svg'} {...position(barOffset + 1, 7, barWidth, barHeight)} />
      <FigmaAsset file={first ? '688e5.svg' : 'b6227.svg'} {...position(barOffset + barWidth * 0.0087, 0, barWidth * 0.982, barHeight)} />
      <span className="guide-step-label">{label}</span>
      <FigmaAsset file="747e0.svg" {...position(0, 0, 96, 97)} />
      <FigmaAsset file="f5b89.svg" {...position(0, 28, 96, 72)} />
      <FigmaAsset file="ac019.svg" {...position(2, 2, 92, 93)} />
      <FigmaAsset file="18913.svg" {...position(5, 68, 85, 27)} />
      <span className="guide-step-number">{number}</span>
    </div>
  )
}

function GuideScreen({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const roadmapPath = 'M240 671.5C218 999.5 765 715.5 783.5 1000.5C783.5 1504.5 228 1015.5 240 1480'
  const playStepReveal = () => audioManager.playSfx('stepReveal')
  return (
    <ScreenBackground as="section" className="figma-frame guide-frame" aria-label="Yuk, belajar memilih">
      <FigmaAsset file="519df.svg" {...position(0, 0, 1080, 1920)} />
      <svg className="guide-roadmap" viewBox="0 0 1080 1920" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <mask id="guide-roadmap-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1920">
            <path className="guide-roadmap-mask-path" d={roadmapPath} pathLength="1" fill="none" stroke="white" strokeWidth="110" strokeLinecap="round" />
          </mask>
        </defs>
        <image href="/figma-assets/fccb0.svg" width="1080" height="1920" mask="url(#guide-roadmap-mask)" />
        <g className="guide-roadmap-marker">
          <circle r="24" fill="#f58f20" stroke="white" strokeWidth="7" />
          <circle r="7" fill="white" />
          <animateMotion path={roadmapPath} begin="0.3s" dur="1.7s" fill="freeze" />
        </g>
      </svg>
      <FlowHeader title="YUK, BELAJAR MEMILIH!" subtitle="Yuk ikut menentukan pemimpin dan masa depan bersama." />
      <FlowFooter />
      <div className="guide-roadmap-step guide-roadmap-step-one" onAnimationStart={playStepReveal}>
        <FigmaAsset file="14fbd.svg" {...position(72, 490, 322, 245)} />
        <FigmaAsset file="8733d.png" {...position(114, 485, 239, 229)} />
        <GuideStep number={1} label="KENALI PILIHANMU" x={397} y={544} barOffset={28} barWidth={449} />
      </div>

      <div className="guide-roadmap-step guide-roadmap-step-two" onAnimationStart={playStepReveal}>
        <FigmaAsset file="85241.svg" {...position(626, 927, 322, 245)} />
        <FigmaAsset file="32d6e.png" {...position(698, 952, 179, 173)} />
        <GuideStep number={2} label="TENTUKAN PILIHAN" x={67} y={1001} barOffset={45} barWidth={476} />
      </div>

      <div className="guide-roadmap-step guide-roadmap-step-three" onAnimationStart={playStepReveal}>
        <FigmaAsset file="66e75.svg" {...position(113, 1347, 330, 253)} />
        <FigmaAsset file="24a63.png" {...position(192, 1387, 173, 143)} />
        <GuideStep number={3} label="LIHAT HASIL" x={482} y={1401} barOffset={40} barWidth={476} />
      </div>
      <NavigationControls className="guide-navigation">
        <GuideArrowButton
          direction="back"
          className="guide-arrow-back"
          style={position(65, 1666, 155, 145)}
          aria-label="Kembali ke halaman awal"
          onClick={onBack}
        />
        <GuideArrowButton
          direction="next"
          className="guide-arrow-next"
          style={position(857, 1663, 155, 145)}
          aria-label="Lanjut ke daftar kandidat"
          onClick={onNext}
        />
      </NavigationControls>
    </ScreenBackground>
  )
}

const CANDIDATE_CARD_DELAY_MS = 300

function CandidateScreen({
  onBack,
  onSelect,
  onChoose,
  showTutorial,
  canContinue,
  viewedCandidates,
  children,
}: {
  onBack: () => void
  onSelect: (index: number) => void
  onChoose: () => void
  showTutorial: boolean
  canContinue: boolean
  viewedCandidates: boolean[]
  children?: ReactNode
}) {
  useEffect(() => {
    const timers = FIGMA_CANDIDATES.map((_, index) =>
      window.setTimeout(() => audioManager.playSfx('stepReveal'), index * CANDIDATE_CARD_DELAY_MS),
    )
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [])

  return (
    <ScreenBackground as="section" className="figma-frame candidate-frame" aria-label="Kenali pilihanmu">
      <FlowHeader title="KENALI PILIHANMU" subtitle="Kenali pilihan yang tersedia, lalu pilih satu kandidat." />
      <FigmaAsset file="8733d.png" {...position(811, 40, 199, 191)} />
      {FIGMA_CANDIDATES.map((candidate, index) => (
        <CandidateCard
          key={candidate.number}
          variant="figma"
          candidate={candidate}
          index={index}
          viewed={viewedCandidates[index]}
          onSelect={() => onSelect(index)}
        />
      ))}
      {showTutorial && (
        <div className="candidate-tutorial">
          <TutorialBubble speaker="angga">
            {canContinue
              ? 'Klik panah untuk memilih kandidat.'
              : 'Sentuh ketiga kartu kandidat untuk mengenal visi dan misinya sebelum lanjut.'}
          </TutorialBubble>
        </div>
      )}
      <NavigationControls className="guide-navigation">
        <GuideArrowButton
          direction="back"
          className="guide-arrow-back"
          style={position(65, 1666, 155, 145)}
          aria-label="Kembali ke panduan"
          onClick={onBack}
        />
        <GuideArrowButton
          direction="next"
          className="guide-arrow-next"
          style={position(857, 1663, 155, 145)}
          aria-label="Lanjut ke simulasi surat suara"
          disabled={!canContinue}
          onClick={onChoose}
        />
      </NavigationControls>
      <FlowFooter />
      {children}
    </ScreenBackground>
  )
}

function FigmaFlow({ onStartVoting, initialScreen = 'idle' }: { onStartVoting: () => void; initialScreen?: 'idle' | 'candidates' }) {
  const [screen, setScreen] = useState<Screen>(initialScreen)
  const [selectedCandidate, setSelectedCandidate] = useState(0)
  const [viewedCandidates, setViewedCandidates] = useState<boolean[]>(() => FIGMA_CANDIDATES.map(() => false))

  useEffect(() => {
    if (screen !== 'details') return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setScreen('candidates')
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [screen])

  return (
    <main className="figma-host">
      {screen === 'idle' && <IdleScreen onStart={() => {
        audioManager.playBgm('gameplay')
        setScreen('guide')
      }} />}
      {screen === 'guide' && <GuideScreen onBack={() => setScreen('idle')} onNext={() => setScreen('candidates')} />}
      {(screen === 'candidates' || screen === 'details') && (
        <CandidateScreen
          onBack={() => setScreen('guide')}
          onChoose={onStartVoting}
          showTutorial={screen === 'candidates'}
          canContinue={viewedCandidates.every(Boolean)}
          viewedCandidates={viewedCandidates}
          onSelect={(index) => {
            setSelectedCandidate(index)
            setViewedCandidates((current) => current.map((viewed, viewedIndex) => viewed || viewedIndex === index))
            setScreen('details')
          }}
        >
          {screen === 'details' && (
            <CandidateDetailModal
              candidate={FIGMA_CANDIDATES[selectedCandidate]}
              candidateIndex={selectedCandidate}
              onClose={() => setScreen('candidates')}
            />
          )}
        </CandidateScreen>
      )}
    </main>
  )
}

export default FigmaFlow
