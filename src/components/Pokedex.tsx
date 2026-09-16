import { useState } from 'react';
import type { PlayerProgress } from '../types/pokemon';
import { ALL_POKEMON, WORLDS_DATA, getPokemonArtworkUrl } from '../data/pokemonData';
import { soundService } from '../services/soundEffects';
import { speechService } from '../services/speechService';
import { Volume2, Sparkles, RotateCcw } from 'lucide-react';

interface PokedexProps {
  progress: PlayerProgress;
  onResetProgress: () => void;
  onSelectPokemonToPlay: (worldId: number, pokemonIndex: number) => void;
}

export const Pokedex: React.FC<PokedexProps> = ({
  progress,
  onResetProgress,
  onSelectPokemonToPlay,
}) => {
  const [selectedWorldFilter, setSelectedWorldFilter] = useState<number | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const capturedCount = Object.keys(progress.captured).length;
  const totalCount = ALL_POKEMON.length;
  const percent = Math.round((capturedCount / totalCount) * 100);

  const filteredPokemon = selectedWorldFilter
    ? ALL_POKEMON.filter((p) => p.worldId === selectedWorldFilter)
    : ALL_POKEMON;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 select-none">
      {/* Cabeçalho da Pokédex */}
      <div className="bg-gradient-to-r from-red-500 via-rose-500 to-red-600 rounded-3xl p-5 sm:p-6 text-white shadow-xl border-4 border-red-600 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center p-2 shadow-inner border border-white/30">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
              alt="Pokébola"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wide">
              Minha Pokédex
            </h2>
            <p className="text-rose-100 font-bold text-xs sm:text-sm">
              Seu álbum de palavras e Pokémon capturados!
            </p>
          </div>
        </div>

        {/* Contador de Progresso */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-3 border border-white/20 min-w-[140px] text-center">
          <span className="text-xs font-black uppercase tracking-wider text-rose-200 block">
            Capturados
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-300">
            {capturedCount} / {totalCount}
          </span>
          <div className="w-full bg-white/20 rounded-full h-2.5 mt-1 overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Filtros por Mundo */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => {
            soundService.playPop();
            setSelectedWorldFilter(null);
          }}
          className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all border-2 cursor-pointer ${
            selectedWorldFilter === null
              ? 'bg-amber-500 text-white border-amber-600 shadow-md'
              : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100'
          }`}
        >
          🌟 Todos ({totalCount})
        </button>

        {WORLDS_DATA.map((w) => (
          <button
            key={w.id}
            onClick={() => {
              soundService.playPop();
              setSelectedWorldFilter(w.id);
            }}
            className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all border-2 cursor-pointer ${
              selectedWorldFilter === w.id
                ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            {w.icon} {w.title.split(':')[0]}
          </button>
        ))}
      </div>

      {/* Grade de Cards da Pokédex */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredPokemon.map((pokemon) => {
          const isCaptured = !!progress.captured[pokemon.id];
          const world = WORLDS_DATA.find((w) => w.id === pokemon.worldId);
          const pokemonIndexInWorld = world?.pokemon.findIndex((p) => p.id === pokemon.id) ?? 0;

          return (
            <div
              key={pokemon.id}
              className={`rounded-3xl border-4 p-4 flex flex-col items-center justify-between text-center transition-all shadow-md relative overflow-hidden ${
                isCaptured
                  ? 'bg-white border-amber-300 hover:shadow-xl hover:-translate-y-1'
                  : 'bg-slate-100 border-slate-300 opacity-60'
              }`}
            >
              {/* Selo de Estrelas */}
              {isCaptured && (
                <div className="absolute top-2 right-2 flex items-center gap-0.5 text-amber-400">
                  <Sparkles className="w-4 h-4 fill-amber-400" />
                </div>
              )}

              {/* Imagem do Pokémon */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center my-1 relative">
                <img
                  src={getPokemonArtworkUrl(pokemon.id)}
                  alt={pokemon.name}
                  className={`w-full h-full object-contain transition-transform ${
                    isCaptured ? 'hover:scale-110 drop-shadow-md' : 'brightness-0 opacity-25'
                  }`}
                />
                {!isCaptured && (
                  <span className="absolute text-4xl font-black text-slate-400">?</span>
                )}
              </div>

              {/* Nome e Sílabas */}
              <div className="w-full mt-2">
                <h4 className="font-black text-base sm:text-lg text-slate-800 tracking-wide uppercase truncate">
                  {isCaptured ? pokemon.displayName : '???'}
                </h4>

                {isCaptured ? (
                  <div className="flex items-center justify-center gap-1 mt-1 flex-wrap">
                    {pokemon.syllables.map((syl, i) => (
                      <span
                        key={i}
                        className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[11px] px-2 py-0.5 rounded-lg"
                      >
                        {syl}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] font-bold text-slate-400 block mt-1">
                    Não encontrado
                  </span>
                )}
              </div>

              {/* Ações: Ouvir som ou Jogar novamente */}
              {isCaptured ? (
                <div className="flex flex-col gap-1.5 mt-3 w-full">
                  <button
                    onClick={async () => {
                      soundService.stopCry();
                      speechService.cancel();
                      await soundService.playPokemonCry(pokemon.id);
                      await new Promise((r) => setTimeout(r, 250));
                      await speechService.speakPokemonName(pokemon.name, pokemon.syllables);
                    }}
                    className="w-full bg-amber-100 hover:bg-amber-200 text-amber-950 font-black py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-amber-300 transition-transform active:scale-95 cursor-pointer shadow-2xs"
                    title="Ouvir som e nome"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                    <span>Ouvir Nome</span>
                  </button>
                  <button
                    onClick={() => onSelectPokemonToPlay(pokemon.worldId, pokemonIndexInWorld)}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1 border border-amber-600 transition-transform active:scale-95 cursor-pointer shadow-2xs uppercase tracking-wider"
                    title="Jogar de novo"
                  >
                    <span>Jogar de Novo</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onSelectPokemonToPlay(pokemon.worldId, pokemonIndexInWorld)}
                  className="mt-3 w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-black py-2 px-2 rounded-xl text-xs transition-transform active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  Ir Capturar!
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Rodapé com Botão de Reiniciar Progresso (para os pais) */}
      <div className="pt-6 text-center border-t-2 border-amber-200">
        <button
          onClick={() => setShowResetConfirm(true)}
          className="text-xs font-bold text-slate-400 hover:text-rose-600 flex items-center gap-1 mx-auto cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reiniciar álbum da Pokédex</span>
        </button>
      </div>

      {/* Modal de Confirmação de Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-rose-400 p-6 max-w-sm w-full text-center shadow-2xl space-y-4">
            <h3 className="text-xl font-black text-rose-950">
              Reiniciar o álbum?
            </h3>
            <p className="text-xs font-bold text-slate-600">
              Isso vai zerar os Pokémon capturados para começar a brincadeira do zero.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onResetProgress();
                  setShowResetConfirm(false);
                }}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-black py-2.5 rounded-2xl cursor-pointer text-sm"
              >
                Sim, reiniciar
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black py-2.5 rounded-2xl cursor-pointer text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
