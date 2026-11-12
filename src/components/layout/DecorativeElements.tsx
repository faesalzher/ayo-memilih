type DecorativeItem = {
  src: string
  className: string
}

type DecorativeElementsProps = {
  items: readonly DecorativeItem[]
}

export default function DecorativeElements({ items }: DecorativeElementsProps) {
  return (
    <>
      {items.map(({ src, className }) => (
        <img key={className} className={className} src={src} alt="" aria-hidden="true" />
      ))}
    </>
  )
}
