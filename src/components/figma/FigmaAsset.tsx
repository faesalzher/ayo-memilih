import type { CSSProperties } from 'react'

export default function FigmaAsset({
  file,
  alt = '',
  ...style
}: { file: string; alt?: string } & CSSProperties) {
  return <img className="figma-asset" src={`/figma-assets/${file}`} alt={alt} style={style} />
}
