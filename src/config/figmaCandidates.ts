export type FigmaCandidate = {
  number: string
  rowY: number
  firstName: string
  runningMate: string
  numberBack: string
  numberFront: string
  vision: string
  mission: string
  program: string
  values: string[]
}

export const FIGMA_CANDIDATES: FigmaCandidate[] = [
  {
    number: '1',
    rowY: 490,
    firstName: 'ANGGA PRATAMA',
    runningMate: 'WAHYU UTAMI',
    numberBack: '1ecee.svg',
    numberFront: 'cbaf7.svg',
    vision: 'Mewujudkan Kota Batu yang maju, nyaman, dan berdaya saing.',
    mission: 'Meningkatkan pelayanan publik, memperluas kesempatan, dan menjaga lingkungan Kota Batu.',
    program: 'Ruang publik ramah keluarga, pendidikan kreatif, serta lingkungan yang bersih dan berkelanjutan.',
    values: ['MAJU', 'NYAMAN', 'BERDAYA SAING'],
  },
  {
    number: '2',
    rowY: 857,
    firstName: 'BIMA YULIANANTA',
    runningMate: 'SARI RENGGITA',
    numberBack: '4d45e.svg',
    numberFront: '82ea6.svg',
    vision: 'Mewujudkan Kota Batu yang sejahtera, inklusif, dan tangguh.',
    mission: 'Memperkuat layanan publik dan membuka peluang bagi seluruh warga.',
    program: 'Dukungan UMKM, layanan kesehatan dekat warga, dan transportasi yang nyaman.',
    values: ['SEJAHTERA', 'INKLUSIF', 'TANGGUH'],
  },
  {
    number: '3',
    rowY: 1217,
    firstName: 'DIMAS RAKA',
    runningMate: 'DARA PERTIWI',
    numberBack: '73471.svg',
    numberFront: 'c0838.svg',
    vision: 'Menjaga Kota Batu tetap lestari sekaligus berkembang berkelanjutan.',
    mission: 'Merawat alam, memperkuat ekonomi lokal, dan melibatkan masyarakat.',
    program: 'Wisata hijau, pengelolaan sampah terpadu, dan pertanian berkelanjutan.',
    values: ['LESTARI', 'MANDIRI', 'BERKELANJUTAN'],
  },
]
