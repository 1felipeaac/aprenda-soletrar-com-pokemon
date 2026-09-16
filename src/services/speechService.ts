// Serviço de áudio que prioriza os arquivos neurais pré-gravados (Microsoft Francisca Neural)
// e mantém fallback para a Web Speech API caso algum arquivo dinâmico não exista.

class SpeechService {
  private ptVoice: SpeechSynthesisVoice | null = null;
  private currentAudio: HTMLAudioElement | null = null;

  constructor() {
    this.initVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoices();
      };
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    const ptBrVoices = voices.filter(
      (v) => v.lang === 'pt-BR' || v.lang === 'pt_BR' || v.lang.startsWith('pt')
    );

    this.ptVoice =
      ptBrVoices.find((v) =>
        v.name.toLowerCase().includes('google') ||
        v.name.toLowerCase().includes('luciana') ||
        v.name.toLowerCase().includes('maria')
      ) ||
      ptBrVoices[0] ||
      null;
  }

  public cancel() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  private playAudioClip(src: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.cancel();
      const audio = new Audio(src);
      this.currentAudio = audio;
      audio.volume = 1.0;

      audio.onended = () => {
        if (this.currentAudio === audio) this.currentAudio = null;
        resolve(true);
      };

      audio.onerror = () => {
        if (this.currentAudio === audio) this.currentAudio = null;
        resolve(false);
      };

      audio.play().catch(() => {
        resolve(false);
      });
    });
  }

  /**
   * Toca o áudio de estúdio da sílaba com voz humana carinhosa
   */
  public async speakSyllable(syllable: string) {
    const cleanSyllable = syllable.trim().toUpperCase();
    const clipUrl = `/audio/syllables/${cleanSyllable}.mp3`;

    const success = await this.playAudioClip(clipUrl);
    if (!success) {
      // Fallback para fala do navegador se o arquivo local não for encontrado
      this.speakSyllableFallback(syllable);
    }
  }

  /**
   * Toca o áudio de estúdio com o nome do Pokémon compassado
   */
  public async speakPokemonName(pokemonName: string, syllables: string[]) {
    const cleanName = pokemonName.trim().toLowerCase();
    const clipUrl = `/audio/pokemon/${cleanName}.mp3`;

    const success = await this.playAudioClip(clipUrl);
    if (!success) {
      // Tenta encadear os áudios neurais das sílabas em sequência com cadência doce
      let allSyllablesPlayed = true;
      for (const syl of syllables) {
        const ok = await this.playAudioClip(`/audio/syllables/${syl.toUpperCase()}.mp3`);
        if (!ok) {
          allSyllablesPlayed = false;
          break;
        }
        await new Promise((r) => setTimeout(r, 220));
      }

      if (!allSyllablesPlayed) {
        this.speakPokemonNameFallback(pokemonName, syllables);
      }
    }
  }

  /**
   * Toca o áudio de reação para sílabas invertidas
   */
  public async speakInvertedFunny(formedWord: string, correctName: string) {
    const success = await this.playAudioClip('/audio/feedback/inverted.mp3');
    if (!success) {
      this.speakInvertedFallback(formedWord, correctName);
    }
  }

  /**
   * Toca o áudio de boas-vindas / início de captura
   */
  public async speakWelcome() {
    await this.playAudioClip('/audio/feedback/welcome.mp3');
  }

  /**
   * Toca o áudio de parabéns na captura
   */
  public async speakGotcha() {
    await this.playAudioClip('/audio/feedback/gotcha.mp3');
  }

  /**
   * Fala a dica fonética do Pokémon (com áudios dedicados para regras especiais como o R brando)
   */
  public async speakHint(phrase: string, pokemonName?: string) {
    const clean = (pokemonName || '').toLowerCase().trim();
    if (clean === 'aron' || phrase.includes('céu da boca')) {
      const ok = await this.playAudioClip('/audio/feedback/dica-r-brando.mp3');
      if (ok) return;
    }
    if (clean === 'rotom' || phrase.includes('fundo da garganta')) {
      const ok = await this.playAudioClip('/audio/feedback/dica-r-forte.mp3');
      if (ok) return;
    }
    this.speakFallbackUtterance(phrase);
  }

  /**
   * Fala frases de incentivo após tentativa
   */
  public async speakEncouragement(phrase: string) {
    const success = await this.playAudioClip('/audio/feedback/almost.mp3');
    if (!success) {
      this.speakFallbackUtterance(phrase);
    }
  }

  // --- Fallbacks caso o navegador bloqueie ou o arquivo não exista ---

  private speakSyllableFallback(syllable: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    let textToSpeak = syllable;
    if (syllable === 'PI') textToSpeak = 'Pí';
    if (syllable === 'CHU') textToSpeak = 'Chú';
    if (syllable === 'DI') textToSpeak = 'Dí';
    if (syllable === 'TO') textToSpeak = 'Tó';

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.85;
    utterance.pitch = 1.15;
    if (this.ptVoice) utterance.voice = this.ptVoice;
    window.speechSynthesis.speak(utterance);
  }

  private speakPokemonNameFallback(displayName: string, syllables: string[]) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const syllabicCadence = syllables.join('... ') + '! ' + displayName + '!';
    const utterance = new SpeechSynthesisUtterance(syllabicCadence);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.8;
    utterance.pitch = 1.15;
    if (this.ptVoice) utterance.voice = this.ptVoice;
    window.speechSynthesis.speak(utterance);
  }

  private speakInvertedFallback(formedWord: string, correctName: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const funnyPhrase = `${formedWord}! Ih, virou ${formedWord}! Quem é esse Pokémon? Vamos trocar para formar ${correctName}!`;
    const utterance = new SpeechSynthesisUtterance(funnyPhrase);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    if (this.ptVoice) utterance.voice = this.ptVoice;
    window.speechSynthesis.speak(utterance);
  }

  private speakFallbackUtterance(phrase: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1.15;
    if (this.ptVoice) utterance.voice = this.ptVoice;
    window.speechSynthesis.speak(utterance);
  }
}

export const speechService = new SpeechService();
