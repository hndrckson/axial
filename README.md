# Axial

Axial is an evidence-first narrative intelligence workspace for investigating published claims, propaganda narratives, information propagation, actors, media assets, and counter-evidence.

## Current V0

- monitored news and threat-reporting feed;
- curated narrative hypotheses with evidence ledgers and countergraphs;
- 1,200 factual entities and 6,244 explicit relationships from the UK Sanctions List;
- searchable, expandable, draggable ontology graph;
- local projects and analyst notes;
- mobile-first PWA with a two-floor assistant and navigation dock.

## Evidence Model

Axial separates:

- factual entity and relationship records;
- observed content and propagation events;
- analytical narrative hypotheses;
- forecasts and financial exposure models.

See [RESEARCH_SCOPE.md](./RESEARCH_SCOPE.md) for the production database and research plan and [DATA_SOURCES.md](./DATA_SOURCES.md) for current sources.

## Run

```bash
npm install
npm run dev
```

## Build The Starter Ontology

```powershell
.\scripts\build-ontology.ps1
```

