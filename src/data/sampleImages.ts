import type { SampleImage } from '../types';

// Embedded vector artwork ensuring 100% offline instant availability without network/CORS issues
const createMoeHeroineSvgDataUri = (): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e1b4b" />
        <stop offset="40%" stop-color="#312e81" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>
      <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#e2e8f0" />
        <stop offset="50%" stop-color="#94a3b8" />
        <stop offset="100%" stop-color="#475569" />
      </linearGradient>
      <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#fff5f5" />
        <stop offset="100%" stop-color="#fed7aa" />
      </linearGradient>
      <linearGradient id="haloGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="50%" stop-color="#818cf8" />
        <stop offset="100%" stop-color="#c084fc" />
      </linearGradient>
      <linearGradient id="coatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b" />
        <stop offset="100%" stop-color="#090d16" />
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="800" height="1000" fill="url(#bgGrad)"/>
    
    <!-- Cyber Geometric Accents -->
    <circle cx="400" cy="500" r="320" fill="none" stroke="#6366f1" stroke-width="2" stroke-dasharray="12 12" opacity="0.4"/>
    <circle cx="400" cy="500" r="280" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.3"/>
    <path d="M 100 200 L 700 200 M 100 800 L 700 800" stroke="#a855f7" stroke-width="1" opacity="0.2"/>
    
    <!-- Floating Tech Halo (Yostar / Blue Archive style) -->
    <g transform="translate(400, 160)">
      <ellipse cx="0" cy="0" rx="160" ry="40" fill="none" stroke="url(#haloGrad)" stroke-width="8"/>
      <ellipse cx="0" cy="0" rx="140" ry="32" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8"/>
      <!-- Halo geometric wings -->
      <polygon points="0,-48 18,-38 0,-28 -18,-38" fill="#38bdf8"/>
      <polygon points="160,0 176,-10 176,10" fill="#c084fc"/>
      <polygon points="-160,0 -176,-10 -176,10" fill="#38bdf8"/>
    </g>

    <!-- Character Body & Uniform -->
    <!-- Shoulders / Tactical Coat -->
    <path d="M 220 700 Q 180 820 120 1000 L 680 1000 Q 620 820 580 700 Z" fill="url(#coatGrad)"/>
    <!-- Coat Lapels -->
    <path d="M 220 700 L 320 840 L 400 780 L 480 840 L 580 700 L 500 680 L 400 740 L 300 680 Z" fill="#334155" stroke="#475569" stroke-width="3"/>
    <!-- Tie / Ribbon -->
    <polygon points="380,720 420,720 440,880 400,940 360,880" fill="#e11d48"/>
    <circle cx="400" cy="725" r="14" fill="#fbbf24"/>

    <!-- Hair - Back flow -->
    <path d="M 240 380 C 140 500 120 750 160 920 C 220 820 280 650 300 550 Z" fill="url(#hairGrad)"/>
    <path d="M 560 380 C 660 500 680 750 640 920 C 580 820 520 650 500 550 Z" fill="url(#hairGrad)"/>

    <!-- Neck & Face -->
    <path d="M 360 560 L 360 690 Q 400 710 440 690 L 440 560 Z" fill="#fecdd3"/>
    <!-- Face Contour -->
    <path d="M 270 380 Q 260 530 400 620 Q 540 530 530 380 Q 400 320 270 380 Z" fill="url(#skinGrad)"/>

    <!-- Soft Cheek Blush -->
    <ellipse cx="320" cy="505" rx="28" ry="14" fill="#fb7185" opacity="0.35"/>
    <ellipse cx="480" cy="505" rx="28" ry="14" fill="#fb7185" opacity="0.35"/>

    <!-- Anime Eyes -->
    <!-- Left Eye -->
    <g transform="translate(325, 450)">
      <ellipse cx="0" cy="0" rx="34" ry="46" fill="#0f172a"/>
      <ellipse cx="0" cy="8" rx="28" ry="34" fill="#0284c7"/>
      <ellipse cx="0" cy="18" rx="20" ry="20" fill="#38bdf8"/>
      <!-- Pupil & Highlights -->
      <circle cx="-8" cy="-12" r="10" fill="#ffffff"/>
      <circle cx="8" cy="12" r="5" fill="#ffffff" opacity="0.8"/>
      <!-- Eyelash / Liner -->
      <path d="M -42 -22 Q 0 -44 42 -22" fill="none" stroke="#0f172a" stroke-width="7" stroke-linecap="round"/>
      <path d="M 26 -28 L 46 -38" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
    </g>

    <!-- Right Eye -->
    <g transform="translate(475, 450)">
      <ellipse cx="0" cy="0" rx="34" ry="46" fill="#0f172a"/>
      <ellipse cx="0" cy="8" rx="28" ry="34" fill="#0284c7"/>
      <ellipse cx="0" cy="18" rx="20" ry="20" fill="#38bdf8"/>
      <!-- Pupil & Highlights -->
      <circle cx="-8" cy="-12" r="10" fill="#ffffff"/>
      <circle cx="8" cy="12" r="5" fill="#ffffff" opacity="0.8"/>
      <!-- Eyelash / Liner -->
      <path d="M -42 -22 Q 0 -44 42 -22" fill="none" stroke="#0f172a" stroke-width="7" stroke-linecap="round"/>
      <path d="M 26 -28 L 46 -38" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
    </g>

    <!-- Nose & Cute Smile -->
    <circle cx="400" cy="515" r="3" fill="#fda4af"/>
    <path d="M 385 550 Q 400 564 415 550" fill="none" stroke="#e11d48" stroke-width="3.5" stroke-linecap="round"/>

    <!-- Front Bangs & Side Locks -->
    <path d="M 250 360 Q 220 480 250 560 Q 280 470 290 380 Z" fill="url(#hairGrad)"/>
    <path d="M 550 360 Q 580 480 550 560 Q 520 470 510 380 Z" fill="url(#hairGrad)"/>
    <path d="M 270 350 Q 340 460 370 410 Q 320 340 270 350 Z" fill="url(#hairGrad)"/>
    <path d="M 360 340 Q 400 450 430 380 Q 410 330 360 340 Z" fill="url(#hairGrad)"/>
    <path d="M 420 340 Q 470 460 520 360 Q 460 330 420 340 Z" fill="url(#hairGrad)"/>
    <path d="M 310 310 Q 400 240 490 310 Q 560 380 560 440 Q 400 300 240 440 Z" fill="#cbd5e1" opacity="0.4"/>

    <!-- Tech Headset / Ear Gear -->
    <g transform="translate(230, 430)">
      <rect x="-15" y="-35" width="30" height="70" rx="12" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>
      <circle cx="0" cy="0" r="8" fill="#38bdf8"/>
    </g>
    <g transform="translate(570, 430)">
      <rect x="-15" y="-35" width="30" height="70" rx="12" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>
      <circle cx="0" cy="0" r="8" fill="#38bdf8"/>
    </g>

    <!-- Foreground Light Dust / Sparkles -->
    <circle cx="220" cy="240" r="4" fill="#ffffff" opacity="0.8"/>
    <circle cx="620" cy="280" r="3" fill="#38bdf8" opacity="0.9"/>
    <circle cx="580" cy="620" r="5" fill="#f472b6" opacity="0.7"/>
    <circle cx="180" cy="680" r="3" fill="#ffffff" opacity="0.6"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'heroine-kivotos',
    title: 'Kivotos Tactical Heroine',
    subtitle: 'Anime-tech character vector illustration (Built-in)',
    url: createMoeHeroineSvgDataUri(),
  },
  {
    id: 'cyber-tokyo',
    title: 'Cyberpunk Tokyo Night',
    subtitle: 'Vibrant neon street nightscape',
    url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'aesthetic-portrait',
    title: 'Studio Portrait Glow',
    subtitle: 'High dynamic range expressive portrait',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'cherry-blossom-cat',
    title: 'Sakura Shrine & Spirit',
    subtitle: 'Atmospheric spring scenery and soft lighting',
    url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1000&q=80',
  }
];

export const DEFAULT_IMAGE = SAMPLE_IMAGES[0].url;
