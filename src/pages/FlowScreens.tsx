import type { ReactNode } from 'react'
import type { SimulationCandidate } from '../config/candidates'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import CandidateCard from '../components/candidate/CandidateCard'
import DecorativeElements from '../components/layout/DecorativeElements'
import ScreenBackground from '../components/layout/ScreenBackground'
import ScreenHeader from '../components/layout/ScreenHeader'
import HeaderWave from '../components/layout/HeaderWave'
import { Text } from '../components/common/Typography'
import { BackButton, NavigationControls } from '../components/navigation/NavigationControls'
import './FlowScreens.css'

const sharedAssets = '/idle-assets'

type ScreenActions = {
  onBack: () => void
}

const learningSteps = [
  { title: 'Kenali Kandidat', description: 'Cari tahu siapa saja yang akan dipilih', image: 'learn-1.png', tint: 'yellow' },
  { title: 'Tentukan Pilihan', description: 'Pilih kandidat yang menurutmu terbaik', image: 'learn-2.png', tint: 'blue' },
  { title: 'Kirim Suara', description: 'Berikan langsung suaramu', image: 'learn-3.png', tint: 'cream' },
]

function PageFrame({
  title,
  subtitle,
  variant = 'standard',
  children,
}: {
  title: string
  subtitle?: string
  variant?: 'standard' | 'results'
  children: ReactNode
}) {
  return (
    <main className="figma-screen-host">
      <ScreenBackground
        as="div"
        className={`figma-page figma-page-${variant}`}
        backgroundImage={`${sharedAssets}/flowing-background.svg`}
      >
      <HeaderWave variant={variant} />
      <DecorativeElements items={[
        { className: 'figma-page-sparkle figma-page-sparkle-top', src: `${sharedAssets}/sparkle.svg` },
        { className: 'figma-page-sparkle figma-page-sparkle-left', src: `${sharedAssets}/sparkle.svg` },
        { className: 'figma-page-sparkle figma-page-sparkle-bottom', src: `${sharedAssets}/sparkle.svg` },
      ]} />
      <ScreenHeader
        title={title}
        subtitle={subtitle}
        brandClassName="figma-brand"
        titleWrapperClassName="figma-page-heading"
      />
      {children}
        <img className="figma-footer-wave" src={`${sharedAssets}/footer-curve.svg`} alt="" />
      </ScreenBackground>
    </main>
  )
}

export function LearningScreen({ onContinue, onBack }: ScreenActions & { onContinue: () => void }) {
  return (
    <PageFrame title="Yuk, Belajar memilih!">
      <div className="learning-cards">
        {learningSteps.map((step, index) => (
          <Card as="article" variant="information" className="learning-card" key={step.title}>
            <Badge variant="number" className="learning-number">{index + 1}</Badge>
            <div className="learning-copy">
              <Text as="h2" variant="section">{step.title}</Text>
              <Text variant="body">{step.description}</Text>
            </div>
            <div className={`learning-art learning-art-${step.tint}`}>
              <img src={`/figma-ui/${step.image}`} alt="" />
            </div>
          </Card>
        ))}
      </div>
      <NavigationControls className="screen-navigation">
        <BackButton onClick={onBack} className="figma-back-button">‹ <span>Kembali</span></BackButton>
      </NavigationControls>
      <p className="figma-disclaimer">Simulasi edukasi • Bukan pemungutan suara resmi</p>
      <Button className="figma-primary-button learning-next" onClick={onContinue}>Lanjut <span aria-hidden="true">›</span></Button>
    </PageFrame>
  )
}

export function CandidateSelectionScreen({
  candidates,
  selectedIndex,
  onSelect,
  onBack,
}: ScreenActions & {
  candidates: SimulationCandidate[]
  selectedIndex: number
  onSelect: (index: number) => void
}) {
  return (
    <PageFrame title="Kenali Pilihanmu" subtitle="Kenali pilihan yang tersedia, lalu pilih satu kandidat.">
      <div className="candidate-list">
        {candidates.map((candidate, index) => (
          <CandidateCard
            key={candidate.number}
            candidate={candidate}
            selected={selectedIndex === index}
            onSelect={() => onSelect(index)}
          />
        ))}
      </div>
      <p className="candidate-instruction">Tekan satu pilihan untuk melihat visi, misi, dan program.</p>
      <NavigationControls className="screen-navigation">
        <BackButton onClick={onBack} className="figma-back-button">‹ <span>Kembali</span></BackButton>
        <Button className="figma-primary-button candidate-next" onClick={() => onSelect(selectedIndex)}>
          Lihat detail pilihan <span aria-hidden="true">→</span>
        </Button>
      </NavigationControls>
    </PageFrame>
  )
}

export function CandidateDetailScreen({
  candidate,
  onContinue,
  onBack,
}: ScreenActions & {
  candidate: SimulationCandidate
  onContinue: () => void
}) {
  return (
    <PageFrame title="Kenali Pasangan Calon" subtitle="Baca visi, misi, dan program sebelum menentukan pilihan.">
      <Card as="section" variant="information" className="candidate-profile">
        <header>
          <strong>PASLON {candidate.number}</strong>
          <span>PROFIL CALON WALIKOTA &amp; WAKIL WALIKOTA</span>
          <small>KOTA BATU · SIMULASI</small>
        </header>
        <div className={`profile-visual${candidate.number === '01' ? '' : ' profile-visual-pair'}`}>
          <img src={candidate.candidatePortrait} alt={`Ilustrasi ${candidate.name}`} />
          {candidate.number === '01' && <img src={candidate.runningMatePortrait} alt={`Ilustrasi ${candidate.runningMate}`} />}
        </div>
        <div className="profile-names">
          <div><strong>{candidate.name}</strong><span>Calon</span></div>
          <div><strong>{candidate.runningMate}</strong><span>Wakil</span></div>
        </div>
      </Card>
      <section className="candidate-principles" aria-label="Visi misi dan program">
        <Card as="article" variant="information"><Text as="h2" variant="section">VISI</Text><Text variant="body">{candidate.vision}</Text></Card>
        <Card as="article" variant="information"><Text as="h2" variant="section">MISI</Text><Text variant="body">{candidate.mission}</Text></Card>
        <Card as="article" variant="information"><Text as="h2" variant="section">PROGRAM</Text><Text variant="body">{candidate.program}</Text></Card>
      </section>
      <NavigationControls className="screen-navigation">
        <BackButton onClick={onBack} className="figma-back-button">‹ <span>Kembali</span></BackButton>
        <Button className="figma-primary-button detail-next" onClick={onContinue}>Mulai memilih <span aria-hidden="true">→</span></Button>
      </NavigationControls>
    </PageFrame>
  )
}

export function ResultsScreen({
  candidates,
  votes,
  onReturnHome,
}: {
  candidates: SimulationCandidate[]
  votes: number[]
  onReturnHome: () => void
}) {
  const totalVotes = votes.reduce((sum, count) => sum + count, 0)
  const maxVotes = Math.max(...votes, 1)

  return (
    <PageFrame
      title="Hasil Sementara"
      subtitle="Perbandingan hasil simulasi dalam bentuk grafik."
      variant="results"
    >
      <Card as="section" variant="result" className="results-chart-card">
        <header><h2>Grafik Hasil</h2><p>Lihat siapa yang paling banyak dapat suara di simulasi ini.</p></header>
        <div className="results-bars">
          {candidates.map((candidate, index) => {
            const percentage = totalVotes === 0 ? 0 : Math.round((votes[index] / totalVotes) * 100)
            const height = Math.max(14, (votes[index] / maxVotes) * 300)
            return (
              <article className="results-bar-column" key={candidate.number}>
                <strong>{percentage}%</strong>
                <div className="results-bar" style={{ height: `${height / 10.8}cqw`, backgroundColor: ['#c0392b', '#f0a500', '#2e86c1'][index] }} />
                <span>{candidate.party}</span>
              </article>
            )
          })}
        </div>
      </Card>
      <Card as="section" variant="result" className="results-total"><strong>TOTAL SUARA</strong><span>{totalVotes}</span></Card>
      <Button className="figma-primary-button results-home" onClick={onReturnHome}>
        KEMBALI KE BERANDA <span aria-hidden="true">→</span>
      </Button>
    </PageFrame>
  )
}
