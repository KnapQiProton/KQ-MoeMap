import { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, ArrowLeftRight, Layers, Sliders, Palette } from 'lucide-react';
import type { GradientStop } from '../types';
import { ModernColorPicker } from './ModernColorPicker';

interface ColorStopsEditorProps {
  stops: GradientStop[];
  activeStopId: string;
  onSelectStop: (id: string) => void;
  onUpdateStop: (id: string, updates: Partial<GradientStop>) => void;
  onAddStop: () => void;
  onRemoveStop: (id: string) => void;
  onMoveStop: (index: number, direction: 'up' | 'down') => void;
  onReverseStops: () => void;
  onDistributeEvenly: () => void;
}

export const ColorStopsEditor = ({
  stops,
  activeStopId,
  onSelectStop,
  onUpdateStop,
  onAddStop,
  onRemoveStop,
  onMoveStop,
  onReverseStops,
  onDistributeEvenly,
}: ColorStopsEditorProps) => {
  const [openPickerStopId, setOpenPickerStopId] = useState<string | null>(null);

  const handleHexChange = (id: string, rawVal: string) => {
    let clean = rawVal.trim();
    if (!clean.startsWith('#')) {
      clean = `#${clean}`;
    }
    onUpdateStop(id, { color: clean.toUpperCase() });
  };

  return (
    <div className="w-full space-y-3">
      {/* Title & Quick Actions */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
          <Sliders className="w-3.5 h-3.5 text-sky-500" />
          <span>Active Color Stops ({stops.length})</span>
        </label>

        <div className="flex items-center space-x-1.5">
          {/* Reverse gradient button */}
          <button
            onClick={onReverseStops}
            className="p-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 transition flex items-center space-x-1"
            title="Reverse Gradient Order"
          >
            <ArrowLeftRight className="w-3 h-3" />
            <span className="hidden sm:inline text-[10px]">Invert</span>
          </button>

          {/* Distribute evenly */}
          <button
            onClick={onDistributeEvenly}
            className="p-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 transition flex items-center space-x-1"
            title="Distribute Stops Evenly Across Range"
          >
            <Layers className="w-3 h-3" />
            <span className="hidden sm:inline text-[10px]">Even</span>
          </button>

          {/* Add stop button */}
          <button
            onClick={onAddStop}
            className="px-2.5 py-1 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600 transition shadow-sm flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Stop</span>
          </button>
        </div>
      </div>

      {/* Stop Items List */}
      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {stops.map((stop, index) => {
          const isSelected = stop.id === activeStopId;
          const isPickerOpen = openPickerStopId === stop.id;
          const percent = Math.round(stop.offset * 100);

          return (
            <div
              key={stop.id}
              onClick={() => onSelectStop(stop.id)}
              className={`relative p-2.5 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-sky-50/70 border-sky-300 shadow-sm dark:bg-sky-950/30 dark:border-sky-700'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                {/* Reorder Up / Down Buttons */}
                <div className="flex flex-col space-y-0.5">
                  <button
                    disabled={index === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveStop(index, 'up');
                    }}
                    className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 disabled:pointer-events-none"
                    title="Move stop up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    disabled={index === stops.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveStop(index, 'down');
                    }}
                    className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 disabled:pointer-events-none"
                    title="Move stop down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>

                {/* Modern Color Swatch Trigger */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenPickerStopId(isPickerOpen ? null : stop.id);
                    }}
                    className="w-8 h-8 rounded-lg shadow-sm border border-black/15 dark:border-white/15 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 group relative"
                    style={{ backgroundColor: stop.color }}
                    title="Open Modern Color Matrix Picker"
                  >
                    <Palette className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  {/* Modern Color Picker Popover */}
                  {isPickerOpen && (
                    <ModernColorPicker
                      color={stop.color}
                      onChange={(newHex) => onUpdateStop(stop.id, { color: newHex })}
                      onClose={() => setOpenPickerStopId(null)}
                    />
                  )}
                </div>

                {/* Smart Hex Input Field */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={stop.color}
                    onChange={(e) => handleHexChange(stop.id, e.target.value)}
                    maxLength={9}
                    placeholder="#RRGGBB"
                    className="w-full px-2.5 py-1 text-xs font-mono font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-400 uppercase"
                  />
                </div>

                {/* Offset Slider & Percentage */}
                <div className="flex items-center space-x-2 w-32 shrink-0">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={percent}
                    onChange={(e) => {
                      const newOffset = Number(e.target.value) / 100;
                      onUpdateStop(stop.id, { offset: newOffset });
                    }}
                    className="w-20 accent-sky-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 w-8 text-right">
                    {percent}%
                  </span>
                </div>

                {/* Delete Stop Button (Disabled if <= 2 stops) */}
                <button
                  disabled={stops.length <= 2}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (openPickerStopId === stop.id) setOpenPickerStopId(null);
                    onRemoveStop(stop.id);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-20 disabled:pointer-events-none transition"
                  title={stops.length <= 2 ? 'Minimum 2 stops required' : 'Delete stop'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
