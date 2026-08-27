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
