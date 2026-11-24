import { useEffect, useState } from 'react'
import FigmaFlow from './pages/FigmaFlow/FigmaFlow'
import VotingFlow from './VotingFlow'
import { CANDIDATES } from './data/candidates'
import { resetStaleVotes } from './utils/voteStorage'

const PERIOD_CHECK_INTERVAL_MS = 30_000
const CANDIDATE_IDS = CANDIDATES.map((candidate) => candidate.id)

function App() {
  const [votingStarted, setVotingStarted] = useState(false)
  const [returningToCandidates, setReturningToCandidates] = useState(false)

  useEffect(() => {
    resetStaleVotes(CANDIDATE_IDS)
    const timer = window.setInterval(() => resetStaleVotes(CANDIDATE_IDS), PERIOD_CHECK_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [])

  if (votingStarted) return <VotingFlow onBackFromBallot={() => {
    setReturningToCandidates(true)
    setVotingStarted(false)
  }} onReturnHome={() => {
    setReturningToCandidates(false)
    setVotingStarted(false)
  }} />

  return <FigmaFlow initialScreen={returningToCandidates ? 'candidates' : 'idle'} onStartVoting={() => setVotingStarted(true)} />
}

export default App
