import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/baloo-2/800.css'
import '@fontsource/nunito/400.css'
import '@fontsource/nunito/600.css'
import './styles/tokens.css'
import './components/common/Button.css'
import './components/common/Card.css'
import './components/common/Badge.css'
import './components/common/Typography.css'
import './components/layout/ScreenBackground.css'
import './components/navigation/NavigationControls.css'
import './components/modal/BaseModal.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
