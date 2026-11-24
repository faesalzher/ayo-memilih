import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { CANDIDATES } from '../../data/candidates'
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

const GUIDE_STEP_COLOR: Record<number, string> = {
  1: '#c8102e',
  2: '#f58f20',
  3: '#1f7a45',
}

function GuideMarker({ number, cx, cy }: { number: number; cx: number; cy: number }) {
  return (
    <svg className="guide-pin" style={position(cx - 55, cy - 55, 110, 140)} viewBox="0 0 110 140" aria-hidden="true">
      <path d="M55 3C27 3 4 25 4 54c0 36 51 83 51 83s51-47 51-83C106 25 83 3 55 3z" fill={GUIDE_STEP_COLOR[number]} stroke="#fff" strokeWidth="6" />
      <text x="55" y="74" textAnchor="middle" style={{ fontFamily: 'var(--font-digitalt)', fontSize: 58, fill: '#fff' }}>{number}</text>
    </svg>
  )
}

function GuideStep({ number, label, icon, x, y, width, tilt }: { number: number; label: string; icon: string; x: number; y: number; width: number; tilt: number }) {
  return (
    <div className="guide-card" style={{ ...position(x, y, width, 180), transform: `rotate(${tilt}deg)` }}>
      <span className="guide-card-tape" style={position(width / 2 - 70, -12, 140, 40)} />
      <div className="guide-tier-copy" style={position(40, 0, width - 200, 180)}>
        <span className="guide-tier-tag">TAHAP {number}</span>
        <strong className="guide-tier-title">{label}</strong>
      </div>
      <div className="guide-tier-icon" style={position(width - 150, 30, 120, 120)}>
        <FigmaAsset file={icon} {...position(0, 0, 120, 120)} />
      </div>
    </div>
  )
}

function GuideScreen({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const roadmapPath = 'M161 487C161 720 889 640 889 880C889 1100 161 1100 161 1325'
  const playStepReveal = () => audioManager.playSfx('stepReveal')
  return (
    <ScreenBackground as="section" className="figma-frame guide-frame" aria-label="Yuk, belajar memilih">
      <FigmaAsset file="519df.svg" {...position(0, 0, 1080, 1920)} />
      <svg className="guide-roadmap" viewBox="0 0 1080 1920" preserveAspectRatio="none" aria-hidden="true">
        <path d={roadmapPath} fill="none" stroke="rgba(60, 30, 0, 0.25)" strokeWidth="14" strokeLinecap="round" strokeDasharray="22 16" transform="translate(0 4)" />
        <path d={roadmapPath} fill="none" stroke="#fff8ec" strokeWidth="10" strokeLinecap="round" strokeDasharray="22 16" />
        <g className="guide-roadmap-marker">
          <circle r="24" fill="#f58f20" stroke="white" strokeWidth="7" />
          <circle r="7" fill="white" />
          <animateMotion path={roadmapPath} begin="0.3s" dur="1.7s" fill="freeze" />
        </g>
      </svg>
      <FlowHeader title="TAHAPAN MEMILIH" subtitle="Yuk ikut menentukan pemimpin dan masa depan RPP Jatim Park bersama." />
      <FlowFooter />
      <div className="guide-roadmap-step guide-roadmap-step-one" onAnimationStart={playStepReveal}>
        <GuideMarker number={1} cx={161} cy={487} />
        <GuideStep number={1} label="KENALI PILIHANMU" icon="8733d.png" x={315} y={436} width={540} tilt={-2.5} />
      </div>

      <div className="guide-roadmap-step guide-roadmap-step-two" onAnimationStart={playStepReveal}>
        <GuideMarker number={2} cx={889} cy={880} />
        <GuideStep number={2} label="TENTUKAN PILIHAN" icon="32d6e.png" x={240} y={790} width={540} tilt={1.8} />
      </div>

      <div className="guide-roadmap-step guide-roadmap-step-three" onAnimationStart={playStepReveal}>
        <GuideMarker number={3} cx={161} cy={1325} />
        <GuideStep number={3} label="LIHAT HASIL" icon="24a63.png" x={315} y={1235} width={540} tilt={-1} />
      </div>
      <div className="guide-tutorial">
        <TutorialBubble speaker="angga">Kali ini kamu akan memilih Wali Kota dan Wakil Walikota yang akan menjadi pemimpin dan membawa ide-ide baik untuk lingkungan RPP Jatim Park. Tekan panah   untuk lanjut</TutorialBubble>
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
    const timers = CANDIDATES.map((_, index) =>
      window.setTimeout(() => audioManager.playSfx('stepReveal'), index * CANDIDATE_CARD_DELAY_MS),
    )
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [])

  return (
    <ScreenBackground as="section" className="figma-frame candidate-frame" aria-label="Kenali pilihanmu">
      <FlowHeader title="KENALI PILIHANMU" subtitle="Yuk kenali kandidat yang sesuai dengan visi misi" />
      <FigmaAsset file="8733d.png" {...position(811, 40, 199, 191)} />
      {CANDIDATES.map((candidate, index) => (
        <CandidateCard
          key={candidate.id}
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
              ? 'Klik panah untuk memilih kandidat dan masuk bilik surat suara'
              : 'Sentuh ketiga kartu kandidat untuk mengenal VISI dan MISI '}
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

function FigmaFlow({
  onStartVoting,
  onSessionActiveChange,
  initialScreen = 'idle',
}: {
  onStartVoting: () => void
  onSessionActiveChange?: (active: boolean) => void
  initialScreen?: 'idle' | 'candidates'
}) {
  const [screen, setScreen] = useState<Screen>(initialScreen)
  const [selectedCandidate, setSelectedCandidate] = useState(0)
  const [viewedCandidates, setViewedCandidates] = useState<boolean[]>(() => CANDIDATES.map(() => false))

  useEffect(() => {
    onSessionActiveChange?.(screen !== 'idle')
  }, [screen, onSessionActiveChange])

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
              candidate={CANDIDATES[selectedCandidate]}
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
