import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface UploadedDocument {
	id: string;
	name: string;
	type: string;
	size: number;
	content: string;
	uploadedAt: Date;
}

interface DocumentState {
	documents: UploadedDocument[];
	activeDocument: UploadedDocument | null;
	isProcessing: boolean;

	// Actions
	addDocument: (document: UploadedDocument) => void;
	removeDocument: (documentId: string) => void;
	setActiveDocument: (document: UploadedDocument | null) => void;
	setIsProcessing: (isProcessing: boolean) => void;
	clearDocuments: () => void;
}

export const useDocumentStore = create<DocumentState>()(
	devtools(
		persist(
			(set) => ({
				documents: [],
				activeDocument: null,
				isProcessing: false,

				addDocument: (document) =>
					set((state) => ({
						documents: [...state.documents, document],
						activeDocument: document,
					})),

				removeDocument: (documentId) =>
					set((state) => ({
						documents: state.documents.filter(
							(doc) => doc.id !== documentId
						),
						activeDocument:
							state.activeDocument?.id === documentId
								? null
								: state.activeDocument,
					})),

				setActiveDocument: (document) =>
					set({ activeDocument: document }),

				setIsProcessing: (isProcessing) =>
					set({ isProcessing }),

				clearDocuments: () =>
					set({
						documents: [],
						activeDocument: null,
					}),
			}),
			{
				name: 'document-store',
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