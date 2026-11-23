import { ScreenTitle } from '../common/Typography'
import { useHoldGesture, useTapGesture } from '../admin/useHoldGesture'

const LOGO_HOLD_MS = 5000
const LOGO_TAP_COUNT = 5
const LOGO_TAP_WINDOW_MS = 2000

type ScreenHeaderProps = {
  logoSrc?: string
  onLogoHold?: () => void
  brandLines?: readonly [string, string]
  title?: string
  subtitle?: string
  brandClassName?: string
  logoClassName?: string
  brandTextClassName?: string
  titleClassName?: string
  subtitleClassName?: string
  titleWrapperClassName?: string
  titleAs?: 'h1' | 'h2'
}

export default function ScreenHeader({
  logoSrc = '/idle-assets/kpu-logo.png',
  onLogoHold,
  brandLines = ['KOMISI PEMILIHAN UMUM', 'KOTA BATU'],
  title,
  subtitle,
  brandClassName = '',
  logoClassName = '',
  brandTextClassName = '',
  titleClassName = '',
  subtitleClassName = '',
  titleWrapperClassName = '',
  titleAs = 'h1',
}: ScreenHeaderProps) {
  const logoHold = useHoldGesture(LOGO_HOLD_MS, onLogoHold)
  const logoTap = useTapGesture(LOGO_TAP_COUNT, LOGO_TAP_WINDOW_MS, onLogoHold)

  return (
    <>
      <header className={`ui-screen-header ${brandClassName}`.trim()}>
        <img
          className={`ui-screen-header__logo ${logoClassName}`.trim()}
          src={logoSrc}
          alt=""
          draggable={false}
          style={{ userSelect: 'none', WebkitTouchCallout: 'none' }}
          {...logoHold}
          onClick={logoTap}
        />
        <span className={`ui-screen-header__brand ${brandTextClassName}`.trim()}>
          {brandLines.map((line) => <strong key={line}>{line}</strong>)}
        </span>
      </header>
      {title && (
        <ScreenTitle
          title={title}
          subtitle={subtitle}
          titleAs={titleAs}
          className={titleWrapperClassName}
          titleClassName={titleClassName}
          subtitleClassName={subtitleClassName}
        />
      )}
    </>
  )
}
