# Axial Production V0 QA

- Visual direction only: supplied dark mobile product screenshots.
- Current implementation evidence: `screenshots/v0-mobile-home.png`, `screenshots/v0-desktop-home.png`, `screenshots/v0-mobile-graph-final.png`, `screenshots/v0-desktop-graph-final.png`
- Viewports checked: mobile `390x844`; desktop `1440x1024`
- Browser method: standalone Chrome Playwright because the in-app browser viewport override was unreliable in the previous QA pass.

## Product Correction

- Removed fake narrative metrics, heatmaps, propagation charts, estimated-benefit blocks, and unsourced graph relationships.
- Restored the original product spine with a monitored publication feed, source-backed narrative hypotheses, countergraph, factual entity graph, source inspector, local cases, and assistant command.
- Assistant field is the upper floor of the floating dock; primary navigation is the lower floor.
- References determine restraint, typography, darkness, and thin rules only. The app layout now follows investigation workflows rather than copying the screenshots.

## Data

- Integrated source: official UK Sanctions List snapshot dated 10 June 2026.
- Starter ontology: 1,200 actual entities and 6,244 explicit source-derived relationships.
- Reproducible ingestion: `scripts/build-ontology.ps1`.
- Data artifact: `public/data/ontology.json` (2.6 MB).
- Source and evidence boundaries: `DATA_SOURCES.md`.

## Responsive And Interaction QA

- Two-floor assistant/navigation dock is `76px` high with a `42px` assistant floor and `34px` navigation floor.
- Media-events Home now opens a full investigation workspace with assessment, evidence boundary, connection path, narrative evolution, propagation forecast, exposure scenarios, and evidence ledger.
- Feed contains ten source-backed media events across six analytical clusters; observations, inferences, modeled forecasts, and exposure scenarios remain visibly labeled.
- Feed filters and velocity sorting are functional. The Fast moving filter reduces the current corpus from ten events to four.
- Selecting a feed event updates the full investigation workspace without navigation.
- Full graph and countergraph actions route into the deeper research surfaces.
- Mobile narrow-width QA has no horizontal page overflow; the feed becomes a horizontal event selector and the investigation modules stack below it.
- Entity directory search for `bank` returns 37 actual records.
- Opening a search result recenters the graph on that entity.
- Clicking a relationship facet expands a graph from 6 to 18 nodes.
- Graph nodes drag successfully.
- Mobile graph stage remains usable at approximately `499px` high.
- Command search for `Kiselyov` returns a sourced ontology match.
- Narrative monitor contains ten source-backed observations and six curated narrative clusters.
- Selecting a monitored observation opens its countergraph with claims, tactics, counter-evidence, and evidence ledger.
- URL input clearly labels keyword narrative mapping as a hypothesis when live extraction is not connected.
- Browser console and page errors: none.
- In-app Browser DOM, layout, routing, and interaction checks passed. Screenshot capture timed out in the Browser backend during this pass, so the prior visual screenshots remain the latest image evidence.

## Build

- TypeScript `tsc --noEmit`: passed.
- Vite production build: passed.
- Clean-source ingestion download and rebuild: passed (`1,200` entities, `6,244` relationships).
- Decorative chart dependency and old fake seed-data module removed.

final result: passed
