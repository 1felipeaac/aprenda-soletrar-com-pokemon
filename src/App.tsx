import { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { WorldSelect } from './components/WorldSelect';
import { Arena } from './components/Arena';
import { Pokedex } from './components/Pokedex';
import { Footer } from './components/Footer';
import type { PlayerProgress } from './types/pokemon';
import { WORLDS_DATA, ALL_POKEMON } from './data/pokemonData';
import { storageService } from './services/storageService';

export function App() {
  const [progress, setProgress] = useState<PlayerProgress>(() => storageService.getProgress());
  const [currentView, setCurrentView] = useState<'worlds' | 'arena' | 'pokedex'>('worlds');
  const [activeWorldId, setActiveWorldId] = useState<number>(1);
  const [activePokemonIndex, setActivePokemonIndex] = useState<number>(0);
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

  const handleResetProgress = () => {
    const reset = storageService.resetProgress();
    setProgress(reset);
    setCurrentView('worlds');
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
            onResetProgress={handleResetProgress}
            onSelectPokemonToPlay={handleSelectPokemonToPlay}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
