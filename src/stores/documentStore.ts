import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface DocumentChunk {
	id: string;
	content: string;
	startIndex: number;
	endIndex: number;
	tokenCount: number;
}

export interface DocumentMetadata {
	pageCount?: number;
	wordCount: number;
	characterCount: number;
	uploadTime: Date;
	lastAccessed: Date;
	parseTime: number; // milliseconds taken to parse
	preview: string; // first 200 characters
	summary?: string; // AI-generated summary
}

export interface UploadedDocument {
	id: string;
	name: string;
	type: string;
	size: number;
	content: string;
	chunks: DocumentChunk[];
	metadata: DocumentMetadata;
	uploadedAt: Date;
	isLoaded: boolean; // for lazy loading
	isProcessing: boolean; // for progress tracking
	progress: number; // 0-100 for upload/parsing progress
}

export interface BulkOperation {
	type: 'delete' | 'download' | 'activate';
	documentIds: string[];
}

interface DocumentCache {
	[documentId: string]: {
		content: string;
		chunks: DocumentChunk[];
		timestamp: number;
	};
}

interface DocumentState {
	documents: UploadedDocument[];
	activeDocument: UploadedDocument | null;
	isProcessing: boolean;
	selectedDocuments: Set<string>; // for bulk operations
	cache: DocumentCache;
	uploadProgress: { [documentId: string]: number };

	// Actions
	addDocument: (document: UploadedDocument) => void;
	removeDocument: (documentId: string) => void;
	removeDocuments: (documentIds: string[]) => void; // bulk delete
	setActiveDocument: (
		document: UploadedDocument | null
	) => void;
	setIsProcessing: (isProcessing: boolean) => void;
	updateDocumentProgress: (
		documentId: string,
		progress: number
	) => void;
	updateDocumentMetadata: (
		documentId: string,
		metadata: Partial<DocumentMetadata>
	) => void;

	// Selection actions for bulk operations
	toggleDocumentSelection: (documentId: string) => void;
	selectAllDocuments: () => void;
	clearSelection: () => void;

	// Caching actions
	cacheDocument: (
		documentId: string,
		content: string,
		chunks: DocumentChunk[]
	) => void;
	getCachedDocument: (documentId: string) => {
		content: string;
		chunks: DocumentChunk[];
	} | null;
	clearCache: () => void;

	// Lazy loading
	loadDocumentContent: (
		documentId: string
	) => Promise<void>;

	clearDocuments: () => void;
}

// Cache utilities
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_KEY = 'document-cache';

const loadCacheFromStorage = (): DocumentCache => {
	try {
		const cached = localStorage.getItem(CACHE_KEY);
		if (cached) {
			const cache = JSON.parse(cached);
			// Clean expired entries
			const now = Date.now();
			const cleanCache: DocumentCache = {};

			Object.entries(
				cache as Record<
					string,
					{
						content: string;
						chunks: DocumentChunk[];
						timestamp: number;
					}
				>
			).forEach(([id, data]) => {
				if (now - data.timestamp < CACHE_EXPIRY) {
					cleanCache[id] = data;
				}
			});

			return cleanCache;
		}
	} catch (error) {
		// Failed to load document cache - silently ignore
	}
	return {};
};

const saveCacheToStorage = (cache: DocumentCache) => {
	try {
		localStorage.setItem(
			CACHE_KEY,
			JSON.stringify(cache)
		);
	} catch (error) {
		// Failed to save document cache - silently ignore
	}
};

export const useDocumentStore = create<DocumentState>()(
	devtools(
		persist(
			(set, get) => ({
				documents: [],
				activeDocument: null,
				isProcessing: false,
				selectedDocuments: new Set(),
				cache: loadCacheFromStorage(),
				uploadProgress: {},

				addDocument: (document) =>
					set((state) => ({
						documents: [
							...state.documents,
							document,
						],
						activeDocument: document,
					})),

				removeDocument: (documentId) =>
					set((state) => {
						const newSelectedDocuments =
							new Set(
								state.selectedDocuments
							);
						newSelectedDocuments.delete(
							documentId
						);

						return {
							documents:
								state.documents.filter(
									(doc) =>
										doc.id !==
										documentId
								),
							activeDocument:
								state.activeDocument?.id ===
								documentId
									? null
									: state.activeDocument,
							selectedDocuments:
								newSelectedDocuments,
						};
					}),

				removeDocuments: (documentIds) =>
					set((state) => {
						const idsToRemove = new Set(
							documentIds
						);
						const newSelectedDocuments =
							new Set(
								[
									...state.selectedDocuments,
								].filter(
									(id) =>
										!idsToRemove.has(id)
								)
							);

						return {
							documents:
								state.documents.filter(
									(doc) =>
										!idsToRemove.has(
											doc.id
										)
								),
							activeDocument:
								state.activeDocument &&
								idsToRemove.has(
									state.activeDocument.id
								)
									? null
									: state.activeDocument,
							selectedDocuments:
								newSelectedDocuments,
						};
					}),

				setActiveDocument: (document) => {
					set({ activeDocument: document });

					// Update last accessed time
					if (document) {
						get().updateDocumentMetadata(
							document.id,
							{
								lastAccessed: new Date(),
							}
						);
					}
				},

				setIsProcessing: (isProcessing) =>
					set({ isProcessing }),

				updateDocumentProgress: (
					documentId,
					progress
				) =>
					set((state) => ({
						uploadProgress: {
							...state.uploadProgress,
							[documentId]: progress,
						},
						documents: state.documents.map(
							(doc) =>
								doc.id === documentId
									? {
											...doc,
											progress,
											isProcessing:
												progress <
												100,
									  }
									: doc
						),
					})),

				updateDocumentMetadata: (
					documentId,
					metadata
				) =>
					set((state) => ({
						documents: state.documents.map(
							(doc) =>
								doc.id === documentId
									? {
											...doc,
											metadata: {
												...doc.metadata,
												...metadata,
											},
									  }
									: doc
						),
					})),

				// Selection methods
				toggleDocumentSelection: (documentId) =>
					set((state) => {
						const newSelection = new Set(
							state.selectedDocuments
						);
						if (newSelection.has(documentId)) {
							newSelection.delete(documentId);
						} else {
							newSelection.add(documentId);
						}
						return {
							selectedDocuments: newSelection,
						};
					}),

				selectAllDocuments: () =>
					set((state) => ({
						selectedDocuments: new Set(
							state.documents.map(
								(doc) => doc.id
							)
						),
					})),

				clearSelection: () =>
					set({ selectedDocuments: new Set() }),

				// Caching methods
				cacheDocument: (
					documentId,
					content,
					chunks
				) => {
					const state = get();
					const newCache = {
						...state.cache,
						[documentId]: {
							content,
							chunks,
							timestamp: Date.now(),
						},
					};

					set({ cache: newCache });
					saveCacheToStorage(newCache);
				},

				getCachedDocument: (documentId) => {
					const state = get();
					const cached = state.cache[documentId];

					if (
						cached &&
						Date.now() - cached.timestamp <
							CACHE_EXPIRY
					) {
						return {
							content: cached.content,
							chunks: cached.chunks,
						};
					}

					return null;
				},

				clearCache: () => {
					set({ cache: {} });
					localStorage.removeItem(CACHE_KEY);
				},

				// Lazy loading
				loadDocumentContent: async (documentId) => {
					const state = get();
					const document = state.documents.find(
						(doc) => doc.id === documentId
					);

					if (!document || document.isLoaded) {
						return;
					}

					// Check cache first
					const cached =
						get().getCachedDocument(documentId);
					if (cached) {
						set((state) => ({
							documents: state.documents.map(
								(doc) =>
									doc.id === documentId
										? {
												...doc,
												content:
													cached.content,
												chunks: cached.chunks,
												isLoaded:
													true,
										  }
										: doc
							),
						}));
						return;
					}

					// If not cached, content should already be loaded
					// This is for future implementation of true lazy loading
					set((state) => ({
						documents: state.documents.map(
							(doc) =>
								doc.id === documentId
									? {
											...doc,
											isLoaded: true,
									  }
									: doc
						),
					}));
				},

				clearDocuments: () =>
					set({
						documents: [],
						activeDocument: null,
						selectedDocuments: new Set(),
						uploadProgress: {},
					}),
			}),
			{
				name: 'document-store',
				partialize: (state) => ({
					documents: state.documents.map(
						(doc) => ({
							...doc,
							// Don't persist large content in main store, use cache instead
							content:
								doc.content.length > 1000
									? ''
									: doc.content,
							chunks: [],
						})
					),
					activeDocument: state.activeDocument
						? {
								...state.activeDocument,
								content:
									state.activeDocument
										.content.length >
									1000
										? ''
										: state
												.activeDocument
												.content,
								chunks: [],
						  }
						: null,
				}),
			}
		)
	)
);

// Selectors
export const useDocuments = () =>
	useDocumentStore((state) => state.documents);

export const useActiveDocument = () =>
	useDocumentStore((state) => state.activeDocument);

export const useIsProcessing = () =>
	useDocumentStore((state) => state.isProcessing);

export const useSelectedDocuments = () =>
	useDocumentStore((state) => state.selectedDocuments);

export const useUploadProgress = () =>
	useDocumentStore((state) => state.uploadProgress);
