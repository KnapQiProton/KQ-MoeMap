import type { GradientStop, ImageAdjustments } from '../types';

export interface RgbColor {
  r: number; // 0 to 1
  g: number; // 0 to 1
  b: number; // 0 to 1
}

export interface TableValuesResult {
  rTable: string;
  gTable: string;
  bTable: string;
  samples: RgbColor[];
}

export const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 1,
  contrast: 1,
  gamma: 1,
};

/**
 * Calculates linear adjustments (brightness & contrast) for SVG feFunc linear type.
 * Contrast formula: slope=contrast, intercept=-(0.5*contrast)+0.5
 * Brightness formula: shifts intercept by (brightness - 1)
 */
export function calculateLinearAdjustments(
  brightness: number,
  contrast: number
): { slope: number; intercept: number } {
  const slope = Number(contrast.toFixed(4));
  const intercept = Number((-(0.5 * contrast) + 0.5 + (brightness - 1)).toFixed(4));
  return { slope, intercept };
}

/**
 * Converts a hex color string (#RGB or #RRGGBB) to normalized RGB fractions (0 to 1).
 */
export function hexToRgb(hex: string): RgbColor {
  let clean = hex.replace(/^#/, '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length !== 6) {
    return { r: 0.5, g: 0.5, b: 0.5 };
  }
  const val = parseInt(clean, 16);
  if (isNaN(val)) {
    return { r: 0.5, g: 0.5, b: 0.5 };
  }
  return {
    r: ((val >> 16) & 255) / 255,
    g: ((val >> 8) & 255) / 255,
    b: (val & 255) / 255,
  };
}

/**
 * Converts normalized RGB fractions (0 to 1) to Hex format (#RRGGBB).
 */
export function rgbToHex(rgb: RgbColor): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n * 255)));
    return clamped.toString(16).padStart(2, '0').toUpperCase();
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Formats a normalized number to a clean decimal string for SVG table values.
 */
function formatNumber(n: number): string {
  return Number(Math.max(0, Math.min(1, n)).toFixed(4)).toString();
}

/**
 * Evaluates the gradient color at offset t (0 to 1) based on active stops.
 */
export function sampleGradientAt(t: number, stops: GradientStop[]): RgbColor {
  if (stops.length === 0) return { r: 0, g: 0, b: 0 };
  if (stops.length === 1) return hexToRgb(stops[0].color);

  // Sort stops by offset
  const sorted = [...stops].sort((a, b) => a.offset - b.offset);

  // Clamp boundaries
  if (t <= sorted[0].offset) {
    return hexToRgb(sorted[0].color);
  }
  if (t >= sorted[sorted.length - 1].offset) {
    return hexToRgb(sorted[sorted.length - 1].color);
  }

  // Find surrounding stops
  for (let i = 0; i < sorted.length - 1; i++) {
    const s1 = sorted[i];
    const s2 = sorted[i + 1];
    if (t >= s1.offset && t <= s2.offset) {
      const span = s2.offset - s1.offset;
      const frac = span === 0 ? 0 : (t - s1.offset) / span;
      const c1 = hexToRgb(s1.color);
      const c2 = hexToRgb(s2.color);
      return {
        r: c1.r + (c2.r - c1.r) * frac,
        g: c1.g + (c2.g - c1.g) * frac,
        b: c1.b + (c2.b - c1.b) * frac,
      };
    }
  }

  return hexToRgb(sorted[sorted.length - 1].color);
}

/**
 * Calculates feComponentTransfer tableValues mathematically from active gradient color stops.
 * Uses 64 equidistant sample points to accurately represent arbitrary multi-stop positions.
 */
export function calculateTableValues(stops: GradientStop[], sampleCount = 64): TableValuesResult {
  const samples: RgbColor[] = [];
  const rList: string[] = [];
  const gList: string[] = [];
  const bList: string[] = [];

  for (let i = 0; i < sampleCount; i++) {
    const t = i / (sampleCount - 1);
    const color = sampleGradientAt(t, stops);
    samples.push(color);
    rList.push(formatNumber(color.r));
    gList.push(formatNumber(color.g));
    bList.push(formatNumber(color.b));
  }

  return {
    rTable: rList.join(' '),
    gTable: gList.join(' '),
    bTable: bList.join(' '),
    samples,
  };
}

/**
 * Generates the complete, standalone SVG filter markup string.
 */
export function generateSvgFilterCode(
  filterId = 'kq-moemap-filter',
  stops: GradientStop[],
  adjustments: ImageAdjustments = DEFAULT_ADJUSTMENTS
): string {
  const { rTable, gTable, bTable } = calculateTableValues(stops, 64);
  const { slope, intercept } = calculateLinearAdjustments(adjustments.brightness, adjustments.contrast);
  const gamma = Number(adjustments.gamma.toFixed(4));

  return `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <defs>
    <!-- KQ-MoeMap Smart SVG Gradient Map Filter with Pre-processing Adjustments -->
    <filter id="${filterId}" color-interpolation-filters="sRGB">
      <!-- Step 0a: Linear Adjustments (Brightness & Contrast) -->
      <feComponentTransfer in="SourceGraphic" result="linearAdjusted">
        <feFuncR type="linear" slope="${slope}" intercept="${intercept}" />
        <feFuncG type="linear" slope="${slope}" intercept="${intercept}" />
        <feFuncB type="linear" slope="${slope}" intercept="${intercept}" />
      </feComponentTransfer>

      <!-- Step 0b: Gamma Adjustment -->
      <feComponentTransfer in="linearAdjusted" result="adjustedImage">
        <feFuncR type="gamma" amplitude="1" exponent="${gamma}" offset="0" />
        <feFuncG type="gamma" amplitude="1" exponent="${gamma}" offset="0" />
        <feFuncB type="gamma" amplitude="1" exponent="${gamma}" offset="0" />
      </feComponentTransfer>

      <!-- Step 1: Convert adjusted image luminance to alpha map -->
      <feColorMatrix in="adjustedImage" type="luminanceToAlpha" result="lumAlpha" />

      <!-- Route alpha luminance into RGB channels -->
      <feColorMatrix in="lumAlpha" type="matrix" 
        values="0 0 0 1 0
                0 0 0 1 0
                0 0 0 1 0
                0 0 0 0 1" result="lumRGB" />

      <!-- Step 2: Component transfer mapping through dynamic RGB table values -->
      <feComponentTransfer in="lumRGB" result="moeMapped">
        <feFuncR type="table" tableValues="${rTable}" />
        <feFuncG type="table" tableValues="${gTable}" />
        <feFuncB type="table" tableValues="${bTable}" />
        <feFuncA type="table" tableValues="1 1" />
      </feComponentTransfer>
    </filter>
  </defs>
</svg>`;
}

/**
 * Generates ready-to-use CSS rules.
 */
export function generateCssCode(filterId = 'kq-moemap-filter'): string {
  return `/* Apply KQ-MoeMap SVG Gradient Map */
.kq-moemap-active {
  filter: url(#${filterId});
}

/* Inline CSS property */
filter: url(#${filterId});`;
}

/**
 * Converts stops to a CSS linear-gradient string for UI representation.
 */
export function stopsToCssGradient(stops: GradientStop[]): string {
  const sorted = [...stops].sort((a, b) => a.offset - b.offset);
  const parts = sorted.map(s => `${s.color} ${(s.offset * 100).toFixed(1)}%`);
  return `linear-gradient(to right, ${parts.join(', ')})`;
}

/**
 * Applies the gradient map directly to an HTMLCanvasElement using pixel math.
 * Applies pre-processing adjustments (brightness, contrast, gamma) before Rec. 709 luminance conversion.
 * Guarantees 100% faithful and high-resolution export without browser SVG canvas quirks.
 */
export async function renderGradientMapToCanvas(
  imgElement: HTMLImageElement,
  stops: GradientStop[],
  targetCanvas: HTMLCanvasElement,
  adjustments: ImageAdjustments = DEFAULT_ADJUSTMENTS
): Promise<void> {
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2d context');

  const width = imgElement.naturalWidth || imgElement.width || 800;
  const height = imgElement.naturalHeight || imgElement.height || 600;

  targetCanvas.width = width;
  targetCanvas.height = height;

  // Draw source image
  ctx.drawImage(imgElement, 0, 0, width, height);

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Build 256-entry lookup table for gradient mapping
  const lutR = new Uint8ClampedArray(256);
  const lutG = new Uint8ClampedArray(256);
  const lutB = new Uint8ClampedArray(256);

  for (let L = 0; L < 256; L++) {
    const t = L / 255;
    const sampled = sampleGradientAt(t, stops);
    lutR[L] = Math.round(sampled.r * 255);
    lutG[L] = Math.round(sampled.g * 255);
    lutB[L] = Math.round(sampled.b * 255);
  }

  // Pre-calculate 256-entry lookup table for pre-processing adjustments:
  // Linear (brightness & contrast): clamp(norm * slope + intercept, 0, 1)
  // Gamma: clamp(linear ^ gamma, 0, 1)
  const { slope, intercept } = calculateLinearAdjustments(adjustments.brightness, adjustments.contrast);
  const gamma = adjustments.gamma;

  const adjustLut = new Float32Array(256);
  for (let v = 0; v < 256; v++) {
    const norm = v / 255;
    const lin = Math.max(0, Math.min(1, norm * slope + intercept));
    adjustLut[v] = Math.max(0, Math.min(1, Math.pow(lin, gamma)));
  }

  // Rec. 709 luminance weights matching SVG luminanceToAlpha
  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    const rAdj = adjustLut[data[i]];
    const gAdj = adjustLut[data[i + 1]];
    const bAdj = adjustLut[data[i + 2]];
    const lum = Math.round((0.2126 * rAdj + 0.7152 * gAdj + 0.0722 * bAdj) * 255);
    const clampedLum = Math.max(0, Math.min(255, lum));

    data[i] = lutR[clampedLum];
    data[i + 1] = lutG[clampedLum];
    data[i + 2] = lutB[clampedLum];
    // Keep alpha opaque or preserved
    if (data[i + 3] === 0) {
      data[i + 3] = 0;
    } else {
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}
