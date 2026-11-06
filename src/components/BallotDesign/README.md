# Ballot artwork

The SVG files in `assets/` are the source artwork for the printed paper surfaces. Edit their SVG shapes, text, and `viewBox` here; the 3D panel geometry and fold/flip timeline are independent.

- `BallotCover.svg`: folded front cover.
- `OuterLeft.svg`: blank outer paper panel.
- `OuterCover.svg`: the same physical cover when the outside is unfolded.
- `OuterInformation.svg`: printed election information panel.
- `InnerHeader.svg`: continuous three-panel header; it is rasterized at 2× and cropped into the three physical panels.
- `CandidateColumn.svg`: candidate column template. Candidate text, colors, selection mark, and photo are supplied by `src/config/candidates.ts`.
- `KpuLogo.svg` and `AyoMemilihLogo.svg`: independent reusable logo artwork, inlined into the cover and inner header before rasterization.

Candidate photos should be placed under `public/candidates/` and configured as a root-relative path such as `/candidates/paslon-01.jpg`. Set `photo: null` to retain the SVG placeholder illustration.
