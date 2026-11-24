import { useEffect, useState } from 'react'
import OpenBallot from './pages/VotingSimulation/OpenBallot'
import InkDipScreen from './pages/InkDip/InkDipScreen'
import { CANDIDATES } from './data/candidates'
import { ResultsScreen } from './pages/FlowScreens'
import { loadVotes, saveVotes } from './utils/voteStorage'
import type { VoteTally } from './utils/voteStorage'

const RESULTS_AUTO_RETURN_MS = 60_000
const CANDIDATE_IDS = CANDIDATES.map((candidate) => candidate.id)

type VotingFlowProps = {
  onBackFromBallot: () => void
  onReturnHome: () => void
}

export default function VotingFlow({ onBackFromBallot, onReturnHome }: VotingFlowProps) {
  const [screen, setScreen] = useState<'ballot' | 'ink' | 'results'>('ballot')
  const [votes, setVotes] = useState<VoteTally>(() => loadVotes(CANDIDATE_IDS))

  useEffect(() => {
    saveVotes(votes)
  }, [votes])

  useEffect(() => {
    if (screen !== 'results') return
    const timer = window.setTimeout(onReturnHome, RESULTS_AUTO_RETURN_MS)
    return () => window.clearTimeout(timer)
  }, [screen, onReturnHome])

  if (screen === 'ballot') {
    return <OpenBallot
      onBack={onBackFromBallot}
      onComplete={(candidateId) => {
        if (CANDIDATE_IDS.includes(candidateId)) {
          setVotes((current) => ({ ...current, [candidateId]: (current[candidateId] ?? 0) + 1 }))
        }
        setScreen('ink')
      }}
    />
  }

  if (screen === 'ink') return <InkDipScreen onComplete={() => setScreen('results')} />

  return <ResultsScreen candidates={CANDIDATES} votes={votes} onReturnHome={onReturnHome} />
}
