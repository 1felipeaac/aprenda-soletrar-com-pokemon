export interface PokemonStage {
  id: number;              // PokeAPI ID
  name: string;            // Official name
  displayName: string;     // Display in UI (e.g. "PICHU")
  syllables: string[];     // Correct syllable sequence e.g. ["PI", "CHU"]
  distractors: string[];   // Intruder syllables e.g. ["LA", "TO"]
  worldId: number;         // 1, 2, 3, 4
  phoneticDescription: string; // Ex: "Duas sílabas simples"
  color: string;           // Theme color for the card background
  hint: string;            // Audio hint, ex: "Começa com PI!"
  isBonus?: boolean;       // Foreign / post-game special rules
  bonusExplanation?: string; // Ex: "Atenção: E-E tem som de I!"
}

export interface World {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  themeColor: string;
  badge: string;
  pokemon: PokemonStage[];
}

export interface CapturedPokemon {
  pokemonId: number;
  capturedAt: string;
  stars: number;
}

export interface PlayerProgress {
  captured: Record<number, CapturedPokemon>;
  unlockedWorlds: number[];
  currentWorldId: number;
  soundEnabled: boolean;
}
