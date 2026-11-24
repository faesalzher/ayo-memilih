const STORAGE_KEY = 'ayo-memilih-simulation-votes'

export type VoteTally = Record<string, number>

export type VoteSnapshot = {
  period: string
  votes: VoteTally
}

function getVotePeriod(now: Date = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${now.getFullYear()}-${month}`
}

function emptySnapshot(candidateIds: readonly string[], period: string): VoteSnapshot {
  return { period, votes: Object.fromEntries(candidateIds.map((id) => [id, 0])) }
}

export function ensureCurrentPeriod(snapshot: VoteSnapshot, candidateIds: readonly string[]): VoteSnapshot {
  const currentPeriod = getVotePeriod()
  return snapshot.period === currentPeriod ? snapshot : emptySnapshot(candidateIds, currentPeriod)
}

export function addVote(snapshot: VoteSnapshot, candidateId: string, candidateIds: readonly string[]): VoteSnapshot {
  const current = ensureCurrentPeriod(snapshot, candidateIds)
  return { ...current, votes: { ...current.votes, [candidateId]: (current.votes[candidateId] ?? 0) + 1 } }
}

export function loadVotes(candidateIds: readonly string[]): VoteSnapshot {
  const currentPeriod = getVotePeriod()
  const empty = emptySnapshot(candidateIds, currentPeriod)

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return empty

    const stored = JSON.parse(raw) as VoteSnapshot
    const isCurrentPeriod = stored.period === currentPeriod
    const isValid = typeof stored.votes === 'object' && stored.votes !== null &&
      candidateIds.every((id) => typeof stored.votes[id] === 'number')
    if (!isCurrentPeriod || !isValid) return empty

    return { period: currentPeriod, votes: Object.fromEntries(candidateIds.map((id) => [id, Number(stored.votes[id])])) }
  } catch {
    return empty
  }
}

export function saveVotes(snapshot: VoteSnapshot) {
  const payload = ensureCurrentPeriod(snapshot, Object.keys(snapshot.votes))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function resetStaleVotes(candidateIds: readonly string[]) {
  const currentPeriod = getVotePeriod()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    if ((JSON.parse(raw) as VoteSnapshot).period === currentPeriod) return
  } catch {
    // Data rusak dianggap stale dan ditimpa dengan nol.
  }
  saveVotes(emptySnapshot(candidateIds, currentPeriod))
}
