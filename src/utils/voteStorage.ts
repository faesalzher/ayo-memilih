const STORAGE_KEY = 'ayo-memilih-simulation-votes'

export type VoteTally = Record<string, number>

type StoredVotes = {
  date: string
  votes: VoteTally
}

function getTodayKey() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

function emptyTally(candidateIds: readonly string[]): VoteTally {
  return Object.fromEntries(candidateIds.map((id) => [id, 0]))
}

export function loadVotes(candidateIds: readonly string[]): VoteTally {
  const empty = emptyTally(candidateIds)

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return empty

    const stored = JSON.parse(raw) as StoredVotes
    const isToday = stored.date === getTodayKey()
    const isValid = typeof stored.votes === 'object' && stored.votes !== null &&
      candidateIds.every((id) => typeof stored.votes[id] === 'number')
    if (!isToday || !isValid) return empty

    return Object.fromEntries(candidateIds.map((id) => [id, Number(stored.votes[id])]))
  } catch {
    return empty
  }
}

export function saveVotes(votes: VoteTally) {
  const payload: StoredVotes = { date: getTodayKey(), votes }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}
