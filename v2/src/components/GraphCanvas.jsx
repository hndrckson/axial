import { Background, Controls, Handle, MarkerType, Position, ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";

const colors = { Individual: "#9b8cb8", Entity: "#7596ab", Ship: "#87918b", narrative: "#c65d43" };
const packRoots = { "russian-energy": "RUS0007", biolabs: "RUS0007", "peace-ultimatum": "RUS0001", "covert-influence": "RUS0007", "prc-discourse": "CHN0001", "adaptive-fimi": "RUS0001" };

function EntityNode({ data, selected }) {
  return (
    <div className={`graph-node ${selected ? "selected" : ""}`} style={{ "--node-color": colors[data.kind] || "#87918b" }}>
      <Handle type="target" position={Position.Left} />
      <span>{data.kind}</span>
      <strong>{data.label}</strong>
      <small>{data.meta}</small>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

function intersect(a = [], b = []) {
  const set = new Set(a);
  return b.filter((item) => set.has(item));
}

function relationBetween(root, entity) {
  const rootReason = `${root.reason} ${root.otherInformation}`.toLowerCase();
  const entityReason = `${entity.reason} ${entity.otherInformation}`.toLowerCase();
  if (entity.name.length > 7 && rootReason.includes(entity.name.toLowerCase())) return { label: "named in source record", score: 100, kind: "mention" };
  if (root.name.length > 7 && entityReason.includes(root.name.toLowerCase())) return { label: "names root in record", score: 96, kind: "mention" };
  const sharedSanctions = intersect(root.sanctions, entity.sanctions);
  if (sharedSanctions.length) return { label: `${sharedSanctions.length} shared sanction${sharedSanctions.length > 1 ? "s" : ""}`, score: 70 + sharedSanctions.length * 4, kind: "sanction" };
  const sharedCountries = intersect(root.countries, entity.countries);
  if (sharedCountries.length) return { label: `associated with ${sharedCountries[0]}`, score: 48, kind: "geography" };
  if (root.regime === entity.regime) return { label: "same designation regime", score: 32, kind: "sanction" };
  return null;
}

function position(index, total, compact) {
  const ring = index < 6 ? 0 : 1;
  const ringIndex = ring ? index - 6 : index;
  const ringTotal = ring ? Math.max(1, total - 6) : Math.min(6, total);
  const angle = (Math.PI * 2 * ringIndex) / ringTotal - Math.PI / 2;
  const radiusX = compact ? 220 + ring * 115 : 330 + ring * 175;
  const radiusY = compact ? 170 + ring * 95 : 235 + ring * 145;
  return { x: (compact ? 330 : 540) + Math.cos(angle) * radiusX, y: (compact ? 260 : 330) + Math.sin(angle) * radiusY };
}

function buildNeighborhood(data, selectedId, pack, compact, relationFilter) {
  const root = data.entities.find((entity) => entity.id === selectedId) || data.entities[0];
  const neighbors = data.entities
    .filter((entity) => entity.id !== root.id)
    .map((entity) => ({ entity, relation: relationBetween(root, entity) }))
    .filter((item) => item.relation && (relationFilter === "all" || item.relation.kind === relationFilter))
    .sort((a, b) => b.relation.score - a.relation.score)
    .slice(0, compact ? 9 : 15);

  const nodes = [{
    id: root.id,
    type: "entity",
    position: { x: compact ? 270 : 470, y: compact ? 220 : 290 },
    data: { label: root.name, kind: root.type, meta: `${root.id} · neighborhood root` },
  }, ...neighbors.map(({ entity, relation }, index) => ({
    id: entity.id,
    type: "entity",
    position: position(index, neighbors.length, compact),
    data: { label: entity.name, kind: entity.type, meta: `${entity.id} · proximity ${relation.score}` },
  })), {
    id: `narrative:${pack.id}`,
    type: "entity",
    position: compact ? { x: 285, y: 500 } : { x: 485, y: 660 },
    data: { label: pack.title, kind: "narrative", meta: "analytical context only" },
  }];

  const edges = neighbors.map(({ entity, relation }) => ({
    id: `${root.id}:${entity.id}`,
    source: root.id,
    target: entity.id,
    label: relation.label,
    markerEnd: { type: MarkerType.ArrowClosed, color: "#66747b", width: 10, height: 10 },
    style: { stroke: "#66747b", strokeWidth: Math.max(1, relation.score / 55) },
    labelStyle: { fill: "#a6abad", fontSize: 9 },
    labelBgStyle: { fill: "#0a0b0c", fillOpacity: 0.92 },
  }));
  let lateralCount = 0;
  for (let first = 0; first < neighbors.length && lateralCount < (compact ? 5 : 12); first += 1) {
    for (let second = first + 1; second < neighbors.length && lateralCount < (compact ? 5 : 12); second += 1) {
      const relation = relationBetween(neighbors[first].entity, neighbors[second].entity);
      if (!relation || relation.score < 78 || (relationFilter !== "all" && relation.kind !== relationFilter)) continue;
      edges.push({
        id: `lateral:${neighbors[first].entity.id}:${neighbors[second].entity.id}`,
        source: neighbors[first].entity.id,
        target: neighbors[second].entity.id,
        label: relation.label,
        style: { stroke: "#3e494e", strokeWidth: 0.8 },
        labelStyle: { fill: "#737c80", fontSize: 7 },
        labelBgStyle: { fill: "#0a0b0c", fillOpacity: 0.88 },
      });
      lateralCount += 1;
    }
  }
  edges.push({
    id: `context:${root.id}`,
    source: root.id,
    target: `narrative:${pack.id}`,
    label: "investigated in pack",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#8f7658" },
    style: { stroke: "#8f7658", strokeDasharray: "5 5" },
    labelStyle: { fill: "#b5a180", fontSize: 9 },
    labelBgStyle: { fill: "#0a0b0c", fillOpacity: 0.92 },
  });
  return { root, nodes, edges };
}

export function GraphCanvas({ pack, compact = false, onSelection, relationFilter = "all" }) {
  const [data, setData] = useState(null);
  const [selectedId, setSelectedId] = useState(packRoots[pack.id]);
  const [query, setQuery] = useState("");
  useEffect(() => { fetch("/data/ontology.json").then((response) => response.json()).then(setData); }, []);
  useEffect(() => setSelectedId(packRoots[pack.id]), [pack.id]);
  const graph = useMemo(() => data ? buildNeighborhood(data, selectedId, pack, compact, relationFilter) : { nodes: [], edges: [] }, [compact, data, pack, relationFilter, selectedId]);
  const [nodes, setNodes, onNodesChange] = useNodesState(graph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graph.edges);
  useEffect(() => { setNodes(graph.nodes); setEdges(graph.edges); onSelection?.(graph.root); }, [graph, onSelection, setEdges, setNodes]);
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized || !data) return [];
    return data.entities.filter((entity) => `${entity.name} ${entity.id} ${entity.type} ${entity.countries.join(" ")}`.toLowerCase().includes(normalized)).slice(0, 6);
  }, [data, query]);

  return (
    <div className="graph-canvas">
      <div className="graph-search">
        <label><MagnifyingGlass /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find entity to recenter…" /></label>
        {results.length ? <div>{results.map((entity) => <button key={entity.id} onClick={() => { setSelectedId(entity.id); setQuery(""); }}><strong>{entity.name}</strong><small>{entity.id} · {entity.type}</small></button>)}</div> : null}
      </div>
      {!data ? <div className="graph-loading">Loading entity relationships…</div> : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={{ entity: EntityNode }}
          fitView
          fitViewOptions={{ padding: compact ? 0.18 : 0.24 }}
          minZoom={0.18}
          maxZoom={1.8}
          nodesDraggable
          panOnDrag
          proOptions={{ hideAttribution: true }}
          onNodeClick={(_, node) => { if (!node.id.startsWith("narrative:")) setSelectedId(node.id); }}
        >
          <Background color="#25292c" gap={34} size={0.7} />
          <Controls position="bottom-right" showInteractive={false} />
        </ReactFlow>
      )}
    </div>
  );
}
