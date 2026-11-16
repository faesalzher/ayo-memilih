export type FigmaCandidate = {
  number: string
  rowY: number
  firstName: string
  runningMate: string
  numberBack: string
  numberFront: string
  theme: {
    accent: string
    shadow: string
    text: string
  }
  vision: string
  mission: string
  program: string[]
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
    theme: { accent: '#de0900', shadow: '#af0700', text: '#ffffff' },
    vision: 'Mewujudkan Kota Batu yang maju, nyaman, dan berdaya saing.',
    mission: 'Meningkatkan pelayanan publik, memperluas kesempatan, dan menjaga lingkungan Kota Batu.',
    program: [
      'Membangun ruang bermain dan taman yang ramah untuk semua keluarga.',
      'Mengadakan kelas kreatif dan kegiatan belajar untuk anak-anak.',
      'Mengajak warga menjaga kebersihan lingkungan dan menanam pohon.',
      'Memperbaiki layanan publik agar lebih mudah diakses warga.',
    ],
    values: ['MAJU', 'NYAMAN', 'BERDAYA SAING'],
  },
  {
    number: '2',
    rowY: 857,
    firstName: 'BIMA YULIANANTA',
    runningMate: 'SARI RENGGITA',
    numberBack: '4d45e.svg',
    numberFront: '82ea6.svg',
    theme: { accent: '#ffd54a', shadow: '#f5a614', text: '#2c2c2c' },
    vision: 'Mewujudkan Kota Batu yang sejahtera, inklusif, dan tangguh.',
    mission: 'Memperkuat layanan publik dan membuka peluang bagi seluruh warga.',
    program: [
      'Membantu usaha kecil warga berkembang melalui pelatihan dan pasar bersama.',
      'Mendekatkan layanan kesehatan ke lingkungan tempat tinggal warga.',
      'Menyediakan transportasi yang nyaman dan mudah digunakan.',
      'Membuka kegiatan keterampilan untuk anak muda dan keluarga.',
    ],
    values: ['SEJAHTERA', 'INKLUSIF', 'TANGGUH'],
  },
  {
    number: '3',
    rowY: 1217,
    firstName: 'DIMAS RAKA',
    runningMate: 'DARA PERTIWI',
    numberBack: '73471.svg',
    numberFront: 'c0838.svg',
    theme: { accent: '#4099e0', shadow: '#2e7ac2', text: '#2c2c2c' },
    vision: 'Menjaga Kota Batu tetap lestari sekaligus berkembang berkelanjutan.',
    mission: 'Merawat alam, memperkuat ekonomi lokal, dan melibatkan masyarakat.',
    program: [
      'Mengembangkan tempat wisata yang menjaga keindahan alam Kota Batu.',
      'Mengajak warga memilah sampah dan memperbanyak kegiatan daur ulang.',
      'Mendukung petani lokal dengan pelatihan dan akses pasar.',
      'Menanam pohon bersama untuk menjaga udara dan sumber air.',
    ],
    values: ['LESTARI', 'MANDIRI', 'BERKELANJUTAN'],
  },
]
