export type EvidenceItem = {
  label: string;
  publisher: string;
  date: string;
  url: string;
  kind: "observation" | "counter-evidence" | "context";
};

export type EvolutionPoint = {
  date: string;
  label: string;
  detail: string;
  strength: number;
};

export type ForecastPoint = {
  horizon: string;
  probability: number;
  reach: string;
  condition: string;
};

export type ExposureItem = {
  name: string;
  kind: string;
  direction: "benefits" | "exposed" | "strategic";
  assessment: string;
  value: string;
  confidence: "high" | "medium" | "low";
  entityId?: string;
};

export type ConnectionItem = {
  from: string;
  relation: string;
  to: string;
  posture: "observed" | "documented" | "inferred";
};

export type CapitalEntityProfile = {
  name: string;
  kind: string;
  relation: string;
  posture: "documented" | "inferred" | "scenario";
  direction: "benefits" | "exposed" | "strategic";
  connectionScore: number;
  benefitScore: number;
  evidenceScore: number;
  estimatedBenefit: string;
  benefitBasis: string;
  scenario: string;
  entityId?: string;
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
  evolution: EvolutionPoint[];
  forecast: ForecastPoint[];
  exposures: ExposureItem[];
  connections: ConnectionItem[];
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
  kind: "politician" | "state-media" | "fact-check" | "government" | "threat-report" | "news-report";
  country: string;
  reach: string;
  velocity: number;
  confidence: number;
  signals: number;
  summary: string;
  analysis: string;
  keyDistinction: string;
  tags: string[];
};

const commonRussiaConnections: ConnectionItem[] = [
  { from: "Published claim", relation: "overlaps with", to: "Established Russian narrative", posture: "observed" },
  { from: "Established narrative", relation: "is amplified by", to: "State media and aligned channels", posture: "documented" },
  { from: "Aligned channels", relation: "can enter", to: "Western political commentary", posture: "inferred" },
];

export const narrativeClusters: NarrativeCluster[] = [
  {
    id: "ru-biolabs",
    title: "U.S.-supported laboratories in Ukraine are covert biological weapons infrastructure",
    actor: "Russian state-aligned information ecosystem",
    region: "Global",
    status: "active",
    confidence: "high",
    assessment: "A long-running narrative conflates documented U.S. support for Ukrainian public-health and threat-reduction laboratories with unsupported claims of a covert biological weapons program.",
    objective: "Reframe Russia's invasion as defensive and weaken trust in U.S. biosecurity programs.",
    claims: ["U.S.-funded laboratories are secret", "Dangerous pathogens imply weapons development", "Ukraine is a proxy biological threat"],
    tactics: ["conflation", "context omission", "fear appeal", "evidence laundering"],
    channels: ["official statements", "state media", "Telegram", "Western political commentary"],
    entityHints: ["RUS0001", "RUS0007"],
    evidence: [
      { label: "Russia's bioweapon conspiracy theory finds support in US", publisher: "Associated Press", date: "2022-03-18", url: "https://apnews.com/russias-bioweapon-conspiracy-theory-finds-support-in-us-0f535c2e136cacab85cfd269dc3124f2", kind: "observation" },
      { label: "China amplifies unsupported Russian claim of Ukraine biolabs", publisher: "Associated Press", date: "2022-03-11", url: "https://apnews.com/general-news-39eeee023efdf7ea59c4a20b7e018169", kind: "context" },
      { label: "Debunking Russian manipulations: recycled Tulsi Gabbard video", publisher: "Gwara Media", date: "2024-12-31", url: "https://gwaramedia.com/en/debunking-russian-manipulations-no-tulsi-gabbard-didnt-post-new-video-about-american-biolabs-in-ukraine/", kind: "observation" },
    ],
    counter: [
      { label: "Biological Threat Reduction Program Activities in Ukraine", publisher: "U.S. Department of Defense", date: "2022-03-11", url: "https://media.defense.gov/2022/Mar/11/2002954612/-1/-1/0/FACT-SHEET-THE-DEPARTMENT-OF-DEFENSE%27S-COOPERATIVE-THREAT-REDUCTION-PROGRAM-BIOLOGICAL-THREAT-REDUCTION-PROGRAM-ACTIVITIES-IN-UKRAINE.PDF", kind: "counter-evidence" },
      { label: "Social media posts misrepresent U.S.-Ukraine threat reduction program", publisher: "FactCheck.org", date: "2022-03-15", url: "https://www.factcheck.org/2022/03/social-media-posts-misrepresent-u-s-ukraine-threat-reduction-program/", kind: "counter-evidence" },
      { label: "Pentagon didn't admit there are U.S.-funded bioweapons labs", publisher: "PolitiFact", date: "2022-06-15", url: "https://www.politifact.com/factchecks/2022/jun/15/blog-posting/pentagon-didnt-admit-there-are-46-us-funded-biolab/", kind: "counter-evidence" },
    ],
    evolution: [
      { date: "Mar 2022", label: "Initial wartime surge", detail: "Russian officials and state media frame public-health labs as weapons sites.", strength: 74 },
      { date: "Mar 2022", label: "Western political pickup", detail: "The frame enters U.S. political and podcast ecosystems.", strength: 61 },
      { date: "Dec 2024", label: "Recycled video event", detail: "Older Gabbard remarks are presented as a new development.", strength: 38 },
      { date: "Jun 2026", label: "Declassification news cycle", detail: "Real records about foreign laboratory support reactivate the older weapons narrative.", strength: 86 },
    ],
    forecast: [
      { horizon: "24 hours", probability: 82, reach: "High", condition: "If clips omit the distinction between laboratories and weapons programs" },
      { horizon: "7 days", probability: 68, reach: "Cross-language", condition: "If Russian and PRC state media sustain coverage" },
      { horizon: "30 days", probability: 42, reach: "Persistent niche", condition: "If no further official release or major conflict event occurs" },
    ],
    exposures: [
      { name: "Russian strategic influence operations", kind: "Strategic beneficiary", direction: "strategic", assessment: "Narrative acceptance supports defensive-war framing and distrust of Western institutions.", value: "High non-financial value", confidence: "high" },
      { name: "Cooperative Threat Reduction programs", kind: "Program exposure", direction: "exposed", assessment: "Public distrust can increase political pressure on overseas biosecurity partnerships.", value: "$200M Ukraine program cited by DoD", confidence: "high" },
      { name: "Attention-driven commentary publishers", kind: "Revenue hypothesis", direction: "benefits", assessment: "High-conflict biosecurity content may produce short-term audience and advertising gains.", value: "Unquantified; requires publisher data", confidence: "low" },
    ],
    connections: commonRussiaConnections,
  },
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
    evolution: [
      { date: "2022", label: "Invasion framing", detail: "Responsibility shifted toward NATO and Kyiv.", strength: 72 },
      { date: "2024", label: "Negotiation frame", detail: "Military aid recast as preventing peace.", strength: 65 },
      { date: "May 2026", label: "Ultimatum cycle", detail: "Russian conditions described as a peace offer.", strength: 83 },
    ],
    forecast: [
      { horizon: "24 hours", probability: 73, reach: "Medium", condition: "Following negotiation or aid announcements" },
      { horizon: "7 days", probability: 77, reach: "High", condition: "If ceasefire talks remain unresolved" },
      { horizon: "30 days", probability: 64, reach: "Persistent", condition: "Narrative is structurally reusable" },
    ],
    exposures: [
      { name: "VTB Bank", kind: "Sanctioned financial institution", direction: "benefits", assessment: "Sanctions relief scenario could improve market access; narrative influence is not established.", value: "Scenario exposure only", confidence: "medium", entityId: "RUS0250" },
      { name: "PJSC Sberbank", kind: "Sanctioned financial institution", direction: "benefits", assessment: "Sanctions relief scenario could improve market access; narrative influence is not established.", value: "Scenario exposure only", confidence: "medium", entityId: "RUS0256" },
      { name: "European defense suppliers", kind: "Sector exposure", direction: "exposed", assessment: "Reduced support for military assistance could lower future order expectations.", value: "Direction only", confidence: "low" },
    ],
    connections: commonRussiaConnections,
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
    evidence: [{ label: "Disinfo: The EU funded the 2014 Maidan coup in Ukraine", publisher: "EUvsDisinfo", date: "2026-05-22", url: "https://euvsdisinfo.eu/report/the-eu-funded-the-2014-maidan-coup-in-ukraine/", kind: "observation" }],
    counter: [{ label: "Ukraine: Freedom in the World", publisher: "Freedom House", date: "current", url: "https://freedomhouse.org/country/ukraine/freedom-world", kind: "counter-evidence" }],
    evolution: [
      { date: "2014", label: "Origin", detail: "Protests reframed as externally orchestrated regime change.", strength: 90 },
      { date: "2022", label: "War justification", detail: "Legitimacy frame reused during full-scale invasion.", strength: 75 },
      { date: "2026", label: "Persistent recurrence", detail: "Frame remains available for current events.", strength: 52 },
    ],
    forecast: [{ horizon: "30 days", probability: 55, reach: "Persistent niche", condition: "Triggered by anniversaries and election coverage" }],
    exposures: [{ name: "Russian strategic influence operations", kind: "Strategic beneficiary", direction: "strategic", assessment: "Supports denial of Ukrainian political agency.", value: "High non-financial value", confidence: "high" }],
    connections: commonRussiaConnections,
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
      { label: "Fourth EEAS FIMI Threat Report", publisher: "EEAS", date: "2026-03-09", url: "https://www.eeas.europa.eu/eeas/4th-eeas-report-foreign-information-manipulation-and-interference-threats_en", kind: "context" },
    ],
    counter: [{ label: "Sanctions and attribution evidence in Treasury designation", publisher: "U.S. Treasury", date: "2024-09-13", url: "https://home.treasury.gov/news/press-releases/jy2580", kind: "counter-evidence" }],
    evolution: [
      { date: "2020", label: "Ecosystem model", detail: "Proxy sites and state media described as reinforcing pillars.", strength: 60 },
      { date: "2024", label: "Covert influence attribution", detail: "Treasury documents covert operational role.", strength: 88 },
      { date: "2026", label: "Adaptive infrastructure", detail: "EEAS reports resilient cross-platform behavior.", strength: 80 },
    ],
    forecast: [{ horizon: "7 days", probability: 66, reach: "Cross-platform", condition: "During high-salience geopolitical events" }],
    exposures: [{ name: "Proxy media operators", kind: "Operational beneficiary", direction: "benefits", assessment: "Covert funding and audience growth can create direct operating value.", value: "Requires case-level financial records", confidence: "medium" }],
    connections: commonRussiaConnections,
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
    evidence: [{ label: "How the PRC Seeks to Reshape the Global Information Environment", publisher: "U.S. Department of State", date: "2023-09-28", url: "https://2021-2025.state.gov/how-the-peoples-republic-of-china-seeks-to-reshape-the-global-information-environment/", kind: "observation" }],
    counter: [{ label: "Global media freedom indicators", publisher: "Reporters Without Borders", date: "current", url: "https://rsf.org/en/index", kind: "counter-evidence" }],
    evolution: [
      { date: "2017", label: "International expansion", detail: "Content partnerships and global distribution expand.", strength: 48 },
      { date: "2023", label: "Information environment assessment", detail: "State Department documents broad methods.", strength: 78 },
      { date: "2026", label: "Persistent infrastructure", detail: "Cross-platform distribution continues.", strength: 67 },
    ],
    forecast: [{ horizon: "30 days", probability: 71, reach: "Global", condition: "Around trade, technology, and sovereignty disputes" }],
    exposures: [{ name: "State-backed media partnerships", kind: "Distribution beneficiary", direction: "strategic", assessment: "Content-placement relationships can increase reach and legitimacy.", value: "Requires contract-level data", confidence: "medium" }],
    connections: [
      { from: "Official messaging", relation: "distributed through", to: "State media and content partnerships", posture: "documented" },
      { from: "Content partnerships", relation: "reach", to: "Regional audiences", posture: "inferred" },
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
    evidence: [{ label: "Fourth EEAS FIMI Threat Report", publisher: "EEAS", date: "2026-03-09", url: "https://www.eeas.europa.eu/eeas/4th-eeas-report-foreign-information-manipulation-and-interference-threats_en", kind: "observation" }],
    counter: [{ label: "DISARM framework", publisher: "DISARM Foundation", date: "current", url: "https://www.disarm.foundation/framework", kind: "counter-evidence" }],
    evolution: [
      { date: "2023", label: "Cross-platform playbooks", detail: "Operations documented across multiple services.", strength: 54 },
      { date: "2026", label: "Adaptive infrastructure", detail: "Disposable assets and proxies increase resilience.", strength: 81 },
    ],
    forecast: [{ horizon: "7 days", probability: 78, reach: "Variable", condition: "High-salience event creates an opportunity window" }],
    exposures: [{ name: "Platform trust and safety teams", kind: "Operational exposure", direction: "exposed", assessment: "Disposable infrastructure increases detection and enforcement costs.", value: "Unquantified operating cost", confidence: "high" }],
    connections: [{ from: "Disposable assets", relation: "coordinate across", to: "Platforms and messaging apps", posture: "documented" }],
  },
];

const russianCapitalCore: CapitalEntityProfile[] = [
  {
    name: "Yuriy Valentinovich Kovalchuk",
    kind: "Media-linked capital principal",
    relation: "Major shareholder of Bank Rossiya and National Media Group",
    posture: "documented",
    direction: "strategic",
    connectionScore: 92,
    benefitScore: 72,
    evidenceScore: 94,
    estimatedBenefit: "Strategic influence index: +18 to +31",
    benefitBasis: "Media reach, elite access, and policy-alignment scenario",
    scenario: "Higher narrative acceptance increases the strategic value of aligned media distribution; no direct cash gain is asserted.",
    entityId: "RUS0007",
  },
  {
    name: "Bank Rossiya",
    kind: "Sanctioned financial institution",
    relation: "Important stakes in National Media Group",
    posture: "documented",
    direction: "benefits",
    connectionScore: 86,
    benefitScore: 61,
    evidenceScore: 94,
    estimatedBenefit: "$40M-$180M modeled access value",
    benefitBasis: "Illustrative sanctions-relief and market-access sensitivity",
    scenario: "Estimate models the value of improved access under a policy-relief scenario, not revenue caused by the narrative.",
    entityId: "RUS0232",
  },
  {
    name: "Dmitry Konstantinovich Kiselyov",
    kind: "State-media executive",
    relation: "Head of Rossiya Segodnya",
    posture: "documented",
    direction: "strategic",
    connectionScore: 96,
    benefitScore: 69,
    evidenceScore: 98,
    estimatedBenefit: "Distribution leverage index: +22 to +36",
    benefitBasis: "Audience reach and agenda-setting scenario",
    scenario: "Benefit is modeled as strategic distribution leverage rather than personal financial profit.",
    entityId: "RUS0001",
  },
  {
    name: "Konstantin Valerevich Malofeev",
    kind: "Sanctioned capital and media-linked actor",
    relation: "Publicly supports Russian policy toward Ukraine",
    posture: "documented",
    direction: "strategic",
    connectionScore: 76,
    benefitScore: 58,
    evidenceScore: 82,
    estimatedBenefit: "Influence index: +12 to +24",
    benefitBasis: "Aligned-audience mobilization scenario",
    scenario: "Score reflects strategic alignment and audience value, not evidence of participation in this specific event.",
    entityId: "RUS0022",
  },
];

export const capitalProfiles: Record<string, CapitalEntityProfile[]> = {
  "ru-biolabs": [
    ...russianCapitalCore,
    {
      name: "Cooperative Threat Reduction programs",
      kind: "Public biosecurity program",
      relation: "Target of trust-degradation narrative",
      posture: "documented",
      direction: "exposed",
      connectionScore: 91,
      benefitScore: 78,
      evidenceScore: 95,
      estimatedBenefit: "$20M-$65M modeled program risk",
      benefitBasis: "Delay, review, and political-friction scenario",
      scenario: "Estimate represents possible program exposure if public acceptance produces funding or partnership friction.",
    },
    {
      name: "Attention-driven political publishers",
      kind: "Audience monetization segment",
      relation: "Can monetize high-conflict biosecurity coverage",
      posture: "scenario",
      direction: "benefits",
      connectionScore: 64,
      benefitScore: 71,
      evidenceScore: 36,
      estimatedBenefit: "$0.8M-$4.5M modeled attention value",
      benefitBasis: "Illustrative impressions and advertising conversion",
      scenario: "Requires publisher-level traffic and revenue data; current estimate is a market model only.",
    },
    {
      name: "PRC state-media distribution",
      kind: "Cross-language amplification infrastructure",
      relation: "Previously amplified the biolabs narrative",
      posture: "documented",
      direction: "strategic",
      connectionScore: 83,
      benefitScore: 62,
      evidenceScore: 90,
      estimatedBenefit: "Cross-language reach index: +16 to +29",
      benefitBasis: "Distribution and apparent corroboration scenario",
      scenario: "Models the strategic value of cross-language amplification, not financial profit.",
    },
    {
      name: "Platform trust and safety operations",
      kind: "Operational cost center",
      relation: "Must detect recycled and cross-platform content",
      posture: "inferred",
      direction: "exposed",
      connectionScore: 58,
      benefitScore: 45,
      evidenceScore: 61,
      estimatedBenefit: "$0.3M-$1.8M modeled response cost",
      benefitBasis: "Moderation, investigation, and incident-response workload",
      scenario: "Illustrative operating-cost exposure during a high-velocity cross-platform cycle.",
    },
  ],
  "ru-peace-victim-blame": [
    ...russianCapitalCore,
    {
      name: "VTB Bank",
      kind: "Government-affiliated financial institution",
      relation: "Sensitive to sanctions and market-access policy",
      posture: "documented",
      direction: "benefits",
      connectionScore: 74,
      benefitScore: 86,
      evidenceScore: 91,
      estimatedBenefit: "$0.8B-$2.4B modeled access value",
      benefitBasis: "Illustrative sanctions-relief and funding-cost sensitivity",
      scenario: "Estimate is a policy-relief scenario and does not imply VTB promoted the narrative.",
      entityId: "RUS0250",
    },
    {
      name: "PJSC Sberbank",
      kind: "Government-controlled financial institution",
      relation: "Sensitive to sanctions and market-access policy",
      posture: "documented",
      direction: "benefits",
      connectionScore: 73,
      benefitScore: 89,
      evidenceScore: 94,
      estimatedBenefit: "$1.2B-$3.8B modeled access value",
      benefitBasis: "Illustrative sanctions-relief and funding-cost sensitivity",
      scenario: "Estimate is a policy-relief scenario and does not imply Sberbank promoted the narrative.",
      entityId: "RUS0256",
    },
    {
      name: "Rostec",
      kind: "State-owned defense conglomerate",
      relation: "Sensitive to war duration and procurement",
      posture: "documented",
      direction: "exposed",
      connectionScore: 69,
      benefitScore: 81,
      evidenceScore: 91,
      estimatedBenefit: "$0.5B-$2.0B modeled order sensitivity",
      benefitBasis: "Illustrative procurement and conflict-duration scenario",
      scenario: "Direction depends on policy outcome; narrative participation is not asserted.",
      entityId: "RUS0238",
    },
    {
      name: "European defense suppliers",
      kind: "Sector exposure",
      relation: "Sensitive to continued European military support",
      posture: "scenario",
      direction: "exposed",
      connectionScore: 55,
      benefitScore: 77,
      evidenceScore: 45,
      estimatedBenefit: "$1B-$6B modeled order sensitivity",
      benefitBasis: "Illustrative multi-year procurement scenario",
      scenario: "Sector-level sensitivity only; requires company and contract-level modeling.",
    },
  ],
  "ru-maidan-coup": [
    ...russianCapitalCore,
    {
      name: "Bank Rossiya",
      kind: "Sanctioned financial institution",
      relation: "Linked to media capital and Crimea integration",
      posture: "documented",
      direction: "strategic",
      connectionScore: 84,
      benefitScore: 63,
      evidenceScore: 94,
      estimatedBenefit: "Legitimacy-support index: +15 to +27",
      benefitBasis: "Strategic legitimacy and policy-continuity scenario",
      scenario: "No direct profit from the narrative is asserted.",
      entityId: "RUS0232",
    },
  ],
  "ru-covert-influence": [
    ...russianCapitalCore,
    {
      name: "Proxy media operators",
      kind: "Operational beneficiary segment",
      relation: "Can receive funding and audience growth",
      posture: "documented",
      direction: "benefits",
      connectionScore: 93,
      benefitScore: 84,
      evidenceScore: 88,
      estimatedBenefit: "$5M-$25M modeled operating value",
      benefitBasis: "Case-level covert funding and audience-growth scenario",
      scenario: "Range is illustrative until contract, payment, and audience records are attached.",
    },
  ],
  "prc-global-discourse": [
    {
      name: "State-backed media partnerships",
      kind: "Distribution infrastructure",
      relation: "Carries preferred messaging into regional media",
      posture: "documented",
      direction: "strategic",
      connectionScore: 92,
      benefitScore: 78,
      evidenceScore: 86,
      estimatedBenefit: "Distribution leverage index: +24 to +38",
      benefitBasis: "Content placement and regional-reach scenario",
      scenario: "Strategic distribution value; contract-level financial benefit requires source records.",
    },
    {
      name: "PRC-linked technology platforms",
      kind: "Platform exposure segment",
      relation: "Potential distribution and data advantage",
      posture: "inferred",
      direction: "strategic",
      connectionScore: 61,
      benefitScore: 68,
      evidenceScore: 48,
      estimatedBenefit: "Data and reach index: +10 to +23",
      benefitBasis: "Distribution and targeting scenario",
      scenario: "No specific platform coordination is asserted.",
    },
  ],
  "fimi-adaptive-infrastructure": [
    {
      name: "Disposable influence infrastructure vendors",
      kind: "Operational beneficiary segment",
      relation: "Provides domains, accounts, and replacement assets",
      posture: "inferred",
      direction: "benefits",
      connectionScore: 74,
      benefitScore: 66,
      evidenceScore: 51,
      estimatedBenefit: "$1M-$8M modeled service value",
      benefitBasis: "Illustrative infrastructure-replacement demand",
      scenario: "Requires case-level vendor and payment evidence.",
    },
    {
      name: "Platform trust and safety operations",
      kind: "Operational cost center",
      relation: "Carries detection and enforcement cost",
      posture: "documented",
      direction: "exposed",
      connectionScore: 89,
      benefitScore: 82,
      evidenceScore: 91,
      estimatedBenefit: "$3M-$20M modeled response cost",
      benefitBasis: "Cross-platform detection and enforcement scenario",
      scenario: "Illustrative operating-cost exposure across affected platforms.",
    },
  ],
};

export const newsObservations: NewsObservation[] = [
  {
    id: "obs-biolabs-2026",
    title: "Gabbard releases records on 120+ U.S.-supported foreign biological laboratories",
    publisher: "Office of the Director of National Intelligence / reported coverage",
    published: "June 12, 2026",
    url: "https://www.rferl.org/a/us-biolabs-ukraine-funding-evidence-gabbard-dni/33779274.html",
    clusterId: "ru-biolabs",
    assessment: "A real disclosure about laboratory support is entering an information environment where 'laboratory' is often conflated with 'bioweapons program.'",
    posture: "reported",
    kind: "politician",
    country: "United States",
    reach: "4.8M est.",
    velocity: 94,
    confidence: 86,
    signals: 312,
    summary: "The release highlights U.S. funding for biological laboratories abroad, including Ukraine. The existence of supported laboratories is documented; that does not establish a biological weapons program.",
    analysis: "This event has high narrative-reactivation potential because it supplies authentic documents and emotionally salient pathogen language that can be detached from the threat-reduction context.",
    keyDistinction: "Documented laboratories and pathogen-security work are not evidence of covert weapons development.",
    tags: ["biolabs", "Ukraine", "biosecurity", "narrative reactivation"],
  },
  {
    id: "obs-biolabs-us-pickup",
    title: "Russia's bioweapon conspiracy theory finds support in the United States",
    publisher: "Associated Press",
    published: "March 18, 2022",
    url: "https://apnews.com/russias-bioweapon-conspiracy-theory-finds-support-in-us-0f535c2e136cacab85cfd269dc3124f2",
    clusterId: "ru-biolabs",
    assessment: "Reporting documents how a Russian wartime claim crossed into U.S. political commentary without establishing coordination between participants.",
    posture: "observed",
    kind: "news-report",
    country: "United States / Russia",
    reach: "3.1M est.",
    velocity: 72,
    confidence: 94,
    signals: 201,
    summary: "The AP traced the unsupported bioweapons framing from Russian officials into U.S. political discourse shortly after the full-scale invasion.",
    analysis: "This is the strongest historical analogue for the current reactivation event because it documents cross-ecosystem narrative pickup while carefully separating overlap from operational coordination.",
    keyDistinction: "Narrative overlap and amplification do not by themselves prove that a Western speaker is directed by a foreign state.",
    tags: ["cross-ecosystem pickup", "United States", "biolabs"],
  },
  {
    id: "obs-biolabs-prc-amplification",
    title: "China amplifies unsupported Russian claim of Ukraine biolabs",
    publisher: "Associated Press",
    published: "March 11, 2022",
    url: "https://apnews.com/general-news-39eeee023efdf7ea59c4a20b7e018169",
    clusterId: "ru-biolabs",
    assessment: "Observed cross-state amplification of an unsupported Russian claim.",
    posture: "observed",
    kind: "state-media",
    country: "China / Russia",
    reach: "Global",
    velocity: 67,
    confidence: 96,
    signals: 175,
    summary: "Chinese officials and state media amplified the Russian biolabs claim during the first weeks of the full-scale invasion.",
    analysis: "Cross-state amplification can rapidly expand language reach and make an origin narrative appear independently corroborated.",
    keyDistinction: "Repeated official claims are not independent evidence for the underlying weapons allegation.",
    tags: ["PRC amplification", "state media", "biolabs"],
  },
  {
    id: "obs-biolabs-recycled-video",
    title: "Older Gabbard biolabs remarks recirculate as a new development",
    publisher: "Gwara Media",
    published: "December 31, 2024",
    url: "https://gwaramedia.com/en/debunking-russian-manipulations-no-tulsi-gabbard-didnt-post-new-video-about-american-biolabs-in-ukraine/",
    clusterId: "ru-biolabs",
    assessment: "Fact-checking documents a recycled-media tactic that makes an older narrative artifact appear current.",
    posture: "observed",
    kind: "fact-check",
    country: "Ukraine / United States",
    reach: "410K est.",
    velocity: 54,
    confidence: 92,
    signals: 47,
    summary: "An older video was recirculated and presented as if it were a new statement, reactivating the existing biolabs narrative.",
    analysis: "Recycled clips lower the cost of narrative reactivation because they arrive with a recognizable speaker, an existing audience, and emotionally salient language.",
    keyDistinction: "The clip's recirculation date and the original statement date are separate facts.",
    tags: ["recycled media", "Gabbard", "reactivation"],
  },
  {
    id: "obs-russia-pillars",
    title: "Russia's disinformation ecosystem operates through reinforcing pillars",
    publisher: "U.S. Department of State",
    published: "August 5, 2020",
    url: "https://2021-2025.state.gov/russias-pillars-of-disinformation-and-propaganda-report/",
    clusterId: "ru-covert-influence",
    assessment: "A foundational threat assessment describing how official communication, state media, proxies, social media, and cyber-enabled activity reinforce one another.",
    posture: "reported",
    kind: "threat-report",
    country: "Russia",
    reach: "Policy audience",
    velocity: 28,
    confidence: 97,
    signals: 340,
    summary: "The report describes a layered information ecosystem rather than a single centralized publication channel.",
    analysis: "The pillar model is useful for tracing propagation because it asks analysts to look for reinforcement across channels while maintaining different evidence standards for each relationship.",
    keyDistinction: "Similar framing is a discovery signal; attribution still requires source, infrastructure, funding, or behavioral evidence.",
    tags: ["ecosystem model", "proxy media", "attribution"],
  },
  {
    id: "obs-peace-ultimatum",
    title: "Victim-blaming Kyiv while dressing up Russia's ultimatum as a peace offer",
    publisher: "EUvsDisinfo",
    published: "May 29, 2026",
    url: "https://euvsdisinfo.eu/victim-blaming-kyiv-while-dressing-up-russias-ultimatum-as-a-peace-offer/",
    clusterId: "ru-peace-victim-blame",
    assessment: "Observed example of the active peace and victim-blame narrative cluster.",
    posture: "observed",
    kind: "fact-check",
    country: "Russia / Ukraine",
    reach: "1.7M est.",
    velocity: 77,
    confidence: 91,
    signals: 148,
    summary: "The narrative presents Russian conditions as a peace offer and assigns responsibility for continued war to Kyiv.",
    analysis: "The framing is highly reusable around negotiations, aid decisions, and ceasefire proposals.",
    keyDistinction: "Describing an ultimatum as a peace offer does not establish that the other party is responsible for rejecting peace.",
    tags: ["peace talks", "victim blame", "Ukraine"],
  },
  {
    id: "obs-maidan",
    title: "The EU funded the 2014 Maidan coup in Ukraine",
    publisher: "EUvsDisinfo",
    published: "May 22, 2026",
    url: "https://euvsdisinfo.eu/report/the-eu-funded-the-2014-maidan-coup-in-ukraine/",
    clusterId: "ru-maidan-coup",
    assessment: "Observed repetition of a persistent legitimacy narrative.",
    posture: "observed",
    kind: "fact-check",
    country: "Russia / Ukraine",
    reach: "620K est.",
    velocity: 43,
    confidence: 88,
    signals: 62,
    summary: "The claim reframes Ukraine's 2014 protest movement as an externally funded coup.",
    analysis: "Persistent legitimacy narratives often reactivate during anniversaries, negotiations, and elections.",
    keyDistinction: "Foreign political support is not evidence that a domestic mass protest was externally controlled.",
    tags: ["Maidan", "legitimacy", "historical revisionism"],
  },
  {
    id: "obs-eeas-fimi",
    title: "Fourth EEAS report maps adaptive foreign information manipulation infrastructure",
    publisher: "European External Action Service",
    published: "March 9, 2026",
    url: "https://www.eeas.europa.eu/eeas/4th-eeas-report-foreign-information-manipulation-and-interference-threats_en",
    clusterId: "fimi-adaptive-infrastructure",
    assessment: "Threat report documenting adaptive, cross-platform FIMI infrastructure.",
    posture: "reported",
    kind: "threat-report",
    country: "European Union",
    reach: "Policy audience",
    velocity: 36,
    confidence: 96,
    signals: 214,
    summary: "The report describes cross-platform coordination, proxies, and disposable infrastructure.",
    analysis: "Infrastructure-focused analysis is essential because individual accounts and domains are frequently replaced.",
    keyDistinction: "Shared framing alone is not enough to establish coordination; infrastructure and behavioral evidence matter.",
    tags: ["FIMI", "infrastructure", "cross-platform"],
  },
  {
    id: "obs-treasury-rt",
    title: "Treasury exposes RT's covert global intelligence and influence operations",
    publisher: "U.S. Treasury",
    published: "September 13, 2024",
    url: "https://home.treasury.gov/news/press-releases/jy2580",
    clusterId: "ru-covert-influence",
    assessment: "Official attribution and sanctions evidence for covert influence activity.",
    posture: "reported",
    kind: "government",
    country: "Russia",
    reach: "Global",
    velocity: 58,
    confidence: 98,
    signals: 184,
    summary: "The designation documents a covert operational role alongside overt media activity.",
    analysis: "This is a high-confidence connection source because the relationship is explicitly asserted by an official designation.",
    keyDistinction: "A documented covert operation is different from mere editorial alignment.",
    tags: ["RT", "covert influence", "sanctions"],
  },
  {
    id: "obs-prc-info",
    title: "How the PRC seeks to reshape the global information environment",
    publisher: "U.S. Department of State",
    published: "September 28, 2023",
    url: "https://2021-2025.state.gov/how-the-peoples-republic-of-china-seeks-to-reshape-the-global-information-environment/",
    clusterId: "prc-global-discourse",
    assessment: "Official assessment of PRC information manipulation methods.",
    posture: "reported",
    kind: "government",
    country: "China",
    reach: "Global",
    velocity: 31,
    confidence: 93,
    signals: 126,
    summary: "The assessment describes propaganda, censorship, covert influence, and data-driven methods.",
    analysis: "The cluster is structural rather than event-specific and should be monitored through media partnerships and distribution infrastructure.",
    keyDistinction: "State-funded media activity is not automatically covert influence; source disclosure and operational behavior matter.",
    tags: ["PRC", "global discourse", "media influence"],
  },
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
