import pikoDanPika from '../assets/candidates/piko-dan-pika-ballot.png'
import bimoDanMomo from '../assets/candidates/bimo-dan-momo-ballot-transparent.png'
import leoDanLili from '../assets/candidates/leo-dan-lili-ballot.png'
import pikoDanPikaCampaign from '../assets/candidates/piko-dan-pika-campaign.png'
import bimoDanMomoCampaign from '../assets/candidates/bimo-dan-momo-campaign.png'
import leoDanLiliCampaign from '../assets/candidates/leo-dan-lili-campaign (2).png'

export type CandidatePalette = {
  accent: string
  shadow: string
  text: string
}

export interface Candidate {
  id: string
  number: number

  name: string
  viceName: string
  mainCharacter: string
  viceCharacter: string

  theme: string
  vision: string
  missions: string[]
  programs: string[]

  /** Ilustrasi pasangan (calon utama dan wakil) yang tampil pada surat suara 3D. */
  ballotImage: string
  /** Ilustrasi campaign yang tampil pada layar Kenali Pilihanmu dan detail kandidat. */
  campaignImage: string
  /** Ilustrasi individual belum tersedia; diisi saat aset karakter tunggal disiapkan. */
  mainCharacterImage: string | null
  viceCharacterImage: string | null

  accentColor: string
  palette: CandidatePalette
  figma: {
    rowY: number
    numberBack: string
    numberFront: string
  }
}

/** Single source of truth untuk seluruh layar kandidat, surat suara, konfirmasi, dan hasil. */
export const CANDIDATES: Candidate[] = [
  {
    id: 'piko-dan-pika',
    number: 1,
    name: 'Piko Panda',
    viceName: 'Pika Rubah',
    mainCharacter: 'Panda',
    viceCharacter: 'Rubah',
    theme: 'Pendidikan dan literasi',
    vision: 'Mewujudkan generasi yang cerdas, gemar belajar, dan memiliki semangat untuk terus berkembang.',
    missions: [
      'Meningkatkan minat belajar dan budaya membaca.',
      'Menyediakan kegiatan edukasi yang menyenangkan.',
      'Mendorong anak-anak untuk berani menyampaikan pendapat.',
    ],
    programs: ['Taman Baca Ceria.', 'Kelas Kreativitas Anak.', 'Sahabat Literasi.'],
    ballotImage: pikoDanPika,
    campaignImage: pikoDanPikaCampaign,
    mainCharacterImage: null,
    viceCharacterImage: null,
    accentColor: '#c0111f',
    palette: { accent: '#de0900', shadow: '#af0700', text: '#ffffff' },
    figma: { rowY: 490, numberBack: '1ecee.svg', numberFront: 'cbaf7.svg' },
  },
  {
    id: 'bimo-dan-momo',
    number: 2,
    name: 'Bimo Gajah',
    viceName: 'Momo Monyet',
    mainCharacter: 'Gajah',
    viceCharacter: 'Monyet',
    theme: 'Lingkungan dan kebersamaan',
    vision: 'Mewujudkan lingkungan yang bersih, hijau, nyaman, dan penuh semangat kebersamaan.',
    missions: [
      'Meningkatkan kepedulian terhadap kebersihan lingkungan.',
      'Mengajak masyarakat menjaga kelestarian alam dan satwa.',
      'Membangun budaya gotong royong sejak dini.',
    ],
    programs: ['Gerakan Lingkungan Bersih.', 'Sahabat Satwa.', 'Aksi Hijau Bersama.'],
    ballotImage: bimoDanMomo,
    campaignImage: bimoDanMomoCampaign,
    mainCharacterImage: null,
    viceCharacterImage: null,
    accentColor: '#f0991f',
    palette: { accent: '#ffd54a', shadow: '#f5a614', text: '#2c2c2c' },
    figma: { rowY: 857, numberBack: '4d45e.svg', numberFront: '82ea6.svg' },
  },
  {
    id: 'leo-dan-lili',
    number: 3,
    name: 'Leo Singa',
    viceName: 'Lili Kelinci',
    mainCharacter: 'Singa',
    viceCharacter: 'Kelinci',
    theme: 'Kreativitas dan inovasi',
    vision: 'Mewujudkan generasi kreatif, percaya diri, inovatif, dan berani menciptakan hal-hal baru.',
    missions: [
      'Mengembangkan kreativitas dan bakat anak-anak.',
      'Mendorong pemanfaatan teknologi untuk kegiatan positif.',
      'Memberikan ruang untuk bereksperimen dan berinovasi.',
    ],
    programs: ['Festival Kreasi Anak.', 'Pojok Sains dan Teknologi.', 'Kompetisi Ide Kreatif.'],
    ballotImage: leoDanLili,
    campaignImage: leoDanLiliCampaign,
    mainCharacterImage: null,
    viceCharacterImage: null,
    accentColor: '#337acc',
    palette: { accent: '#4099e0', shadow: '#2e7ac2', text: '#2c2c2c' },
    figma: { rowY: 1217, numberBack: '73471.svg', numberFront: 'c0838.svg' },
  },
]
