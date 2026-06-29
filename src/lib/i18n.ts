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
  loginTitle: string;
  loginPrompt: string;
  loginErrorEmpty: string;
  username: string;
  usernamePlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  loginButton: string;
  loginHint: string;
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
    loginTitle: 'Officer Login',
    loginPrompt: 'Enter your credentials to access the surveillance dashboard.',
    loginErrorEmpty: 'Username and password are required.',
    username: 'Username',
    usernamePlaceholder: 'Enter officer ID',
    password: 'Password',
    passwordPlaceholder: 'Enter password',
    loginButton: 'Sign In',
    loginHint: 'This is a demo login. Any non-empty credentials will work.',
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
    loginTitle: 'ਅਧਿਕਾਰੀ ਲੌਗਇਨ',
    loginPrompt: 'ਸਰਵੇਲੈਂਸ ਡੈਸ਼ਬੋਰਡ ਤੱਕ ਪਹੁੰਚ ਲਈ ਆਪਣੀਆਂ ਪ੍ਰਮਾਣਿਕਤਾ ਦਾਖਲ ਕਰੋ।',
    loginErrorEmpty: 'ਯੂਜ਼ਰ ਨੇਮ ਅਤੇ ਪਾਸਵਰਡ ਲਾਜ਼ਮੀ ਹਨ।',
    username: 'ਯੂਜ਼ਰ ਨੇਮ',
    usernamePlaceholder: 'ਅਧਿਕਾਰੀ ID ਦਾਖਲ ਕਰੋ',
    password: 'ਪਾਸਵਰਡ',
    passwordPlaceholder: 'ਪਾਸਵਰਡ ਦਾਖਲ ਕਰੋ',
    loginButton: 'ਸਾਇਨ ਇਨ',
    loginHint: 'ਇਹ ਡੈਮੋ ਲੌਗਇਨ ਹੈ। ਕੋਈ ਵੀ ਖਾਲੀ ਨਹੀਂ ਹੋਣ ਵਾਲੀ ਜਾਣਕਾਰੀ ਕੰਮ ਕਰੇਗੀ।',
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
