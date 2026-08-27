# TileStencil agent instructions

## Product boundary

TileStencil is a browser-only image tiling tool. A user uploads a JPG or PNG, enters its final physical size, selects A4, A3, or US Letter paper, configures margins and tile overlap, chooses original, grayscale, or black-and-white template rendering, then downloads a multi-page PDF that can be assembled into the requested poster/stencil.

## Non-negotiable rules

- Process images entirely in the browser. Never send image bytes, dimensions, or derived data to an application server or third party.
- Use Next.js, React, and jsPDF. Keep the MVP client-side and static-friendly.
- Preserve physical sizing: calculations use millimetres internally; convert cm/in only at the input/output boundary.
- Include page numbering, trim/assembly marks, overlap guidance, and a visible 100% / Actual Size printing reminder in the generated PDF.
- Test pagination, overlaps, terminal row/column clipping, paper orientation, and unit conversion before reporting completion.
- Support compact mobile layouts without hiding primary controls.
- Do not add accounts, payments, cloud storage, AI APIs, mini-programs, generic analytics, or server-side image upload. The user approved Cloudflare Web Analytics for aggregate page-view and visit measurement only; it must be disclosed on the Privacy page and must never receive image bytes, image dimensions, physical-size settings, or generated PDFs.

## Working agreement

- Prefer small, accessible React components and deterministic pure calculation helpers.
- Keep errors actionable and local. The app should explain how to recover from an unsupported image, invalid physical size, or impossible page setup.
- Run tests and a production build after changes. Report results precisely as verified, partial, or unverified.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
