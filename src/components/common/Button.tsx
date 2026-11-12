import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'outline' | 'danger' | 'icon-only'
export type ButtonSize = 'small' | 'medium' | 'large'

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children?: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
  loading?: boolean
}

export default function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'medium',
  leftIcon,
  rightIcon,
  fullWidth = false,
  loading = false,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = [
    'ui-button',
    `ui-button--${variant}`,
    `ui-button--${size}`,
    fullWidth && 'ui-button--full-width',
    loading && 'ui-button--loading',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      {...props}
      className={classes}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {leftIcon && <span className="ui-button__icon ui-button__icon--left" aria-hidden="true">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ui-button__icon ui-button__icon--right" aria-hidden="true">{rightIcon}</span>}
    </button>
  )
}
