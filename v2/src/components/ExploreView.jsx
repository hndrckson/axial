import {
  ArrowRight,
  CirclesThreePlus,
  ClockCounterClockwise,
  Coins,
  Database,
  Graph,
  MagnifyingGlass,
  Newspaper,
  Pulse,
  ShieldCheck,
  Target,
  TrendUp,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { packs, techniques } from "../data";

const icons = {
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

function PackThumb({ pack }) {
  return <span className="explore-pack-thumb"><img src={pack.cover} alt="" /><span>AXIAL</span><strong>{pack.title}</strong></span>;
}

function TechniqueTags({ pack, selected }) {
  return (
    <div className="inline-techniques">
      {techniques.filter((item) => item.packIds.includes(pack.id)).map((item) => {
        const Icon = icons[item.id] || Target;
        return <span className={selected === item.id ? "active" : ""} key={item.id}><Icon />{item.label}</span>;
      })}
    </div>
  );
}

function EntityExplorer({ data }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return (data?.entities || []).filter((entity) => !normalized || [entity.name, entity.id, entity.type, entity.regime, ...entity.countries].some((value) => value?.toLowerCase().includes(normalized))).slice(0, 12);
  }, [data, query]);
  return (
    <section className="entity-explorer">
      <header>
        <div><Meta>Sourced entity database</Meta><h2>{data ? `${data.meta.entityCount.toLocaleString()} entities, ${data.meta.relationshipCount.toLocaleString()} explicit relationships` : "Loading source records"}</h2></div>
        <label><MagnifyingGlass /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search entity, ID, regime, or country" /></label>
      </header>
      <div className="entity-result-grid">
        {results.map((entity) => <a key={entity.id} href={entity.sourceUrl} target="_blank" rel="noreferrer"><Database /><span><Meta>{entity.id} · {entity.type}</Meta><strong>{entity.name}</strong><small>{entity.position?.[0] || entity.countries.join(" / ") || entity.regime}</small></span><b>{entity.sanctions.length}<small>sanctions</small></b><ArrowRight /></a>)}
      </div>
      <p>Current production seed is a reproducible UK Sanctions List slice. Factual relationships are limited to explicit source fields; inferred analytical links remain separate.</p>
    </section>
  );
}

function CapitalExplorer({ openPack }) {
  const rows = packs.flatMap((pack) => pack.capital.slice(0, 2).map((item) => ({ pack, item }))).sort((a, b) => b.item[4] - a.item[4]);
  return (
    <section className="explore-capital">
      <header><Meta>Modeled outcome sensitivity</Meta><h2>Capital entities across active narratives</h2><p>Benefit sensitivity is a forecast variable, not an attribution claim.</p></header>
      <div>{rows.map(({ pack, item }) => <button key={`${pack.id}:${item[0]}`} onClick={() => openPack(pack.id)}><Coins /><span><Meta>{pack.title}</Meta><strong>{item[0]}</strong><small>{item[7]}</small></span><b>{item[4]}<small>benefit</small></b><ArrowRight /></button>)}</div>
    </section>
  );
}

export function ExploreView({ openPack }) {
  const [active, setActive] = useState("all");
  const [data, setData] = useState(null);
  useEffect(() => { fetch("/data/ontology.json").then((response) => response.json()).then(setData).catch(() => setData({ entities: [], relationships: [], meta: { entityCount: 0, relationshipCount: 0 } })); }, []);
  const activeTechnique = techniques.find((item) => item.id === active);
  const visible = activeTechnique ? packs.filter((pack) => activeTechnique.packIds.includes(pack.id)) : packs;
  const chips = [
    ["all", "Active narratives", Pulse],
    ["entities", data ? `${data.meta.entityCount.toLocaleString()} entities` : "Entity database", Database],
    ["capital", "Capital beneficiaries", Coins],
    ...techniques.map((item) => [item.id, item.label, icons[item.id] || Target]),
  ];
  const FocusIcon = icons[activeTechnique?.id] || Target;

  return (
    <main className="page explore-page">
      <header className="explore-heading"><div><p>Fact-checking, rebuilt as an investigation</p><h1>Explore</h1><span>Move from a published claim to its lineage, propagation, entity neighborhood, capital exposure, and counter-record.</span></div></header>
      <nav className="explore-chips" aria-label="Explore filters">
        {chips.map(([id, label, Icon]) => <button className={active === id ? "active" : ""} key={id} onClick={() => setActive(id)}><Icon weight={active === id ? "fill" : "regular"} />{label}</button>)}
      </nav>

      {active === "entities" ? <EntityExplorer data={data} /> : null}
      {active === "capital" ? <CapitalExplorer openPack={openPack} /> : null}
      {activeTechnique ? <section className="technique-focus"><div className="technique-focus-icon"><FocusIcon /></div><div><Meta>Propaganda technique</Meta><h2>{activeTechnique.label}</h2><p>{activeTechnique.description}</p><blockquote>{activeTechnique.example}</blockquote></div></section> : null}
      {active !== "entities" && active !== "capital" ? (
        <section className="explore-feed">
          <header><Meta>{activeTechnique ? `${visible.length} matching investigations` : "Live investigation feed"}</Meta><h2>{activeTechnique ? `Narratives using ${activeTechnique.label.toLowerCase()}` : "What is moving now"}</h2></header>
          <div className="explore-list">
            {visible.map((pack) => <button key={pack.id} onClick={() => openPack(pack.id)}><PackThumb pack={pack} /><span className="explore-pack-copy"><Meta>{pack.actor}</Meta><h3>{pack.title}</h3><p>{pack.short}</p><span className="explore-pack-stats"><span><ShieldCheck />{pack.posture}</span><span>{pack.sources} sources</span><span>+{pack.movement}% today</span></span><TechniqueTags pack={pack} selected={activeTechnique?.id} /></span><ArrowRight /></button>)}
          </div>
        </section>
      ) : null}
    </main>
  );
}
