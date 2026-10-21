import { Sparkles, Zap, RotateCcw } from 'lucide-react';
import type { PostProcessingEffects } from '../types';

interface PostProcessingControlProps {
  postProcessing: PostProcessingEffects;
  onUpdate: (effects: PostProcessingEffects) => void;
  onReset: () => void;
}

export const PostProcessingControl = ({
  postProcessing,
  onUpdate,
  onReset,
}: PostProcessingControlProps) => {
  const isDefault =
    !postProcessing.enableBloom &&
    postProcessing.bloomIntensity === 4 &&
    !postProcessing.enableGlitch &&
    postProcessing.glitchIntensity === 5;

  const handleToggleBloom = () => {
    onUpdate({
      ...postProcessing,
      enableBloom: !postProcessing.enableBloom,
    });
  };

  const handleToggleGlitch = () => {
    onUpdate({
      ...postProcessing,
      enableGlitch: !postProcessing.enableGlitch,
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Title & Section Actions */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          <span>Post-Processing Effects</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/50">
            FX // SHADER
          </span>
        </label>

        <button
          onClick={onReset}
          disabled={isDefault}
          className="px-2.5 py-1.5 min-h-[36px] sm:min-h-0 rounded-xl sm:rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 transition flex items-center space-x-1 disabled:opacity-30 disabled:pointer-events-none active:scale-95 shadow-sm"
          title="Reset Post-Processing Effects to Default"
        >
          <RotateCcw className="w-3 h-3 text-purple-500" />
          <span className="text-[11px] sm:text-[10px]">Reset</span>
        </button>
      </div>

      {/* Effects Grid */}
      <div className="space-y-3.5">
        {/* 1. Bloom / Glow Effect Card */}
        <div
          className={`p-3.5 rounded-2xl border transition-all duration-200 ${
            postProcessing.enableBloom
              ? 'bg-pink-50/60 dark:bg-pink-950/20 border-pink-300/80 dark:border-pink-800/60 shadow-sm'
              : 'bg-white/70 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800'
          }`}
        >
          {/* Header & Glow Switch */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  postProcessing.enableBloom
                    ? 'bg-pink-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Bloom / Glow
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  Atmospheric dream bleed
                </p>
              </div>
            </div>

            {/* Glowing Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={postProcessing.enableBloom}
              onClick={handleToggleBloom}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                postProcessing.enableBloom
                  ? 'bg-gradient-to-r from-pink-500 to-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.6)]'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  postProcessing.enableBloom ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Intensity Slider (Visible when active) */}
          <div
            className={`pt-3 space-y-1.5 transition-all duration-200 ${
              postProcessing.enableBloom ? 'opacity-100' : 'opacity-40 pointer-events-none'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                Glow Radius (stdDev)
              </span>
              <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 border border-pink-200/50 dark:border-pink-800/50">
                {postProcessing.bloomIntensity.toFixed(1)}px
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="20"
              step="0.5"
              value={postProcessing.bloomIntensity}
              disabled={!postProcessing.enableBloom}
              onChange={(e) =>
                onUpdate({
                  ...postProcessing,
                  bloomIntensity: parseFloat(e.target.value),
                })
              }
              className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 accent-pink-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 px-0.5">
              <span>0px (Sharp)</span>
              <span>10px</span>
              <span>20px (Dreamy)</span>
            </div>
          </div>
        </div>

        {/* 2. Tactical Glitch Effect Card */}
        <div
          className={`p-3.5 rounded-2xl border transition-all duration-200 ${
            postProcessing.enableGlitch
              ? 'bg-sky-50/60 dark:bg-sky-950/20 border-sky-300/80 dark:border-sky-800/60 shadow-sm'
              : 'bg-white/70 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800'
          }`}
        >
          {/* Header & Glitch Switch */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  postProcessing.enableGlitch
                    ? 'bg-sky-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.5)]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Tactical Glitch
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  Turbulent noise displacement
                </p>
              </div>
            </div>

            {/* Glowing Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={postProcessing.enableGlitch}
              onClick={handleToggleGlitch}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                postProcessing.enableGlitch
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.6)]'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  postProcessing.enableGlitch ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Intensity Slider (Visible when active) */}
          <div
            className={`pt-3 space-y-1.5 transition-all duration-200 ${
              postProcessing.enableGlitch ? 'opacity-100' : 'opacity-40 pointer-events-none'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                Displacement Scale
              </span>
              <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/50">
                {(postProcessing.glitchIntensity * 5).toFixed(0)}px
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="20"
              step="0.5"
              value={postProcessing.glitchIntensity}
              disabled={!postProcessing.enableGlitch}
              onChange={(e) =>
                onUpdate({
                  ...postProcessing,
                  glitchIntensity: parseFloat(e.target.value),
                })
              }
              className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 px-0.5">
              <span>0px (Subtle)</span>
              <span>50px</span>
              <span>100px (Corrupted)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
