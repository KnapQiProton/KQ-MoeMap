import type { GradientStop, ImageAdjustments, PostProcessingEffects } from '../types';
import {
  calculateTableValues,
  calculateLinearAdjustments,
  DEFAULT_ADJUSTMENTS,
  DEFAULT_POST_PROCESSING,
} from '../utils/svgEngine';

interface SvgFilterDefinitionProps {
  filterId?: string;
  stops: GradientStop[];
  adjustments?: ImageAdjustments;
  postProcessing?: PostProcessingEffects;
}

export const SvgFilterDefinition = ({
  filterId = 'kq-moemap-filter',
  stops,
  adjustments = DEFAULT_ADJUSTMENTS,
  postProcessing = DEFAULT_POST_PROCESSING,
}: SvgFilterDefinitionProps) => {
  const { rTable, gTable, bTable } = calculateTableValues(stops, 64);
  const { slope, intercept } = calculateLinearAdjustments(adjustments.brightness, adjustments.contrast);
  const gamma = Number(adjustments.gamma.toFixed(4));

  const glitchInput = postProcessing.enableBloom ? 'bloomed' : 'colorMapped';

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
        {/* Core SVG Gradient Map Filter with Pre- & Post-Processing */}
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

          {/* Route alpha luminance into RGB channels */}
          <feColorMatrix
            in="lumAlpha"
            type="matrix"
            values="0 0 0 1 0
                    0 0 0 1 0
                    0 0 0 1 0
                    0 0 0 0 1"
            result="lumRGB"
          />

          {/* Step 2: Component transfer mapping through dynamic RGB table values */}
          <feComponentTransfer in="lumRGB" result="colorMapped">
            <feFuncR type="table" tableValues={rTable} />
            <feFuncG type="table" tableValues={gTable} />
            <feFuncB type="table" tableValues={bTable} />
            <feFuncA type="table" tableValues="1 1" />
          </feComponentTransfer>

          {/* Step 3: Bloom / Glow (Optional) */}
          {postProcessing.enableBloom && (
            <>
              <feGaussianBlur
                in="colorMapped"
                stdDeviation={postProcessing.bloomIntensity}
                result="blurred"
              />
              <feMerge result="bloomed">
                <feMergeNode in="blurred" />
                <feMergeNode in="colorMapped" />
              </feMerge>
            </>
          )}

          {/* Step 4: Tactical Glitch Displacement (Optional) */}
          {postProcessing.enableGlitch && (
            <>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.01 0.05"
                numOctaves={1}
                result="noise"
              />
              <feDisplacementMap
                in={glitchInput}
                in2="noise"
                scale={postProcessing.glitchIntensity * 5}
                xChannelSelector="R"
                yChannelSelector="G"
                result="finalOutput"
              />
            </>
          )}
        </filter>
      </defs>
    </svg>
  );
};
