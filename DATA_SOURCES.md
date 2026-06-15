# Axial Starter Ontology Sources

## Integrated

### UK Sanctions List

- Official source: https://sanctionslist.fcdo.gov.uk/
- Download used by the ingestion script: https://sanctionslist.fcdo.gov.uk/docs/UK-Sanctions-List.csv
- Snapshot currently bundled: 10 June 2026
- Starter slice: 1,200 unique source records and 6,244 explicit relationships.
- Covered regimes: Russia, Iran, Democratic People's Republic of Korea, Belarus, Syria, Myanmar, Global Human Rights, and Cyber.
- Relationship policy: only explicit source fields become edges. Shared regimes and sanctions are traversable facets, not claims of coordination.

Run `scripts/build-ontology.ps1` to download the current source and rebuild `public/data/ontology.json`.

## Researched For Next Ingestion Connectors

### US Treasury OFAC

- Official sanctions list service: https://ofac.treasury.gov/sanctions-list-service
- Official SDN data: https://www.treasury.gov/ofac/downloads/sdn.csv
- Status: researched and validated as a candidate; not merged into the current ontology.

### European Union

- Official sanctions overview: https://www.consilium.europa.eu/en/policies/sanctions/
- Status: researched as a candidate source for a subsequent connector; not merged into the current ontology.

## Evidence Boundary

This starter database supports entity, regime, country, sanction, and declared-parent traversal. It does not assert propaganda intent, narrative coordination, or financial benefit without separate sourced evidence.

## Curated Narrative Observation Seed

The current v0 includes a small, source-backed observation corpus used to demonstrate the monitored-news and countergraph workflow. These records are analytical hypotheses, not factual ontology edges.

- EUvsDisinfo disinformation cases: https://euvsdisinfo.eu/disinformation-cases/
- Fourth EEAS Report on Foreign Information Manipulation and Interference Threats: https://www.eeas.europa.eu/eeas/4th-eeas-report-foreign-information-manipulation-and-interference-threats_en
- U.S. Treasury release on RT covert influence operations: https://home.treasury.gov/news/press-releases/jy2580
- U.S. Department of State report on PRC information manipulation: https://2021-2025.state.gov/how-the-peoples-republic-of-china-seeks-to-reshape-the-global-information-environment/
- U.S. Department of State report on Russia's disinformation and propaganda ecosystem: https://2021-2025.state.gov/russias-pillars-of-disinformation-and-propaganda-report/
