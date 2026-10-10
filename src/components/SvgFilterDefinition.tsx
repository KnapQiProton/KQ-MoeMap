import type { GradientStop } from '../types';
import { calculateTableValues } from '../utils/svgEngine';

interface SvgFilterDefinitionProps {
  filterId?: string;
  stops: GradientStop[];
}

export const SvgFilterDefinition = ({
  filterId = 'kq-moemap-filter',
  stops,
}: SvgFilterDefinitionProps) => {
  const { rTable, gTable, bTable } = calculateTableValues(stops, 64);

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
        {/* Core SVG Gradient Map Filter */}
        <filter id={filterId} colorInterpolationFilters="sRGB">
          {/* Step 1: Convert image luminance to an alpha map */}
          <feColorMatrix type="luminanceToAlpha" result="lumAlpha" />

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
