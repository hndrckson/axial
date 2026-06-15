import {
  ArrowRight,
  ArrowSquareOut,
  BookmarkSimple,
  Broadcast,
  CaretLeft,
  CaretRight,
  ChartLineUp,
  ClockCounterClockwise,
  Coins,
  FileText,
  FunnelSimple,
  Globe,
  Graph,
  MagnifyingGlass,
  Newspaper,
  Path,
  Plus,
  Pulse,
  ShieldCheck,
  Sparkle,
  Target,
  TrendUp,
  UserFocus,
  WarningCircle,
} from "@phosphor-icons/react";
import { FormEvent, useMemo, useState } from "react";
import { NewsObservation, narrativeClusters, newsObservations } from "../intelligence";
import { compactRegime, OntologyEntity, searchEntities, useOntology } from "../ontology";
import { useAxialStore } from "../store";
import { GraphWorkspace } from "./GraphView";

function SourceTag() {
  return <span className="source-tag">UKSL</span>;
}

function EntityTable({ entities, compact = false }: { entities: OntologyEntity[]; compact?: boolean }) {
  const { openEntity } = useAxialStore();
  return (
    <div className={compact ? "entity-table compact" : "entity-table"}>
      <div className="entity-table-head"><span>Entity</span><span>Type</span><span>Regime</span><span>Countries</span><span>Source</span></div>
      {entities.map((entity) => (
        <button className="entity-table-row" key={entity.id} onClick={() => openEntity(entity.id)}>
          <span><strong>{entity.name}</strong><small>{entity.id}</small></span>
          <span>{entity.type}</span>
          <span>{compactRegime(entity.regime)}</span>
          <span>{entity.countries.slice(0, 2).join(", ") || "Not stated"}</span>
          <span><SourceTag /><CaretRight /></span>
        </button>
      ))}
    </div>
  );
}

function LoadingScreen() {
  const { error } = useOntology();
  return <div className="loading-state">{error ? `Ontology unavailable: ${error}` : "Loading sourced ontology..."}</div>;
}

export function HomeScreen() {
  const { data } = useOntology();
  const { setActiveTab, openNarrative, openEntity } = useAxialStore();
  const [selectedObservationId, setSelectedObservationId] = useState(newsObservations[0].id);
  const [feedMode, setFeedMode] = useState<"all" | "state" | "fast">("all");
  const [sortHighFirst, setSortHighFirst] = useState(true);
  const visibleObservations = useMemo(() => {
    const filtered = newsObservations.filter((item) => {
      if (feedMode === "fast") return item.velocity >= 60;
      if (feedMode === "state") return item.kind !== "fact-check" && item.kind !== "threat-report";
      return true;
    });
    return sortHighFirst ? [...filtered].sort((a, b) => b.velocity - a.velocity) : filtered;
  }, [feedMode, sortHighFirst]);
  if (!data) return <LoadingScreen />;
  const selectedObservation = newsObservations.find((item) => item.id === selectedObservationId) ?? newsObservations[0];
  const selectedCluster = narrativeClusters.find((item) => item.id === selectedObservation.clusterId) ?? narrativeClusters[0];
  const observationIcon = (item: NewsObservation) => {
    if (item.kind === "politician") return <UserFocus />;
    if (item.kind === "state-media") return <Broadcast />;
    if (item.kind === "threat-report") return <ShieldCheck />;
    if (item.kind === "government") return <Globe />;
    return <Newspaper />;
  };

  return (
    <main className="intel-home">
      <header className="intel-topbar">
        <div className="intel-title">
          <span className="live-indicator"><Pulse weight="fill" /> Live intelligence</span>
          <div><h1>Media events</h1><span>{newsObservations.length} monitored events across {narrativeClusters.length} active clusters</span></div>
        </div>
        <div className="intel-filters" aria-label="Feed filters">
          <button className={feedMode === "all" ? "active" : ""} onClick={() => setFeedMode("all")}><Pulse /> All signals</button>
          <button className={feedMode === "state" ? "active" : ""} onClick={() => setFeedMode("state")}><Globe /> State narratives</button>
          <button className={feedMode === "fast" ? "active" : ""} onClick={() => setFeedMode("fast")}><TrendUp /> Fast moving</button>
          <button className={sortHighFirst ? "active" : ""} onClick={() => setSortHighFirst((value) => !value)} aria-label="Sort feed by velocity"><FunnelSimple /></button>
        </div>
      </header>

      <section className="intel-metrics" aria-label="Intelligence overview">
        <div><span className="metric-icon"><Broadcast /></span><span><small>Signals today</small><strong>312</strong><em>+28% / 24h</em></span></div>
        <div><span className="metric-icon"><Graph /></span><span><small>Factual graph</small><strong>{data.meta.entityCount.toLocaleString()}</strong><em>{data.meta.relationshipCount.toLocaleString()} relations</em></span></div>
        <div><span className="metric-icon"><WarningCircle /></span><span><small>High velocity</small><strong>03</strong><em>needs review</em></span></div>
        <div><span className="metric-icon"><ShieldCheck /></span><span><small>Evidence posture</small><strong>Strict</strong><em>fact / inference split</em></span></div>
      </section>

      <div className="intel-layout">
        <aside className="feed-panel">
          <header className="panel-header">
            <div><span className="section-label">Monitored feed</span><h2>Published events</h2></div>
            <button className={sortHighFirst ? "active" : ""} onClick={() => setSortHighFirst((value) => !value)} aria-label="Sort feed by velocity"><FunnelSimple /></button>
          </header>
          <div className="feed-list">
            {visibleObservations.map((item) => {
              const cluster = narrativeClusters.find((entry) => entry.id === item.clusterId)!;
              return (
                <button
                  className={item.id === selectedObservation.id ? "feed-card active" : "feed-card"}
                  key={item.id}
                  onClick={() => setSelectedObservationId(item.id)}
                >
                  <span className="feed-card-top">
                    <span className="event-kind">{observationIcon(item)}{item.kind.replace("-", " ")}</span>
                    <span className="event-velocity"><Pulse />{item.velocity}</span>
                  </span>
                  <strong>{item.title}</strong>
                  <span className="feed-source">{item.publisher}<i />{item.published}</span>
                  <span className="feed-narrative"><Graph />{cluster.title}</span>
                  <span className="feed-card-bottom">
                    <span>{item.signals} signals</span><span>{item.reach}</span><CaretRight />
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <article className="analysis-panel">
          <header className="analysis-header">
            <div className="analysis-kicker"><span className={`cluster-status ${selectedCluster.status}`} />{selectedCluster.status} cluster<span>{selectedObservation.country}</span><span>{selectedObservation.published}</span></div>
            <h2>{selectedObservation.title}</h2>
            <p>{selectedObservation.summary}</p>
            <div className="analysis-actions">
              <a href={selectedObservation.url} target="_blank" rel="noreferrer"><Newspaper /> Open source <ArrowSquareOut /></a>
              <button onClick={() => openNarrative(selectedCluster.id)}><ShieldCheck /> Open countergraph</button>
              <button onClick={() => setActiveTab("Graph")}><Graph /> Full graph</button>
            </div>
            <div className="tag-row">{selectedObservation.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </header>

          <section className="analysis-stat-strip">
            <div><span><Pulse />Velocity</span><strong>{selectedObservation.velocity}</strong><small>fast moving</small></div>
            <div><span><Target />Match confidence</span><strong>{selectedObservation.confidence}%</strong><small>{selectedCluster.confidence} confidence</small></div>
            <div><span><Broadcast />Observed signals</span><strong>{selectedObservation.signals}</strong><small>{selectedObservation.reach} estimated reach</small></div>
            <div><span><Path />Propagation</span><strong>{selectedCluster.channels.length}</strong><small>channel classes</small></div>
          </section>

          <section className="analysis-section assessment-section">
            <div className="section-icon-title"><span><Sparkle /></span><div><small>Axial assessment</small><h3>Why this event matters</h3></div></div>
            <p className="lead-analysis">{selectedObservation.analysis}</p>
            <div className="distinction-callout"><ShieldCheck /><span><strong>Critical evidence boundary</strong><small>{selectedObservation.keyDistinction}</small></span></div>
          </section>

          <section className="analysis-section">
            <div className="section-heading-line">
              <div className="section-icon-title"><span><Graph /></span><div><small>Connection graph</small><h3>How the framing travels</h3></div></div>
              <button onClick={() => openNarrative(selectedCluster.id)}>Explore cluster <ArrowRight /></button>
            </div>
            <div className="connection-flow">
              {selectedCluster.connections.map((connection, index) => (
                <div className="connection-row" key={`${connection.from}-${connection.to}`}>
                  <span className="connection-index">{String(index + 1).padStart(2, "0")}</span>
                  <span><strong>{connection.from}</strong><small>{connection.relation}</small><strong>{connection.to}</strong></span>
                  <em className={connection.posture}>{connection.posture}</em>
                </div>
              ))}
            </div>
          </section>

          <section className="analysis-section">
            <div className="section-icon-title"><span><ClockCounterClockwise /></span><div><small>Narrative evolution</small><h3>Lineage and reactivation</h3></div></div>
            <div className="evolution-list">
              {selectedCluster.evolution.map((point) => (
                <div className="evolution-row" key={`${point.date}-${point.label}`}>
                  <time>{point.date}</time>
                  <span><strong>{point.label}</strong><small>{point.detail}</small></span>
                  <span className="strength-meter"><i style={{ width: `${point.strength}%` }} /><small>{point.strength}</small></span>
                </div>
              ))}
            </div>
          </section>

          <section className="analysis-section">
            <div className="section-icon-title"><span><ChartLineUp /></span><div><small>Propagation forecast</small><h3>Modeled spread conditions</h3></div></div>
            <div className="forecast-grid">
              {selectedCluster.forecast.map((forecast) => (
                <article className="forecast-card" key={forecast.horizon}>
                  <span><ClockCounterClockwise />{forecast.horizon}</span><strong>{forecast.probability}%</strong>
                  <div className="probability-track"><i style={{ width: `${forecast.probability}%` }} /></div>
                  <small>{forecast.reach} reach</small><p>{forecast.condition}</p>
                </article>
              ))}
            </div>
            <p className="method-note">Forecasts are modeled scenarios based on current signal velocity and documented channel behavior, not predictions of coordination or intent.</p>
          </section>

          <section className="analysis-section">
            <div className="section-icon-title"><span><Coins /></span><div><small>Capital and strategic exposure</small><h3>Who may gain or carry risk</h3></div></div>
            <div className="exposure-list">
              {selectedCluster.exposures.map((exposure) => (
                <article className="exposure-card" key={exposure.name}>
                  <div><span className={`exposure-direction ${exposure.direction}`}>{exposure.direction}</span><strong>{exposure.name}</strong><small>{exposure.kind}</small></div>
                  <p>{exposure.assessment}</p>
                  <span className="exposure-value"><strong>{exposure.value}</strong><small>{exposure.confidence} confidence</small></span>
                  {exposure.entityId ? <button onClick={() => openEntity(exposure.entityId!)}>Open entity <ArrowRight /></button> : null}
                </article>
              ))}
            </div>
            <p className="method-note">Exposure identifies scenario sensitivity. It does not establish that a listed entity funded, directed, or knowingly benefited from a narrative.</p>
          </section>

          <section className="analysis-section evidence-section">
            <div className="section-icon-title"><span><ShieldCheck /></span><div><small>Evidence ledger</small><h3>Sources and counter-record</h3></div></div>
            <div className="evidence-columns">
              <div><span className="evidence-column-label">Observed and contextual</span>{selectedCluster.evidence.map((item) => <a key={item.url} href={item.url} target="_blank" rel="noreferrer"><span><strong>{item.label}</strong><small>{item.publisher} · {item.date}</small></span><ArrowSquareOut /></a>)}</div>
              <div><span className="evidence-column-label">Counter-evidence</span>{selectedCluster.counter.map((item) => <a key={item.url} href={item.url} target="_blank" rel="noreferrer"><span><strong>{item.label}</strong><small>{item.publisher} · {item.date}</small></span><ArrowSquareOut /></a>)}</div>
            </div>
          </section>
        </article>

        <aside className="watch-rail">
          <section>
            <header className="panel-header"><div><span className="section-label">Active watchlist</span><h2>Narrative clusters</h2></div></header>
            <div className="watch-clusters">
              {narrativeClusters.map((cluster) => (
                <button className={cluster.id === selectedCluster.id ? "active" : ""} key={cluster.id} onClick={() => {
                  const observation = newsObservations.find((item) => item.clusterId === cluster.id);
                  if (observation) setSelectedObservationId(observation.id);
                }}>
                  <span><i className={`cluster-status ${cluster.status}`} />{cluster.actor}</span>
                  <strong>{cluster.title}</strong><small>{cluster.status} · {cluster.confidence} confidence</small>
                </button>
              ))}
            </div>
          </section>
          <section className="coverage-module">
            <div className="section-icon-title"><span><Graph /></span><div><small>Ontology coverage</small><h3>Production seed</h3></div></div>
            <dl>
              <div><dt>Factual entities</dt><dd>{data.meta.entityCount.toLocaleString()}</dd></div>
              <div><dt>Explicit relations</dt><dd>{data.meta.relationshipCount.toLocaleString()}</dd></div>
              <div><dt>Analytical clusters</dt><dd>{narrativeClusters.length}</dd></div>
              <div><dt>Evidence boundary</dt><dd>Strict</dd></div>
            </dl>
            <button onClick={() => setActiveTab("Graph")}>Open ontology <ArrowRight /></button>
          </section>
        </aside>
      </div>
    </main>
  );
}

export function ExploreScreen() {
  const { data } = useOntology();
  const { openEntity, selectedNarrativeId, openNarrative } = useAxialStore();
  const [query, setQuery] = useState("");
  const [regime, setRegime] = useState("All");
  const [type, setType] = useState("All");
  const [page, setPage] = useState(0);
  const results = useMemo(() => searchEntities(data?.entities ?? [], query, regime, type), [data, query, regime, type]);
  if (!data) return <LoadingScreen />;
  const selectedNarrative = narrativeClusters.find((item) => item.id === selectedNarrativeId) ?? narrativeClusters[0];
  const pageSize = 30;
  const visible = results.slice(page * pageSize, page * pageSize + pageSize);
  const pages = Math.max(1, Math.ceil(results.length / pageSize));

  return (
    <main className="workspace-page explore-workspace">
      <header className="workspace-heading compact-heading">
        <div><span className="section-label">Fact checking reinvented</span><h1>Countergraph</h1><p>Trace a published claim through its narrative cluster, documented ecosystem, evidence, and factual counter-record.</p></div>
      </header>
      <div className="countergraph-layout">
        <aside className="cluster-list">
          {narrativeClusters.map((cluster) => <button className={cluster.id === selectedNarrative.id ? "active" : ""} key={cluster.id} onClick={() => openNarrative(cluster.id)}><span>{cluster.actor}</span><strong>{cluster.title}</strong><small>{cluster.status} · {cluster.confidence}</small></button>)}
        </aside>
        <section className="countergraph">
          <header><span className="section-label">{selectedNarrative.actor} · {selectedNarrative.region}</span><h2>{selectedNarrative.title}</h2><p>{selectedNarrative.assessment}</p></header>
          <div className="countergraph-path">
            <div><span className="section-label">Claims</span>{selectedNarrative.claims.map((item) => <strong key={item}>{item}</strong>)}</div>
            <div><span className="section-label">Tactics and channels</span>{[...selectedNarrative.tactics, ...selectedNarrative.channels].map((item) => <strong key={item}>{item}</strong>)}</div>
            <div><span className="section-label">Counter-evidence</span>{selectedNarrative.counter.map((item) => <a key={item.url} href={item.url} target="_blank" rel="noreferrer"><ShieldCheck />{item.label}<ArrowSquareOut /></a>)}</div>
          </div>
          <section className="evidence-ledger">
            <span className="section-label">Evidence ledger</span>
            {selectedNarrative.evidence.map((item) => <a key={item.url} href={item.url} target="_blank" rel="noreferrer"><span><strong>{item.label}</strong><small>{item.publisher} · {item.date} · {item.kind}</small></span><ArrowSquareOut /></a>)}
          </section>
        </section>
      </div>

      <section className="work-section entity-directory-section">
        <div className="section-heading"><div><span className="section-label">Factual entity layer</span><h2>{results.length.toLocaleString()} sourced records</h2></div></div>
        <div className="directory-toolbar">
          <label className="directory-search"><MagnifyingGlass /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} placeholder="Name, entity ID, country, sanction..." /></label>
          <select value={regime} onChange={(event) => { setRegime(event.target.value); setPage(0); }} aria-label="Filter by regime">
            <option>All</option>{data.facets.regimes.map((item) => <option key={item.name} value={item.name}>{compactRegime(item.name)} ({item.count})</option>)}
          </select>
          <select value={type} onChange={(event) => { setType(event.target.value); setPage(0); }} aria-label="Filter by type">
            <option>All</option>{data.facets.types.map((item) => <option key={item.name} value={item.name}>{item.name} ({item.count})</option>)}
          </select>
        </div>
        <EntityTable entities={visible} />
        <div className="pagination">
          <button disabled={page === 0} onClick={() => setPage((value) => Math.max(0, value - 1))}><CaretLeft /> Previous</button>
          <span>Page {page + 1} of {pages}</span>
          <button disabled={page >= pages - 1} onClick={() => setPage((value) => Math.min(pages - 1, value + 1))}>Next <CaretRight /></button>
        </div>
        <button className="mobile-open-first" onClick={() => visible[0] && openEntity(visible[0].id)}>Open first result</button>
      </section>
    </main>
  );
}

export function GraphScreen() {
  return <GraphWorkspace />;
}

export function ProjectsScreen() {
  const { projects, createProject, selectedEntityId, saveEntity, addNote } = useAxialStore();
  const { entityById } = useOntology();
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const selected = entityById.get(selectedEntityId);
  const submitProject = (event: FormEvent) => {
    event.preventDefault();
    if (name.trim()) { createProject(name.trim()); setName(""); }
  };

  return (
    <main className="workspace-page">
      <header className="workspace-heading compact-heading">
        <div><span className="section-label">Research cases</span><h1>Projects</h1><p>Local case files for saved entities, narrative investigations, and analyst notes.</p></div>
        <form className="inline-form" onSubmit={submitProject}><input value={name} onChange={(event) => setName(event.target.value)} placeholder="New project name" /><button><Plus /> Create</button></form>
      </header>
      <div className="project-list">
        {projects.map((project) => (
          <article className="project-record" key={project.id}>
            <header><div><FileText /><span><strong>{project.name}</strong><small>{project.description}</small></span></div><span>{project.updatedAt}</span></header>
            <div className="project-stats"><span>{project.savedEntities.length} saved entities</span><span>{project.notes.length} notes</span></div>
            <div className="saved-entities">{project.savedEntities.map((id) => <span key={id}><BookmarkSimple />{entityById.get(id)?.name ?? id}</span>)}</div>
            <div className="project-actions">
              <button onClick={() => saveEntity(project.id, selectedEntityId)}>Save {selected?.name ?? selectedEntityId}</button>
              <form onSubmit={(event) => { event.preventDefault(); if (note.trim()) { addNote(project.id, note.trim()); setNote(""); } }}><input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add analyst note" /><button>Add note</button></form>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
