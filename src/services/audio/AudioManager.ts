import { AUDIO_TIMING, AUDIO_VOLUME, BGM_SRC, BGM_VOLUME, SFX_CATEGORY, SFX_SRC } from './audioConfig'
import type { BgmKey, SfxKey } from './audioConfig'

type AudioGraph = {
  ctx: AudioContext
  master: GainNode
  bgmBus: GainNode
  sfxBus: GainNode
}

type BgmPlayback = {
  source: AudioBufferSourceNode
  gain: GainNode
}

const DUCK_GAIN = 10 ** (AUDIO_TIMING.duckDb / 20)

class AudioManager {
  private graph: AudioGraph | null = null
  private buffers = new Map<string, Promise<AudioBuffer>>()
  private bgm: BgmPlayback | null = null
  private bgmKey: BgmKey | null = null
  private activeSfx = 0
  private muted = false

  setMuted(value: boolean) {
    this.muted = value
    if (this.graph) this.graph.master.gain.value = value ? 0 : 1
  }

  playBgm(key: BgmKey) {
    if (this.bgmKey === key) return
    const graph = this.ensureGraph()
    if (!graph) return
    this.bgmKey = key
    this.getBuffer(graph.ctx, BGM_SRC[key])
      .then((buffer) => {
        if (this.bgmKey === key) this.crossfadeTo(graph, key, buffer)
      })
      .catch((error: unknown) => console.warn(`Gagal memuat BGM ${key}`, error))
  }

  playSfx(key: SfxKey) {
    const graph = this.ensureGraph()
    if (!graph) return
    const { ctx, sfxBus } = graph
    this.getBuffer(ctx, SFX_SRC[key])
      .then((buffer) => {
        const gain = ctx.createGain()
        gain.gain.value = AUDIO_VOLUME[SFX_CATEGORY[key]]
        gain.connect(sfxBus)
        const source = ctx.createBufferSource()
        source.buffer = buffer
        source.connect(gain)
        this.duckBgm(graph)
        source.onended = () => {
          gain.disconnect()
          this.releaseBgm(graph)
        }
        source.start()
      })
      .catch((error: unknown) => console.warn(`Gagal memutar SFX ${key}`, error))
  }

  private ensureGraph(): AudioGraph | null {
    if (this.graph) return this.graph
    if (typeof AudioContext === 'undefined') return null

    const ctx = new AudioContext()
    const master = ctx.createGain()
    master.gain.value = this.muted ? 0 : 1
    master.connect(ctx.destination)
    const bgmBus = ctx.createGain()
    bgmBus.connect(master)
    const sfxBus = ctx.createGain()
    sfxBus.connect(master)
    this.graph = { ctx, master, bgmBus, sfxBus }

    const resume = () => {
      if (ctx.state !== 'running') ctx.resume().catch(() => undefined)
    }
    window.addEventListener('pointerdown', resume)
    window.addEventListener('keydown', resume)
    return this.graph
  }

  private getBuffer(ctx: AudioContext, src: string): Promise<AudioBuffer> {
    const cached = this.buffers.get(src)
    if (cached) return cached
    const pending = fetch(src)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status} untuk ${src}`)
        return response.arrayBuffer()
      })
      .then((data) => ctx.decodeAudioData(data))
      .catch((error: unknown) => {
        this.buffers.delete(src)
        throw error
      })
    this.buffers.set(src, pending)
    return pending
  }

  private crossfadeTo(graph: AudioGraph, key: BgmKey, buffer: AudioBuffer) {
    const { ctx, bgmBus } = graph
    const now = ctx.currentTime
    const halfFade = AUDIO_TIMING.crossfadeMs / 2000
    const outEnd = now + halfFade
    const inEnd = outEnd + halfFade

    const previous = this.bgm
    if (previous) {
      previous.gain.gain.cancelScheduledValues(now)
      previous.gain.gain.setValueAtTime(previous.gain.gain.value, now)
      previous.gain.gain.linearRampToValueAtTime(0, outEnd)
      previous.source.onended = () => previous.gain.disconnect()
      previous.source.stop(outEnd + 0.05)
    }

    // New track waits for the previous one to fade out so the two never overlap audibly.
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, now)
    gain.gain.setValueAtTime(0, outEnd)
    gain.gain.linearRampToValueAtTime(BGM_VOLUME[key], inEnd)
    gain.connect(bgmBus)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    source.connect(gain)
    source.start(now)
    this.bgm = { source, gain }
  }

  private duckBgm(graph: AudioGraph) {
    this.activeSfx += 1
    this.rampBgmBus(graph, DUCK_GAIN, AUDIO_TIMING.duckAttackMs)
  }

  private releaseBgm(graph: AudioGraph) {
    this.activeSfx = Math.max(0, this.activeSfx - 1)
    if (this.activeSfx === 0) this.rampBgmBus(graph, 1, AUDIO_TIMING.duckReleaseMs)
  }

  private rampBgmBus(graph: AudioGraph, target: number, rampMs: number) {
    const { ctx, bgmBus } = graph
    const now = ctx.currentTime
    bgmBus.gain.cancelScheduledValues(now)
    bgmBus.gain.setValueAtTime(bgmBus.gain.value, now)
    bgmBus.gain.linearRampToValueAtTime(target, now + rampMs / 1000)
  }
}

export const audioManager = new AudioManager()
