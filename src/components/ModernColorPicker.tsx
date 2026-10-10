import { useState, useRef, useEffect, useCallback } from 'react';
import { Pipette, Copy, Check, X, RotateCcw } from 'lucide-react';
import { hexToRgb, rgbToHex } from '../utils/svgEngine';

interface ModernColorPickerProps {
  color: string;
  onChange: (hex: string) => void;
  onClose: () => void;
}

// Convert Hex to HSV
function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const rgb = hexToRgb(hex);
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (d !== 0) {
    if (max === rgb.r) {
      h = ((rgb.g - rgb.b) / d + (rgb.g < rgb.b ? 6 : 0)) / 6;
    } else if (max === rgb.g) {
      h = ((rgb.b - rgb.r) / d + 2) / 6;
    } else {
      h = ((rgb.r - rgb.g) / d + 4) / 6;
    }
  }
  return { h: Math.round(h * 360), s, v };
}

// Convert HSV to Hex
function hsvToHex(h: number, s: number, v: number): string {
  const c = v * s;
  const hp = (h % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (hp >= 0 && hp < 1) { r = c; g = x; b = 0; }
  else if (hp >= 1 && hp < 2) { r = x; g = c; b = 0; }
  else if (hp >= 2 && hp < 3) { r = 0; g = c; b = x; }
  else if (hp >= 3 && hp < 4) { r = 0; g = x; b = c; }
  else if (hp >= 4 && hp < 5) { r = x; g = 0; b = c; }
  else if (hp >= 5 && hp < 6) { r = c; g = 0; b = x; }
  return rgbToHex({ r: r + m, g: g + m, b: b + m });
}

// Preset popular palettes swatches
const QUICK_SWATCHES = [
  '#FF85A2', '#F7B2BD', '#FFF1E6', '#C7CEEA', '#93A4BA',
  '#38BDF8', '#0EA5E9', '#1E3A8A', '#0A192F', '#0284C7',
  '#A855F7', '#C084FC', '#F43F5E', '#FB7185', '#FFF5F8',
  '#4ADE80', '#22C55E', '#166534', '#FACC15', '#EA580C',
  '#090A0F', '#181E29', '#334155', '#E2E8F0', '#FFFFFF'
];

export const ModernColorPicker = ({
  color,
  onChange,
  onClose,
}: ModernColorPickerProps) => {
  const [initialColor] = useState(color);
  const [hsv, setHsv] = useState(() => hexToHsv(color));
  const [isCopied, setIsCopied] = useState(false);
  const [hexInput, setHexInput] = useState(color.toUpperCase());

  const satValRef = useRef<HTMLDivElement>(null);
  const isDraggingSatVal = useRef(false);
  const isDraggingHue = useRef(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Sync internal state when external color changes
  useEffect(() => {
    setHexInput(color.toUpperCase());
    setHsv(hexToHsv(color));
  }, [color]);

  // Update color and notify parent
  const updateHsv = useCallback((newHsv: { h: number; s: number; v: number }) => {
    setHsv(newHsv);
    const newHex = hsvToHex(newHsv.h, newHsv.s, newHsv.v);
    setHexInput(newHex);
    onChange(newHex);
  }, [onChange]);

  // Handle click outside to close
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  // Saturation / Value interactive dragging
  const handleSatValMove = useCallback((clientX: number, clientY: number) => {
    if (!satValRef.current) return;
    const rect = satValRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

    const s = x / rect.width;
    const v = 1 - (y / rect.height);
    updateHsv({ h: hsv.h, s, v });
  }, [hsv.h, updateHsv]);

  // Mouse move and up handlers for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSatVal.current) {
        handleSatValMove(e.clientX, e.clientY);
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingSatVal.current && e.touches[0]) {
        handleSatValMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleMouseUp = () => {
      isDraggingSatVal.current = false;
      isDraggingHue.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [handleSatValMove]);

  // Eyedropper API
  const handleEyeDropper = async () => {
    // Check if EyeDropper is supported
    if ('EyeDropper' in window) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          const hex = result.sRGBHex.toUpperCase();
          onChange(hex);
          setHexInput(hex);
          setHsv(hexToHsv(hex));
        }
      } catch {
        // User cancelled eyedropper
      }
    } else {
      alert('EyeDropper API is supported in Chromium browsers (Chrome, Edge, Opera).');
    }
  };

  const handleCopyHex = async () => {
    await navigator.clipboard.writeText(hexInput);
    setIsCopied(true);
    setTimeout(() => setIsCopied(null as unknown as boolean), 1800);
  };

  const handleManualHexInput = (val: string) => {
    let clean = val.trim();
    if (!clean.startsWith('#')) clean = `#${clean}`;
    setHexInput(clean.toUpperCase());
    if (/^#[0-9A-F]{6}$/i.test(clean)) {
      onChange(clean.toUpperCase());
      setHsv(hexToHsv(clean));
    }
  };

  // Convert current color to RGB for channel fields
  const currentRgb = hexToRgb(color);
  const rVal = Math.round(currentRgb.r * 255);
  const gVal = Math.round(currentRgb.g * 255);
  const bVal = Math.round(currentRgb.b * 255);

  return (
    <div
      ref={pickerRef}
      className="absolute right-0 top-12 z-50 w-72 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col space-y-3 animate-in fade-in zoom-in-95 duration-150 select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 font-mono flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-pink-500" />
          <span>Modern Color Matrix</span>
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2D Saturation / Value Gradient Board */}
      <div
        ref={satValRef}
        onMouseDown={(e) => {
          isDraggingSatVal.current = true;
          handleSatValMove(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          isDraggingSatVal.current = true;
          if (e.touches[0]) handleSatValMove(e.touches[0].clientX, e.touches[0].clientY);
        }}
        className="relative w-full h-36 rounded-xl cursor-crosshair overflow-hidden shadow-inner border border-black/10 dark:border-white/10"
        style={{
          backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
        }}
      >
        {/* White horizontal gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
        {/* Black vertical gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

        {/* Reticle indicator thumb */}
        <div
          className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_8px_rgba(0,0,0,0.6)] pointer-events-none transition-transform"
          style={{
            left: `${hsv.s * 100}%`,
            top: `${(1 - hsv.v) * 100}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {/* Rainbow Hue Slider */}
      <div className="space-y-1">
        <div className="relative flex items-center">
          <input
            type="range"
            min="0"
            max="360"
            value={hsv.h}
            onChange={(e) => {
              const newHue = Number(e.target.value);
              updateHsv({ ...hsv, h: newHue });
            }}
            className="w-full h-3 rounded-full appearance-none cursor-pointer outline-none shadow-inner"
            style={{
              background:
                'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
            }}
          />
        </div>
      </div>

      {/* Control row: Swatch comparison, Eyedropper, Hex & RGB values */}
      <div className="flex items-center space-x-2 pt-1">
        {/* Side-by-side color comparison swatch */}
        <div className="flex items-center space-x-1 shrink-0">
          <div
            className="w-7 h-7 rounded-lg border border-black/15 dark:border-white/15 shadow-sm"
            style={{ backgroundColor: color }}
            title={`Active: ${color}`}
          />
          <button
            onClick={() => {
              onChange(initialColor);
              setHexInput(initialColor);
              setHsv(hexToHsv(initialColor));
            }}
            className="w-7 h-7 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            title={`Revert to: ${initialColor}`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Eyedropper pipette button */}
        <button
          onClick={handleEyeDropper}
          className="p-1.5 rounded-lg text-slate-500 hover:text-sky-500 dark:text-slate-400 dark:hover:text-sky-400 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
          title="Pick color from screen (Eyedropper)"
        >
          <Pipette className="w-3.5 h-3.5" />
        </button>

        {/* Hex Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={hexInput}
            onChange={(e) => handleManualHexInput(e.target.value)}
            maxLength={7}
            placeholder="#HEX"
            className="w-full px-2 py-1 text-xs font-mono font-bold rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-400 uppercase text-center"
          />
        </div>

        {/* Copy Hex Button */}
        <button
          onClick={handleCopyHex}
          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
          title="Copy Hex"
        >
          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* RGB Breakdown Display */}
      <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-center">
        <div className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
          <span className="text-slate-400">R:</span> {rVal}
        </div>
        <div className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
          <span className="text-slate-400">G:</span> {gVal}
        </div>
        <div className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
          <span className="text-slate-400">B:</span> {bVal}
        </div>
      </div>

      {/* Quick Swatches Grid */}
      <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
          QUICK AESTHETIC TONES:
        </span>
        <div className="grid grid-cols-5 gap-1.5 pt-0.5">
          {QUICK_SWATCHES.map((swatch, idx) => (
            <button
              key={idx}
              onClick={() => {
                onChange(swatch);
                setHexInput(swatch);
                setHsv(hexToHsv(swatch));
              }}
              className="w-full h-5 rounded-md border border-black/10 dark:border-white/10 shadow-sm hover:scale-110 transition-transform cursor-pointer"
              style={{ backgroundColor: swatch }}
              title={swatch}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
