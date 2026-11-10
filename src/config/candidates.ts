export type SimulationCandidate = {
  number: string
  name: string
  runningMate: string
  party: string
  vision: string
  mission: string
  program: string
  cardArtwork: string
  candidatePortrait: string
  runningMatePortrait: string
  /** Public asset path, e.g. /candidates/paslon-01.jpg. Keep null for illustration. */
  photo: string | null
  accent: string
  skin: string
  shirt: string
  runningMateSkin: string
  runningMateShirt: string
}

/** The demo candidates and their Figma artwork drive both the selection and ballot screens. */
export const SIMULATION_CANDIDATES: SimulationCandidate[] = [
  {
    number: '01',
    name: 'Arga Pratama',
    runningMate: 'Naya Kirana',
    party: 'BATU MAJU',
    vision: 'Mewujudkan Kota Batu yang maju, nyaman, dan berdaya saing.',
    mission: 'Meningkatkan pelayanan, membuka kesempatan, dan menjaga lingkungan.',
    program: 'Ruang publik ramah anak, pendidikan kreatif, dan lingkungan hijau.',
    cardArtwork: '/figma-ui/candidate-01.png',
    candidatePortrait: '/figma-ui/candidate-01.png',
    runningMatePortrait: '/figma-ui/candidate-02.png',
    photo: '/figma-ui/candidate-01.png',
    accent: '#c0111f',
    skin: '#d5a07d',
    shirt: '#c0111f',
    runningMateSkin: '#e8bd9f',
    runningMateShirt: '#c0111f',
  },
  {
    number: '02',
    name: 'Bima Wicaksana',
    runningMate: 'Laras Puspita',
    party: 'BATU SEJAHTERA',
    vision: 'Membangun Kota Batu yang sejahtera, inklusif, dan tangguh.',
    mission: 'Memperkuat layanan publik dan membuka peluang bagi seluruh warga.',
    program: 'Dukungan UMKM, layanan kesehatan dekat warga, dan transportasi nyaman.',
    cardArtwork: '/figma-ui/candidate-02.png',
    candidatePortrait: '/figma-ui/candidate-02.png',
    runningMatePortrait: '/figma-ui/candidate-02.png',
    photo: '/figma-ui/candidate-02.png',
    accent: '#f0991f',
    skin: '#a97050',
    shirt: '#f0991f',
    runningMateSkin: '#d5a07d',
    runningMateShirt: '#f0991f',
  },
  {
    number: '03',
    name: 'Damar Satya',
    runningMate: 'Sinta Maheswari',
    party: 'BATU LESTARI',
    vision: 'Menjaga Kota Batu tetap lestari sekaligus berkembang berkelanjutan.',
    mission: 'Merawat alam, memperkuat ekonomi lokal, dan melibatkan masyarakat.',
    program: 'Wisata hijau, pengelolaan sampah terpadu, dan pertanian berkelanjutan.',
    cardArtwork: '/figma-ui/candidate-03.png',
    candidatePortrait: '/figma-ui/candidate-03.png',
    runningMatePortrait: '/figma-ui/candidate-03.png',
    photo: '/figma-ui/candidate-03.png',
    accent: '#337acc',
    skin: '#e5b393',
    shirt: '#337acc',
    runningMateSkin: '#a97050',
    runningMateShirt: '#337acc',
  },
]
