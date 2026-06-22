/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the NEERVANA surveillance API. Empty → same-origin `/api`
   *  (proxied to the backend in dev). Set in production to the deployed API. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
