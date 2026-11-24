# Ballot artwork

The SVG files in `assets/` are the source artwork for the printed paper surfaces. Edit their SVG shapes, text, and `viewBox` here; the 3D panel geometry and fold/flip timeline are independent.

- `BallotCover.svg`: folded front cover.
- `OuterLeft.svg`: blank outer paper panel.
- `OuterCover.svg`: the same physical cover when the outside is unfolded.
- `OuterInformation.svg`: printed election information panel.
- `InnerHeader.svg`: continuous three-panel header; it is rasterized at 2× and cropped into the three physical panels.
- `CandidateColumn.svg`: candidate column template. Candidate text, colors, selection mark, and photo are supplied by `src/data/candidates.ts`.
- `KpuLogo.svg` and `AyoMemilihLogo.svg`: independent reusable logo artwork, inlined into the cover and inner header before rasterization.

Candidate photos are imported from `src/assets/candidates/` in `src/data/candidates.ts` (the `ballotImage` field, `-ballot` assets; Bimo uses `bimo-dan-momo-ballot-transparent.png`, a copy of the ballot art with its outer white turned transparent). The photo area is filled with `bg-ballot-candidate.png` (slice) and the pair illustration is drawn in front of it with `preserveAspectRatio="xMidYMid meet"`, so the whole pair stays visible.
