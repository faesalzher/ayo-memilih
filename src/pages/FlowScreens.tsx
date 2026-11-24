import { useEffect } from 'react'
import type { Candidate } from '../data/candidates'
import type { VoteTally } from '../utils/voteStorage'
import { audioManager } from '../services/audio/AudioManager'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import DecorativeElements from '../components/layout/DecorativeElements'
import ScreenBackground from '../components/layout/ScreenBackground'
import FlowHeader from '../components/layout/FlowHeader'
import FlowFooter from '../components/layout/FlowFooter'
import FigmaAsset from '../components/figma/FigmaAsset'
import TutorialBubble from '../components/tutorial/TutorialBubble'
import './FlowScreens.css'

const sharedAssets = '/idle-assets'

export function ResultsScreen({
  candidates,
  votes,
  onReturnHome,
}: {
  candidates: Candidate[]
  votes: VoteTally
  onReturnHome: () => void
}) {
  useEffect(() => {
    audioManager.playSfx('success')
  }, [])

  const voteValues = candidates.map((candidate) => votes[candidate.id] ?? 0)
  const totalVotes = voteValues.reduce((sum, count) => sum + count, 0)
  const maxVotes = Math.max(...voteValues, 1)

  return (
    <main className="figma-screen-host">
      <ScreenBackground as="div" className="figma-page figma-page-results" sceneDim={0.18}>
        <FlowHeader title="HASIL SEMENTARA" subtitle="Perbandingan hasil simulasi dalam bentuk grafik." />
        <div className="flow-header-icon flow-header-icon--results" aria-hidden="true">
          <FigmaAsset file="24a63.png" />
        </div>
        <DecorativeElements items={[
          { className: 'figma-page-sparkle figma-page-sparkle-top', src: `${sharedAssets}/sparkle.svg` },
          { className: 'figma-page-sparkle figma-page-sparkle-left', src: `${sharedAssets}/sparkle.svg` },
          { className: 'figma-page-sparkle figma-page-sparkle-bottom', src: `${sharedAssets}/sparkle.svg` },
        ]} />
        <Card as="section" variant="result" className="results-chart-card">
          <header><h2>Grafik Hasil</h2><p>Lihat siapa yang paling banyak dapat suara di simulasi ini.</p></header>
          <div className="results-bars">
            {candidates.map((candidate, index) => {
              const voteCount = votes[candidate.id] ?? 0
              const percentage = totalVotes === 0 ? 0 : Math.round((voteCount / totalVotes) * 100)
              const height = Math.max(14, (voteCount / maxVotes) * 240)
              return (
                <article className="results-bar-column" key={candidate.id}>
                  <strong>{percentage}%</strong>
                  <span className="results-vote-count">{voteCount} suara</span>
                  <div className="results-bar" style={{ height: `${height / 10.8}cqw`, backgroundColor: ['#c0392b', '#f0a500', '#2e86c1'][index] }} />
                  <img className="results-candidate-photo" src={candidate.campaignImage} alt={candidate.name} />
                  <span className="results-candidate-label"><b>{candidate.name}</b><b>{candidate.viceName}</b></span>
                </article>
              )
            })}
          </div>
        </Card>
        <Card as="section" variant="result" className="results-total">
          <div className="results-total-main"><strong>TOTAL SUARA</strong><span>{totalVotes}</span></div>
          <div className="results-total-note"><strong>SUARA TERCATAT</strong><small>DALAM SIMULASI EDUKASI</small></div>
        </Card>
        <div className="results-disclaimer">
          <TutorialBubble speaker="angga">Hasil ini hanya simulasi edukasi, bukan hasil pemungutan suara resmi.</TutorialBubble>
        </div>
        <Button className="flow-button results-home" onClick={onReturnHome}>
          <img className="results-home-icon" src="/assets/home.svg" alt="" />
          KEMBALI KE BERANDA
        </Button>
        <FlowFooter />
      </ScreenBackground>
    </main>
  )
}
