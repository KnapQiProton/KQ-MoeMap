import { useState, useRef, useEffect } from 'react';
import type { SyntheticEvent, MouseEvent, TouchEvent } from 'react';
import { Eye, SplitSquareVertical, ZoomIn, ZoomOut, Sparkles } from 'lucide-react';
import type { GradientStop } from '../types';
import { GradientBar } from './GradientBar';

interface PreviewCanvasProps {
  imageUrl: string;
  stops: GradientStop[];
  activeStopId: string;
  onSelectStop: (id: string) => void;
  filterId?: string;
}

export const PreviewCanvas = ({
  imageUrl,
  stops,
  activeStopId,
  onSelectStop,
  filterId = 'kq-moemap-filter',
}: PreviewCanvasProps) => {
  const [viewMode, setViewMode] = useState<'filtered' | 'split' | 'original'>('filtered');
  const [splitPos, setSplitPos] = useState<number>(50); // percentage
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const [imgDimensions, setImgDimensions] = useState<{ width: number; height: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    setImgDimensions({
      width: target.naturalWidth || target.width,
      height: target.naturalHeight || target.height,
    });
  };

  // Handle split slider drag
  const handleSplitMouseMove = (e: MouseEvent) => {
    if (!isDraggingSplit || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSplitPos(percent);
  };

  const handleSplitTouchMove = (e: TouchEvent) => {
    if (!isDraggingSplit || !containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSplitPos(percent);
  };

  useEffect(() => {
    const handleUp = () => setIsDraggingSplit(false);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, []);

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Top Gradient Bar representation */}
      <div className="p-4 rounded-2xl glass-panel shadow-sm border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-pink-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Active Gradient Spectrum
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
            {stops.length} COLOR STOPS
          </span>
        </div>
        <GradientBar
          stops={stops}
          activeStopId={activeStopId}
          onSelectStop={onSelectStop}
        />
      </div>

      {/* Main Preview Container Panel */}
      <div className="relative rounded-3xl glass-panel shadow-lg border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Preview Control Header */}
        <div className="p-2.5 sm:px-5 border-b border-slate-200/60 dark:border-slate-800/80 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-900/40">
          {/* Mode Toggles */}
          <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/80">
            <button
              onClick={() => setViewMode('filtered')}
              className={`px-3 py-1.5 sm:py-1 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
                viewMode === 'filtered'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>Filtered</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 sm:py-1 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>
            <button
              onClick={() => setViewMode('original')}
              className={`px-3 py-1.5 sm:py-1 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
                viewMode === 'original'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Original</span>
            </button>
          </div>

          {/* Zoom and Info Controls */}
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            {imgDimensions && (
              <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800">
                {imgDimensions.width} × {imgDimensions.height}px
              </span>
            )}
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition min-w-[34px] min-h-[34px] flex items-center justify-center"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 min-w-[36px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition min-w-[34px] min-h-[34px] flex items-center justify-center"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-mono min-w-[34px] min-h-[34px] flex items-center justify-center"
              title="Reset Zoom"
            >
              1:1
            </button>
          </div>
        </div>

        {/* Display Canvas Area */}
        <div
          ref={containerRef}
          onMouseMove={handleSplitMouseMove}
          onTouchMove={handleSplitTouchMove}
          className="relative min-h-[260px] sm:min-h-[380px] lg:min-h-[460px] max-h-[640px] w-full flex items-center justify-center p-3 sm:p-6 lg:p-8 overflow-auto tech-grid-bg select-none"
        >
          {/* Zoom Wrapper */}
          <div
            className="relative transition-transform duration-100 ease-out flex items-center justify-center shadow-2xl rounded-2xl overflow-hidden"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* View Mode: Filtered Only */}
            {viewMode === 'filtered' && (
              <img
                ref={imgRef}
                src={imageUrl}
                alt="KQ-MoeMap Filtered Preview"
                onLoad={handleImageLoad}
                className="max-w-full max-h-[250px] sm:max-h-[380px] lg:max-h-[520px] object-contain rounded-2xl transition-all"
                style={{
                  filter: `url(#${filterId})`,
                }}
              />
            )}

            {/* View Mode: Original Only */}
            {viewMode === 'original' && (
              <img
                src={imageUrl}
                alt="Original Preview"
                onLoad={handleImageLoad}
                className="max-w-full max-h-[250px] sm:max-h-[380px] lg:max-h-[520px] object-contain rounded-2xl transition-all"
              />
            )}

            {/* View Mode: Split Comparison Slider */}
            {viewMode === 'split' && (
              <div className="relative max-w-full max-h-[250px] sm:max-h-[380px] lg:max-h-[520px] flex items-center justify-center overflow-hidden rounded-2xl">
                {/* Background Layer: Filtered Image */}
                <img
                  src={imageUrl}
                  alt="MoeMap Filtered"
                  onLoad={handleImageLoad}
                  className="max-w-full max-h-[250px] sm:max-h-[380px] lg:max-h-[520px] object-contain block"
                  style={{
                    filter: `url(#${filterId})`,
                  }}
                />

                {/* Foreground Layer: Original Image clipped to splitPos */}
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{
                    clipPath: `polygon(0 0, ${splitPos}% 0, ${splitPos}% 100%, 0 100%)`,
                  }}
                >
                  <img
                    src={imageUrl}
                    alt="Original Image"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Split Slider Divider Line */}
                <div
                  className="absolute top-0 bottom-0 z-20 w-0.5 bg-white shadow-lg cursor-ew-resize flex items-center justify-center"
                  style={{ left: `${splitPos}%` }}
                  onMouseDown={() => setIsDraggingSplit(true)}
                  onTouchStart={() => setIsDraggingSplit(true)}
                >
                  <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-900 border-2 border-sky-400 shadow-md flex items-center justify-center text-[10px] font-bold text-sky-500 select-none">
                    ⇆
                  </div>
                </div>

                {/* Labels */}
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-mono pointer-events-none backdrop-blur-sm">
                  ORIGINAL
                </div>
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-sky-500/80 text-white text-[10px] font-mono pointer-events-none backdrop-blur-sm">
                  MOEMAP FILTER
                </div>
              </div>
            )}
          </div>

          {/* Active SVG Filter Badge in Bottom-Right Corner */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-300 flex items-center space-x-1.5 shadow-sm pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>FILTER // #{filterId}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
