export const AUDIO_VOLUME = {
  idleBgm: 0.4,
  gameplayBgm: 0.35,
  buttonSfx: 0.55,
  interactionSfx: 0.65,
  successSfx: 0.75,
  victoryFanfare: 0.75,
} as const

export const AUDIO_TIMING = {
  crossfadeMs: 1000,
  duckDb: -5,
  duckAttackMs: 60,
  duckReleaseMs: 400,
} as const

export const BGM_SRC = {
  idle: '/audio/bgm/BGM_Yummy_Flavor_64kbps.mp3',
  gameplay: '/audio/bgm/play-bgm.ogg',
} as const

export type BgmKey = keyof typeof BGM_SRC

export const BGM_VOLUME: Record<BgmKey, number> = {
  idle: AUDIO_VOLUME.idleBgm,
  gameplay: AUDIO_VOLUME.gameplayBgm,
}

export const SFX_SRC = {
  buttonClick: '/audio/sfx/video-game-retro-click.ogg',
  buttonConfirm: '/audio/sfx/light-button.ogg',
  navigation: '/audio/sfx/fast-small-sweep-transition.ogg',
  candidateSelect: '/audio/sfx/gear-fast-lock-tap.ogg',
  cardSelect: '/audio/sfx/poker-card-flick.ogg',
  paperUnfold: '/audio/sfx/paper-rustling.ogg',
  paperRustle: '/audio/sfx/paper-rustling.ogg',
  paperFold: '/audio/sfx/paper-rustling.ogg',
  ballotInsert: '/audio/sfx/ballot-insertion.ogg',
  liquidDip: '/audio/sfx/liquid-dipping.mp3',
  success: '/audio/sfx/game-success-alert.ogg',
  achievement: '/audio/sfx/casino-bling-achievement.ogg',
  resultsReveal: '/audio/sfx/game-level-completed.ogg',
  stepReveal: '/audio/sfx/long-pop.ogg',
  ballotHit: '/audio/sfx/ballot-hit.mp3',
  ballotPunch: '/audio/sfx/ballot-punch.mp3',
} as const

export type SfxKey = keyof typeof SFX_SRC

export type SfxCategory = 'buttonSfx' | 'interactionSfx' | 'successSfx' | 'victoryFanfare'

export const SFX_CATEGORY: Record<SfxKey, SfxCategory> = {
  buttonClick: 'buttonSfx',
  buttonConfirm: 'buttonSfx',
  navigation: 'buttonSfx',
  candidateSelect: 'interactionSfx',
  cardSelect: 'interactionSfx',
  paperUnfold: 'interactionSfx',
  paperRustle: 'interactionSfx',
  paperFold: 'interactionSfx',
  ballotInsert: 'interactionSfx',
  liquidDip: 'interactionSfx',
  success: 'successSfx',
  achievement: 'victoryFanfare',
  resultsReveal: 'victoryFanfare',
  stepReveal: 'interactionSfx',
  ballotHit: 'interactionSfx',
  ballotPunch: 'interactionSfx',
}
