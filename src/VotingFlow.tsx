import { useState } from 'react'
import OpenBallot from './pages/VotingSimulation/OpenBallot'
import InkDipScreen from './pages/InkDip/InkDipScreen'
import { SIMULATION_CANDIDATES } from './config/candidates'
import { ResultsScreen } from './pages/FlowScreens'

type VotingFlowProps = {
  onBackFromBallot: () => void
  onReturnHome: () => void
}

export default function VotingFlow({ onBackFromBallot, onReturnHome }: VotingFlowProps) {
  const [screen, setScreen] = useState<'ballot' | 'ink' | 'results'>('ballot')
  const [votes, setVotes] = useState(() => SIMULATION_CANDIDATES.map(() => 0))

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
