// ──────────────────────────────────────────────────────────────────────────
// Bilingual strings for the ASHA field dashboard and the public villager
// advisory. Kept separate from the core Strings interface so the shared chrome
// contract stays untouched. Reuse core STRINGS (status, time windows, meds,
// district) for anything already translated there.
// ──────────────────────────────────────────────────────────────────────────
import type { Lang } from './i18n';
import type { Status } from './metrics';

export interface DashStrings {
  // ASHA dashboard
  ashaTitle: string;
  ashaSub: string;
  commandMap: string;
  villagerView: string;
  overview: string;
  newCases: string;
  recovered: string;
  avgWqi: string;
  stockHealth: string;
  sForms: string;
  pForms: string;
  blockStatusTitle: string;
  blockStatusSub: string;
  casesByBlockTitle: string;
  casesByBlockSub: string;
  wqiTrendTitle: string;
  wqiTrendSub: string;
  medicineTitle: string;
  medicineSub: string;
  dispatchesTitle: string;
  noDispatches: string;
  cases: string;
  clean: string;
  needsAttention: string;
  thresholdSafe: string;
  thresholdAdvisory: string;
  // Villager advisory
  villagerTitle: string;
  villagerSub: string;
  pickVillage: string;
  pickHint: string;
  changeVillage: string;
  yourPhc: string;
  helpLine: string;
  guidanceTitle: string;
  boilWater: string;
  useOrs: string;
  visitPhc: string;
  washHands: string;
  priority: string;
  forWorkers: string;
  loadingMsg: string;
  errorMsg: string;
  retry: string;
  updatedFrom: string;
  // Status headline + one-line plain guidance, keyed by status
  headline: Record<Status, string>;
  guidance: Record<Status, string>;
}

export const DASH: Record<Lang, DashStrings> = {
  EN: {
    ashaTitle: 'ASHA Field Dashboard',
    ashaSub: 'Block-level disease & water surveillance',
    commandMap: 'Command Map',
    villagerView: 'Villager Advisory',
    overview: 'District Overview',
    newCases: 'New cases',
    recovered: 'Recovered',
    avgWqi: 'Avg. water quality',
    stockHealth: 'Medicine stock',
    sForms: 'S-Forms',
    pForms: 'P-Forms',
    blockStatusTitle: 'Block Status',
    blockStatusSub: 'Disease & water quality by block',
    casesByBlockTitle: 'Active Cases by Block',
    casesByBlockSub: 'Suspected water-borne cases in window',
    wqiTrendTitle: 'Water Quality Trend',
    wqiTrendSub: 'District average across reporting windows',
    medicineTitle: 'Essential Medicine Stock',
    medicineSub: 'ORS · Zinc · Antibiotics, PHC-wise',
    dispatchesTitle: 'Official Dispatches',
    noDispatches: 'No dispatches in this window.',
    cases: 'cases',
    clean: 'cleaner',
    needsAttention: 'needs attention',
    thresholdSafe: 'Safe ≥ 70',
    thresholdAdvisory: 'Advisory ≥ 45',
    villagerTitle: 'Village Water & Health Advisory',
    villagerSub: 'Check your village. Simple advice for your family.',
    pickVillage: 'Choose your village',
    pickHint: 'Tap your village to see today’s advice',
    changeVillage: 'Change village',
    yourPhc: 'Your health centre',
    helpLine: 'Ask your ASHA worker for help.',
    guidanceTitle: 'What to do',
    boilWater: 'Boil water before drinking',
    useOrs: 'Use ORS if you have loose motions',
    visitPhc: 'Go to the health centre if sick',
    washHands: 'Wash hands with soap',
    priority: 'Do this first',
    forWorkers: 'Health workers',
    loadingMsg: 'Getting today’s advice…',
    errorMsg: 'Advice is not available right now. Please try again.',
    retry: 'Try again',
    updatedFrom: 'From',
    headline: {
      safe: 'Water is safe',
      warning: 'Take care',
      critical: 'Do not drink tap water',
    },
    guidance: {
      safe: 'Your village water is safe to drink. Keep washing hands.',
      warning: 'Boil water before drinking. Watch for stomach illness in children.',
      critical: 'Do not drink tap water — boil it first. Go to the health centre if anyone is sick.',
    },
  },
  PA: {
    ashaTitle: 'ਆਸ਼ਾ ਫੀਲਡ ਡੈਸ਼ਬੋਰਡ',
    ashaSub: 'ਬਲਾਕ-ਪੱਧਰੀ ਬਿਮਾਰੀ ਅਤੇ ਪਾਣੀ ਨਿਗਰਾਨੀ',
    commandMap: 'ਕਮਾਂਡ ਨਕਸ਼ਾ',
    villagerView: 'ਪਿੰਡ ਸਲਾਹ',
    overview: 'ਜ਼ਿਲ੍ਹਾ ਸੰਖੇਪ',
    newCases: 'ਨਵੇਂ ਮਾਮਲੇ',
    recovered: 'ਠੀਕ ਹੋਏ',
    avgWqi: 'ਔਸਤ ਪਾਣੀ ਗੁਣਵੱਤਾ',
    stockHealth: 'ਦਵਾਈ ਭੰਡਾਰ',
    sForms: 'S-ਫਾਰਮ',
    pForms: 'P-ਫਾਰਮ',
    blockStatusTitle: 'ਬਲਾਕ ਸਥਿਤੀ',
    blockStatusSub: 'ਬਲਾਕ ਅਨੁਸਾਰ ਬਿਮਾਰੀ ਅਤੇ ਪਾਣੀ ਗੁਣਵੱਤਾ',
    casesByBlockTitle: 'ਬਲਾਕ ਅਨੁਸਾਰ ਸਰਗਰਮ ਮਾਮਲੇ',
    casesByBlockSub: 'ਮਿਆਦ ਵਿੱਚ ਸ਼ੱਕੀ ਪਾਣੀ-ਜਨਿਤ ਮਾਮਲੇ',
    wqiTrendTitle: 'ਪਾਣੀ ਗੁਣਵੱਤਾ ਰੁਝਾਨ',
    wqiTrendSub: 'ਰਿਪੋਰਟਿੰਗ ਮਿਆਦਾਂ ਵਿੱਚ ਜ਼ਿਲ੍ਹਾ ਔਸਤ',
    medicineTitle: 'ਜ਼ਰੂਰੀ ਦਵਾਈ ਭੰਡਾਰ',
    medicineSub: 'ORS · ਜ਼ਿੰਕ · ਐਂਟੀਬਾਇਓਟਿਕ, PHC ਅਨੁਸਾਰ',
    dispatchesTitle: 'ਸਰਕਾਰੀ ਸੂਚਨਾਵਾਂ',
    noDispatches: 'ਇਸ ਮਿਆਦ ਵਿੱਚ ਕੋਈ ਸੂਚਨਾ ਨਹੀਂ।',
    cases: 'ਮਾਮਲੇ',
    clean: 'ਸਾਫ਼',
    needsAttention: 'ਧਿਆਨ ਲੋੜੀਂਦਾ',
    thresholdSafe: 'ਸੁਰੱਖਿਅਤ ≥ 70',
    thresholdAdvisory: 'ਚੇਤਾਵਨੀ ≥ 45',
    villagerTitle: 'ਪਿੰਡ ਪਾਣੀ ਅਤੇ ਸਿਹਤ ਸਲਾਹ',
    villagerSub: 'ਆਪਣਾ ਪਿੰਡ ਵੇਖੋ। ਪਰਿਵਾਰ ਲਈ ਸੌਖੀ ਸਲਾਹ।',
    pickVillage: 'ਆਪਣਾ ਪਿੰਡ ਚੁਣੋ',
    pickHint: 'ਅੱਜ ਦੀ ਸਲਾਹ ਵੇਖਣ ਲਈ ਆਪਣੇ ਪਿੰਡ ’ਤੇ ਟੈਪ ਕਰੋ',
    changeVillage: 'ਪਿੰਡ ਬਦਲੋ',
    yourPhc: 'ਤੁਹਾਡਾ ਸਿਹਤ ਕੇਂਦਰ',
    helpLine: 'ਮਦਦ ਲਈ ਆਪਣੀ ਆਸ਼ਾ ਵਰਕਰ ਨੂੰ ਪੁੱਛੋ।',
    guidanceTitle: 'ਕੀ ਕਰਨਾ ਹੈ',
    boilWater: 'ਪੀਣ ਤੋਂ ਪਹਿਲਾਂ ਪਾਣੀ ਉਬਾਲੋ',
    useOrs: 'ਦਸਤ ਲੱਗਣ ’ਤੇ ORS ਵਰਤੋ',
    visitPhc: 'ਬੀਮਾਰ ਹੋਣ ’ਤੇ ਸਿਹਤ ਕੇਂਦਰ ਜਾਓ',
    washHands: 'ਸਾਬਣ ਨਾਲ ਹੱਥ ਧੋਵੋ',
    priority: 'ਪਹਿਲਾਂ ਇਹ ਕਰੋ',
    forWorkers: 'ਸਿਹਤ ਕਰਮਚਾਰੀ',
    loadingMsg: 'ਅੱਜ ਦੀ ਸਲਾਹ ਲੈ ਰਹੇ ਹਾਂ…',
    errorMsg: 'ਸਲਾਹ ਇਸ ਵੇਲੇ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    retry: 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ',
    updatedFrom: 'ਸਰੋਤ',
    headline: {
      safe: 'ਪਾਣੀ ਸੁਰੱਖਿਅਤ ਹੈ',
      warning: 'ਸਾਵਧਾਨ ਰਹੋ',
      critical: 'ਟੂਟੀ ਦਾ ਪਾਣੀ ਨਾ ਪੀਓ',
    },
    guidance: {
      safe: 'ਤੁਹਾਡੇ ਪਿੰਡ ਦਾ ਪਾਣੀ ਪੀਣ ਲਈ ਸੁਰੱਖਿਅਤ ਹੈ। ਹੱਥ ਧੋਂਦੇ ਰਹੋ।',
      warning: 'ਪੀਣ ਤੋਂ ਪਹਿਲਾਂ ਪਾਣੀ ਉਬਾਲੋ। ਬੱਚਿਆਂ ਵਿੱਚ ਪੇਟ ਦੀ ਬਿਮਾਰੀ ਵੱਲ ਧਿਆਨ ਦਿਓ।',
      critical: 'ਟੂਟੀ ਦਾ ਪਾਣੀ ਨਾ ਪੀਓ — ਪਹਿਲਾਂ ਉਬਾਲੋ। ਕੋਈ ਬੀਮਾਰ ਹੋਵੇ ਤਾਂ ਸਿਹਤ ਕੇਂਦਰ ਜਾਓ।',
    },
  },
};
