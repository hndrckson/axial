import {
  Background,
  Controls,
  Handle,
  MarkerType,
  Panel,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ArrowSquareOut, MagnifyingGlass, Minus, Plus } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { compactRegime, OntologyEntity, OntologyRelationship, searchEntities, useOntology } from "../ontology";
import { useAxialStore } from "../store";

const relationLabels: Record<OntologyRelationship["type"], string> = {
  "designated-under": "Designated under",
  "associated-with-country": "Associated country",
  "subject-to": "Subject to",
  "declared-parent": "Declared parent",
};

const relationColors: Record<OntologyRelationship["type"], string> = {
  "designated-under": "#9fabae",
  "associated-with-country": "#6f8fa5",
  "subject-to": "#9b755f",
  "declared-parent": "#8a7fa3",
};

type GraphNodeData = {
  label: string;
  meta: string;
  kind: "entity" | "regime" | "country" | "sanction";
  count?: number;
  expandable?: boolean;
};

function EvidenceNode({ data, selected }: NodeProps) {
  const item = data as GraphNodeData;
  return (
    <div className={`evidence-node ${item.kind} ${selected ? "selected" : ""}`}>
      <Handle type="target" position={Position.Left} />
      <span className="node-kind">{item.kind}</span>
      <strong>{item.label}</strong>
      <small>{item.meta}</small>
      {item.expandable ? <span className="node-expand">{item.count?.toLocaleString()} linked · click to expand</span> : null}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

function positionAround(index: number, total: number, radiusX: number, radiusY: number, centerX = 420, centerY = 300) {
  const angle = ((Math.PI * 2) / Math.max(total, 1)) * index - Math.PI / 2;
  return { x: centerX + Math.cos(angle) * radiusX, y: centerY + Math.sin(angle) * radiusY };
}

function buildGraph(
  selected: OntologyEntity,
  direct: OntologyRelationship[],
  expanded: Set<string>,
  relationsByTarget: Map<string, OntologyRelationship[]>,
  entityById: Map<string, OntologyEntity>,
  facetLabels: Map<string, string>,
  compact: boolean,
) {
  const nodes: Node[] = [{
    id: selected.id,
    position: compact ? { x: 180, y: 220 } : { x: 360, y: 250 },
    data: { label: selected.name, meta: `${selected.id} · ${selected.type}`, kind: "entity" } satisfies GraphNodeData,
    type: "evidence",
  }];
  const edges: Edge[] = [];
  const visibleRelations = direct.slice(0, 14);

  visibleRelations.forEach((relation, index) => {
    const targetEntity = entityById.get(relation.target);
    const targetKind = relation.target.startsWith("regime:")
      ? "regime"
      : relation.target.startsWith("country:")
        ? "country"
        : relation.target.startsWith("sanction:")
          ? "sanction"
          : "entity";
    const linked = relationsByTarget.get(relation.target) ?? [];
    const position = positionAround(
      index,
      visibleRelations.length,
      compact ? 190 : 330,
      compact ? 175 : 245,
      compact ? 240 : 420,
      compact ? 250 : 300,
    );
    nodes.push({
      id: relation.target,
      position,
      data: {
        label: targetEntity?.name ?? facetLabels.get(relation.target) ?? relation.target,
        meta: targetEntity ? `${targetEntity.id} · ${targetEntity.type}` : relationLabels[relation.type],
        kind: targetKind,
        count: linked.length,
        expandable: !targetEntity && linked.length > 1,
      } satisfies GraphNodeData,
      type: "evidence",
    });
    edges.push({
      id: relation.id,
      source: relation.source,
      target: relation.target,
      label: relationLabels[relation.type],
      data: { relation },
      markerEnd: { type: MarkerType.ArrowClosed, color: relationColors[relation.type], width: 12, height: 12 },
      style: { stroke: relationColors[relation.type], strokeWidth: 1.2 },
      labelStyle: { fill: "var(--muted)", fontSize: 9 },
      labelBgStyle: { fill: "var(--bg)" },
    });

    if (expanded.has(relation.target)) {
      linked
        .filter((linkedRelation) => linkedRelation.source !== selected.id)
        .slice(0, compact ? 8 : 12)
        .forEach((linkedRelation, linkedIndex, linkedRows) => {
          const linkedEntity = entityById.get(linkedRelation.source);
          if (!linkedEntity) return;
          const spread = positionAround(
            linkedIndex,
            linkedRows.length,
            compact ? 210 : 360,
            compact ? 165 : 270,
            position.x,
            position.y,
          );
          nodes.push({
            id: linkedEntity.id,
            position: spread,
            data: { label: linkedEntity.name, meta: `${linkedEntity.id} · ${linkedEntity.type}`, kind: "entity" } satisfies GraphNodeData,
            type: "evidence",
          });
          edges.push({
            id: linkedRelation.id,
            source: linkedEntity.id,
            target: relation.target,
            data: { relation: linkedRelation },
            markerEnd: { type: MarkerType.ArrowClosed, color: relationColors[linkedRelation.type], width: 10, height: 10 },
            style: { stroke: relationColors[linkedRelation.type], strokeWidth: 1 },
          });
        });
    }
  });

  return { nodes, edges };
}

function EntityInspector({ entity }: { entity: OntologyEntity | undefined }) {
  if (!entity) return <aside className="entity-inspector"><p>Select an entity to inspect its source record.</p></aside>;
  return (
    <aside className="entity-inspector">
      <div className="inspector-heading">
        <span className="section-label">Source record</span>
        <h2>{entity.name}</h2>
        <p>{entity.id} · {entity.type}</p>
      </div>
      <dl className="record-fields">
        <div><dt>Regime</dt><dd>{compactRegime(entity.regime)}</dd></div>
        <div><dt>Countries</dt><dd>{entity.countries.join(", ") || "Not stated"}</dd></div>
        <div><dt>Sanctions</dt><dd>{entity.sanctions.join(", ") || "Not stated"}</dd></div>
        <div><dt>Designated</dt><dd>{entity.dateDesignated || "Not stated"}</dd></div>
        <div><dt>Last updated</dt><dd>{entity.lastUpdated || "Not stated"}</dd></div>
        {entity.position.length ? <div><dt>Position</dt><dd>{entity.position.join(", ")}</dd></div> : null}
        {entity.aliases.length ? <div><dt>Aliases</dt><dd>{entity.aliases.slice(0, 5).join(", ")}</dd></div> : null}
      </dl>
      {entity.reason ? <section className="inspector-copy"><span className="section-label">UK statement of reasons</span><p>{entity.reason}</p></section> : null}
      {entity.otherInformation ? <section className="inspector-copy"><span className="section-label">Other information</span><p>{entity.otherInformation}</p></section> : null}
      <a className="source-link" href={entity.sourceUrl} target="_blank" rel="noreferrer">Open official source <ArrowSquareOut /></a>
    </aside>
  );
}

export function GraphWorkspace() {
  const { data, entityById, relationsBySource, relationsByTarget, facetLabels, loading, error } = useOntology();
  const { selectedEntityId, openEntity } = useAxialStore();
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [activeTypes, setActiveTypes] = useState<OntologyRelationship["type"][]>(Object.keys(relationLabels) as OntologyRelationship["type"][]);
  const compact = window.innerWidth < 760;
  const selected = entityById.get(selectedEntityId) ?? data?.entities[0];
  const searchResults = useMemo(() => searchEntities(data?.entities ?? [], query).slice(0, 40), [data, query]);
  const direct = useMemo(
    () => (relationsBySource.get(selected?.id ?? "") ?? []).filter((relation) => activeTypes.includes(relation.type)),
    [activeTypes, relationsBySource, selected?.id],
  );
  const graph = useMemo(
    () => selected ? buildGraph(selected, direct, expanded, relationsByTarget, entityById, facetLabels, compact) : { nodes: [], edges: [] },
    [compact, direct, entityById, expanded, facetLabels, relationsByTarget, selected],
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(graph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graph.edges);

  useEffect(() => { setNodes(graph.nodes); setEdges(graph.edges); }, [graph, setEdges, setNodes]);
  useEffect(() => { setExpanded(new Set()); }, [selected?.id]);

  if (loading) return <div className="loading-state">Loading sourced ontology…</div>;
  if (error || !selected) return <div className="loading-state">Ontology unavailable: {error || "No records"}</div>;

  return (
    <div className="graph-workspace">
      <aside className="graph-browser">
        <div className="browser-search">
          <MagnifyingGlass />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find entity, ID, country…" />
          {query ? <button onClick={() => setQuery("")}><XIcon /></button> : null}
        </div>
        <div className="browser-meta">{query ? `${searchResults.length} visible matches` : `${data?.meta.entityCount.toLocaleString()} records`}</div>
        <div className="entity-results">
          {searchResults.map((entity) => (
            <button className={entity.id === selected.id ? "entity-result active" : "entity-result"} key={entity.id} onClick={() => openEntity(entity.id)}>
              <strong>{entity.name}</strong>
              <span>{entity.id} · {entity.type}</span>
              <small>{compactRegime(entity.regime)}</small>
            </button>
          ))}
        </div>
        <div className="relation-filters">
          <span className="section-label">Visible relations</span>
          {(Object.keys(relationLabels) as OntologyRelationship["type"][]).map((type) => (
            <label key={type}>
              <input
                type="checkbox"
                checked={activeTypes.includes(type)}
                onChange={() => setActiveTypes((current) => current.includes(type) ? current.filter((item) => item !== type) : [...current, type])}
              />
              <i style={{ background: relationColors[type] }} />{relationLabels[type]}
            </label>
          ))}
        </div>
      </aside>
      <main className="graph-stage">
        <div className="graph-toolbar">
          <div><span className="section-label">Neighborhood</span><strong>{selected.name}</strong></div>
          <span>{nodes.length} nodes · {edges.length} sourced edges</span>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={{ evidence: EvidenceNode }}
          fitView
          fitViewOptions={{ padding: compact ? 0.12 : 0.22 }}
          minZoom={0.18}
          maxZoom={1.7}
          nodesDraggable
          panOnDrag
          proOptions={{ hideAttribution: true }}
          onNodeClick={(_, node) => {
            if (entityById.has(node.id)) openEntity(node.id);
            else setExpanded((current) => {
              const next = new Set(current);
              if (next.has(node.id)) next.delete(node.id); else next.add(node.id);
              return next;
            });
          }}
        >
          <Background gap={32} size={0.45} color="var(--graph-grid)" />
          <Controls position="bottom-right" showInteractive={false} />
          <Panel position="bottom-left" className="graph-instructions">
            Click a facet to expand · click an entity to recenter · drag to reorganize
          </Panel>
        </ReactFlow>
      </main>
      <EntityInspector entity={selected} />
    </div>
  );
}

function XIcon() {
  return <span aria-hidden>×</span>;
}
