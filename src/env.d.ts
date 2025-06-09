/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_OPENROUTER_API_KEY: string;
	readonly VITE_ASSEMBLYAI_API_KEY: string;
	readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
