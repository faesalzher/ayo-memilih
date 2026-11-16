import { useState } from 'react'
import FigmaFlow from './pages/FigmaFlow/FigmaFlow'
import LegacyApp from './LegacyApp'

function App() {
  const [votingStarted, setVotingStarted] = useState(false)
  const [returningToCandidates, setReturningToCandidates] = useState(false)

  if (votingStarted) return <LegacyApp initialScreen="ballot" onBackFromBallot={() => {
    setReturningToCandidates(true)
    setVotingStarted(false)
  }} onReturnHome={() => {
    setReturningToCandidates(false)
    setVotingStarted(false)
  }} />

  return <FigmaFlow initialScreen={returningToCandidates ? 'candidates' : 'idle'} onStartVoting={() => setVotingStarted(true)} />
}

export default App
