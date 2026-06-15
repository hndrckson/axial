import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

export type OntologyEntity = {
  id: string;
  name: string;
  aliases: string[];
  type: string;
  regime: string;
  designationSource: string;
  sanctions: string[];
  countries: string[];
  position: string[];
  website: string[];
  parentCompany: string[];
  subsidiaries: string[];
  imoNumber: string[];
  dateDesignated: string;
  lastUpdated: string;
  reason: string;
  otherInformation: string;
  sourceUrl: string;
};

export type OntologyRelationship = {
  id: string;
  source: string;
  target: string;
  type: "designated-under" | "associated-with-country" | "subject-to" | "declared-parent";
  evidence: string;
  sourceUrl: string;
};

export type OntologyData = {
  meta: {
    sourceName: string;
    sourceUrl: string;
    sourceUpdated: string;
    generatedAt: string;
    entityCount: number;
    relationshipCount: number;
    methodology: string;
  };
  entities: OntologyEntity[];
  relationships: OntologyRelationship[];
  facets: {
    regimes: { name: string; count: number }[];
    types: { name: string; count: number }[];
    countries: { name: string; count: number }[];
    sanctions: { name: string; count: number }[];
  };
};

type OntologyContextValue = {
  data: OntologyData | null;
  loading: boolean;
  error: string | null;
  entityById: Map<string, OntologyEntity>;
  relationsBySource: Map<string, OntologyRelationship[]>;
  relationsByTarget: Map<string, OntologyRelationship[]>;
  facetLabels: Map<string, string>;
};

const OntologyContext = createContext<OntologyContextValue | null>(null);

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function OntologyProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OntologyData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/ontology.json")
      .then((response) => {
        if (!response.ok) throw new Error(`Ontology request failed (${response.status})`);
        return response.json() as Promise<OntologyData>;
      })
      .then(setData)
      .catch((reason: Error) => setError(reason.message));
  }, []);

  const value = useMemo<OntologyContextValue>(() => {
    const entityById = new Map<string, OntologyEntity>();
    const relationsBySource = new Map<string, OntologyRelationship[]>();
    const relationsByTarget = new Map<string, OntologyRelationship[]>();
    const facetLabels = new Map<string, string>();

    for (const entity of data?.entities ?? []) {
      entityById.set(entity.id, entity);
      facetLabels.set(`regime:${slug(entity.regime)}`, entity.regime);
      for (const country of entity.countries) facetLabels.set(`country:${slug(country)}`, country);
      for (const sanction of entity.sanctions) facetLabels.set(`sanction:${slug(sanction)}`, sanction);
    }
    for (const relation of data?.relationships ?? []) {
      relationsBySource.set(relation.source, [...(relationsBySource.get(relation.source) ?? []), relation]);
      relationsByTarget.set(relation.target, [...(relationsByTarget.get(relation.target) ?? []), relation]);
    }

    return {
      data,
      loading: !data && !error,
      error,
      entityById,
      relationsBySource,
      relationsByTarget,
      facetLabels,
    };
  }, [data, error]);

  return <OntologyContext.Provider value={value}>{children}</OntologyContext.Provider>;
}

export function useOntology() {
  const value = useContext(OntologyContext);
  if (!value) throw new Error("useOntology must be used within OntologyProvider");
  return value;
}

export function compactRegime(value: string) {
  return value
    .replace(/^The /, "")
    .replace(/ \(Sanctions\)/, "")
    .replace(/ \(Nuclear\)/, "")
    .replace(/ \(EU Exit\) Regulations \d{4}/, "")
    .replace(/ Regulations \d{4}/, "");
}

export function searchEntities(entities: OntologyEntity[], query: string, regime = "All", type = "All") {
  const normalized = query.trim().toLowerCase();
  return entities.filter((entity) => {
    if (regime !== "All" && entity.regime !== regime) return false;
    if (type !== "All" && entity.type !== type) return false;
    if (!normalized) return true;
    return [entity.id, entity.name, entity.regime, entity.type, ...entity.aliases, ...entity.countries, ...entity.sanctions]
      .some((value) => value.toLowerCase().includes(normalized));
  });
}

