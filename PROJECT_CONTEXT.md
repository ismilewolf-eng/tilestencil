# TileStencil — project context

## Mission

Turn one local JPG or PNG into a print-ready, multi-page PDF at an exact real-world size. The PDF must be easy to assemble after printing and must never require image upload.

## MVP workflow

1. Choose a local JPG or PNG.
2. Enter the final image width and height in centimetres or inches.
3. Choose A4, A3, or US Letter and its orientation.
4. Configure print margins and overlap.
5. Choose original colour, grayscale, or high-contrast black-and-white template processing.
6. Review tile count, printable area, and total assembled size.
7. Export a multi-page PDF with numbered tiles and assembly marks.

## Print geometry contract

- Internal unit: millimetres.
- Source image aspect ratio is preserved by default. Users may change both requested dimensions deliberately.
- Printable page area is the selected sheet size minus left/right/top/bottom margins.
- Adjacent source regions overlap by the chosen physical overlap. Tile stride is `printable dimension - overlap`.
- The final row and column may have a smaller source region; they must still be exported at the correct physical location, with the unused paper area left blank.
- The generated PDF uses mm units. Tile placement starts after the physical margin and does not scale the requested final artwork size.
- Every page includes a 100% / Actual Size reminder, tile index, grid coordinates, and cut/overlap registration marks.

## Scope exclusions

No login, billing, AI/API calls, cloud storage, uploads to a server, collaboration, mini-program, backend database, or generic analytics in the first release. The user approved Cloudflare Web Analytics solely for aggregate visit and page-view measurement; it does not process uploaded images, image dimensions, physical-size settings, or generated PDFs.

## Definition of done

- A local `npm run dev` experience works on desktop and mobile widths.
- Core geometry is covered by automated tests.
- `npm run test` and `npm run build` pass.
- Privacy, robots, sitemap, and baseline SEO metadata are present.
