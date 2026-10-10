import type { GradientStop } from '../types';
import { stopsToCssGradient } from '../utils/svgEngine';

interface GradientBarProps {
  stops: GradientStop[];
  activeStopId?: string;
  onSelectStop?: (id: string) => void;
  interactive?: boolean;
}

export const GradientBar = ({
  stops,
  activeStopId,
  onSelectStop,
  interactive = true,
}: GradientBarProps) => {
  const gradientCss = stopsToCssGradient(stops);
  const sortedStops = [...stops].sort((a, b) => a.offset - b.offset);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
        <span className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white inline-block" />
          <span>0% LUMINANCE (SHADOWS)</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span>100% LUMINANCE (HIGHLIGHTS)</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white inline-block" />
        </span>
      </div>

      <div className="relative pt-2 pb-5">
        {/* Sleek Gradient Bar Container */}
        <div
          className="relative h-6 w-full rounded-xl shadow-inner border border-black/10 dark:border-white/10 overflow-hidden transition-all duration-300"
          style={{ background: gradientCss }}
        >
          {/* Subtle gloss overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
        </div>

        {/* Stop Markers */}
        {sortedStops.map((stop) => {
          const isSelected = stop.id === activeStopId;
          const leftPercent = Math.max(0, Math.min(100, stop.offset * 100));

          return (
            <div
              key={stop.id}
              onClick={() => interactive && onSelectStop && onSelectStop(stop.id)}
              className={`group absolute bottom-0 -translate-x-1/2 flex flex-col items-center ${
                interactive ? 'cursor-pointer' : ''
              }`}
              style={{ left: `${leftPercent}%` }}
              title={`Stop: ${stop.color} (${Math.round(leftPercent)}%)`}
            >
              {/* Pointer Triangle */}
              <div
                className={`w-0 h-0 border-x-4 border-x-transparent border-b-[6px] transition-transform ${
                  isSelected
                    ? 'border-b-sky-500 scale-125'
                    : 'border-b-slate-600 dark:border-b-slate-300 group-hover:scale-110'
                }`}
              />
              {/* Color Dot Pin */}
              <div
                className={`w-4 h-4 rounded-full border-2 transition-all shadow-md ${
                  isSelected
                    ? 'border-sky-500 ring-2 ring-sky-400/40 scale-110'
                    : 'border-white dark:border-slate-800 group-hover:scale-105'
                }`}
                style={{ backgroundColor: stop.color }}
              />
              {/* Pin tooltip text */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 whitespace-nowrap shadow-sm pointer-events-none z-10">
                {stop.color} ({Math.round(leftPercent)}%)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
