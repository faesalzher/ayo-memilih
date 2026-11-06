export type BallotPhase =
  | 'folded-cover'
  | 'opening-outer-fold'
  | 'outer-open'
  | 'flipping-inner'
  | 'opened'
  | 'refolding-outer'
  | 'folding-cover'

export type PunchState = 'idle' | 'candidate-selected' | 'punching' | 'punched' | 'completed'

export type PunchTarget = { screenX: number; screenY: number }
