import type { PlayerProgress } from '../types/pokemon';
import { WORLDS_DATA, getPokemonArtworkUrl } from '../data/pokemonData';
import { Lock, CheckCircle2, Play } from 'lucide-react';
import { soundService } from '../services/soundEffects';

interface WorldSelectProps {
  progress: PlayerProgress;
  onSelectWorld: (worldId: number) => void;
}

export const WorldSelect: React.FC<WorldSelectProps> = ({ progress, onSelectWorld }) => {

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Banner de Boas-Vindas */}
      <div className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 border-4 border-amber-400 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="relative">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
            alt="Pikachu"
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain animate-gentle-bounce drop-shadow-md"
          />
        </div>
        <div className="flex-1">
          <span className="inline-block bg-amber-500 text-white font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-1">
            Aventura de Alfabetização
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
            Vamos caçar palavras e Pokémon?
          </h2>
          <p className="text-amber-900 font-bold text-sm sm:text-base mt-1">
            Escolha um mundo abaixo, junte os pedacinhos sonoros e capture todos para a sua Pokédex!
          </p>
        </div>
      </div>

      {/* Grade de Mundos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {WORLDS_DATA.map((world) => {
          const isUnlocked = progress.unlockedWorlds.includes(world.id);
          const worldCapturedCount = world.pokemon.filter((p) => progress.captured[p.id]).length;
          const isCompleted = worldCapturedCount === world.pokemon.length;

          return (
            <div
              key={world.id}
              onClick={() => {
                if (isUnlocked) {
                  soundService.playPop();
                  onSelectWorld(world.id);
                } else {
                  soundService.playBoing();
                }
              }}
              className={`relative rounded-3xl border-4 transition-all duration-200 overflow-hidden text-left p-5 shadow-md ${
                world.id === 5 ? 'md:col-span-2' : ''
              } ${
                isUnlocked
                  ? world.id === 5
                    ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br from-white via-fuchsia-50/40 to-amber-50/40 border-fuchsia-400 ring-4 ring-fuchsia-100 active:scale-[0.99]'
                    : 'cursor-pointer hover:-translate-y-1 hover:shadow-xl bg-white border-amber-300 active:scale-[0.99]'
                  : 'bg-slate-100 border-slate-300 opacity-80 cursor-not-allowed'
              }`}
            >
              {/* Cabeçalho do Card */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner bg-gradient-to-br ${world.themeColor}`}>
                    {world.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-800 leading-snug">
                      {world.title}
                    </h3>
                    <p className="text-xs font-bold text-slate-500">
                      {world.subtitle}
                    </p>
                  </div>
                </div>

                {isCompleted ? (
                  <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-full border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Completo
                  </span>
                ) : isUnlocked ? (
                  <span className="bg-amber-100 text-amber-900 text-xs font-black px-2.5 py-1 rounded-full border border-amber-300">
                    {worldCapturedCount}/{world.pokemon.length}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 bg-slate-200 text-slate-600 text-xs font-black px-2.5 py-1 rounded-full">
                    <Lock className="w-3.5 h-3.5" />
                    Bloqueado
                  </span>
                )}
              </div>

              {/* Miniaturas dos Pokémon do Mundo */}
              <div className="bg-amber-50/70 rounded-2xl p-3 border border-amber-100 mb-3 flex flex-col items-center">
                <div className="w-full flex items-center justify-center -space-x-1.5 sm:-space-x-2 py-1 overflow-x-auto scrollbar-none">
                  {world.pokemon.map((p) => {
                    const captured = !!progress.captured[p.id];
                    return (
                      <div
                        key={p.id}
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 p-0.5 transition-transform shrink-0 flex items-center justify-center ${
                          captured
                            ? 'bg-amber-200 border-amber-400 shadow-sm z-10 hover:scale-110'
                            : 'bg-slate-200 border-slate-300'
                        }`}
                        title={captured ? p.displayName : 'Ainda não capturado'}
                      >
                        <img
                          src={getPokemonArtworkUrl(p.id)}
                          alt={p.name}
                          className={`w-full h-full object-contain ${
                            captured ? '' : 'brightness-0 opacity-40'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Botão de Jogar abaixo da lista de Pokémon */}
                {isUnlocked && (
                  <button
                    className="w-full mt-2.5 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-sm transition-transform active:scale-95 cursor-pointer uppercase tracking-wider"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Entrar no Mundo</span>
                  </button>
                )}
              </div>

              {/* Rodapé explicativo / Requisitos */}
              {!isUnlocked && (
                <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  {world.id === 2 && 'Capture 4 Pokémon no Mundo 1 para liberar!'}
                  {world.id === 3 && 'Capture 10 Pokémon no total para liberar!'}
                  {world.id === 4 && 'Capture 18 Pokémon no total para liberar!'}
                  {world.id === 5 && 'Vença a Liga de Sílabas (26 Pokémon) para o Pós-Game!'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
