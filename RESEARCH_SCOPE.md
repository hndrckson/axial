# Axial Research Scope And Production Ontology Plan

## Product Thesis

Axial is not a database that labels articles as propaganda. It is an evidence system that lets a user move between:

1. a published item;
2. the claims and frames present in it;
3. a time-bounded narrative cluster;
4. observed propagation events;
5. documented actors, assets, ownership, funding, and commercial interests;
6. factual counter-evidence and unresolved uncertainty.

The system must keep **facts**, **observations**, **analytical hypotheses**, and **forecasts** separate.

## Two Connected Graphs

### Factual ontology

Slow-changing, source-backed facts:

- people, organizations, governments, political parties, companies, vessels, and financial institutions;
- media outlets, domains, channels, accounts, and content partnerships;
- ownership, control, employment, office, funding, sanctions, corporate, and declared-parent relationships;
- sources, documents, filings, and provenance.

Every factual edge requires a source URL, source date, retrieval date, confidence, and review status.

### Observation graph

Fast-changing analytical records:

- articles, broadcasts, posts, videos, transcripts, and official statements;
- atomic claims, frames, slogans, topics, and narrative clusters;
- publication, quotation, syndication, translation, phrase reuse, and cross-platform propagation events;
- counter-evidence, fact checks, contradictions, corrections, and retractions;
- classifier outputs, analyst assessments, forecasts, and uncertainty.

Observations expire, merge, split, and change confidence. They must never silently become factual edges.

## Core Schema

### Entity nodes

`Person`, `Organization`, `StateBody`, `PoliticalParty`, `Company`, `FinancialInstitution`, `MediaOutlet`, `Domain`, `Channel`, `Account`, `Platform`, `Location`, `SanctionsRegime`, `NarrativeCluster`, `Claim`, `Article`, `Statement`, `EvidenceDocument`, `FactCheck`, `Project`.

### Factual edges

`OWNS`, `CONTROLS`, `FUNDS`, `EMPLOYS`, `DIRECTOR_OF`, `PARENT_OF`, `SUBSIDIARY_OF`, `SANCTIONED_UNDER`, `OPERATES`, `PUBLISHES_ON`, `REGISTERED_AT`, `PARTNERS_WITH`, `CITES`, `MEMBER_OF`.

### Observation edges

`PUBLISHED`, `CONTAINS_CLAIM`, `USES_FRAME`, `SUPPORTS_NARRATIVE`, `CONTRADICTS`, `REPEATS_PHRASE`, `SYNDICATES`, `TRANSLATES`, `AMPLIFIES`, `QUOTES`, `APPEARS_AFTER`, `PREDICTED_TO_REACH`.

### Mandatory edge fields

`source_url`, `source_name`, `source_date`, `retrieved_at`, `valid_from`, `valid_to`, `evidence_excerpt_hash`, `confidence`, `confidence_basis`, `review_status`, `reviewer`, `model_version`, `created_at`, `updated_at`.

## Research And Ingestion Scope

### Tier 1: authoritative structured sources

Target: 100,000-500,000 factual entities.

- UK Sanctions List, already integrated.
- U.S. Treasury OFAC sanctions datasets.
- European Union consolidated sanctions data and Council sanctions records.
- United Nations Security Council consolidated sanctions list.
- U.S. Department of Justice FARA filings.
- U.S. SEC EDGAR, UK Companies House, national company registries, and beneficial ownership registers where legally available.
- Wikidata for identifiers and reconciliation only, never as sole evidence for sensitive edges.
- OpenCorporates and OpenSanctions for reconciliation and source discovery, with original-source verification.
- GLEIF LEI data for legal entities and corporate relationships.
- ICIJ Offshore Leaks where licensed and relevant.

### Tier 2: media and influence infrastructure

Target: 25,000-100,000 media assets and accounts.

- state-media registries and official outlet disclosures;
- official sanctions and government attribution releases;
- media ownership filings and company registries;
- domain registration, DNS, certificate transparency, and historical domain infrastructure;
- platform transparency reports and takedown datasets;
- public Telegram channels, official social accounts, and YouTube channels within applicable platform rules;
- NewsGuard, Media Bias/Fact Check, and similar services only with licensing and explicit methodology fields.

### Tier 3: news and content observations

Target: 1-10 million content records per month.

- GDELT DOC/GKG/Event feeds for broad multilingual discovery;
- Media Cloud collections and topic queries;
- licensed news APIs and publisher RSS feeds;
- public state-media RSS, broadcasts, transcripts, and official statements;
- EUvsDisinfo case database and EEAS FIMI reports;
- IFCN signatory fact-check feeds, Full Fact, AFP Fact Check, AP Fact Check, Reuters Fact Check, and regional fact-checkers under their terms;
- Common Crawl and web archives for historical preservation where permitted.

### Tier 4: financial interest and capital allocation

Target: traceable interest hypotheses, never unsupported profit claims.

- company filings, annual reports, ownership disclosures, procurement databases, trade data, sanctions records, and market data;
- relationships between policy outcomes and exposed companies/sectors;
- scenario ranges with explicit assumptions, sensitivity analysis, and provenance;
- no claim that an actor benefits from a narrative without a documented relationship and clearly labeled model.

## Collection Pipelines

### Continuous ingestion

1. Fetch source documents through source-specific connectors.
2. Store immutable raw documents and content hashes.
3. Parse and normalize structured fields.
4. Resolve entities using deterministic identifiers first, then probabilistic matching.
5. Extract claims, frames, quotations, named entities, and relationships.
6. Cluster semantically similar claims in time windows.
7. Detect propagation through links, timestamps, phrase reuse, and syndication.
8. Attach counter-evidence and contradictions.
9. Queue sensitive or high-impact findings for human review.
10. Publish only the evidence posture appropriate to the review state.

### Narrative clustering

- multilingual embeddings plus lexical phrase matching;
- event/time constraints to prevent unrelated claims from merging;
- actor/channel priors as features, not proof;
- analyst-controlled merge, split, rename, and archive;
- cluster version history and reproducible model inputs.

### Propagation and forecast

- observed cascade graph built from publication timestamps, hyperlinks, quotations, phrase reuse, translations, and account reposts;
- estimates for missing links must remain `INFERRED`;
- forecast features: prior channel behavior, audience overlap, platform velocity, language jumps, event salience, and historical cascade shape;
- R0-style measures are descriptive analogies, not epidemiological truth; show calibration and uncertainty.

## Research Team And Workflow

### Roles

- source and connector engineers;
- data journalists and regional researchers;
- entity-resolution analysts;
- multilingual narrative analysts;
- financial and corporate researchers;
- model evaluation and red-team researchers;
- legal, privacy, and source-licensing review.

### Review ladder

- `raw`: ingested but unreviewed;
- `machine-observed`: automated extraction with model/version metadata;
- `analyst-reviewed`: evidence checked by one analyst;
- `verified`: source and relationship reviewed by a second analyst;
- `disputed`: conflicting evidence is visible;
- `retracted`: retained in history but excluded from current assertions.

## Build Phases

### Phase 0: current local v0

- sourced UK sanctions entity graph;
- curated source-backed narrative observations;
- monitored-item feed, countergraph, entity graph, and projects;
- strict separation between factual records and narrative hypotheses.

### Phase 1: production data foundation

- Postgres for operational records and provenance;
- object storage for immutable source documents;
- OpenSearch for multilingual content search;
- graph projection using Neo4j, Memgraph, or Postgres/Apache AGE after benchmark;
- job orchestration, connector monitoring, and replayable ingestion;
- authentication, organizations, permissions, audit logs, and API keys.

### Phase 2: media ownership and narrative monitoring

- ingest OFAC, EU, UN, company registries, GLEIF, FARA, and media-ownership sources;
- 100,000+ reconciled factual entities;
- GDELT/Media Cloud/RSS news ingestion;
- article-to-claim extraction and analyst-reviewed narrative clusters;
- publisher analysis endpoint and embeddable countergraph widget.

### Phase 3: propagation and financial exposure

- cross-platform propagation event graph;
- calibrated cascade forecasts;
- company and sector exposure models;
- scenario builder with assumptions and sensitivity ranges;
- alerting, saved monitors, and team research workflows.

## Production Quality Gates

- no unsupported sensitive attribution;
- every visible relationship exposes provenance and evidence posture;
- entity merge precision measured on gold-standard sets by region and script;
- claim/narrative clustering evaluated for false merges and false splits;
- forecast calibration published by horizon and narrative category;
- corrections and disputes are first-class records;
- source licensing, robots rules, platform terms, privacy, and retention policies reviewed per connector;
- independent red-team review for political bias, adversarial manipulation, and defamation risk.

## Initial Quantitative Targets

- 250,000 factual entities;
- 1,000,000 factual edges;
- 50,000 monitored media assets/accounts;
- 5,000 active narrative clusters with version history;
- 5-10 million monthly content observations;
- 100,000 reviewed counter-evidence links;
- 95%+ provenance completeness on published factual edges;
- fewer than 1% unsupported-sensitive-edge publication rate, with a target of zero.

