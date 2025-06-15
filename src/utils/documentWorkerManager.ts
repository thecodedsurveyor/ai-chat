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

			case 'error':
				this.callbacks.onError?.(
					data as WorkerError
				);
				break;

			default:
				console.warn(
					'Unknown worker message type:',
					type
				);
		}
	}

	private handleWorkerError(error: ErrorEvent) {
		console.error('Worker error:', error);
		this.callbacks.onError?.({
			error: error.message || 'Worker error occurred',
		});
	}

	public processDocument(
		file: File,
		documentId: string,
		callbacks: WorkerCallback
	): Promise<UploadedDocument> {
		return new Promise((resolve, reject) => {
			this.callbacks = {
				...callbacks,
				onComplete: (result) => {
					callbacks.onComplete?.(result);
					resolve(result.document);
				},
				onError: (error) => {
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

		try {
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
				await this.generateSummaryMainThread(
					content
				);

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
		} catch (error) {
			throw error;
		}
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
