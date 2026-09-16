import { Volume2, VolumeX, ArrowLeft, BookOpen } from 'lucide-react';

interface NavbarProps {
  currentView: 'worlds' | 'arena' | 'pokedex';
  onNavigate: (view: 'worlds' | 'arena' | 'pokedex') => void;
  capturedCount: number;
  totalCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentWorldTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  capturedCount,
  totalCount,
  soundEnabled,
  onToggleSound,
  currentWorldTitle,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b-4 border-amber-200 px-4 py-3 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Lado Esquerdo: Voltar ou Logo */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink min-w-0">
          {currentView !== 'worlds' ? (
            <button
              onClick={() => onNavigate('worlds')}
              className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-sm border-2 border-amber-300 transition-transform active:scale-95 text-xs sm:text-base cursor-pointer shrink-0"
              title="Voltar ao mapa"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Mapa</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 shrink min-w-0">
              <span className="text-2xl sm:text-3xl animate-bounce shrink-0">⚡</span>
              <div className="text-left min-w-0">
                <h1 className="text-sm sm:text-lg md:text-xl font-black text-amber-950 tracking-wide uppercase leading-tight truncate">
                  Soletrando
                </h1>
                <span className="text-[10px] sm:text-xs font-bold text-amber-700 uppercase tracking-wider block -mt-0.5">
                  com Pokémon
                </span>
              </div>
            </div>
          )}

          {currentWorldTitle && currentView === 'arena' && (
            <span className="hidden sm:inline-block bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-xl text-xs border border-amber-300 truncate max-w-[200px]">
              {currentWorldTitle}
            </span>
          )}
        </div>

        {/* Lado Direito: Pokédex + Som */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Botão da Pokédex */}
          <button
            onClick={() => onNavigate(currentView === 'pokedex' ? 'worlds' : 'pokedex')}
            className={`flex items-center gap-1.5 sm:gap-2 font-black px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-md border-2 transition-all active:scale-95 text-xs sm:text-base cursor-pointer shrink-0 ${
              currentView === 'pokedex'
                ? 'bg-rose-500 text-white border-rose-600 shadow-rose-200'
                : 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-600 shadow-red-200 hover:brightness-105'
            }`}
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
            <span className="tracking-wide text-xs sm:text-sm md:text-base">POKÉDEX</span>
            <span className="bg-white/30 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-extrabold shrink-0">
              {capturedCount}/{totalCount}
            </span>
          </button>

          {/* Botão de Som */}
          <button
            onClick={onToggleSound}
            className="bg-amber-100 hover:bg-amber-200 text-amber-900 p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl border-2 border-amber-300 shadow-sm transition-transform active:scale-95 cursor-pointer shrink-0"
            title={soundEnabled ? 'Desativar som' : 'Ativar som'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
