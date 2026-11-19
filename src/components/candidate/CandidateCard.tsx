import type { CSSProperties } from 'react'
import type { SimulationCandidate } from '../../config/candidates'
import type { FigmaCandidate } from '../../config/figmaCandidates'
import Button from '../common/Button'
import Card from '../common/Card'
import FigmaAsset from '../figma/FigmaAsset'
import { position } from '../../utils/figmaPosition'

type StandardCandidateCardProps = {
  candidate: SimulationCandidate
  selected: boolean
  onSelect: () => void
  variant?: 'standard'
}

type FigmaCandidateCardProps = {
  candidate: FigmaCandidate
  index: number
  onSelect: () => void
  variant: 'figma'
  viewed?: boolean
}

type CandidateCardProps = StandardCandidateCardProps | FigmaCandidateCardProps

export default function CandidateCard(props: CandidateCardProps) {
  if (props.variant === 'figma') {
    const { candidate, index, onSelect, viewed } = props
    return (
      <Card
        className={`candidate-visual${viewed ? ' is-viewed' : ''}`}
        style={{ '--card-delay': `${index * 0.3}s` } as CSSProperties}
        variant="candidate"
      >
        <FigmaAsset file="39063.svg" {...position(113, candidate.rowY + 2, 844, 252)} />
        <FigmaAsset file="8f11a.png" {...position(170, candidate.rowY + 22, 222, 203)} />
        <span className="candidate-name" style={position(414, candidate.rowY + 75, 310, 100)}>
          <strong>{candidate.firstName}</strong><strong>{candidate.runningMate}</strong>
        </span>
        <FigmaAsset file={candidate.numberBack} {...position(740, candidate.rowY, 225, 264)} />
        <FigmaAsset file={candidate.numberFront} {...position(740, candidate.rowY, 225, 254)} />
        <span className="candidate-number-label" style={position(782.5, candidate.rowY + 49, 140, 50)}>NOMOR URUT</span>
        <span className="candidate-number" style={position(812.5, candidate.rowY + 96, 80, 110)}>{candidate.number}</span>
        <span className="candidate-tap-hint" aria-hidden="true" style={position(984, candidate.rowY + 108, 44, 48)}>
          <svg viewBox="0 0 60 60" preserveAspectRatio="none"><path d="M42 12 L18 30 L42 48" /></svg>
        </span>
        <Button
          variant="icon-only"
          className="candidate-hitarea"
          style={position(109, candidate.rowY, 856, 264)}
          aria-label={`Lihat visi, misi, dan program ${candidate.firstName} dan ${candidate.runningMate}`}
          onClick={onSelect}
        />
      </Card>
    )
  }

  const { candidate, selected, onSelect } = props
  return (
    <Card
      variant="candidate"
      className={`candidate-card${selected ? ' candidate-card-selected' : ''}`}
      style={{ '--candidate-accent': candidate.accent } as CSSProperties}
    >
      <div className="candidate-art">
        <img src={candidate.cardArtwork} alt="" />
        <span><strong>{candidate.number}</strong><small>PILIHAN</small></span>
      </div>
      <div className="candidate-card-copy">
        <h2>{candidate.name}<span>dan</span>{candidate.runningMate}</h2>
        <Button type="button" variant="primary" className="candidate-card-action" onClick={onSelect}>
          LIHAT KANDIDAT <span aria-hidden="true">→</span>
        </Button>
      </div>
    </Card>
  )
}
