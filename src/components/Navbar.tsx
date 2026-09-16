import { ArrowLeft, BookOpen, RotateCcw } from 'lucide-react';

interface NavbarProps {
  currentView: 'worlds' | 'arena' | 'pokedex';
  onNavigate: (view: 'worlds' | 'arena' | 'pokedex') => void;
  capturedCount: number;
  totalCount: number;
  currentWorldTitle?: string;
  onOpenReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  capturedCount,
  totalCount,
  currentWorldTitle,
  onOpenReset,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-4 border-amber-200 px-3 sm:px-4 py-2.5 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Lado Esquerdo: Voltar ao Mapa ou Logo */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink min-w-0">
          {currentView !== 'worlds' ? (
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <button
                onClick={() => onNavigate('worlds')}
                className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-sm border-2 border-amber-300 transition-transform active:scale-95 text-xs sm:text-sm cursor-pointer shrink-0"
                title="Voltar ao mapa"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Mapa</span>
              </button>

              {currentWorldTitle && currentView === 'arena' && (
                <span className="bg-amber-100 text-amber-900 font-black px-2 sm:px-3 py-1 rounded-xl text-[10px] sm:text-xs border border-amber-300 truncate max-w-[120px] sm:max-w-[220px]">
                  {currentWorldTitle}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 shrink min-w-0">
              <span className="text-xl sm:text-2xl md:text-3xl animate-bounce shrink-0">⚡</span>
              <div className="text-left min-w-0">
                <h1 className="text-xs sm:text-base md:text-xl font-black text-amber-950 tracking-tight sm:tracking-wide uppercase leading-none sm:leading-tight truncate">
                  Soletrando
                </h1>
                <span className="text-[9px] sm:text-[11px] md:text-xs font-black text-amber-700 uppercase tracking-wider block">
                  com Pokémon
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Lado Direito: Trava Parental (Zerar) + Pokédex */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Botão de Zerar Jogo (Trava Parental para Adultos) */}
          <button
            onClick={onOpenReset}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl sm:rounded-2xl bg-amber-100 hover:bg-rose-100 text-amber-900 hover:text-rose-700 border-2 border-amber-300 hover:border-rose-300 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1 shrink-0"
            title="Área dos Pais: Zerar Jogo"
            aria-label="Área dos Pais: Zerar Jogo"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-800 hover:text-rose-600 shrink-0" />
            <span className="text-xs font-black hidden sm:inline">Zerar</span>
          </button>

          {/* Botão da Pokédex */}
          <button
            onClick={() => onNavigate(currentView === 'pokedex' ? 'worlds' : 'pokedex')}
            className={`flex items-center gap-1.5 sm:gap-2 font-black px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-md border-2 transition-all active:scale-95 cursor-pointer shrink-0 ${
              currentView === 'pokedex'
                ? 'bg-rose-500 text-white border-rose-600 shadow-rose-200'
                : 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-600 shadow-red-200 hover:brightness-105'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
            <span className="tracking-wide text-xs sm:text-sm">POKÉDEX</span>
            <span className="bg-white/30 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-extrabold shrink-0">
              {capturedCount}/{totalCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
