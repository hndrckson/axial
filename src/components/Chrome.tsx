import {
  Bell,
  ChartScatter,
  Compass,
  Folder,
  House,
  Link,
  Moon,
  PaperPlaneTilt,
  Sun,
  X,
} from "@phosphor-icons/react";
import { FormEvent, ReactNode, useState } from "react";
import { findNarrative, narrativeClusters } from "../intelligence";
import { searchEntities, useOntology } from "../ontology";
import { Tab, useAxialStore } from "../store";

const tabs: { label: Tab; icon: ReactNode }[] = [
  { label: "Home", icon: <House /> },
  { label: "Explore", icon: <Compass /> },
  { label: "Graph", icon: <ChartScatter /> },
  { label: "Projects", icon: <Folder /> },
];

export function Header() {
  const { theme, setTheme } = useAxialStore();
  const { data, loading } = useOntology();
  return (
    <header className="app-header">
      <div className="brand"><span className="brand-mark" />Axial</div>
      <div className="source-status">
        <span className={loading ? "status-dot loading" : "status-dot"} />
        {loading ? "Loading ontology" : `${data?.meta.entityCount.toLocaleString()} entities · ${narrativeClusters.length} narrative clusters`}
      </div>
      <div className="header-actions">
        <button className="icon-button" aria-label="Notifications"><Bell /></button>
        <button
          className="icon-button"
          aria-label={`Use ${theme === "dark" ? "light" : "dark"} theme`}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun /> : <Moon />}
        </button>
        <span className="profile">NS</span>
      </div>
    </header>
  );
}

export function Navigation() {
  const { activeTab, setActiveTab } = useAxialStore();
  return (
    <nav className="navigation" aria-label="Primary navigation">
      {tabs.map((tab) => (
        <button className={activeTab === tab.label ? "nav-item active" : "nav-item"} key={tab.label} onClick={() => setActiveTab(tab.label)}>
          {tab.icon}<span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

type ComposerProps = {
  onSubmit: (value: string, isUrl: boolean) => void;
  context: string;
};

export function CommandDock({ onSubmit, context }: ComposerProps) {
  const [value, setValue] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const clean = value.trim();
    if (!clean) return;
    onSubmit(clean, /^https?:\/\//i.test(clean));
    setValue("");
  };
  return (
    <div className="command-dock">
      <form className="composer" onSubmit={submit}>
        <Link />
        <input
          aria-label="Ask Axial or paste a URL"
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ask about a narrative, entity, or paste article URL"
          value={value}
        />
        <span className="composer-context">{context}</span>
        <button className="send-button" type="submit" aria-label="Search"><PaperPlaneTilt weight="fill" /></button>
      </form>
      <Navigation />
    </div>
  );
}

export function AssistantDrawer({ query, isUrl, onClose }: { query: string; isUrl: boolean; onClose: () => void }) {
  const { data } = useOntology();
  const { openEntity, openNarrative } = useAxialStore();
  const results = searchEntities(data?.entities ?? [], query).slice(0, 8);
  const narrative = findNarrative(query);
  let hostname = "";
  if (isUrl) {
    try { hostname = new URL(query).hostname; } catch { hostname = query; }
  }

  return (
    <aside className="assistant-drawer" aria-label="Axial command result">
      <div className="drawer-header">
        <div><span className="section-label">Command result</span><h2>{isUrl ? hostname : query}</h2></div>
        <button className="icon-button" onClick={onClose} aria-label="Close"><X /></button>
      </div>
      {isUrl ? (
        <div className="notice">
          Live article extraction is not connected in this local build. The mapping below is a keyword hypothesis, not attribution.
        </div>
      ) : null}
      <div className="drawer-section">
        <span className="section-label">Closest narrative hypothesis</span>
        <button className="narrative-result" onClick={() => { openNarrative(narrative.id); onClose(); }}>
          <strong>{narrative.title}</strong>
          <span>{narrative.actor} · {narrative.confidence} confidence in the curated seed corpus</span>
          <small>{narrative.assessment}</small>
        </button>
      </div>
      <div className="drawer-section">
        <span className="section-label">Ontology matches</span>
        {results.length ? results.map((entity) => (
          <button className="result-row" key={entity.id} onClick={() => { openEntity(entity.id); onClose(); }}>
            <span><strong>{entity.name}</strong><small>{entity.id} · {entity.type}</small></span>
            <span>{entity.countries[0] || "—"}</span>
          </button>
        )) : <p>No sourced entity match. Try a name, country, sanctions regime, or entity ID.</p>}
      </div>
      <div className="drawer-section source-note">
        <span className="section-label">Evidence posture</span>
        <p>{narrativeClusters.length} curated narrative clusters are kept separate from the factual entity graph. No intent, coordination, or capital benefit is promoted to fact without evidence.</p>
      </div>
    </aside>
  );
}
