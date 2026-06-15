import { ArrowRight, ChatCircleDots, FileText, Folder, Graph, LinkSimple, Plus } from "@phosphor-icons/react";
import { useState } from "react";
import { projects } from "../data";

const itemIcons = { Notes: FileText, Links: LinkSimple, Chats: ChatCircleDots, Graphs: Graph };

function Meta({ children }) {
  return <span className="meta">{children}</span>;
}

function FolderCard({ project, open, onOpen }) {
  return (
    <article className={`project-folder ${open ? "open" : ""}`} style={{ "--project-accent": project.accent }}>
      <button className="folder-summary" onClick={onOpen}>
        <span className="folder-icon"><Folder weight="fill" /></span>
        <Meta>{project.updated}</Meta>
        <h2>{project.title}</h2>
        <p>{project.summary}</p>
        <div className="folder-counts">{Object.entries(project.items).map(([label, values]) => <span key={label}><b>{values.length}</b>{label}</span>)}</div>
      </button>
      <div className="folder-blocks">
        {Object.entries(project.items).map(([label, values]) => {
          const Icon = itemIcons[label];
          return <section key={label}><header><Icon /><strong>{label}</strong><small>{values.length}</small></header>{values.map((value) => <button key={value}>{value}<ArrowRight /></button>)}</section>;
        })}
      </div>
    </article>
  );
}

export function ProjectsView() {
  const [openId, setOpenId] = useState(projects[0].id);
  return (
    <main className="page projects-page">
      <header className="projects-heading"><div><p>Research workspace</p><h1>Projects</h1><span>Notes, links, assistant sessions, and saved graph neighborhoods stay together as an investigation develops.</span></div><button><Plus /> New project</button></header>
      <div className="project-masonry">
        {projects.map((project) => <FolderCard key={project.id} project={project} open={openId === project.id} onOpen={() => setOpenId(openId === project.id ? "" : project.id)} />)}
        <article className="project-note tall"><FileText /><Meta>Working note · Russian energy</Meta><h3>Policy language to monitor</h3><p>Separate statements about household price exposure from claims that enforcement is inherently ineffective. The former can be documented; the latter is the narrative frame being measured.</p><span>6 source links</span></article>
        <article className="project-note"><Graph /><Meta>Saved graph</Meta><h3>Commentary bridge</h3><p>19 entities · 31 sourced relationships</p><span>Biolabs reactivation map</span></article>
        <article className="project-note medium"><ChatCircleDots /><Meta>Assistant session</Meta><h3>Where does attribution become weak?</h3><p>Axial separated four sourced funding edges from nine proximity-only discovery signals.</p><span>12 messages</span></article>
      </div>
    </main>
  );
}
