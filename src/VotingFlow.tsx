import { useEffect, useState } from 'react'
import OpenBallot from './pages/VotingSimulation/OpenBallot'
import InkDipScreen from './pages/InkDip/InkDipScreen'
import { SIMULATION_CANDIDATES } from './config/candidates'
import { ResultsScreen } from './pages/FlowScreens'
import { loadVotes, saveVotes } from './utils/voteStorage'

const RESULTS_AUTO_RETURN_MS = 60_000

type VotingFlowProps = {
  onBackFromBallot: () => void
  onReturnHome: () => void
}

export default function VotingFlow({ onBackFromBallot, onReturnHome }: VotingFlowProps) {
  const [screen, setScreen] = useState<'ballot' | 'ink' | 'results'>('ballot')
  const [votes, setVotes] = useState(() => loadVotes(SIMULATION_CANDIDATES.length))

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
      onComplete={(candidateNumber) => {
        const index = SIMULATION_CANDIDATES.findIndex((candidate) => candidate.number === candidateNumber)
        if (index >= 0) setVotes((current) => current.map((count, candidateIndex) => count + Number(index === candidateIndex)))
        setScreen('ink')
      }}
    />
  }

  if (screen === 'ink') return <InkDipScreen onComplete={() => setScreen('results')} />

  return <ResultsScreen candidates={SIMULATION_CANDIDATES} votes={votes} onReturnHome={onReturnHome} />
}
