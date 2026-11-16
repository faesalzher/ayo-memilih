import FigmaAsset from '../figma/FigmaAsset'
import { position } from '../../utils/figmaPosition'
import ScreenHeader from './ScreenHeader'
import '../../pages/FigmaFlow/FigmaFlow.css'

export default function FlowHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <>
      <div className="flow-header">
        <FigmaAsset file="e4513.svg" {...position(0, 0, 1080, 365)} />
        <FigmaAsset file="6dbac.svg" {...position(0, 0, 1099, 347)} />
        <FigmaAsset file="9931e.svg" {...position(0, 0, 1099, 105)} />
        <FigmaAsset file="1ab6a.svg" {...position(0, 0, 348, 143)} />
      </div>
      <ScreenHeader
        title={title}
        subtitle={subtitle}
        brandLines={['KOMISI PEMILIHAN UMUM', 'KOTA BATU']}
        brandClassName="flow-brand"
        logoClassName="flow-brand-logo"
        brandTextClassName="flow-brand-copy"
        titleClassName="flow-title"
        subtitleClassName="flow-subtitle"
      />
    </>
  )
}