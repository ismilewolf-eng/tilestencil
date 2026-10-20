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
