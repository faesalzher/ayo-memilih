import { ScreenTitle } from '../common/Typography'

type ScreenHeaderProps = {
  logoSrc?: string
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
  return (
    <>
      <header className={`ui-screen-header ${brandClassName}`.trim()}>
        <img className={`ui-screen-header__logo ${logoClassName}`.trim()} src={logoSrc} alt="" />
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
