/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string;
  // Diğer environment değişkenlerinizi buraya ekleyebilirsiniz
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 