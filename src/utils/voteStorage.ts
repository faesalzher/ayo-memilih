const STORAGE_KEY = 'ayo-memilih-simulation-votes'

type StoredVotes = {
  date: string
  votes: number[]
}

function getTodayKey() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function loadVotes(candidateCount: number): number[] {
  const empty = Array.from({ length: candidateCount }, () => 0)

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return empty

    const stored = JSON.parse(raw) as StoredVotes
    const isToday = stored.date === getTodayKey()
    const isValid = Array.isArray(stored.votes) && stored.votes.length === candidateCount
    return isToday && isValid ? stored.votes.map(Number) : empty
  } catch {
    return empty
  }
}

export function saveVotes(votes: number[]) {
  const payload: StoredVotes = { date: getTodayKey(), votes }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}
