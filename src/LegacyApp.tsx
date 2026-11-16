import { useState } from 'react'
import OpenBallot from './pages/VotingSimulation/OpenBallot'
import InkDipScreen from './pages/InkDip/InkDipScreen'
import IdleScreen from './pages/IdleScreen/IdleScreen'
import { SIMULATION_CANDIDATES } from './config/candidates'
import {
  CandidateDetailScreen,
  CandidateSelectionScreen,
  LearningScreen,
  ResultsScreen,
  VoteRecordedScreen,
} from './pages/FlowScreens'

type AppScreen = 'idle' | 'learning' | 'candidates' | 'details' | 'ballot' | 'ink' | 'recorded' | 'results'

type LegacyAppProps = {
  initialScreen?: AppScreen
  onBackFromBallot?: () => void
  onReturnHome?: () => void
}

export default function LegacyApp({ initialScreen = 'idle', onBackFromBallot, onReturnHome }: LegacyAppProps) {
  const [screen, setScreen] = useState<AppScreen>(initialScreen)
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(0)
  const [votes, setVotes] = useState(() => SIMULATION_CANDIDATES.map(() => 0))
  const selectedCandidate = SIMULATION_CANDIDATES[selectedCandidateIndex]

  if (screen === 'idle') {
    return <IdleScreen onStart={() => setScreen('learning')} />
  }
  if (screen === 'learning') {
    return <LearningScreen onContinue={() => setScreen('candidates')} onBack={() => setScreen('idle')} />
  }
  if (screen === 'candidates') {
    return <CandidateSelectionScreen
      candidates={SIMULATION_CANDIDATES}
      selectedIndex={selectedCandidateIndex}
      onSelect={(index) => {
        setSelectedCandidateIndex(index)
        setScreen('details')
      }}
      onBack={() => setScreen('learning')}
    />
  }
  if (screen === 'details') {
    return <CandidateDetailScreen
      candidate={selectedCandidate}
      onContinue={() => setScreen('ballot')}
      onBack={() => setScreen('candidates')}
    />
  }
  if (screen === 'ballot') {
    return <OpenBallot
      onBack={onBackFromBallot ?? (() => setScreen('details'))}
      onComplete={(candidateNumber) => {
        const index = SIMULATION_CANDIDATES.findIndex((candidate) => candidate.number === candidateNumber)
        if (index >= 0) setVotes((current) => current.map((count, candidateIndex) => count + Number(index === candidateIndex)))
        setScreen('ink')
      }}
    />
  }

  if (screen === 'ink') return <InkDipScreen onComplete={() => setScreen('recorded')} />
  if (screen === 'recorded') return <VoteRecordedScreen onContinue={() => setScreen('results')} />

  return <ResultsScreen
    candidates={SIMULATION_CANDIDATES}
    votes={votes}
    onReturnHome={() => {
      setVotes(SIMULATION_CANDIDATES.map(() => 0))
      setSelectedCandidateIndex(0)
      if (onReturnHome) onReturnHome()
      else setScreen('idle')
    }}
  />
}
