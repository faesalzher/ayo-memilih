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
      <div className="idle-logo" aria-label="Ayo Memilih">
        <FigmaAsset file="c2335.svg" {...position(66, 155, 332, 162)} />
        <span className="idle-ayo">AYO</span>
        <span className="idle-memilih">MEMILIH</span>
      </div>
      <FigmaAsset file="a2f45.png" {...position(110, 947, 429, 677)} />
      <FigmaAsset file="d918e.png" {...position(501, 863, 433, 761)} />
      <FlatButton className="idle-start" onClick={onStart}>
        <FigmaAsset file="a2ccf.svg" {...position(39, 10, 53, 53)} />
        <span>MULAI</span>
      </FlatButton>
    </ScreenBackground>
  )
}

function FlowHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <div className="flow-header">
        <FigmaAsset file="e4513.svg" {...position(0, 0, 1111, 365)} />
        <FigmaAsset file="6dbac.svg" {...position(0, 0, 1099, 347)} />
        <FigmaAsset file="9931e.svg" {...position(0, 0, 1099, 105)} />
        <FigmaAsset file="1ab6a.svg" {...position(0, 0, 348, 143)} />
      </div>
      <ScreenHeader
        title={title}
        subtitle={subtitle}
        brandClassName="flow-brand"
        logoClassName="flow-brand-logo"
        brandTextClassName="flow-brand-copy"
        titleClassName="flow-title"
        subtitleClassName="flow-subtitle"
      />
    </>
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
      <FigmaAsset file="8733d.png" {...position(133, 525, 199, 191)} />
      <FigmaAsset file="53b0a.svg" {...position(426, 551, 449, 91)} />
      <FigmaAsset file="35e5f.svg" {...position(425, 544, 449, 91)} />
      <span className="guide-label guide-one">KENALI KANDIDAT</span>
      <FigmaAsset file="747e0.svg" {...position(397, 544, 96, 97)} />
      <FigmaAsset file="f5b89.svg" {...position(397, 572, 96, 72)} />
      <FigmaAsset file="ac019.svg" {...position(399, 546, 92, 93)} />
      <FigmaAsset file="18913.svg" {...position(402, 612, 85, 27)} />
      <span className="guide-number guide-number-one">1</span>

      <FigmaAsset file="85241.svg" {...position(626, 927, 322, 245)} />
      <FigmaAsset file="32d6e.png" {...position(713, 985, 149, 144)} />
      <FigmaAsset file="f5789.svg" {...position(113, 1008, 476, 87)} />
      <FigmaAsset file="87d24.svg" {...position(112, 1001, 476, 87)} />
      <span className="guide-label guide-two">TENTUKAN PILIHAN</span>
      <FigmaAsset file="747e0.svg" {...position(67, 1001, 96, 97)} />
      <FigmaAsset file="f5b89.svg" {...position(67, 1029, 96, 72)} />
      <FigmaAsset file="fd84e.svg" {...position(69, 1003, 92, 93)} />
      <FigmaAsset file="18913.svg" {...position(72, 1069, 85, 27)} />
      <span className="guide-number guide-number-two">2</span>

      <FigmaAsset file="66e75.svg" {...position(113, 1347, 330, 253)} />
      <FigmaAsset file="24a63.png" {...position(206, 1394, 133, 110)} />
      <FigmaAsset file="f5789.svg" {...position(523, 1409, 476, 87)} />
      <FigmaAsset file="87d24.svg" {...position(522, 1402, 476, 87)} />
      <span className="guide-label guide-three">LIHAT HASIL</span>
      <FigmaAsset file="747e0.svg" {...position(482, 1401, 96, 97)} />
      <FigmaAsset file="f5b89.svg" {...position(482, 1429, 96, 72)} />
      <FigmaAsset file="ac019.svg" {...position(484, 1403, 92, 93)} />
      <FigmaAsset file="18913.svg" {...position(487, 1469, 85, 27)} />
      <span className="guide-number guide-number-three">3</span>
      <FigmaAsset file="b92ba.svg" {...position(75, 1670, 144, 138)} />
      <FigmaAsset file="d4790.svg" {...position(862, 1667, 144, 138)} />
      <NavigationControls className="guide-navigation">
        <Button
          variant="icon-only"
          className="guide-arrow guide-arrow-back"
          style={position(65, 1666, 155, 145)}
          aria-label="Kembali ke halaman awal"
          onClick={onBack}
        >‹</Button>
        <Button
          variant="icon-only"
          className="guide-arrow guide-arrow-next"
          style={position(857, 1663, 155, 145)}
          aria-label="Lanjut ke daftar kandidat"
          onClick={onNext}
        >›</Button>
      </NavigationControls>
    </ScreenBackground>
  )
}

function CandidateScreen({
  onSelect,
  onChoose,
  children,
}: {
  onSelect: (index: number) => void
  onChoose: () => void
  children?: ReactNode
}) {
  return (
    <ScreenBackground as="section" className="figma-frame candidate-frame" aria-label="Kenali pilihanmu">
      <FigmaAsset file="519df.svg" {...position(0, 0, 1080, 1920)} />
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
      <FlatButton className="candidate-choose" onClick={onChoose}>
        <FigmaAsset file="3a78d.svg" {...position(34, 7, 55, 58)} />
        <span className="choose-label">PILIH</span>
      </FlatButton>
      {children}
    </ScreenBackground>
  )
}

function FigmaFlow({ onStartVoting }: { onStartVoting: () => void }) {
  const [screen, setScreen] = useState<Screen>('idle')
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
