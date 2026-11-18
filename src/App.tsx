import { useState } from 'react'
import FigmaFlow from './pages/FigmaFlow/FigmaFlow'
import VotingFlow from './VotingFlow'

function App() {
  const [votingStarted, setVotingStarted] = useState(false)
  const [returningToCandidates, setReturningToCandidates] = useState(false)

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
