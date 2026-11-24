import { useCallback, useEffect, useState } from 'react'
import FigmaFlow from './pages/FigmaFlow/FigmaFlow'
import VotingFlow from './VotingFlow'
import { CANDIDATES } from './data/candidates'
import { resetStaleVotes } from './utils/voteStorage'
import { releaseAllCriticalAnimations } from './session/criticalAnimation'
import { useVisitorIdleTimeout } from './session/useVisitorIdleTimeout'

const PERIOD_CHECK_INTERVAL_MS = 30_000
const CANDIDATE_IDS = CANDIDATES.map((candidate) => candidate.id)

function App() {
  const [votingStarted, setVotingStarted] = useState(false)
  const [returningToCandidates, setReturningToCandidates] = useState(false)
  const [sessionActive, setSessionActive] = useState(false)
  const [sessionKey, setSessionKey] = useState(0)

  useEffect(() => {
    resetStaleVotes(CANDIDATE_IDS)
    const timer = window.setInterval(() => resetStaleVotes(CANDIDATE_IDS), PERIOD_CHECK_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [])

  // Clears only visitor-session state. Vote storage in localStorage is never touched here.
  const resetVisitorSession = useCallback(() => {
    releaseAllCriticalAnimations()
    setVotingStarted(false)
    setReturningToCandidates(false)
    setSessionActive(false)
    setSessionKey((key) => key + 1)
  }, [])

  useVisitorIdleTimeout(sessionActive, resetVisitorSession)

  if (votingStarted) return <VotingFlow key={sessionKey} onBackFromBallot={() => {
    setReturningToCandidates(true)
    setVotingStarted(false)
  }} onReturnHome={() => {
    setReturningToCandidates(false)
    setVotingStarted(false)
  }} />

  return <FigmaFlow
    key={sessionKey}
    initialScreen={returningToCandidates ? 'candidates' : 'idle'}
    onSessionActiveChange={setSessionActive}
    onStartVoting={() => {
      setSessionActive(true)
      setVotingStarted(true)
    }}
  />
}

export default App
