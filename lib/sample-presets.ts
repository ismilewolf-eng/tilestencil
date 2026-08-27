import type { Locale } from "@/lib/locale";
import type { PageOrientation, PaperSize } from "@/lib/geometry";
import type { RenderMode } from "@/lib/pdf-export";

export type SamplePreset = {
  id: "poster" | "pattern" | "banner";
  label: { zh: string; en: string };
  widthCm: number;
  heightCm: number;
  paperSize: PaperSize;
  orientation: PageOrientation;
  renderMode: RenderMode;
  image: {
    name: string;
    widthPx: number;
    heightPx: number;
    dataUrl: string;
  };
};

function createSvgDataUrl(svgString: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString.trim())}`;
}

const posterSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="800" height="1200">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="50%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="sun" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f97316" />
      <stop offset="100%" stop-color="#e11d48" />
    </linearGradient>
  </defs>
  <rect width="800" height="1200" fill="url(#bg)" />
  <circle cx="400" cy="500" r="220" fill="url(#sun)" />
  <path d="M0 780 L220 540 L440 760 L620 600 L800 780 L800 1200 L0 1200 Z" fill="#0f172a" opacity="0.9" />
  <path d="M0 880 L180 720 L380 900 L560 740 L800 960 L800 1200 L0 1200 Z" fill="#1e1b4b" opacity="0.95" />
  <path d="M0 980 L280 820 L520 1000 L800 840 L800 1200 L0 1200 Z" fill="#090d16" />
  <text x="400" y="240" font-family="system-ui, sans-serif" font-size="52" font-weight="800" fill="#f8fafc" text-anchor="middle" letter-spacing="6">HORIZON POSTER</text>
  <text x="400" y="290" font-family="system-ui, sans-serif" font-size="20" fill="#94a3b8" text-anchor="middle" letter-spacing="3">TILESTENCIL PRINT SAMPLE · 40 × 60 CM</text>
  <circle cx="200" cy="360" r="2" fill="#fff" opacity="0.8"/>
  <circle cx="620" cy="320" r="3" fill="#fff" opacity="0.6"/>
  <circle cx="280" cy="200" r="2" fill="#fff" opacity="0.7"/>
  <circle cx="550" cy="220" r="2.5" fill="#fff" opacity="0.9"/>
</svg>`;

const patternSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600">
  <rect width="900" height="600" fill="#ffffff" stroke="#cbd5e1" stroke-width="4" />
  <defs>
    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#f1f5f9" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="900" height="600" fill="url(#grid)" />
  <!-- Blueprint outline -->
  <rect x="100" y="80" width="700" height="440" rx="30" fill="none" stroke="#0f172a" stroke-width="6" stroke-dasharray="16,8" />
  <circle cx="200" cy="200" r="50" fill="none" stroke="#0f172a" stroke-width="5" />
  <circle cx="700" cy="200" r="50" fill="none" stroke="#0f172a" stroke-width="5" />
  <path d="M 280 360 C 380 440, 520 440, 620 360" fill="none" stroke="#0f172a" stroke-width="8" stroke-linecap="round" />
  <!-- Dimension indicators -->
  <line x1="100" y1="50" x2="800" y2="50" stroke="#2563eb" stroke-width="2" marker-start="url(#dot)" marker-end="url(#dot)" />
  <text x="450" y="42" font-family="ui-monospace, monospace" font-size="18" font-weight="700" fill="#2563eb" text-anchor="middle">30.0 cm (1:1 TRUE SCALE)</text>
  <line x1="60" y1="80" x2="60" y2="520" stroke="#2563eb" stroke-width="2" />
  <text x="50" y="300" font-family="ui-monospace, monospace" font-size="18" font-weight="700" fill="#2563eb" text-anchor="middle" transform="rotate(-90 50 300)">20.0 cm</text>
  <!-- Calibration square -->
  <rect x="400" y="160" width="100" height="100" fill="#e2e8f0" stroke="#0f172a" stroke-width="2" />
  <text x="450" y="215" font-family="ui-monospace, monospace" font-size="13" font-weight="600" fill="#0f172a" text-anchor="middle">50 mm TEST</text>
</svg>`;

const bannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 400" width="1600" height="400">
  <defs>
    <linearGradient id="bannerBg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ec4899" />
      <stop offset="50%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
  </defs>
  <rect width="1600" height="400" fill="url(#bannerBg)" />
  <rect x="20" y="20" width="1560" height="360" fill="none" stroke="#ffffff" stroke-width="6" stroke-dasharray="12,12" opacity="0.7"/>
  <text x="800" y="230" font-family="system-ui, sans-serif" font-size="120" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="12">HAPPY BIRTHDAY</text>
  <text x="800" y="310" font-family="system-ui, sans-serif" font-size="28" font-weight="600" fill="#f8fafc" text-anchor="middle" letter-spacing="6">★ 120 CM EVENT BANNER · A4 TILED PRINT ★</text>
</svg>`;

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: "poster",
    label: { zh: "🎨 艺术海报 (40×60cm)", en: "🎨 Art Poster (40×60cm)" },
    widthCm: 40,
    heightCm: 60,
    paperSize: "a4",
    orientation: "portrait",
    renderMode: "original",
    image: {
      name: "sample-horizon-poster.png",
      widthPx: 800,
      heightPx: 1200,
      dataUrl: createSvgDataUrl(posterSvg),
    },
  },
  {
    id: "pattern",
    label: { zh: "📐 手作纸格 (30×20cm)", en: "📐 Craft Pattern (30×20cm)" },
    widthCm: 30,
    heightCm: 20,
    paperSize: "a4",
    orientation: "landscape",
    renderMode: "template",
    image: {
      name: "sample-blueprint-pattern.png",
      widthPx: 900,
      heightPx: 600,
      dataUrl: createSvgDataUrl(patternSvg),
    },
  },
  {
    id: "banner",
    label: { zh: "🏷️ 派对横幅 (120×30cm)", en: "🏷️ Party Banner (120×30cm)" },
    widthCm: 120,
    heightCm: 30,
    paperSize: "a4",
    orientation: "landscape",
    renderMode: "original",
    image: {
      name: "sample-party-banner.png",
      widthPx: 1600,
      heightPx: 400,
      dataUrl: createSvgDataUrl(bannerSvg),
    },
  },
];
