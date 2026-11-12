import { useState } from 'react'
import FigmaFlow from './pages/FigmaFlow/FigmaFlow'
import LegacyApp from './LegacyApp'

function App() {
  const [votingStarted, setVotingStarted] = useState(false)

  if (votingStarted) return <LegacyApp initialScreen="ballot" />

  return <FigmaFlow onStartVoting={() => setVotingStarted(true)} />
}

export default App
