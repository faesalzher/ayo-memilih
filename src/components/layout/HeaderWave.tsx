type HeaderWaveProps = {
  variant?: 'standard' | 'results'
  className?: string
}

const assets = {
  standard: {
    cream: 'header-cream.svg',
    white: 'header-white.svg',
    red: 'header-red.svg',
    dark: 'header-dark.svg',
    crescent: 'header-crescent.svg',
  },
  results: {
    cream: 'results-cream.svg',
    red: 'results-red.svg',
    dark: 'results-dark.svg',
    crescent: 'results-crescent.svg',
  },
}

export default function HeaderWave({ variant = 'standard', className = '' }: HeaderWaveProps) {
  const variantAssets = assets[variant]
  return (
    <div className={`figma-header-wave figma-header-wave-${variant} ${className}`.trim()} aria-hidden="true">
      <img className="figma-wave-cream" src={`/figma-ui/${variantAssets.cream}`} alt="" />
      {'white' in variantAssets && <img className="figma-wave-white" src={`/figma-ui/${variantAssets.white}`} alt="" />}
      <img className="figma-wave-red" src={`/figma-ui/${variantAssets.red}`} alt="" />
      <img className="figma-wave-dark" src={`/figma-ui/${variantAssets.dark}`} alt="" />
      <img className="figma-wave-crescent" src={`/figma-ui/${variantAssets.crescent}`} alt="" />
    </div>
  )
}
