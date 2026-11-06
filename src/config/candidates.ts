export type SimulationCandidate = {
  number: string
  name: string
  runningMate: string
  /** Public asset path, e.g. /candidates/paslon-01.jpg. Keep null for illustration. */
  photo: string | null
  accent: string
  skin: string
  shirt: string
  runningMateSkin: string
  runningMateShirt: string
}

/** Edit candidate data and photo paths here; photos belong in public/candidates/. */
export const SIMULATION_CANDIDATES: SimulationCandidate[] = [
  { number: '01', name: 'Kandidat A', runningMate: 'Wakil Kandidat A', photo: null, accent: '#d6a03e', skin: '#d5a07d', shirt: '#243b54', runningMateSkin: '#e8bd9f', runningMateShirt: '#252a32' },
  { number: '02', name: 'Kandidat B', runningMate: 'Wakil Kandidat B', photo: null, accent: '#f0ca43', skin: '#a97050', shirt: '#477fa2', runningMateSkin: '#d5a07d', runningMateShirt: '#35465a' },
  { number: '03', name: 'Kandidat C', runningMate: 'Wakil Kandidat C', photo: null, accent: '#d92835', skin: '#e5b393', shirt: '#283442', runningMateSkin: '#a97050', runningMateShirt: '#27374b' },
]
