// ──────────────────────────────────────────────────────────────────────────
// Bilingual chrome strings (English / Punjabi-Gurmukhi). Data values stay
// numeric; only UI labels are translated so the EN/PA toggle is functional.
// ──────────────────────────────────────────────────────────────────────────
export type Lang = 'EN' | 'PA';

export interface Strings {
  govtLine: string;
  portalTitle: string;
  portalSub: string;
  login: string;
  textSize: string;
  language: string;
  highContrast: string;
  dispatches: string;
  surveillanceTitle: string;
  surveillanceSub: string;
  resourceTitle: string;
  resourceSub: string;
  colBlock: string;
  colS: string;
  colP: string;
  colCases: string;
  colWqi: string;
  colStatus: string;
  district: string;
  totals: string;
  legend: string;
  legendHint: string;
  statusSafe: string;
  statusWarning: string;
  statusCritical: string;
  t24: string;
  t7: string;
  tEpi: string;
  filterLabel: string;
  tipCases: string;
  tipWqi: string;
  tipTurbidity: string;
  tipPhc: string;
  essentialMeds: string;
  ors: string;
  zinc: string;
  antibiotics: string;
  bufferStock: string;
  activeCases: string;
  lastUpdated: string;
  selectHint: string;
  mapCaption: string;
}

export const STRINGS: Record<Lang, Strings> = {
  EN: {
    govtLine: 'Government of Punjab · Department of Health & Family Welfare',
    portalTitle: 'NEERVANA',
    portalSub: 'Integrated Epidemiological Surveillance System',
    login: 'Login: District Nodal Officer',
    textSize: 'Text Size',
    language: 'Language',
    highContrast: 'High Contrast',
    dispatches: 'Official Dispatches',
    surveillanceTitle: 'Surveillance Metrics',
    surveillanceSub: 'IDSP S & P Form Reporting',
    resourceTitle: 'Resource Allocation',
    resourceSub: 'Essential Medicine Stockpile · PHC-wise',
    colBlock: 'Block',
    colS: 'S-Form',
    colP: 'P-Form',
    colCases: 'Cases',
    colWqi: 'WQI',
    colStatus: 'Status',
    district: 'Patiala District',
    totals: 'District Total',
    legend: 'Map Legend',
    legendHint: 'Hover a marker for details · click to pin a block',
    statusSafe: 'Safe',
    statusWarning: 'Advisory',
    statusCritical: 'Critical',
    t24: 'Last 24 Hours',
    t7: 'Last 7 Days',
    tEpi: 'Epi-Week 22',
    filterLabel: 'Reporting Window',
    tipCases: 'Active Cases',
    tipWqi: 'Water Quality Index',
    tipTurbidity: 'Turbidity',
    tipPhc: 'Health Facility',
    essentialMeds: 'Essential Medicines',
    ors: 'ORS',
    zinc: 'Zinc',
    antibiotics: 'Antibiotics',
    bufferStock: 'of buffer stock',
    activeCases: 'active cases',
    lastUpdated: 'Last synced',
    selectHint: 'Select a block on the map',
    mapCaption: 'Block-level Disease & Water Quality Surveillance',
  },
  PA: {
    govtLine: 'ਪੰਜਾਬ ਸਰਕਾਰ · ਸਿਹਤ ਅਤੇ ਪਰਿਵਾਰ ਭਲਾਈ ਵਿਭਾਗ',
    portalTitle: 'ਨੀਰਵਾਨਾ',
    portalSub: 'ਏਕੀਕ੍ਰਿਤ ਮਹਾਂਮਾਰੀ ਨਿਗਰਾਨੀ ਪ੍ਰਣਾਲੀ',
    login: 'ਲੌਗਇਨ: ਜ਼ਿਲ੍ਹਾ ਨੋਡਲ ਅਫ਼ਸਰ',
    textSize: 'ਟੈਕਸਟ ਆਕਾਰ',
    language: 'ਭਾਸ਼ਾ',
    highContrast: 'ਉੱਚ ਕੰਟ੍ਰਾਸਟ',
    dispatches: 'ਸਰਕਾਰੀ ਸੂਚਨਾਵਾਂ',
    surveillanceTitle: 'ਨਿਗਰਾਨੀ ਅੰਕੜੇ',
    surveillanceSub: 'IDSP S ਅਤੇ P ਫਾਰਮ ਰਿਪੋਰਟਿੰਗ',
    resourceTitle: 'ਸਰੋਤ ਵੰਡ',
    resourceSub: 'ਜ਼ਰੂਰੀ ਦਵਾਈਆਂ ਦਾ ਭੰਡਾਰ · PHC ਅਨੁਸਾਰ',
    colBlock: 'ਬਲਾਕ',
    colS: 'S-ਫਾਰਮ',
    colP: 'P-ਫਾਰਮ',
    colCases: 'ਮਾਮਲੇ',
    colWqi: 'WQI',
    colStatus: 'ਸਥਿਤੀ',
    district: 'ਪਟਿਆਲਾ ਜ਼ਿਲ੍ਹਾ',
    totals: 'ਜ਼ਿਲ੍ਹਾ ਕੁੱਲ',
    legend: 'ਨਕਸ਼ਾ ਸੰਕੇਤ',
    legendHint: 'ਵੇਰਵੇ ਲਈ ਮਾਰਕਰ ਉੱਤੇ ਹੋਵਰ ਕਰੋ · ਪਿੰਨ ਲਈ ਕਲਿੱਕ ਕਰੋ',
    statusSafe: 'ਸੁਰੱਖਿਅਤ',
    statusWarning: 'ਚੇਤਾਵਨੀ',
    statusCritical: 'ਗੰਭੀਰ',
    t24: 'ਪਿਛਲੇ 24 ਘੰਟੇ',
    t7: 'ਪਿਛਲੇ 7 ਦਿਨ',
    tEpi: 'ਮਹਾਂਮਾਰੀ ਹਫ਼ਤਾ 22',
    filterLabel: 'ਰਿਪੋਰਟਿੰਗ ਮਿਆਦ',
    tipCases: 'ਸਰਗਰਮ ਮਾਮਲੇ',
    tipWqi: 'ਪਾਣੀ ਗੁਣਵੱਤਾ ਸੂਚਕ',
    tipTurbidity: 'ਗੰਦਲਾਪਣ',
    tipPhc: 'ਸਿਹਤ ਸਹੂਲਤ',
    essentialMeds: 'ਜ਼ਰੂਰੀ ਦਵਾਈਆਂ',
    ors: 'ORS',
    zinc: 'ਜ਼ਿੰਕ',
    antibiotics: 'ਐਂਟੀਬਾਇਓਟਿਕ',
    bufferStock: 'ਬਫ਼ਰ ਸਟਾਕ ਦਾ',
    activeCases: 'ਸਰਗਰਮ ਮਾਮਲੇ',
    lastUpdated: 'ਆਖਰੀ ਸਿੰਕ',
    selectHint: 'ਨਕਸ਼ੇ ਉੱਤੇ ਇੱਕ ਬਲਾਕ ਚੁਣੋ',
    mapCaption: 'ਬਲਾਕ-ਪੱਧਰੀ ਬਿਮਾਰੀ ਅਤੇ ਪਾਣੀ ਗੁਣਵੱਤਾ ਨਿਗਰਾਨੀ',
  },
};

// Official dispatches for the public notification ticker.
export const DISPATCHES: Record<Lang, string[]> = {
  EN: [
    'ALERT: High turbidity reported in Sanaur block — boiling-water advisory issued for affected wards.',
    'UPDATE: ORS stock replenished at Rajpura CHC; buffer restored to 82%.',
    'ADVISORY: Chlorination drive intensified across Samana sub-centres following coliform detection.',
    'NOTICE: Rapid Response Team deployed to Patran for door-to-door ADD surveillance.',
    'INFO: Nabha block water quality within safe limits — routine monitoring continues.',
    'DIRECTIVE: District Nodal Officer to review Epi-Week 22 IDSP returns by 1800 hrs.',
  ],
  PA: [
    'ਚੇਤਾਵਨੀ: ਸਨੌਰ ਬਲਾਕ ਵਿੱਚ ਉੱਚ ਗੰਦਲਾਪਣ — ਪ੍ਰਭਾਵਿਤ ਵਾਰਡਾਂ ਲਈ ਪਾਣੀ ਉਬਾਲਣ ਦੀ ਸਲਾਹ ਜਾਰੀ।',
    'ਅਪਡੇਟ: ਰਾਜਪੁਰਾ CHC ਵਿਖੇ ORS ਭੰਡਾਰ ਮੁੜ ਭਰਿਆ ਗਿਆ; ਬਫ਼ਰ 82% ਤੱਕ ਬਹਾਲ।',
    'ਸਲਾਹ: ਕੋਲੀਫਾਰਮ ਮਿਲਣ ਮਗਰੋਂ ਸਮਾਣਾ ਉਪ-ਕੇਂਦਰਾਂ ਵਿੱਚ ਕਲੋਰੀਨੇਸ਼ਨ ਤੇਜ਼ ਕੀਤੀ ਗਈ।',
    'ਸੂਚਨਾ: ਪਾਤੜਾਂ ਵਿੱਚ ਘਰ-ਘਰ ADD ਨਿਗਰਾਨੀ ਲਈ ਰੈਪਿਡ ਰਿਸਪਾਂਸ ਟੀਮ ਤਾਇਨਾਤ।',
    'ਜਾਣਕਾਰੀ: ਨਾਭਾ ਬਲਾਕ ਦਾ ਪਾਣੀ ਸੁਰੱਖਿਅਤ ਹੱਦਾਂ ਅੰਦਰ — ਨਿਯਮਤ ਨਿਗਰਾਨੀ ਜਾਰੀ।',
    'ਹਦਾਇਤ: ਜ਼ਿਲ੍ਹਾ ਨੋਡਲ ਅਫ਼ਸਰ 1800 ਵਜੇ ਤੱਕ ਮਹਾਂਮਾਰੀ ਹਫ਼ਤਾ 22 ਦੇ IDSP ਅੰਕੜੇ ਜਾਂਚਣ।',
  ],
};
