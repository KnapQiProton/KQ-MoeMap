export interface GradientStop {
  id: string;
  color: string; // Hex string e.g. "#FF85A2"
  offset: number; // 0.0 to 1.0
}

export interface Palette {
  id: string;
  name: string;
  category: 'moe' | 'tech' | 'dark' | 'nature' | 'retro' | 'art';
  keywords: string[];
  stops: string[]; // Array of hex colors
  description?: string;
}

export interface SampleImage {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  thumb?: string;
}

export interface ImageAdjustments {
  brightness: number; // 0 to 2, default 1
  contrast: number;   // 0 to 2, default 1
  gamma: number;      // 0.1 to 3, default 1
}

export interface PostProcessingEffects {
  enableBloom: boolean;      // default false
  bloomIntensity: number;   // default 4, range 0 to 20
  enableGlitch: boolean;     // default false
  glitchIntensity: number;  // default 5, range 0 to 20
}

export type ExportFormat = 'png' | 'jpeg' | 'webp';
