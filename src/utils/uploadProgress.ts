export type ProgressCallback = (progress: number) => void;

/**
 * Upload with progress tracking
 */
export const uploadWithProgress = async (
	url: string,
	formData: FormData,
	headers: Record<string, string>,
	onProgress?: ProgressCallback
): Promise<Response> => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();

		// Track upload progress
		if (onProgress) {
			xhr.upload.addEventListener(
				'progress',
				(event) => {
					if (event.lengthComputable) {
						const progress =
							(event.loaded / event.total) *
							100;
						onProgress(Math.round(progress));
					}
				}
			);
		}

		// Handle completion
		xhr.addEventListener('load', () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				// Create a Response-like object
				const response = new Response(
					xhr.responseText,
					{
						status: xhr.status,
						statusText: xhr.statusText,
						headers: new Headers(),
					}
				);
				resolve(response);
			} else {
				reject(
					new Error(
						`HTTP ${xhr.status}: ${xhr.statusText}`
					)
				);
			}
		});

		// Handle errors
		xhr.addEventListener('error', () => {
			reject(new Error('Upload failed'));
		});

		// Handle timeout
		xhr.addEventListener('timeout', () => {
			reject(new Error('Upload timeout'));
		});

		// Configure request
		xhr.open('POST', url);
		xhr.timeout = 30000; // 30 second timeout

		// Set headers
		Object.entries(headers).forEach(([key, value]) => {
			xhr.setRequestHeader(key, value);
		});

		// Start upload
		xhr.send(formData);
	});
};

/**
 * Retry upload with exponential backoff
 */
export const uploadWithRetry = async (
	uploadFn: () => Promise<Response>,
	maxRetries: number = 3,
	baseDelay: number = 1000
): Promise<Response> => {
	let lastError: Error;

	for (
		let attempt = 0;
		attempt <= maxRetries;
		attempt++
	) {
		try {
			return await uploadFn();
		} catch (error) {
			lastError = error as Error;

			if (attempt === maxRetries) {
				throw lastError;
			}

			// Exponential backoff
			const delay = baseDelay * Math.pow(2, attempt);
			await new Promise((resolve) =>
				setTimeout(resolve, delay)
			);
		}
	}

	throw lastError!;
};
