import type { CSSProperties, ReactNode } from 'react'
import type { SimulationCandidate } from '../config/candidates'
import './FlowScreens.css'

const uiAssets = '/figma-ui'
const sharedAssets = '/idle-assets'

type ScreenActions = {
  onBack: () => void
}

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
      <div className={`figma-page figma-page-${variant}`}>
      <img className="figma-background" src={`${sharedAssets}/flowing-background.svg`} alt="" />
      <div className={`figma-header-wave figma-header-wave-${variant}`} aria-hidden="true">
        <img className="figma-wave-cream" src={`${uiAssets}/${variant === 'results' ? 'results-cream.svg' : 'header-cream.svg'}`} alt="" />
        {variant !== 'results' && <img className="figma-wave-white" src={`${uiAssets}/header-white.svg`} alt="" />}
        <img className="figma-wave-red" src={`${uiAssets}/${variant === 'results' ? 'results-red.svg' : 'header-red.svg'}`} alt="" />
        <img className="figma-wave-dark" src={`${uiAssets}/${variant === 'results' ? 'results-dark.svg' : 'header-dark.svg'}`} alt="" />
        <img className="figma-wave-crescent" src={`${uiAssets}/${variant === 'results' ? 'results-crescent.svg' : 'header-crescent.svg'}`} alt="" />
      </div>
      <img className="figma-page-sparkle figma-page-sparkle-top" src={`${sharedAssets}/sparkle.svg`} alt="" />
      <img className="figma-page-sparkle figma-page-sparkle-left" src={`${sharedAssets}/sparkle.svg`} alt="" />
      <img className="figma-page-sparkle figma-page-sparkle-bottom" src={`${sharedAssets}/sparkle.svg`} alt="" />
      <header className="figma-brand">
        <img src={`${sharedAssets}/kpu-logo.png`} alt="" />
        <span><strong>KOMISI PEMILIHAN UMUM</strong><strong>KOTA BATU</strong></span>
      </header>
      <section className="figma-page-heading">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </section>
      {children}
        <img className="figma-footer-wave" src={`${sharedAssets}/footer-curve.svg`} alt="" />
      </div>
    </main>
  )
}

function BackButton({ onBack }: ScreenActions) {
  return (
    <button className="figma-back-button" type="button" onClick={onBack}>
      ‹ <span>Kembali</span>
    </button>
  )
}

export function LearningScreen({ onContinue, onBack }: ScreenActions & { onContinue: () => void }) {
  const steps = [
    { title: 'Kenali Kandidat', description: 'Cari tahu siapa saja yang akan dipilih', image: 'learn-1.png', tint: 'yellow' },
    { title: 'Tentukan Pilihan', description: 'Pilih kandidat yang menurutmu terbaik', image: 'learn-2.png', tint: 'blue' },
    { title: 'Kirim Suara', description: 'Berikan langsung suaramu', image: 'learn-3.png', tint: 'cream' },
  ]

  return (
    <PageFrame title="Yuk, Belajar memilih!">
      <div className="learning-cards">
        {steps.map((step, index) => (
          <article className="learning-card" key={step.title}>
            <span className="learning-number">{index + 1}</span>
            <div className="learning-copy">
              <h2>{step.title}</h2>
              <p>{step.description}</p>
            </div>
            <div className={`learning-art learning-art-${step.tint}`}>
              <img src={`${uiAssets}/${step.image}`} alt="" />
            </div>
          </article>
        ))}
      </div>
      <BackButton onBack={onBack} />
      <p className="figma-disclaimer">Simulasi edukasi • Bukan pemungutan suara resmi</p>
      <button className="figma-primary-button learning-next" type="button" onClick={onContinue}>Lanjut <span aria-hidden="true">›</span></button>
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
          <article
            className={`candidate-card${selectedIndex === index ? ' candidate-card-selected' : ''}`}
            key={candidate.number}
            style={{ '--candidate-accent': candidate.accent } as CSSProperties}
          >
            <div className="candidate-art">
              <img src={candidate.cardArtwork} alt="" />
              <span><strong>{candidate.number}</strong><small>PILIHAN</small></span>
            </div>
            <div className="candidate-card-copy">
              <h2>{candidate.name}<span>dan</span>{candidate.runningMate}</h2>
              <button type="button" onClick={() => onSelect(index)}>LIHAT KANDIDAT <span aria-hidden="true">→</span></button>
            </div>
          </article>
        ))}
      </div>
      <p className="candidate-instruction">Tekan satu pilihan untuk melihat visi, misi, dan program.</p>
      <BackButton onBack={onBack} />
      <button className="figma-primary-button candidate-next" type="button" onClick={() => onSelect(selectedIndex)}>
        Lihat detail pilihan <span aria-hidden="true">→</span>
      </button>
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
      <section className="candidate-profile">
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
      </section>
      <section className="candidate-principles" aria-label="Visi misi dan program">
        <article><h2>VISI</h2><p>{candidate.vision}</p></article>
        <article><h2>MISI</h2><p>{candidate.mission}</p></article>
        <article><h2>PROGRAM</h2><p>{candidate.program}</p></article>
      </section>
      <BackButton onBack={onBack} />
      <button className="figma-primary-button detail-next" type="button" onClick={onContinue}>Mulai memilih <span aria-hidden="true">→</span></button>
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
      <section className="results-chart-card">
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
      </section>
      <section className="results-total"><strong>TOTAL SUARA</strong><span>{totalVotes}</span></section>
      <button className="figma-primary-button results-home" type="button" onClick={onReturnHome}>
        KEMBALI KE BERANDA <span aria-hidden="true">→</span>
      </button>
    </PageFrame>
  )
}
