import type { ReactNode } from 'react'
import Button from '../common/Button'

type BaseModalProps = {
  children: ReactNode
  onClose: () => void
  labelledBy: string
  overlayClassName?: string
  panelClassName?: string
  closeButtonClassName?: string
  closeIcon?: ReactNode
  closeLabel?: string
  scrollable?: boolean
}

export default function BaseModal({
  children,
  onClose,
  labelledBy,
  overlayClassName = '',
  panelClassName = '',
  closeButtonClassName = '',
  closeIcon = '×',
  closeLabel = 'Tutup dialog',
  scrollable = false,
}: BaseModalProps) {
  return (
    <div className={`ui-modal-overlay ${overlayClassName}`.trim()}>
      <section
        className={`ui-modal-panel${scrollable ? ' ui-modal-panel--scrollable' : ''} ${panelClassName}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        <Button
          variant="icon-only"
          size="small"
          className={`ui-modal-close ${closeButtonClassName}`.trim()}
          onClick={onClose}
          aria-label={closeLabel}
        >
          {closeIcon}
        </Button>
        {children}
      </section>
    </div>
  )
}
