import type { PlayerProgress, CapturedPokemon } from '../types/pokemon';

const STORAGE_KEY = 'pokemon_spelling_progress_v1';

const DEFAULT_PROGRESS: PlayerProgress = {
  captured: {},
  unlockedWorlds: [1],
  currentWorldId: 1,
  soundEnabled: true,
};

export const storageService = {
  getProgress(): PlayerProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return DEFAULT_PROGRESS;
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_PROGRESS,
        ...parsed,
      };
    } catch {
      return DEFAULT_PROGRESS;
    }
  },

  saveProgress(progress: PlayerProgress): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignora erro se storage estiver desabilitado
    }
  },

  registerCapture(pokemonId: number, _worldId?: number): PlayerProgress {
    const current = this.getProgress();
    const newCaptured: Record<number, CapturedPokemon> = {
      ...current.captured,
      [pokemonId]: {
        pokemonId,
        capturedAt: new Date().toISOString(),
        stars: 3,
      },
    };

    // Desbloqueio progressivo dos mundos
    const unlocked = [...current.unlockedWorlds];
    const totalCaptured = Object.keys(newCaptured).length;

    // Se completou pelo menos 4 no mundo 1, libera o mundo 2
    if (!unlocked.includes(2) && totalCaptured >= 4) {
      unlocked.push(2);
    }
    // Se completou pelo menos 10 no total, libera o mundo 3 (Ditongos)
    if (!unlocked.includes(3) && totalCaptured >= 10) {
      unlocked.push(3);
    }
    // Se completou pelo menos 18 no total, libera o mundo 4 (Encontros Consonantais)
    if (!unlocked.includes(4) && totalCaptured >= 18) {
      unlocked.push(4);
    }
    // Se completou pelo menos 26 no total, libera o mundo 5 (Bônus Campeões)
    if (!unlocked.includes(5) && totalCaptured >= 26) {
      unlocked.push(5);
    }

    const updated: PlayerProgress = {
      ...current,
      captured: newCaptured,
      unlockedWorlds: unlocked,
    };

    this.saveProgress(updated);
    return updated;
  },

  isCaptured(pokemonId: number): boolean {
    const progress = this.getProgress();
    return !!progress.captured[pokemonId];
  },

  resetProgress(): PlayerProgress {
    localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_PROGRESS;
  },
};
