# TileStencil design anchor

## 1. Visual theme and atmosphere

A precise, tactile print workshop: warm paper surfaces, ink-dark controls, restrained rust-orange accent. The interface feels dependable around irreversible print settings, never like a generic AI generator.

## 2. Colour roles

- Canvas: `#f6f1e8`
- Surface: `#fffdf8`
- Ink: `#22201b`
- Muted ink: `#686158`
- Rule: `#d9d0c1`
- Accent: `#a34f2b`
- Success: `#1f6a4b`
- Error: `#a1322b`

## 3. Typography

Use the local system CJK stack for all Chinese UI. Numeric dimensions and coordinates use a monospace fallback stack with tabular figures. Do not use italic text.

## 4. Component style

Controls are squared-soft (10px), high-contrast, clearly labeled, and have prominent keyboard focus rings. Cards are used only for task stages and output preview; settings are primarily grouped with rules and spacing.

**Payment box (SVG paywall), 2026-10-20.** Two rows of equal weight: PayPal's own gold button (PayPal-only: Pay Later, card and Venmo are switched off when Waffo is on) and one Waffo button cut to PayPal's geometry — 45px high, 4px corners, PayPal's card-button grey `#2c2e2f`, white single-colour marks for Apple Pay, Google Pay, WeChat Pay and card, then "Card or wallet" after a thin divider. One small muted line under both: "Payments by PayPal or Waffo". No "or" separator, no security slogans; card details never touch this site, so the box does not talk about them.

## 5. Layout principles

Desktop is a 2fr/1fr workbench: input/preview on the left and export summary on the right. Under 860px, it becomes one vertical workflow with the export action kept visible near the result.

## 6. Depth and elevation

Use thin paper-toned borders and one soft warm shadow for major surfaces. No glass, neon, gradients, or pure black.

## 7. Do and don't

Do make physical dimensions and paper state visible at all times. Do use direct language. Do make empty, error, processing, and success states recoverable. Do not add marketing sections, opaque progress copy, or decorative left-side selection bars.

## 8. Responsive behavior

Inputs use a single column on compact screens. The tile preview scrolls horizontally only within its own framed preview, never the page. Primary controls retain at least 44px touch targets.

## 9. Motion philosophy

Use only brief opacity/transform feedback (100–180ms) for buttons, status changes, and drag-over state. Respect `prefers-reduced-motion`; never use `transition: all`.

## Languages (2026-10-21)

- Chinese and English cover every page. Brazilian Portuguese (`/pt`) and Latin American Spanish (`/es`) cover five pages each, listed in `LOCAL_SLUGS` (lib/locale.ts); their nav, project cards and footer only show those pages, and policies link to the English versions marked "(em inglês)" / "(en inglés)".
- Components pass Chinese and English to `tr()`; Portuguese and Spanish come from `lib/i18n/pt.ts` and `es.ts`, keyed by the English text. `tests/i18n.test.ts` fails when a string has no translation.
- Language switch: one pill per other language the page exists in (`.language-switches`).
- Spanish defaults to Letter paper ("tamaño carta", Mexico); Brazil writes decimals with a comma and prices as "US$ 1,99".

## Drawing grid maker (2026-10-21, English only)

- `/drawing-grid-maker` uses its own workbench (`.grid-bench`): four cards in grid areas. Desktop: photo, squares/lines and surface on the left, the preview sticky on the right. Under 980px the order is photo → preview → settings → surface, so the grid shows right after a photo is chosen.
- The preview and the PNG put the square names in a white margin above and left of the photo (columns numbered, rows lettered: B3 is row B, column 3), never over the picture. The PDFs draw the grid as vector lines; the empty grid names every square in its corner on a paper-white patch, and counts sheets ("Sheet 2 of 4 · goes below sheet 1") instead of lettering them, so sheets never read like square names.
- Line colour picker: three equal segments with a 10px colour dot before the word (Black / White / Red). Segment labels must not sit inside `.input-grid` (its `label > span` rule blocks them).
- The surface result is one sentence with the numbers in mono bold ("Draw 6 × 8 squares, each 1 3/4 in."), measurements never split across lines, inches rounded down to 1/16 and centimetres to 1 mm so the grid always fits.
- Status messages appear in the card of the button that caused them.

## Poster printing guide (2026-10-21, English page only)

- `/print-image-on-multiple-pages` (en) is the tool with a tutorial underneath: page defaults are inches, US Letter, landscape sheets and 24 × 36 in (15 sheets), set through `AppDefaults.unit/orientation`; the intro has an in-page `guideLink` to `#guide`. The Chinese page keeps its older article.
- Tutorial steps are h2s that start "Step N:" (no separate numbered eyebrow). Tables use `.pg-table`; number tables add `.pg-table-figures` (mono, tabular). On phones under 560px the methods table turns into one card per row through `data-label`.
- Diagrams live in `components/PosterGuideFigures.tsx` and are drawn from `calculateTilePlan`, so sheet counts match the export. Each has a phone version (`.pg-narrow`, shown under 690px) so diagram text is at least 11px on a 320px screen; on phones the tiny printed lines of a sheet become bars and the legend quotes them.
- English copy uses straight quotes and apostrophes: the CJK-first font stack draws curly ones full-width on Windows.

## Christmas stocking pattern (2026-10-27, English only)

- `/christmas-stocking-pattern` uses `.stocking-bench`: the pattern preview (SVG, drawn from `lib/stocking.ts` in millimetres) on the left, size and paper on the right (sticky). Under 980px the settings card comes first so the download button is reachable without scrolling past the preview.
- Preview: pieces in paper-white with a solid cutting line and dashed sewing line; the printed sheets are dashed accent boxes drawn on top, each with a numbered accent-soft tag. Only sheets that carry part of a piece are shown and printed (`usedTiles`), numbered in print order.
- Inch/centimetre pairs (`.stocking-pair`) read "16 in · 41 cm" on one line and stack under 420px instead of wrapping mid-pair.
- The PDF draws every piece on every sheet clipped to that sheet, so labels crossing a join line up again; each sheet has the 100% note, its sheet number and neighbours, corner marks, and the stocking carries a 1 in square and 5 cm bar.


## Gingerbread house template (2026-11-04, English only)

- `/gingerbread-house-template` reuses `.stocking-bench`: what prints on the left, the house and settings on the right (first on phones, so the download stays near the top).
- The left card shows every printed sheet as a paper thumbnail (`.gb-sheets`), drawn from `houseSheets()` in `lib/gingerbread.ts`, so the preview, the sheet count and the PDF always agree. Two thumbnails per row under 560px.
- Pieces that fit one sheet are packed (every order, quarter turn and page orientation is tried); the three ready-made sizes print with no taping, which the badge says ("No taping" in success green). Only a piece too big for one sheet is tiled, and its thumbnails name the part in the sheet corner ("FRONT 2/4") instead of at the piece centre, where a sheet edge would cut the word in half.
- The settings card opens with a small oblique drawing of the assembled house, redrawn to the chosen proportions, naming width, depth, wall and roof, so the four custom fields are self-explanatory. Custom sizes outside the limits show the reason under the fields, keep the Classic preview, and disable the download.
- Side walls are shortened by two thicknesses of the material (1/4 in dough, 1/8 in card) so they sit between the front and back; the roof overhangs 1/2 in on every side.
