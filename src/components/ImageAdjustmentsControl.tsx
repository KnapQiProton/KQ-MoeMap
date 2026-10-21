import { SlidersHorizontal, Sun, Contrast, Sparkles, RotateCcw } from 'lucide-react';
import type { ImageAdjustments } from '../types';

interface ImageAdjustmentsControlProps {
  adjustments: ImageAdjustments;
  onUpdate: (adjustments: ImageAdjustments) => void;
  onReset: () => void;
}

export const ImageAdjustmentsControl = ({
  adjustments,
  onUpdate,
  onReset,
}: ImageAdjustmentsControlProps) => {
  const isDefault =
    adjustments.brightness === 1 &&
    adjustments.contrast === 1 &&
    adjustments.gamma === 1;

  const handleSliderChange = (key: keyof ImageAdjustments, value: number) => {
    onUpdate({
      ...adjustments,
      [key]: value,
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Title & Section Actions */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-pink-500" />
          <span>Image Adjustments</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 border border-pink-200/50 dark:border-pink-800/50">
            PRE-FILTER
          </span>
        </label>

        <button
          onClick={onReset}
          disabled={isDefault}
          className="px-2.5 py-1.5 min-h-[36px] sm:min-h-0 rounded-xl sm:rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 transition flex items-center space-x-1 disabled:opacity-30 disabled:pointer-events-none active:scale-95 shadow-sm"
          title="Reset Brightness, Contrast & Gamma to 1.0"
        >
          <RotateCcw className="w-3 h-3 text-pink-500" />
          <span className="text-[11px] sm:text-[10px]">Reset</span>
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="space-y-3.5">
        {/* 1. Brightness Slider */}
        <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5 transition-colors">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Brightness</span>
            </span>
            <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40">
              {adjustments.brightness.toFixed(2)}×
            </span>
          </div>

          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max="2"
              step="0.02"
              value={adjustments.brightness}
              onChange={(e) => handleSliderChange('brightness', parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 px-0.5">
              <span>0.0 (Dark)</span>
              <span className="font-semibold text-slate-500 dark:text-slate-400">1.0 (Norm)</span>
              <span>2.0 (Bright)</span>
            </div>
          </div>
        </div>

        {/* 2. Contrast Slider */}
        <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5 transition-colors">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
              <Contrast className="w-3.5 h-3.5 text-sky-500" />
              <span>Contrast</span>
            </span>
            <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200/60 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/40">
              {adjustments.contrast.toFixed(2)}×
            </span>
          </div>

          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max="2"
              step="0.02"
              value={adjustments.contrast}
              onChange={(e) => handleSliderChange('contrast', parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 px-0.5">
              <span>0.0 (Flat)</span>
              <span className="font-semibold text-slate-500 dark:text-slate-400">1.0 (Norm)</span>
              <span>2.0 (High)</span>
            </div>
          </div>
        </div>

        {/* 3. Gamma Slider */}
        <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5 transition-colors">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>Gamma Correction</span>
            </span>
            <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/60 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/40">
              γ {adjustments.gamma.toFixed(2)}
            </span>
          </div>

          <div className="space-y-1">
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.05"
              value={adjustments.gamma}
              onChange={(e) => handleSliderChange('gamma', parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 px-0.5">
              <span>0.1 (Lift)</span>
              <span className="font-semibold text-slate-500 dark:text-slate-400">1.0 (Linear)</span>
              <span>3.0 (Crush)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
