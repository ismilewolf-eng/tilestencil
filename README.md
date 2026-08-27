# TileStencil 🎨✂️

> **Free, browser-local image tiling and multi-page poster printer.** Turn any JPG or PNG into an accurately sized, assemble-ready multi-page PDF for standard A4, A3, or US Letter paper — at 100% actual physical size with zero cloud uploads.

[![Live Web App](https://img.shields.io/badge/Live%20App-tilestencil.com-orange?style=for-the-badge&logo=google-chrome&logoColor=white)](https://tilestencil.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Client Side](https://img.shields.io/badge/Privacy-100%25%20Client--Side-brightgreen?style=for-the-badge)](https://tilestencil.com/privacy)

🌐 **Live Website**: [https://tilestencil.com](https://tilestencil.com)  
🇨🇳 **中文版**: [https://tilestencil.com/zh](https://tilestencil.com/zh)

---

## 🌟 Overview

**TileStencil** is built for makers, crafters, educators, woodworkers, and artists who need to output large-scale designs using standard home or office desktop printers. 

Unlike traditional poster tools that force halftone rasterization (like The Rasterbator) or compress artwork, TileStencil preserves original pixel clarity and enforces **exact physical dimensions (in centimeters or inches)** using millimeter-level geometric slicing and jsPDF vector export.

---

## ✨ Key Features

- 🔒 **100% In-Browser Privacy**: Images are read into client-side memory using the HTML5 FileReader & Canvas APIs. Zero image data, filenames, or dimensions are ever sent to a server.
- 📏 **True 1:1 Physical Scale**: Specify target output width and height in `cm` or `in`. Enforces 100% Actual Size printing without distortion.
- 📄 **Standard Paper & Orientations**: Supports **A4** (210×297mm), **A3** (297×420mm), and **US Letter** (8.5×11in) in both Portrait and Landscape orientations.
- 📐 **Overlap & Margin Control**: Configurable printable margins (min 5mm) and tile overlap strips (e.g. 5–10mm) for seamless seam joining.
- 🎯 **Assembly Marks & Coordinate Tags**: Every sheet includes corner crosshair registration marks, grid labels (e.g., `A1`, `A2`, `B1`), page counters, and adjacent overlap indicators.
- 🎨 **3 Render Modes**:
  - **Original**: Full-color high-resolution tiling for posters and photos.
  - **Grayscale**: Clean monochrome rendering to conserve ink.
  - **Black & White Template**: High-contrast outline filter optimized for wood routing, mural transfers, and stencil cutting.
- 🚀 **One-Click Sample Presets**: Instant testing with built-in presets (Art Poster, Blueprint Pattern, Event Banner).

---

## 📐 Geometric Tiling Algorithm

TileStencil uses a deterministic millimeter calculation to eliminate floating-point edge distortion and scaling bugs:

```text
 ┌─────────────────────────────────────────────────────────────┐
 │                      Target Artwork                         │
 │                                                             │
 │   ┌───────────────┬─┬───────────────┬─┬────────────────┐    │
 │   │   Tile A1     │O│   Tile A2     │O│    Tile A3     │    │
 │   │               │v│               │v│   (Remaining   │    │
 │   │               │e│               │e│    Width)      │    │
 │   ├───────────────┼─┼───────────────┼─┼────────────────┤    │
 │   │  Overlap (O)  │ │               │ │                │    │
 │   ├───────────────┼─┼───────────────┼─┼────────────────┤    │
 │   │   Tile B1     │ │   Tile B2     │ │    Tile B3     │    │
 │   │ (Remaining H) │ │               │ │  (Corner Edge) │    │
 │   └───────────────┴─┴───────────────┴─┴────────────────┘    │
 └─────────────────────────────────────────────────────────────┘
```

- **Printable Area**: `PrintableWidth = SheetWidth - (2 × Margin)`
- **Tile Stride**: `StrideX = PrintableWidth - Overlap`
- **Grid Columns**: `Columns = ceil((TargetWidth - Overlap) / StrideX)`
- **Edge Tile Handling**: The final row and column maintain the exact remaining physical crop to prevent stretching, while leaving unused paper margins blank for easy cutting.

---

## 🛠️ Specialized Project Guides

Explore detailed step-by-step guides and tips on the live site:

| Project Type | Guide Link | Focus |
|---|---|---|
| **Tiled Poster Printing** | [Poster Guide](https://tilestencil.com/print-image-on-multiple-pages) | Large photo wall art from standard A4/A3 pages |
| **Mural & Tracing Stencils** | [Stencil Guide](https://tilestencil.com/print-large-stencil) | High-contrast B&W transfers for walls and canvas |
| **1:1 Craft & Leather Patterns** | [Pattern Guide](https://tilestencil.com/print-pattern-actual-size) | Exact scale templates for leathercraft and Cosplay |
| **Large Event Banners** | [Banner Guide](https://tilestencil.com/print-banner-letters) | Horizontal multi-meter slogans and party garlands |
| **Stained Glass & Mosaics** | [Stained Glass Guide](https://tilestencil.com/print-stained-glass-patterns) | Precision line art for foil and came assembly |
| **Scroll Saw Woodworking** | [Scroll Saw Guide](https://tilestencil.com/print-scroll-saw-patterns) | Spray-mount full-scale templates for cutting |

---

## 💻 Local Development

### Prerequisites

- Node.js 18.18+ or 20+
- npm or pnpm

### Quickstart

```bash
# 1. Clone the repository
git clone https://github.com/ismilewolf-eng/tilestencil.git
cd tilestencil

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
# -> Open http://localhost:3000 in your browser

# 4. Run automated test suite
npm run test

# 5. Build static production bundle
npm run build
```

---

## 🏗️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Static Export)
- **UI Library**: [React 19](https://react.dev/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) (Millimeter-precise vector rendering)
- **Testing**: [Vitest](https://vitest.dev/) (Unit, Geometry, Markup & SEO assertions)
- **Styling**: Modern CSS variables, warm paper aesthetic, responsive mobile-first grid
- **Hosting**: [Cloudflare Pages](https://pages.cloudflare.com/) (Edge CDN, Zero Server Cost)

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<p align="center">
  Built with ❤️ for makers and creators worldwide · <a href="https://tilestencil.com">tilestencil.com</a>
</p>
