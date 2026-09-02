// Web Audio API based sound synthesizer for task completions, alerts, and ambient focus noise

class SoundManager {
  private ctx: AudioContext | null = null;
  private ambientSourceNode: AudioNode | null = null;
  private ambientGainNode: GainNode | null = null;
  private isAmbientPlaying = false;
  private currentAmbientType: string = 'none';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play crisp completion chime (TickTick style)
  playTaskComplete() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      // 2-tone melodic chime: C6 (1046Hz) -> E6 (1318Hz) -> G6 (1568Hz)
      osc1.frequency.setValueAtTime(1046.5, now);
      osc1.frequency.exponentialRampToValueAtTime(1318.51, now + 0.08);
      osc1.frequency.exponentialRampToValueAtTime(1567.98, now + 0.16);

      osc2.frequency.setValueAtTime(523.25, now);
      osc2.frequency.exponentialRampToValueAtTime(783.99, now + 0.12);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Play Pomodoro finished alert
  playPomodoroAlert() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [0, 0.25, 0.5].forEach((offset) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now + offset); // A5

        gain.gain.setValueAtTime(0, now + offset);
        gain.gain.linearRampToValueAtTime(0.25, now + offset + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.2);
      });
    } catch {
      // ignore
    }
  }

  // Start Ambient Background Sound for Focus
  startAmbient(type: 'none' | 'rain' | 'whitenoise' | 'cafe' | 'waves', volume: number = 0.5) {
    this.stopAmbient();
    if (type === 'none') return;

    try {
      this.initContext();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Noise generation
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'whitenoise') {
          data[i] = white * 0.1;
        } else if (type === 'rain') {
          // Pink/Brown noise simulation for rain
          data[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        } else if (type === 'waves' || type === 'cafe') {
          data[i] = (lastOut + (0.015 * white)) / 1.015;
          lastOut = data[i];
          data[i] *= 3.0;
        }
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      // Filter for ambient realism
      const filter = this.ctx.createBiquadFilter();
      if (type === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.value = 1200;
      } else if (type === 'whitenoise') {
        filter.type = 'lowpass';
        filter.frequency.value = 4000;
      } else if (type === 'waves') {
        filter.type = 'bandpass';
        filter.frequency.value = 600;
        filter.Q.value = 0.8;
      } else {
        // cafe
        filter.type = 'lowpass';
        filter.frequency.value = 800;
      }

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(Math.max(0.01, Math.min(1, volume * 0.4)), this.ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noiseSource.start();

      this.ambientSourceNode = noiseSource;
      this.ambientGainNode = gain;
      this.isAmbientPlaying = true;
      this.currentAmbientType = type;
    } catch {
      // Audio issue
    }
  }

  setAmbientVolume(volume: number) {
    if (this.ambientGainNode && this.ctx) {
      this.ambientGainNode.gain.setTargetAtTime(
        Math.max(0.01, Math.min(1, volume * 0.4)),
        this.ctx.currentTime,
        0.05
      );
    }
  }

  stopAmbient() {
    if (this.ambientSourceNode) {
      try {
        (this.ambientSourceNode as AudioBufferSourceNode).stop();
        this.ambientSourceNode.disconnect();
      } catch {
        // ignore
      }
      this.ambientSourceNode = null;
    }
    this.isAmbientPlaying = false;
    this.currentAmbientType = 'none';
  }

  isPlayingAmbient(): boolean {
    return this.isAmbientPlaying;
  }

  getCurrentAmbientType(): string {
    return this.currentAmbientType;
  }
}

export const soundManager = new SoundManager();
