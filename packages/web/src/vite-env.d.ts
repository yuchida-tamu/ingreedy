/// <reference types="vite/client" />

interface ViteTypeOptions {
  // この行を追加することで ImportMetaEnv の型を厳密にし、不明なキーを許可しないように
  // できます。
  // strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_APP_API_DOMAIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
