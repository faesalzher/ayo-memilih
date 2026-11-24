import { useEffect, useState } from 'react'
import OpenBallot from './pages/VotingSimulation/OpenBallot'
import InkDipScreen from './pages/InkDip/InkDipScreen'
import { CANDIDATES } from './data/candidates'
import { ResultsScreen } from './pages/FlowScreens'
import { addVote, ensureCurrentPeriod, loadVotes, saveVotes } from './utils/voteStorage'

const RESULTS_AUTO_RETURN_MS = 60_000
const PERIOD_CHECK_INTERVAL_MS = 30_000
const CANDIDATE_IDS = CANDIDATES.map((candidate) => candidate.id)

type VotingFlowProps = {
  onBackFromBallot: () => void
  onReturnHome: () => void
}

export default function VotingFlow({ onBackFromBallot, onReturnHome }: VotingFlowProps) {
  const [screen, setScreen] = useState<'ballot' | 'ink' | 'results'>('ballot')
  const [snapshot, setSnapshot] = useState(() => loadVotes(CANDIDATE_IDS))

  useEffect(() => {
    saveVotes(snapshot)
  }, [snapshot])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSnapshot((current) => ensureCurrentPeriod(current, CANDIDATE_IDS))
    }, PERIOD_CHECK_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [])

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
          setSnapshot((current) => addVote(current, candidateId, CANDIDATE_IDS))
        }
        setScreen('ink')
      }}
    />
  }

  if (screen === 'ink') return <InkDipScreen onComplete={() => setScreen('results')} />

  return <ResultsScreen candidates={CANDIDATES} votes={snapshot.votes} onReturnHome={onReturnHome} />
}
