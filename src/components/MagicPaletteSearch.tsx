import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, Sparkles, X, Palette as PaletteIcon, ChevronRight } from 'lucide-react';
import { CURATED_PALETTES } from '../data/palettes';
import type { Palette } from '../types';

interface MagicPaletteSearchProps {
  onSelectPalette: (palette: Palette) => void;
}

export const MagicPaletteSearch = ({ onSelectPalette }: MagicPaletteSearchProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  });
  const [isMobileModal, setIsMobileModal] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update dropdown position relative to input or mobile viewport
  const updateDropdownPosition = useCallback(() => {
    const isMobile = window.innerWidth < 640;
    setIsMobileModal(isMobile);

    if (isMobile) return;

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dropdownHeight = 360;
    const padding = 16;

    let top = rect.bottom + 6;
    if (top + dropdownHeight > window.innerHeight - padding) {
      const topAbove = rect.top - dropdownHeight - 6;
      if (topAbove >= padding) {
        top = topAbove;
      } else {
        top = Math.max(padding, window.innerHeight - dropdownHeight - padding);
      }
    }

    setDropdownPos({
      top,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  // Update position on scroll/resize
  useEffect(() => {
    if (!isOpen) return;
    updateDropdownPosition();
    window.addEventListener('scroll', updateDropdownPosition, true);
    window.addEventListener('resize', updateDropdownPosition);
    return () => {
      window.removeEventListener('scroll', updateDropdownPosition, true);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [isOpen, updateDropdownPosition]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  // Filter palettes based on query and category
  const filteredPalettes = CURATED_PALETTES.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!query.trim()) return true;

    const q = query.toLowerCase().trim();
    const nameMatch = p.name.toLowerCase().includes(q);
    const keywordMatch = p.keywords.some((k) => k.toLowerCase().includes(q));
    const descMatch = p.description?.toLowerCase().includes(q) ?? false;
    return nameMatch || keywordMatch || descMatch;
  });

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'moe', label: '🌸 Moe / Cute' },
    { id: 'tech', label: '⚡ Yostar / Tech' },
    { id: 'dark', label: '🌑 Nacht / Dark' },
    { id: 'nature', label: '🌊 Nature / Ocean' },
    { id: 'retro', label: '📼 Retro / Synth' },
  ];

  const handleApplyPalette = (palette: Palette) => {
    onSelectPalette(palette);
    setIsOpen(false);
    setQuery('');
  };

  const dropdownContent = isOpen ? (
    <div
      className={`fixed inset-0 z-[9999] ${
        isMobileModal
          ? 'flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'
          : 'pointer-events-auto'
      }`}
    >
      {/* Backdrop to catch clicks outside dropdown */}
      <div
        className={`fixed inset-0 transition-opacity ${
          isMobileModal ? 'bg-transparent' : 'bg-black/20 dark:bg-black/40 backdrop-blur-[0.5px]'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Popover Dropdown Card */}
      <div
        style={
          isMobileModal
            ? { maxHeight: 'calc(85vh)' }
            : {
                position: 'fixed',
                top: `${dropdownPos.top}px`,
                left: `${dropdownPos.left}px`,
                width: `${Math.max(300, dropdownPos.width)}px`,
                maxHeight: '380px',
              }
        }
        className="relative z-10 w-full max-w-md rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Header Bar */}
        {isMobileModal && (
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>Select Curated Palette</span>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="p-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40 flex items-center space-x-1 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`min-h-[40px] sm:min-h-[32px] px-3 py-1.5 text-xs sm:text-[11px] font-medium rounded-xl whitespace-nowrap transition flex items-center ${
                selectedCategory === cat.id
                  ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* List of Palettes */}
        <div className="overflow-y-auto p-2 space-y-1.5 max-h-[320px] divide-y divide-slate-100 dark:divide-slate-800/40">
          {filteredPalettes.length === 0 ? (
            <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
              No palettes found matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredPalettes.map((palette) => {
              const gradientPreview = `linear-gradient(to right, ${palette.stops.join(', ')})`;
              return (
                <button
                  key={palette.id}
                  onClick={() => handleApplyPalette(palette)}
                  className="w-full pt-2 first:pt-0 text-left p-2.5 sm:p-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/70 transition group flex flex-col space-y-2 min-h-[48px]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <PaletteIcon className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition">
                        {palette.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono uppercase text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800">
                        {palette.category}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                  </div>

                  {/* Palette Gradient Preview Strip */}
                  <div
                    className="h-4 sm:h-3.5 w-full rounded-md shadow-sm border border-black/5 dark:border-white/5"
                    style={{ background: gradientPreview }}
                  />

                  {/* Color Chips & Description */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="truncate max-w-[220px] text-[10px]">
                      {palette.description}
                    </span>
                    <div className="flex items-center space-x-1 shrink-0">
                      {palette.stops.map((color, idx) => (
                        <span
                          key={idx}
                          className="w-3 h-3 sm:w-2.5 sm:h-2.5 rounded-full border border-black/10 dark:border-white/10"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
        <span className="flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>Magic Palette Search</span>
        </span>
        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
          20 Curated Themes
        </span>
      </label>

      {/* Input container with touch-friendly min-height 48px on mobile */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            updateDropdownPosition();
          }}
          placeholder="Type keyword: 'Moe Pastel', 'Yostar', 'Nacht', 'Cute-core'..."
          className="w-full min-h-[48px] sm:min-h-[42px] pl-10 pr-9 py-2.5 text-sm rounded-2xl sm:rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-400/50 dark:focus:ring-pink-500/40 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm transition"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-2.5 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Suggestion Pills underneath input with touch-friendly height */}
      <div className="flex flex-wrap gap-1.5 mt-2.5">
        {['Moe Pastel', 'Cute-core', 'Yostar Blue', 'Ocean', 'Süße Farbe', 'Nacht'].map((favName) => {
          const pal = CURATED_PALETTES.find((p) => p.name === favName);
          if (!pal) return null;
          return (
            <button
              key={favName}
              onClick={() => handleApplyPalette(pal)}
              className="min-h-[36px] sm:min-h-[28px] px-3 py-1 text-xs sm:text-[11px] font-medium rounded-xl sm:rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition flex items-center space-x-1.5 active:scale-95"
            >
              <span
                className="w-2.5 h-2.5 sm:w-2 sm:h-2 rounded-full inline-block shrink-0"
                style={{ backgroundColor: pal.stops[Math.floor(pal.stops.length / 2)] }}
              />
              <span>{pal.name}</span>
            </button>
          );
        })}
      </div>

      {/* Render Dropdown via React Portal to prevent container clipping */}
      {dropdownContent && createPortal(dropdownContent, document.body)}
    </div>
  );
};
