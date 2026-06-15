export type EvidenceItem = {
  label: string;
  publisher: string;
  date: string;
  url: string;
  kind: "observation" | "counter-evidence" | "context";
};

export type NarrativeCluster = {
  id: string;
  title: string;
  actor: string;
  region: string;
  status: "active" | "persistent" | "emerging";
  confidence: "high" | "medium";
  assessment: string;
  objective: string;
  claims: string[];
  tactics: string[];
  channels: string[];
  evidence: EvidenceItem[];
  counter: EvidenceItem[];
  entityHints: string[];
};

export type NewsObservation = {
  id: string;
  title: string;
  publisher: string;
  published: string;
  url: string;
  clusterId: string;
  assessment: string;
  posture: "observed" | "reported";
};

export const narrativeClusters: NarrativeCluster[] = [
  {
    id: "ru-peace-victim-blame",
    title: "Kyiv is responsible for prolonging the war",
    actor: "Russian state-aligned ecosystem",
    region: "Europe",
    status: "active",
    confidence: "high",
    assessment: "Recurring victim-blaming frame used to recast Russian aggression as a failed peace process caused by Ukraine and its partners.",
    objective: "Shift responsibility for the war and weaken support for Ukraine.",
    claims: ["Kyiv rejects peace", "Western partners prevent negotiations", "Russia is responding defensively"],
    tactics: ["victim blaming", "false equivalence", "context omission"],
    channels: ["state media", "diplomatic channels", "aligned websites", "social platforms"],
    entityHints: ["RUS0001", "RUS0007"],
    evidence: [
      { label: "Victim-blaming Kyiv while dressing up Russia's ultimatum as a peace offer", publisher: "EUvsDisinfo", date: "2026-05-29", url: "https://euvsdisinfo.eu/victim-blaming-kyiv-while-dressing-up-russias-ultimatum-as-a-peace-offer/", kind: "observation" },
      { label: "Russia's Pillars of Disinformation and Propaganda", publisher: "U.S. Department of State", date: "2020-08-05", url: "https://2021-2025.state.gov/russias-pillars-of-disinformation-and-propaganda-report/", kind: "context" },
    ],
    counter: [
      { label: "United Nations General Assembly resolutions on Ukraine", publisher: "United Nations", date: "current corpus", url: "https://www.un.org/en/ga/", kind: "counter-evidence" },
      { label: "EU sanctions against Russia explained", publisher: "Council of the European Union", date: "current", url: "https://www.consilium.europa.eu/en/policies/sanctions-against-russia/", kind: "counter-evidence" },
    ],
  },
  {
    id: "ru-maidan-coup",
    title: "Ukraine's 2014 revolution was a Western-funded coup",
    actor: "Russian state-aligned ecosystem",
    region: "Europe",
    status: "persistent",
    confidence: "high",
    assessment: "Long-running legitimacy attack that reframes a domestic protest movement as externally orchestrated regime change.",
    objective: "Deny Ukrainian political agency and legitimacy.",
    claims: ["The EU funded Maidan", "Ukraine has been externally controlled since 2014"],
    tactics: ["historical revisionism", "agency denial", "conspiracy framing"],
    channels: ["state media", "official statements", "aligned commentators"],
    entityHints: ["RUS0001"],
    evidence: [
      { label: "Disinfo: The EU funded the 2014 Maidan coup in Ukraine", publisher: "EUvsDisinfo", date: "2026-05-22", url: "https://euvsdisinfo.eu/report/the-eu-funded-the-2014-maidan-coup-in-ukraine/", kind: "observation" },
    ],
    counter: [
      { label: "Ukraine: Freedom in the World", publisher: "Freedom House", date: "current", url: "https://freedomhouse.org/country/ukraine/freedom-world", kind: "counter-evidence" },
    ],
  },
  {
    id: "ru-covert-influence",
    title: "Covert influence networks present state narratives as independent commentary",
    actor: "Russian state media and influence operators",
    region: "Global",
    status: "active",
    confidence: "high",
    assessment: "Publicly documented influence operations use covert funding, proxies, and cyber capabilities to disguise state direction.",
    objective: "Increase reach and credibility while obscuring attribution.",
    claims: ["Independent voices organically share the same framing"],
    tactics: ["covert funding", "proxy outlets", "cyber operations", "identity masking"],
    channels: ["video platforms", "influencers", "state media", "social accounts"],
    entityHints: ["RUS0001", "RUS0007"],
    evidence: [
      { label: "Treasury exposes RT's covert global intelligence and influence operations", publisher: "U.S. Treasury", date: "2024-09-13", url: "https://home.treasury.gov/news/press-releases/jy2580", kind: "observation" },
      { label: "Fourth EEAS Report on Foreign Information Manipulation and Interference Threats", publisher: "European External Action Service", date: "2026-03-09", url: "https://www.eeas.europa.eu/eeas/4th-eeas-report-foreign-information-manipulation-and-interference-threats_en", kind: "context" },
    ],
    counter: [
      { label: "Sanctions and attribution evidence in the Treasury designation", publisher: "U.S. Treasury", date: "2024-09-13", url: "https://home.treasury.gov/news/press-releases/jy2580", kind: "counter-evidence" },
    ],
  },
  {
    id: "prc-global-discourse",
    title: "PRC messaging seeks to reshape the global information environment",
    actor: "People's Republic of China information ecosystem",
    region: "Global",
    status: "persistent",
    confidence: "high",
    assessment: "The U.S. State Department describes a broad PRC effort using propaganda, censorship, data harvesting, and covert media influence.",
    objective: "Promote preferred governance narratives and reduce criticism.",
    claims: ["PRC governance offers a superior development model", "Criticism is foreign interference"],
    tactics: ["content placement", "censorship", "covert influence", "data-driven targeting"],
    channels: ["state media", "content partnerships", "diplomatic accounts", "platforms"],
    entityHints: [],
    evidence: [
      { label: "How the PRC Seeks to Reshape the Global Information Environment", publisher: "U.S. Department of State", date: "2023-09-28", url: "https://2021-2025.state.gov/how-the-peoples-republic-of-china-seeks-to-reshape-the-global-information-environment/", kind: "observation" },
    ],
    counter: [
      { label: "Global media freedom indicators", publisher: "Reporters Without Borders", date: "current", url: "https://rsf.org/en/index", kind: "counter-evidence" },
    ],
  },
  {
    id: "fimi-adaptive-infrastructure",
    title: "FIMI operations use disposable and cross-platform infrastructure",
    actor: "Multiple foreign information manipulation actors",
    region: "Global",
    status: "emerging",
    confidence: "high",
    assessment: "The latest EEAS threat report describes adaptive infrastructure, cross-platform coordination, and proxy behavior.",
    objective: "Maintain operational resilience and avoid attribution.",
    claims: ["Coordinated activity is spontaneous public opinion"],
    tactics: ["asset replacement", "cross-platform coordination", "proxy behavior"],
    channels: ["websites", "social platforms", "messaging apps", "synthetic media"],
    entityHints: [],
    evidence: [
      { label: "Fourth EEAS Report on Foreign Information Manipulation and Interference Threats", publisher: "European External Action Service", date: "2026-03-09", url: "https://www.eeas.europa.eu/eeas/4th-eeas-report-foreign-information-manipulation-and-interference-threats_en", kind: "observation" },
    ],
    counter: [
      { label: "DISARM framework for describing information manipulation", publisher: "DISARM Foundation", date: "current", url: "https://www.disarm.foundation/framework", kind: "counter-evidence" },
    ],
  },
];

export const newsObservations: NewsObservation[] = [
  { id: "obs-1", title: "Victim-blaming Kyiv while dressing up Russia's ultimatum as a peace offer", publisher: "EUvsDisinfo", published: "May 29, 2026", url: narrativeClusters[0].evidence[0].url, clusterId: "ru-peace-victim-blame", assessment: "Observed example of the active peace/victim-blame narrative cluster.", posture: "observed" },
  { id: "obs-2", title: "Disinfo: The EU funded the 2014 Maidan coup in Ukraine", publisher: "EUvsDisinfo", published: "May 22, 2026", url: narrativeClusters[1].evidence[0].url, clusterId: "ru-maidan-coup", assessment: "Observed repetition of a persistent legitimacy narrative.", posture: "observed" },
  { id: "obs-3", title: "Fourth EEAS Report on Foreign Information Manipulation and Interference Threats", publisher: "EEAS", published: "March 9, 2026", url: narrativeClusters[4].evidence[0].url, clusterId: "fimi-adaptive-infrastructure", assessment: "Threat report documenting adaptive, cross-platform FIMI infrastructure.", posture: "reported" },
  { id: "obs-4", title: "Treasury exposes RT's covert global intelligence and influence operations", publisher: "U.S. Treasury", published: "September 13, 2024", url: narrativeClusters[2].evidence[0].url, clusterId: "ru-covert-influence", assessment: "Official attribution and sanctions evidence for covert influence activity.", posture: "reported" },
  { id: "obs-5", title: "How the PRC Seeks to Reshape the Global Information Environment", publisher: "U.S. Department of State", published: "September 28, 2023", url: narrativeClusters[3].evidence[0].url, clusterId: "prc-global-discourse", assessment: "Official assessment of PRC information manipulation methods.", posture: "reported" },
];

export function findNarrative(query: string) {
  const normalized = query.toLowerCase();
  return narrativeClusters
    .map((cluster) => ({
      cluster,
      score: [cluster.title, cluster.actor, cluster.region, ...cluster.claims, ...cluster.tactics]
        .reduce((score, value) => score + value.toLowerCase().split(/\W+/).filter((word) => word.length > 4 && normalized.includes(word)).length, 0),
    }))
    .sort((a, b) => b.score - a.score)[0]?.cluster ?? narrativeClusters[0];
}
