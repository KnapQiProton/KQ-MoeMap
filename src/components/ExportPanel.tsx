import { useState, useRef } from 'react';
import { Download, Code, Check, FileCode, Sparkles, Terminal } from 'lucide-react';
import type { GradientStop, ExportFormat, ImageAdjustments, PostProcessingEffects } from '../types';
import {
  generateSvgFilterCode,
  generateCssCode,
  renderGradientMapToCanvas,
  calculateTableValues,
  calculateLinearAdjustments,
  DEFAULT_ADJUSTMENTS,
  DEFAULT_POST_PROCESSING,
} from '../utils/svgEngine';

interface ExportPanelProps {
  stops: GradientStop[];
  imageUrl: string;
  filterId?: string;
  adjustments?: ImageAdjustments;
  postProcessing?: PostProcessingEffects;
}

export const ExportPanel = ({
  stops,
  imageUrl,
  filterId = 'kq-moemap-filter',
  adjustments = DEFAULT_ADJUSTMENTS,
  postProcessing = DEFAULT_POST_PROCESSING,
}: ExportPanelProps) => {
  const [copiedType, setCopiedType] = useState<'svg' | 'css' | null>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const [isExporting, setIsExporting] = useState(false);
  const [showCodeInspector, setShowCodeInspector] = useState(false);

  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleCopySvg = async () => {
    const svgCode = generateSvgFilterCode(filterId, stops, adjustments, postProcessing);
    await navigator.clipboard.writeText(svgCode);
    setCopiedType('svg');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleCopyCss = async () => {
    const cssCode = generateCssCode(filterId);
    await navigator.clipboard.writeText(cssCode);
    setCopiedType('css');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleExportImage = async () => {
    try {
      setIsExporting(true);
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image for canvas export'));
        img.src = imageUrl;
      });

      if (!hiddenCanvasRef.current) return;
      await renderGradientMapToCanvas(img, stops, hiddenCanvasRef.current, adjustments, postProcessing);

      const mimeType = exportFormat === 'jpeg' ? 'image/jpeg' : exportFormat === 'webp' ? 'image/webp' : 'image/png';
      const fileExt = exportFormat === 'jpeg' ? 'jpg' : exportFormat;

      hiddenCanvasRef.current.toBlob(
        (blob) => {
          if (!blob) {
            alert('Failed to generate image file.');
            setIsExporting(false);
            return;
          }
          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `kq-moemap-export-${Date.now()}.${fileExt}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(downloadUrl);
          setIsExporting(false);
        },
        mimeType,
        exportFormat === 'jpeg' ? 0.95 : undefined
      );
    } catch (err) {
      console.error(err);
      alert('Error exporting image. If using an external image, browser security may restrict canvas reading.');
      setIsExporting(false);
    }
  };

  const { rTable, gTable, bTable } = calculateTableValues(stops, 64);
  const { slope, intercept } = calculateLinearAdjustments(adjustments.brightness, adjustments.contrast);
  const gamma = Number(adjustments.gamma.toFixed(4));
  const svgSnippet = generateSvgFilterCode(filterId, stops, adjustments, postProcessing);
  const cssSnippet = generateCssCode(filterId);

  return (
    <div className="w-full space-y-3">
      {/* Hidden canvas used for pixel-perfect export */}
      <canvas ref={hiddenCanvasRef} className="hidden" aria-hidden="true" />

      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span className="flex items-center space-x-1.5">
          <Terminal className="w-3.5 h-3.5 text-pink-500" />
          <span>Export & Copy Actions</span>
        </span>
        <button
          onClick={() => setShowCodeInspector(!showCodeInspector)}
          className="text-[11px] font-mono text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300 flex items-center space-x-1"
        >
          <Code className="w-3 h-3" />
          <span>{showCodeInspector ? 'Hide Code' : 'Inspect Code'}</span>
        </button>
      </label>

      {/* Main Action Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {/* Copy SVG Code */}
        <button
          onClick={handleCopySvg}
          className={`px-3 py-2.5 min-h-[44px] rounded-xl border font-medium text-xs transition flex items-center justify-center space-x-2 active:scale-95 ${
            copiedType === 'svg'
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          {copiedType === 'svg' ? (
            <>
              <Check className="w-4 h-4" />
              <span>SVG Copied!</span>
            </>
          ) : (
            <>
              <FileCode className="w-4 h-4 text-sky-500" />
              <span>Copy SVG Code</span>
            </>
          )}
        </button>

        {/* Copy CSS */}
        <button
          onClick={handleCopyCss}
          className={`px-3 py-2.5 min-h-[44px] rounded-xl border font-medium text-xs transition flex items-center justify-center space-x-2 active:scale-95 ${
            copiedType === 'css'
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          {copiedType === 'css' ? (
            <>
              <Check className="w-4 h-4" />
              <span>CSS Copied!</span>
            </>
          ) : (
            <>
              <Code className="w-4 h-4 text-purple-500" />
              <span>Copy CSS</span>
            </>
          )}
        </button>

        {/* Export Image Dropdown & Button */}
        <div className="flex items-center space-x-1.5">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
            className="px-2.5 py-2.5 min-h-[44px] text-xs font-mono uppercase rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
            title="Image Format"
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPG</option>
            <option value="webp">WEBP</option>
          </select>

          <button
            onClick={handleExportImage}
            disabled={isExporting}
            className="flex-1 px-3 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-sky-500 via-pink-500 to-purple-500 hover:from-sky-600 hover:via-pink-600 hover:to-purple-600 text-white font-medium text-xs shadow-sm shadow-pink-500/20 disabled:opacity-50 transition flex items-center justify-center space-x-1.5 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Exporting...' : 'Export Image'}</span>
          </button>
        </div>
      </div>

      {/* Expandable Live Code Inspector */}
      {showCodeInspector && (
        <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono border border-slate-800 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-pink-400 font-semibold flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live SVG Filter Pipeline Inspector</span>
            </span>
            <span className="text-[10px] text-slate-400">Pre + Map + Post Pipeline</span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div>
              <span className="text-amber-400">Pre-processing: </span>
              <span className="text-slate-300">
                Linear (slope={slope}, intercept={intercept}), Gamma (exp={gamma})
              </span>
            </div>
            <div>
              <span className="text-pink-400">Post-processing: </span>
              <span className="text-slate-300">
                Bloom ({postProcessing.enableBloom ? `${postProcessing.bloomIntensity}px` : 'OFF'}), Glitch ({postProcessing.enableGlitch ? `scale ${postProcessing.glitchIntensity * 5}px` : 'OFF'})
              </span>
            </div>
            <div>
              <span className="text-sky-400">feFuncR tableValues: </span>
              <span className="text-slate-400 break-all">{rTable.slice(0, 70)}...</span>
            </div>
            <div>
              <span className="text-emerald-400">feFuncG tableValues: </span>
              <span className="text-slate-400 break-all">{gTable.slice(0, 70)}...</span>
            </div>
            <div>
              <span className="text-purple-400">feFuncB tableValues: </span>
              <span className="text-slate-400 break-all">{bTable.slice(0, 70)}...</span>
            </div>
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">CSS Rule:</p>
            <pre className="p-2 rounded-lg bg-black/40 text-[10px] text-purple-300">
              {cssSnippet}
            </pre>
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Generated SVG Code:</p>
            <pre className="max-h-48 overflow-y-auto p-2 rounded-lg bg-black/40 text-[10px] leading-relaxed text-slate-300 scrollbar-thin">
              {svgSnippet}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
