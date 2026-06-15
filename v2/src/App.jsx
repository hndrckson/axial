import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BookmarkSimple,
  Books,
  CaretDown,
  ChartLineUp,
  CheckCircle,
  ChatCircleDots,
  CirclesThreePlus,
  ClockCounterClockwise,
  Coins,
  Compass,
  Database,
  DotsThree,
  FileText,
  Folder,
  Graph,
  House,
  LinkSimple,
  MagnifyingGlass,
  Newspaper,
  PaperPlaneTilt,
  Pulse,
  ShieldCheck,
  Sparkle,
  Target,
  TrendUp,
  UserCircle,
  X,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { assistantDemos, capitalRail, packs, quickPrompts, techniques } from "./data";
import { ExploreView } from "./components/ExploreView";
import { GraphCanvas } from "./components/GraphCanvas";
import { ProjectsView } from "./components/ProjectsView";

const navItems = [
  ["home", "Home", House],
  ["explore", "Explore", Compass],
  ["graph", "Graph", Graph],
  ["projects", "Projects", Folder],
];

const techniqueIcons = {
  conflation: CirclesThreePlus,
  "victim-blaming": Target,
  "covert-funding": Coins,
  "historical-revision": ClockCounterClockwise,
  "economic-fatalism": TrendUp,
  "proxy-media": Newspaper,
  "clip-recycling": Pulse,
  "cross-platform": Graph,
};

function Meta({ children, tone = "" }) {
  return <span className={`meta ${tone}`}>{children}</span>;
}

function CoverArt({ pack, className = "", number = packs.findIndex((item) => item.id === pack.id) + 1 }) {
  return (
    <span className={`cover-art ${className}`}>
      <img src={pack.cover} alt="" />
      <span className="cover-brand"><Graph weight="bold" /><b>AXIAL</b><small>NARRATIVE INTELLIGENCE</small></span>
      <span className="cover-index">P-{String(number).padStart(2, "0")}</span>
      <span className="cover-title"><small>{pack.actor.split(" ")[0]} / {pack.region.split(" / ")[0]}</small><strong>{pack.title}</strong></span>
    </span>
  );
}

function AppHeader({ onHome }) {
  return (
    <header className="topbar">
      <button className="wordmark" onClick={onHome}>Axial</button>
      <button className="date-switcher">Today <CaretDown /></button>
      <div className="top-actions">
        <button aria-label="Notifications"><Bell /></button>
        <button aria-label="Account"><UserCircle /></button>
      </div>
    </header>
  );
}

function PackCover({ pack, size = "rail", onOpen, rank }) {
  return (
    <button className={`pack-cover ${size}`} onClick={() => onOpen(pack.id)}>
      <CoverArt pack={pack} className="cover-image" />
      <strong>{pack.title}</strong>
      <span className="pack-movement"><i>↑ {pack.movement}%</i><small>{pack.confidence}% confidence</small></span>
    </button>
  );
}

function Shelf({ title, subtitle, children, action }) {
  return (
    <section className="shelf">
      <header className="section-head">
        <div><h2>{title}</h2>{subtitle ? <p>{subtitle}</p> : null}</div>
        {action ? <button onClick={action}>View all <ArrowRight /></button> : null}
      </header>
      {children}
    </section>
  );
}

function ForecastMini({ pack }) {
  const values = pack.forecast.map((item) => item[1]);
  return (
    <div className="mini-forecast">
      <div className="mini-chart" aria-label="Narrative forecast">
        {values.map((value, index) => <i key={index} style={{ height: `${value}%` }} />)}
      </div>
      <div><Meta>Next 7 days</Meta><strong>{values[1]}%</strong><small>{pack.forecast[1][2]}</small></div>
    </div>
  );
}

function HomeView({ openPack, setView, saved, toggleSaved }) {
  const featured = packs[0];
  return (
    <main className="page home-page">
      <section className="home-intro">
        <p>Good morning, Alex</p>
        <h1>What moved the narrative?</h1>
        <span>Evidence-backed investigations, updated continuously.</span>
      </section>

      <button className="featured-pack" onClick={() => openPack(featured.id)}>
        <div className="featured-copy">
          <Meta tone="blue">Featured pack</Meta>
          <h2>{featured.title}</h2>
          <p>{featured.short}</p>
          <div className="featured-posture"><ShieldCheck /><span><small>Evidence posture</small><strong>{featured.posture}</strong><em>{featured.confidence}% confidence</em></span></div>
        </div>
        <div className="featured-media">
          <CoverArt pack={featured} />
          <Meta>{featured.sources} sources</Meta>
          <span className="graph-launch"><Graph /></span>
        </div>
      </button>

      <Shelf title="Moving now" subtitle="Narratives with the most movement in the last 24h." action={() => setView("explore")}>
        <div className="pack-rail">{packs.slice(1, 6).map((pack, index) => <PackCover key={pack.id} pack={pack} rank={index + 1} onOpen={openPack} />)}</div>
      </Shelf>

      <Shelf title="Capital exposure" subtitle="Who is sensitive to the policy outcome.">
        <div className="capital-rail">
          {capitalRail.map(([name, exposure, basis, color]) => (
            <article className="capital-tile" key={name}>
              <Coins style={{ color }} /><strong>{name}</strong><em style={{ color }}>{exposure}</em><small>{basis}</small>
            </article>
          ))}
        </div>
      </Shelf>

      <Shelf title="Current developments" action={() => openPack(featured.id)}>
        <div className="development-list">
          {featured.developments.map(([time, headline, kind, confidence]) => (
            <button key={headline} onClick={() => openPack(featured.id)}>
              <time>{time} ago</time><i /><span><strong>{headline}</strong><small>{kind} · {confidence}% relevance</small></span><Meta>{kind}</Meta><b>{confidence}%</b>
              <BookmarkSimple weight={saved.has(featured.id) ? "fill" : "regular"} onClick={(event) => { event.stopPropagation(); toggleSaved(featured.id); }} />
            </button>
          ))}
        </div>
      </Shelf>

      <div className="home-preview">
        <button className="lineage-preview" onClick={() => openPack(featured.id)}>
          <Meta>Inside {featured.title}</Meta><h3>Narrative lineage</h3>
          <div><span>Sanctions shock</span><ArrowRight /><strong>Futility frame</strong><ArrowRight /><span>Enforcement pressure</span></div>
        </button>
        <button className="forecast-preview" onClick={() => openPack(featured.id)}>
          <Meta>Propagation forecast</Meta><h3>Modeled spread conditions</h3><ForecastMini pack={featured} />
        </button>
      </div>
    </main>
  );
}

function PackHero({ pack, saved, toggleSaved }) {
  return (
    <section className="detail-hero">
      <div className="detail-art"><CoverArt pack={pack} /><span style={{ background: pack.color }} /></div>
      <div className="detail-title">
        <Meta>{pack.actor} · {pack.region}</Meta>
        <h1>{pack.title}</h1>
        <p>{pack.short}</p>
        <div className="detail-stats">
          <span><b>{pack.signals}</b><small>signals</small></span><span><b>{pack.sources}</b><small>sources</small></span><span><b>{pack.confidence}%</b><small>confidence</small></span><span><b>+{pack.movement}%</b><small>24h movement</small></span>
        </div>
        <div className="detail-actions">
          <button className="primary-action"><Sparkle weight="fill" /> Ask about pack</button>
          <button onClick={() => toggleSaved(pack.id)}><BookmarkSimple weight={saved.has(pack.id) ? "fill" : "regular"} />{saved.has(pack.id) ? "Saved" : "Save"}</button>
          <button aria-label="More"><DotsThree /></button>
        </div>
      </div>
    </section>
  );
}

function BriefTab({ pack }) {
  return (
    <div className="detail-grid">
      <div>
        <section className="analysis-block">
          <div className="block-title"><span><Sparkle /></span><div><Meta>Axial assessment</Meta><h2>What this pack explains</h2></div></div>
          <p className="lead">{pack.thesis}</p>
          <div className="boundary"><ShieldCheck /><span><strong>Evidence boundary</strong><small>{pack.boundary}</small></span></div>
          <TechniqueStrip pack={pack} />
        </section>
        <section className="analysis-block">
          <div className="block-title"><span><Newspaper /></span><div><Meta>Live event stream</Meta><h2>Current developments</h2></div></div>
          <div className="large-development-list">
            {pack.developments.map(([time, headline, kind, score]) => <article key={headline}><time>{time} ago</time><span><strong>{headline}</strong><small>{kind}</small></span><b>{score}%</b></article>)}
          </div>
        </section>
      </div>
      <aside className="detail-rail">
        <section><Meta>Propagation forecast</Meta><h3>Next 7 days</h3><ForecastMini pack={pack} />{pack.forecast.map(([horizon, score]) => <div className="rail-score" key={horizon}><span>{horizon}</span><b>{score}%</b><i><em style={{ width: `${score}%` }} /></i></div>)}</section>
        <section><Meta>Evidence posture</Meta><h3>{pack.posture}</h3><p>{pack.sources} source records support this investigation. Analytical and scenario edges remain visibly separate.</p></section>
      </aside>
    </div>
  );
}

function TechniqueStrip({ pack, selected, onSelect }) {
  const visible = techniques.filter((item) => item.packIds.includes(pack.id));
  return (
    <div className="technique-strip">
      <Meta>Techniques used in this narrative</Meta>
      <div>
        {visible.map((item) => {
          const Icon = techniqueIcons[item.id] || Target;
          return <button className={selected === item.id ? "active" : ""} key={item.id} onClick={() => onSelect?.(item.id)}><Icon /><span><strong>{item.label}</strong><small>{item.description}</small></span></button>;
        })}
      </div>
    </div>
  );
}

function CapitalTab({ pack, onGraph }) {
  return (
    <section className="analysis-block wide-block">
      <div className="block-title"><span><Coins /></span><div><Meta>Capital connection model</Meta><h2>Ranked entities and outcome sensitivity</h2></div></div>
      <p className="section-copy">Scores rank relationship proximity, modeled benefit sensitivity, and source confidence separately. A high modeled benefit score is not proof of narrative promotion.</p>
      <div className="capital-table">
        <header><span>Entity</span><span>Connection</span><span>Benefit</span><span>Evidence</span><span>Estimated outcome</span></header>
        {pack.capital.map(([name, kind, posture, connection, benefit, evidence, outcome, note], index) => (
          <article key={name}>
            <div><Meta>{String(index + 1).padStart(2, "0")} · {posture}</Meta><strong>{name}</strong><small>{kind}</small></div>
            <Score value={connection} /><Score value={benefit} tone="rust" /><Score value={evidence} tone="blue" />
            <div className="outcome"><strong>{outcome}</strong><small>{note}</small><button onClick={onGraph}>Open relationship graph <ArrowRight /></button></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Score({ value, tone = "" }) {
  return <div className={`score ${tone}`}><b>{value}</b><i><em style={{ width: `${value}%` }} /></i></div>;
}

function HistoryTab({ pack }) {
  return (
    <div className="detail-grid">
      <section className="analysis-block">
        <div className="block-title"><span><ClockCounterClockwise /></span><div><Meta>Narrative evolution</Meta><h2>Lineage and reactivation</h2></div></div>
        <div className="history-chart">
          {pack.history.map(([date, label, note, score], index) => (
            <article key={date}><time>{date}</time><span><i style={{ height: `${score}%` }} /><b>{score}</b></span><div><strong>{label}</strong><small>{note}</small></div>{index < pack.history.length - 1 ? <ArrowRight /> : null}</article>
          ))}
        </div>
      </section>
      <aside className="detail-rail">
        <section><Meta>Forecast scenarios</Meta><h3>Modeled spread</h3>{pack.forecast.map(([horizon, score, note]) => <div className="scenario" key={horizon}><span><strong>{score}%</strong><small>{horizon}</small></span><p>{note}</p></div>)}</section>
      </aside>
    </div>
  );
}

function EvidenceTab({ pack }) {
  return (
    <section className="analysis-block wide-block">
      <div className="block-title"><span><ShieldCheck /></span><div><Meta>Evidence ledger</Meta><h2>Sources and counter-record</h2></div></div>
      <div className="evidence-ledger">
        {pack.evidence.map(([title, publisher, kind], index) => <button key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{title}</strong><small>{publisher}</small></div><Meta>{kind}</Meta><ArrowRight /></button>)}
      </div>
    </section>
  );
}

function PackDetail({ pack, saved, toggleSaved, onBack, onGraph }) {
  const [tab, setTab] = useState("Brief");
  return (
    <main className="page detail-page">
      <button className="back-button" onClick={onBack}><ArrowLeft /> Back to explore</button>
      <PackHero pack={pack} saved={saved} toggleSaved={toggleSaved} />
      <nav className="detail-tabs">{["Brief", "Capital", "History", "Evidence"].map((item) => <button className={tab === item ? "active" : ""} key={item} onClick={() => setTab(item)}>{item}</button>)}</nav>
      {tab === "Brief" ? <BriefTab pack={pack} /> : null}
      {tab === "Capital" ? <CapitalTab pack={pack} onGraph={onGraph} /> : null}
      {tab === "History" ? <HistoryTab pack={pack} /> : null}
      {tab === "Evidence" ? <EvidenceTab pack={pack} /> : null}
    </main>
  );
}

function PacksView({ openPack }) {
  const [query, setQuery] = useState("");
  const visible = packs.filter((pack) => `${pack.title} ${pack.actor} ${pack.short}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <main className="page browse-page">
      <header className="page-heading"><div><p>Investigation catalog</p><h1>Narrative packs</h1><span>Browse the claim, evidence, propagation, counter-record, and capital model as one investigation.</span></div><label><MagnifyingGlass /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a narrative, actor, or event" /></label></header>
      <div className="catalog">
        {visible.map((pack) => <button key={pack.id} onClick={() => openPack(pack.id)}><CoverArt pack={pack} /><div><Meta>{pack.actor}</Meta><h2>{pack.title}</h2><p>{pack.short}</p><span><Meta tone="blue">{pack.posture}</Meta><Meta>{pack.sources} sources</Meta><Meta>+{pack.movement}% today</Meta></span></div><ArrowRight /></button>)}
      </div>
    </main>
  );
}

function OntologyBrowser() {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState("");
  useEffect(() => { fetch("/data/ontology.json").then((response) => response.json()).then(setData).catch(() => setData({ entities: [], relationships: [], meta: {} })); }, []);
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return (data?.entities || []).filter((entity) => !normalized || [entity.name, entity.id, entity.type, entity.regime, ...entity.countries].some((value) => value?.toLowerCase().includes(normalized))).slice(0, 8);
  }, [data, query]);
  return (
    <section className="ontology-browser">
      <Meta>Sourced ontology</Meta>
      <h3>{data ? `${data.meta.entityCount.toLocaleString()} entities` : "Loading records"}</h3>
      <label><MagnifyingGlass /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Entity, ID, country…" /></label>
      <div>{results.map((entity) => <a key={entity.id} href={entity.sourceUrl} target="_blank" rel="noreferrer"><span><strong>{entity.name}</strong><small>{entity.id} · {entity.type}</small></span><ArrowRight /></a>)}</div>
      {data ? <p>{data.meta.relationshipCount.toLocaleString()} explicit source relationships. The pack canvas above remains a focused analytical neighborhood.</p> : null}
    </section>
  );
}

function GraphView({ pack, setPackId }) {
  const [selected, setSelected] = useState(null);
  const [relationFilter, setRelationFilter] = useState("all");
  return (
    <main className="graph-page">
      <header className="graph-header">
        <div><Meta>Entity proximity graph</Meta><h1>{selected?.name || pack.title}</h1><p>Click an entity to recenter. Distance ranks explicit source mentions and shared sourced relationships.</p></div>
        <div className="graph-header-controls">
          <nav>{[["all", "All relations"], ["mention", "Direct mentions"], ["sanction", "Shared sanctions"], ["geography", "Geography"]].map(([id, label]) => <button className={relationFilter === id ? "active" : ""} key={id} onClick={() => setRelationFilter(id)}>{label}</button>)}</nav>
          <select value={pack.id} onChange={(event) => setPackId(event.target.value)}>{packs.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select>
        </div>
      </header>
      <div className="graph-shell">
        <GraphCanvas pack={pack} compact={window.innerWidth < 700} onSelection={setSelected} relationFilter={relationFilter} />
        <aside className="graph-legend">
          <Meta>Selected entity</Meta>
          <h2>{selected?.name || "Loading entity"}</h2>
          {selected ? <div className="selected-entity-meta"><span><strong>{selected.id} · {selected.type}</strong><small>{selected.position?.[0] || selected.regime}</small></span></div> : null}
          {[["source mention", "Entity is named in another official source record"], ["shared sanction", "Entities are subject to the same explicit sanction"], ["shared geography", "Entities share a sourced country association"], ["pack context", "Dashed analytical context; not a factual entity relation"]].map(([item, note], index) => <div key={item}><i className={index === 3 ? "scenario" : ""} /><span><strong>{item}</strong><small>{note}</small></span></div>)}
          <p>Proximity is a discovery aid. Shared sanctions or geography do not imply coordination, ownership, or common intent.</p>
        </aside>
      </div>
    </main>
  );
}

function LibraryView({ saved, openPack, toggleSaved }) {
  const savedPacks = packs.filter((pack) => saved.has(pack.id));
  return (
    <main className="page browse-page">
      <header className="page-heading"><div><p>Your research shelf</p><h1>Library</h1><span>Saved packs and monitored narratives stay available across sessions.</span></div></header>
      {savedPacks.length ? <div className="library-grid">{savedPacks.map((pack) => <article key={pack.id}><button onClick={() => openPack(pack.id)}><CoverArt pack={pack} /><span><Meta>{pack.actor}</Meta><h2>{pack.title}</h2><p>{pack.short}</p></span></button><button onClick={() => toggleSaved(pack.id)}><BookmarkSimple weight="fill" /> Remove</button></article>)}</div> : <div className="empty-state"><BookmarkSimple /><h2>Your shelf is empty</h2><p>Save a narrative pack to monitor its signals, evidence, and capital model here.</p></div>}
    </main>
  );
}

function Assistant({ query, pack, onClose, openPack, openGraph, onAsk }) {
  const demo = assistantDemos.find((item) => query.toLowerCase().includes(item.match)) || assistantDemos[0];
  return (
    <aside className="assistant">
      <header><div><Meta>Axial assistant</Meta><h2>{query}</h2></div><button onClick={onClose}><X /></button></header>
      <div className="assistant-thread">
        <p className="assistant-user">{query}</p>
        <div className="assistant-answer">
          <span><Sparkle weight="fill" /></span>
          <div><Meta>Axial analysis · {pack.sources} sources</Meta><h3>{pack.title}</h3><p>{demo.answer}</p></div>
        </div>
      </div>
      <div className="assistant-result-grid">
        <section><Meta>{demo.metricLabel}</Meta><strong>{demo.metric}</strong><small>{demo.forecast}</small></section>
        <section><Meta>Highest-value path</Meta><p>{demo.path}</p></section>
      </div>
      <section className="assistant-boundary"><Meta>Evidence boundary</Meta><p>{pack.boundary}</p></section>
      <section><Meta>Continue investigation</Meta><button onClick={() => { openPack(pack.id); onClose(); }}>Open full investigation <ArrowRight /></button><button onClick={() => { openGraph(); onClose(); }}>Trace relationship graph <ArrowRight /></button></section>
      <section className="assistant-prompts"><Meta>Seed prompts</Meta>{quickPrompts.map((item) => <button key={item} onClick={() => onAsk(item)}>{item}<ArrowRight /></button>)}</section>
    </aside>
  );
}

function CommandDock({ view, setView, onAsk }) {
  const [value, setValue] = useState("");
  const submit = (event) => { event.preventDefault(); if (value.trim()) { onAsk(value.trim()); setValue(""); } };
  return (
    <div className="command-dock">
      <form onSubmit={submit}><Sparkle /><input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Ask Axial or paste an article" /><button aria-label="Submit"><PaperPlaneTilt weight="fill" /></button></form>
      <nav>{navItems.map(([id, label, Icon]) => <button className={view === id ? "active" : ""} key={id} onClick={() => setView(id)}><Icon weight={view === id ? "fill" : "regular"} /><span>{label}</span></button>)}</nav>
    </div>
  );
}

export function App() {
  const initial = useMemo(() => new URLSearchParams(window.location.search), []);
  const initialView = initial.get("view") === "packs" ? "explore" : initial.get("view") === "library" ? "projects" : initial.get("view") || "home";
  const [view, setViewState] = useState(initialView);
  const [packId, setPackIdState] = useState(initial.get("pack") || "russian-energy");
  const [detail, setDetail] = useState(initial.get("detail") === "1");
  const [saved, setSaved] = useState(() => new Set(["russian-energy", "covert-influence"]));
  const [assistantQuery, setAssistantQuery] = useState("");
  const pack = useMemo(() => packs.find((item) => item.id === packId) || packs[0], [packId]);
  const route = (nextView, nextPack, nextDetail) => {
    const params = new URLSearchParams();
    if (nextView !== "home") params.set("view", nextView);
    if (nextPack !== "russian-energy") params.set("pack", nextPack);
    if (nextDetail) params.set("detail", "1");
    history.replaceState(null, "", `${location.pathname}${params.size ? `?${params}` : ""}`);
  };
  const setView = (next) => { setViewState(next); setDetail(false); route(next, packId, false); };
  const setPackId = (id) => { setPackIdState(id); route(view, id, false); };
  const openPack = (id) => { setPackIdState(id); setDetail(true); route(view, id, true); };
  const closeDetail = () => { setDetail(false); route(view, packId, false); };
  const toggleSaved = (id) => setSaved((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const assistantPack = useMemo(() => packs.find((item) => assistantQuery.toLowerCase().includes(item.title.toLowerCase().split(" ")[0])) || pack, [assistantQuery, pack]);

  return (
    <div className="app">
      <AppHeader onHome={() => setView("home")} />
      {detail ? <PackDetail pack={pack} saved={saved} toggleSaved={toggleSaved} onBack={closeDetail} onGraph={() => setView("graph")} /> : null}
      {!detail && view === "home" ? <HomeView openPack={openPack} setView={setView} saved={saved} toggleSaved={toggleSaved} /> : null}
      {!detail && view === "explore" ? <ExploreView openPack={openPack} /> : null}
      {!detail && view === "graph" ? <GraphView pack={pack} setPackId={setPackId} /> : null}
      {!detail && view === "projects" ? <ProjectsView /> : null}
      <CommandDock view={view} setView={setView} onAsk={setAssistantQuery} />
      {assistantQuery ? <Assistant query={assistantQuery} pack={assistantPack} onClose={() => setAssistantQuery("")} openPack={openPack} openGraph={() => setView("graph")} onAsk={setAssistantQuery} /> : null}
    </div>
  );
}
