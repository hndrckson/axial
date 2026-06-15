# Axial v2 Design QA

Source visual truth: `C:\Users\Administrator\Documents\axial\v2\reference\axial-v2-concept.png`

Implementation screenshots:

- `C:\Users\Administrator\Documents\axial\v2\screenshots-home-mobile.png`
- `C:\Users\Administrator\Documents\axial\v2\screenshots-home-mobile-tall.png`
- `C:\Users\Administrator\Documents\axial\v2\screenshots-home-desktop.png`
- `C:\Users\Administrator\Documents\axial\v2\screenshots-pack-mobile.png`
- `C:\Users\Administrator\Documents\axial\v2\screenshots-graph-desktop.png`
- `C:\Users\Administrator\Documents\axial\v2\screenshots-home-mobile-v3.png`
- `C:\Users\Administrator\Documents\axial\v2\screenshots-graph-entity-desktop-v2.png`

Comparison artifact: `C:\Users\Administrator\Documents\axial\v2\qa-comparison-mobile-v2.png`

Viewport and state:

- Mobile home: 390 x 844, dark mode, default featured pack
- Mobile long-form home: 390 x 1800
- Mobile pack detail: 390 x 844, Russian energy
- Desktop home and graph: 1280 x 900

Capture method:

- Core interactions and responsive overflow checked in the in-app Browser.
- Browser screenshot capture timed out, so rendered screenshots used installed Chrome headless as the visual-QA fallback.

## Full-View Comparison

- Typography: Inter display hierarchy and IBM Plex Mono metadata preserve the source's large editorial titles and compact intelligence labels. The implementation intentionally uses larger mobile type because the user requested a readability increase.
- Spacing and layout: true-black open shelves, thin dividers, restrained surfaces, and the two-floor bottom dock match the source composition. The mobile featured pack is now side-by-side and compact; moving packs, exposure, and current developments enter the opening viewport.
- Colors and tokens: true black, graphite, white, desaturated blue, rust, green, and yellow remain restrained and semantic.
- Image quality: six dedicated generated cover artworks were converted to optimized 1100px WebP files. Axial publication lockups, pack numbers, and typographic cover titles are consistently layered over the artwork.
- Copy and content: all visible seed data is product-specific. Evidence posture and scenario boundaries are explicit.

## Focused Region Comparison

- Featured pack: side-by-side copy and media now follow the source mobile anatomy; duplicated artwork title was removed.
- Cover shelf: generated art, pack lockup, catalog index, confidence, and movement are readable at mobile size.
- Bottom dock: assistant field remains the upper floor and navigation remains the lower floor at all checked widths.
- Graph: selected entities recenter a proximity-ranked neighborhood built from source-text mentions and shared sourced sanctions, geography, and regime relationships. Neighbor-to-neighbor edges create local clusters; narrative context remains dashed and separate.
- Pack detail: art, large heading, source metrics, tabs, capital model, history, and evidence views retain hierarchy on mobile.

## Findings

No actionable P0, P1, or P2 visual or functional issues remain.

P3 follow-up: the desktop bundle includes the graph package in the initial chunk; route-level lazy loading can reduce first-load JavaScript after the product structure stabilizes.

## Patches Made During QA

- Added consistent Axial logo/type lockups and pack catalog numbers to every cover.
- Generated dedicated PRC discourse and Adaptive FIMI artwork.
- Optimized generated PNG artwork to high-quality WebP assets.
- Shortened the mobile featured composition to reveal the first discovery shelf.
- Rebuilt the mobile home density to closely follow the selected screenshot: compact side-by-side feature, five-cover rail, narrow exposure cards, and early current developments.
- Removed the redundant featured-art title treatment.
- Added deep-linkable states, PWA shell, graph ontology search, and evidence posture legend.
- Replaced the narrative-centered graph with a click-to-recenter sourced entity proximity graph and lateral cluster edges.
- Verified no horizontal overflow at normal mobile width or the narrower in-app pane, and no console errors.

final result: passed
