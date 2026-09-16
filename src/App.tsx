import { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { WorldSelect } from './components/WorldSelect';
import { Arena } from './components/Arena';
import { Pokedex } from './components/Pokedex';
import { Footer } from './components/Footer';
import { ResetGameModal } from './components/ResetGameModal';
import type { PlayerProgress } from './types/pokemon';
import { WORLDS_DATA, ALL_POKEMON } from './data/pokemonData';
import { storageService } from './services/storageService';

export function App() {
  const [progress, setProgress] = useState<PlayerProgress>(() => storageService.getProgress());
  const [currentView, setCurrentView] = useState<'worlds' | 'arena' | 'pokedex'>('worlds');
  const [activeWorldId, setActiveWorldId] = useState<number>(1);
  const [activePokemonIndex, setActivePokemonIndex] = useState<number>(0);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeWorld = WORLDS_DATA.find((w) => w.id === activeWorldId) || WORLDS_DATA[0];
  const capturedCount = Object.keys(progress.captured).length;
  const totalPokemonCount = ALL_POKEMON.length;

  const handleSelectWorld = (worldId: number) => {
    setActiveWorldId(worldId);
    setActivePokemonIndex(0);
    setCurrentView('arena');
  };

  const handleCapture = useCallback((pokemonId: number) => {
    const updated = storageService.registerCapture(pokemonId, activeWorldId);
    setProgress(updated);
  }, [activeWorldId]);

  const isCaptured = useCallback(
    (pokemonId: number) => {
      return !!progress.captured[pokemonId];
    },
    [progress.captured]
  );

  const handleResetComplete = () => {
    setProgress(storageService.getProgress());
    setCurrentView('worlds');
    setActiveWorldId(1);
    setActivePokemonIndex(0);
    setToastMessage('✨ Jogo zerado com sucesso! Uma nova aventura Pokémon começou.');
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleSelectPokemonToPlay = (worldId: number, pokemonIndex: number) => {
    setActiveWorldId(worldId);
    setActivePokemonIndex(pokemonIndex);
    setCurrentView('arena');
  };

  return (
    <div className="min-h-screen bg-amber-50 text-slate-800 flex flex-col font-sans selection:bg-amber-300">
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        capturedCount={capturedCount}
        totalCount={totalPokemonCount}
        currentWorldTitle={currentView === 'arena' ? activeWorld.title : undefined}
        onOpenReset={() => setIsResetModalOpen(true)}
      />

      <main className="flex-1 w-full pb-10">
        {currentView === 'worlds' && (
          <WorldSelect
            progress={progress}
            onSelectWorld={handleSelectWorld}
          />
        )}

        {currentView === 'arena' && (
          <Arena
            key={`${activeWorldId}-${activePokemonIndex}`}
            pokemonList={activeWorld.pokemon}
            initialPokemonIndex={activePokemonIndex}
            onCapture={handleCapture}
            isCaptured={isCaptured}
            onBackToWorlds={() => setCurrentView('worlds')}
          />
        )}

        {currentView === 'pokedex' && (
          <Pokedex
            progress={progress}
            onOpenReset={() => setIsResetModalOpen(true)}
            onSelectPokemonToPlay={handleSelectPokemonToPlay}
          />
        )}
      </main>

      {/* Modal de Reset com Trava Parental (Desafio Matemático) */}
      {isResetModalOpen && (
        <ResetGameModal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          onResetComplete={handleResetComplete}
        />
      )}

      {/* Toast Alert Flutuante de Confirmação */}
      {toastMessage && (
        <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-emerald-600 text-white px-4 py-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border-2 border-emerald-300 animate-bounce">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-2xl shrink-0">🎉</span>
            <span className="text-xs sm:text-sm font-black leading-snug">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white hover:text-emerald-200 font-black text-sm cursor-pointer p-1 shrink-0"
            title="Fechar aviso"
          >
            ✕
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;
