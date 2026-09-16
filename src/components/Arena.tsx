import { useState, useEffect, useRef } from 'react';
import type { PokemonStage } from '../types/pokemon';
import { getPokemonArtworkUrl } from '../data/pokemonData';
import { speechService } from '../services/speechService';
import { soundService } from '../services/soundEffects';
import confetti from 'canvas-confetti';
import { Volume2, Lightbulb, RotateCcw, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

interface ArenaProps {
  pokemonList: PokemonStage[];
  initialPokemonIndex: number;
  onCapture: (pokemonId: number) => void;
  isCaptured: (pokemonId: number) => boolean;
  onBackToWorlds: () => void;
}

interface TrayTile {
  id: string;
  syllable: string;
  color: string;
  isUsed: boolean;
}

const TILE_COLORS = [
  'bg-amber-300 text-amber-950 border-amber-400',
  'bg-sky-300 text-sky-950 border-sky-400',
  'bg-rose-300 text-rose-950 border-rose-400',
  'bg-emerald-300 text-emerald-950 border-emerald-400',
  'bg-purple-300 text-purple-950 border-purple-400',
  'bg-orange-300 text-orange-950 border-orange-400',
];

export const Arena: React.FC<ArenaProps> = ({
  pokemonList,
  initialPokemonIndex,
  onCapture,
  isCaptured,
  onBackToWorlds,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialPokemonIndex);
  const currentPokemon = pokemonList[currentIndex];

  // Estado dos slots: array do tamanho das sílabas do Pokémon
  const [slots, setSlots] = useState<(TrayTile | null)[]>([]);
  const [trayTiles, setTrayTiles] = useState<TrayTile[]>([]);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [funnyFeedback, setFunnyFeedback] = useState<string | null>(null);
  const [isWiggling, setIsWiggling] = useState(false);

  // Referência para os elementos dos slots para snap magnético
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  const hasHandledSuccessRef = useRef(false);
  const onCaptureRef = useRef(onCapture);

  useEffect(() => {
    onCaptureRef.current = onCapture;
  }, [onCapture]);

  // Inicializa o estágio do Pokémon atual
  useEffect(() => {
    if (!currentPokemon) return;

    hasHandledSuccessRef.current = false;
    // Cria os slots vazios
    setSlots(new Array(currentPokemon.syllables.length).fill(null));
    setSelectedSlotIndex(null);
    setIsSuccess(false);
    setFunnyFeedback(null);
    setIsWiggling(false);

    // Mistura as sílabas corretas com os distratores
    const combined = [...currentPokemon.syllables, ...currentPokemon.distractors];
    // Shuffle aleatório estável
    const shuffled = [...combined].sort(() => Math.random() - 0.5);

    const tiles: TrayTile[] = shuffled.map((syl, i) => ({
      id: `tile-${currentPokemon.id}-${i}-${syl}`,
      syllable: syl,
      color: TILE_COLORS[i % TILE_COLORS.length],
      isUsed: false,
    }));

    setTrayTiles(tiles);

    // Toca o grito oficial do Pokémon e, somente após terminar, fala a frase acolhedora
    let isCancelled = false;
    soundService.playPokemonCry(currentPokemon.id).then(() => {
      if (isCancelled) return;
      setTimeout(() => {
        if (!isCancelled) {
          speechService.speakWelcome();
        }
      }, 250);
    });

    return () => {
      isCancelled = true;
      soundService.stopCry();
      speechService.cancel();
    };
  }, [currentIndex, currentPokemon]);

  // Executa validação sempre que os slots mudam
  useEffect(() => {
    if (hasHandledSuccessRef.current || isSuccess || slots.length === 0 || !currentPokemon) return;

    const allFilled = slots.every((s) => s !== null);
    if (!allFilled) {
      setFunnyFeedback(null);
      return;
    }

    const filledSyllables = slots.map((s) => s!.syllable);
    const targetSyllables = currentPokemon.syllables;

    const isMatch = filledSyllables.every((s, i) => s === targetSyllables[i]);

    if (isMatch) {
      // ACERTOU UMA ÚNICA VEZ
      hasHandledSuccessRef.current = true;
      setIsSuccess(true);

      // Cancela qualquer som ou locução prévia (ex: clique na última sílaba)
      soundService.stopCry();
      speechService.cancel();

      // Toca apenas a fanfarra comemorativa de vitória
      soundService.playFanfare();

      // Chuva de confetes
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6'],
        });
      } catch {}

      onCaptureRef.current(currentPokemon.id);
    } else {
      // ERRO PEDAGÓGICO / ORDEM INVERTIDA
      const formedWord = filledSyllables.join('');
      const invertedTarget = [...targetSyllables].reverse().join('');

      if (formedWord === invertedTarget) {
        // Inverteu as sílabas!
        setFunnyFeedback(`Ih, virou ${filledSyllables.join('-')}! 😂 Vamos trocar de lugar?`);
        speechService.speakInvertedFunny(filledSyllables.join('-'), currentPokemon.displayName);
      } else {
        // Usou sílaba errada
        setIsWiggling(true);
        soundService.playBoing();
        setFunnyFeedback(`Quase lá! Ouça o sonzinho: ${currentPokemon.hint}`);
        speechService.speakEncouragement(`Quase lá! ${currentPokemon.hint}`);
        setTimeout(() => setIsWiggling(false), 600);
      }
    }
  }, [slots, currentPokemon, isSuccess]);

  // Coloca uma sílaba em um slot (seja por clique ou soltura)
  const placeTileInSlot = (tile: TrayTile, targetIndex?: number) => {
    if (tile.isUsed || isSuccess) return;

    soundService.stopCry();
    speechService.cancel();
    soundService.playPop();
    speechService.speakSyllable(tile.syllable);

    setSlots((prev) => {
      const next = [...prev];
      let destIndex = targetIndex ?? selectedSlotIndex;

      // Se não especificou e não tem slot selecionado, procura o primeiro vazio
      if (destIndex === null || destIndex === undefined || destIndex < 0 || destIndex >= next.length || next[destIndex] !== null) {
        destIndex = next.findIndex((s) => s === null);
      }

      if (destIndex === -1) return prev; // Nenhum slot livre

      // Se já havia uma peça no slot destino, devolve ela para a bandeja
      const existing = next[destIndex];
      if (existing) {
        setTrayTiles((tiles) =>
          tiles.map((t) => (t.id === existing.id ? { ...t, isUsed: false } : t))
        );
      }

      next[destIndex] = tile;
      return next;
    });

    // Marca o tile como usado
    setTrayTiles((tiles) =>
      tiles.map((t) => (t.id === tile.id ? { ...t, isUsed: true } : t))
    );

    // Reseta o slot selecionado
    setSelectedSlotIndex(null);
  };

  // Remove uma sílaba do slot e devolve para a bandeja
  const removeTileFromSlot = (index: number) => {
    if (isSuccess) return;
    const tile = slots[index];
    if (!tile) return;

    soundService.playBoing();

    setSlots((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });

    setTrayTiles((tiles) =>
      tiles.map((t) => (t.id === tile.id ? { ...t, isUsed: false } : t))
    );

    setSelectedSlotIndex(index);
    setFunnyFeedback(null);
  };

  // Limpa todos os slots
  const handleResetSlots = () => {
    soundService.playBoing();
    setSlots(new Array(currentPokemon.syllables.length).fill(null));
    setTrayTiles((tiles) => tiles.map((t) => ({ ...t, isUsed: false })));
    setSelectedSlotIndex(null);
    setFunnyFeedback(null);
  };

  // Navegar entre Pokémon do mesmo mundo
  const handleNextPokemon = () => {
    soundService.stopCry();
    speechService.cancel();
    if (currentIndex < pokemonList.length - 1) {
      soundService.playPop();
      setCurrentIndex(currentIndex + 1);
    } else {
      // Chegou ao fim do mundo!
      onBackToWorlds();
    }
  };

  const handlePrevPokemon = () => {
    soundService.stopCry();
    speechService.cancel();
    if (currentIndex > 0) {
      soundService.playPop();
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!currentPokemon) return null;

  const captured = isCaptured(currentPokemon.id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center select-none">
      {/* Barra de Progresso do Pokémon no Mundo */}
      <div className="w-full flex items-center justify-between gap-3 mb-4">
        <button
          onClick={handlePrevPokemon}
          disabled={currentIndex === 0}
          className="flex items-center gap-1 bg-white hover:bg-amber-100 disabled:opacity-30 disabled:hover:bg-white text-amber-950 font-black px-3 py-1.5 rounded-xl border-2 border-amber-300 shadow-sm text-xs cursor-pointer transition-transform active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <span className="font-extrabold text-amber-900 bg-amber-200/80 px-4 py-1 rounded-full text-xs sm:text-sm tracking-wide">
          Pokémon {currentIndex + 1} de {pokemonList.length}
        </span>

        <button
          onClick={handleNextPokemon}
          className="flex items-center gap-1 bg-white hover:bg-amber-100 text-amber-950 font-black px-3 py-1.5 rounded-xl border-2 border-amber-300 shadow-sm text-xs cursor-pointer transition-transform active:scale-95"
        >
          <span>Próximo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Card do Pokémon */}
      <div className={`w-full max-w-lg bg-white rounded-3xl border-4 p-5 shadow-xl relative overflow-hidden transition-all ${currentPokemon.color}`}>
        {/* Selo de Capturado se já estiver na Pokédex */}
        {captured && (
          <div className="absolute top-3 right-3 bg-emerald-500 text-white font-black text-xs px-3 py-1 rounded-full shadow flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Capturado!</span>
          </div>
        )}

        {/* Imagem do Pokémon */}
        <div className="relative flex justify-center items-center py-2 min-h-[190px]">
          <div className="absolute w-44 h-44 rounded-full bg-white/70 blur-md -z-0"></div>
          <img
            src={getPokemonArtworkUrl(currentPokemon.id)}
            alt={currentPokemon.name}
            className={`w-48 h-48 sm:w-56 sm:h-56 object-contain z-10 drop-shadow-xl transition-transform duration-300 ${
              isSuccess ? 'scale-110 animate-bounce' : 'animate-gentle-bounce'
            }`}
          />
        </div>

        {/* Pílula Pedagógica com a Regra Fonética do Pokémon */}
        {currentPokemon.phoneticDescription && (
          <div className="flex items-center justify-center my-2">
            <span className="inline-flex items-center gap-1.5 bg-amber-50/90 text-amber-950 text-xs font-black px-3.5 py-1.5 rounded-full border border-amber-300 shadow-xs">
              <span>💡</span>
              <span>{currentPokemon.phoneticDescription}</span>
            </span>
          </div>
        )}

        {/* Botão de Ouvir Nome e Botão de Dica com Altura e Alinhamento Perfeitos */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-2 w-full max-w-sm mx-auto">
          <button
            onClick={async () => {
              soundService.stopCry();
              speechService.cancel();
              await soundService.playPokemonCry(currentPokemon.id);
              await new Promise((r) => setTimeout(r, 250));
              await speechService.speakPokemonName(currentPokemon.name, currentPokemon.syllables);
            }}
            className="flex-1 h-11 sm:h-12 flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-950 font-black px-3 sm:px-4 rounded-2xl shadow-md border-2 border-amber-500 transition-transform active:scale-95 cursor-pointer text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-950 fill-amber-950 shrink-0" />
            <span>Ouvir Nome</span>
          </button>

          <button
            onClick={() => {
              soundService.stopCry();
              speechService.cancel();
              soundService.playPop();
              speechService.speakHint(currentPokemon.hint, currentPokemon.name);
              setFunnyFeedback(currentPokemon.hint);
            }}
            className="h-11 sm:h-12 flex items-center justify-center gap-1.5 bg-sky-100 hover:bg-sky-200 text-sky-900 font-extrabold px-3.5 sm:px-4 rounded-2xl shadow-sm border-2 border-sky-300 transition-transform active:scale-95 cursor-pointer text-xs sm:text-sm whitespace-nowrap shrink-0"
            title="Dica de som"
          >
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-400 shrink-0" />
            <span>Dica</span>
          </button>
        </div>

        {/* Mensagem de Feedback Pedagógico Divertido */}
        {funnyFeedback && (
          <div className="mt-3 bg-amber-200/90 text-amber-950 font-black text-xs sm:text-sm px-4 py-2 rounded-2xl border-2 border-amber-400 text-center animate-bounce shadow-sm">
            {funnyFeedback}
          </div>
        )}
      </div>

      {/* SLOTS DE MONTAGEM (AS CASINHAS DAS SÍLABAS) */}
      <div className="w-full max-w-lg my-6">
        <p className="text-center text-xs sm:text-sm font-black text-amber-900 uppercase tracking-widest mb-2">
          Encaixe as sílabas no lugar certo:
        </p>

        <div className="flex items-center justify-center gap-3 sm:gap-4">
          {slots.map((slotTile, idx) => {
            const isSelected = selectedSlotIndex === idx;

            return (
              <div
                key={idx}
                ref={(el) => {
                  slotRefs.current[idx] = el;
                }}
                onClick={() => {
                  if (slotTile) {
                    removeTileFromSlot(idx);
                  } else {
                    soundService.playPop();
                    setSelectedSlotIndex(isSelected ? null : idx);
                  }
                }}
                className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer shadow-md ${
                  slotTile
                    ? `${slotTile.color} border-4 scale-105 active:scale-95 ${
                        isWiggling ? 'animate-wiggle' : ''
                      }`
                    : isSelected
                    ? 'bg-yellow-100 border-4 border-dashed border-amber-500 scale-105 ring-4 ring-amber-300'
                    : 'bg-white/80 border-4 border-dashed border-amber-300 hover:border-amber-400 hover:bg-white'
                }`}
              >
                {slotTile ? (
                  <>
                    <span className="text-2xl sm:text-3xl font-black tracking-wider uppercase">
                      {slotTile.syllable}
                    </span>
                    <span className="text-[10px] font-bold opacity-60 uppercase mt-0.5">
                      Toque p/ tirar
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-slate-400 text-xl sm:text-2xl font-black">
                      {idx + 1}º
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                      {isSelected ? 'Escolhido!' : 'Vazio'}
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* BANDEJA DE SÍLABAS (OS BOTÕES GRANDES PARA ELA TOCAR OU ARRASTAR) */}
      <div className="w-full max-w-lg bg-white/90 rounded-3xl border-4 border-amber-300 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-black text-amber-950 uppercase tracking-wider">
            Toque na sílaba para ouvir e colocar:
          </span>
          <button
            onClick={handleResetSlots}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            title="Limpar casinhas"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Recomeçar</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {trayTiles.map((tile) => (
            <button
              key={tile.id}
              disabled={tile.isUsed || isSuccess}
              onClick={() => placeTileInSlot(tile)}
              className={`min-w-[76px] sm:min-w-[88px] h-18 sm:h-20 px-4 rounded-2xl border-4 font-black text-2xl sm:text-3xl shadow-md transition-all active:scale-95 cursor-pointer uppercase tracking-wider flex items-center justify-center ${
                tile.color
              } ${
                tile.isUsed
                  ? 'opacity-20 scale-95 cursor-not-allowed border-slate-300 bg-slate-200'
                  : 'hover:-translate-y-1 hover:shadow-lg'
              }`}
            >
              {tile.syllable}
            </button>
          ))}
        </div>
      </div>

      {/* TELA DE SUCESSO / CAPTURA CONCLUÍDA */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-8 border-amber-400 p-6 sm:p-8 max-w-md w-full text-center shadow-2xl animate-gentle-bounce">
            <div className="relative inline-block mb-3">
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                alt="Pokébola"
                className="w-20 h-20 mx-auto animate-spin"
                style={{ animationDuration: '3s' }}
              />
              <Sparkles className="w-8 h-8 text-amber-400 absolute -top-2 -right-2 animate-pulse" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-amber-950 uppercase tracking-wide">
              GOTCHA! CAPTURADO!
            </h3>
            <p className="text-amber-900 font-extrabold text-base sm:text-lg mt-1">
              Você soletrou <span className="text-rose-600 underline">{currentPokemon.displayName}</span> com perfeição!
            </p>

            <div className="flex items-center justify-center gap-2 my-4">
              {currentPokemon.syllables.map((s, i) => (
                <span
                  key={i}
                  className="bg-amber-100 text-amber-950 border-2 border-amber-400 font-black text-xl px-3.5 py-1.5 rounded-xl"
                >
                  {s}
                </span>
              ))}
            </div>

            <p className="text-xs font-bold text-slate-500 mb-5">
              Registrado com estrelas de ouro na sua Pokédex!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleNextPokemon}
                className="w-full sm:w-auto flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black py-3.5 px-6 rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer uppercase tracking-wider text-base"
              >
                {currentIndex < pokemonList.length - 1 ? 'Próximo Pokémon! ⚡' : 'Concluir Mundo! 🏆'}
              </button>
              <button
                onClick={() => {
                  soundService.stopCry();
                  speechService.cancel();
                  onBackToWorlds();
                }}
                className="w-full sm:w-auto bg-amber-100 hover:bg-amber-200 text-amber-950 font-black py-3.5 px-5 rounded-2xl border-2 border-amber-300 transition-transform active:scale-95 cursor-pointer text-sm"
              >
                Voltar ao Mapa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
