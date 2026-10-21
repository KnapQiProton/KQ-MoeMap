import type { GradientStop, ImageAdjustments } from '../types';
import { calculateTableValues, calculateLinearAdjustments, DEFAULT_ADJUSTMENTS } from '../utils/svgEngine';

interface SvgFilterDefinitionProps {
  filterId?: string;
  stops: GradientStop[];
  adjustments?: ImageAdjustments;
}

export const SvgFilterDefinition = ({
  filterId = 'kq-moemap-filter',
  stops,
  adjustments = DEFAULT_ADJUSTMENTS,
}: SvgFilterDefinitionProps) => {
  const { rTable, gTable, bTable } = calculateTableValues(stops, 64);
  const { slope, intercept } = calculateLinearAdjustments(adjustments.brightness, adjustments.contrast);
  const gamma = Number(adjustments.gamma.toFixed(4));

  return (
    <svg
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: 0,
        height: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <defs>
        {/* Core SVG Gradient Map Filter with Pre-processing Adjustments */}
        <filter id={filterId} colorInterpolationFilters="sRGB">
          {/* Step 0a: Linear adjustments (Brightness & Contrast) */}
          <feComponentTransfer in="SourceGraphic" result="linearAdjusted">
            <feFuncR type="linear" slope={slope} intercept={intercept} />
            <feFuncG type="linear" slope={slope} intercept={intercept} />
            <feFuncB type="linear" slope={slope} intercept={intercept} />
          </feComponentTransfer>

          {/* Step 0b: Gamma adjustment */}
          <feComponentTransfer in="linearAdjusted" result="adjustedImage">
            <feFuncR type="gamma" amplitude={1} exponent={gamma} offset={0} />
            <feFuncG type="gamma" amplitude={1} exponent={gamma} offset={0} />
            <feFuncB type="gamma" amplitude={1} exponent={gamma} offset={0} />
          </feComponentTransfer>

          {/* Step 1: Convert adjusted image luminance to an alpha map */}
          <feColorMatrix in="adjustedImage" type="luminanceToAlpha" result="lumAlpha" />

          {/* Copy alpha luminance into RGB channels for component transfer */}
          <feColorMatrix
            in="lumAlpha"
            type="matrix"
            values="0 0 0 1 0
                    0 0 0 1 0
                    0 0 0 1 0
                    0 0 0 0 1"
            result="lumRGB"
          />

          {/* Step 2: feComponentTransfer with dynamic table values */}
          <feComponentTransfer in="lumRGB" result="colorMapped">
            <feFuncR type="table" tableValues={rTable} />
            <feFuncG type="table" tableValues={gTable} />
            <feFuncB type="table" tableValues={bTable} />
            <feFuncA type="table" tableValues="1 1" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
};
