import {
  ArrowRight,
  ArrowSquareOut,
  BookmarkSimple,
  CaretLeft,
  CaretRight,
  FileText,
  Graph,
  MagnifyingGlass,
  Plus,
  ShieldCheck,
} from "@phosphor-icons/react";
import { FormEvent, useMemo, useState } from "react";
import { narrativeClusters, newsObservations } from "../intelligence";
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
  const { setActiveTab, openNarrative, projects } = useAxialStore();
  if (!data) return <LoadingScreen />;

  return (
    <main className="workspace-page home-workspace">
      <header className="workspace-heading">
        <div><span className="section-label">Narrative monitor</span><h1>What is being pushed, by whom, and why?</h1><p>Published observations are clustered into narrative hypotheses, connected to sourced actors, and paired with counter-evidence.</p></div>
        <button className="plain-button" onClick={() => setActiveTab("Explore")}>Open countergraph <ArrowRight /></button>
      </header>

      <section className="source-summary">
        <div><span>Monitored observations</span><strong>{newsObservations.length}</strong><small>source-backed seed corpus</small></div>
        <div><span>Narrative clusters</span><strong>{narrativeClusters.length}</strong><small>analytical hypotheses</small></div>
        <div><span>Factual entities</span><strong>{data.meta.entityCount.toLocaleString()}</strong><small>actual source records</small></div>
        <div><span>Explicit relations</span><strong>{data.meta.relationshipCount.toLocaleString()}</strong><small>source-derived edges</small></div>
      </section>

      <div className="home-grid">
        <section className="work-section">
          <div className="section-heading"><div><span className="section-label">Monitor feed</span><h2>Published items and threat reporting</h2></div><span className="analytical-label">Observed / reported</span></div>
          <div className="news-feed">
            {newsObservations.map((item) => {
              const cluster = narrativeClusters.find((entry) => entry.id === item.clusterId)!;
              return (
                <article className="news-observation" key={item.id}>
                  <button onClick={() => openNarrative(item.clusterId)}>
                    <span className="observation-source">{item.publisher} · {item.published}</span>
                    <strong>{item.title}</strong>
                    <p>{item.assessment}</p>
                    <span className="mapped-narrative"><Graph /> Maps to: {cluster.title}</span>
                  </button>
                  <a href={item.url} target="_blank" rel="noreferrer" aria-label="Open source"><ArrowSquareOut /></a>
                </article>
              );
            })}
          </div>
        </section>
        <aside className="work-section">
          <div className="section-heading"><div><span className="section-label">Active narrative clusters</span><h2>Analyst watchlist</h2></div></div>
          <div className="narrative-watchlist">
            {narrativeClusters.map((cluster) => (
              <button key={cluster.id} onClick={() => openNarrative(cluster.id)}>
                <span><i className={`cluster-status ${cluster.status}`} />{cluster.actor}</span>
                <strong>{cluster.title}</strong>
                <small>{cluster.confidence} confidence · {cluster.status}</small>
              </button>
            ))}
          </div>
        </aside>
      </div>

      <section className="work-section">
        <div className="section-heading"><div><span className="section-label">Factual entity layer</span><h2>Open a sourced actor neighborhood</h2></div><button onClick={() => setActiveTab("Graph")}>Open full graph</button></div>
        <EntityTable entities={data.entities.slice(0, 12)} compact />
      </section>

      <section className="work-section">
        <div className="section-heading"><div><span className="section-label">Cases</span><h2>Active local projects</h2></div><button onClick={() => setActiveTab("Projects")}>Manage projects</button></div>
        <div className="case-list">
          {projects.map((project) => <button key={project.id} onClick={() => setActiveTab("Projects")}><span><strong>{project.name}</strong><small>{project.description}</small></span><span>{project.savedEntities.length} entities · {project.notes.length} notes</span></button>)}
        </div>
      </section>
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
