import type { ReactNode } from 'react'
import Button from '../common/Button'

type NavigationButtonProps = {
  onClick: () => void
  children?: ReactNode
  className?: string
  ariaLabel?: string
}

export function BackButton({ onClick, children = '‹ Kembali', className = '', ariaLabel }: NavigationButtonProps) {
  return (
    <Button
      variant="outline"
      className={`ui-navigation-button ui-navigation-button--back ${className}`.trim()}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  )
}

export function NextButton({
  onClick,
  children = <>Lanjut <span aria-hidden="true">›</span></>,
  className = '',
}: NavigationButtonProps) {
  return (
    <Button
      variant="primary"
      className={`ui-navigation-button ui-navigation-button--next ${className}`.trim()}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

export function StepIndicator({ steps, activeStep }: { steps: readonly string[]; activeStep: number }) {
  return (
    <ol className="ui-step-indicator" aria-label="Langkah simulasi">
      {steps.map((step, index) => (
        <li key={step} aria-current={index === activeStep ? 'step' : undefined} className={index === activeStep ? 'is-active' : ''}>
          <span>{index + 1}</span>{step}
        </li>
      ))}
    </ol>
  )
}

export function NavigationControls({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <nav className={`ui-navigation-controls ${className}`.trim()} aria-label="Navigasi layar">{children}</nav>
}
