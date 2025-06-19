import type { UploadedDocument } from '../stores/documentStore';

export interface WorkerProgress {
	progress: number;
	message: string;
}

export interface WorkerResult {
	document: UploadedDocument;
}

export interface WorkerError {
	error: string;
}

export type WorkerCallback = {
	onProgress?: (progress: WorkerProgress) => void;
	onComplete?: (result: WorkerResult) => void;
	onError?: (error: WorkerError) => void;
};

class DocumentWorkerManager {
	private worker: Worker | null = null;
	private callbacks: WorkerCallback = {};
	private currentFile: File | null = null;
	private currentDocumentId: string | null = null;

	constructor() {
		this.initializeWorker();
	}

	private initializeWorker() {
		try {
			this.worker = new Worker('/documentWorker.js');
			this.worker.onmessage =
				this.handleWorkerMessage.bind(this);
			this.worker.onerror =
				this.handleWorkerError.bind(this);
		} catch {
			console.warn(
				'Web Worker not supported, falling back to main thread processing'
			);
		}
	}

	private handleWorkerMessage(e: MessageEvent) {
		const { type, ...data } = e.data;

		switch (type) {
			case 'progress':
				this.callbacks.onProgress?.(
					data as WorkerProgress
				);
				break;

			case 'parseComplete':
				this.callbacks.onComplete?.(
					data as WorkerResult
				);
				break;

			case 'error': {
				const errorData = data as WorkerError;
				// Check if this needs main thread processing
				if (
					errorData.error ===
						'PDF_MAIN_THREAD_REQUIRED' ||
					errorData.error ===
						'DOCX_MAIN_THREAD_REQUIRED'
				) {
					// Fall back to main thread processing
					this.handleMainThreadFallback();
				} else {
					this.callbacks.onError?.(errorData);
				}
				break;
			}

			default:
			// Unknown worker message type - silently ignore
		}
	}

	private handleWorkerError(error: ErrorEvent) {
		this.callbacks.onError?.({
			error: error.message || 'Worker error occurred',
		});
	}

	private handleMainThreadFallback() {
		// When document processing fails in worker, fall back to main thread
		if (this.currentFile && this.currentDocumentId) {
			this.processDocumentMainThread(
				this.currentFile,
				this.currentDocumentId,
				this.callbacks
			)
				.then((document) => {
					this.callbacks.onComplete?.({
						document,
					});
				})
				.catch((error) => {
					this.callbacks.onError?.({
						error:
							error.message ||
							'Failed to process document',
					});
				});
		}
	}

	public processDocument(
		file: File,
		documentId: string,
		callbacks: WorkerCallback
	): Promise<UploadedDocument> {
		// Store current processing context for fallback
		this.currentFile = file;
		this.currentDocumentId = documentId;

		return new Promise((resolve, reject) => {
			this.callbacks = {
				...callbacks,
				onComplete: (result) => {
					// Clear context after completion
					this.currentFile = null;
					this.currentDocumentId = null;
					callbacks.onComplete?.(result);
					resolve(result.document);
				},
				onError: (error) => {
					// Clear context after error
					this.currentFile = null;
					this.currentDocumentId = null;
					callbacks.onError?.(error);
					reject(new Error(error.error));
				},
			};

			if (this.worker) {
				// Use web worker for processing
				this.worker.postMessage({
					type: 'parseDocument',
					data: { file, documentId },
				});
			} else {
				// Fallback to main thread processing
				this.processDocumentMainThread(
					file,
					documentId,
					callbacks
				)
					.then(resolve)
					.catch(reject);
			}
		});
	}

	public generateSummary(
		content: string,
		documentId: string,
		callbacks: WorkerCallback
	): Promise<string> {
		return new Promise((resolve, reject) => {
			if (this.worker) {
				const summaryCallbacks = {
					...callbacks,
					onComplete: undefined, // Override to handle summary-specific response
				};

				// Set up one-time listener for summary completion
				const originalOnMessage =
					this.worker.onmessage;
				this.worker.onmessage = (e) => {
					if (e.data.type === 'summaryComplete') {
						resolve(e.data.summary);
						this.worker!.onmessage =
							originalOnMessage; // Restore original handler
					} else {
						originalOnMessage?.call(
							this.worker!,
							e
						);
					}
				};

				this.callbacks = summaryCallbacks;
				this.worker.postMessage({
					type: 'generateSummary',
					data: { content, documentId },
				});
			} else {
				// Fallback summary generation
				this.generateSummaryMainThread(content)
					.then(resolve)
					.catch(reject);
			}
		});
	}

	// Fallback processing in main thread (simplified)
	private async processDocumentMainThread(
		file: File,
		documentId: string,
		callbacks: WorkerCallback
	): Promise<UploadedDocument> {
		const { parseDocument } = await import(
			'./documentParser'
		);
		const { createDocumentChunks } = await import(
			'./documentChunking'
		);

		callbacks.onProgress?.({
			progress: 10,
			message: 'Starting document processing...',
		});

		const startTime = Date.now();
		const content = await parseDocument(file);

		callbacks.onProgress?.({
			progress: 50,
			message:
				'Document parsed, processing content...',
		});

		const parseTime = Date.now() - startTime;
		const words = content
			.trim()
			.split(/\s+/)
			.filter((word) => word.length > 0);
		const preview =
			content.trim().slice(0, 200) +
			(content.length > 200 ? '...' : '');

		callbacks.onProgress?.({
			progress: 70,
			message: 'Creating document chunks...',
		});

		const chunks = createDocumentChunks(
			content,
			documentId
		);

		callbacks.onProgress?.({
			progress: 85,
			message: 'Generating summary...',
		});

		const summary =
			await this.generateSummaryMainThread(content);

		callbacks.onProgress?.({
			progress: 100,
			message: 'Document processing complete!',
		});

		const document: UploadedDocument = {
			id: documentId,
			name: file.name,
			type: file.type || 'unknown',
			size: file.size,
			content,
			chunks,
			metadata: {
				wordCount: words.length,
				characterCount: content.length,
				uploadTime: new Date(),
				lastAccessed: new Date(),
				parseTime,
				preview,
				summary,
			},
			uploadedAt: new Date(),
			isLoaded: true,
			isProcessing: false,
			progress: 100,
		};

		return document;
	}

	private async generateSummaryMainThread(
		content: string
	): Promise<string> {
		// Simple extractive summary
		const sentences = content
			.split(/[.!?]+/)
			.filter((s) => s.trim().length > 20);
		const summary = sentences
			.slice(0, 3)
			.join('. ')
			.trim();
		return summary + (summary ? '.' : '');
	}

	public terminate() {
		if (this.worker) {
			this.worker.terminate();
			this.worker = null;
		}
	}

	public isWorkerSupported(): boolean {
		return this.worker !== null;
	}
}

// Export singleton instance
export const documentWorkerManager =
	new DocumentWorkerManager();
