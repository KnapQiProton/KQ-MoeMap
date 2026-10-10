import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MagicPaletteSearch } from './components/MagicPaletteSearch';
import { ColorStopsEditor } from './components/ColorStopsEditor';
import { ImageUploader } from './components/ImageUploader';
import { PreviewCanvas } from './components/PreviewCanvas';
import { ExportPanel } from './components/ExportPanel';
import { AboutModal } from './components/AboutModal';
import { SvgFilterDefinition } from './components/SvgFilterDefinition';
import { CURATED_PALETTES } from './data/palettes';
import { DEFAULT_IMAGE } from './data/sampleImages';
import type { GradientStop, Palette } from './types';

// Default initial stops based on Moe Pastel
const createInitialStops = (): GradientStop[] => {
  const defaultPalette = CURATED_PALETTES[0]; // Moe Pastel
  return defaultPalette.stops.map((color, idx) => ({
    id: `stop-${idx}-${Date.now()}`,
    color,
    offset: idx / (defaultPalette.stops.length - 1),
  }));
};

export function App() {
  // Dark mode state with persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('kq-moemap-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Color stops state
  const [stops, setStops] = useState<GradientStop[]>(createInitialStops);
  const [activeStopId, setActiveStopId] = useState<string>(stops[0]?.id || 'stop-0');

  // Source image state
  const [imageUrl, setImageUrl] = useState<string>(DEFAULT_IMAGE);

  // About modal state
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Sync dark mode class on documentElement
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('kq-moemap-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('kq-moemap-theme', 'light');
    }
  }, [darkMode]);

  // Handle palette selection from Magic Search
  const handleSelectPalette = (palette: Palette) => {
    const newStops = palette.stops.map((color, idx) => ({
      id: `stop-${idx}-${Date.now()}`,
      color,
      offset: idx / (palette.stops.length - 1),
    }));
    setStops(newStops);
    setActiveStopId(newStops[0]?.id || '');
  };

  // Add stop
  const handleAddStop = () => {
    const lastStop = stops[stops.length - 1];
    const newOffset = Math.min(1, Math.max(0, (stops[0]?.offset + lastStop?.offset) / 2));
    const newStop: GradientStop = {
      id: `stop-${Date.now()}`,
      color: '#FF85A2',
      offset: newOffset,
    };
    const nextStops = [...stops, newStop].sort((a, b) => a.offset - b.offset);
    setStops(nextStops);
    setActiveStopId(newStop.id);
  };

  // Remove stop
  const handleRemoveStop = (id: string) => {
    if (stops.length <= 2) return;
    const nextStops = stops.filter((s) => s.id !== id);
    setStops(nextStops);
    if (activeStopId === id) {
      setActiveStopId(nextStops[0]?.id || '');
    }
  };

  // Update stop
  const handleUpdateStop = (id: string, updates: Partial<GradientStop>) => {
    setStops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  // Move stop up or down
  const handleMoveStop = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stops.length) return;
    const next = [...stops];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    const tempOffset = next[index].offset;
    next[index].offset = next[targetIndex].offset;
    next[targetIndex].offset = tempOffset;
    setStops(next);
  };

  // Invert / Reverse stops
  const handleReverseStops = () => {
    const reversed = [...stops].reverse().map((stop, idx) => ({
      ...stop,
      offset: idx / (stops.length - 1),
    }));
    setStops(reversed);
  };

  // Distribute stops evenly
  const handleDistributeEvenly = () => {
    const sorted = [...stops].sort((a, b) => a.offset - b.offset);
    const evenly = sorted.map((stop, idx) => ({
      ...stop,
      offset: idx / (stops.length - 1),
    }));
    setStops(evenly);
  };

  // Reset to default
  const handleReset = () => {
    const defaults = createInitialStops();
    setStops(defaults);
    setActiveStopId(defaults[0]?.id || '');
    setImageUrl(DEFAULT_IMAGE);
  };

  const filterId = 'kq-moemap-filter';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* Real SVG Filter definition in the DOM */}
      <SvgFilterDefinition filterId={filterId} stops={stops} />

      {/* Top Navigation & Status Bar */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onReset={handleReset}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Two-column layout on Desktop, stacked on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT PANEL: Controls (5 columns on large screen) */}
          <div className="lg:col-span-5 flex flex-col space-y-5">
            {/* 1. Magic Palette Search */}
            <section className="p-4 sm:p-5 rounded-3xl glass-panel shadow-sm border border-slate-200/80 dark:border-slate-800">
              <MagicPaletteSearch onSelectPalette={handleSelectPalette} />
            </section>

            {/* 2. Color Stops Editor */}
            <section className="p-4 sm:p-5 rounded-3xl glass-panel shadow-sm border border-slate-200/80 dark:border-slate-800">
              <ColorStopsEditor
                stops={stops}
                activeStopId={activeStopId}
                onSelectStop={setActiveStopId}
                onUpdateStop={handleUpdateStop}
                onAddStop={handleAddStop}
                onRemoveStop={handleRemoveStop}
                onMoveStop={handleMoveStop}
                onReverseStops={handleReverseStops}
                onDistributeEvenly={handleDistributeEvenly}
              />
            </section>

            {/* 3. Image Upload & Presets */}
            <section className="p-4 sm:p-5 rounded-3xl glass-panel shadow-sm border border-slate-200/80 dark:border-slate-800">
              <ImageUploader
                currentImageUrl={imageUrl}
                onImageChange={setImageUrl}
              />
            </section>

            {/* 4. Export & Copy Actions */}
            <section className="p-4 sm:p-5 rounded-3xl glass-panel shadow-sm border border-slate-200/80 dark:border-slate-800">
              <ExportPanel
                stops={stops}
                imageUrl={imageUrl}
                filterId={filterId}
              />
            </section>
          </div>

          {/* RIGHT PANEL: Preview Canvas (7 columns on large screen) */}
          <div className="lg:col-span-7 flex flex-col space-y-5 sticky top-6">
            <section>
              <PreviewCanvas
                imageUrl={imageUrl}
                stops={stops}
                activeStopId={activeStopId}
                onSelectStop={setActiveStopId}
                filterId={filterId}
              />
            </section>
          </div>
        </div>
      </main>

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Aesthetic Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white/50 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/50 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400 mt-8 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">KQ-MoeMap</span>
            <span>—</span>
            <button
              onClick={() => setIsAboutOpen(true)}
              className="text-sky-500 hover:text-sky-600 dark:text-sky-400 underline font-medium"
            >
              About & Live Demo
            </button>
          </div>
          <div className="flex items-center space-x-3 font-mono text-[11px] text-slate-400 dark:text-slate-500">
            <a
              href="https://knapqiproton.github.io/KQ-MoeMap/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition"
            >
              knapqiproton.github.io/KQ-MoeMap
            </a>
            <span>•</span>
            <span>sRGB MATRIX</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
