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
import { NavigationControls } from '../../components/navigation/NavigationControls'
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

function IdleScreen({ onStart }: { onStart: () => void }) {
  return (
    <ScreenBackground as="section" className="figma-frame idle-frame" aria-label="Ayo Memilih">
      <FigmaAsset file="4345b.png" {...position(-27, -55, 1112, 1975)} />
      <FigmaAsset file="6b4b7.svg" {...position(-150, -430, 1380, 900)} />
      <FigmaAsset file="ab6d1.svg" {...position(-80, -395, 1240, 820)} />
      <ScreenHeader
        brandClassName="idle-kpu-header"
        logoClassName="idle-brand-logo"
        brandTextClassName="idle-brand-copy"
      />
      <p className="idle-tagline">SIMULASI EDUKASI PEMILIHAN UMUM</p>
      <img className="idle-title" src="/idle-assets/ayo-memilih-title.svg" alt="Ayo Memilih" />
      <FigmaAsset file="a2f45.png" {...position(110, 947, 429, 677)} />
      <FigmaAsset file="d918e.png" {...position(501, 863, 433, 761)} />
      <FlatButton className="idle-start" onClick={onStart}>
        <FigmaAsset file="a2ccf.svg" {...position(39, 10, 53, 53)} />
        <span>MULAI</span>
      </FlatButton>
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
  return (
    <ScreenBackground as="section" className="figma-frame guide-frame" aria-label="Yuk, belajar memilih">
      <FigmaAsset file="519df.svg" {...position(0, 0, 1080, 1920)} />
      <FigmaAsset file="fccb0.svg" {...position(0, 0, 1080, 1920)} />
      <FlowHeader title="YUK, BELAJAR MEMILIH!" subtitle="Dengan memilih, kita ikut menentukan pemimpin dan masa depan bersama." />
      <FigmaAsset file="ed193.svg" {...position(0, 1820, 1080, 100)} />
      <FigmaAsset file="14fbd.svg" {...position(72, 490, 322, 245)} />
      <FigmaAsset file="8733d.png" {...position(114, 485, 239, 229)} />
      <GuideStep number={1} label="KENALI KANDIDAT" x={397} y={544} barOffset={28} barWidth={449} />

      <FigmaAsset file="85241.svg" {...position(626, 927, 322, 245)} />
      <FigmaAsset file="32d6e.png" {...position(698, 952, 179, 173)} />
      <GuideStep number={2} label="TENTUKAN PILIHAN" x={67} y={1001} barOffset={45} barWidth={476} />

      <FigmaAsset file="66e75.svg" {...position(113, 1347, 330, 253)} />
      <FigmaAsset file="24a63.png" {...position(192, 1387, 173, 143)} />
      <GuideStep number={3} label="LIHAT HASIL" x={482} y={1401} barOffset={40} barWidth={476} />
      <NavigationControls className="guide-navigation">
        <Button
          variant="icon-only"
          className="guide-arrow guide-arrow-back"
          style={position(65, 1666, 155, 145)}
          aria-label="Kembali ke halaman awal"
          onClick={onBack}
        >
          <FigmaAsset file="b92ba.svg" {...position(10, 4, 144, 138)} />
        </Button>
        <Button
          variant="icon-only"
          className="guide-arrow guide-arrow-next"
          style={position(857, 1663, 155, 145)}
          aria-label="Lanjut ke daftar kandidat"
          onClick={onNext}
        >
          <FigmaAsset file="d4790.svg" {...position(5, 4, 144, 138)} />
        </Button>
      </NavigationControls>
    </ScreenBackground>
  )
}

function CandidateScreen({
  onBack,
  onSelect,
  onChoose,
  children,
}: {
  onBack: () => void
  onSelect: (index: number) => void
  onChoose: () => void
  children?: ReactNode
}) {
  return (
    <ScreenBackground as="section" className="figma-frame candidate-frame" aria-label="Kenali pilihanmu" backgroundImage="/figma-assets/519df.svg">
      <FlowHeader title="KENALI PILIHANMU" subtitle="Kenali pilihan yang tersedia, lalu pilih satu kandidat." />
      <FigmaAsset file="8733d.png" {...position(811, 40, 199, 191)} />
      {FIGMA_CANDIDATES.map((candidate, index) => (
        <CandidateCard
          key={candidate.number}
          variant="figma"
          candidate={candidate}
          index={index}
          onSelect={() => onSelect(index)}
        />
      ))}
      <p className="candidate-instruction">Tekan satu pilihan untuk melihat visi, misi, dan program.</p>
      <NavigationControls className="guide-navigation">
        <Button
          variant="icon-only"
          className="guide-arrow guide-arrow-back"
          style={position(65, 1666, 155, 145)}
          aria-label="Kembali ke panduan"
          onClick={onBack}
        >
          <FigmaAsset file="b92ba.svg" {...position(10, 4, 144, 138)} />
        </Button>
        <Button
          variant="icon-only"
          className="guide-arrow guide-arrow-next"
          style={position(857, 1663, 155, 145)}
          aria-label="Lanjut ke simulasi surat suara"
          onClick={onChoose}
        >
          <FigmaAsset file="d4790.svg" {...position(5, 4, 144, 138)} />
        </Button>
      </NavigationControls>
      {children}
    </ScreenBackground>
  )
}

function FigmaFlow({ onStartVoting, initialScreen = 'idle' }: { onStartVoting: () => void; initialScreen?: 'idle' | 'candidates' }) {
  const [screen, setScreen] = useState<Screen>(initialScreen)
  const [selectedCandidate, setSelectedCandidate] = useState(0)

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
      {screen === 'idle' && <IdleScreen onStart={() => setScreen('guide')} />}
      {screen === 'guide' && <GuideScreen onBack={() => setScreen('idle')} onNext={() => setScreen('candidates')} />}
      {(screen === 'candidates' || screen === 'details') && (
        <CandidateScreen
          onBack={() => setScreen('guide')}
          onChoose={onStartVoting}
          onSelect={(index) => {
            setSelectedCandidate(index)
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
