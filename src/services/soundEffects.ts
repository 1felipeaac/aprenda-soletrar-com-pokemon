// Efeitos sonoros procedurais com Web Audio API + Gritos da PokeAPI

class SoundService {
  private ctx: AudioContext | null = null;
  private currentCryAudio: HTMLAudioElement | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Toque suave na sílaba (som de bolha / clique gostoso)
  public playPop() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }

  // Encaixe magnético no slot (som de sino doce)
  public playSnap() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.15); // C6

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  // Cartão voltando para a bandeja (som de mola "boing" engraçado)
  public playBoing() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(340, ctx.currentTime + 0.2);
    osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  }

  // Comemoração triunfal de captura (arpeggio de vitória estilo Pokémon)
  public playFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const startTime = ctx.currentTime + index * 0.1;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  // Para qualquer grito que esteja tocando no momento
  public stopCry() {
    if (this.currentCryAudio) {
      this.currentCryAudio.pause();
      this.currentCryAudio.currentTime = 0;
      this.currentCryAudio = null;
    }
  }

  // Grito oficial do Pokémon da PokeAPI (retorna Promise que resolve ao terminar de tocar)
  public playPokemonCry(pokemonId: number): Promise<void> {
    return new Promise((resolve) => {
      try {
        this.stopCry();
        const audio = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`);
        this.currentCryAudio = audio;
        audio.volume = 0.45;

        let isDone = false;
        const finish = () => {
          if (!isDone) {
            isDone = true;
            if (this.currentCryAudio === audio) {
              this.currentCryAudio = null;
            }
            resolve();
          }
        };

        audio.onended = finish;
        audio.onerror = finish;

        // Limite máximo de segurança caso o evento onended não seja disparado
        const fallbackTimer = setTimeout(finish, 2200);

        audio.play().then(() => {
          // Áudio iniciou, aguarda onended
        }).catch(() => {
          clearTimeout(fallbackTimer);
          finish();
        });
      } catch {
        resolve();
      }
    });
  }
}

export const soundService = new SoundService();
