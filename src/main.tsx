import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './components/common/Button.css'
import './components/common/Card.css'
import './components/common/Badge.css'
import './components/common/Typography.css'
import './components/layout/ScreenBackground.css'
import './components/navigation/NavigationControls.css'
import './components/modal/BaseModal.css'
import '@fontsource/baloo-2/latin-600.css'
import '@fontsource/baloo-2/latin-700.css'
import '@fontsource/baloo-2/latin-800.css'
import '@fontsource/montserrat/latin-700.css'
import '@fontsource/nunito/latin-600.css'
import '@fontsource/nunito/latin-700.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
